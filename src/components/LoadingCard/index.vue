<template>
  <div class="loading-card">
    <img :src="loadIcon" alt="" class="animate" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingCard',
  props: {},
  components: {},
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loadIcon = require('@/assets/image/icons/move_loading.png');
    return { loadIcon };
  }
});
</script>

<style lang="scss" scoped>
.loading-card {
  width: 32px;
  height: 32px;
}
.animate {
  height: 32px;
  width: 32px;
  animation: run 1s infinite;
}
@keyframes run {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>
