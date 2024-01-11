<template>
  <div class="splash-page" v-show="show">
    <div class="load-air">
      <!--      <SvgIcon class="load-air-svg" name="startloading_01" size="3.5" :style="{ '&#45;&#45;left': scale / 100 }" :bottom="16" />-->
      <el-image :style="{ '--left': scale / 100 }" class="load-air-svg" :src="airImage" fit="fill">
        <template #placeholder>
          <div></div>
        </template>
        <template #error>
          <div></div>
        </template>
      </el-image>
    </div>
    <div class="load-box" :style="{ '--scale': scale }"></div>
    <div>{{ scale }}%</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';

export default defineComponent({
  name: 'SplashPage',
  props: {},
  components: {},
  setup() {
    const show = ref(false);

    const scale = ref(50);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const airImage = require('@/assets/image/message/startloading_01.png');

    const { proxy }: any = getCurrentInstance();

    let timer: any;

    let speed = 1;

    function init() {
      speed = 1;
      clearInterval(timer);
      timer = null;
      scale.value = 0;
      timer = setInterval(() => {
        if (scale.value + speed >= 100) {
          scale.value = 100;
          clearInterval(timer);
          timer = null;
          show.value = false;
        } else {
          scale.value += speed;
        }
      }, 20);
    }

    onMounted(() => {
      proxy.mittBus.on('showSplashPage', (showFlag: boolean = true) => {
        if (showFlag) {
          init();
        } else {
          speed = 5;
          clearInterval(timer);
          timer = null;
        }
        show.value = showFlag;
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off('showSplashPage');
    });

    return { scale, show, airImage };
  }
});
</script>

<style lang="scss" scoped>
.splash-page {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: var(--component-pop-ups-bg);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: PingFangSC-Regular, cursive;
  font-size: 22px;
  color: #ffffff;
  font-weight: 400;
  .load-air {
    width: 900px;
    .load-air-svg {
      transform: translateX(calc(var(--left) * 900px - 40px));
      height: 100px;
      width: 100px;
    }
  }
  .load-box {
    height: 14px;
    width: 900px;
    background: #17191e;
    box-shadow: inset 0 1px 1px 0 rgba(0, 0, 0, 0.5);
    border-radius: 7px;
    position: relative;
    margin-bottom: 24px;
    &:before {
      content: '';
      position: absolute;
      height: 100%;
      width: calc(var(--scale) * 1%);
      top: 0;
      left: 0;
      background-image: linear-gradient(90deg, #ee9e01 0%, #ffe3ac 100%);
      border-radius: 7px;
    }
  }
}
</style>
