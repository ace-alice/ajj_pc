import service from '@/service/axios';

/**
 * 优惠活动奖励记录
 */
export function rewardRecord(data?: any) {
  return service({
    url: 'index/Activity/rewardRecord',
    method: 'post',
    data
  });
}

/**
 * vip活动奖励记录
 */
export function vipRewardRecord(data?: any) {
  return service({
    url: 'index/Vip/vipRewardRecord',
    method: 'post',
    data
  });
}
