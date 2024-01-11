<template>
  <div class="setting">
    <AccountSetting v-if="settingStatus === 1" />
    <UpdateAccountPassword v-if="settingStatus === 2" />
    <UpdateTradePassword v-if="settingStatus === 3" />
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import AccountSetting from '@/layout/components/Header/components/AccountSetting.vue';
import UpdateAccountPassword from '@/layout/components/Header/components/UpdateAccountPassword.vue';
import UpdateTradePassword from '@/layout/components/Header/components/UpdateTradePassword.vue';

export default defineComponent({
  name: 'Setting',
  components: {
    AccountSetting,
    UpdateAccountPassword,
    UpdateTradePassword
  },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const settingStatus = ref(1);
    onMounted(() => {
      proxy.mittBus.on('showSettingDialog', (value: number) => {
        settingStatus.value = value;
      });
    });
    onUnmounted(() => {
      proxy.mittBus.off('showSettingDialog');
    });
    return {
      settingStatus
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
