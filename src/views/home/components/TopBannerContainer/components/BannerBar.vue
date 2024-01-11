<template>
  <div :class="{ 'banner-bar': true, active: active }" @click.stop="clickSwipeHandler(banner)">
    <el-image style="height: 100%; width: 256px; border-radius: 14px" :src="banner['banner_path']" fit="cover">
      <template #placeholder>
        <div></div>
      </template>
      <template #error>
        <img style="height: 100%; width: 256px; border-radius: 14px" :src="defaultImage" alt="" />
      </template>
    </el-image>
    <div class="right">
      <div>{{ banner['name'] }}</div>
      <div>{{ banner['desc'] }}</div>
    </div>
    <div class="banner-label">{{ banner['name'] }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { getLocal } from '@/utils/storage';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'BannerBar',
  components: {},
  props: {
    banner: {
      type: Object,
      default: () => {
        return {};
      }
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const defaultImage = require('@/assets/image/default/banner-01.jpeg');

    const { proxy }: any = getCurrentInstance();

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

    return { defaultImage, clickSwipeHandler };
  }
});
</script>

<style lang="scss" scoped>
.active {
  background-color: var(--component-attached-bg) !important;
}
.banner-bar {
  height: 144px;
  width: 650px;
  background-color: var(--component-bg);
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  & + .banner-bar {
    margin-top: 24px;
  }
  display: flex;
  & > div {
    flex-shrink: 0;
  }
  .right {
    flex-grow: 1;
    padding: 24px 32px;
    div {
      width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      & + div {
        margin-top: 12px;
      }
      &:nth-child(1) {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #c2c7d2;
        font-weight: 600;
      }
      &:nth-child(2) {
        font-family: PingFangSC-Regular, cursive;
        font-size: 16px;
        color: #535865;
        font-weight: 400;
      }
    }
  }
  .banner-label {
    position: absolute;
    width: 48px;
    height: 18px;
    line-height: 18px;
    padding: 3px 15px;
    background-image: linear-gradient(150deg, #fece43 0%, #ffad3d 100%);
    border-radius: 4px;
    top: 24px;
    right: 25px;
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #ffffff;
    letter-spacing: 0;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
