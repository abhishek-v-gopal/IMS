import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import Components from '../views/Components.vue';
import BorrowView from '../views/BorrowView.vue';
import About from '../views/AboutView.vue';
import AdminPanel from '../views/AdminPanel.vue';
import AddComponent from '../views/AddComponent.vue';
import ManageRequest from '../views/ManageRequest.vue';
import ManageStaff from '../views/ManageStaff.vue';
import SaleComponent from '../views/SaleComponent.vue';
import product from '../views/ProductView.vue';
import OrderHistoryView from '../views/OrderHistoryView.vue';
import AdminOrdersView from '../views/AdminOrdersView.vue';

import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const routes = [
  { path: '/', component: Home },
  { path: '/components', component: Components },
  { path: '/borrow', component: BorrowView },
  { path: '/about', component: About },
  { path: '/admin', component: AdminPanel },
  { path: '/addcomponent', component: AddComponent },
  { path: '/managerequest', component: ManageRequest },
  { path: '/managestaff', component: ManageStaff },
  { path: '/admin/products', component: SaleComponent },
  { path: '/products', component: product },
  { path: '/orderhistory', component: OrderHistoryView },
  { path: '/admin/orders', component: AdminOrdersView },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresRole) {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === to.meta.requiresRole) {
        next();
      } else {
        next("/");
      }
    } else {
      next("/");
    }
  } else {
    next();
  }
});

export default router;
