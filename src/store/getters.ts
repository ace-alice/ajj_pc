import { GetterTree } from 'vuex';
import { RootStateTypes } from './interface';

const getters: GetterTree<any, any> = {
  getToken: (state: RootStateTypes) => state.user.token,
  getUserInfo: (state: RootStateTypes) => state.user.userInfo,
  agentInfo: (state: RootStateTypes) => state.user.agentInfo,
  getIsPubLoading: (state: RootStateTypes) => state.user.isPubLoading,
  getGameUrl: (state: RootStateTypes) => state.user.gameUrl,
  getGameList: (state: RootStateTypes) => state.wallet.gameList,
  getCenterAmount: (state: RootStateTypes) => state.wallet.centerAmount,
  getWalletList: (state: RootStateTypes) => state.wallet.walletList,
  getBankList: (state: RootStateTypes) => state.bankAndUsdt.bankList,
  getUsdtList: (state: RootStateTypes) => state.bankAndUsdt.usdtList,
  getGameType: (state: RootStateTypes) => state.wallet.gameType,
  countdown: (state: RootStateTypes) => state.captchaCode.countdown,
  flowingWater: (state: RootStateTypes) => state.user.flowingWater,
  currentActivity: (state: RootStateTypes) => state.user.currentActivity
};

export default getters;
