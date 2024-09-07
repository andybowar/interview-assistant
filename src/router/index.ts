declare const process: {
  env: {
    BASE_URL: string;
  };
};

import { createRouter, createWebHistory } from 'vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/AuthPage.vue')
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('@/views/AuthCallback.vue')
  },
  {
    path: '/practice-interview',
    name: 'PracticeInterview',
    component: () => import('@/views/PracticeInterview.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/real-interview',
    name: 'RealInterview',
    component: () => import('@/views/RealInterview.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/coding-challenge',
    name: 'CodingChallenge',
    component: () => import('@/views/CodingChallenge.vue'),
    meta: { requiresAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, checkAuth } = useAuth();
  await checkAuth();

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/auth');
  } else {
    next();
  }
});

export default router;