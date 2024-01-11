import service from '@/service/axios';

export function getBannerList() {
  return service({
    url: '/index/SetUp/banner',
    method: 'post'
  });
}

/**
 * 热门赛事
 */
export function hotGame() {
  return service({
    url: '/index/IaGame/getHotGame',
    method: 'post'
  });
}
