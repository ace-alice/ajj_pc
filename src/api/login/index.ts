import service from '@/service/axios';
/**
 * 登录
 */
export function login(params?: any) {
  return service({
    url: '/index/Login/login',
    method: 'post',
    data: params
  });
}

/**
 * 获取个人信息
 */
export function getPersonalInfo() {
  return service({
    url: '/index/Member/personalInfo',
    method: 'post'
  });
}

/**
 * 退出登录
 */
export function signOutUser() {
  return service({
    url: '/index/Login/logout',
    method: 'post'
  });
}

/**
 * 获取验证码图片
 */
export function loginCodeImg() {
  return service({
    url: '/index/Login/captcha',
    method: 'post'
  });
}
