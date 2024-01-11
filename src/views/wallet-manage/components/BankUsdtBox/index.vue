<template>
  <div class="bank-usdt-box">
    <div class="card-title">我的银行卡</div>
    <div class="tabs-title">
      <div :class="{ active: activeCom === 'bank' }" @click="changeTab('bank')">银行卡</div>
      <div :class="{ active: activeCom === 'usdt' }" @click="changeTab('usdt')">虚拟币</div>
    </div>
    <div class="tab-box">
      <transition mode="out-in" enter-active-class="bulletinIn" leave-active-class="bulletinOut">
        <BankList v-show="activeCom === 'bank'" />
      </transition>
      <transition mode="out-in" enter-active-class="letterIn" leave-active-class="letterOut">
        <UsdtList v-show="activeCom === 'usdt'" />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BankList from '@/views/wallet-manage/components/BankUsdtBox/components/BankList.vue';
import UsdtList from '@/views/wallet-manage/components/BankUsdtBox/components/UsdtList.vue';

export default defineComponent({
  name: 'BankUsdtBox',
  props: {},
  components: { BankList, UsdtList },
  setup() {
    const activeCom = ref('bank');

    function changeTab(tab: string) {
      activeCom.value = tab;
    }
    return { activeCom, changeTab };
  }
});
</script>

<style lang="scss" scoped>
.bank-usdt-box {
  height: 776px;
  width: 464px;
  background: #17191e;
  border-radius: 8px;
  overflow: hidden;
  .card-title {
    height: 74px;
    line-height: 74px;
    padding-left: 24px;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #ffffff;
    font-weight: 600;
  }
  .tabs-title {
    display: flex;
    width: 366px;
    margin: 8px auto 24px;
    justify-content: space-between;
    & > div {
      height: 34px;
      width: 50px;
      margin: 0 20px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #535865;
      font-weight: 400;
      position: relative;
      cursor: pointer;
      transition: all 0.2s linear;
    }
    .active {
      font-family: PingFangSC-Medium;
      color: #c2c7d2;
      font-weight: 600;
      &:before {
        content: '';
        position: absolute;
        height: 2px;
        width: 100%;
        background-color: var(--aux-color);
        border-radius: 1px;
        bottom: 0;
        left: 0;
      }
    }
  }
  .tab-box {
    position: relative;
    min-height: 100px;
    width: 100%;
  }
  .bulletinIn {
    animation: bulletinIn 0.5s linear;
  }

  .bulletinOut {
    top: 0;
    left: 0;
    animation: bulletinOut 0.5s linear;
    position: absolute;
  }

  @keyframes bulletinIn {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }
  }
  @keyframes bulletinOut {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .letterIn {
    animation: letterIn 0.5s linear;
  }
  .letterOut {
    top: 0;
    left: 0;
    position: absolute;
    animation: letterOut 0.5s linear;
  }

  @keyframes letterIn {
    0% {
      transform: translateX(140%);
    }
    100% {
      transform: translateX(0);
    }
  }
  @keyframes letterOut {
    0% {
      transform: translateX(20%);
    }
    100% {
      transform: translateX(140%);
    }
  }
}
</style>
