// 用户信息接口
export interface UserInfoTypes {
  [key: string]: any;
}

export interface AgentInfoTypes {
  [key: string]: any;
}

export interface WalletInfo {
  gameId: number | string;
  amount: number;
  walletMaintain: boolean;
  walletStatus: boolean;
  [key: string]: any;
}

export interface GameList {
  [key: string]: any;
}

// 缓存信息
export interface CachedViewTypes {}

// 钱包信息
export interface WalletTypes {
  gameType: any[];
  walletList: WalletInfo[];
  gameList: GameList[];
  centerAmount: number | string;
}

// UserState接口
export interface UserStateTypes {
  token: string;
  userInfo: UserInfoTypes;
  agentInfo: AgentInfoTypes;
  isPubLoading: boolean;
  gameUrl: string;
  flowingWater: number;
  currentActivity: any;
}

export interface BankAndUsdtTypes {
  bankList: any[];
  usdtList: any[];
}

export interface CaptchaCodeTypes {
  timer: any;
  countdown: number;
  loading: boolean;
}

// RootState接口
export interface RootStateTypes {
  cachedView: CachedViewTypes;
  user: UserStateTypes;
  wallet: WalletTypes;
  bankAndUsdt: BankAndUsdtTypes;
  captchaCode: CaptchaCodeTypes;
}
