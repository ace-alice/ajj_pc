import service from '@/service/axios';

/**
 * 获取联系方式
 */
export function getContactUs(data?: any) {
  return service({
    url: 'index/SetUp/contactUs',
    method: 'post',
    data
  });
}

export const contactAllTimeUrl = 'https://direct.lc.chat/14128890/';
