<template>
  <div class="TransferPopUps" @click.stop="onShowPopUps(!showPopUps)">
    <span class="bg-svg"> <svg-icon name="me_ wallet_transfer1" size="0.6" :bottom="4" /> </span>
    转账
    <teleport to="#app">
      <div :class="{ 'wallet-pop-ups': true, 'wallet-done-pop-ups': !showPopUps }" @click.stop="closePopUps">
        <div :class="{ 'wallet-page': true, 'wallet-page-done': !showPopUps }" @click.stop>
          <TransferPage @close="closePopUps" />
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import TransferPage from '@/views/wallet-manage/components/TransferPopUps/TransferPage.vue';

export default defineComponent({
  name: 'TransferPopUps',
  props: {},
  components: { TransferPage },
  setup() {
    const { showPopUps, onShowPopUps, closePopUps } = popUpsMittBusHook('closeTransferPopUps');

    return { showPopUps, onShowPopUps, closePopUps };
  }
});
</script>
