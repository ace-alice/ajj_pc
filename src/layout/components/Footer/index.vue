<template>
  <div class="footer">
    <div class="top">
      <div>
        <div class="left">
          <!--          <svg-icon name="mga" :left="22" size="7" />-->
          <el-image style="height: 24px; width: 116px" :src="mgaImage" fit="fill">
            <template #placeholder>
              <div></div>
            </template>
            <template #error>
              <div></div>
            </template>
          </el-image>
          <svg-icon name="n18" :left="22" size="1.5" />
          <svg-icon name="liulanqi-01" :left="22" size="1.5" />
          <svg-icon name="liulanqi-02" :left="22" size="1.5" />
          <svg-icon name="liulanqi-03" :left="22" size="1.5" />
          <div class="clear-btn" @click.stop="toClear">
            <img :src="loadIcon" alt="" :class="{ animate: clearing }" />
            一键清除缓存
          </div>
        </div>
        <div>
          <span> 支付方式：</span>
          <svg-icon name="zhifu-01" :left="22" size="1.5" />
          <svg-icon name="zhifu-02" :left="22" size="1.5" />
          <svg-icon name="zhifu-03" :left="22" size="1.5" />
        </div>
      </div>
    </div>
    <div class="bottom">
      <span>Copyright @</span>
      <span>2022 All rights reserved by IAbet,Inc.IAbet is </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';

export default defineComponent({
  name: 'Footer',
  components: { SvgIcon },
  setup() {
    const clearing = ref(false);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loadIcon = require('@/assets/image/icons/move_loading.png');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mgaImage = require('@/assets/image/icons/mga.png');

    function toClear() {
      if (clearing.value) return;
      clearing.value = true;
      setTimeout(() => {
        clearing.value = false;
      }, 2000);
    }
    return { clearing, toClear, loadIcon, mgaImage };
  }
});
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  background-color: var(--component-bg);
  overflow: hidden;
  flex-shrink: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 300;
  .top {
    height: 80px;
    width: 100%;
    & > div {
      width: 1528px;
      display: flex;
      height: 100%;
      justify-content: space-between;
      align-items: center;
      margin: auto;
      font-family: PingFangSC-Regular, serif;
      font-size: 14px;
      color: #535865;
    }
    .left {
      display: flex;
      align-items: center;
    }
  }
  .bottom {
    height: 40px;
    width: 100%;
    background-color: #000000;
    text-align: center;
    opacity: 0.5;
    font-family: PingFangSC-Regular, serif;
    font-size: 10px;
    color: #ffffff;
    font-weight: 400;
    line-height: 40px;
    span + span {
      margin-left: 20px;
    }
  }
  .clear-btn {
    height: 24px;
    padding: 0 24px 0 16px;
    background: rgba(83, 88, 101, 0.2);
    border: 0.5px solid rgba(83, 88, 101, 1);
    border-radius: 2px;
    margin-left: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
      background: rgba(83, 88, 101, 0.3);
    }
    &:active {
      background: rgba(83, 88, 101, 0.5);
    }
    img {
      height: 24px;
      width: 24px;
      margin-right: 16px;
    }
  }
  .animate {
    animation: run 1s infinite;
  }
  @keyframes run {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
}
</style>
