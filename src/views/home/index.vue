<template>
  <div class="home">
    <TopBannerContainer />
    <EventRelatedContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TopBannerContainer from './components/TopBannerContainer/index.vue';
import EventRelatedContainer from './components/EventRelatedContainer/index.vue';

export default defineComponent({
  name: 'Home',
  components: { TopBannerContainer, EventRelatedContainer },
  setup() {
    return {};
  }
});
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  margin-top: 32px;
}
</style>
