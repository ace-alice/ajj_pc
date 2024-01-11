<template>
  <div class="message-center">
    <div class="message-center-back" @click="routerBack">
      <svg-icon name="last_more"></svg-icon>
    </div>
    <div class="message-center-title">您的消息</div>
    <div class="message-center-main">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <transition mode="out-in" enter-active-class="bulletinIn" leave-active-class="bulletinOut">
          <el-tab-pane label="公告" name="bulletin">
            <BulletinList :active="activeName" />
          </el-tab-pane>
        </transition>
        <transition mode="out-in" enter-active-class="letterIn" leave-active-class="letterOut">
          <el-tab-pane label="站内信" :disabled="!isLogin" name="letter">
            <LetterList :active="activeName" />
          </el-tab-pane>
        </transition>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { useRouter } from 'vue-router';
import BulletinList from '@/views/message-center/components/BulletinList.vue';
import LetterList from '@/views/message-center/components/LetterList.vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'message-center',
  props: {},
  components: { SvgIcon, BulletinList, LetterList },
  setup() {
    const router = useRouter();

    function routerBack() {
      router.go(-1);
    }

    const store = useStore();

    const isLogin = computed(() => {
      return !!store.getters.getToken;
    });

    const activeName = ref('bulletin');

    function handleClick() {}

    return { isLogin, routerBack, activeName, handleClick };
  }
});
</script>

<style lang="scss" scoped>
.message-center {
  width: 100%;
  min-height: calc(100% - 115px);
  margin: 37px 0 78px;
  background: #363841;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  position: relative;

  //noinspection CssInvalidPseudoSelector
  :deep(.is-background) {
    .el-pager {
      li {
        font-family: PingFangSC-Medium;
        background: #ffffff05;
        border-radius: 8px;
        color: #ffffff60;
        font-weight: 600;
        font-size: 16px;
        &:hover {
          color: #ffffff;
        }
      }
      .is-active {
        background: var(--aux-color) !important;
        color: #fff;
      }
    }
    .btn-prev,
    .btn-next {
      background: none;
      color: #ffffff60;
      &:hover {
        color: #fff;
      }
      .el-icon {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
  .message-center-back {
    position: absolute;
    top: 32px;
    left: 66px;
    opacity: 0.6;
    font-size: 22px;
    cursor: pointer;
    transition: opacity 0.2s linear;
    &:hover {
      opacity: 1;
    }
  }
  .message-center-title {
    position: absolute;
    width: 1122px;
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #ffffff;
    letter-spacing: 0;
    font-weight: 500;
    top: 53px;
    left: 175px;
  }
  .message-center-main {
    width: 1122px;
    margin: 90px auto 48px;
    //noinspection CssInvalidPseudoSelector
    :deep(.el-tabs) {
      .el-tabs__header {
        .el-tabs__item {
          width: 560px;
          text-align: center;
          line-height: unset !important;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #c2c7d2;
          letter-spacing: 0;
          font-weight: 600;
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
        width: 320px !important;
        margin-left: 110px;
      }
    }
  }
}

.bulletinIn {
  animation: bulletinIn 0.5s linear;
}

.bulletinOut {
  top: 0;
  left: 0;
  animation: bulletinOut 0.5s linear;
  position: absolute;
}

@keyframes bulletinIn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes bulletinOut {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.letterIn {
  animation: letterIn 0.5s linear;
}
.letterOut {
  top: 0;
  left: 0;
  position: absolute;
  animation: letterOut 0.5s linear;
}

@keyframes letterIn {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes letterOut {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
