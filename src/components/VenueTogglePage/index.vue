<template>
  <div class="VenueTogglePage">
    <teleport to="#app">
      <div class="venue-toggle-page" v-show="show">
        <el-image :src="bgSvgValue" class="icon-back">
          <template #placeholder>
            <div></div>
          </template>
          <template #error>
            <div></div>
          </template>
        </el-image>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';

export default defineComponent({
  name: 'VenueTogglePage',
  props: {},
  components: {},
  setup() {
    const show = ref(false);

    const { proxy }: any = getCurrentInstance();

    const bgSvgValue = ref('wait_esports');

    onMounted(() => {
      proxy.mittBus.on(
        'showVenueTogglePage',
        (value: { bool: boolean; bgSvg: string } = { bool: true, bgSvg: 'wait_esports' }) => {
          bgSvgValue.value = value.bgSvg ? require(`@/assets/image/message/${value.bgSvg}.png`) : '';
          show.value = value.bool;
        }
      );
    });

    onUnmounted(() => {
      proxy.mittBus.off('showVenueTogglePage');
    });

    return { show, bgSvgValue };
  }
});
</script>

<style lang="scss" scoped>
.VenueTogglePage {
}
.venue-toggle-page {
  height: calc(100% - 88px);
  width: calc(100% - 88px);
  background: #000;
  position: absolute;
  top: 88px;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  .icon-back {
    height: 487px;
    width: 740px;
  }
}
</style>
