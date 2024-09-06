<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center text-gray-900 mb-2">
        Real Interview Assistance
      </h1>
      <p class="text-xl text-center text-gray-600 mb-8">
        Get real-time support during your interview
      </p>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4">
          Interviewer's Question
        </h2>
        <input
          v-model="interviewerQuestion"
          type="text"
          placeholder="Type or use microphone"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @keyup.enter="getSuggestion"
        >
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="toggleListening"
        >
          <svg
            v-if="isListening"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
              clip-rule="evenodd"
            />
          </svg>
          {{ isListening ? 'Stop Listening' : 'Use Microphone' }}
        </button>
        <button
          :disabled="isLoading || isListening"
          class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          @click="getSuggestion"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
          {{ isLoading ? 'Generating...' : 'Get Answer Suggestion' }}
        </button>
      </div>

      <div
        v-if="suggestion"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <h2 class="text-2xl font-semibold mb-4">
          Suggested Answer
        </h2>
        <p class="text-gray-700 whitespace-pre-line">
          {{ suggestion }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
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

    Please provide a suggested answer that incorporates relevant information from the practice answers while being tailored to the current question. 
    The answer should be concise, professional, and demonstrate the candidate's strengths. 
    It should be formatted as bullet points.
    It should make no reference to the practice interview or the interviewer. 
    If there's no directly relevant information from the practice answers, provide a general suggestion based on common interview best practices.
  `;

  try {
    const response = await generateResponse(prompt);
    suggestion.value = response;
  } catch (error) {
    console.error('Error generating suggestion:', error);
    if (error instanceof Error) {
      suggestion.value = `Sorry, there was an error generating a suggestion: ${error.message}. Please try again.`;
    } else {
      suggestion.value = "Sorry, there was an unknown error generating a suggestion. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
}
</script>