import { getLocal, setLocal, removeLocal } from '@/utils/storage';
import { Module } from 'vuex';
import { getPersonalInfo } from '@/api/login';

import { UserStateTypes, RootStateTypes, AgentInfoTypes, UserInfoTypes } from '../interface';
import { lackBetAmount } from '@/api/wallet/in-out-money';

const userModule: Module<UserStateTypes, RootStateTypes> = {
  namespaced: true,
  state: {
    token: getLocal('token') || '',
    userInfo: getLocal('userInfo') || {},
    agentInfo: getLocal('agentInfo') || {},
    isPubLoading: false,
    gameUrl: '',
    flowingWater: 0,
    currentActivity: {
      headerTitle: '',
      gameUrl: ''
    }
  },
  mutations: {
    SET_TOKEN: (state: UserStateTypes, value: string) => {
      state.token = value;
      setLocal('token', value);
    },
    REMOVE_TOKEN: (state: UserStateTypes) => {
      state.token = '';
      removeLocal('token');
    },
    SET_USER_INFO: (state: UserStateTypes, value: UserInfoTypes) => {
      state.userInfo = value;
      setLocal('userInfo', state.userInfo);
    },
    REMOVE_USER_INFO: (state) => {
      state.userInfo = {};
      removeLocal('userInfo');
    },

    SET_AGENT_INFO: (state: UserStateTypes, value: AgentInfoTypes) => {
      state.agentInfo = value;
      setLocal('agentInfo', value);
    },
    REMOVE_AGENT_INFO: (state: UserStateTypes) => {
      state.agentInfo = {};
      removeLocal('agentInfo');
    },
    GET_LOADING: (state: UserStateTypes, value: boolean) => {
      state.isPubLoading = value;
    },
    GET_GAME_URL: (state: UserStateTypes, value: string) => {
      state.gameUrl = value;
    },
    SET_FLOWING_WATER(state: UserStateTypes, value: number) {
      state.flowingWater = value;
    },
    SET_ACTIVITY_INFO(state: UserStateTypes, value: any) {
      Object.assign(state.currentActivity, value);
    }
  },
  actions: {
    getUserInfo({ commit }) {
      return new Promise((resolve) => {
        getPersonalInfo()
          .then((res: any) => {
            if (+res.code === 1) {
              commit('SET_USER_INFO', res.data);
            }
          })
          .finally(() => {
            setTimeout(() => {
              resolve(true);
            }, 20);
          });
      });
    },
    getFlowingWater({ commit }) {
      lackBetAmount().then((res: any) => {
        if (+res.code === 1) {
          commit('SET_FLOWING_WATER', +res.data?.unfinished_flow || 0);
        }
      });
    }
  }
};

export default userModule;
