// 引入 router 实例
import router from '@/router';
import { setPageTitle } from '@/utils/common';
import store from '@/store';
import { setLocal } from '@/utils/storage';

router.beforeEach(async (to, from, next) => {
  if (to.query.code) {
    setLocal('code', to.query.code);
  }
  if (!store.getters.getUserInfo?.id && !to.meta.noLogin) {
    next({ name: 'Home', query: { to: 'login' }});
  } else {
    // 设置页面title
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setPageTitle(to.meta.title);

    next();
  }
});
