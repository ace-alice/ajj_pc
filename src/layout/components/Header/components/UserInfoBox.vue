<template>
  <div class="user-info-box">
    <div class="user-info-box-header">
      <div class="user-info-box-header-l">
        <el-image :src="userInfo.avatar_url" class="user-aviator">
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
        <div class="user-title">
          <span>
            <span>{{ userInfo.username }}</span> <Copy :message="userInfo.username" />
          </span>
          <span>
            <CountTo :startVal="Number(startVal)" :endVal="Number(priceToFixed(centerAmount)) || 0" :duration="1000" />
          </span>
        </div>
      </div>
      <div class="user-info-box-header-r" @click="getInfo('')">
        <span>编辑个人信息</span>
      </div>
    </div>
    <div class="user-info-box-vip">
      <div class="user-info-box-vip-header">
        <div class="vip-title">
          <span>VIP {{ userInfo.vip_current_level }}</span>
          <span @click="goPath">立即升级<svg-icon name="function_next"></svg-icon></span>
        </div>
      </div>
      <div class="user-info-box-vip-footer">
        <span>升级VIP{{ +userInfo.vip_current_level + 1 }}成为尽享更多权益</span>
      </div>
    </div>
    <div class="user-info-box-form">
      <div v-for="info in infoList" :key="info.code" @click="getInfo(info.code)">
        <span>{{ info.name }}</span>
        <svg-icon name="function_next"></svg-icon>
      </div>
    </div>
    <div class="user-info-box-logout">
      <span @click="signOutConfirm">退出登录</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import store from '@/store';
import defaultImageHook from '@/hooks/defaultImageHook';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { signOutUser } from '@/api/login';
import { useRouter } from 'vue-router';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import { ElMessage } from 'element-plus';
import { removeLocal } from '@/utils/storage';
import CountTo from '@/components/VueCountTo/index.vue';
import { priceToFixed } from '@/utils/numberFunction';

export default defineComponent({
  name: 'UserInfoBox',
  props: {},
  components: { SvgIcon, CountTo },
  emits: ['close'],
  setup(props, { emit }) {
    const userInfo = computed(() => store.getters.getUserInfo);

    const { defaultTeamLogo } = defaultImageHook();

    const centerAmount = computed(() => {
      return store.getters.getCenterAmount;
    });

    const startVal = ref(0);

    watch(
      () => centerAmount.value,
      (_, oldVal) => {
        startVal.value = Number(oldVal) ? Number(oldVal) : 0;
      },
      { deep: true }
    );

    const { onShowPopUps } = popUpsMittBusHook('closeUserInfoBoxPage');

    /**
     * 退出登录
     */
    const signOutConfirm = () => {
      signOutUser()
        .then((res: any) => {
          if (+res.code === 1) {
            onShowPopUps(false);
            store.commit('user/REMOVE_TOKEN');
            store.commit('user/REMOVE_USER_INFO');
            removeLocal('userInfo');
            removeLocal('token');
            router.push({ name: 'Home' });
          }
        })
        .catch((err: any) => {
          ElMessage.error(err.msg || err.message);
        })
        .finally(() => {
          location.reload();
        });
    };

    const infoList = [
      { name: '收款账户管理', code: 'wallet-manage' },
      { name: '存取款记录', code: 'in-record' },
      { name: '交易记录', code: 'trade-record' },
      { name: '注单记录', code: 'betting-record' }
    ];

    const router = useRouter();

    function getInfo(code: string) {
      emit('close');
      if (code === 'wallet-manage') {
        router.push({ name: 'WalletManage' });
        return;
      }
      router.push({
        name: 'UserCenter',
        query: {
          'user_code': code
        }
      });
    }
    /**
     * 跳转至vip
     */
    const goPath = () => {
      emit('close');
      router.push({ name: 'VipCenter' });
    };

    onMounted(() => {
      store.dispatch('wallet/getCenterAmount');
    });

    return {
      userInfo,
      defaultTeamLogo,
      signOutConfirm,
      infoList,
      getInfo,
      onShowPopUps,
      goPath,
      startVal,
      priceToFixed,
      centerAmount
    };
  }
});
</script>

<style lang="scss" scoped>
.user-info-box {
  font-family: DIN-Medium, cursive;
  width: 356px;
  margin: 0 auto;
  font-size: 18px;
  color: #ffffff;
  letter-spacing: 0;
  font-weight: 500;
  &-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 80px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    &-l {
      display: flex;
      //flex: 1 0 50%;
      justify-content: center;
      align-items: center;
      padding-left: 16px;
      .user-aviator {
        width: 48px;
        height: 48px;
        border-radius: 48px;
        border: 1px solid var(--aux-color);
        img {
          width: 48px;
          height: 48px;
        }
      }
      .user-title {
        display: flex;
        flex-direction: column;
        margin-left: 12px;
        > span {
          line-height: 24px;
          color: #fff;
          letter-spacing: 0;
        }
        > span:nth-child(1) {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          font-weight: 400;
          display: flex;
          align-items: center;
          max-width: 30px;
          span:nth-child(1) {
            max-width: 84px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex-shrink: 0;
          }
          span:nth-child(2) {
            margin-left: 16px;
            flex-shrink: 0;
          }
        }
        > span:nth-child(2) {
          font-family: DIN-Medium, cursive;
          font-size: 18px;
          font-weight: 500;
        }
      }
    }
    &-r {
      display: flex;
      //flex: 1 0 50%;
      padding-right: 16px;
      justify-content: center;
      align-items: center;
      span {
        display: flex;
        justify-content: center;
        width: 108px;
        height: 34px;
        line-height: 34px;
        background: #ee9e01;
        border-radius: 8px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
        font-weight: 500;
        cursor: pointer;
      }
    }
  }
  &-vip {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 272px;
    height: 126px;
    margin: 24px auto;
    padding: 24px 20px;
    background-image: linear-gradient(0deg, #75737a 0%, #97969e 57%, #adacb0 100%);
    border-radius: 16px;
    &-header {
      display: flex;
      flex-direction: column;
      .vip-title {
        display: flex;
        justify-content: space-between;
        span {
          display: flex;
          align-items: center;
          color: #fff;
          letter-spacing: 0;
          font-weight: 500;
        }
        span:nth-child(1) {
          font-family: DIN-Medium, cursive;
          font-size: 18px;
        }
        span:nth-child(2) {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          justify-content: flex-end;
          cursor: pointer;
          :deep(.icon-function_next) {
            width: 6px;
            height: 12px;
            margin-left: 12px;
          }
        }
      }
    }
    &-footer {
      display: flex;
      align-items: center;
      span {
        line-height: 24px;
        opacity: 0.6;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;
        font-weight: 400;
      }
    }
  }
  &-form {
    display: flex;
    flex-direction: column;
    width: 310px;
    margin: 0 auto;
    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 20px;
      line-height: 20px;
      cursor: pointer;
      margin: 10px 0;
      span {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #c2c7d2;
        letter-spacing: 0;
        font-weight: 400;
      }
      :deep(.icon-function_next) {
        width: 6px;
        height: 12px;
        margin-left: 12px;
      }
    }
  }
  &-logout {
    width: 314px;
    margin: 40px auto 0;
    span {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 38px;
      line-height: 38px;
      background: #ee9e01;
      border-radius: 8px;
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
