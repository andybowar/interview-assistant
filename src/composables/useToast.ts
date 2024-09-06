import { ref, onUnmounted } from 'vue';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

export function useToast() {
  const toast = ref<Toast | null>(null);
  const timeoutId = ref<number | null>(null);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    toast.value = { message, type };

    if (timeoutId.value) {
      clearTimeout(timeoutId.value);
    }

    timeoutId.value = window.setTimeout(() => {
      toast.value = null;
    }, 3000);
  }

  onUnmounted(() => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value);
    }
  });

  return { toast, showToast };
}