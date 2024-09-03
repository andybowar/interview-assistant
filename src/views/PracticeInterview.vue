<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="ion-padding">
        <ion-text color="dark">
          <h1 class="ion-text-center">
            Practice Interview
          </h1>
          <p class="ion-text-center subtitle">
            Hone your skills with AI-powered mock interviews
          </p>
        </ion-text>
        
        <div
          v-if="!jobTitle"
          class="job-title-container"
        >
          <ion-card>
            <ion-card-header>
              <ion-card-title>Before we begin</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>What is the job title for which you are interviewing?</p>
              <ion-input
                v-model="jobTitleInput"
                placeholder="Enter job title"
                @keyup.enter="setJobTitle"
              />
            </ion-card-content>
          </ion-card>
          <ion-button
            expand="block"
            class="custom-button"
            @click="setJobTitle"
          >
            Start Interview
          </ion-button>
        </div>

        <div
          v-else-if="currentQuestion"
          class="question-container"
        >
          <ion-card>
            <ion-card-header>
              <ion-card-title>Question {{ currentQuestion.id }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>{{ currentQuestion.question }}</p>
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-header>
              <ion-card-title>Your Answer</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-textarea
                v-model="userAnswer"
                placeholder="Type your answer here or use the microphone"
                :rows="6"
              />
            </ion-card-content>
          </ion-card>

          <ion-grid>
            <ion-row>
              <ion-col 
                size="12" 
                size-md="4"
              >
                <ion-button
                  expand="block"
                  class="custom-button"
                  @click="toggleListening"
                >
                  <ion-icon
                    :icon="isListening ? stopCircleOutline : micOutline"
                    aria-hidden="true"
                  />
                  {{ isListening ? 'Stop Listening' : 'Use Microphone' }}
                </ion-button>
              </ion-col>
              <ion-col 
                size="12" 
                size-md="4"
              >
                <ion-button
                  expand="block"
                  :disabled="isLoading || isListening"
                  class="custom-button"
                  @click="submitAnswer"
                >
                  {{ isLoading ? 'Analyzing...' : 'Submit Answer' }}
                </ion-button>
              </ion-col>
              <ion-col 
                size="12" 
                size-md="4"
              >
                <ion-button
                  expand="block"
                  :disabled="isLoading"
                  class="custom-button skip-button"
                  @click="skipQuestion"
                >
                  Skip Question
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

        <div
          v-else-if="feedback"
          class="feedback-container"
        >
          <ion-card>
            <ion-card-header>
              <ion-card-title>Interview Complete!</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>{{ feedback }}</p>
            </ion-card-content>
          </ion-card>

          <ion-button
            expand="block"
            class="custom-button"
            @click="finishInterview"
          >
            Finish
          </ion-button>
        </div>

        <div
          v-else
          class="loading-container"
        >
          <ion-spinner name="crescent" />
          <p>Generating final feedback...</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { IonPage, IonContent, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonTextarea, IonButton, IonSpinner, IonInput, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/vue';
import { micOutline, stopCircleOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useInterviewStore } from '@/stores/interview';
import { generateResponse } from '@/services/openai';
import type { SpeechRecognition } from '@/types/SpeechRecognition';

const router = useRouter();
const interviewStore = useInterviewStore();

const jobTitle = ref('');
const jobTitleInput = ref('');
const currentQuestion = ref<{ question: string; id: number } | null>(null);
const userAnswer = ref('');
const isLoading = ref(false);
const feedback = ref('');

let questionCount = 0;

const isListening = ref(false);
let recognition: SpeechRecognition | null = null;

const initialQuestion = "Tell me about some of your previous experience";

onMounted(() => {
  initializeSpeechRecognition();
});

onUnmounted(() => {
  if (recognition) {
    recognition.stop();
  }
});

function initializeSpeechRecognition() {
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognition = new SpeechRecognition() as SpeechRecognition;
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      userAnswer.value += ' ' + transcript;
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      isListening.value = false;
    };

    recognition.onend = () => {
      if (isListening.value) {
        recognition?.start(); // Restart if we're still supposed to be listening
      }
    };
  } else {
    console.error('Speech recognition not supported in this browser');
  }
}

function toggleListening() {
  if (recognition) {
    if (isListening.value) {
      recognition.stop();
      isListening.value = false;
    } else {
      recognition.start();
      isListening.value = true;
    }
  } else {
    console.error('Speech recognition not initialized');
  }
}

function setJobTitle() {
  if (jobTitleInput.value.trim()) {
    jobTitle.value = jobTitleInput.value.trim();
    setInitialQuestion();
  }
}

function setInitialQuestion() {
  questionCount = 1;
  currentQuestion.value = { question: initialQuestion, id: questionCount };
}

async function generateNextQuestion() {
  isLoading.value = true;
  questionCount++;

  const prompt = `
    As an AI interviewer for a ${jobTitle.value} position, generate the next interview question. 
    ${questionCount > 2 ? `The candidate's previous answer was: "${userAnswer.value}"` : ''}
    The question should be relevant to the job role and aim to assess the candidate's skills, experience, and fit for the position. 
    The question should be mostly unrelated to the previous question.
    Provide only the question text without any additional context or explanation.
  `;

  try {
    const response = await generateResponse(prompt);
    currentQuestion.value = { question: response, id: questionCount };
    userAnswer.value = '';
  } catch (error) {
    console.error('Error generating question:', error);
    currentQuestion.value = { question: "An error occurred while generating the question. Please try again.", id: questionCount };
  } finally {
    isLoading.value = false;
  }
}

async function skipQuestion() {
  if (isListening.value) {
    toggleListening(); // Stop listening if it's active
  }
  
  if (questionCount < 5) {
    if (questionCount === 1) {
      // If skipping the initial question, generate a new one
      await generateNextQuestion();
    } else {
      await generateNextQuestion();
    }
  } else {
    currentQuestion.value = null;
    feedback.value = await getOverallFeedback(jobTitle.value);
  }
}

async function submitAnswer() {
  if (currentQuestion.value && userAnswer.value) {
    isLoading.value = true;
    
    if (isListening.value) {
      toggleListening(); // Stop listening if it's active
    }
    
    // Store the answer without feedback
    interviewStore.addAnswer(currentQuestion.value.id, userAnswer.value, '');
    
    if (questionCount < 5) {  // Limit to 5 questions
      await generateNextQuestion();
    } else {
      currentQuestion.value = null;
      feedback.value = await getOverallFeedback(jobTitle.value);
    }
    isLoading.value = false;
  }
}

async function getOverallFeedback(jobTitle: string): Promise<string> {
  const allAnswers = interviewStore.getAnswers();
  const answersText = allAnswers.map(a => `Q${a.questionId}: ${a.answer}`).join('\n\n');

  const prompt = `
    As an AI interview coach, review the following practice interview responses for a ${jobTitle} position and provide overall feedback. Highlight strengths, areas for improvement, and give 2-3 specific tips for the candidate to focus on for future interviews. Be encouraging but honest.

    ${answersText}

    Overall Feedback:
  `;

  try {
    return await generateResponse(prompt);
  } catch (error) {
    console.error('Error generating overall feedback:', error);
    return "Unable to generate overall feedback at this time.";
  }
}

function finishInterview() {
  router.push('/');
}
</script>

<style scoped>
ion-content {
  --background: linear-gradient(180deg, #f4f5f8 0%, #e0e0e0 100%);
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--ion-color-medium);
  margin-bottom: 2rem;
}

ion-card {
  margin: 1rem 0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

ion-card-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.custom-button {
  --border-radius: 16px;
  margin: 1rem 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-container p {
  margin-top: 1rem;
  color: var(--ion-color-medium);
}

.job-title-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.skip-button {
  --background: var(--ion-color-medium);
  --color: var(--ion-color-light);
}
</style>