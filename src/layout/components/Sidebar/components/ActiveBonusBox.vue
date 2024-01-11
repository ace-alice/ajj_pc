<template>
  <div
    :class="{ 'active-bonus-box': true, 'active-bonus-box-active': showPopUps || route.name === 'ActiveBonus' }"
    @click.stop="onShowPopUpsHandle"
  >
    <svg-icon :name="comInfo.iconName"></svg-icon>
    <teleport to="#app">
      <div :class="{ 'active-bonus-box-pop-ups': true, 'active-bonus-box-done-pop-ups': !showPopUps }" @click.stop>
        <div class="title-bar">
          <el-image class="tag-image" style="height: 48px; width: 48px" :src="activeBonusImage1" fit="cover">
            <template #placeholder>
              <div></div>
            </template>
            <template #error>
              <img style="height: 48px; width: 48px" :src="defaultTeamLogo" alt="" />
            </template>
          </el-image>
          <div>我的VIP活动</div>
          <svg-icon name="next_more" class="next-more" size="1" @click="closePopUps" />
        </div>
        <div class="card-bar">
          <el-image class="card-image" style="height: 136px; width: 136px" :src="activeBonusImage2" fit="cover">
            <template #placeholder>
              <div></div>
            </template>
            <template #error>
              <img style="height: 136px; width: 136px" :src="defaultTeamLogo" alt="" />
            </template>
          </el-image>
          <div class="card-info">
            <div class="card-info-title">我的礼物</div>
            <div>礼物即将与您擦肩而过</div>
            <div>
              <span class="gold">快快领取升级福利！</span>
            </div>
          </div>
        </div>
        <div class="gift-active-list">
          <ActiveBonusItem v-for="bonus in dataList" :key="bonus['id']" :bonusInfo="bonus" @success="toGetList" />
          <NoDataPage v-show="dataList.length === 0" />
        </div>
        <div class="to-router" @click="toPath">
          <span></span>
          查看更多
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance } from 'vue';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import defaultImageHook from '@/hooks/defaultImageHook';
import { useRouter } from 'vue-router';
import formDataHook from '@/hooks/FormDataHook';
import NoDataPage from '@/components/NoDataPage/index.vue';
import { vipRewardRecord } from '@/api/active-bonus';
import ActiveBonusItem from '@/layout/components/Sidebar/components/ActiveBonusItem.vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ActiveBonusBox',
  props: {
    comInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: { NoDataPage, ActiveBonusItem },
  setup() {
    const { showPopUps, onShowPopUps, closePopUps, route } = popUpsMittBusHook('showActiveBonusBox', [], 'ActiveBonus');

    const { defaultTeamLogo } = defaultImageHook();

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const activeBonusImage1 = require('@/assets/image/icons/gift1.png');

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const activeBonusImage2 = require('@/assets/image/icons/gift2.png');

    const router = useRouter();

    const { dataList, toGetList } = formDataHook(vipRewardRecord, 4, false, [
      'start_time',
      'end_time',
      'status',
      'type',
      'game_id'
    ]);

    const store = useStore();

    const isLogin = computed(() => {
      return Boolean(store.getters.getUserInfo?.id) || false;
    });

    const { proxy }: any = getCurrentInstance();

    function onShowPopUpsHandle() {
      if (!isLogin.value) {
        return proxy.mittBus.emit('closeUserInfoPage', true);
      }
      if (!showPopUps.value) {
        toGetList();
      }
      onShowPopUps(!showPopUps.value);
    }

    function toPath() {
      closePopUps();
      router.push({ name: 'ActiveBonus' });
    }

    return {
      showPopUps,
      onShowPopUpsHandle,
      closePopUps,
      route,
      defaultTeamLogo,
      activeBonusImage1,
      activeBonusImage2,
      toPath,
      dataList,
      toGetList
    };
  }
});
</script>

<style lang="scss" scoped>
.active-bonus-box {
  transition: all 0.2s linear;
}
.active-bonus-box-active {
  background: var(--aux-color);
}
.active-bonus-box-pop-ups {
  position: absolute;
  width: 420px;
  top: 88px;
  right: 88px;
  background: var(--component-pop-ups-bg);
  z-index: 150;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.5s ease-in-out;
  & > div {
    width: calc(100% - 74px);
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Regular, cursive;
    font-size: 16px;
    color: #c2c7d2;
  }
  .title-bar {
    height: 80px;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #ffffff;
    font-weight: 600;
    border-bottom: 1px solid #ffffff10;
  }
  .card-bar {
    background: #00000080;
    height: 154px;
    border-radius: 8px;
    margin-top: 16px;
    align-items: flex-end;
    justify-content: center;
    .card-info {
      padding: 0 0 36px 14px;
      width: 174px;
      font-family: PingFangSC-Regular, cursive;
      font-size: 14px;
      color: #c2c7d2;
      line-height: 20px;
      .card-info-title {
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #ffffff;
        font-weight: 600;
        margin-bottom: 14px;
      }
      .gold {
        color: var(--aux-color);
      }
    }
  }
  .to-router {
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: #ffffff10;
    border-top: 1px solid #ffffff20;
    border-radius: 0 0 8px 8px;
    font-family: PingFangSC-Regular, cursive;
    font-size: 14px;
    color: var(--aux-color);
    cursor: pointer;
    justify-content: center;
  }
}

.active-bonus-box-done-pop-ups {
  transform: translateX(615px);
}

.tag-image {
  border-radius: 50%;
  background: #00000060;
}

.next-more {
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s linear;
  &:hover {
    opacity: 1;
  }
}

.gift-active-list {
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
}
</style>
