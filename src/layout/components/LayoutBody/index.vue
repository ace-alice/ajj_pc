<template>
  <div class="body-container">
    <div class="body-box">
      <router-view v-slot="{ Component }">
        <transition name="fade1">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';

export default defineComponent({
  name: 'Body',
  components: {},
  setup() {
    const { proxy }: any = getCurrentInstance();

    function onScrollHandler() {
      proxy.mittBus.emit('closeDownloadBar');
    }

    return { onScrollHandler };
  }
});
</script>

<style lang="scss" scoped>
.body-container {
  width: calc(100% - 88px);
  height: calc(100% - 88px);
  position: relative;
  .body-box {
    width: 1528px;
    margin: auto;
    min-height: calc(100% - 88px);
    position: relative;
  }
}
.fade1-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.fade1-enter-active,
.fade1-leave-active {
  transition: all 0.5s linear;
  transform: translateX(0);
}
.fade1-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
