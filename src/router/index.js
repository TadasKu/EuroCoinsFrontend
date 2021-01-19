//import { from } from 'core-js/fn/array'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Settings from '../views/Settings.vue';
import { Role } from '../_helpers/Role';
import Store from '../store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      requiresAuth: true,
      authorize: [Role.User, Role.Admin, Role.Viewer],
    },
  },
  {
    path: '/',
    name: 'Main',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Main.vue'),
    meta: {
      guest: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    meta: {
      guest: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Register.vue'),
    meta: {
      guest: true,
    },
  },
  {
    path: '/CoinList',
    name: 'CoinList',
    props: true,
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/CoinList.vue'),
    meta: {
      guest: true,
    },
  },
  {
    path: '/adminPage',
    name: 'AdminPage',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AdminPage.vue'),
    meta: {
      requiresAuth: true,
      authorize: [Role.Admin, Role.Viewer],
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    var date = new Date();
    if (Store.state.user.userId != null) {
      date = Store.state.user.exp;
    }
    var dateToExpire = new Date(date * 1000);
    date = new Date();
    if (Store.state.user.token != null && date < dateToExpire) {
      if (to.meta.authorize.includes(Store.state.user.role)) {
        next();
      } else {
        next('/');
      }
    } else {
      Store.dispatch('delete_UserAction');
      next('/login');
    }
  } else {
    next();
  }
});
export default router;
