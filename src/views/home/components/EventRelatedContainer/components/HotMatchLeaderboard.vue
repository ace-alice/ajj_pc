<template>
  <div class="hot-match-leaderboard">
    <div class="hot-match-leaderboard-header">
      <span>热门赛事</span>
      <span>HOT</span>
    </div>
    <div class="hot-match-leaderboard-main">
      <div class="hot-match-team">
        <div v-for="(item, index) in hotGameArr" :key="index" @click="toIaESport(item)">
          <el-image :src="item.game_logo" class="hot-image">
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
          <TooltipOver
            :tipContent="item.event_name"
            :tipContent2="item.team_name_1 && item.team_name_2 ? item.team_name_1 + ',' + item.team_name_2 : ''"
            class="tip-width"
            tipRefName="tooltipOver"
            tipClassName="board-tooltipOver"
          ></TooltipOver>
          <svg-icon v-if="index < 3" class="trend-up" name="trend_up" :left="12"></svg-icon>
        </div>
      </div>
      <div class="hot-match-image">
        <div
          v-for="(item, index) in newMonthList"
          :key="index"
          class="hot-match-image-month"
          :class="[
            newMonth === item.id
              ? 'hot-match-image-active hot-match-image-month' + (index + 1)
              : 'hot-match-image-month' + (index + 1)
          ]"
        >
          <span></span>
          <span></span>
          <span>{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import defaultImageHook from '@/hooks/defaultImageHook';
import SvgIcon from '@/components/SvgIcon/index.vue';
import TooltipOver from '@/components/TooltipOver/index.vue';

export default defineComponent({
  name: 'HotMatchLeaderboard',
  components: { SvgIcon, TooltipOver },
  props: {
    hotGameArr: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { defaultTeamLogo } = defaultImageHook();
    const newMonthList: any = ref([]);
    const newMonth = ref(1);
    const monthList = [
      {
        id: 1,
        value: 'Jan'
      },
      {
        id: 2,
        value: 'Feb'
      },
      {
        id: 3,
        value: 'Mar'
      },
      {
        id: 4,
        value: 'Apr'
      },
      {
        id: 5,
        value: 'May'
      },
      {
        id: 6,
        value: 'Jun'
      },
      {
        id: 7,
        value: 'Jul'
      },
      {
        id: 8,
        value: 'Aug'
      },
      {
        id: 9,
        value: 'Sep'
      },
      {
        id: 10,
        value: 'Oct'
      },
      {
        id: 11,
        value: 'Nov'
      },
      {
        id: 12,
        value: 'Dec'
      }
    ];
    const getMonth = () => {
      const data = new Date();
      const month = data.getMonth() + 1;
      newMonth.value = month;
      getNum();
    };
    const getNum = () => {
      const strVal = 5;
      newMonthList.value = [];
      if (newMonth.value < 5) {
        const val1 = monthList.slice(newMonth.value + 7, 12);
        const val2 = monthList.slice(0, newMonth.value + 1);
        newMonthList.value = [...val1, ...val2];
      } else if (newMonth.value >= 5 && newMonth.value < 12) {
        newMonthList.value = monthList.slice(newMonth.value - strVal, newMonth.value + 1);
      } else {
        const val1 = monthList.slice(7, 12);
        const val2 = monthList.slice(0, 1);
        newMonthList.value = [...val1, ...val2];
      }
    };

    const { proxy }: any = getCurrentInstance();

    function toIaESport(item: any) {
      proxy.mittBus.emit('toJumpBClient', {
        code: 'game_id_1',
        addPath: '&id=' + item.id + '&category_id=' + item.category_id
      });
    }

    onMounted(() => {
      getMonth();
    });
    return {
      defaultTeamLogo,
      monthList,
      getMonth,
      newMonthList,
      newMonth,
      toIaESport
    };
  }
});
</script>

<style lang="scss" scoped>
$imageRight: 20px;
.hot-match-leaderboard {
  height: 190px;
  width: 656px;
  background-color: var(--component-bg);
  overflow: hidden;
  border-radius: 14px;
  &-header {
    display: flex;
    justify-content: space-between;
    margin: 16px 24px 10px 40px;
    letter-spacing: 0;
    font-weight: 500;
    span:nth-child(1) {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #ffffff;
    }
    span:nth-child(2) {
      font-family: DIN-Medium, cursive;
      font-size: 16px;
      color: #ee9e01;
    }
  }
  &-main {
    position: relative;
    display: flex;
    justify-content: space-between;
    height: 130px;
    .hot-match-team {
      display: flex;
      width: 240px;
      flex-direction: column;
      font-family: PingFangSC-Regular;
      margin-left: 46px;
      font-size: 14px;
      color: #c2c7d2;
      letter-spacing: 0;
      font-weight: 400;
      & > div {
        display: flex;
        align-items: center;
        height: 34px;
      }
      .hot-image {
        width: 24px;
        height: 24px;
        margin-right: 12px;
        img {
          width: 24px;
          height: 24px;
        }
      }
      .trend-up {
        margin-top: 5px;
        animation: trendUp 1s linear infinite;
      }
      @keyframes trendUp {
        0% {
          margin-top: 5px;
        }
        50% {
          margin-top: -5px;
        }
        100% {
          margin-top: 5px;
        }
      }
      span {
        max-width: 140px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .hot-match-image {
      display: flex;
      position: absolute;
      right: 0;
      bottom: 0;
      width: 390px;
      height: 111px;
      background-image: url('../../../../../assets/image/home/movements.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      &-month {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        bottom: 0;
        width: 34px;
        padding: 10px 0;
        border-radius: 8px;
        font-family: PingFangSC-Medium;
        font-size: 10px;
        color: #ffffff;
        letter-spacing: 0;
        font-weight: 500;
        opacity: 0.5;
        span:nth-child(1) {
          width: 13px;
          height: 13px;
          border-radius: 13px;
          overflow: visible;
        }
        span:nth-child(2) {
          width: 1px;
          height: calc(100% - 34px);
          overflow: visible;
        }
      }
      &-month1 {
        height: 40px;
        right: 270px;
      }
      &-month2 {
        height: 48px;
        right: 220px;
      }
      &-month3 {
        height: 56px;
        right: 170px;
      }
      &-month4 {
        height: 66px;
        right: 120px;
      }
      &-month5 {
        height: 82px;
        right: 70px;
      }
      &-month6 {
        height: 100px;
        right: 20px;
      }
      &-active {
        background: rgba(255, 255, 255, 0.1);
        opacity: 1;
        span:nth-child(1) {
          background: #d8d8d8;
          border: 1px solid rgba(255, 188, 56, 1);
        }
        span:nth-child(2) {
          border-left: 1px dashed #ffbc38;
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
