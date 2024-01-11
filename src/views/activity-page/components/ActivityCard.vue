<template>
  <div class="ActivityCard" @mouseenter="showHover = true" @mouseleave="showHover = false">
    <el-image style="height: 100%; width: 100%; border-radius: 16px" :src="info['pc_img']" fit="fill">
      <template #placeholder>
        <div></div>
      </template>
      <template #error>
        <img style="height: 100%; width: 100%; border-radius: 16px" :src="activityDefaultImage" alt="" />
      </template>
    </el-image>
    <div class="tag">{{ info['header'] }}</div>
    <div :class="{ 'hover-box': true, 'show-hover': showHover }">
      <div class="activity-title">{{ info['activity_title'] }}</div>
      <div class="activity-time">
        活动时间:
        <span v-if="+info['is_time_limit'] === 1">
          {{ parseTime(info.start_time, '{y}-{m}-{d}') }} 至 {{ parseTime(info.end_time, '{y}-{m}-{d}') }}</span
        >
        <span v-else>永久有效</span>
      </div>
      <div class="detail-btn" @click.stop="toActivityBox">{{ isExpired ? '当前活动已过期' : '查看详情' }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import defaultImageHook from '@/hooks/defaultImageHook';
import { parseTime } from '@/utils/timeFormat';
import { useRouter } from 'vue-router';
import { getLocal } from '@/utils/storage';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'ActivityCard',
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {},
  setup(props) {
    const { activityDefaultImage } = defaultImageHook();

    const showHover = ref(false);

    const isExpired = ref(false);

    const testExpired = () => {
      const nowDate = new Date().getTime();
      let result: any = false;
      if (+props.info.is_time_limit === 1) {
        if (props.info.end_time && Number(nowDate) > Number(parseTime(props.info.end_time, 'getTime'))) {
          result = true;
        }
      } else {
        result = false;
      }
      return result;
    };

    const { proxy }: any = getCurrentInstance();

    const router = useRouter();

    const store = useStore();

    const isLogin = computed(() => {
      return !!store.getters.getToken;
    });

    function toActivityBox() {
      isExpired.value = testExpired();
      const token = getLocal('token');
      proxy.mittBus.emit('showActivityBox', false);
      if (isExpired.value) {
        ElMessage({
          message: '当前活动已过期',
          duration: 2 * 1000,
          customClass: 'copy-message',
          grouping: true
        });
        return store.commit('user/SET_ACTIVITY_INFO', false);
      }
      if (props.info.target_url) {
        if (!isLogin.value && ['vip1', 'vip2', 'vip3'].includes(props.info.target_url)) {
          proxy.mittBus.emit('closeUserInfoPage', true);
          return;
        }
        switch (props.info.target_url) {
          case 'vip1':
            return router.push({ name: 'VipCenter', query: { tab: 'VipRebate' }});
          case 'vip2':
            return router.push({ name: 'VipCenter', query: { tab: 'FirstBack' }});
          case 'vip3':
            return router.push({ name: 'VipCenter', query: { tab: 'EasterGold' }});
          default:
            // eslint-disable-next-line no-case-declarations
            const addPath =
              '?token=' + token + '&device=1&activeId=' + props.info.id + '&userId=' + getLocal('userInfo')?.id;
            store.commit('user/SET_ACTIVITY_INFO', {
              gameUrl: props.info.target_url + addPath,
              headerTitle: props.info.activity_title
            });
            proxy.mittBus.emit('showActivityBox', true);
            return;
        }
      }
    }

    onMounted(() => {
      isExpired.value = testExpired();
    });

    return { activityDefaultImage, showHover, parseTime, toActivityBox, isExpired };
  }
});
</script>

<style lang="scss" scoped>
.ActivityCard {
  height: 238px;
  width: 494px;
  border-radius: 16px;
  background: #000000;
  margin: 23px 23px 0 0;
  flex-shrink: 0;
  flex-wrap: wrap;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .tag {
    position: absolute;
    top: 0;
    left: 0;
    height: 34px;
    width: 126px;
    border-radius: 16px 0 16px 0;
    line-height: 34px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-image: linear-gradient(179deg, #ffc92d 0%, #de8327 100%);
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 2px;
    font-weight: 600;
  }
  .hover-box {
    height: 100%;
    width: 100%;
    border-radius: 12px;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    transform: translateY(100%);
    background-image: linear-gradient(180deg, #464c5e 0%, #15181f 100%);
    transition: all 0.2s ease-in-out;
    opacity: 0;
    & > div {
      margin: auto;
      width: 80%;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .activity-title {
      font-family: PingFangSC-Semibold, cursive;
      font-size: 20px;
      color: #ffffff;
      font-weight: 600;
      margin: 48px auto 16px;
    }
    .activity-time {
      font-family: PingFangSC-Semibold, cursive;
      font-size: 18px;
      color: #ffffff60;
      font-weight: 400;
      margin: 0 auto 44px;
    }
    .detail-btn {
      background: #ffffff20;
      height: 45px;
      width: 170px;
      border-radius: 8px;
      font-family: PingFangSC-Regular, cursive;
      font-size: 18px;
      color: #ffffff;
      font-weight: 400;
      line-height: 45px;
    }
  }
  .show-hover {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
