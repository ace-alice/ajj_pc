<template>
  <div class="lr-box">
    <LoginBox v-if="lrStatus === 1" />
    <RegisterBox v-if="lrStatus === 2" />
    <RetrievePassword v-if="lrStatus === 3" />
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onActivated, onMounted, onUnmounted, ref } from 'vue';
import LoginBox from '@/layout/components/Header/components/LoginBox.vue';
import RegisterBox from '@/layout/components/Header/components/RegisterBox.vue';
import RetrievePassword from '@/layout/components/Header/components/RetrievePassword.vue';

export default defineComponent({
  name: 'ToolBox',
  components: { LoginBox, RegisterBox, RetrievePassword },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const lrStatus = ref(1);
    onMounted(() => {
      proxy.mittBus.on('showRegisterDialog', (value: number) => {
        lrStatus.value = value;
      });
    });
    onUnmounted(() => {
      proxy.mittBus.off('showRegisterDialog');
    });
    return {
      lrStatus
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
