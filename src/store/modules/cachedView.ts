// import { getLocal, setLocal } from '@/utils/storage';
import { Module } from 'vuex';

import { CachedViewTypes, RootStateTypes } from '../interface';

const userInfoModule: Module<CachedViewTypes, RootStateTypes> = {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {}
};

export default userInfoModule;
