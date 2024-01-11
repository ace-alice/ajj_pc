// import { i18n } from '@/locale';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router';
import { getLocal, removeLocal } from '@/utils/storage';

// 配置新建一个 axios 实例
const service = axios.create({
  baseURL: window.location.origin + '/api',
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 50000
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.headers['deviceId'] = '1';
    if (getLocal('token')) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.headers['token'] = getLocal('token');
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 1) {
      if (res.code === 125) {
        router.push({ name: 'IpLimit', query: { info: res.msg || res.message }}).then(() => {});
      }

      if (res.code === 604 || res.code === 602) {
        ElMessage({
          message: res.msg || res.message,
          duration: 2 * 1000,
          customClass: 'copy-message',
          grouping: true
        });
        removeLocal('token');
        removeLocal('userInfo');
        removeLocal('agentInfo');
        setTimeout(() => {
          location.reload();
        }, 100);
      }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008) {
        // to re-login
        ElMessageBox.confirm('登录失效，请重新登录').then(() => {
          removeLocal('token');
          removeLocal('userInfo');
          removeLocal('agentInfo');
          router
            .push({
              name: 'Home',
              query: {
                to: 'login'
              }
            })
            .then(() => {});
          setTimeout(() => {
            location.reload();
          }, 100);
        });
      }
      return Promise.reject(res);
    } else {
      return Promise.resolve(res);
    }
  },
  (error) => {
    // endLoading()
    ElMessage({
      message: error.msg || error.message,
      duration: 2 * 1000,
      customClass: 'copy-message',
      grouping: true
    });
    return Promise.reject(error);
  }
);

export default service;
