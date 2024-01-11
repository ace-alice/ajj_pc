<template>
  <div :class="{ RefreshBox: true }" @click="refresh">
    <svg-icon :class="{ load: loading }" name="me_ wallet_refresh" size="0.6" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'RefreshBox',
  props: {},
  components: { SvgIcon },
  setup() {
    const loading = ref(false);

    const store = useStore();

    const walletList = computed(() => {
      return store.getters.getWalletList;
    });

    function refresh() {
      if (loading.value) return;
      loading.value = true;
      for (const wallet of walletList.value) {
        store.dispatch('wallet/toGetTripartiteBalance', { game_id: wallet.gameId }).finally(() => {});
      }
      store.dispatch('wallet/getCenterAmount').finally(() => {});
      setTimeout(() => {
        loading.value = false;
      }, 1000);
    }

    return { loading, refresh };
  }
});
</script>

<style lang="scss" scoped>
.RefreshBox {
  position: absolute;
  left: unset !important;
  right: 28px !important;
  top: 18px;
  background: #00000020;
  height: 48px;
  width: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.load {
  animation: run 1s ease-in-out infinite;
}
@keyframes run {
  0% {
    transform: rotateZ(0);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>
