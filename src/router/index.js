import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import Components from '../views/Components.vue';
import BorrowView from '../views/BorrowView.vue';
import About from '../views/AboutView.vue';
import AdminPanel from '../views/AdminPanel.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/components', component: Components },
  { path: '/borrow', component: BorrowView },
  { path: '/about', component: About },
  { path: '/admin', component: AdminPanel },
];

const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  export default router;
  