<template>
  <div class="top-banner-container">
    <div>
      <SwipeBanner :bannerList="bannerList" />
    </div>
    <div>
<!--      <div>-->
<!--        <VideoBar />-->
<!--      </div>-->
      <BannerList :banner-list="bannerList" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import SwipeBanner from '@/views/home/components/TopBannerContainer/components/SwipeBanner.vue';
import VideoBar from '@/views/home/components/TopBannerContainer/components/VideoBar.vue';
import BannerList from '@/views/home/components/TopBannerContainer/components/BannerList.vue';
import { getBannerList } from '@/api/home/banner';

export default defineComponent({
  name: 'TopBannerContainer',
  components: { SwipeBanner, VideoBar, BannerList },
  setup() {
    const bannerList = ref([]);

    function toGetBannerList() {
      getBannerList().then((res: any) => {
        if (+res.code === 1 && res.data instanceof Array && res.data.length > 0) {
          bannerList.value = res.data;
        }
      });
    }

    onMounted(() => {
      toGetBannerList();
    });
    return { bannerList };
  }
});
</script>

<style lang="scss" scoped>
.top-banner-container {
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  .swiper-box {
    height: 312px;
    width: 650px;
  }
}
</style>
