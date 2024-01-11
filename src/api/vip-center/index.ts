import service from '@/service/axios';

/**
 * vip轮播图
 */
export function getVipList(data?: any) {
  return service({
    url: 'index/Vip/vipList',
    method: 'post',
    data
  });
}

/**
 * vip返水
 */
export function rebateVip(data?: any) {
  return service({
    url: '/index/Vip/vipRebateInfo',
    method: 'post',
    data
  });
}

/**
 * vip会员权益
 */
export function memberVip(data?: any) {
  return service({
    url: '/index/Vip/vipLevelInfo',
    method: 'post',
    data
  });
}

/**
 * vip首充
 */
export function firstVip(data?: any) {
  return service({
    url: '/index/Vip/vipFirstMonthInfo',
    method: 'post',
    data
  });
}

/**
 * vip月复活
 */
export function resurrectionVip(data?: any) {
  return service({
    url: '/index/Vip/vipResurrectionGoldInfo',
    method: 'post',
    data
  });
}

/**
 * 是否有月首充奖励
 */
export function isRechargeStatus(data?: any) {
  return service({
    url: '/index/Vip/vipMonthFirstRechargeStatus',
    method: 'post',
    data
  });
}

/**
 * 领取月首充奖励
 */
export function vipMonthFirstRechargeApply(data?: any) {
  return service({
    url: '/index/Vip/vipMonthFirstRechargeApply',
    method: 'post',
    data
  });
}

/**
 * 是否有月复活奖励
 */
export function vipResurrectionStatus(data?: any) {
  return service({
    url: '/index/Vip/vipResurrectionStatus',
    method: 'post',
    data
  });
}

/**
 * 领取月复活奖励
 */
export function vipResurrectionApply(data?: any) {
  return service({
    url: '/index/Vip/vipResurrectionApply',
    method: 'post',
    data
  });
}

/**
 * vip当前等级
 */
export function vipCurrent(data?: any) {
  return service({
    url: 'index/Vip/vipCurrent',
    method: 'post',
    data
  });
}
