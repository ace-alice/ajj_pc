<template>
  <div class="activity-page">
    <el-affix :offset="105">
      <div class="tabs-box">
        <el-tabs v-model="activeIndex" @tab-change="tabChange">
          <el-tab-pane v-for="(tab, index) in tabArr" :key="tab.id" :label="tab.tab" :name="index" />
        </el-tabs>
      </div>
    </el-affix>
    <swiper
      v-if="tabShow"
      :width="swiperOptions.width"
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
      <swiper-slide v-for="tab in tabArr" :key="tab.id">
        <div class="slide-box" v-if="canShowList[String(tab.id)].length">
          <ActivityCard v-for="list in canShowList[String(tab.id)]" :key="list.id" :info="list"></ActivityCard>
        </div>
        <NoDataPage v-else />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue';
import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import 'swiper/modules/navigation/navigation.min.css';
import SwiperCore, { Scrollbar } from 'swiper';
SwiperCore.use([Scrollbar]);
import { promotionList, tabList } from '@/api/active-page';
import ActivityCard from '@/views/activity-page/components/ActivityCard.vue';
import NoDataPage from '@/components/NoDataPage/index.vue';

export default defineComponent({
  name: 'ActivityPage',
  props: {},
  components: { Swiper, SwiperSlide, ActivityCard, NoDataPage },
  setup() {
    const activeIndex = ref(0);

    const tabShow = ref(false);

    const tabArr = ref([{ id: 0, remark: '全部', sort: 1, tab: '全部' }]);

    function getTabList() {
      tabList()
        .then((res: any) => {
          // eslint-disable-next-line eqeqeq
          if (+res.code === 1) {
            tabArr.value = [{ id: 0, remark: '全部', sort: 1, tab: '全部' }, ...res.data];
            tabShow.value = true;
          }
        })
        .finally(() => {
          // setTimeout(() => {
          //   tabShow.value = tabList.value.length > 1;
          // }, 10);
        });
    }

    const activityList = ref([]);

    function getActivityList() {
      promotionList({ page: 1, limit: 1000 }).then((res: any) => {
        if (+res.code === 1) {
          activityList.value = res.data.data;
        }
      });
    }
    const scrollMaxHeight = computed(() => {
      return window.screen.height - 430;
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const defaultImage = require('@/assets/image/default/banner-01.jpeg');
    const curSwiper: any = ref(null);
    const swiperOptions = reactive({
      width: 1580,
      autoplay: false,
      slidesPerView: 1,
      speed: 500, // 切换过渡速度
      loop: false,
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

    const onSwiper = (swiper: any) => {
      curSwiper.value = swiper;
    };
    const onSlideChange = (swiper: any) => {
      activeIndex.value = swiper.activeIndex;
    };

    const canShowList = computed(() => {
      const temp: any = {};
      tabArr.value.forEach((tab: any) => {
        if (tab.id === 0) {
          temp['0'] = activityList.value;
        } else {
          temp[String(tab.id)] = activityList.value.filter((activity: any) => {
            return +tab.id === +activity.bid;
          });
        }
      });
      return temp;
    });

    function tabChange() {
      curSwiper.value.slideTo(activeIndex.value, 500, false);
    }

    onMounted(() => {
      getActivityList();
      getTabList();
    });

    return {
      activeIndex,
      defaultImage,
      curSwiper,
      swiperOptions,
      onSwiper,
      onSlideChange,
      tabArr,
      getTabList,
      tabShow,
      activityList,
      tabChange,
      canShowList,
      scrollMaxHeight
    };
  }
});
</script>

<style lang="scss" scoped>
.activity-page {
  padding: 16px 0 0;
  //noinspection CssInvalidPseudoSelector
  :deep(.el-affix--fixed) {
    z-index: 20 !important;
  }
  .tabs-box {
    background: var(--main-bg);
    box-shadow: 0 -17px var(--main-bg);
    z-index: -1;
    //noinspection CssInvalidPseudoSelector
    :deep(.el-tabs) {
      .el-tabs__header {
        .el-tabs__item {
          width: 180px;
          text-align: center;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #c2c7d2;
          font-weight: 500;
        }
        .is-active {
          color: #fff;
        }
      }
      .el-tabs__nav-wrap::after {
        background: #ffffff10;
      }
      .el-tabs__active-bar {
        background: var(--aux-color);
        width: 160px !important;
      }
    }
  }

  //noinspection CssInvalidPseudoSelector
  :deep(.swiper) {
    margin: 30px 0;
    .swiper-button-next {
      display: none;
    }
    .swiper-button-prev {
      display: none;
    }
    .swiper-pagination {
      display: none;
    }
  }
  .slide-box {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
