<template>
  <div class="bulletin-item">
    <el-image class="tag-image" style="height: 48px; width: 48px" :src="detail['tag_logo']" fit="cover">
      <template #placeholder>
        <div></div>
      </template>
      <template #error>
        <img style="height: 48px; width: 48px" :src="defaultTeamLogo" alt="" />
      </template>
    </el-image>
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">
          <span>{{ detail.title }}</span>
          <span>{{ parseTime(detail['create_time'], '{m}-{d}') }}</span>
        </div>
        <div class="show-detail" @click="onShowDetail">
          展开详情
          <svg-icon name="Top_Down" :bottom="4" size="0.7" :class="{ icon: true, 'is-back': showDetail }"></svg-icon>
        </div>
      </div>
      <div :class="{ content: true, notShowDetail: !showDetail }">{{ detail['content'] }}</div>
    </div>
    <!--    {{ detail }}-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import defaultImageHook from '@/hooks/defaultImageHook';
import { parseTime } from '@/utils/timeFormat';
import SvgIcon from '@/components/SvgIcon/index.vue';

export default defineComponent({
  name: 'BulletinItem',
  props: {
    detail: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: { SvgIcon },
  setup() {
    const { defaultTeamLogo } = defaultImageHook();

    const showDetail = ref(false);

    function onShowDetail() {
      showDetail.value = !showDetail.value;
    }
    return { defaultTeamLogo, parseTime, onShowDetail, showDetail };
  }
});
</script>

<style lang="scss" scoped>
.bulletin-item {
  margin-top: 34px;
  width: 100%;
  display: flex;
  justify-content: center;
  & > div {
    flex-shrink: 0;
  }
  .tag-image {
    margin-right: 16px;
  }
  .info-box {
    width: 1036px;
    .info-header {
      width: 100%;
      height: 34px;
      display: flex;
      align-items: center;
      .info-title {
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
        span:nth-child(1) {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #ffffff;
          font-weight: 600;
        }
        span:nth-child(2) {
          font-family: PingFangSC-Regular, cursive;
          font-size: 14px;
          color: #ffffff;
        }
      }
      .show-detail {
        padding: 0 12px;
        font-family: PingFangSC-Regular, cursive;
        font-size: 14px;
        color: var(--aux-color);
        cursor: pointer;
        .icon {
          transition: all 0.2s linear;
          transform: rotateZ(0);
        }
        .is-back {
          transform: rotateZ(180deg);
        }
      }
    }
    & > div {
      width: 100%;
    }
    .content {
      font-family: PingFangSC-Regular, cursive;
      font-size: 14px;
      color: #c2c7d2;
    }
  }
  .notShowDetail {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
