<template>
  <div class="header-menu">
    <div class="j-lin-xin" @click="toPath('Home')">
      <svg-icon name="logo_alone" size="1.85" />
    </div>
    <div :class="{ 'j-lin-xin': route.name === 'Home' }" @click="toPath('Home')">首页</div>
    <div
      :class="{ 'venue-item': true, 'j-lin-xin': currentCode === venue.code }"
      v-for="venue in venueList"
      :key="venue.code"
      @click="toGameBox(venue)"
    >
      {{ venue.name }}
    </div>
    <div class="sale" :class="{ 'sale-active': isSaleRoute }" @click="toPath('ActivityPage')">
      <svg-icon class="svg-sale" name="sale" size="2" />
      <span class="text-sale">优惠</span>
    </div>
    <div class="down-item" @mouseenter="showDown = true" @mouseleave="showDown = false">
      <svg-icon name="function_Download" size="1.3" />
      <div>下载客户端</div>
      <div>新</div>
      <div :class="{ 'download-bar': true, done: !showDown }" @click.stop>
        <div class="title">
          <svg-icon name="pop_phone" size="1.3" />
          手机版
        </div>
        <div class="text">扫码即可下载手机APP</div>
        <QrcodeVue value="https://www.aijingji.com/download-page" myclass="qr-box" :width="100" :height="100" />
        <div class="text">随时随地体验精彩</div>
      </div>
    </div>
    <MaintenanceNotice />
    <VenueTogglePage />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import popUpsControlHook from '@/hooks/PopUpsControlHook';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { defaultGameInfo } from '@/utils/gameList';
import QrcodeVue from 'qrcode-vue3';
import SvgIcon from '@/components/SvgIcon/index.vue';
import MaintenanceNotice from '@/components/MaintenanceNotice/index.vue';
import VenueTogglePage from '@/components/VenueTogglePage/index.vue';
import store from '@/store';

export default defineComponent({
  name: 'MenuNav',
  components: { SvgIcon, QrcodeVue, MaintenanceNotice, VenueTogglePage },
  setup() {
    const store = useStore();

    const venueList = computed(() => {
      return store.getters.getGameList;
    });

    const showDown = ref(false);

    const { proxy }: any = getCurrentInstance();

    const router = useRouter();

    const route = useRoute();

    const isSaleRoute = computed(() => {
      return route.name === 'ActivityPage';
    });

    const currentCode = computed(() => {
      return route.query.code;
    });

    function toPath(route: string) {
      router.push({ name: route });
    }

    const isLogin = computed(() => {
      return !!store.getters.getToken;
    });

    async function toGameBox(venue: any, addPath: string = '') {
      if (currentCode.value === venue.code) return;
      if (!isLogin.value && venue.code === 'ag-real') {
        setTimeout(() => {
          proxy.mittBus.emit('closeUserInfoPage', true);
        }, 5);
        return;
      }
      proxy.mittBus.emit('showVenueTogglePage', { bool: true, bgSvg: venue.bgSvg });
      await venue
        .enterApi()
        .then((res: any) => {
          if (Number(res.code) === 1) {
            store.commit(
              'wallet/INIT_GAME_INFO',
              Object.assign({}, defaultGameInfo, {
                gameId: venue.gameId,
                url: res.data.url + addPath,
                maintainMessage: ''
              })
            );
          }
        })
        .catch((err: any) => {
          if (err.code === 60001) {
            store.commit(
              'wallet/INIT_GAME_INFO',
              Object.assign({}, defaultGameInfo, {
                gameId: venue.gameId,
                maintainMessage: err.msg || err.message,
                isMaintain: true
              })
            );
            proxy.mittBus.emit(`closeMaintenanceNotice`, err.msg || err.message);
          } else if (err.code === 60003 || err.code === 50005 || err.code === 50009) {
            store.commit(
              'wallet/INIT_GAME_INFO',
              Object.assign({}, defaultGameInfo, {
                gameId: venue.gameId,
                maintainMessage: err.msg || err.message,
                isLock: true
              })
            );
            proxy.mittBus.emit(`closeMaintenanceNotice`, err.msg || err.message);
          }
          store.commit('user/GET_GAME_URL', '');
        })
        .finally(() => {
          setTimeout(() => {
            proxy.mittBus.emit('showVenueTogglePage', { bool: false, bgSvg: '' });
          }, 600);
        });

      setTimeout(() => {
        const list = venueList.value.filter((game: any) => {
          return game.gameId === venue.gameId;
        });
        if (list.length === 0) return;

        if (list[0].isLock) {
          return;
        }
        if (list[0].isMaintain) {
          return;
        }

        router.push({
          name: 'GameBox',
          query: {
            code: venue.code
          }
        });
      }, 10);
    }

    onMounted(() => {
      proxy.mittBus.on('toJumpBClient', (arg: { code: string; addPath: string }) => {
        const temp = venueList.value.filter((game: any) => {
          return arg.code === 'game_id_' + game.gameId;
        });
        if (temp.length > 0) {
          toGameBox(temp[0], arg.addPath);
        }
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off('toJumpBClient');
    });
    return { venueList, showDown, currentCode, toGameBox, toPath, isSaleRoute, route };
  }
});
</script>

<style lang="scss" scoped>
.header-menu {
  width: 1528px;
  height: 100%;
  margin: auto;
  display: flex;
  align-items: center;

  .venue-item {
    cursor: pointer;
  }
  & > div {
    font-family: PingFangSC-Regular, serif;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0;
    font-weight: 400;
    margin-right: 40px;
    cursor: pointer;
    transition: all 0.3s linear;
    position: relative;
    &:hover {
      transform: translateY(-3px) scale(1.1);
    }
    &:active {
      color: antiquewhite;
    }
  }
  .j-lin-xin {
    //font-size: 18px;
    color: var(--aux-color);
    cursor: pointer;
    transform: scale(1.04);
    //text-shadow: 0 0 2px var(--aux-color);
    //font-weight: 600;
  }
  .sale-active {
    transform: none !important;
    animation: none !important;
    .svg-sale {
      display: block !important;
      animation: none !important;
      opacity: 1 !important;
      transform: translateY(8px) !important;
    }
    .text-sale {
      display: none !important;
    }
  }
  .sale {
    position: relative;
    min-height: 20px;
    min-width: 40px;
    font-size: 18px;
    cursor: pointer;
    color: #fff;
    height: 100%;
    &:hover {
      transform: none;
      animation: none;
      .svg-sale {
        display: none;
      }
      .text-sale {
        animation: none;
      }
    }
    &:active {
      transform: none;
      animation: none;
      .svg-sale {
        display: block;
        animation: none;
        opacity: 1;
        transform: translateY(8px) !important;
      }
      .text-sale {
        display: none;
      }
    }
    .svg-sale {
      position: absolute;
      bottom: 34px;
      opacity: 0;
      animation: topB 3s linear infinite 1.5s;
    }
    .text-sale {
      position: absolute;
      bottom: 34px;
      display: inline-block;
      //width: 200px;
      animation: topA 3s linear infinite;
    }
    @keyframes topA {
      0% {
        transform: translateY(44px);
        opacity: 0;
      }
      25% {
        transform: translateY(0);
        opacity: 1;
      }
      50% {
        transform: translateY(0);
        opacity: 1;
      }
      75% {
        transform: translateY(-44px);
        opacity: 0;
      }
      100% {
        transform: translateY(-44px);
        opacity: 0;
      }
    }

    @keyframes topB {
      0% {
        transform: translateY(52px);
        opacity: 0;
      }
      25% {
        transform: translateY(8px);
        opacity: 1;
      }
      50% {
        transform: translateY(8px);
        opacity: 1;
      }
      75% {
        transform: translateY(-36px);
        opacity: 0;
      }
      100% {
        transform: translateY(-36px);
        opacity: 0;
      }
    }
  }
  .down-item {
    display: flex;
    align-items: center;
    transform: none !important;
    div:nth-child(2) {
      margin: 0 10px 0 6px;
    }
    div:nth-child(3) {
      background: #ea3d3d;
      border-radius: 10px;
      padding: 3px 6px;
      font-family: PingFangSC-Regular, cursive;
      font-size: 12px;
      color: #ffffff;
      font-weight: 400;
    }
  }
}
.download-bar {
  width: 194px;
  height: 216px;
  position: fixed;
  top: 104px;
  left: 45%;
  background: var(--component-pop-ups-bg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  z-index: 120;
  transition: all 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  .title {
    display: flex;
    align-items: center;
    > * {
      margin: 0 6px;
    }
  }
  .text {
    font-family: PingFangSC-Regular, cursive;
    font-size: 12px;
    color: #ffffff60;
    font-weight: 400;
  }
}
.done {
  height: 0;
  opacity: 0;
  overflow: hidden;
}
</style>
