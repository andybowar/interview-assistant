<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center text-gray-900 mb-2">
        Practice Interview
      </h1>
      <p class="text-xl text-center text-gray-600 mb-8">
        Hone your skills with AI-powered mock interviews
      </p>
      
      <div
        v-if="!jobTitle"
        class="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <h2 class="text-2xl font-semibold mb-4">
          Before we begin
        </h2>
        <p class="mb-4">
          What is the job title for which you are interviewing?
        </p>
        <div class="w-full max-w-sm mx-auto">
          <div class="relative bg-white border border-gray-300 rounded-md shadow-sm">
            <div
              v-if="!isOtherSelected"
              @click="toggleExpanded"
              class="flex items-center justify-between w-full px-4 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span>{{ selectedOption ? selectedOption.label : 'Select a job title' }}</span>
              <svg
                class="w-5 h-5 text-gray-400 transition-transform duration-300"
                :class="{ 'transform rotate-180': isExpanded }"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div
              v-else
              class="flex items-center justify-between w-full px-4 py-2 text-left"
            >
              <input
                v-model="customJobTitle"
                type="text"
                placeholder="Enter your job title"
                class="w-full focus:outline-none"
                @keyup.enter="setCustomJobTitle"
              />
              <svg
                @click="clearCustomJobTitle"
                class="w-5 h-5 text-gray-400 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div
              v-if="!isOtherSelected"
              class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
              :style="{
                maxHeight: isExpanded ? '40vh' : '40px',
                opacity: isExpanded ? 1 : 0,
                visibility: isExpanded ? 'visible' : 'hidden',
              }"
            >
              <ul class="py-1 max-h-[40vh] overflow-y-auto">
                <li
                  v-for="option in jobTitleOptions"
                  :key="option.value"
                  class="px-4 py-2 text-gray-900 cursor-pointer hover:bg-blue-100 transition duration-150 ease-in-out"
                  :class="{ 'bg-blue-100': option.value === selectedOption?.value }"
                  @click="selectOption(option)"
                >
                  {{ option.label }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <button
          class="w-full mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="!selectedOption"
          @click="setJobTitle"
        >
          Start Interview
        </button>
      </div>

      <div
        v-else-if="currentQuestion"
        class="space-y-6"
      >
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4">
            Question {{ currentQuestion.id }}
          </h2>
          <p class="text-gray-700">
            {{ currentQuestion.question }}
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4">
            Your Answer
          </h2>
          <textarea
            v-model="userAnswer"
            placeholder="Type your answer here or use the microphone"
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            @click="submitAnswer"
          >
            {{ isLoading ? 'Analyzing...' : 'Submit Answer' }}
          </button>
          <button
            :disabled="isLoading"
            class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            @click="skipQuestion"
          >
            Skip Question
          </button>
        </div>
      </div>

      <div
        v-else-if="feedback"
        class="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <h2 class="text-2xl font-semibold mb-4">
          Interview Complete!
        </h2>
        <p class="text-gray-700 whitespace-pre-line mb-6">
          {{ feedback }}
        </p>
        <button
          class="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="finishInterview"
        >
          Finish
        </button>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center h-64"
      >
        <svg
          class="animate-spin h-10 w-10 text-indigo-600 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p class="text-gray-600">
          Generating final feedback...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useInterviewStore } from '@/stores/interview';
import { generateResponse } from '@/services/openai';
import type { SpeechRecognition } from '@/types/SpeechRecognition';
import { JobTitle } from '@/types/JobTitles';

const router = useRouter();
const interviewStore = useInterviewStore();

const jobTitle = ref('');
const currentQuestion = ref<{ question: string; id: number } | null>(null);
const userAnswer = ref('');
const isLoading = ref(false);
const feedback = ref('');

let questionCount = 0;

const isListening = ref(false);
let recognition: SpeechRecognition | null = null;

const initialQuestion = "Tell me about some of your previous experience";

const isExpanded = ref(false);
const selectedOption = ref<{ value: string; label: string } | null>(null);
const isOtherSelected = ref(false);
const customJobTitle = ref('');

const jobTitleOptions = computed(() => 
  Object.entries(JobTitle).map(([key, value]) => ({
    value: key,
    label: value
  }))
);

function toggleExpanded() {
  if (!isOtherSelected.value) {
    isExpanded.value = !isExpanded.value;
  }
}

function selectOption(option: { value: string; label: string }) {
  selectedOption.value = option;
  isExpanded.value = false;
  if (option.value === 'Other') {
    isOtherSelected.value = true;
    customJobTitle.value = '';
  } else {
    isOtherSelected.value = false;
  }
}

function setCustomJobTitle() {
  if (customJobTitle.value.trim()) {
    selectedOption.value = { value: 'Other', label: customJobTitle.value.trim() };
    isOtherSelected.value = false;
  }
}

function clearCustomJobTitle() {
  customJobTitle.value = '';
  selectedOption.value = null;
  isOtherSelected.value = false;
}

function setJobTitle() {
  if (selectedOption.value) {
    jobTitle.value = selectedOption.value.label;
    setInitialQuestion();
  }
}

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
ul {
  scrollbar-width: thin;
  scrollbar-color: #4B5563 #E5E7EB;
}

ul::-webkit-scrollbar {
  width: 8px;
}

ul::-webkit-scrollbar-track {
  background: #E5E7EB;
}

ul::-webkit-scrollbar-thumb {
  background-color: #4B5563;
  border-radius: 20px;
  border: 2px solid #E5E7EB;
}
</style>