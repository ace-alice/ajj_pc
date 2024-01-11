<template>
  <div class="ia-toast">
    <teleport to="#app">
      <div :class="{ 'toast-pop-ups': true }">
        <IaToastCard v-for="(message, index) in toastArray" :message="message" :key="index" />
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, onUnmounted, Ref, ref } from 'vue';
import IaToastCard from '@/components/IaToast/IaToastCard.vue';

interface ToastType {
  [key: string]: any;
  text: string;
  header: string;
}

export default defineComponent({
  name: 'IaToast',
  props: {},
  components: { IaToastCard },
  setup() {
    const toastArray: Ref<ToastType[]> = ref([]);

    const { proxy }: any = getCurrentInstance();

    let timer: any;

    onMounted(() => {
      proxy.mittBus.on('changeToast', (message: ToastType) => {
        toastArray.value.push(message);
        if (!timer) {
          timer = setInterval(() => {
            if (toastArray.value.length > 0) {
              toastArray.value.shift();
            } else {
              clearInterval(timer);
              timer = null;
            }
          }, 2500);
        }
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off('changeToast');
      clearInterval(timer);
      timer = null;
      toastArray.value = [];
    });

    return { toastArray };
  }
});
</script>

<style lang="scss" scoped>
.ia-toast {
}
</style>
