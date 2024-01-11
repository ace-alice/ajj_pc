<template>
  <div class="ActiveBonusCard">
    <div class="v-activities-item-t">
      <span>{{ dealWithType }}</span>
      <span>{{ priceToFixed(bonusInfo['reward_amount']) }}</span>
    </div>
    <div class="v-activities-item-b">
      <div class="v-activities-item-b-time">
        <div>发放时间：{{ parseTime(bonusInfo['create_time']) }}</div>
        <div>到期时间：{{ parseTime(bonusInfo.expiration) }}</div>
      </div>
      <div v-if="+bonusInfo.status === 1" class="v-btn unaccomplished" @click="getItRightNow">
        <LoadingCard v-show="submitLoad" />
        <span>立即领取</span>
      </div>
      <div v-if="+bonusInfo.status === 2" class="v-btn finish">已领取</div>
      <div v-if="+bonusInfo.status === 3" class="v-btn finish">已过期</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, ref } from 'vue';
import { priceToFixed } from '@/utils/numberFunction';
import { parseTime } from '@/utils/timeFormat';
import createRequestFun from '@/service/createRequest';
import LoadingCard from '@/components/LoadingCard/index.vue';
import { getLocal } from '@/utils/storage';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'ActiveBonusCard',
  props: {
    bonusInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: { LoadingCard },
  emits: ['success'],
  setup(props, { emit }) {
    const dealWithType = computed(() => {
      switch (+props.bonusInfo.type) {
        case 1:
          return '生日礼金';
        case 2:
          return '升级礼金';
        case 3:
          return '每日首充';
        case 4:
          return '月复活金';
        default:
          return '';
      }
    });

    const submitLoad = ref(false);

    const { proxy }: any = getCurrentInstance();

    function getItRightNow() {
      if (submitLoad.value) return;
      submitLoad.value = true;
      createRequestFun(
        '1',
        getLocal('token')
      )({ url: props.bonusInfo.url, method: 'post' })
        .then((res: any) => {
          if (+res.code === 1) {
            emit('success');
            proxy.mittBus.emit('changeToast', {
              header: 'pop_gift_effect',
              text: `<span class='normal-text'>恭喜您</span> <span class='weight-text'>VIP${
                +getLocal('userInfo')?.vip_current_level + 1
              }</span> <span class='normal-text'>更近一步</span>`
            });
          } else {
            ElMessage({
              message: res.msg || res.message,
              duration: 2 * 1000,
              customClass: 'copy-message',
              grouping: true
            });
          }
        })
        .finally(() => {
          submitLoad.value = false;
        })
        .catch((err: any) => {
          ElMessage({
            message: err.msg || err.message,
            duration: 2 * 1000,
            customClass: 'copy-message',
            grouping: true
          });
        });
    }

    return { dealWithType, priceToFixed, getItRightNow, parseTime, submitLoad };
  }
});
</script>

<style lang="scss" scoped>
.ActiveBonusCard {
  flex-shrink: 0;
  width: 1080px;
  margin: 32px auto 0;
  .v-activities-item-t {
    display: flex;
    justify-content: space-between;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #c2c7d2;
    font-weight: 600;
    span:nth-child(2) {
      color: var(--aux-color);
    }
  }
  .v-activities-item-b {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Regular, cursive;
    font-size: 14px;
    color: #c2c7d2;
    font-weight: 400;
    margin-top: 6px;
    .v-activities-item-b-time {
      & > div + div {
        margin-top: 6px;
      }
    }
    .v-btn {
      height: 32px;
      width: 224px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #737373;
      border-radius: 4px;
      cursor: not-allowed;
    }
    .unaccomplished {
      background: var(--aux-color);
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
