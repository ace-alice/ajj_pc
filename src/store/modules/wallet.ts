// noinspection JSUnusedGlobalSymbols

import { Module } from 'vuex';
import { RootStateTypes, WalletInfo, WalletTypes } from '../interface';
import { balanceRecovery, getCenterBalance, getTripartiteBalance } from '@/api/wallet';
import { gameList, defaultGameInfo } from '@/utils/gameList';
import { maintainStatus } from '@/api/wallet/game-list-info';
import { ElMessage } from 'element-plus';

const defaultWallet = {
  gameId: 0,
  amount: 0,
  walletMaintain: false,
  walletStatus: false
};

const userInfoModule: Module<WalletTypes, RootStateTypes> = {
  namespaced: true,
  state: {
    gameType: [
      { name: '电竞', type: 'e-sports' },
      { name: '体育', type: 'sports' },
      { name: '真人', type: 'real' }
    ],
    gameList: gameList || [],
    walletList: [],
    centerAmount: 0
  },
  mutations: {
    INIT_WALLET_LIST(state: WalletTypes, value: WalletInfo) {
      // if (value.gameId === 4) return;
      const hasWallet = state.walletList.some((wallet: any) => {
        return wallet.gameId === value.gameId;
      });

      if (hasWallet) {
        for (let i = 0; i < state.walletList.length; i++) {
          if (+state.walletList[i].gameId === +value.gameId) {
            state.walletList[i] = value;
          }
        }
      } else {
        state.walletList = [...state.walletList, value];
      }
    },
    SET_WALLET_LIST(state: WalletTypes, value: any) {
      for (let i = 0; i < state.walletList.length; i++) {
        if (+state.walletList[i].gameId === +value.gameId) {
          state.walletList[i] = value;
        }
      }
    },
    SET_CENTER_AMOUNT(state: WalletTypes, value: number | string) {
      state.centerAmount = value;
    },
    INIT_GAME_INFO(state: WalletTypes, gameInfo: { [key: string]: any }) {
      for (let i = 0; i < state.gameList.length; i++) {
        if (+state.gameList[i].gameId === +gameInfo.gameId) {
          state.gameList[i] = Object.assign(state.gameList[i], gameInfo);
        }
      }
    }
  },
  actions: {
    getCenterAmount({ commit }) {
      getCenterBalance().then((res: any) => {
        if (+res.code === 1) {
          commit('SET_CENTER_AMOUNT', Number(res.data.amount));
        }
      });
    },
    toGetTripartiteBalance({ commit, state }, form) {
      return new Promise((resolve) => {
        getTripartiteBalance(form)
          .then((res: any) => {
            if (+res.code === 1) {
              commit(
                'SET_WALLET_LIST',
                Object.assign({}, defaultWallet, { gameId: form.game_id, amount: Number(res.data.amount) })
              );
            }
          })
          .catch((err: any) => {
            if (+err.code === 60002) {
              commit(
                'SET_WALLET_LIST',
                Object.assign({}, defaultWallet, { gameId: form.game_id, walletMaintain: true })
              );
            }
            if (+err.code === 50012) {
              commit('SET_WALLET_LIST', Object.assign({}, defaultWallet, { gameId: form.game_id }));
            }
            if (+err.code === 50005 || +err.code === 50009 || +err.code === 50014) {
              commit('SET_WALLET_LIST', Object.assign({}, defaultWallet, { gameId: form.game_id, walletStatus: true }));
            }
          })
          .finally(() => {
            resolve(true);
          });
      });
    },
    recycleAmountAllAmount() {
      return new Promise((resolve) => {
        balanceRecovery()
          .then((res: any) => {
            if (+res.code === 1) {
              resolve(true);
            } else {
              resolve(false);
              ElMessage({
                message: res.msg || res.message,
                duration: 2 * 1000,
                customClass: 'copy-message',
                grouping: true
              });
            }
          })
          .catch((err: any) => {
            ElMessage({
              message: err.msg || err.message,
              duration: 2 * 1000,
              customClass: 'copy-message',
              grouping: true
            });
            resolve(false);
          });
      });
    },
    initGameInfo({ commit, state, rootState }) {
      state.gameList.forEach((game: any) => {
        maintainStatus({ game_id: game.gameId })
          .then((res: any) => {
            if (+res.code === 1) {
              //
            }
          })
          .catch((err: any) => {
            if (+err.code === 60001) {
              commit(
                'INIT_GAME_INFO',
                Object.assign({}, defaultGameInfo, {
                  gameId: game.gameId,
                  maintainMessage: err.msg || err.message,
                  isMaintain: true
                })
              );
            }
            if ([60003, 50005, 50009].includes(+err.code)) {
              commit(
                'INIT_GAME_INFO',
                Object.assign({}, defaultGameInfo, {
                  gameId: game.gameId,
                  maintainMessage: err.msg || err.message,
                  isLock: true
                })
              );
            }
          });
        if (rootState.user.token) {
          getTripartiteBalance({ game_id: game.gameId })
            .then((res: any) => {
              if (+res.code === 1) {
                commit(
                  'INIT_WALLET_LIST',
                  Object.assign({}, defaultWallet, { gameId: game.gameId, amount: Number(res.data.amount) })
                );
              }
            })
            .catch((err: any) => {
              if (+err.code === 60002) {
                commit(
                  'INIT_WALLET_LIST',
                  Object.assign({}, defaultWallet, { gameId: game.gameId, walletMaintain: true })
                );
              }
              if (+err.code === 50012) {
                commit('INIT_WALLET_LIST', Object.assign({}, defaultWallet, { gameId: game.gameId }));
              }
              if (+err.code === 50005 || +err.code === 50009 || +err.code === 50014) {
                commit(
                  'INIT_WALLET_LIST',
                  Object.assign({}, defaultWallet, { gameId: game.gameId, walletStatus: true })
                );
              }
            });
        }
      });
    }
  }
};

export default userInfoModule;
