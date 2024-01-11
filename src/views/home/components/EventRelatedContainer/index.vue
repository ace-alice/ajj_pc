<template>
  <div class="event-related-container">
    <div class="box-title">
<!--      赛事分析-->
      热门赛事
      <BulletinBar />
    </div>
<!--    <div v-if="hotGameShow">-->
<!--      <div style="display: flex; width: 414px;">-->
<!--        <HotMatchCart :hot-game-item="hotGameList[hotGameIndex]" />-->
<!--        <RealTimeData01 :hot-game-item="hotGameList[hotGameIndex]" />-->
<!--      </div>-->
<!--      <RealTimeData02 :hot-game-item="hotGameList[hotGameIndex]" />-->
<!--      <HistoricalAnalysis :hot-game-item="hotGameList[hotGameIndex]" />-->
<!--    </div>-->
<!--    <div class="box-title">热门赛事</div>-->
    <div class="hot-match" v-if="hotGameShow">
      <div class="hot-box">
        <swiper
            :autoplay="swiperOptions.autoplay"
            :loop="swiperOptions.loop"
            :speed="swiperOptions.speed"
            :spaceBetween="swiperOptions.spaceBetween"
            :coverflowEffect="swiperOptions.coverflowEffect"
            :slidesPerView="swiperOptions.slidesPerView"
            :slidesPerGroup="swiperOptions.slidesPerGroup"
            class="swiper"
            effect="coverflow"
            @swiper="onSwiper"
        >
          <swiper-slide class="hot-box-carousel" v-for="(item, index) in hotGameList" :key="index">
            <HotMatchCart :hot-game-item="item" @click="hotItemClick(item.id)" />
          </swiper-slide>
        </swiper>
        <div class="hot-box-navigation-left" @click="swiperLeft">
          <svg-icon name="function_Left"></svg-icon>
        </div>
        <div class="hot-box-navigation-right" @click="swiperRight">
          <svg-icon name="function_Right"></svg-icon>
        </div>
      </div>
      <HotMatchLeaderboard :hot-game-arr="Object.values(hotGameList).slice(0, 4)" />
    </div>
    <div class="box-title">赛事巡礼</div>
    <div class="tour-box">
      <MatchTourCard v-for="item in hotGameList" :key="item" :hot-game-item="item" />
      <div class="no-more">没有更多了</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from 'vue';
import HistoricalAnalysis from '@/views/home/components/EventRelatedContainer/components/HistoricalAnalysis.vue';
import HotMatchCart from '@/views/home/components/EventRelatedContainer/components/HotMatchCart.vue';
import HotMatchLeaderboard from '@/views/home/components/EventRelatedContainer/components/HotMatchLeaderboard.vue';
import RealTimeData01 from '@/views/home/components/EventRelatedContainer/components/RealTimeData01.vue';
import RealTimeData02 from '@/views/home/components/EventRelatedContainer/components/RealTimeData02.vue';
import MatchTourCard from '@/views/home/components/EventRelatedContainer/components/MatchTourCard.vue';
import BulletinBar from '@/views/home/components/EventRelatedContainer/components/BulletinBar.vue';
import { hotGame } from '@/api/home/banner';
import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue';
// import 'swiper/swiper.min.css';
// import 'swiper/modules/pagination/pagination.min.css';
// import 'swiper/modules/navigation/navigation.min.css'
import 'swiper/swiper-bundle.min.css';
import SwiperCore, { Autoplay, Pagination, Navigation, Scrollbar } from 'swiper';
SwiperCore.use([Autoplay, Pagination, Navigation, Scrollbar]);

export default defineComponent({
  name: 'EventRelatedContainer',
  components: {
    HistoricalAnalysis,
    HotMatchCart,
    HotMatchLeaderboard,
    RealTimeData01,
    RealTimeData02,
    MatchTourCard,
    BulletinBar,
    Swiper,
    SwiperSlide
  },
  setup() {
    const hotGameList = ref([]);
    const hotGameShow = ref(false);
    const curSwiper: any = ref(null);
    const hotGameIndex: any = ref(0);
    const swiperOptions = reactive({
      autoplay: {
        disableOnInteraction: false, // 鼠标滑动后继续自动播放
        delay: 3000 // 3秒切换一次
      },
      speed: 500, // 切换过渡速度
      loop: true,
      slidesPerView: 2, // 解决最后一张切换到第一张中间的空白
      slidesPerGroup: 2,
      // centeredSlides: true, //设置slide居中
      spaceBetween: 20,
      coverflowEffect: {
        // rotate: 0, //slide做3d旋转时Y轴的旋转角度。默认50。
        stretch: 50, // 每个slide之间的拉伸值（距离），越大slide靠得越紧。 默认0。
        depth: 100, // slide的位置深度。值越大z轴距离越远，看起来越小。 默认100。
        modifier: 1 // depth和rotate和stretch的倍率，相当于            depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显。默认1。
        // slideShadows: false, //开启slide阴影。默认 true。
      },
      pagination: {
        clickable: true
      }
    });
    /**
     * 获取热门赛事
     */
    const getHotGame = async () => {
      const { data, code }: any = await hotGame();
      if (code === 1) {
        hotGameList.value = data;
        for (const i in hotGameList.value) {
          hotGameIndex.value = i;
          hotGameShow.value = true;
          return;
        }
      }
    };
    /**
     * 热门游戏点击
     */
    const hotItemClick = (id: any) => {
      hotGameIndex.value = id;
    };
    /**
     * 储存swiper实例
     */
    const onSwiper = (swiper: any) => {
      curSwiper.value = swiper;
    };
    /**
     * swiper 左边箭头事件
     */
    const swiperLeft = () => {
      console.log('☞', curSwiper.value);
      curSwiper.value.slidePrev();
    };
    /**
     * swiper 右边箭头事件
     */
    const swiperRight = () => {
      curSwiper.value.slideNext();
    };
    onMounted(() => {
      // nextTick(() => {
      getHotGame();
      // })
    });
    return {
      hotGameList,
      getHotGame,
      swiperOptions,
      onSwiper,
      curSwiper,
      swiperLeft,
      swiperRight,
      hotGameShow,
      hotGameIndex,
      hotItemClick
    };
  }
});
</script>

<!--suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.event-related-container {
  & > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      flex-shrink: 0;
    }
  }
  .box-title {
    font-family: PingFangSC-Medium;
    height: 74px;
    font-size: 18px;
    color: #fff;
    letter-spacing: 2px;
    font-weight: 500;
  }
  .hot-match {
    align-items: flex-start;
  }
  .hot-box {
    position: relative;
    width: 848px;
    height: 206px;
    border-radius: 14px;
    :deep(.swiper) {
      height: 100%;
      overflow: hidden;
    }
    &-navigation-left {
      left: -14px;
      right: auto;
    }
    &-navigation-right {
      right: -14px;
      left: auto;
    }
    &-navigation-left, &-navigation-right {
      position: absolute;
      top: 50%;
      width: 40px;
      height: 40px;
      border-radius: 40px;
      margin-top: -28px;
      z-index: 10;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(151, 151, 151, 0.2);
      :deep(.icon-function_Right), :deep(.icon-function_Left) {
        width: 8px;
        height: 16px;
      }
    }
  }
  .hot-box-carousel {
    //display: flex;
    //justify-content: space-between;
    //overflow: visible !important;
  }
  //:deep(.el-carousel) {
  //  overflow: visible;
  //  .el-carousel__indicator {
  //    display: none;
  //  }
  //  .el-carousel__arrow {
  //    height: 40px;
  //    width: 40px;
  //    background: #ffffff10;
  //    &:hover {
  //      background-color: #ffffff40;
  //    }
  //  }
  //}
  .tour-box {
    flex-direction: column;
  }
  .no-more {
    width: 100%;
    height: 89px;
    line-height: 89px;
    text-align: center;
    opacity: 0.4;
    font-family: PingFangSC-Regular, serif;
    font-size: 18px;
    color: #ffffff;
    letter-spacing: 0;
    font-weight: 400;
  }
}
</style>
