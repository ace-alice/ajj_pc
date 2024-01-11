<template>
  <div class="ActivityBox">
    <teleport to="#app">
      <div :class="{ 'activity-pop-ups': true, 'activity-done-pop-ups': !showPopUps }" @click.stop>
        <div class="top-bar">
          <div class="activity-title">{{ activityInfo['headerTitle'] }}</div>
          <div class="close-bar" @click.stop="closePopUps"></div>
        </div>
        <iframe :src="activityInfo['gameUrl']" class="iframe" />
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import openCustomerService from '@/hooks/OpenCustomerService';

export default defineComponent({
  name: 'ActivityBox',
  props: {},
  components: {},
  setup() {
    const { showPopUps, onShowPopUps, closePopUps } = popUpsMittBusHook('showActivityBox', [], '');

    const store = useStore();

    const router = useRouter();

    const activityInfo = computed(() => {
      return store.getters.currentActivity;
    });

    const { open } = openCustomerService();

    onMounted(() => {
      window.addEventListener('message', (eve) => {
        const data = eve.data;
        switch (data) {
          case 'Home':
            closePopUps();
            router.push({ name: 'Home' });
            break;
          case 'CustomerService':
            open();
            break;
        }
      });
    });

    return { showPopUps, onShowPopUps, closePopUps, activityInfo };
  }
});
</script>

<style lang="scss" scoped>
.activity-pop-ups {
  position: absolute;
  bottom: 0;
  right: 88px;
  padding: 0;
  margin: 0;
  height: 800px;
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
    justify-content: center;
    width: 387px;
    height: 80px;
    background: var(--aux-color);
    position: relative;
    z-index: 20;
    .activity-title {
      width: 200px;
      text-align: center;
    }
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
.activity-done-pop-ups {
  transform: translateY(100%);
  height: 0;
  padding-bottom: 0;
  border: none;
  overflow: hidden;
}
.iframe {
  width: 387px;
  height: 710px;
  border: 0;
  position: absolute;
  left: 0;
  top: 80px;
}
</style>
