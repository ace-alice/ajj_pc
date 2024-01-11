<template>
  <div class="IaToastCard">
    <el-image :src="headerImg" class="header">
      <template #placeholder>
        <div></div>
      </template>
      <template #error>
        <div></div>
      </template>
    </el-image>
    <div class="text" v-html="message.text"></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'IaToastCard',
  props: {
    message: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {},
  setup(props) {
    const headerImg = computed(() => {
      if (props.message.header) {
        return props.message.header ? require(`@/assets/image/message/${props.message.header}.png`) : '';
      } else {
        return '';
      }
    });
    return { headerImg };
  }
});
</script>

<style lang="scss" scoped>
.IaToastCard {
  height: 278px;
  width: 488px;
  background: #363841;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-family: PingFangSC-Medium;
  font-size: 22px;
  color: #ffffff;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  animation: show 0.1s ease-in-out;
  box-shadow: 0 0 5px #ffffff60;
  .header {
    position: absolute;
    top: -72px;
    height: 156px;
    width: 166px;
  }
  .text {
    width: 80%;
    flex-shrink: 0;
    text-align: center;
    white-space: pre-wrap;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & + .IaToastCard {
    margin-top: 50px;
  }
}

@keyframes show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
