<template>
  <div class="no-data-page">
    <el-image :src="imgNoData" class="icon-back">
      <template #placeholder>
        <div></div>
      </template>
      <template #error>
        <div></div>
      </template>
    </el-image>
    <div>暂无记录</div>
    <div>没有记录就要创造记录呀！</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NoDataPage',
  props: {},
  components: {},
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const imgNoData = require('@/assets/image/message/pop_wu_01.png');
    return { imgNoData };
  }
});
</script>

<style lang="scss" scoped>
.no-data-page {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  div:nth-child(2) {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #ffffff;
    font-weight: 600;
    line-height: 14px;
    margin-top: 12px;
  }
  div:nth-child(3) {
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #ffffff;
    font-weight: 400;
    line-height: 14px;
    margin-top: 18px;
  }
  .icon-back {
    height: 280px;
    width: 380px;
  }
}
</style>
