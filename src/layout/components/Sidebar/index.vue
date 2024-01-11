<template>
  <div class="sidebar-container">
    <div class="sidebar-setting" @click.stop="openSetting">
      <svg-icon name="Top_Setting"></svg-icon>
      <teleport to="#app">
        <div :class="{ 'login-pop-ups': true, 'done-pop-ups': !showPopUps }" @click.stop="closePopUps">
          <div :class="{ 'login-page': true, done: !showPopUps }" @click.stop>
            <Setting />
          </div>
        </div>
      </teleport>
    </div>
    <div class="sidebar-box">
      <div
        v-for="bar in barList"
        :key="bar.iconName"
        @click="toPath(bar)"
        :class="{ active: bar['route'] && route.name === bar['route'] }"
      >
        <component v-if="bar['component']" :is="bar['component']" :comInfo="bar" />
        <svg-icon v-else :name="bar.iconName"></svg-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import ActiveBonusBox from '@/layout/components/Sidebar/components/ActiveBonusBox.vue';
import CustomerServiceBox from '@/layout/components/Sidebar/components/CustomerServiceBox.vue';
import Setting from '@/layout/components/Header/components/Setting.vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';

export default defineComponent({
  name: 'Sidebar',
  components: { SvgIcon, ActiveBonusBox, CustomerServiceBox, Setting },
  setup() {
    const store = useStore();
    const userInfo = computed(() => {
      return store.getters.getUserInfo;
    });

    const isLogin = computed(() => {
      return Boolean(store.getters.getUserInfo?.id) || false;
    });

    const { showPopUps, onShowPopUps, closePopUps } = popUpsMittBusHook('closeAccountSetting');

    const barList = [
      { iconName: 'Top_contact 2', component: null, route: 'WalletManage' },
      { iconName: 'Top_vip', component: null, route: 'VipCenter' },
      { iconName: 'Top_gift', component: 'ActiveBonusBox' },
      { iconName: 'Top_contact', component: 'CustomerServiceBox' }
      // { iconName: 'Top_Newbie guide', component: null }
    ];

    const router = useRouter();

    const route = useRoute();

    const { proxy }: any = getCurrentInstance();

    function toPath(bar: any) {
      if (!bar.route) return;
      if (!isLogin.value) {
        setTimeout(() => {
          return proxy.mittBus.emit('closeUserInfoPage', true);
        }, 5);
      }
      router.push({ name: bar.route });
    }

    const openSetting = () => {
      if (userInfo.value.id) {
        onShowPopUps(!showPopUps.value);
      }
    };

    onMounted(() => {
      proxy.mittBus.on('openSettingPwd', (msg: number) => {
        if (msg) {
          openSetting();
        }
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off('openSettingPwd');
    });

    return { barList, toPath, route, isLogin, showPopUps, onShowPopUps, closePopUps, openSetting, userInfo };
  }
});
</script>

<style lang="scss" scoped>
.sidebar-container {
  width: 88px;
  height: 100%;
  background: var(--component-bg);
  border-radius: 0 8px 0 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 401;
  .sidebar-setting {
    width: 86px;
    height: 86px;
    background: rgba(238, 158, 1, 0.2);
    border: 1px solid rgba(238, 158, 1, 0.2);
    border-radius: 0 8px 0 0;
    cursor: pointer;
    font-size: 24px;
    text-align: center;
    line-height: 86px;
    transition: all 0.2s linear;
    &:hover {
      background: rgba(238, 158, 1, 0.3);
      border: 1px solid rgba(238, 158, 1, 0.3);
    }
    &:active {
      background: rgba(238, 158, 1, 0.4);
      border: 1px solid rgba(238, 158, 1, 0.4);
    }
  }
  .sidebar-box {
    width: 88px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .active {
      background: var(--aux-color) !important;
    }
    & > div {
      height: 46px;
      width: 46px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(151, 151, 151, 0.2);
      border-radius: 8px;
      margin-top: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      cursor: pointer;
      transition: all 0.2s linear;
      overflow: hidden;
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(151, 151, 151, 0.3);
        transform: translateY(-4px);
        box-shadow: 0 4px 4px rgba(238, 158, 1, 0.2);
      }
      &:active {
        background: rgba(255, 255, 255, 0.3);
        border: 1px solid rgba(151, 151, 151, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(238, 158, 1, 0.6);
      }
      & > div {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
