import service from '@/service/axios';

/**
 * 字典
 */
export function dictionary(params?: any) {
  return service({
    url: '/index/SetUp/dictionary',
    method: 'post',
    data: params
  });
}

/**
 * 验证码
 */
export function phoneCaptcha() {
  return service({
    url: '/index/Withdraw/phoneCaptcha',
    method: 'post'
  });
}

/**
 * 生日弹窗
 */
export function userAlert(data?: any) {
  return service({
    url: 'index/MsgAlert/getUserAlert',
    method: 'post',
    data
  });
}

/**
 * 站内信未读数量
 */
export function unRead(data?: any) {
  return service({
    url: '/index/Letter/unRead',
    method: 'post',
    data
  });
}
