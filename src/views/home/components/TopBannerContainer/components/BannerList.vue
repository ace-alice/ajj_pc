<template>
  <div class="banner-list">
    <swiper
      ref="swiper"
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
      @swiper="setSwiper"
      class="swiper"
      effect="coverflow"
      @slideChange="slideChange"
    >
      <swiper-slide
        v-for="(banner, index) in bannerList"
        :key="index"
        :active="activeIndex === index"
        v-slot="{ isActive }"
      >
        <BannerBar :banner="banner" :active="isActive" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance, ref, onMounted, onUnmounted, nextTick } from 'vue';
import BannerBar from '@/views/home/components/TopBannerContainer/components/BannerBar.vue';
import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue';
import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import 'swiper/modules/navigation/navigation.min.css';
import SwiperCore, { Autoplay, Scrollbar } from 'swiper';
SwiperCore.use([Autoplay, Scrollbar]);

export default defineComponent({
  name: 'BannerList',
  props: {
    bannerList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  components: { BannerBar, Swiper, SwiperSlide },
  setup() {
    const curSwiper: any = ref(null);
    const swiperOptions = reactive({
      width: 650,
      // height: 312,
      autoplay: false,
      slidesPerView: 3,
      // slidesPerView: 2,
      speed: 500, // 切换过渡速度
      loop: true,
      centeredSlides: false, // 设置slide居中
      direction: 'vertical',
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

    const { proxy }: any = getCurrentInstance();

    const activeIndex = ref(0);

    function changeBannerBar(index: number) {
      //
    }

    /**
     * 实例化swiper
     */
    function setSwiper(swiper: any) {
      curSwiper.value = swiper;
    }

    /**
     * 轮播图改变事件
     */
    const slideChange = () => {
      proxy.mittBus.emit('bannerSwiper', curSwiper.value);
    };

    onMounted(() => {
      proxy.mittBus.on('bannerListSetIndex', (index: number) => {
        changeBannerBar(index);
        curSwiper.value.slideTo(index, 500, false);
      });
      nextTick(() => {});
    });

    onUnmounted(() => {
      proxy.mittBus.off('bannerListSetIndex');
    });

    return { swiperOptions, activeIndex, setSwiper, slideChange };
  }
});
</script>

<style lang="scss" scoped>
.banner-list {
  width: 650px;
  border-radius: 14px;
  overflow: hidden;
  .swiper {
    //height: 312px;
    height: 486px;
  }
}
</style>
