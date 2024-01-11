import service from '@/service/axios';

/**
 * 充值线路
 */
export function depositType(params?: any) {
  return service({
    url: '/index/Deposit/DepositType',
    method: 'post',
    data: params
  });
}

/**
 * 用户充值
 */
export function doDeposit(params?: any) {
  return service({
    url: '/index/Deposit/doDeposit',
    method: 'post',
    data: params
  });
}

/**
 * 预期流水  字段 bet_expected 预期流水 bet_amount 当前流水
 */
export function lackBetAmount(data?: any) {
  return service({
    url: '/index/Withdraw/lackBetAmount',
    method: 'post',
    data
  });
}

/**
 * 用户提现信息
 */
export function todayWithdrawTime(data?: any) {
  return service({
    url: '/index/Withdraw/todayWithdrawTime',
    method: 'post',
    data
  });
}

/**
 * 用户提现
 */
export function doWithdraw(params?: any) {
  return service({
    url: '/index/Withdraw/doWithdraw',
    method: 'post',
    data: params
  });
}
