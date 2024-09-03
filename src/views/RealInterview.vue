<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="ion-padding">
        <ion-text color="dark">
          <h1 class="ion-text-center">
            Real Interview Assistance
          </h1>
          <p class="ion-text-center subtitle">
            Get real-time support during your interview
          </p>
        </ion-text>
        
        <ion-card>
          <ion-card-header>
            <ion-card-title>Interviewer's Question</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-input
              v-model="interviewerQuestion"
              placeholder="Type or use microphone"
              @keyup.enter="getSuggestion"
            />
          </ion-card-content>
        </ion-card>

        <ion-grid>
          <ion-row>
            <ion-col
              size="12"
              size-md="6"
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
              size-md="6"
            >
              <ion-button
                expand="block"
                :disabled="isLoading || isListening"
                class="custom-button"
                @click="getSuggestion"
              >
                <ion-icon
                  :icon="bulbOutline"
                  aria-hidden="true"
                />
                {{ isLoading ? 'Generating...' : 'Get Answer Suggestion' }}
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-card
          v-if="suggestion"
          class="suggestion-card"
        >
          <ion-card-header>
            <ion-card-title>Suggested Answer</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>{{ suggestion }}</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { IonPage, IonContent, IonText, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonButton, IonIcon } from '@ionic/vue';
import { micOutline, bulbOutline, stopCircleOutline } from 'ionicons/icons';
import { useInterviewStore } from '@/stores/interview';
import { generateResponse } from '@/services/openai';
import type { SpeechRecognition } from '@/types/SpeechRecognition';

const interviewStore = useInterviewStore();

const interviewerQuestion = ref('');
const suggestion = ref('');
const isLoading = ref(false);
const isListening = ref(false);

let recognition: SpeechRecognition | null = null;

const practiceAnswers = computed(() => {
  return interviewStore.getAnswers().map(answer => `Q: ${answer.questionId}\nA: ${answer.answer}\nFeedback: ${answer.feedback}`).join('\n\n');
});

onMounted(() => {
  interviewStore.loadAnswers();
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
    recognition.continuous = true; // Change this to true
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      interviewerQuestion.value += ' ' + transcript;
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
      // Automatically get suggestion when stopping listening
      getSuggestion();
    } else {
      recognition.start();
      isListening.value = true;
    }
  } else {
    console.error('Speech recognition not initialized');
  }
}

async function getSuggestion() {
  isLoading.value = true;
  const prompt = `
    You are an AI assistant helping a job candidate during an interview. The candidate has provided the following answers during a practice interview:

    ${practiceAnswers.value}

    Now, the interviewer has asked the following question:
    "${interviewerQuestion.value}"

    Please provide a suggested answer that incorporates relevant information from the practice answers while being tailored to the current question. The answer should be concise, professional, and demonstrate the candidate's strengths. The answer will also be spoken by the user so it should be in a natural, conversational tone. If there's no directly relevant information from the practice answers, provide a general suggestion based on common interview best practices.
  `;

  try {
    const response = await generateResponse(prompt);
    suggestion.value = response;
  } catch (error) {
    console.error('Error generating suggestion:', error);
    suggestion.value = "Sorry, there was an error generating a suggestion. Please try again.";
  } finally {
    isLoading.value = false;
  }
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
  margin: 0.5rem 0;
}

.suggestion-card {
  margin-top: 2rem;
}
</style>