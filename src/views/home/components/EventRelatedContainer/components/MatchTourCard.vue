<template>
  <div class="match-tour-card" @click="toIaESport">
    <div class="card-left">
      <el-image :src="hotGameItem.game_logo" class="hot-image">
        <template #placeholder>
          <div class="image-slot">
            <img :src="defaultTeamLogo" />
          </div>
        </template>
        <template #error>
          <div class="image-slot">
            <img :src="defaultTeamLogo" />
          </div>
        </template>
      </el-image>
      <span class="card-left-name">{{ hotGameItem.game_name }}</span>
      <el-image :src="hotGameItem.team_logo_1" class="hot-team1">
        <template #placeholder>
          <div class="image-slot">
            <img :src="defaultTeamLogo" />
          </div>
        </template>
        <template #error>
          <div class="image-slot">
            <img :src="defaultTeamLogo" />
          </div>
        </template>
      </el-image>
      <el-image :src="hotGameItem.team_logo_2" class="hot-team2">
        <template #placeholder>
          <div class="image-slot">
            <img :src="defaultTeamLogo" />
          </div>
        </template>
        <template #error>
          <div class="image-slot">
            <img :src="defaultTeamLogo" />
          </div>
        </template>
      </el-image>
      <div class="card-left-event">
        <span>{{ hotGameItem.event_name }}</span>
      </div>
      <div class="card-left-data">
        <span>{{ parseTime(hotGameItem.game_start_time, '{y}-{m}-{d} {h}:{i}') }}</span>
      </div>
      <div class="card-left-info">
        <span class="card-left-info-team">{{ hotGameItem.team_name_1 }}</span>
        <span class="card-left-info-odds">{{
          hotGameItem.points.team_points instanceof Array && hotGameItem.points.team_points.length > 0
            ? hotGameItem.points.team_points[0].point
            : '---'
        }}</span>
        <svg-icon name="trend_up"></svg-icon>
        <span class="card-left-info-team">{{ hotGameItem.team_name_2 }}</span>
        <span class="card-left-info-odds">{{
          hotGameItem.points.team_points instanceof Array && hotGameItem.points.team_points.length > 1
            ? hotGameItem.points.team_points[1].point
            : '---'
        }}</span>
        <svg-icon name="trend_down"></svg-icon>
      </div>
      <!--      <div class="card-left-team">-->
      <!--        <span>{{ hotGameItem.team_name_1 }}</span>-->
      <!--        <span>{{ hotGameItem.team_name_2 }}</span>-->
      <!--      </div>-->
      <!--      <div class="card-left-odds">-->
      <!--        <span>{{ hotGameItem.points.team_points[0].point }}</span>-->
      <!--        <span>{{ hotGameItem.points.team_points[1].point }}</span>-->
      <!--      </div>-->
      <!--      <div class="card-left-icon">-->
      <!--        <svg-icon name="trend_up"></svg-icon>-->
      <!--        <svg-icon name="trend_down"></svg-icon>-->
      <!--      </div>-->
      <!--      <div class="card-left-time">-->
      <!--        <span>{{ hotGameItem.event_name }}</span>-->
      <!--        <span>{{ parseTime(hotGameItem.game_start_time, '{y}-{m}-{d} {h}:{i}') }}</span>-->
      <!--      </div>-->
    </div>
    <!--    <div class="card-right">-->
    <!--      <div class="card-right-title">胜率</div>-->
    <!--      <div class="card-right-rate">-->
    <!--        <div class="card-right-rate-main">-->
    <!--          暂未开启-->
    <!--          <div class="card-right-rate-main-l">-->
    <!--            <el-image :src="hotGameItem.team_logo_1" class="card-right-team1">-->
    <!--              <template #placeholder>-->
    <!--                <div class="image-slot">-->
    <!--                  <img :src="defaultTeamLogo" />-->
    <!--                </div>-->
    <!--              </template>-->
    <!--              <template #error>-->
    <!--                <div class="image-slot">-->
    <!--                  <img :src="defaultTeamLogo" />-->
    <!--                </div>-->
    <!--              </template>-->
    <!--            </el-image>-->
    <!--            <span>{{ hotGameItem.team_percentage_1 ? hotGameItem.team_percentage_1 : '0%' }}</span>-->
    <!--          </div>-->
    <!--          <span class="card-right-rate-main-m">VS</span>-->
    <!--          <div class="card-right-rate-main-r">-->
    <!--            <span>{{ hotGameItem.team_percentage_2 ? hotGameItem.team_percentage_2 : '0%' }}</span>-->
    <!--            <el-image :src="hotGameItem.team_logo_1" class="card-right-team2">-->
    <!--              <template #placeholder>-->
    <!--                <div class="image-slot">-->
    <!--                  <img :src="defaultTeamLogo" />-->
    <!--                </div>-->
    <!--              </template>-->
    <!--              <template #error>-->
    <!--                <div class="image-slot">-->
    <!--                  <img :src="defaultTeamLogo" />-->
    <!--                </div>-->
    <!--              </template>-->
    <!--            </el-image>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <div class="card-right-rate-progress">-->
    <!--          <span></span>-->
    <!--          <el-progress :show-text="false" :stroke-width="8" :percentage="30" color="#EE9E01" />-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import defaultImageHook from '@/hooks/defaultImageHook';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { parseTime } from '@/utils/timeFormat';

export default defineComponent({
  name: 'MatchTourCard',
  components: { SvgIcon },
  props: {
    hotGameItem: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { defaultTeamLogo } = defaultImageHook();

    const { proxy }: any = getCurrentInstance();

    function toIaESport() {
      proxy.mittBus.emit('toJumpBClient', {
        code: 'game_id_1',
        addPath: '&id=' + props.hotGameItem.id + '&category_id=' + props.hotGameItem.category_id
      });
    }
    return {
      defaultTeamLogo,
      parseTime,
      toIaESport
    };
  }
});
</script>

<style lang="scss" scoped>
.match-tour-card {
  width: 100%;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  & + .match-tour-card {
    margin-top: 24px;
  }
  & > div {
    background-color: var(--component-bg);
    border-radius: 8px;
    overflow: hidden;
    height: 100px;
  }
  .card-left {
    display: flex;
    align-items: center;
    width: 100%;
    //width: 800px;
    padding: 0 24px;
    .hot-image {
      width: 32px;
      height: 32px;
      img {
        width: 32px;
        height: 32px;
      }
    }
    &-name {
      //width: 120px;
      width: 160px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 500;
      //margin-left: 32px;
      margin-left: 50px;
    }
    &-event {
      width: 160px;
      margin-left: 50px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 400;
    }
    &-data {
      width: 340px;
      margin-left: 50px;
      font-family: DIN-Medium, cursive;
      font-size: 16px;
      color: #535865;
      letter-spacing: 0;
      font-weight: 500;
    }
    &-info {
      display: flex;
      align-items: center;
      &-team {
        display: flex;
        width: 140px;
        margin-left: 30px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #c2c7d2;
        letter-spacing: 0;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &-odds {
        display: flex;
        width: 60px;
        margin-left: 10px;
        font-family: DIN-Medium, cursive;
        font-size: 18px;
        color: #ffffff;
        font-weight: 500;
      }
      :deep(.icon-trend_up) {
        width: 10px;
        height: 16px;
      }
      :deep(.icon-trend_down) {
        width: 10px;
        height: 16px;
      }
    }
    &-team {
      display: flex;
      flex-direction: column;
      width: 100px;
      margin-left: 50px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #c2c7d2;
      letter-spacing: 0;
      font-weight: 400;
      span {
        line-height: 30px;
      }
    }
    &-odds {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      width: 60px;
      margin-left: 10px;
      font-family: DIN-Medium, cursive;
      font-size: 18px;
      color: #ffffff;
      font-weight: 500;
      span {
        line-height: 30px;
      }
    }
    &-icon {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 20px;
      height: 50px;
      margin-left: 10px;
      :deep(.icon-trend_up) {
        width: 10px;
        height: 16px;
        margin-bottom: 14px;
      }
      :deep(.icon-trend_down) {
        width: 10px;
        height: 16px;
      }
    }
    &-time {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-family: PingFangSC-Regular;
      width: 240px;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 400;
      margin-left: 20px;
      span {
        line-height: 30px;
      }
      span:nth-child(2) {
        font-family: DIN-Medium, cursive;
        color: #535865;
        font-weight: 500;
      }
    }
    .hot-team1,
    .hot-team2 {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 48px;
      background: #404145;
      border: 2px solid rgba(23, 25, 30, 1);
      :deep(.el-image__inner) {
        width: 32px;
        height: 32px;
      }
      :deep(.el-image__wrapper) {
        width: 32px;
        height: 32px;
        bottom: 0;
        right: 0;
        margin: auto auto;
      }
      img {
        width: 32px;
        height: 32px;
      }
    }
    .hot-team2 {
      margin-left: -10px;
    }
  }
  .card-right {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 656px;
    &-title {
      display: flex;
      width: 80px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #c2c7d2;
      letter-spacing: 0;
      font-weight: 500;
    }
    &-rate {
      display: flex;
      flex-direction: column;
      &-main {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #535865;
        letter-spacing: 0;
        font-weight: 400;
        &-l {
          display: flex;
          align-items: center;
          width: 40%;
          height: 40px;
          .card-right-team1 {
            width: 32px;
            height: 32px;
            img {
              width: 32px;
              height: 32px;
            }
          }
          span {
            font-family: DIN-Medium, cursive;
            font-size: 18px;
            color: #c2c7d2;
            letter-spacing: 0;
            font-weight: 500;
            margin-left: 10px;
          }
        }
        &-m {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20%;
          height: 40px;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: #535865;
          letter-spacing: 0;
          font-weight: 500;
        }
        &-r {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 40%;
          height: 40px;
          .card-right-team2 {
            width: 32px;
            height: 32px;
            img {
              width: 32px;
              height: 32px;
            }
          }
          span {
            font-family: DIN-Medium, cursive;
            font-size: 18px;
            color: #c2c7d2;
            letter-spacing: 0;
            font-weight: 500;
            margin-right: 10px;
          }
        }
      }
      &-progress {
        display: flex;
        :deep(.el-progress-bar__outer) {
          width: 470px;
          background: #fff;
        }
        span {
          width: 470px;
          height: 8px;
          background: #262932;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
