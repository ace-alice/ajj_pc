<template>
  <div class="wallet-amount">
    <div class="title">中心钱包金额</div>
    <div class="amount">
      <CountTo :startVal="Number(startVal)" :endVal="Number(priceToFixed(amount)) || 0" :duration="1000" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue';
import { priceToFixed } from '@/utils/numberFunction';
import CountTo from '@/components/VueCountTo/index.vue';
import { getCenterBalance } from '@/api/wallet';

export default defineComponent({
  name: 'WalletAmount',
  props: {},
  components: { CountTo },
  setup() {
    const amount = ref(0);

    const startVal = ref(0);

    watch(
      () => amount.value,
      (_, oldVal) => {
        startVal.value = oldVal;
      }
    );

    function toGetCenterBalance() {
      getCenterBalance().then((res: any) => {
        if (+res.code === 1) {
          amount.value = res.data.amount;
        }
      });
    }

    const { proxy }: any = getCurrentInstance();

    onMounted(() => {
      proxy.mittBus.on('toGetCenterBalance', () => {
        toGetCenterBalance();
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off('toGetCenterBalance');
    });

    return { amount, priceToFixed, startVal };
  }
});
</script>

<style lang="scss" scoped>
.wallet-amount {
  width: 278px;
  height: 314px;
  background: #17191e;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > div {
    width: calc(100% - 48px);
    font-weight: 600;
  }
  .title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #ffffff;
    margin: 24px 0;
  }
  .amount {
    font-family: DIN-Medium, cursive;
    font-size: 30px;
    color: var(--aux-color);
    margin-bottom: 24px;
  }
}
</style>
