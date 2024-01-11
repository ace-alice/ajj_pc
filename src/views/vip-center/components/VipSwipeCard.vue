<template>
  <div :class="{ 'vip-swipe-card': true, active: active }" :style="backImage">
    <el-image class="icon-image" style="height: 132px; width: 132px" :src="iconImageUrl" fit="cover">
      <template #placeholder>
        <div></div>
      </template>
      <template #error>
        <img style="height: 132px; width: 132px" :src="defaultTeamLogo" alt="" />
      </template>
    </el-image>
    <div class="vip-title">{{ vipInfo['level_name'] }}</div>
    <div class="relegation">
      <span v-if="!lowCurrentLevel">
        保级条件：累计存款{{ toFixed2(vipInfo['protect_recharge']) }}，累计流水{{ toFixed2(vipInfo['protect_water']) }}
      </span>
      <span v-else>当前高于该等级</span>
    </div>
    <div class="flex-between text-1">
      <div v-if="!lowCurrentLevel">
        当前存款
        <span class="text-2">{{ toFixed2(currentLevel['upgrade_deposit']) }}</span
        >/{{ toFixed2(vipNextInfo['up_recharge']) }}
      </div>
      <div v-if="!lowCurrentLevel">
        当前流水
        <span class="text-2">{{ toFixed2(currentLevel['upgrade_bet']) }}</span
        >/{{ toFixed2(vipNextInfo['up_water']) }}
      </div>
    </div>
    <el-progress
      :show-text="false"
      :stroke-width="10"
      :percentage="lowCurrentLevel ? 100 : currentProgress"
      color="#FFFFFF"
    />
    <div class="flex-between text-3">
      <div>V{{ vipInfo['level'] }}</div>
      <div>V{{ vipNextInfo['level'] }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { toFixed2 } from '@/utils/numberFunction';
import defaultImageHook from '@/hooks/defaultImageHook';
import { useStore } from 'vuex';
import { prop } from 'vue-class-component';

export default defineComponent({
  name: 'VipSwipeCard',
  props: {
    vipInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    vipNextInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    active: {
      type: Boolean,
      default: false
    },
    currentLevel: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {},
  setup(props) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const iconImageUrl = require(`@/assets/image/vip/vip${props.vipInfo['level']}-icon.png`);

    const { defaultTeamLogo } = defaultImageHook();

    const backImage = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const backImageUrl = require(`@/assets/image/vip/vip${props.vipInfo['level']}-bg.png`);

      return {
        backgroundImage: 'url(' + backImageUrl + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      };
    });

    const lowCurrentLevel = computed(() => {
      return Number(props.vipInfo.level) < Number(props.currentLevel['vip_current_level']);
    });

    const isCurrentLevel = computed(() => {
      return Number(props.vipInfo.level) === Number(props.currentLevel['vip_current_level']);
    });

    const store = useStore();

    const userInfo = computed(() => {
      return store.getters.getUserInfo;
    });

    const currentProgress = computed(() => {
      const deposit = Number(props.currentLevel['upgrade_deposit']) / Number(props.vipNextInfo['up_recharge']);
      const water = Number(props.currentLevel['upgrade_bet']) / Number(props.vipNextInfo['up_water']);
      const total = (((deposit > 1 ? 1 : deposit) + (water > 1 ? 1 : water)) * 100) / 2;
      return total < 100 ? total : 100;
    });

    return {
      backImage,
      isCurrentLevel,
      currentProgress,
      toFixed2,
      iconImageUrl,
      defaultTeamLogo,
      userInfo,
      lowCurrentLevel
    };
  }
});
</script>

<style lang="scss" scoped>
.active {
  height: 260px !important;
  width: 500px !important;
}
.vip-swipe-card {
  height: 240px;
  width: 462px;
  border-radius: 16px;
  transition: all 0.2s linear;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  & > div {
    width: calc(100% - 72px);
  }

  //noinspection CssInvalidPseudoSelector
  :deep(.el-progress-bar__outer) {
    background-color: #ffffff50;
  }

  .vip-title {
    font-family: DIN-Medium, cursive;
    font-size: 36px;
    color: #ffffff;
    text-shadow: 0 3px 4px rgba(0, 0, 0, 0.15);
    font-weight: 600;
    padding-top: 10px;
    margin-bottom: 20px;
  }

  .relegation {
    font-family: PingFangSC-Regular, cursive;
    font-size: 14px;
    color: #ffffff;
    font-weight: 400;
    margin-bottom: 40px;
    z-index: 100;
  }

  .flex-between {
    display: flex;
    justify-content: space-between;
    margin: 12px 0;
  }

  .text-1 {
    font-family: PingFangSC-Regular, cursive;
    font-size: 16px;
    color: #ffffff;
    font-weight: 400;
    min-height: 18px;
  }

  .text-2 {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #ffaf43;
    font-weight: 600;
  }

  .text-3 {
    font-family: DIN-Medium, cursive;
    font-size: 18px;
    color: #ffffff;
    font-weight: 600;
  }

  .icon-image {
    position: absolute;
    top: -8px;
    right: 23px;
  }
}
</style>
