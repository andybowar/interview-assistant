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
          v-if="currentQuestion"
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
                placeholder="Type your answer here"
                :rows="6"
              />
            </ion-card-content>
          </ion-card>

          <ion-button
            expand="block"
            :disabled="isLoading"
            class="custom-button"
            @click="submitAnswer"
          >
            {{ isLoading ? 'Analyzing...' : 'Submit Answer' }}
          </ion-button>
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
import { ref, onMounted } from 'vue';
import { IonPage, IonContent, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonTextarea, IonButton, IonSpinner } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useInterviewStore } from '@/stores/interview';
import { generateResponse } from '@/services/openai';

const router = useRouter();
const interviewStore = useInterviewStore();

const currentQuestion = ref<{ question: string; id: number } | null>(null);
const userAnswer = ref('');
const isLoading = ref(false);
const feedback = ref('');

const questions = [
  { id: 1, question: "Tell me about yourself." },
  { id: 2, question: "What are your strengths?" },
  { id: 3, question: "What are your weaknesses?" },
  { id: 4, question: "Why do you want this job?" },
  { id: 5, question: "Where do you see yourself in 5 years?" },
];

let currentQuestionIndex = 0;

onMounted(() => {
  currentQuestion.value = questions[currentQuestionIndex];
});

async function submitAnswer() {
  if (currentQuestion.value && userAnswer.value) {
    isLoading.value = true;
    const answerFeedback = await getAnswerFeedback(currentQuestion.value.question, userAnswer.value);
    interviewStore.addAnswer(currentQuestion.value.id, userAnswer.value, answerFeedback);
    
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      currentQuestion.value = questions[currentQuestionIndex];
      userAnswer.value = '';
    } else {
      currentQuestion.value = null;
      feedback.value = await getOverallFeedback();
    }
    isLoading.value = false;
  }
}

async function getAnswerFeedback(question: string, answer: string): Promise<string> {
  const prompt = `
    As an AI interview coach, analyze the following answer to the interview question. Provide brief, constructive feedback on the strengths of the answer and areas for improvement. Be concise and specific.

    Question: "${question}"
    Answer: "${answer}"

    Feedback:
  `;

  try {
    return await generateResponse(prompt);
  } catch (error) {
    console.error('Error generating answer feedback:', error);
    return "Unable to generate feedback at this time.";
  }
}

async function getOverallFeedback(): Promise<string> {
  const allAnswers = interviewStore.getAnswers();
  const answersText = allAnswers.map(a => `Q: ${a.questionId}\nA: ${a.answer}\nFeedback: ${a.feedback}`).join('\n\n');

  const prompt = `
    As an AI interview coach, review the following practice interview responses and provide overall feedback. Highlight strengths, areas for improvement, and give 2-3 specific tips for the candidate to focus on for future interviews. Be encouraging but honest.

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
</style>