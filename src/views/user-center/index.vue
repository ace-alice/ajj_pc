<template>
  <div class="user-center">
    <div class="user-center-back" @click="routerBack">
      <svg-icon name="last_more"></svg-icon>
    </div>
    <div class="user-center-main">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="basic-info">
          <BasicInfo />
        </el-tab-pane>
        <el-tab-pane label="存款记录" name="in-record">
          <InRecord :active="activeName" />
        </el-tab-pane>
        <el-tab-pane label="取款记录" name="out-record">
          <OutRecord :active="activeName" />
        </el-tab-pane>
        <el-tab-pane label="交易记录" name="trade-record">
          <TradeRecord :active="activeName" />
        </el-tab-pane>
        <el-tab-pane label="注单记录" name="betting-record">
          <BettingRecord :active="activeName" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BasicInfo from '@/views/user-center/components/BasicInfo.vue';
import TradeRecord from '@/views/user-center/components/TradeRecord.vue';
import InRecord from '@/views/user-center/components/InRecord.vue';
import OutRecord from '@/views/user-center/components/OutRecord.vue';
import BettingRecord from '@/views/user-center/components/BettingRecord.vue';

export default defineComponent({
  name: 'UserCenter',
  props: {},
  components: { BasicInfo, TradeRecord, InRecord, BettingRecord, OutRecord },
  setup() {
    const route = useRoute();

    const code = computed(() => {
      return route.query?.user_code || 'basic-info';
    });

    watch(
      () => code.value,
      () => {
        activeName.value = code.value;
      }
    );

    const activeName = ref(code.value);

    function handleClick() {}

    const router = useRouter();

    function routerBack() {
      router.go(-1);
    }

    return { activeName, handleClick, routerBack };
  }
});
</script>

<style lang="scss" scoped>
.user-center {
  width: 100%;
  min-height: calc(100% - 115px);
  margin: 37px 0 78px;
  background: #363841;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  position: relative;
  //overflow: hidden;
  .user-center-back {
    position: absolute;
    top: 32px;
    left: 66px;
    opacity: 0.6;
    font-size: 22px;
    cursor: pointer;
    transition: opacity 0.2s linear;
    &:hover {
      opacity: 1;
    }
  }
  .user-center-main {
    width: 1186px;
    margin: 90px auto 48px;
    //noinspection CssInvalidPseudoSelector
    :deep(.el-tabs) {
      .el-tabs__header {
        .el-tabs__item {
          width: 235px;
          text-align: center;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: #c2c7d2;
          line-height: unset !important;
          letter-spacing: 0;
          font-weight: 600;
        }
        .is-active {
          color: #fff;
        }
      }
      .el-tabs__nav-wrap::after {
        background: #ffffff10;
      }
      .el-tabs__active-bar {
        background: var(--aux-color);
        width: 220px !important;
      }
    }
  }

  //noinspection CssInvalidPseudoSelector
  :deep(.is-background) {
    margin-top: 26px;
    .el-pager {
      li {
        font-family: PingFangSC-Medium;
        background: #ffffff05;
        border-radius: 8px;
        color: #ffffff60;
        font-weight: 600;
        font-size: 16px;
        &:hover {
          color: #ffffff;
        }
      }
      .is-active {
        background: var(--aux-color) !important;
        color: #fff;
      }
    }
    .btn-prev,
    .btn-next {
      background: none;
      color: #ffffff60;
      &:hover {
        color: #fff;
      }
      .el-icon {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
  .tabs-box {
    //noinspection CssInvalidPseudoSelector
    :deep(.el-tabs) {
      .el-tabs__header {
        .el-tabs__item {
          width: 365px;
          text-align: center;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #c2c7d2;
          letter-spacing: 0;
          font-weight: 500;
        }
        .is-active {
          color: #fff;
        }
      }
      .el-tabs__nav-wrap::after {
        background: #ffffff10;
      }
      .el-tabs__active-bar {
        background: var(--aux-color);
        width: 340px !important;
      }
    }
  }

  //noinspection CssInvalidPseudoSelector
  :deep(.el-table) {
    --el-table-tr-bg-color: #00000000;
    --el-table-bg-color: #00000000;
    --el-table-row-hover-bg-color: #00000000;
    --el-table-border-color: #ffffff00;
    --el-table-border: 1px solid #ffffff20;
    --el-table-header-bg-color: #00000020;
    --el-table-header-text-color: #c2c7d2;
    overflow: visible;
    margin-top: 13px;
    .el-table td.el-table__cell,
    .el-table th.el-table__cell.is-leaf {
      border-bottom: none;
    }
    .el-table__body-wrapper {
      overflow: visible;
    }
    .el-scrollbar {
      overflow: visible;
    }
    .el-table__cell {
      padding: 16px 0;
      font-family: PingFangSC-Regular, cursive;
      font-size: 16px;
      color: #c2c7d2;
      font-weight: 400;
    }
    .el-table__header {
      .el-table__cell {
        font-family: PingFangSC-Regular, cursive;
        font-size: 18px !important;
        color: #c2c7d2;
        font-weight: 600;
        height: 64px;
      }
      th.el-table__cell.is-leaf {
        border-bottom: none;
      }
    }
    .el-table__body-wrapper {
      overflow: visible;
    }
    .el-table__body {
      padding: 5px 0;
    }
    .el-table__expanded-cell {
      //position: absolute !important;
      height: 0;
      padding: 0;
      border: none !important;
      z-index: 200;
    }
    .el-table__expanded-cell:hover {
      background-color: #2a2c33 !important;
    }
    .el-table__expand-column {
      .el-table__expand-icon {
        display: none;
      }
    }
  }
}
</style>
