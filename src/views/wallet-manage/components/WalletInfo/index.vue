<template>
  <div class="wallet-info">
    <el-image :src="walletIconBg" class="wallet-icon-bg">
      <template #placeholder>
        <div></div>
      </template>
      <template #error>
        <div></div>
      </template>
    </el-image>
    <div class="user-info">
      {{ userInfo['username'] || '请先登录' }}
      <span v-if="userInfo['vip_current_level']">VIP{{ userInfo['vip_current_level'] }}</span>
    </div>
    <div class="amount-info">
      <CountTo
        :startVal="Number(totalAmountStartVal)"
        :endVal="Number(priceToFixed(totalAmount)) || 0"
        :duration="1000"
      />
      <span>总金额</span>
    </div>
    <div class="center-info">中心钱包</div>
    <div class="center-amount">
      <CountTo
        :startVal="Number(centerAmountStartVal)"
        :endVal="Number(priceToFixed(centerAmount)) || 0"
        :duration="1000"
      />
    </div>
    <div class="control-box">
      <DepositPopUps />
      <WithdrawPopUps />
      <TransferPopUps />
    </div>
    <RefreshBox />
    <AllRecycle />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import CountTo from '@/components/VueCountTo/index.vue';
import { priceToFixed } from '@/utils/numberFunction';
import DepositPopUps from '@/views/wallet-manage/components/DepositPopUps/index.vue';
import WithdrawPopUps from '@/views/wallet-manage/components/WithdrawPopUps/index.vue';
import TransferPopUps from '@/views/wallet-manage/components/TransferPopUps/index.vue';
import AllRecycle from '@/views/wallet-manage/components/WalletInfo/components/AllRecycle.vue';
import RefreshBox from '@/views/wallet-manage/components/WalletInfo/components/RefreshBox.vue';

export default defineComponent({
  name: 'WalletInfo',
  props: {},
  components: { CountTo, DepositPopUps, WithdrawPopUps, TransferPopUps, AllRecycle, RefreshBox },
  setup() {
    const store = useStore();

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const walletIconBg = require('@/assets/image/wallet/me_ wallet_ipc01.png');

    const userInfo = computed(() => {
      return store.getters.getUserInfo || {};
    });

    const walletList = computed(() => {
      return store.getters.getWalletList;
    });

    const centerAmount = computed(() => {
      return store.getters.getCenterAmount;
    });

    const totalAmount = computed(() => {
      let result: number = Number(centerAmount.value) || 0;
      for (const argument of walletList.value) {
        if (Number(argument.amount)) {
          result += Number(argument.amount);
        }
      }
      return result;
    });

    const totalAmountStartVal = ref(0);

    watch(
      () => totalAmount.value,
      (_, oldVal) => {
        totalAmountStartVal.value = oldVal;
      }
    );

    const centerAmountStartVal = ref(0);

    watch(
      () => centerAmount.value,
      (_, oldVal) => {
        centerAmountStartVal.value = oldVal;
      }
    );

    onMounted(() => {
      store.dispatch('wallet/getCenterAmount');
    });

    return {
      userInfo,
      totalAmount,
      totalAmountStartVal,
      centerAmount,
      centerAmountStartVal,
      priceToFixed,
      walletIconBg
    };
  }
});
</script>

<style lang="scss" scoped>
.wallet-info {
  width: 1040px;
  height: 281px;
  //background: #17191e;
  border-radius: 8px;
  //overflow: hidden;
  position: relative;
  background-image: url('../../../../assets/image/wallet/me_ wallet_info_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-size: 50px;
  & > div {
    position: absolute;
    left: 94px;
    display: flex;
    align-items: center;
  }
  .center-info {
    top: 76px;
    left: 405px;
    font-family: PingFangSC-Medium;
    font-size: 24px;
    color: #c2c7d2;
    font-weight: 600;
  }
  .center-amount {
    top: 120px;
    left: 407px;
    font-family: DIN-Medium, cursive;
    font-size: 32px;
    color: #ffffff;
    font-weight: 600;
  }
  .user-info {
    top: 76px;
    font-family: PingFangSC-Medium;
    font-size: 26px;
    color: #c2c7d2;
    font-weight: 600;
    span {
      display: inline-block;
      background: var(--aux-color);
      border-radius: 12px;
      height: 24px;
      padding: 0 12px;
      line-height: 24px;
      font-family: PingFangSC-Regular, cursive;
      font-size: 14px;
      color: #ffffff;
      font-weight: 400;
      margin-left: 12px;
    }
  }
  .amount-info {
    top: 118px;
    font-family: DIN-Medium, cursive;
    font-size: 38px;
    color: var(--aux-color);
    font-weight: 600;
    align-items: flex-end;
    span:nth-child(2) {
      font-family: PingFangSC-Regular, cursive;
      font-size: 16px;
      font-weight: 400;
      margin-left: 12px;
      margin-bottom: 4px;
    }
  }
  .control-box {
    height: 56px;
    border-radius: 36px;
    bottom: 36px;
    display: flex;
    align-items: center;
    background: #00000020;
    & > div {
      width: 150px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #c2c7d2;
      font-weight: 500;
      cursor: pointer;
      & + div {
        position: relative;
        &:after {
          content: '';
          position: absolute;
          width: 1px;
          height: 18px;
          background-color: #ffffff60;
          top: 15px;
          left: 0;
        }
      }
    }
  }
  .wallet-icon-bg {
    position: absolute;
    left: unset;
    right: 100px;
    top: 30px;
    height: 216px;
    width: 258px;
  }
}
</style>
