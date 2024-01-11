<template>
  <div class="WithdrawPopUps" @click.stop="onShowPopUpsHandle(!showPopUps)">
    <span class="bg-svg"> <svg-icon name="me_ wallet_withdrawals1" size="0.6" :bottom="4" /> </span>取款
    <teleport to="#app">
      <div :class="{ 'wallet-pop-ups': true, 'wallet-done-pop-ups': !showPopUps }" @click.stop="closePopUps">
        <div :class="{ 'wallet-page': true, 'wallet-page-done': !showPopUps }" @click.stop>
          <WithdrawPage @close="closePopUps" :key="keyValue" />
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import WithdrawPage from '@/views/wallet-manage/components/WithdrawPopUps/WithdrawPage.vue';

export default defineComponent({
  name: 'WithdrawPopUps',
  props: {},
  components: { WithdrawPage },
  setup() {
    const { showPopUps, onShowPopUps, closePopUps } = popUpsMittBusHook('closeWithdrawPopUps', [], '');

    const keyValue = ref(1);

    function onShowPopUpsHandle() {
      keyValue.value++;
      onShowPopUps(true);
    }

    return { showPopUps, closePopUps, onShowPopUpsHandle, keyValue };
  }
});
</script>
