<template>
  <div class="WithdrawPopUps">
    <el-scrollbar ref="scrollbarRef" @scroll="scrollBox">
      <div class="withdraw-box wallet">
        <div class="title">取款</div>
        <div :class="{ 'tabs-title': true, pushpin: scrollTopValue > 170 }">
          <div :class="{ 'active-tab': activeCom === 'bank' }" @click="changeTab('bank')">银行卡取款</div>
          <div :class="{ 'active-tab': activeCom === 'usdt' }" @click="changeTab('usdt')">USDT取款</div>
        </div>
        <div class="tab-box">
          <transition mode="out-in" enter-active-class="bulletinIn" leave-active-class="bulletinOut">
            <BankWithdrawTab v-show="activeCom === 'bank'" @close="closePage">银行卡取款</BankWithdrawTab>
          </transition>
          <transition mode="out-in" enter-active-class="letterIn" leave-active-class="letterOut">
            <UsdtWithdrawTab v-show="activeCom === 'usdt'" @close="closePage">USDT取款</UsdtWithdrawTab>
          </transition>
        </div>
      </div>
    </el-scrollbar>
    <svg-icon name="last_more" size="1.5" class="close-icon" @click.stop="closePage" />
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import BankWithdrawTab from '@/views/wallet-manage/components/WithdrawPopUps/components/BankWithdrawTab.vue';
import UsdtWithdrawTab from '@/views/wallet-manage/components/WithdrawPopUps/components/UsdtWithdrawTab.vue';

export default defineComponent({
  name: 'WithdrawPopUps',
  emits: ['close'],
  props: {},
  components: { SvgIcon, BankWithdrawTab, UsdtWithdrawTab },
  setup(props, { emit }) {
    function closePage() {
      emit('close');
    }
    const scrollbarRef: Ref<any> = ref(null);

    const activeCom = ref('bank');

    function changeTab(tab: string) {
      if (activeCom.value === tab) return;
      activeCom.value = tab;
      scrollTopValue.value = 0;
      if (scrollbarRef.value) {
        scrollbarRef.value.setScrollTop(0);
      }
    }

    const scrollTopValue = ref(0);

    function scrollBox({ scrollTop }: any) {
      scrollTopValue.value = scrollTop;
    }

    return { scrollbarRef, closePage, activeCom, changeTab, scrollTopValue, scrollBox };
  }
});
</script>

<style lang="scss" scoped>
.WithdrawPopUps {
  height: 100%;
  width: 100%;
  font-family: PingFangSC-Regular, cursive;
  font-size: 16px;
  color: #ffffff;
  font-weight: 400;
  position: relative;
  .close-icon {
    position: absolute;
    top: 32px;
    left: 66px;
    cursor: pointer;
  }
  .withdraw-box {
    width: 366px;
    margin: 100px auto 350px;
    .pushpin {
      position: fixed;
      top: 0;
      right: 124px;
      z-index: 300;
    }
    .tabs-title {
      display: flex;
      width: 366px;
      padding: 12px 0 24px;
      justify-content: space-between;
      background: #000000;
      & > div {
        height: 34px;
        margin: 0 40px;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #535865;
        font-weight: 600;
        position: relative;
        cursor: pointer;
        transition: all 0.2s linear;
      }
      .active-tab {
        font-family: PingFangSC-Medium;
        color: #ffffff;
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
        transform: translateX(-140%);
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
        transform: translateX(-140%);
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
}
</style>
