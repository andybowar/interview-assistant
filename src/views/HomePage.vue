<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">
          AI Interview Assistant
        </h1>
        <button
          v-if="isAuthenticated"
          class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          @click="signOut"
        >
          Sign Out
        </button>
      </div>
    </header>
    <main class="flex-1">
      <section class="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-purple-50 to-white">
        <div class="container px-4 md:px-6">
          <div class="flex flex-col items-center space-y-4 text-center">
            <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8">
              Prepare for Your Dream Job
            </h1>
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
              <button
                class="h-32 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex flex-col items-center justify-center"
                @click="navigateTo('PracticeInterview')"
              >
                <Video class="w-8 h-8 mb-2" />
                <span>Practice Interview</span>
              </button>
              <button
                class="h-32 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg flex flex-col items-center justify-center"
                @click="navigateTo('RealInterview')"
              >
                <Users class="w-8 h-8 mb-2" />
                <span>Real Interview</span>
              </button>
              <button
                class="h-32 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg flex flex-col items-center justify-center"
                @click="navigateTo('CodingChallenge')"
              >
                <Code class="w-8 h-8 mb-2" />
                <span>Coding Challenge</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useSupabase } from '@/composables/useSupabase';
import { Video, Users, Code } from 'lucide-vue-next'

const router = useRouter();
const { isAuthenticated } = useAuth();
const { supabase } = useSupabase();

function navigateTo(routeName: string) {
  router.push({ name: routeName });
}

async function signOut() {
  try {
    await supabase.auth.signOut();
    router.push({ name: 'Auth' });
  } catch (error) {
    console.error('Error signing out:', error);
  }
}
</script>