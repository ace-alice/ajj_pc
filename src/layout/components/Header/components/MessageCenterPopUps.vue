<template>
  <div class="MessageCenterPopUps" @click.stop>
    <div class="message-center-title">您的消息</div>
    <svg-icon name="next_more" class="next-more" size="2" @click="closePopUps" />
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <transition mode="out-in" enter-active-class="bulletinIn" leave-active-class="bulletinOut">
        <el-tab-pane label="公告" name="messageCenterPopUpsGetBulletin">
          <BulletinBox @click="toPath" />
        </el-tab-pane>
      </transition>
      <transition mode="out-in" enter-active-class="letterIn" leave-active-class="letterOut">
        <el-tab-pane label="站内信" :disabled="!isLogin" name="messageCenterPopUpsGetLetter">
          <LetterBox @click="toPath" />
        </el-tab-pane>
      </transition>
    </el-tabs>
    <div class="to-router" @click="toPath">
      <span></span>
      查看更多
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import BulletinBox from '@/layout/components/Header/components/BulletinBox.vue';
import LetterBox from '@/layout/components/Header/components/LetterBox.vue';
import { useStore } from 'vuex';
import SvgIcon from '@/components/SvgIcon/index.vue';

export default defineComponent({
  name: 'MessageCenterPopUps',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['closeBox'],
  components: { SvgIcon, BulletinBox, LetterBox },
  setup(props, { emit }) {
    watch(
      () => props.show,
      (newVal: boolean) => {
        if (newVal) {
          //
        }
      }
    );

    const store = useStore();

    const isLogin = computed(() => {
      return !!store.getters.getToken;
    });

    const activeName = ref('messageCenterPopUpsGetBulletin');

    function handleClick() {}

    const router = useRouter();

    function toPath() {
      emit('closeBox');
      router.push({ name: 'MessageCenter' });
    }

    function closePopUps() {
      emit('closeBox');
    }

    return { activeName, handleClick, toPath, isLogin, closePopUps };
  }
});
</script>

<style lang="scss" scoped>
.MessageCenterPopUps {
  width: 100%;
  position: relative;
  .message-center-title {
    width: 100%;
    padding: 28px 0 8px;
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #ffffff;
    font-weight: 600;
  }

  //noinspection CssInvalidPseudoSelector
  :deep(.el-tabs) {
    width: calc(100% - 66px);
    margin: 0 auto;
    .el-tabs__header {
      .el-tabs__item {
        width: 170px;
        text-align: center;
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
      width: 68px !important;
      margin-left: 45px;
    }
  }
  .to-router {
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: #ffffff10;
    border-top: 1px solid #ffffff20;
    border-radius: 0 0 8px 8px;
    font-family: PingFangSC-Regular, cursive;
    font-size: 14px;
    color: var(--aux-color);
    cursor: pointer;
  }
}
.bulletinIn {
  animation: bulletinIn 0.3s linear;
  overflow: hidden;
}

.bulletinOut {
  top: 0;
  left: 0;
  animation: bulletinOut 0.3s linear;
  position: absolute;
  overflow: hidden;
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
  animation: letterIn 0.3s linear;
  overflow: hidden;
}
.letterOut {
  top: 0;
  left: 0;
  position: absolute;
  animation: letterOut 0.3s linear;
  overflow: hidden;
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
.next-more {
  position: absolute;
  top: 30px;
  right: 38px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s linear;
  &:hover {
    opacity: 1;
  }
}
</style>
