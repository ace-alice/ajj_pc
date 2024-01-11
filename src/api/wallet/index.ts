import service from '@/service/axios';

/**
 * 获取三方钱包余额
 */
export function getTripartiteBalance(params?: any) {
  return service({
    url: '/index/Exchange/getMoney',
    method: 'post',
    data: params
  });
}

/**
 * 获取中心钱包余额
 */
export function getCenterBalance(params?: any) {
  return service({
    url: '/index/Member/centerWallet',
    method: 'post',
    data: params
  });
}

/**
 * 主钱包转到三方钱包
 */
export function mainToTripartiteWallet(params?: any) {
  return service({
    url: '/index/Exchange/moneyTransferIn',
    method: 'post',
    data: params
  });
}

/**
 * 三方钱包转到主钱包
 */
export function tripartiteToMainWallet(params: any) {
  return service({
    url: '/index/Exchange/moneyTransferOut',
    method: 'post',
    data: params
  });
}

/**
 * 余额回收
 */
export function balanceRecovery(data?: any) {
  return service({
    url: '/index/Exchange/getBackAllMoney',
    method: 'get',
    data
  });
}

/**
 * 设置一键转入开关
 */
export function setQuicklyTransfer(params: any) {
  return service({
    url: '/index/Exchange/setQuicklyTransfer',
    method: 'post',
    data: params
  });
}
