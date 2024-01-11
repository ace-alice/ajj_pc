<template>
  <div class="prompt-alert" v-show="promptShow">
    <div class="prompt-alert-card">
      <div>{{ title }}</div>
      <div>{{ message }}</div>
      <div>
        <div @click="onConfirm">{{ confirmText }}</div>
        <div @click="onCancel">{{ cancelText }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PromptAlert',
  emits: ['confirm', 'cancel'],
  props: {
    title: {
      type: String,
      default: '提示'
    },
    message: {
      type: String,
      default: '提示信息'
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  components: {},
  setup(props, { emit }) {
    const promptShow = ref(false);

    function open() {
      promptShow.value = true;
    }

    async function onConfirm() {
      const result: any = await emit('confirm');
      if (result !== undefined || true) {
        promptShow.value = !result;
      } else {
        promptShow.value = false;
      }
    }

    async function onCancel() {
      await emit('cancel');
      promptShow.value = false;
    }

    return { promptShow, onConfirm, onCancel };
  }
});
</script>

<style lang="scss" scoped>
.prompt-alert {
  position: fixed;
  z-index: 1999;
  height: 100%;
  width: 100%;
  background: #00000060;
  display: flex;
  justify-content: center;
  align-items: center;
  .prompt-alert-card {
    background: var(--component-pop-ups-bg);
    border: 1px solid #ffffff20;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
