<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center text-gray-900 mb-2">
        Settings
      </h1>
      <p class="text-xl text-center text-gray-600 mb-8">
        Manage your account and preferences
      </p>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4">
          Personal Information
        </h2>
        <form
          class="space-y-4"
          @submit.prevent="getUserInfo"
        >
          <div>
            <label
              for="firstName"
              class="block text-sm font-medium text-gray-700"
            >First Name</label>
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          <div>
            <label
              for="lastName"
              class="block text-sm font-medium text-gray-700"
            >Last Name</label>
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700"
            >Email Address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              disabled
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            >
          </div>
          <button
            type="submit"
            class="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Information
          </button>
        </form>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4">
          Subscription Status
        </h2>
        <div class="space-y-2">
          <p><strong>Trial Status:</strong> {{ isOnTrial ? 'Active' : 'Inactive' }}</p>
          <p v-if="isOnTrial">
            <strong>Days Remaining:</strong> {{ trialDaysRemaining }}
          </p>
          <p><strong>Subscription:</strong> {{ isSubscribed ? 'Active (Monthly)' : 'Inactive' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const isOnTrial = ref(false);
const trialDaysRemaining = ref(0);
const isSubscribed = ref(false);

onMounted(async () => {
  await fetchUserInfo();
});

async function fetchUserInfo() {
    const { data } = await supabase.functions.invoke('get-user-info', {});
    if (data) {
      console.log('data: ', data.data[0]);
      firstName.value = data.data[0].first_name || '';
      lastName.value = data.data[0].last_name || '';
      email.value = data.data[0].email_address || '';
      // TODO: Implement trial and subscription logic
      isOnTrial.value = false;
      trialDaysRemaining.value = 0;
      isSubscribed.value = false;
    }
  }

async function getUserInfo() {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('getUserInfo called');
    console.log('user: ', user);
  if (user) {
    const { error } = await supabase.functions.invoke('get-user-info', {
      body: { firstName: firstName.value, lastName: lastName.value },
    });

    if (error) {
      console.error('Error getting user info:', error);
      // TODO: Show error message to user
    } else {
      // TODO: Show success message to user
    }
  }
}
</script>