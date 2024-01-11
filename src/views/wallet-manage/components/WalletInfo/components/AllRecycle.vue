oih
<template>
  <div class="AllRecycle" @mouseenter="hover = true" @mouseleave="hover = false">
    <svg-icon name="me_ wallet_statistical" size="0.9" @click="allRecycle" />
    <div class="hover-box" v-show="hover">
      <div>将场馆钱包中的全部金额转至中心钱包</div>
      <div class="hover-box-down">
        <div></div>
        <div></div>
        <svg-icon name="me_ wallet_into" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'AllRecycle',
  props: {},
  components: { SvgIcon },
  setup() {
    const hover = ref(false);

    const loading = ref(false);

    const store = useStore();

    const walletList = computed(() => {
      return store.getters.getWalletList;
    });

    async function allRecycle() {
      if (loading.value) return;
      loading.value = true;
      await store.dispatch('wallet/recycleAmountAllAmount');
      loading.value = false;
      walletList.value.forEach((wallet: any) => {
        store.dispatch('wallet/toGetTripartiteBalance', { game_id: +wallet.gameId }).finally(() => {});
      });
      store.dispatch('wallet/getCenterAmount').then(() => {});
    }

    return { hover, allRecycle };
  }
});
</script>

<style lang="scss" scoped>
.AllRecycle {
  position: absolute;
  left: unset !important;
  right: -128px !important;
  top: 0;
  height: 56px;
  width: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #ee9e0110;
  border: 1px solid #ee9e0140;
  border-radius: 8px;
  &:hover {
    background: #ee9e0120;
    border: 1px solid #ee9e0140;
  }
  &:active {
    background: #ee9e0140;
    border: 1px solid #ee9e0180;
  }
  .hover-box {
    position: absolute;
    font-family: PingFangSC-Regular, cursive;
    font-size: 14px;
    color: #ffffff;
    font-weight: 400;
    background: #00000040;
    border-radius: 8px;
    width: 282px;
    height: 74px;
    top: 70px;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .hover-box-down {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 86%;
      margin-top: 9px;
      div {
        flex-shrink: 0;
      }
      div:nth-child(1) {
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background: var(--aux-color);
      }
      div:nth-child(2) {
        flex-grow: 1;
        margin: 0 5px;
        height: 0.1px;
        border-bottom: 1px dashed #fff;
      }
    }
  }
}
</style>
