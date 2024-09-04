import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import RealInterview from '@/views/RealInterview.vue';
import PracticeInterview from '@/views/PracticeInterview.vue';
import CodingChallenge from '@/views/CodingChallenge.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/real-interview',
    name: 'RealInterview',
    component: RealInterview
  },
  {
    path: '/practice-interview',
    name: 'PracticeInterview',
    component: PracticeInterview
  },
  {
    path: '/coding-challenge',
    name: 'CodingChallenge',
    component: CodingChallenge
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;