import { ref } from 'vue';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  dismissible: boolean;
}

const toast = ref<Toast | null>(null);

export function useToast() {
  const showToast = (message: string, type: 'success' | 'error' | 'info', dismissible = false) => {
    toast.value = { message, type, dismissible };
    if (!dismissible) {
      setTimeout(() => {
        toast.value = null;
      }, 6000);
    }
  };

  const dismissToast = () => {
    toast.value = null;
  };

  return { toast, showToast, dismissToast };
}