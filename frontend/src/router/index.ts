import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RatesView from '../views/RatesView.vue';
import InsightsView from '../views/InsightsView.vue';
import InsightDetailView from '../views/InsightDetailView.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/rates', name: 'Rates', component: RatesView },
  { path: '/insights', name: 'Insights', component: InsightsView },
  { path: '/insights/:id', name: 'InsightDetail', component: InsightDetailView },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
