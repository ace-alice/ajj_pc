export default function defaultImageHook() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const defaultTeamLogo = require('@/assets/image/default/logo.png');

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const defaultVideoPlaceholder = require('@/assets/image/default/video-placeholder.jpeg');

  // 银行卡
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const bankDefaultImage = require('@/assets/image/default/BANK.png');
  // usdt账户
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const USDTDefaultImage = require('@/assets/image/default/USDT.png');

  // 优惠默认图
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const activityDefaultImage = require('@/assets/image/default/defaultActivityImage.png');

  // 登录图形验证码默认图
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const defaultLoginCodeImage = require('@/assets/image/default/login-code-err.png');

  return { defaultTeamLogo, defaultVideoPlaceholder, bankDefaultImage, USDTDefaultImage, activityDefaultImage, defaultLoginCodeImage };
}
