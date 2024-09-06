<template>
  <router-view />
  <Toast :toast="toast" />
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import Toast from '@/components/Toast.vue';

const { toast } = useToast();
</script>