<template>
  <div class="MaintenanceNotice">
    <teleport to="#app">
      <div
        :class="{ 'maintenance-notice-pop-ups': true, 'maintenance-notice-done': !showPopUps }"
        @click.stop="closePopUps"
      >
        <div class="MaintenanceNoticeCard" @click.stop>
          <el-image :src="img" class="header">
            <template #placeholder>
              <div></div>
            </template>
            <template #error>
              <div></div>
            </template>
          </el-image>
          <div class="title">公告</div>
          <div class="text" v-html="message.replace(/\n/g, '<br />')"></div>
          <div class="btn-group">
            <div @click="closePopUps">知道了</div>
            <div @click="closePopUps">取消</div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';

export default defineComponent({
  name: 'MaintenanceNotice',
  props: {},
  components: {},
  setup() {
    const message = ref('');

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const img = require('@/assets/image/message/pop_notice2.png');

    const { proxy }: any = getCurrentInstance();

    const showPopUps = ref(false);

    function closePopUps() {
      showPopUps.value = false;
    }

    onMounted(() => {
      proxy.mittBus.on('closeMaintenanceNotice', (msg: string) => {
        message.value = msg;
        showPopUps.value = true;
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off('closeMaintenanceNotice');
    });

    return { message, showPopUps, closePopUps, img };
  }
});
</script>

<style lang="scss" scoped></style>
