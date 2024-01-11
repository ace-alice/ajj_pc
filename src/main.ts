import { createApp } from 'vue';
import App from './App.vue';
import store from '@/store';
// import './registerServiceWorker';
import router from './router';
// import { i18n } from '@/locale';

import './assets/font/font.scss';

const app = createApp(App);

// 引入event-bus方法
import mitt from 'mitt';
// 注册全局 event mitt方法
app.config.globalProperties.mittBus = mitt();

// 引入全局路由守卫
import './router/guard';

// 初始化样式
import 'normalize.css';

import './themes/index.scss';

// 引入animate动画库
import 'animate.css/animate.min.css';

// 引入svg模块
import './icons';

// svg-icon 组件
import SvgIcon from '@/components/SvgIcon/index.vue'; // svg component
// 全局注册svg 组件
app.component('SvgIcon', SvgIcon);

import Copy from '@/components/Clipboard/index.vue';
// 全局注册Copy 组件
app.component('Copy', Copy);

import ErrBox from '@/components/ErrBox/index.vue';
// 全局注册Copy 组件
app.component('ErrBox', ErrBox);

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

app.use(router).use(store).use(ElementPlus).mount('#app');
