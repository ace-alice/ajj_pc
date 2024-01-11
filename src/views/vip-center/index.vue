<template>
  <div class="vip-center">
    <div class="vip-center-title main-title">VIP中心</div>
    <div class="vip-center-title current-title">
      尊敬的VIP用户，您当前等级
      <span class="current-Level">{{ vipCurrentLevel['vip_current_level'] }}</span>
    </div>
    <div class="swiper-box">
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
        @swiper="setSwiper"
        @slideChange="slideChange"
        class="swiper"
        effect="coverflow"
      >
        <swiper-slide v-for="(vipInfo, index) in vipList" :key="index" v-slot="{ isActive }">
          <VipSwipeCard
            :vipInfo="vipInfo"
            :active="isActive"
            :vipNextInfo="vipList[index + 1] || vipList[vipList.length - 1]"
            :currentLevel="vipCurrentLevel"
          />
        </swiper-slide>
      </swiper>
    </div>
    <div class="vip-center-title tabs-title">VIP 权益</div>
    <WelfareCard :cardInfo="cardInfo" :currentLevel="vipCurrentLevel" />
    <div class="tabs-box">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="会员权益" name="MemberBenefits">
          <MemberBenefits />
        </el-tab-pane>
        <el-tab-pane label="VIP返水" name="VipRebate">
          <VipRebate />
        </el-tab-pane>
        <el-tab-pane label="月首充返现" name="FirstBack">
          <FirstBack />
        </el-tab-pane>
        <el-tab-pane label="月复活金" name="EasterGold">
          <EasterGold />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, reactive, ref } from 'vue';
import EasterGold from '@/views/vip-center/components/EasterGold.vue';
import FirstBack from '@/views/vip-center/components/FirstBack.vue';
import MemberBenefits from '@/views/vip-center/components/MemberBenefits.vue';
import VipRebate from '@/views/vip-center/components/VipRebate.vue';
import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue';
import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import 'swiper/modules/navigation/navigation.min.css';
import SwiperCore, { Autoplay, Scrollbar } from 'swiper';
SwiperCore.use([Autoplay, Scrollbar]);
import { getVipList, vipCurrent } from '@/api/vip-center';
import VipSwipeCard from '@/views/vip-center/components/VipSwipeCard.vue';
import WelfareCard from './components/WelfareCard.vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'VipCenter',
  props: {},
  components: { EasterGold, MemberBenefits, FirstBack, VipRebate, Swiper, SwiperSlide, VipSwipeCard, WelfareCard },
  setup() {
    const activeName = ref('MemberBenefits');

    const swiperOptions = reactive({
      width: 1464,
      height: 260,
      autoplay: false,
      slidesPerView: 3,
      speed: 500, // 切换过渡速度
      loop: false,
      centeredSlides: true, // 设置slide居中
      spaceBetween: 0,
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

    const activeIndex = ref(0);

    const vipCurrentLevel: any = reactive({});

    function getVipCurrentLevel() {
      vipCurrent().then((res: any) => {
        if (+res.code === 1) {
          Object.assign(vipCurrentLevel, res.data);
          if (swiperRefs) {
            swiperRefs.slideTo(vipCurrentLevel['vip_current_level']);
            activeIndex.value = swiperRefs.realIndex;
          }
        }
      });
    }

    const vipList = ref([]);

    let swiperRefs: any;

    function setSwiper(swiper: any) {
      swiperRefs = swiper;
      if (Object.keys(vipCurrentLevel).length > 0) {
        swiperRefs.slideTo(vipCurrentLevel['vip_current_level']);
        activeIndex.value = swiperRefs.realIndex;
      }
    }

    function slideChange() {
      activeIndex.value = swiperRefs.realIndex;
    }

    const cardInfo = computed(() => {
      if (vipList.value.length > 0) {
        return vipList.value[activeIndex.value];
      } else {
        return {};
      }
    });

    async function toGetVipList() {
      const data: any = await getVipList();
      if (Number(data.code) === 1) {
        vipList.value = data.data;
      }
    }

    const route = useRoute();

    onMounted(() => {
      toGetVipList();
      getVipCurrentLevel();
      nextTick(() => {
        const tab: any = route.query.tab;
        if (tab) {
          activeName.value = tab;
        }
      });
    });

    return { activeName, swiperOptions, activeIndex, vipList, setSwiper, vipCurrentLevel, slideChange, cardInfo };
  }
});
</script>

<style lang="scss" scoped>
.vip-center {
  margin-top: 32px;
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: #ffffff;
  .swiper {
    overflow: visible;
    overflow-x: hidden;
    height: 270px !important;
  }

  .swiper-slide {
    height: 260px !important;
    display: flex !important;
    align-items: flex-end !important;
    overflow: visible;
    margin-top: 10px;
    justify-content: center !important;
  }

  .swiper-slide-active {
    width: 500px !important;
  }

  & > div {
    width: 1464px;
    margin: 16px auto 0;
  }

  .main-title {
    letter-spacing: 2px;
    font-weight: 600;
  }

  .current-title {
    font-family: PingFangSC-Regular, cursive;
    color: var(--aux-color);
    .current-Level {
      font-family: DIN-Medium, cursive;
      font-size: 24px;
      color: #ffffff;
      letter-spacing: 2.67px;
      font-weight: 600;
      margin-left: 15px;
    }
  }

  .swiper-box {
    height: 270px;
    width: 1480px;
    margin-top: 46px;
    margin-bottom: 24px;
  }

  .tabs-title {
    letter-spacing: 2px;
    font-weight: 600;
  }

  .vip-center-title {
    width: 1504px;
  }

  .tabs-box {
    //noinspection CssInvalidPseudoSelector
    :deep(.el-tabs) {
      .el-tabs__header {
        .el-tabs__item {
          width: 365px;
          text-align: center;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #c2c7d2;
          letter-spacing: 0;
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
        width: 340px !important;
      }
    }
  }

  //noinspection CssInvalidPseudoSelector
  :deep(.el-table) {
    --el-table-tr-bg-color: #00000000;
    --el-table-bg-color: #00000000;
    --el-table-row-hover-bg-color: #00000000;
    --el-table-border-color: #ffffff20;
    --el-table-border: 1px solid #ffffff20;
    --el-table-header-bg-color: #ffffff20;
    --el-table-header-text-color: #c2c7d2;
    margin-top: 13px;
    .el-table__cell {
      padding: 16px 0;
      font-family: PingFangSC-Regular, cursive;
      font-size: 16px;
      color: #c2c7d2;
      font-weight: 400;
    }
    .el-table__header {
      .el-table__cell {
        font-family: PingFangSC-Regular, cursive;
        font-size: 18px !important;
        color: #c2c7d2;
        font-weight: 600;
      }
    }
  }
}
</style>

<style lang="scss">
.vip-rules {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--component-pop-ups-bg);
  border-radius: 3px;
  margin: 32px auto;
  padding: 48px 0;
  div {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #ffffff;
    font-weight: 600;
    width: 1276px;
    margin-bottom: 25px;
  }
  span {
    font-family: PingFangSC-Regular, cursive;
    font-size: 14px;
    color: #c2c7d2;
    font-weight: 400;
    display: block;
    width: 1207px;
    line-height: 32px;
  }
}
.receive-btn {
  width: 564px;
  height: 54px;
  margin: 0 auto 48px;
  background: var(--aux-color);
  border-radius: 8px;
  line-height: 54px;
  text-align: center;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
}
</style>
