<template>
  <div class="error-404">
    <el-image :src="img404" class="icon-back">
      <template #placeholder>
        <div></div>
      </template>
      <template #error>
        <div></div>
      </template>
    </el-image>
    <div class="text-1">抱歉</div>
    <div class="text-2">您访问页面出错了！</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'error-404',
  props: {},
  components: {},
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const img404 = require('@/assets/image/message/pop_wu_02.png');
    return { img404 };
  }
});
</script>

<style lang="scss" scoped>
.error-404 {
  height: calc(100vh - 176px);
  width: 1528px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 20px;
  .text-1 {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .text-2 {
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #c2c7d2;
    font-weight: 400;
  }
  .icon-back {
    height: 280px;
    width: 380px;
  }
}
</style>
