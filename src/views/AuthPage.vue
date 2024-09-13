<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Welcome to InterviewPal
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <template v-if="!isLinkSent">
          <p class="text-sm text-gray-600 mb-6 text-center">
            Our sign-in process is smooth and easy. Simply enter your email address below, 
            whether you're a new user or returning. We'll send you a magic link for secure, 
            password-free access to your account.
          </p>
          <form
            class="space-y-6"
            @submit.prevent="handleSubmit"
          >
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue with Email
              </button>
            </div>
          </form>
        </template>
        <template v-else>
          <div class="text-center">
            <svg
              class="mx-auto h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">
              Check your email
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              We've sent a magic link to {{ email }}. Click the link in the email to log in.
            </p>
            <p class="mt-3 text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or
              <button
                class="text-indigo-600 hover:text-indigo-500 font-medium"
                @click="handleSubmit"
              >
                click here to resend
              </button>
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSupabase } from '@/composables/useSupabase';
import { useToast } from '@/composables/useToast';

const { supabase } = useSupabase();
const { showToast } = useToast();

const email = ref('');
const isLoading = ref(false);
const isLinkSent = ref(false);

async function handleSubmit() {
  if (!email.value) return;

  isLoading.value = true;

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    isLinkSent.value = true;
    showToast('Magic link sent to your email!', 'success');
  } catch (error) {
    showToast('Error sending magic link. Please try again.', 'error');
    console.error('Error:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>