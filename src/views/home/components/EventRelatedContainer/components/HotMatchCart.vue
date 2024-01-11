<template>
  <div class="hot-match-cart" @click="toIaESport">
    <div class="hot-match-cart-title">
      <div class="hot-match-cart-title-l">
        <el-image :src="hotGameItem.game_logo" class="hot-image">
          <template #placeholder>
            <div class="image-slot">
              <img :src="defaultTeamLogo" alt="" />
            </div>
          </template>
          <template #error>
            <div class="image-slot">
              <img :src="defaultTeamLogo" alt="" />
            </div>
          </template>
        </el-image>
        <span class="bo">BO{{ hotGameItem['bo'] }}</span>
        <span class="segmentation">|</span>
        <!--        <span class="event-name">{{ hotGameItem['event_name'] }}</span>-->
        <TooltipOver
          :tipContent="hotGameItem['event_name']"
          class="tip-width"
          tipRefName="tooltipOver"
          tipClassName="cart-tooltipOver"
        ></TooltipOver>
      </div>
      <div class="hot-match-cart-title-r">
        <span>第{{ hotGameItem['champion_team_num'] ? +(hotGameItem['champion_team_num'] + 1) : 0 }}局</span>
      </div>
    </div>
    <div class="hot-match-cart-main">
      <div class="hot-match-cart-main-l">
        <el-image :src="hotGameItem['team_logo_1']" class="hot-team-image">
          <template #placeholder>
            <div class="image-slot">
              <img :src="defaultTeamLogo" alt="" />
            </div>
          </template>
          <template #error>
            <div class="image-slot">
              <img :src="defaultTeamLogo" alt="" />
            </div>
          </template>
        </el-image>
        <span>{{ hotGameItem.team_name_1 }}</span>
      </div>
      <div class="hot-match-cart-main-m">
        <span>{{ hotGameItem.score_1 }} : {{ hotGameItem.score_2 }}</span>
        <span v-if="+hotGameItem.category_id === 3">正在进行中</span>
      </div>
      <div class="hot-match-cart-main-r">
        <el-image :src="hotGameItem.team_logo_2" class="hot-team-image">
          <template #placeholder>
            <div class="image-slot">
              <img :src="defaultTeamLogo" alt="" />
            </div>
          </template>
          <template #error>
            <div class="image-slot">
              <img :src="defaultTeamLogo" alt="" />
            </div>
          </template>
        </el-image>
        <span>{{ hotGameItem.team_name_2 }}</span>
      </div>
    </div>
    <div class="change-bar">
      <div>
        <svg-icon name="card_vs" size="1.95" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import defaultImageHook from '@/hooks/defaultImageHook';
import TooltipOver from '@/components/TooltipOver/index.vue';

export default defineComponent({
  name: 'HotMatchCart',
  components: { SvgIcon, TooltipOver },
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
      defaultImageHook,
      defaultTeamLogo,
      toIaESport
    };
  }
});
</script>

<style lang="scss" scoped>
.hot-match-cart {
  height: 158px;
  //width: 412px;
  //margin-right: 24px;
  width: calc(100% - 48px);
  padding: 16px 24px;
  background-color: var(--component-bg);
  overflow: visible;
  border-radius: 14px;
  position: relative;
  color: #fff;
  cursor: pointer;
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0;
    font-family: PingFangSC-Regular, cursive;
    &-l {
      display: flex;
      align-items: center;
      .hot-image {
        width: 24px;
        height: 24px;
        img {
          width: 24px;
          height: 24px;
        }
      }
      .bo {
        margin-left: 12px;
      }
      .segmentation {
        height: 12px;
        margin: 0 12px;
        opacity: 0.6;
        color: #fff;
        overflow: hidden;
      }
      .event-name {
        width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &-r {
      display: flex;
      span {
        display: flex;
        justify-content: center;
        width: 52px;
        height: 22px;
        line-height: 22px;
        background: rgba(238, 158, 1, 0.2);
        border: 1px solid rgba(238, 158, 1, 0.4);
        border-radius: 2px;
      }
    }
  }
  &-main {
    display: flex;
    justify-content: space-between;
    height: 130px;
    &-l,
    &-m,
    &-r {
      display: flex;
      flex: 1 0 33.33%;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    &-l {
      .hot-team-image {
        width: 40px;
        height: 40px;
        img {
          width: 40px;
          height: 40px;
        }
      }
      span {
        margin-top: 16px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #c2c7d2;
        letter-spacing: 0;
        font-weight: 500;
      }
    }
    &-m {
      letter-spacing: 0;
      font-weight: 500;
      span:nth-child(1) {
        font-family: DIN-Medium, cursive;
        font-size: 22px;
        letter-spacing: 0;
      }
      span:nth-child(2) {
        line-height: 30px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #535865;
      }
    }
    &-r {
      .hot-team-image {
        width: 40px;
        height: 40px;
        img {
          width: 40px;
          height: 40px;
        }
      }
      span {
        margin-top: 16px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #c2c7d2;
        letter-spacing: 0;
        font-weight: 500;
      }
    }
  }
  .change-bar {
    position: absolute;
    height: 72px;
    width: 72px;
    background-color: var(--main-bg);
    border-radius: 50%;
    bottom: -24px;
    left: calc(50% - 36px);
    display: flex;
    justify-content: center;
    align-items: center;

    & > div {
      height: 56px;
      width: 56px;
      border-radius: 50%;
      background-color: var(--aux-color);
      line-height: 56px;
      text-align: center;
    }
  }
}
</style>
