<template>
  <div class="account-setting">
    <div class="account-setting-header">
      <svg-icon name="last_more" @click.stop="onShowPopUps(false)"></svg-icon>
    </div>
    <div class="account-setting-main">
      <div class="title">帐户设置</div>
      <div class="account-info" @click.stop="settingClick(2)">
        <span>账户密码</span>
        <div>
          <svg-icon name="function_Right"></svg-icon>
        </div>
      </div>
      <div class="account-info" @click.stop="settingClick(3)">
        <span>交易密码</span>
        <div>
          <span v-if="+userInfo['funds_password'] === 0">未设置</span>
          <svg-icon name="function_Right" :left="20" :bottom="1"></svg-icon>
        </div>
      </div>
      <!--      <div class="account-info">-->
      <!--        <span>语言</span>-->
      <!--        <div>-->
      <!--          <span>简体中文</span>-->
      <!--          <svg-icon name="function_Right" left="20" bottom="1"></svg-icon>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="account-submit" @click="outAccount">切换账号</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { useStore } from 'vuex';
import { removeLocal } from '@/utils/storage';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AccountSetting',
  components: {
    SvgIcon
  },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const store = useStore();
    const router = useRouter();
    const userInfo = computed(() => {
      return store.getters.getUserInfo;
    });
    const settingClick = (index: number) => {
      proxy.mittBus.emit('showSettingDialog', index);
    };
    function onShowPopUps(bool: boolean) {
      proxy.mittBus.emit('closeAccountSetting', bool);
    }
    const outAccount = () => {
      onShowPopUps(false);
      store.commit('user/REMOVE_TOKEN');
      store.commit('user/REMOVE_USER_INFO');
      removeLocal('userInfo');
      removeLocal('token');
      router.push({ name: 'Home' });
    };
    return {
      settingClick,
      userInfo,
      onShowPopUps,
      outAccount
    };
  }
});
</script>

<style lang="scss" scoped>
.account-setting {
  &-header {
    margin: 32px 0 0 66px;
    :deep(.icon-last_more) {
      width: 16px;
      height: 16px;
      opacity: 0.6;
      cursor: pointer;
    }
  }
  &-main {
    width: 390px;
    margin: 80px auto 0;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    .title {
      margin-bottom: 40px;
      font-size: 38px;
      color: #ffffff;
      letter-spacing: 0;
    }
    .account-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 66px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #c2c7d2;
      letter-spacing: 0;
      font-weight: 500;
      border-bottom: 1px solid rgba(83, 88, 101, 1);
      cursor: pointer;
    }
    .account-submit {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 54px;
      background: #ee9e01;
      border-radius: 8px;
      margin-top: 44px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 500;
      cursor: pointer;
    }
  }
}
</style>
