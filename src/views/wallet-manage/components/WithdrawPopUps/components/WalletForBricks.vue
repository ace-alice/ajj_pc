<template>
  <div class="WalletForBricks">
    <div class="wallet-info">
      <div>中心钱包</div>
      <div>
        <CountTo
          :startVal="Number(centerAmountStartVal)"
          :endVal="Number(priceToFixed(centerAmount)) || 0"
          :duration="1000"
        />
      </div>
    </div>
    <div class="wallet-info">
      <div>场馆钱包合计</div>
      <div>
        <CountTo
          :startVal="Number(totalAmountStartVal)"
          :endVal="Number(priceToFixed(totalAmount)) || 0"
          :duration="1000"
        />
      </div>
    </div>
    <div class="btn" :class="{ disable: +totalAmount < 1, active: +totalAmount >= 1 }" @click="recycleAmount">
      <svg-icon name="me_ wallet_into" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { useStore } from 'vuex';
import CountTo from '@/components/VueCountTo/index.vue';
import { priceToFixed } from '@/utils/numberFunction';

export default defineComponent({
  name: 'WalletForBricks',
  props: {},
  components: { SvgIcon, CountTo },
  setup() {
    const store = useStore();
    const centerAmount = computed(() => {
      return store.getters.getCenterAmount;
    });

    const walletList = computed(() => {
      return store.getters.getWalletList;
    });

    const totalAmount = computed(() => {
      let result = 0;
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

    const recycleLoading = ref(false);

    async function recycleAmount() {
      if (+totalAmount.value < 1 || recycleLoading.value) return;
      recycleLoading.value = true;
      await store.dispatch('wallet/recycleAmountAllAmount');
      recycleLoading.value = false;
      walletList.value.forEach((wallet: any) => {
        store.dispatch('wallet/toGetTripartiteBalance', { game_id: +wallet.gameId }).finally(() => {});
      });
      store.dispatch('wallet/getCenterAmount').then(() => {});
    }

    return { recycleAmount, totalAmountStartVal, centerAmount, totalAmount, centerAmountStartVal, priceToFixed };
  }
});
</script>

<style lang="scss" scoped>
.WalletForBricks {
  width: 366px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  position: relative;
  .wallet-info {
    background: #262932;
    border-radius: 4px;
    height: 68px;
    width: 180px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    div {
      width: calc(100% - 48px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    div:nth-child(1) {
      font-family: PingFangSC-Regular, cursive;
      font-size: 14px;
      color: #ffffff;
      font-weight: 400;
    }
    div:nth-child(2) {
      font-family: DIN-Medium, cursive;
      font-size: 16px;
      color: #ffffff;
      font-weight: 600;
    }
  }
  .btn {
    position: absolute;
    height: 32px;
    width: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--aux-color);
    border-radius: 50%;
    left: calc(50% - 16px);
    top: calc(50% - 16px);
  }

  .disable {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .active {
    cursor: pointer;
    &:hover {
      box-shadow: 12px 12px 24px #ffffff30 inset;
    }
    &:active {
      box-shadow: 12px 12px 24px #ffffff60 inset;
    }
  }
}
</style>
