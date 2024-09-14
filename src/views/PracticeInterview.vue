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
          <!-- Job Category Dropdown -->
          <div
            ref="categoryDropdownRef"
            class="relative bg-white border border-gray-300 rounded-md shadow-sm mb-4"
            tabindex="0"
            @blur="handleCategoryBlur"
          >
            <div
              class="flex items-center justify-between w-full px-4 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @click="toggleCategoryExpanded"
            >
              <span>{{ selectedCategory ? selectedCategory : 'Select a job category' }}</span>
              <svg
                class="w-5 h-5 text-gray-400 transition-transform duration-300"
                :class="{ 'transform rotate-180': isCategoryExpanded }"
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
              class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
              :style="{
                maxHeight: isCategoryExpanded ? '40vh' : '40px',
                opacity: isCategoryExpanded ? 1 : 0,
                visibility: isCategoryExpanded ? 'visible' : 'hidden',
              }"
            >
              <ul class="py-1 max-h-[40vh] overflow-y-auto">
                <li
                  v-for="category in jobCategories"
                  :key="category"
                  class="px-4 py-2 text-gray-900 cursor-pointer hover:bg-blue-100 transition duration-150 ease-in-out"
                  :class="{ 'bg-blue-100': category === selectedCategory }"
                  @click="selectCategory(category)"
                >
                  {{ category }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Job Title Dropdown (visible only when a category is selected) -->
          <div
            v-if="selectedCategory"
            ref="jobTitleDropdownRef"
            class="relative bg-white border border-gray-300 rounded-md shadow-sm"
            tabindex="0"
            @blur="handleJobTitleBlur"
          >
            <div
              v-if="!isOtherSelected"
              class="flex items-center justify-between w-full px-4 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @click="toggleJobTitleExpanded"
            >
              <span>{{ selectedJobTitle ? selectedJobTitle : 'Select a job title' }}</span>
              <svg
                class="w-5 h-5 text-gray-400 transition-transform duration-300"
                :class="{ 'transform rotate-180': isJobTitleExpanded }"
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
              >
              <svg
                class="w-5 h-5 text-gray-400 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                @click="clearCustomJobTitle"
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
                maxHeight: isJobTitleExpanded ? '40vh' : '40px',
                opacity: isJobTitleExpanded ? 1 : 0,
                visibility: isJobTitleExpanded ? 'visible' : 'hidden',
              }"
            >
              <ul class="py-1 max-h-[40vh] overflow-y-auto">
                <li
                  v-for="jobTitleInCategory in jobTitlesForCategory"
                  :key="jobTitleInCategory"
                  class="px-4 py-2 text-gray-900 cursor-pointer hover:bg-blue-100 transition duration-150 ease-in-out"
                  :class="{ 'bg-blue-100': jobTitleInCategory === selectedJobTitle }"
                  @click="selectJobTitle(jobTitleInCategory)"
                >
                  {{ jobTitleInCategory }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <button
          class="w-full mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="!selectedJobTitle"
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
            Question {{ currentQuestion.id + 1 }}
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
            @click="submitAnswer(selectedCategory as JobCategory)"
          >
            {{ isLoading ? 'Analyzing...' : 'Submit Answer' }}
          </button>
          <button
            :disabled="isLoading"
            class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            @click="skipQuestion(selectedCategory as JobCategory)"
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
          Loading...
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
import { JobCategory, JobTitles } from '@/types/JobTitles';
import { createClient } from '@supabase/supabase-js'
import { Questions } from '@/types/Questions';
import { useToast } from '@/composables/useToast';
import { FunctionsHttpError } from '@supabase/supabase-js'

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY

const router = useRouter();
const interviewStore = useInterviewStore();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const jobTitle = ref('');
const currentQuestion = ref<{ question: string; id: number } | null>(null);
const userAnswer = ref('');
const isLoading = ref(false);
const feedback = ref('');

let questionCount = 0;

const isListening = ref(false);
let recognition: SpeechRecognition | null = null;

const { showToast } = useToast();

const isCategoryExpanded = ref(false);
const isJobTitleExpanded = ref(false);
const selectedCategory = ref<JobCategory | null>(null);
const selectedJobTitle = ref<string | null>(null);
const isOtherSelected = ref(false);
const customJobTitle = ref('');

const categoryDropdownRef = ref<HTMLDivElement | null>(null);
const jobTitleDropdownRef = ref<HTMLDivElement | null>(null);

const questions = ref<Map<string, string>>();

const jobCategories = computed(() => Object.values(JobCategory));

const jobTitlesForCategory = computed(() => {
  if (selectedCategory.value) {
    return JobTitles[selectedCategory.value];
  }
  return [];
});

function toggleCategoryExpanded() {
  isCategoryExpanded.value = !isCategoryExpanded.value;
  isJobTitleExpanded.value = false; // Close job title dropdown when opening category dropdown
}

function toggleJobTitleExpanded() {
  if (!isOtherSelected.value) {
    isJobTitleExpanded.value = !isJobTitleExpanded.value;
  }
}

function selectCategory(category: JobCategory) {
  selectedCategory.value = category;
  selectedJobTitle.value = null;
  isCategoryExpanded.value = false;
}

function selectJobTitle(jobTitle: string) {
  selectedJobTitle.value = jobTitle;
  isJobTitleExpanded.value = false;
  if (jobTitle === 'Other') {
    isOtherSelected.value = true;
    customJobTitle.value = '';
  } else {
    isOtherSelected.value = false;
  }
}

function setCustomJobTitle() {
  if (customJobTitle.value.trim()) {
    selectedJobTitle.value = customJobTitle.value.trim();
    isOtherSelected.value = false;
  }
}

function clearCustomJobTitle() {
  customJobTitle.value = '';
  selectedJobTitle.value = null;
  isOtherSelected.value = false;
}

async function setJobTitle() {
  if (selectedJobTitle.value) {
    jobTitle.value = selectedJobTitle.value;
    
    try {
      const { data, error } = await supabase.functions.invoke('insert-job-title', {
        body: { jobTitle: selectedJobTitle.value },
      });

      if (error) throw error;
      
      console.log('Job title inserted successfully:', data);
      questions.value = await insertJobQuestions(data.data[0].id, getQuestionsForCategory(selectedCategory.value as JobCategory));
      generateNextQuestion(selectedCategory.value as JobCategory);
    } catch (error) {
      console.error('Error inserting job title:', error);
      
      if (error instanceof FunctionsHttpError) {
        // Handle specific FunctionsHttpError
        if (error.context?.status === 400) {
          showToast('Error inserting job title. Please refer to Job Hub to see if you have already answered questions for this job.', 'error');
        } else {
          showToast(`Server error: ${error.message}`, 'error');
        }
      } else {
        // Handle other types of errors
        showToast('An unexpected error occurred. Please try again.', 'error');
      }
      
      // Reset the job title selection
      jobTitle.value = '';
      selectedJobTitle.value = null;
    }
  }
}

onMounted(() => {
  initializeSpeechRecognition();
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  if (recognition) {
    recognition.stop();
  }
  window.removeEventListener('keydown', handleKeydown);
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

function getQuestionsForCategory(category: JobCategory): string[] {
  if (category in Questions) {
    const questions = Questions[category];
    return questions;
  } else {
    console.warn(`No questions found for category: ${category}`);
    return [];
  }
}

async function insertJobQuestions(jobTitleId: string, questions: string[]): Promise<Map<string, string> | undefined> {
  const insertedQuestions = new Map<string, string>();
  for (const question of questions) {
    try {
      const { data, error } = await supabase.functions.invoke('insert-job-question', {
        body: { jobTitleId, question },
      });

      if (error) throw error;
      console.log('Job question inserted successfully:', data);
      insertedQuestions.set(data.data[0].id, data.data[0].question);
    } catch (error) {
      console.error('Error inserting job question:', error);
      showToast(`Error inserting question: ${question}. Please try again later.`, 'error');
    }
  }

  return insertedQuestions;
}

async function generateNextQuestion(category: JobCategory) {
  isLoading.value = false;
  
  const questions = getQuestionsForCategory(category);
  
  currentQuestion.value = { question: questions[questionCount], id: questionCount };

  questionCount++;
}

async function skipQuestion(category: JobCategory) {
  if (isListening.value) {
    toggleListening(); // Stop listening if it's active
  }
  
  userAnswer.value = '';

  if (questionCount < getQuestionsForCategory(category).length) {
    await generateNextQuestion(category);
  } else {
    currentQuestion.value = null;
    feedback.value = await getOverallFeedback(jobTitle.value);
  }  
}

async function submitAnswer(category: JobCategory) {
  if (currentQuestion.value && userAnswer.value) {
    let questionId = '';
    isLoading.value = true;
    
    if (isListening.value) {
      toggleListening(); // Stop listening if it's active
    }
    
    // Store the answer without feedback
    interviewStore.addAnswer(currentQuestion.value.id, userAnswer.value, '');
    console.log('Questions:', questions.value);
    if (questions.value) {
      for (const [key, value] of questions.value.entries()) {
        if (value === currentQuestion.value.question) {
          questionId = key;
        }
      }
    }

    if (questionId === '' || questionId === undefined) {
      console.error('Question ID not found for question:', currentQuestion.value.question);
      return;
    }

    console.log('questionId:', questionId);
    console.log('answer:', userAnswer.value);
    
    try {
      const { data, error } = await supabase.functions.invoke('insert-answer', {
        body: { questionId, answer: userAnswer.value },
      });

      if (error) throw error;
      console.log('Answer inserted successfully:', data);
    } catch (error) {
      console.error('Error inserting job question:', error);
      showToast(`Error inserting answer: ${userAnswer.value}. Please try again later.`, 'error');
    }
    
    userAnswer.value = '';

    if (questionCount < getQuestionsForCategory(category).length) {
      await generateNextQuestion(category);
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
    As an AI interview coach, review the following practice interview responses for a ${jobTitle} position and provide overall feedback. 
    Highlight strengths. Bluntly provide areas for improvement, and give 2-3 specific tips for the candidate to focus on for future interviews. 
    Be encouraging but honest.

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

function handleCategoryBlur(event: FocusEvent) {
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(event.relatedTarget as Node)) {
    isCategoryExpanded.value = false;
  }
}

function handleJobTitleBlur(event: FocusEvent) {
  if (jobTitleDropdownRef.value && !jobTitleDropdownRef.value.contains(event.relatedTarget as Node)) {
    isJobTitleExpanded.value = false;
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isCategoryExpanded.value = false;
    isJobTitleExpanded.value = false;
  }
}
</script><style scoped>
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


