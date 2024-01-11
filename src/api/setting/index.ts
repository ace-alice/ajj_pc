import service from '@/service/axios';
/**
 * 修改账户密码
 */
export function updateAccountPassword(params?: any) {
  return service({
    url: '/index/Member/setLoginPwd',
    method: 'post',
    data: params
  });
}

/**
 * 发送验证码
 */
export function pubCode() {
  return service({
    url: '/index/Member/sendCaptcha',
    method: 'post'
  });
}

/**
 * 修改交易密码
 */
export function updateTransactionPassword(params?: any) {
  return service({
    url: '/index/Member/setTradePwd',
    method: 'post',
    data: params
  });
}
