// import { getLocal, setLocal } from '@/utils/storage';
// noinspection JSUnusedGlobalSymbols

import { Module } from 'vuex';

import { BankAndUsdtTypes, RootStateTypes } from '../interface';
import { getBankList, getUsdtList } from '@/api/wallet/bank-usdt';

const bankAndUsdtModule: Module<BankAndUsdtTypes, RootStateTypes> = {
  namespaced: true,
  state: {
    bankList: [],
    usdtList: []
  },
  mutations: {
    SET_BANK_LIST(state: BankAndUsdtTypes, list: any[]) {
      state.bankList = list;
    },
    SET_USDT_LIST(state: BankAndUsdtTypes, list: any[]) {
      state.usdtList = list;
    }
  },
  actions: {
    toGetBankList({ commit }) {
      getBankList().then((res: any) => {
        if (+res.code === 1) {
          commit('SET_BANK_LIST', res.data);
        }
      });
    },
    toGetUsdtList({ commit }) {
      getUsdtList().then((res: any) => {
        if (+res.code === 1) {
          commit('SET_USDT_LIST', res.data);
        }
      });
    }
  }
};

export default bankAndUsdtModule;
