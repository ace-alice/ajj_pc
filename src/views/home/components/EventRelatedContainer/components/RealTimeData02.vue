<template>
  <div class="real-time-data-02">
    <div class="real-data">
      <svg-icon name="Display_Real-time"></svg-icon>
      <span>实时数据</span>
    </div>
    <div class="real-team">
      <span>{{ hotGameItem.team_name_1 }}</span>
      <span>{{ hotGameItem.team_name_2 }}</span>
    </div>
    <div class="real-time-progress">
      <el-progress :stroke-width="8" :percentage="parseInt(hotGameItem.id / 230)" color="#06DCD8">
        <span>{{ parseInt(hotGameItem.id / 23) }}</span>
      </el-progress>
      <div class="real-title">经济</div>
      <el-progress :stroke-width="8" :percentage="parseInt(hotGameItem.id / 130)" color="#06DCD8">
        <span>{{ parseInt(hotGameItem.id / 13) }}</span>
      </el-progress>
    </div>
    <div class="real-time-progress real-time-progress1">
      <el-progress :stroke-width="8" :percentage="parseInt(hotGameItem.id / 120)" color="#735CD0">
        <span>{{ parseInt(hotGameItem.id / 12) }}</span>
      </el-progress>
      <div class="real-title">等级</div>
      <el-progress :stroke-width="8" :percentage="parseInt(hotGameItem.id / 200)" color="#735CD0">
        <span>{{ parseInt(hotGameItem.id / 20) }}</span>
      </el-progress>
    </div>
    <div class="real-time-progress">
      <el-progress :stroke-width="8" :percentage="parseInt(hotGameItem.id / 80)" color="#EA3D3D">
        <span>{{ parseInt(hotGameItem.id / 8) }}</span>
      </el-progress>
      <div class="real-title">经验</div>
      <el-progress :stroke-width="8" :percentage="parseInt(hotGameItem.id / 140)" color="#EA3D3D">
        <span>{{ parseInt(hotGameItem.id / 14) }}</span>
      </el-progress>
    </div>
    <div class="real-time-progress real-time-progress1">
      <el-progress :stroke-width="8" :percentage="parseInt(hotGameItem.id / 220)" color="##DCAC06">
        <span>{{ parseInt(hotGameItem.id / 22) }}</span>
      </el-progress>
      <div class="real-title">正补</div>
      <el-progress :stroke-width="8" :percentage="parseInt(hotGameItem.id / 50)" color="##DCAC06">
        <span>{{ parseInt(hotGameItem.id / 5) }}</span>
      </el-progress>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';

export default defineComponent({
  name: 'RealTimeData02',
  components: { SvgIcon },
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
.real-time-data-02 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 286px;
  width: 416px;
  padding: 25px 0;
  overflow: hidden;
  border-radius: 8px;
  background-color: var(--component-bg);
  .real-data {
    display: flex;
    align-items: center;
    width: 354px;
    margin: 0 auto;
    :deep(.icon-Display_Real-time) {
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }
    span {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 500;
    }
  }
  .real-team {
    display: flex;
    justify-content: space-between;
    width: 354px;
    margin: 0 auto;
    span {
      font-family: PingFangSC-Medium;
      line-height: 80px;
      font-size: 16px;
      color: #c2c7d2;
      letter-spacing: 0;
      font-weight: 500;
    }
  }
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
      color: #ffffff;
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
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 500;
    }
  }
  .real-time-progress1 {
    height: 30px;
  }
}
</style>
