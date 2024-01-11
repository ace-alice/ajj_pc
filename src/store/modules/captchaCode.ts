// import { getLocal, setLocal } from '@/utils/storage';
import { Module } from 'vuex';

import { CaptchaCodeTypes, RootStateTypes } from '../interface';
import { phoneCaptcha } from '@/api/global';

const captchaCodeModule: Module<CaptchaCodeTypes, RootStateTypes> = {
  namespaced: true,
  state: {
    timer: null,
    countdown: 60,
    loading: false
  },
  mutations: {
    SET_TIMER(state: CaptchaCodeTypes, fun: any) {
      state.timer = fun;
    },
    SET_LOADING(state: CaptchaCodeTypes, bool: boolean) {
      state.loading = bool;
    },
    SET_COUNTDOWN(state: CaptchaCodeTypes) {
      if (!state.countdown) {
        state.countdown = 60;
      } else {
        state.countdown--;
      }
    },
    INIT(state: CaptchaCodeTypes) {
      clearInterval(state.timer);
      state.timer = null;
      state.countdown = 60;
    }
  },
  actions: {
    sentCode({ state, commit }) {
      if (state.timer || state.countdown < 60 || state.loading) return;
      commit('SET_LOADING', true);
      phoneCaptcha()
        .then((res: any) => {
          if (+res.code === 1) {
            commit(
              'SET_TIMER',
              setInterval(() => {
                commit('SET_COUNTDOWN');
                if (state.countdown <= 0) {
                  commit('INIT');
                }
              }, 1000)
            );
          }
        })
        .finally(() => {
          commit('SET_LOADING', false);
        });
    }
  }
};

export default captchaCodeModule;
