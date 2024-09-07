<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">
          AI Interview Assistant
        </h1>
        <button
          v-if="isAuthenticated"
          class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
          @click="signOut"
        >
          Sign Out
        </button>
      </div>
    </header>
    <main class="flex-1 flex flex-col">
      <section class="flex-1 w-full flex flex-col justify-center bg-gradient-to-b from-purple-50 to-white">
        <div class="container px-4 md:px-6 mx-auto">
          <div class="flex flex-col items-center space-y-4 text-center">
            <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8">
              Prepare for Your Dream Job
            </h1>
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
              <button
                class="gradient-button practice-interview h-32 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-white rounded-lg flex flex-col items-center justify-center overflow-hidden"
                @mousemove="updateGradient"
                @click="navigateTo('PracticeInterview')"
              >
                <Video class="h-8 w-8 mb-2 relative z-10" />
                <span class="relative z-10">Practice Interview</span>
              </button>
              <button
                class="gradient-button real-interview h-32 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-white rounded-lg flex flex-col items-center justify-center overflow-hidden"
                @mousemove="updateGradient"
                @click="navigateTo('RealInterview')"
              >
                <Users class="h-8 w-8 mb-2 relative z-10" />
                <span class="relative z-10">Real Interview</span>
              </button>
              <button
                class="gradient-button coding-challenge h-32 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-white rounded-lg flex flex-col items-center justify-center overflow-hidden"
                @mousemove="updateGradient"
                @click="navigateTo('CodingChallenge')"
              >
                <Code class="h-8 w-8 mb-2 relative z-10" />
                <span class="relative z-10">Coding Challenge</span>
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

const updateGradient = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLButtonElement;
  const rect = button.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const offsetX = ((x - centerX) / centerX) * 50;
  const offsetY = ((y - centerY) / centerY) * 50;
  button.style.setProperty('--x', `${50 + offsetX}%`);
  button.style.setProperty('--y', `${50 + offsetY}%`);
}
</script>

<style scoped>
.gradient-button {
  position: relative;
  isolation: isolate;
}

.gradient-button::before {
  content: '';
  position: absolute;
  inset: -300%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  mix-blend-mode: hard-light;
}

.gradient-button:hover::before {
  opacity: 1;
}

.practice-interview {
  --color-1: #2563EB;
  --color-2: #003487;
  --color-3: #60A5FA;
  --complement: #EB6025;
  background: linear-gradient(to bottom right, var(--color-2), var(--color-3));
}

.practice-interview::before {
  background: radial-gradient(
    circle 5000px at var(--x, 20%) var(--y, 20%),
    var(--complement),
    var(--color-1),
    transparent 60%
  );
}

.real-interview {
  --color-1: #059669;
  --color-2: #006744;
  --color-3: #86ffd0;
  --complement: #960531;
  background: linear-gradient(to bottom right, var(--color-2), var(--color-3));
}

.real-interview::before {
  background: radial-gradient(
    circle 5000px at var(--x, 20%) var(--y, 20%),
    var(--complement),
    var(--color-1),
    transparent 60%
  );
}

.coding-challenge {
  --color-1: #7C3AED;
  --color-2: #2b0486;
  --color-3: #A78BFA;
  --complement: #EDC13A;
  background: linear-gradient(to bottom right, var(--color-2), var(--color-3));
}

.coding-challenge::before {
  background: radial-gradient(
    circle 5000px at var(--x, 20%) var(--y, 20%),
    var(--complement),
    var(--color-1),
    transparent 60%
  );
}
</style>