<template>
  <div class="historical-analysis">
    <div class="historical-analysis-header">
<!--      <div class="historical-analysis-header-l">-->
<!--        <svg-icon name="Display_history"></svg-icon>-->
<!--        <span>历史分析</span>-->
<!--      </div>-->
<!--      <div class="historical-analysis-header-r">-->
<!--        <svg-icon name="last_more"></svg-icon>-->
<!--        <svg-icon name="next_more"></svg-icon>-->
<!--      </div>-->
    </div>
    <div class="historical-analysis-main">
      暂无数据分析
<!--      <el-tabs v-model="analysisTabActive">-->
<!--        <el-tab-pane :label="hotGameItem.team_name_1" name="0">-->
<!--          <div class="historical-analysis-main-tabs" v-for="i in 3" :key="i">-->
<!--            <div class="historical-analysis-main-tabs-flex">-->
<!--              <span>{{ hotGameItem.game_name }}</span>-->
<!--              <span>{{ hotGameItem.game_start_time }}</span>-->
<!--            </div>-->
<!--            <div class="historical-analysis-main-tabs-flex">-->
<!--              <el-image :src="hotGameItem.team_logo_1" class="hot-team1">-->
<!--                <template #placeholder>-->
<!--                  <div class="image-slot">-->
<!--                    <img :src="defaultTeamLogo" />-->
<!--                  </div>-->
<!--                </template>-->
<!--                <template #error>-->
<!--                  <div class="image-slot">-->
<!--                    <img :src="defaultTeamLogo" />-->
<!--                  </div>-->
<!--                </template>-->
<!--              </el-image>-->
<!--              <el-image :src="hotGameItem.team_logo_2" class="hot-team2">-->
<!--                <template #placeholder>-->
<!--                  <div class="image-slot">-->
<!--                    <img :src="defaultTeamLogo" />-->
<!--                  </div>-->
<!--                </template>-->
<!--                <template #error>-->
<!--                  <div class="image-slot">-->
<!--                    <img :src="defaultTeamLogo" />-->
<!--                  </div>-->
<!--                </template>-->
<!--              </el-image>-->
<!--            </div>-->
<!--            <div class="historical-analysis-main-tabs-flex">-->
<!--              <span>32</span>-->
<!--              <span>:</span>-->
<!--              <span>18</span>-->
<!--            </div>-->
<!--            <div class="historical-analysis-main-tabs-flex">-->
<!--              <span>{{ hotGameItem.team_name_1 }}</span>-->
<!--              <span>{{ hotGameItem.team_name_2 }}</span>-->
<!--            </div>-->
<!--            <div class="historical-analysis-main-tabs-flex">-->
<!--              <svg-icon name="trend_win"></svg-icon>-->
<!--            </div>-->
<!--            <div class="historical-analysis-main-tabs-flex">-->
<!--              胜-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-tab-pane>-->
<!--        <el-tab-pane :label="hotGameItem.team_name_2" name="1">-->
<!--          <div class="historical-analysis-main-tabs" v-for="i in 3" :key="i">-->
<!--            <div class="historical-analysis-main-tabs-flex">-->
<!--              <span>{{ hotGameItem.game_name }}</span>-->
<!--              <span>{{ hotGameItem.game_start_time }}</span>-->
<!--            </div>-->
<!--            <div class="historical-analysis-main-tabs-flex">-->
<!--              <el-image :src="hotGameItem.team_logo_1" class="hot-team1">-->
<!--                <template #placeholder>-->
<!--                  <div class="image-slot">-->
<!--                    <img :src="defaultTeamLogo" />-->
<!--                  </div>-->
<!--                </template>-->
<!--                <template #error>-->
<!--                  <div class="image-slot">-->
<!--                    <img :src="defaultTeamLogo" />-->
<!--                  </div>-->
<!--                </template>-->
<!--              </el-image>-->
<!--              <el-image :src="hotGameItem.team_logo_2" class="hot-team2">-->
<!--                <template #placeholder>-->
<!--                  <div class="image-slot">-->
<!--                    <img :src="defaultTeamLogo" />-->
<!--                  </div>-->
<!--                </template>-->
<!--                <template #error>-->
<!--                  <div class="image-slot">-->
<!--                    <img :src="defaultTeamLogo" />-->
<!--                  </div>-->
<!--                </template>-->
<!--              </el-image>-->
<!--            </div>-->
<!--            <div class="historical-analysis-main-tabs-flex">-->
<!--              <span>32</span>-->
<!--              <span>:</span>-->
<!--              <span>18</span>-->
<!--            </div>-->
<!--            <div class="historical-analysis-main-tabs-flex">-->
<!--              <span>{{ hotGameItem.team_name_1 }}</span>-->
<!--              <span>{{ hotGameItem.team_name_2 }}</span>-->
<!--            </div>-->
<!--            <div class="historical-analysis-main-tabs-flex">-->
<!--              <svg-icon name="trend_win"></svg-icon>-->
<!--            </div>-->
<!--            <div class="historical-analysis-main-tabs-flex">-->
<!--              胜-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-tab-pane>-->
<!--      </el-tabs>-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import defaultImageHook from '@/hooks/defaultImageHook';

export default defineComponent({
  name: 'HistoricalAnalysis',
  components: { SvgIcon },
  props: {
    hotGameItem: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { defaultTeamLogo } = defaultImageHook();
    const analysisTabActive = ref('0');
    onMounted(() => {
      // console.log('这里呢', props.hotGameItem);
    });
    return {
      analysisTabActive,
      defaultTeamLogo
    };
  }
});
</script>

<style lang="scss" scoped>
.historical-analysis {
  height: 140px;
  width: 1038px;
  margin-left: 20px;
  //height: 284px;
  //width: 594px;
  padding: 25px 28px;
  overflow: hidden;
  background-color: var(--component-bg);
  border-radius: 8px;
  &-header {
    display: flex;
    justify-content: space-between;
    height: 30px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    &-l {
      display: flex;
      align-items: center;
      :deep(.icon-Display_history) {
        width: 16px;
        height: 16px;
      }
      span {
        margin-left: 12px;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #ffffff;
        letter-spacing: 0;
        font-weight: 500;
      }
    }
    &-r {
      display: flex;
      :deep(.icon-last_more) {
        width: 16px;
        height: 16px;
        margin-right: 24px;
        opacity: 0.6;
      }
      :deep(.icon-next_more) {
        width: 16px;
        height: 16px;
      }
    }
  }
  &-main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 72px;
    margin-top: 20px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #535865;
    letter-spacing: 0;
    font-weight: 400;
    :deep(.el-tabs__item) {
      color: #535865;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      letter-spacing: 0;
      font-weight: 500;
    }
    :deep(.el-tabs__item:hover) {
      color: #C2C7D2;
    }
    :deep(.el-tabs__item.is-active) {
      color: #C2C7D2;
    }
    :deep(.el-tabs__active-bar) {
      background-color: #EE9E01;
    }
    :deep(.el-tabs__nav-wrap::after) {
      background-color: rgba(255, 255, 255, 0.1);
    }
    &-tabs {
      display: flex;
      height: 66px;
      align-items: center;
      &-flex {
        display: flex;
        :deep(.hot-team1) {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 36px;
          height: 36px;
          border-radius: 36px;
          background: #404145;
          border: 2px solid rgba(23,25,30,1);
          img {
            width: 24px;
            height: 24px;
            border-radius: 24px;
          }
        }
        :deep(.hot-team2) {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 36px;
          height: 36px;
          border-radius: 36px;
          background: #404145;
          border: 2px solid rgba(23,25,30,1);
          margin-left: -6px;
          img {
            width: 24px;
            height: 24px;
            border-radius: 24px;
          }
        }
      }
      &-flex:nth-child(1) {
        flex-direction: column;
        font-size: 14px;
        letter-spacing: 0;
        font-weight: 500;
        span {
          width: 132px;
          height: 30px;
          line-height: 30px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        span:nth-child(1) {
          font-family: PingFangSC-Medium;
          color: #FFFFFF;
        }
        span:nth-child(2) {
          font-family: DIN-Medium, cursive;
          color: #535865;
        }
      }
      &-flex:nth-child(2) {
        width: 100px;
      }
      &-flex:nth-child(3) {
        width: 120px;
        justify-content: center;
        span {
          font-family: DIN-Medium, cursive;
          font-size: 18px;
          letter-spacing: 0;
          line-height: 22px;
          font-weight: 500;
          color: #FFFFFF;
        }
        span:nth-child(1) {
          color: #EE9E01;
        }
      }
      &-flex:nth-child(4) {
        width: 120px;
        flex-direction: column;
        span {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          letter-spacing: 0;
          font-weight: 500;
          color: #535865;
          height: 30px;
          line-height: 30px;
        }
        span:nth-child(1) {
          color: #C2C7D2;
        }
      }
      &-flex:nth-child(5) {
        width: 80px;
        :deep(.icon-trend_win) {
          width: 16px;
          height: 16px;
        }
      }
      &-flex:nth-child(6) {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #DC5A06;
        letter-spacing: 0;
        font-weight: 500;
      }
    }
  }
}
</style>
