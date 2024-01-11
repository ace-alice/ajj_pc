<template>
  <div class="PriceToast">
    <teleport to="#app">
      <div :class="{ 'vip-pop-ups': true, 'vip-done-pop-ups': !show }" @click.stop="confirm">
        <div :class="{ 'vip-page': true, 'vip-done-page': !show }" @click.stop>
          <!--          <svg-icon :name="svg" class="header" size="8" />-->
          <el-image :src="image" class="header">
            <template #placeholder>
              <div></div>
            </template>
            <template #error>
              <div></div>
            </template>
          </el-image>
          <div>{{ title }}</div>
          <div>
            <span>{{ priceToFixed(Number(bonusInfo['money']) || 0) }}</span> 元
          </div>
          <div>
            <div @click="confirm">
              <span>确定</span>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { priceToFixed } from '@/utils/numberFunction';

export default defineComponent({
  name: 'PriceToast',
  props: {
    bonusInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    title: {
      type: String,
      default: ''
    },
    svg: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['success'],
  setup(props, { emit }) {
    function confirm() {
      emit('success');
    }

    const image = props.svg ? require(`@/assets/image/message/${props.svg}.png`) : '';

    return { confirm, priceToFixed, image };
  }
});
</script>

<style lang="scss" scoped>
.PriceToast {
}
</style>
