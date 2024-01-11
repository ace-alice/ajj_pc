<template>
  <div class="video-bar">
    <el-image style="height: 100%; width: 256px; border-radius: 14px" :src="videoInfo['path']" fit="cover">
      <template #placeholder>
        <div></div>
      </template>
      <template #error>
        <img style="height: 100%; width: 256px; border-radius: 14px" :src="defaultVideoPlaceholder" alt="" />
      </template>
    </el-image>
    <div class="video-bar-main">
      <div class="video-bar-main-title">
        1
      </div>
      <div class="video-bar-main-team">
        <div>1</div>
        <div>2</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import defaultImageHook from '@/hooks/defaultImageHook';

export default defineComponent({
  name: 'VideoBar',
  props: {
    videoInfo: {
      type: Object,
      default: () => {
        return {
          id: null
        };
      }
    }
  },
  components: {},
  setup() {
    const { defaultVideoPlaceholder } = defaultImageHook();

    return { defaultVideoPlaceholder };
  }
});
</script>

<style lang="scss" scoped>
.video-bar {
  display: flex;
  height: 144px;
  width: 650px;
  background-color: var(--component-bg);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 24px;
}
</style>
