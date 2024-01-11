<template>
  <span class="copy_btn" data-clipboard-action="copy" :data-clipboard-text="message" ref="copy"> 复制 </span>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, nextTick, onMounted } from 'vue';
import Clipboard from 'clipboard';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'Clipboard',
  props: ['message'],
  setup(props) {
    const { proxy }: any = getCurrentInstance();
    function handleCopy() {
      const clipboard = new Clipboard(proxy.$refs['copy'], {
        text: () => {
          return props.message + '';
        }
      });

      clipboard.on('success', () => {
        ElMessage({ message: '复制成功', customClass: 'copy-message', grouping: true });
      });
      clipboard.on('error', () => {
        ElMessage({ message: '复制失败', customClass: 'copy-message', grouping: true });
      });
    }
    onMounted(() => {
      nextTick(() => {
        handleCopy();
      });
    });
    return { handleCopy };
  }
});
</script>

<style lang="scss" scoped>
.copy_btn {
  display: inline-block;
  background: #ee9e01;
  border-radius: 11px;
  font-family: PingFangSC-Regular, cursive;
  font-size: 12px;
  color: #ffffff;
  font-weight: 400;
  height: 20px;
  line-height: 20px;
  padding: 0 6px;
  cursor: pointer;
  &:hover {
    box-shadow: 12px 12px 0 12px #ffffff30 inset;
  }
  &:active {
    box-shadow: 12px 12px 0 12px #ffffff60 inset;
  }
}
</style>
