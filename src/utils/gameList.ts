import {
  iaGameEntrance,
  pbGameEntrance,
  xjGameEntrance,
  sbGameEntrance,
  agGameEntrance
} from '@/api/wallet/game-list-info';

export const gameList = [
  {
    name: '小艾电竞',
    gameId: 1,
    svg: require('@/assets/image/wallet/ia.png'),
    background: require('@/assets/image/wallet/wallet_ipc-1.png'),
    type: 'e-sports',
    code: 'ia-e',
    enterApi: iaGameEntrance,
    url: '',
    isLock: false,
    isMaintain: false,
    maintainMessage: '',
    bgSvg: 'wait_esports'
  },
  {
    name: '小艾体育',
    gameId: 4,
    svg: require('@/assets/image/wallet/ia.png'),
    background: require('@/assets/image/wallet/wallet_ipc-4.png'),
    type: 'sports',
    code: 'ia-s',
    enterApi: xjGameEntrance,
    url: '',
    isLock: false,
    isMaintain: false,
    maintainMessage: '',
    bgSvg: 'wait_sports'
  },
  {
    name: '沙巴体育',
    gameId: 2,
    svg: require('@/assets/image/wallet/sb.png'),
    background: require('@/assets/image/wallet/wallet_ipc-2.png'),
    type: 'sports',
    code: 'shaba',
    enterApi: sbGameEntrance,
    url: '',
    isLock: false,
    isMaintain: false,
    maintainMessage: '',
    bgSvg: 'wait_sports'
  },
  {
    name: '平博体育',
    gameId: 3,
    svg: require('@/assets/image/wallet/pb.png'),
    background: require('@/assets/image/wallet/wallet_ipc-3.png'),
    type: 'sports',
    code: 'pingbo',
    enterApi: pbGameEntrance,
    url: '',
    isLock: false,
    isMaintain: false,
    maintainMessage: '',
    bgSvg: 'wait_sports'
  },
  {
    name: 'AG真人',
    gameId: 5,
    svg: require('@/assets/image/wallet/ag.png'),
    background: require('@/assets/image/wallet/wallet_ipc-5.png'),
    type: 'real',
    code: 'ag-real',
    enterApi: agGameEntrance,
    url: '',
    isLock: false,
    isMaintain: false,
    maintainMessage: '',
    bgSvg: 'wait_livecasino'
  }
];

export const defaultGameInfo = {
  isLock: false,
  isMaintain: false,
  maintainMessage: ''
};
