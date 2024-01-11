<template>
  <div class="real-time-data-01">
    <div class="real-time-progress">
      <el-progress :stroke-width="8" :percentage="parseInt(hotGameItem.id / 240)" color="#5371DC">
        <span>{{ parseInt(hotGameItem.id / 24) }}</span>
      </el-progress>
      <div class="real-title">推塔</div>
      <el-progress :stroke-width="8" :percentage="parseInt(hotGameItem.id / 120)" color="#5371DC">
        <span>{{ parseInt(hotGameItem.id / 12) }}</span>
      </el-progress>
    </div>
    <div class="real-time-progress real-time-progress1">
      <el-progress :stroke-width="8" :percentage="parseInt(hotGameItem.id / 180)" color="#29CA6B">
        <span>{{ parseInt(hotGameItem.id / 18) }}</span>
      </el-progress>
      <div class="real-title">兵营</div>
      <el-progress :stroke-width="8" :percentage="parseInt(hotGameItem.id / 140)" color="#29CA6B">
        <span>{{ parseInt(hotGameItem.id / 14) }}</span>
      </el-progress>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RealTimeData01',
  components: {},
  props: {
    hotGameItem: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    return {};
  }
});
</script>

<style lang="scss" scoped>
.real-time-data-01 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 117px;
  width: 412px;
  overflow: hidden;
  border-radius: 8px;
  background-color: var(--component-bg);
  margin-top: 27px;
  .real-time-progress {
    display: flex;
    align-items: center;
    width: 354px;
    height: 70px;
    margin: 0 auto;
    div {
      display: flex;
      flex: 1;
      justify-content: center;
    }
    .real-title {
      opacity: 0.6;
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #FFFFFF;
      letter-spacing: 0;
      font-weight: 500;
    }
    :deep(.el-progress-bar__outer) {
      width: 118px;
      background: #404145;
    }
    :deep(.el-progress__text) {
      position: absolute;
      top: -24px;
      left: 0;
      font-family: DIN-Medium, cursive;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      font-weight: 500;
    }
  }
  .real-time-progress1 {
    height: 30px;
  }
}
</style>
