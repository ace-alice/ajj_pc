<template>
  <div class="error-ip-limit">
    <el-image :src="img404" class="icon-back">
      <template #placeholder>
        <div></div>
      </template>
      <template #error>
        <div></div>
      </template>
    </el-image>
    <div class="text-1">抱歉</div>
    <div class="text-2">您所在地区受到限制！</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'error-ip-limit',
  props: {},
  components: {},
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const img404 = require('@/assets/image/message/pop_wu_03.png');
    return { img404 };
  }
});
</script>

<style lang="scss" scoped>
.error-ip-limit {
  height: 100%;
  width: 100%;
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
