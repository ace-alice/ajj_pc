<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  setup() {
    function reSize() {
      const width = document.body.clientWidth;
      const origin = window.location.origin;
      if (width < 1200 && origin.indexOf('pc.') !== -1) {
        const originArr = origin.split('pc.');
        document.location.href = originArr[0] + originArr[1];
      }
    }

    onMounted(() => {
      reSize();
      window.addEventListener('resize', reSize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', reSize);
    });
  }
});
</script>
