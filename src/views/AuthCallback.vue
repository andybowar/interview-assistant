<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Authenticating...
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { checkAuth } = useAuth();

onMounted(async () => {
  try {
    await checkAuth();
    router.push('/home');
  } catch (error) {
    console.error('Error during authentication:', error);
    router.push('/auth');
  }
});
</script>