import service from '@/service/axios';

/**
 * 获取头像列表
 */
export function getAvatarList(params?: any) {
  return service({
    url: '/index/Member/avatarList',
    method: 'post',
    data: params
  });
}

/**
 * 修改头像
 */
export function setUserInfo(params?: any) {
  return service({
    url: '/index/Member/setPersonalInfo',
    method: 'post',
    data: params
  });
}

/**
 * 设置新手机号
 */
export function setPhone(params?: any) {
  return service({
    url: '/index/SetUp/setPhone',
    method: 'get',
    params
  });
}
/**
 * 发送验证码-换绑手机号
 */
export function phoneCaptcha(data?: any) {
  return service({
    url: '/index/SetUp/phoneCaptcha',
    method: 'post',
    data
  });
}
