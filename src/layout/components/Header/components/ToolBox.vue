<template>
  <div class="tool-box">
    <LangChange />
    <MessageCenter />
    <UserInfo />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UserInfo from '@/layout/components/Header/components/UserInfo.vue';
import MessageCenter from '@/layout/components/Header/components/MessageCenter.vue';
import LangChange from '@/layout/components/Header/components/LangChange.vue';

export default defineComponent({
  name: 'ToolBox',
  components: { UserInfo, MessageCenter, LangChange },
  setup() {
    return {};
  }
});
</script>

<style lang="scss" scoped>
.tool-box {
  position: absolute;
  right: 0;
  top: 0;
  height: 88px;
  display: flex;
  align-items: center;
  padding: 0 44px;
  & > div + div {
    margin-left: 24px;
  }
}
</style>
