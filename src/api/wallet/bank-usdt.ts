import service from '@/service/axios';

// 获取银行卡列表
export function getBankList(params?: any) {
  return service({
    url: '/index/Collection/bankList',
    method: 'get',
    params
  });
}

// 获取usdt账户列表
export function getUsdtList(params?: any) {
  return service({
    url: '/index/Collection/blockchainList',
    method: 'get',
    params
  });
}

// 获取省市信息列表
export function getAreaList(params?: any) {
  return service({
    url: '/index/Collection/province',
    method: 'get',
    params
  });
}
// 获取usdt账户列表
export function getBankInfoList(params?: any) {
  return service({
    url: '/index/Collection/bankInfo',
    method: 'get',
    params
  });
}

// 添加银行卡
export function addBankCard(data?: any) {
  return service({
    url: '/index/Collection/addBank',
    method: 'post',
    data
  });
}

// 银行卡设置默认
export function setDefaultApi(data?: any) {
  return service({
    url: '/index/Collection/defaultBank',
    method: 'post',
    data
  });
}

// usdt设置默认
export function setDefaultUsdtApi(data?: any) {
  return service({
    url: '/index/Collection/defaultBlockchain',
    method: 'post',
    data
  });
}

// 添加usdt
export function addUsdtCard(data?: any) {
  return service({
    url: '/index/Collection/addBlockchain',
    method: 'post',
    data
  });
}

// 获取usdt协议列表
export function getUsdtProtocolList(params?: any) {
  return service({
    url: '/index/Collection/blockchainInfo',
    method: 'get',
    params
  });
}
