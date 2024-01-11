import service from '@/service/axios';

// 获取存款列表
export function getDepositList(params?: any) {
  return service({
    url: '/index/Records/deposit',
    method: 'get',
    params
  });
}

// 获取存款记录详情
export function getDepositDetail(params?: any) {
  return service({
    url: '/index/Records/depositDetail',
    method: 'get',
    params
  });
}

// 获取存款类型
export function getDepositType(params?: any) {
  return service({
    url: '/index/Records/depositType',
    method: 'get',
    params
  });
}

// 获取取款列表
export function getWithdrawList(params?: any) {
  return service({
    url: '/index/Records/withdraw',
    method: 'get',
    params
  });
}

// 获取取款记录详情
export function getWithdrawDetail(params?: any) {
  return service({
    url: '/index/Records/withdrawDetail',
    method: 'get',
    params
  });
}

// 获取取款类型
export function getWithdrawType(params?: any) {
  return service({
    url: '/index/Records/withdrawType',
    method: 'get',
    params
  });
}

// 获取交易列表
export function getTradeRecordList(params?: any) {
  return service({
    url: '/index/MoneyOrder/list',
    method: 'get',
    params
  });
}

// 获取交易详情
export function getTradeRecordDetail(params?: any) {
  return service({
    url: '/index/MoneyOrder/detail',
    method: 'get',
    params
  });
}

// 获取交易类型
export function getTradeRecordType(params?: any) {
  return service({
    url: '/index/MoneyOrder/moneyType',
    method: 'get',
    params
  });
}

// 获取投注列表
export function getBetRecordList(params?: any) {
  return service({
    url: '/index/BetOrder/list',
    method: 'get',
    params
  });
}
