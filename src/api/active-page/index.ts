import service from '@/service/axios';

/**
 * 活动tab
 */
export function tabList(data?: any) {
  return service({
    url: '/index/Activity/tabList',
    method: 'post',
    data
  });
}

/**
 * 活动列表
 */
export function promotionList(params?: any) {
  return service({
    url: 'index/Activity/list',
    method: 'post',
    data: params
  });
}
