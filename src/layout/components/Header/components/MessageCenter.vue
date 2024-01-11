<template>
  <div
    :class="{ 'message-center': true, 'active-message': showPopUps || route.name === 'MessageCenter' }"
    @click.stop="onShowPopUps(!showPopUps)"
  >
    <svg-icon name="Top_message"></svg-icon>
    <teleport to="#app">
      <div :class="{ 'message-pop-ups': true, 'done-pop-ups': !showPopUps }" @click.stop="closePopUps">
        <MessageCenterPopUps :show="showPopUps" @closeBox="closePopUps" />
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import MessageCenterPopUps from '@/layout/components/Header/components/MessageCenterPopUps.vue';

export default defineComponent({
  name: 'MessageCenter',
  components: { SvgIcon, MessageCenterPopUps },
  setup() {
    const { showPopUps, onShowPopUps, closePopUps, route } = popUpsMittBusHook('closeMessagePage', [], 'MessageCenter');

    return { showPopUps, onShowPopUps, closePopUps, route };
  }
});
</script>

<style lang="scss" scoped>
.active-message {
  background: var(--aux-color) !important;
}
.message-center {
  height: 48px;
  width: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(151, 151, 151, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s linear;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(151, 151, 151, 0.4);
    box-shadow: 0 4px 4px rgba(238, 158, 1, 0.2);
  }
  &:active {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(151, 151, 151, 0.4);
    box-shadow: 0 2px 8px rgba(238, 158, 1, 0.6);
  }
}
.done-pop-ups {
  transform: translateX(425px);
}
.message-pop-ups {
  width: 420px;
  position: absolute;
  top: 88px;
  right: 88px;
  background: var(--component-pop-ups-bg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  z-index: 150;
  transition: all 0.3s linear;
}
</style>
