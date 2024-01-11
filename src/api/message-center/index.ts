import service from '@/service/axios';

/**
 * 获取公告信息
 */
export function getAnnouncement(params?: any) {
  return service({
    url: '/index/SetUp/announcement',
    method: 'post',
    data: params
  });
}

/**
 * 获取站内信
 */
export function getLetter(params?: any) {
  return service({
    url: '/index/Letter/list',
    method: 'post',
    data: params
  });
}

/**
 * 站内信设置已读
 */
export function setReadLetter(data?: any) {
  return service({
    url: 'index/Letter/setRead',
    method: 'post',
    data
  });
}

/**
 * 多选删除站内信
 */
export function delLetter(data?: any) {
  return service({
    url: '/index/Letter/delete',
    method: 'post',
    data
  });
}
