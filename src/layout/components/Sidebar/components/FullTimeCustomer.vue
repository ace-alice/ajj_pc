<template>
  <div class="FullTimeCustomer">
    <teleport to="#app">
      <div :class="{ 'full-timeCustomer-pop-ups': true, 'full-time-customer-done-pop-ups': !showPopUps }" @click.stop>
        <div class="top-bar">
          <el-image class="tag-image" style="height: 48px; width: 48px" :src="fullTimeImage" fit="cover">
            <template #placeholder>
              <div></div>
            </template>
            <template #error>
              <img style="height: 48px; width: 48px" :src="defaultTeamLogo" alt="" />
            </template>
          </el-image>
          <div>小艾小助手</div>
          <div class="close-bar" @click.stop="closePopUps"></div>
        </div>
        <iframe :src="contactAllTimeUrl" class="iframe" />
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import { contactAllTimeUrl } from '@/api/contact-us';
import defaultImageHook from '@/hooks/defaultImageHook';

export default defineComponent({
  name: 'FullTimeCustomer',
  props: {},
  components: {},
  setup() {
    const { showPopUps, onShowPopUps, closePopUps } = popUpsMittBusHook('showFullTimeCustomer', [], '');

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fullTimeImage = require('@/assets/image/icons/full-time.png');

    const { defaultTeamLogo } = defaultImageHook();

    return { showPopUps, onShowPopUps, closePopUps, contactAllTimeUrl, defaultTeamLogo, fullTimeImage };
  }
});
</script>

<style lang="scss" scoped>
.full-timeCustomer-pop-ups {
  position: absolute;
  bottom: 0;
  right: 88px;
  padding: 0;
  margin: 0;
  height: 707px;
  width: 387px;
  //background: var(--component-pop-ups-bg);
  background-color: #3e4a53;
  z-index: 2000;
  //border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  .top-bar {
    display: flex;
    align-items: center;
    width: 387px;
    height: 80px;
    background: var(--aux-color);
    position: relative;
    z-index: 20;
    .close-bar {
      position: absolute;
      height: 60px;
      width: 60px;
      right: 20px;
      top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:after {
        content: '';
        height: 4px;
        width: 24px;
        border-radius: 2px;
        background-color: #ffffff;
      }
    }
    .tag-image {
      border-radius: 50%;
      background-color: #000000;
      margin: 0 24px 0 38px;
    }
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #ffffff;
    font-weight: 600;
  }
}
.full-time-customer-done-pop-ups {
  transform: translateY(100%);
  height: 0;
  padding-bottom: 0;
  border: none;
  overflow: hidden;
}
.iframe {
  width: 420px;
  height: 660px;
  border: 0;
  position: absolute;
  left: -16px;
  top: 60px;
}
</style>
