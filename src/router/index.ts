import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';
import Layout from '@/layout/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/home',
    meta: {
      title: '首页'
    },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          noLogin: true
        }
      },
      {
        path: 'message-center',
        name: 'MessageCenter',
        component: () => import('@/views/message-center/index.vue'),
        meta: {
          title: '消息中心',
          noLogin: true
        }
      },
      {
        path: 'active-bonus',
        name: 'ActiveBonus',
        component: () => import('@/views/active-bonus/index.vue'),
        meta: {
          title: '我的积分'
        }
      },
      {
        path: 'vip-center',
        name: 'VipCenter',
        component: () => import('@/views/vip-center/index.vue'),
        meta: {
          title: 'VIP中心'
        }
      },
      {
        path: 'user-center',
        name: 'UserCenter',
        component: () => import('@/views/user-center/index.vue'),
        meta: {
          title: '个人中心'
        }
      },
      {
        path: 'wallet-manage',
        name: 'WalletManage',
        component: () => import('@/views/wallet-manage/index.vue'),
        meta: {
          title: '中心钱包'
        }
      },
      {
        path: '/game-box',
        name: 'GameBox',
        component: () => import('@/views/game-box/index.vue'),
        meta: {
          title: '进入游戏...',
          noLogin: true
        }
      },
      {
        path: '/activity-page',
        name: 'ActivityPage',
        component: () => import('@/views/activity-page/index.vue'),
        meta: {
          title: '优惠活动',
          noLogin: true
        }
      },
      {
        path: '/404',
        name: 'RouteError',
        component: () => import('@/views/error-page/error-404.vue'),
        meta: {
          title: '404',
          noLogin: true
        }
      }
    ]
  },
  {
    path: '/ip-limit',
    name: 'IpLimit',
    component: () => import('@/views/error-page/error-ip-limit.vue'),
    meta: {
      title: 'IP限制',
      noLogin: true
    }
  },
  {
    path: '/:path(.*)*',
    redirect: '/404'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
