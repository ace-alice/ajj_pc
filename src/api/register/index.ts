import service from '@/service/axios';
/**
 * 手机注册
 */
export function phoneRegister(params?: any) {
  return service({
    url: '/index/Register/phoneRegister',
    method: 'post',
    data: params
  });
}

/**
 * 手机注册验证码
 */
export function registerPhoneCaptcha(params?: any) {
  return service({
    url: '/index/Register/phoneCaptcha',
    method: 'post',
    data: params
  });
}

/**
 * 获取手机验证码
 */
export function getPhoneCode(params?: any) {
  return service({
    url: '/index/Login/phoneCaptcha',
    method: 'post',
    data: params
  });
}

