<template>
  <div class="bulletin-bar" @click="toPath">
    <div class="bar">公告</div>
    <swiper
      :width="swiperOptions.width"
      :height="swiperOptions.height"
      :slidesPerView="swiperOptions.slidesPerView"
      :autoplay="swiperOptions.autoplay"
      :loop="swiperOptions.loop"
      :speed="swiperOptions.speed"
      :spaceBetween="swiperOptions.spaceBetween"
      :coverflowEffect="swiperOptions.coverflowEffect"
      :centeredSlides="swiperOptions.centeredSlides"
      :direction="swiperOptions.direction"
      class="swiper"
      effect="coverflow"
    >
      <swiper-slide v-for="(banner, index) in dataList" :key="index">
        <div class="item">{{ banner['content'] }}</div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue';
import 'swiper/swiper.min.css';
import SwiperCore, { Autoplay, Scrollbar } from 'swiper';
import formDataHook from '@/hooks/FormDataHook';
import { getAnnouncement } from '@/api/message-center';
import { useRouter } from 'vue-router';
SwiperCore.use([Autoplay, Scrollbar]);

export default defineComponent({
  name: 'BulletinBar',
  components: { Swiper, SwiperSlide },
  setup() {
    const swiperOptions = reactive({
      width: 580,
      height: 23,
      autoplay: {
        disableOnInteraction: false, // 鼠标滑动后继续自动播放
        delay: 0 // 3秒切换一次
      },
      slidesPerView: 1,
      speed: 5000, // 切换过渡速度
      loop: true,
      centeredSlides: false, // 设置slide居中
      direction: 'horizontal',
      spaceBetween: 20,
      coverflowEffect: {
        stretch: 0, // 每个slide之间的拉伸值（距离），越大slide靠得越紧。 默认0。
        depth: 100, // slide的位置深度。值越大z轴距离越远，看起来越小。 默认100。
        modifier: 1 // depth和rotate和stretch的倍率，相当于depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显。默认1。
      },
      navigation: {
        nextElRef: '.swiper-button-next',
        prevElRef: '.swiper-button-prev'
      },
      pagination: {
        clickable: true
      }
    });

    const { dataList } = formDataHook(getAnnouncement, 10, true);

    const router = useRouter();

    function toPath() {
      router.push({ name: 'MessageCenter' });
    }

    return { swiperOptions, dataList, toPath };
  }
});
</script>

<style lang="scss" scoped>
.bulletin-bar {
  width: 580px;
  font-family: PingFangSC-Regular, monospace;
  font-size: 14px;
  color: #c2c7d2;
  font-weight: 400;
  overflow: visible;
  position: relative;
  cursor: pointer;

  .bar {
    position: absolute;
    background: var(--aux-color);
    border-radius: 17px;
    height: 20px;
    width: 58px;
    text-align: center;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    left: -73px;
    font-family: PingFangSC-Regular, sans-serif;
    font-size: 14px;
    color: #ffffff;
    font-weight: 400;
  }
  .swiper-slide {
    height: 20px;
    width: 100%;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden !important;
    .item {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden !important;
    }
  }
  :deep(.swiper-wrapper) {
    transition-timing-function: linear;
  }
}
</style>
