<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center text-gray-900 mb-2">
        Coding Challenge
      </h1>
      <p class="text-xl text-center text-gray-600 mb-8">
        Practice coding problems with AI assistance
      </p>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4">
          Challenge Description
        </h2>
        <textarea
          v-model="challengeDescription"
          placeholder="Describe the coding challenge here"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4">
          Programming Language
        </h2>
        <select
          v-model="selectedLanguage"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option
            v-for="lang in languages"
            :key="lang"
            :value="lang"
          >
            {{ lang }}
          </option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          :disabled="isLoading || !challengeDescription.trim()"
          class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          @click="generateSolution"
        >
          {{ isLoading ? 'Generating...' : 'Get Solution' }}
        </button>
        <button
          class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          @click="clearAll"
        >
          Clear All
        </button>
      </div>

      <div
        v-if="solution"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <h2 class="text-2xl font-semibold mb-4">
          Suggested Solution
        </h2>
        <pre><code>{{ solution }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 8px;
}
</style>