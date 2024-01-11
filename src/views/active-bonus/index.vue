<template>
  <div class="active-bonus">
    <div class="active-bonus-back" @click="routerBack">
      <svg-icon name="last_more"></svg-icon>
    </div>
    <div class="active-bonus-title">我的VIP活动</div>
    <div class="active-bonus-banner">
      <el-image class="tag-image" style="height: 136px; width: 136px" :src="activeBonusImage2" fit="cover">
        <template #placeholder>
          <div></div>
        </template>
        <template #error>
          <img style="height: 136px; width: 136px" :src="defaultTeamLogo" alt="" />
        </template>
      </el-image>
      <div class="right-banner">
        <div>我的礼物</div>
        <div>礼物即将与您擦肩而过 <span>快快领取升级福利！</span></div>
      </div>
    </div>
    <div class="data-list">
      <ActiveBonusCard v-for="bonus in dataList" :key="bonus['id']" :bonusInfo="bonus" @toGetPrice="setItemInfo" />
      <NoDataPage v-show="dataList.length === 0" />
    </div>
    <div class="page">
      <el-pagination
        v-model:currentPage="form.page"
        :page-size="form.limit"
        background
        layout="prev, pager, next"
        :total="form.total"
        @current-change="toGetList"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import formDataHook from '@/hooks/FormDataHook';
import { vipRewardRecord } from '@/api/active-bonus';
import SvgIcon from '@/components/SvgIcon/index.vue';
import defaultImageHook from '@/hooks/defaultImageHook';
import NoDataPage from '@/components/NoDataPage/index.vue';
import ActiveBonusCard from '@/views/active-bonus/components/ActiveBonusCard.vue';

export default defineComponent({
  name: 'ActiveBonus',
  props: {},
  components: { SvgIcon, NoDataPage, ActiveBonusCard },
  setup() {
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const activeBonusImage2 = require('@/assets/image/icons/gift2.png');

    const { defaultTeamLogo } = defaultImageHook();

    const showToast = ref(false);

    const itemInfo: Ref<any> = ref({});

    function setItemInfo(bonus: any) {
      itemInfo.value = bonus;
      showToast.value = true;
    }

    const { dataList, toGetList, form } = formDataHook(vipRewardRecord, 4, false, [
      'start_time',
      'end_time',
      'status',
      'type',
      'game_id'
    ]);

    function successGet() {
      showToast.value = false;
      itemInfo.value = {};
      toGetList();
    }

    function routerBack() {
      router.go(-1);
    }
    return {
      routerBack,
      showToast,
      itemInfo,
      setItemInfo,
      dataList,
      successGet,
      toGetList,
      form,
      activeBonusImage2,
      defaultTeamLogo
    };
  }
});
</script>

<style lang="scss" scoped>
.active-bonus {
  width: 100%;
  height: calc(100% - 115px);
  margin: 37px 0 78px;
  background: #363841;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  position: relative;
  .active-bonus-back {
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
  .active-bonus-title {
    width: 1180px;
    height: 139px;
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #ffffff;
    font-weight: 600;
    line-height: 139px;
    margin: auto;
    border-bottom: 1px solid #ffffff10;
  }
  .active-bonus-banner {
    background: #00000060;
    backdrop-filter: blur(20px);
    border-radius: 16px;
    height: 154px;
    width: 1180px;
    margin: 24px auto 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tag-image {
      transform: translate(82px, 12px);
    }
    .right-banner {
      text-align: right;
      transform: translateX(-48px);
      div:nth-child(1) {
        font-family: PingFangSC-Medium;
        font-size: 28px;
        color: #ffffff;
        font-weight: 600;
      }
      div:nth-child(2) {
        font-family: PingFangSC-Regular, cursive;
        font-size: 16px;
        color: #c2c7d2;
        line-height: 22px;
        font-weight: 400;
        margin-top: 28px;
        span {
          color: var(--aux-color);
        }
      }
    }
  }
  .page {
    width: 1080px;
    margin: 60px auto 48px;
    display: flex;
    justify-content: flex-end;
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
}
</style>
