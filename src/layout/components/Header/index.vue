<template>
  <div class="header-container">
    <MenuNav />
    <ToolBox />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MenuNav from '@/layout/components/Header/components/MenuNav.vue';
import ToolBox from '@/layout/components/Header/components/ToolBox.vue';

export default defineComponent({
  name: 'Header',
  components: { MenuNav, ToolBox },
  setup() {
    return {};
  }
});
</script>

<style lang="scss" scoped>
.header-container {
  width: calc(100% - 88px);
  height: 88px;
  background: var(--component-bg);
  position: relative;
}
</style>
