<template>
  <div class="LetterBox">
    <div v-for="item in dataList" :key="item['id']" class="bulletin-box-item">
      <el-image class="tag-image" style="height: 48px; width: 48px" :src="item['tag_logo']" fit="cover">
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
            <span>{{ item['title'] }}</span>
            <span>{{ parseTime(item['create_time'], '{m}-{d}') }}</span>
          </div>
        </div>
        <div :class="{ content: true, notShowDetail: true }">{{ item['content'] }}</div>
      </div>
    </div>
    <NoDataPage v-show="dataList.length === 0" />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { getLetter } from '@/api/message-center';
import formDataHook from '@/hooks/FormDataHook';
import { parseTime } from '@/utils/timeFormat';
import defaultImageHook from '@/hooks/defaultImageHook';
import NoDataPage from '@/components/NoDataPage/index.vue';

export default defineComponent({
  name: 'LetterBox',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  components: { NoDataPage },
  setup(props) {
    const { toGetList, dataList, isLogin } = formDataHook(getLetter, 6, false);

    const { defaultTeamLogo } = defaultImageHook();

    watch(
      () => props.show,
      (newVal: boolean) => {
        if (newVal) {
          if (isLogin.value) {
            toGetList();
          }
        }
      }
    );

    return { toGetList, dataList, parseTime, defaultTeamLogo };
  }
});
</script>

<style lang="scss" scoped>
.LetterBox {
  width: 100%;
  padding: 0 0 17px;
  cursor: pointer;
  .bulletin-box-item {
    margin: 17px 0 17px;
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
      width: calc(100% - 80px);
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
            padding: 0 10px;
            font-size: 14px;
            color: #ffffff;
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
}
</style>
