<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center text-gray-900 mb-2">
        Job Hub
      </h1>
      <p class="text-xl text-center text-gray-600 mb-8">
        Manage your job titles and interview questions
      </p>

      <!-- Job Titles Section -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4">
          Job Titles
        </h2>
        <ul class="space-y-4">
          <li
            v-for="(job, index) in jobs"
            :key="job.title"
            class="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
          >
            <div 
              class="flex items-center justify-between cursor-pointer"
              @click="toggleJobExpansion(index)"
            >
              <p class="text-lg font-medium text-gray-900">
                {{ job.title }}
              </p>
              <div class="flex items-center">
                <span class="text-sm text-gray-500 mr-2">
                  {{ job.questions.filter(q => q.answer).length }} / {{ job.questions.length }} Answered
                </span>
                <ChevronDownIcon
                  v-if="!job.expanded"
                  class="h-5 w-5 text-gray-400"
                />
                <ChevronUpIcon
                  v-else
                  class="h-5 w-5 text-gray-400"
                />
              </div>
            </div>
            <div
              v-if="job.expanded"
              class="mt-4 space-y-4"
            >
              <div
                v-for="question in job.questions"
                :key="question.id"
                class="bg-gray-50 rounded-md p-4"
              >
                <div 
                  class="flex justify-between items-center cursor-pointer"
                  @click="toggleQuestionExpansion(index, question.id)"
                >
                  <span class="text-sm text-gray-700">{{ question.text }}</span>
                  <div class="flex items-center">
                    <CheckCircleIcon
                      v-if="question.answer"
                      class="h-5 w-5 text-green-500 mr-2"
                    />
                    <XCircleIcon
                      v-else
                      class="h-5 w-5 text-red-500 mr-2"
                    />
                    <ChevronDownIcon
                      v-if="!question.expanded"
                      class="h-5 w-5 text-gray-400"
                    />
                    <ChevronUpIcon
                      v-else
                      class="h-5 w-5 text-gray-400"
                    />
                  </div>
                </div>
                <div
                  v-if="question.expanded"
                  class="mt-2"
                >
                  <textarea 
                    v-model="question.answer"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    :placeholder="question.answer ? '' : 'Type your answer here...'"
                  />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, XCircleIcon } from 'lucide-vue-next'

const user = ref({
  name: 'John Doe',
  email: 'john@example.com',
})

const jobs = ref([
  {
    title: 'Frontend Developer',
    expanded: false,
    questions: [
      { id: 1, text: 'What is the difference between let and const in JavaScript?', answer: '', expanded: false },
      { id: 2, text: 'Explain the concept of closures in JavaScript.', answer: 'A closure is...', expanded: false },
      { id: 3, text: 'What are the benefits of using Vue.js?', answer: '', expanded: false },
    ]
  },
  {
    title: 'Backend Developer',
    expanded: false,
    questions: [
      { id: 4, text: 'What is the difference between SQL and NoSQL databases?', answer: '', expanded: false },
      { id: 5, text: 'Explain RESTful API design principles.', answer: '', expanded: false },
      { id: 6, text: 'How do you handle authentication in a web application?', answer: 'Authentication can be handled...', expanded: false },
    ]
  },
  {
    title: 'Full Stack Developer',
    expanded: false,
    questions: [
      { id: 7, text: 'Describe the MERN stack.', answer: '', expanded: false },
      { id: 8, text: 'What are the advantages of server-side rendering?', answer: '', expanded: false },
      { id: 9, text: 'How would you optimize a web application for performance?', answer: 'To optimize a web application...', expanded: false },
    ]
  }
])

const toggleJobExpansion = (index: number) => {
  jobs.value[index].expanded = !jobs.value[index].expanded
}

const toggleQuestionExpansion = (jobIndex: number, questionId: number) => {
  const job = jobs.value[jobIndex]
  const question = job.questions.find(q => q.id === questionId)
  if (question) {
    question.expanded = !question.expanded
  }
}
</script>