import service from '@/service/axios';
/**
 * 手机注册
 */
export function findPassword(params?: any) {
  return service({
    url: '/index/Login/findPassword',
    method: 'post',
    data: params
  });
}
