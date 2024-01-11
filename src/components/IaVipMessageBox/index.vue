<template>
  <div class="IaVipMessageBox">
    <teleport to="#app">
      <div :class="{ 'vip-pop-ups': true, 'vip-done-pop-ups': !show }" @click.stop="cancel">
        <div :class="{ 'vip-page': true, 'vip-done-page': !show }" @click.stop>
          <svg-icon :name="headSvg" class="header" size="8" />
          <div>快来领取您的{{ title }}吧！</div>
          <div>
            获得 <span>{{ priceToFixed(bonusInfo['amount'] || 0) }}</span> 元 {{ title2 }}
          </div>
          <div>
            <div @click="toGetPrice">
              <span>立即领取</span>
            </div>
            <div @click="cancel">稍后领取</div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import createRequestFun from '@/service/createRequest';
import { getLocal } from '@/utils/storage';
import { ElMessage } from 'element-plus';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { priceToFixed } from '@/utils/numberFunction';

export default defineComponent({
  name: 'IaVipMessageBox',
  props: {
    bonusInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['success', 'close'],
  components: { SvgIcon },
  setup(props, { emit }) {
    function cancel() {
      emit('close');
    }

    const headSvg = computed(() => {
      switch (+props.bonusInfo.type) {
        case 1:
          return require('@/assets/image/message/pop_gift_brcake.png');
        case 2:
          return require('@/assets/image/message/pop_gift_promotion.png');
        case 3:
          return require('@/assets/image/message/pop_gift_brcake.png');
        case 4:
          return require('@/assets/image/message/pop_gift_brcake.png');
        default:
          return '';
      }
    });

    const title = computed(() => {
      switch (+props.bonusInfo.type) {
        case 1:
          return '生日礼物';
        case 2:
          return '晋级礼物';
        case 3:
          return '每日首充';
        case 4:
          return '月复活金';
        default:
          return '';
      }
    });

    const title2 = computed(() => {
      switch (+props.bonusInfo.type) {
        case 1:
          return '生日礼金';
        case 2:
          return '晋级礼金';
        case 3:
          return '每日首充';
        case 4:
          return '月复活金';
        default:
          return '';
      }
    });

    const loading = ref(false);

    function toGetPrice() {
      if (loading.value) return;
      loading.value = true;
      createRequestFun(
        '1',
        getLocal('token')
      )({ url: props.bonusInfo.url, method: 'post' }).then((res: any) => {
        if (+res.code === 1) {
          loading.value = false;
          emit('success');
        } else {
          ElMessage({
            message: res.msg || res.message,
            duration: 2 * 1000,
            customClass: 'copy-message',
            grouping: true
          });
        }
      });
    }

    return { cancel, toGetPrice, headSvg, title, title2, priceToFixed };
  }
});
</script>

<style lang="scss" scoped>
.IaVipMessageBox {
}
</style>
