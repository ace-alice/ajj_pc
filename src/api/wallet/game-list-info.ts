import service from '@/service/axios';

/**
 * IA游戏入口
 */
export function iaGameEntrance(data?: any) {
  return service({
    url: '/index/IaGame/index',
    method: 'post',
    data
  });
}

/**
 * 沙巴游戏入口
 */
export function sbGameEntrance(data?: any) {
  return service({
    url: '/index/SabaGame/index',
    method: 'post',
    data
  });
}

/**
 * 平博游戏入口
 */
export function pbGameEntrance(data?: any) {
  return service({
    url: '/index/PinnacleGame/index',
    method: 'post',
    data
  });
}

/**
 * 小金体育入口
 */
export function xjGameEntrance(data?: any) {
  return service({
    url: '/index/XjGame/index',
    method: 'post',
    data
  });
}

/**
 * Ag真人入口
 */
export function agGameEntrance(data?: any) {
  return service({
    url: '/index/AgGame/index',
    method: 'post',
    data
  });
}

/**
 * 获取维护状态
 */
export function maintainStatus(params?: any) {
  return service({
    url: '/index/SetUp/checkMaintain',
    method: 'get',
    params
  });
}
