import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Front',
    component: () => import('../views/FrontView.vue'),
    children: [
      {
        path: '',
        name: 'IndexView',
        component: () => import('../views/IndexView.vue'),
      },
      {
        path: 'products',
        name: 'ProductsView',
        component: () => import('../views/ProductsView.vue'),
      },
      {
        path: 'cart',
        name: 'CartView',
        component: () => import('../views/CartView.vue'),
      },
      {
        path: 'login',
        name: 'LoginView',
        component: () => import('../views/LoginView.vue'),
      },
    ],
  },
  {
    path: '/admin',
    name: 'DashboardView',
    component: () => import('../views/DashBoard/DashboardView.vue'),
    children: [
      {
        path: '',
        name: 'DashboardIndex',
        component: () => import('../views/DashBoard/DashboardIndex.vue'),
      },
      {
        path: 'products',
        name: 'DashboardProducts',
        component: () => import('../views/DashBoard/DashboardProducts.vue'),
      },
      {
        path: 'orders',
        name: 'DashboardOrders',
        component: () => import('../views/DashBoard/DashboardOrders.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
