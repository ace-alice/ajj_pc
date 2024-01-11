<template>
  <div class="err-box" v-show="message">
    <span>{{ message }}</span>
    <svg-icon name="remind" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrBox',
  props: {
    message: {
      type: String,
      default: ''
    }
  },
  components: {},
  setup() {
    return {};
  }
});
</script>

<style lang="scss" scoped>
.err-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: PingFangSC-Regular, cursive;
  font-size: 16px;
  color: #ef5040;
  font-weight: 400;
  margin-bottom: 8px;
}
</style>
