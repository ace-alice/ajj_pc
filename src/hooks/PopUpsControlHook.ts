export default function popUpsControlHook(proxy: any, exclude: string[]) {
  const popUpsCloseFunName: string[] = [
    'closeMessagePage',
    'closeDownloadBar',
    'closeLoginPage',
    'showActiveBonusBox',
    'showCustomerServiceBox',
    'showFullTimeCustomer',
    'closeWithdrawPopUps',
    'closeTransferPopUps',
    'closeDepositPopUps',
    'closeAddUsdtPopUps',
    'closeAddBankPopUps',
    'closeDepositDetailPopUps',
    'closeUserInfoPage',
    'closeUserInfoBoxPage',
    'showActivityBox',
    'closeAccountSetting'
  ];

  function closeOtherPopUps() {
    for (const funName of popUpsCloseFunName) {
      if (!exclude.includes(funName)) {
        proxy.mittBus.emit(funName);
      }
    }
  }

  return { closeOtherPopUps };
}
