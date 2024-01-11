<template>
  <div class="main-container">
    <el-affix target=".main-container" :offset="0.01">
      <Header />
    </el-affix>
    <Sidebar />
    <LayoutBody />
    <Footer />
    <IaToast />
    <IaVipMessageBox :bonusInfo="itemInfo" :show="showToast" @close="showToast = false" @success="successGet" />
    <ActivityBox />
    <SplashPage />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, nextTick, onMounted, reactive, ref, watch } from 'vue';
import Header from './components/Header/index.vue';
import Sidebar from './components/Sidebar/index.vue';
import LayoutBody from './components/LayoutBody/index.vue';
import Footer from './components/Footer/index.vue';
import { useStore } from 'vuex';
import IaToast from '@/components/IaToast/index.vue';
import IaVipMessageBox from '@/components/IaVipMessageBox/index.vue';
import { userAlert } from '@/api/global';
import ActivityBox from '@/views/activity-page/components/ActivityBox.vue';
import SplashPage from '@/components/SplashPage/index.vue';

export default defineComponent({
  name: 'Layout',
  components: { Header, Sidebar, LayoutBody, Footer, IaToast, IaVipMessageBox, ActivityBox, SplashPage },
  setup() {
    const store = useStore();

    const isLogin = computed(() => {
      return Boolean(store.getters.getUserInfo?.id) || false;
    });

    function toGetUserAlert() {
      if (!isLogin.value) return false;
      userAlert().then((res: any) => {
        if (+res.code === 1) {
          if ([1, 2].includes(Number(res.data.type))) {
            Object.assign(itemInfo, res.data);
            showToast.value = true;
          }
        }
      });
    }

    const showToast = ref(false);

    const itemInfo = reactive({});

    function successGet() {
      showToast.value = false;
      toGetUserAlert();
    }

    watch(
      () => isLogin.value,
      (newVal) => {
        if (newVal) store.dispatch('wallet/initGameInfo');
      }
    );

    const { proxy }: any = getCurrentInstance();

    onMounted(() => {
      store.dispatch('wallet/initGameInfo');
      store.dispatch('user/getUserInfo');
      toGetUserAlert();
      nextTick(() => {
        proxy.mittBus.emit('showSplashPage', true);
      });
    });
    return { successGet, itemInfo, showToast };
  }
});
</script>

<style lang="scss" scoped>
.main-container {
  overflow: hidden;
  position: relative;
  padding-bottom: 120px;
  min-height: calc(100% - 120px);
}
</style>
