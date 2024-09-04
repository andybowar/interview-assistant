<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="ion-padding">
        <ion-text color="dark">
          <h1 class="ion-text-center">
            Coding Challenge
          </h1>
          <p class="ion-text-center subtitle">
            Practice coding problems with AI assistance
          </p>
        </ion-text>
        
        <ion-card>
          <ion-card-header>
            <ion-card-title>Challenge Description</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-textarea
              v-model="challengeDescription"
              placeholder="Describe the coding challenge here"
              :rows="4"
            />
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Programming Language</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-select
              v-model="selectedLanguage"
              placeholder="Select language"
            >
              <ion-select-option
                v-for="lang in languages"
                :key="lang"
                :value="lang"
              >
                {{ lang }}
              </ion-select-option>
            </ion-select>
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
                :disabled="isLoading || !challengeDescription.trim()"
                @click="generateSolution"
              >
                {{ isLoading ? 'Generating...' : 'Get Solution' }}
              </ion-button>
            </ion-col>
            <ion-col
              size="12"
              size-md="6"
            >
              <ion-button
                expand="block"
                class="custom-button"
                @click="clearAll"
              >
                Clear All
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-card
          v-if="solution"
          class="solution-card"
        >
          <ion-card-header>
            <ion-card-title>Suggested Solution</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <pre><code>{{ solution }}</code></pre>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonContent, IonText, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonTextarea, IonButton, IonSelect, IonSelectOption } from '@ionic/vue';
import { generateResponse } from '@/services/openai';

const challengeDescription = ref('');
const solution = ref('');
const isLoading = ref(false);
const selectedLanguage = ref('Python');

const languages = [
  'Python',
  'JavaScript',
  'TypeScript',
  'Java',
  'C++',
  'C#',
  'Ruby',
  'Go',
  'Swift',
  'Kotlin'
];

async function generateSolution() {
  if (!challengeDescription.value.trim()) return;

  isLoading.value = true;
  const prompt = `
    You are an AI coding assistant. Please provide a solution to the following coding challenge in ${selectedLanguage.value}:

    ${challengeDescription.value}

    Please provide a clear and efficient solution, with comments explaining the key parts of the code. 
    Use best practices and consider edge cases.
    
    Solution in ${selectedLanguage.value}:
  `;

  try {
    const response = await generateResponse(prompt);
    solution.value = response;
  } catch (error) {
    console.error('Error generating solution:', error);
    solution.value = "Sorry, there was an error generating a solution. Please try again.";
  } finally {
    isLoading.value = false;
  }
}

function clearAll() {
  challengeDescription.value = '';
  solution.value = '';
  selectedLanguage.value = 'Python';
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

.solution-card {
  margin-top: 2rem;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 8px;
}

ion-select {
  width: 100%;
  max-width: 100%;
  --padding-start: 16px;
  --padding-end: 16px;
}
</style>