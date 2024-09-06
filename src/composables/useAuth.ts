import { ref, onMounted } from 'vue';
import { useSupabase } from './useSupabase';

export function useAuth() {
  const { supabase } = useSupabase();
  const isAuthenticated = ref(false);

  async function checkAuth() {
    const { data } = await supabase.auth.getSession();
    isAuthenticated.value = !!data.session;
  }

  onMounted(() => {
    checkAuth();
    supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });
  });

  return { isAuthenticated, checkAuth };
}