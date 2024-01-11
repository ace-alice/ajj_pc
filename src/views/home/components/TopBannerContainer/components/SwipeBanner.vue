<template>
  <div class="swipe-banner">
    <swiper
      :width="swiperOptions.width"
      :height="swiperOptions.height"
      :slidesPerView="swiperOptions.slidesPerView"
      :autoplay="swiperOptions.autoplay"
      :loop="swiperOptions.loop"
      :speed="swiperOptions.speed"
      :pagination="swiperOptions.pagination"
      :navigation="swiperOptions.navigation"
      :spaceBetween="swiperOptions.spaceBetween"
      :coverflowEffect="swiperOptions.coverflowEffect"
      :centeredSlides="swiperOptions.centeredSlides"
      :direction="swiperOptions.direction"
      @slideChange="onSlideChange"
      @swiper="onSwiper"
      class="swiper"
      effect="coverflow"
    >
      <swiper-slide v-for="(banner, index) in bannerList" :key="index" @click.stop="clickSwipeHandler(banner)">
        <el-image style="height: 480px; width: 854px" :src="banner['banner_path']" fit="cover">
          <template #placeholder>
            <div></div>
          </template>
          <template #error>
            <img style="height: 100%; width: 854px" :src="defaultImage" alt="" />
          </template>
        </el-image>
      </swiper-slide>
      <div class="mask-box">
        <div class="banner-info">{{ currentBanner?.name || '' }}</div>
      </div>
    </swiper>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, onUnmounted, reactive, ref, Ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue';
import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import 'swiper/modules/navigation/navigation.min.css';
import SwiperCore, { Autoplay, Pagination, Navigation, Scrollbar } from 'swiper';
import { useRouter } from 'vue-router';
import { getLocal } from '@/utils/storage';
import { useStore } from 'vuex';
SwiperCore.use([Autoplay, Pagination, Navigation, Scrollbar]);

export default defineComponent({
  name: 'SwipeBanner',
  components: { Swiper, SwiperSlide },
  props: {
    bannerList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  setup(props) {
    const currentBanner: Ref<any> = ref(null);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const defaultImage = require('@/assets/image/default/banner-01.jpeg');
    const curSwiper: any = ref(null);
    const swiperOptions = reactive({
      width: 854,
      height: 312,
      autoplay: {
        disableOnInteraction: false, // 鼠标滑动后继续自动播放
        delay: 3000 // 3秒切换一次
      },
      slidesPerView: 1,
      speed: 500, // 切换过渡速度
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
        nextElRef: '.swipe-banner-next',
        prevElRef: '.swipe-banner-prev'
      },
      pagination: {
        clickable: true
      }
    });

    const { proxy }: any = getCurrentInstance();

    function setCurrentBanner(activeIndex: number) {
      let index: number;
      if (+activeIndex > +props.bannerList.length) {
        index = 0;
      } else if (activeIndex === 0) {
        index = props.bannerList.length - 1;
      } else {
        index = activeIndex - 1;
      }
      currentBanner.value = props.bannerList[index] || currentBanner.value;
    }

    const onSwiper = (swiper: any) => {
      curSwiper.value = swiper;
      setCurrentBanner(swiper.activeIndex);
    };
    const onSlideChange = (swiper: any) => {
      proxy.mittBus.emit('bannerListSetIndex', swiper.activeIndex);
      setCurrentBanner(swiper.activeIndex);
    };

    const router = useRouter();

    const store = useStore();

    const isLogin = computed(() => {
      return !!store.getters.getToken;
    });

    function clickSwipeHandler(banner: any) {
      if (+banner.target_type === 1) {
        if (+banner.target_url === 1) {
          // console.log(banner.target_content)
          proxy.mittBus.emit('toJumpBClient', {
            code: banner.target_content,
            addPath: ''
          });
        }
        if (+banner.target_url === 2) {
          if (!isLogin.value && ['vip1', 'vip2', 'vip3'].includes(banner.target_content)) {
            proxy.mittBus.emit('closeUserInfoPage', true);
            return;
          }
          switch (banner.target_content) {
            case 'vip1':
              return router.push({ name: 'VipCenter', query: { tab: 'VipRebate' }});
            case 'vip2':
              return router.push({ name: 'VipCenter', query: { tab: 'FirstBack' }});
            case 'vip3':
              return router.push({ name: 'VipCenter', query: { tab: 'EasterGold' }});
            default:
              store.commit('user/SET_ACTIVITY_INFO', {
                gameUrl:
                  banner.target_content.indexOf('?') === -1
                    ? `${banner.target_content}?token=${getLocal('token')}&device=1&userId=${
                        getLocal('userInfo')?.id || ''
                    }`
                    : `${banner.target_content}&token=${getLocal('token')}&device=1&userId=${
                        getLocal('userInfo')?.id || ''
                    }`,
                headerTitle: banner.name
              });
              proxy.mittBus.emit('showActivityBox', true);
          }
        }
      }
    }

    onMounted(() => {
      proxy.mittBus.on('bannerSwiper', (swiper: any) => {
        curSwiper.value.slideTo(swiper.activeIndex, 500, false);
        setCurrentBanner(swiper.activeIndex);
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off('bannerSwiper');
    });

    return { currentBanner, defaultImage, swiperOptions, onSwiper, onSlideChange, clickSwipeHandler };
  }
});
</script>

<style lang="scss" scoped>
.swipe-banner {
  height: 482px;
  width: 854px;
  background-color: var(--component-bg);
  overflow: hidden;
  border-radius: 16px 16px 8px 8px;
  position: relative;
  .mask-box {
    height: 87px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.16);
    backdrop-filter: blur(15px);
    z-index: 100;
  }
  .banner-info {
    position: absolute;
    left: 25px;
    bottom: 42px;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #ffffff;
    font-weight: 500;
  }

  //noinspection CssInvalidPseudoSelector
  :deep(.swiper) {
    .swiper-slide {
      cursor: pointer;
    }
    .swiper-pagination {
      z-index: 109;
      width: auto !important;
      padding: 5px 24px;
      .swiper-pagination-bullet {
        background: #ffffff40;
        border-radius: 2px;
        height: 4px;
        width: 12px;
        transition: all 0.2s linear;
      }
      .swiper-pagination-bullet-active {
        background: #ffffff;
        width: 36px;
      }
    }
    .swiper-button-next,
    .swiper-button-prev {
      height: 32px;
      width: 32px;
      background: #ffffff50;
      backdrop-filter: blur(20px);
      border-radius: 6px;
      transition: all 0.2s linear;
      z-index: 101;
      &:hover {
        background: #ffffff80;
      }
      &:active {
        background: #ffffff;
      }
      &::after {
        font-size: 12px;
        font-weight: bold;
        color: #fff;
      }
    }
    .swiper-button-next {
      right: 32px;
      bottom: 27px;
      top: unset;
    }
    .swiper-button-prev {
      right: 80px;
      bottom: 27px;
      top: unset;
      left: unset;
    }
  }
}
</style>
