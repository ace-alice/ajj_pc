<template>
  <div class="DepositPopUps" @click.stop="onShowPopUpsHandle">
    <span class="bg-svg"> <svg-icon name="me_ wallet_deposit1" size="0.6" :bottom="4" /> </span>存款
    <teleport to="#app">
      <div :class="{ 'wallet-pop-ups': true, 'wallet-done-pop-ups': !showPopUps }" @click.stop="closePopUps">
        <div :class="{ 'wallet-page': true, 'wallet-page-done': !showPopUps }" @click.stop>
          <DepositPage @close="closePopUps" :key="keyValue" />
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import DepositPage from '@/views/wallet-manage/components/DepositPopUps/DepositPage.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';

export default defineComponent({
  name: 'DepositPopUps',
  props: {},
  components: { SvgIcon, DepositPage },
  setup() {
    const { showPopUps, onShowPopUps, closePopUps } = popUpsMittBusHook('closeDepositPopUps');

    const keyValue = ref(1);

    function onShowPopUpsHandle() {
      keyValue.value++;
      onShowPopUps(true);
    }

    return { showPopUps, onShowPopUpsHandle, closePopUps, keyValue };
  }
});
</script>
