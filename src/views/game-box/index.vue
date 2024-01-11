<template>
  <div class="game-box">
    <iframe v-if="gameUrl" :src="gameUrl" :key="gameUrl" class="game-iframe" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'GameBox',
  props: {},
  components: {},
  setup() {
    const gameUrl = ref('');

    const store = useStore();

    const gameList = computed(() => {
      return store.getters.getGameList;
    });

    const route = useRoute();

    const router = useRouter();

    function setGameUrl() {
      if (!route.query.code) {
        router.push({ name: 'Home' });
      }
      for (const game of gameList.value) {
        if (game.code === route.query.code) {
          gameUrl.value = game.url;
          document.title = '小艾竞技-' + game.name;
        }
      }
      if (!gameUrl.value) {
        router.push({ name: 'Home' });
      }
    }

    watch(
      () => route.query.code,
      (newVal) => {
        if (!newVal) return;
        setGameUrl();
      }
    );

    onMounted(() => {
      setGameUrl();
    });

    return { gameUrl };
  }
});
</script>

<style lang="scss" scoped>
.game-box {
  height: 859px;
  width: 1528px;
  margin: 32px 0;
  .game-iframe {
    height: 859px;
    width: 1528px;
    border: 0;
  }
}
</style>
