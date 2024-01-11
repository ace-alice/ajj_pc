<template>
  <div class="user-info">
    <div v-if="!isLogin" class="no-login" @click.stop="onShowPopUps(!showPopUps)">
      登录

      <teleport to="#app">
        <div :class="{ 'login-pop-ups': true, 'done-pop-ups': !showPopUps }" @click.stop="closePopUps">
          <div :class="{ 'login-page': true, done: !showPopUps }" @click.stop>
            <LRBox />
          </div>
        </div>
      </teleport>
    </div>
    <div v-if="isLogin" class="is-login" @click.stop="onShowPopUps(!showPopUps)">
      <el-image :src="userInfo.avatar_url" class="hot-team-image">
        <template #placeholder>
          <div class="image-slot">
            <img :src="defaultTeamLogo" alt="" />
          </div>
        </template>
        <template #error>
          <div class="image-slot">
            <img :src="defaultTeamLogo" alt="" />
          </div>
        </template>
      </el-image>
      <teleport to="#app">
        <div :class="{ 'is-login-pop-ups': true, 'is-done-pop-ups': !showPopUps && isLogin }" @click.stop>
          <UserInfoBox @close="closePopUps" />
        </div>
      </teleport>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import UserInfoBox from '@/layout/components/Header/components/UserInfoBox.vue';
import LRBox from '@/layout/components/Header/components/LRBox.vue';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import defaultImageHook from '@/hooks/defaultImageHook';
import store from '@/store';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'UserInfo',
  components: { UserInfoBox, LRBox },
  setup() {
    const userInfo = computed(() => store.getters.getUserInfo);

    const { defaultTeamLogo } = defaultImageHook();

    const isLogin = computed(() => {
      return !!store.getters.getToken;
    });

    const route = useRoute();

    watch(
      () => route,
      (newVal) => {
        if (newVal.query && newVal.query.to === 'login') {
          setTimeout(() => {
            onShowPopUps(true);
            route.query.to = '';
          }, 10);
        }
      },
      { deep: true }
    );

    const { showPopUps, onShowPopUps, closePopUps } = popUpsMittBusHook('closeUserInfoPage');

    return { isLogin, showPopUps, onShowPopUps, closePopUps, userInfo, defaultTeamLogo };
  }
});
</script>

<style lang="scss" scoped>
.user-info {
  height: 48px;
  width: 48px;
  background-color: #313339;
  border-radius: 50%;
  border: 1px solid var(--aux-color);
  cursor: pointer;
  font-family: PingFangSC-Regular, cursive;
  font-size: 16px;
  color: #ffffff;
  font-weight: 400;
  overflow: hidden;
  .no-login {
    height: 48px;
    width: 48px;
    line-height: 48px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .is-login {
    height: 48px;
    width: 48px;
    line-height: 48px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.is-login-pop-ups {
  position: absolute;
  height: 572px;
  width: 420px;
  top: 88px;
  right: 88px;
  background: var(--component-pop-ups-bg);
  z-index: 150;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.5s ease-in-out;
}
.is-done-pop-ups {
  transform: translateX(615px);
}
</style>
