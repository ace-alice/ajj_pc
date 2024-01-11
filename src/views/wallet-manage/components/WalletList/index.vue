<template>
  <div class="wallet-list">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane v-for="gameType in gameTypeList" :key="gameType.type" :label="gameType.name" :name="gameType.type">
        <div class="wallet-box">
          <VenueWalletCard
            v-for="wallet in gameType.gameList"
            :key="wallet['gameId']"
            :walletInfo="wallet"
            :isInt="[4].includes(+wallet['gameId'])"
            :type="gameType.type"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import VenueWalletCard from '@/views/wallet-manage/components/WalletList/components/VenueWalletCard.vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'WalletList',
  props: {},
  components: { VenueWalletCard },
  setup() {
    const store = useStore();

    const walletList = computed(() => {
      return store.getters.getGameList;
    });

    const gameTypeList = computed(() => {
      const result: any[] = [];
      for (const gameType of store.getters.getGameType) {
        const temp = walletList.value.filter((game: any) => {
          return game.type === gameType.type;
        });
        if (temp.length > 0) {
          result.push(Object.assign({}, gameType, { gameList: temp }));
        }
      }
      return result;
    });

    const activeName = ref('e-sports');

    function handleClick() {}

    return { gameTypeList, handleClick, activeName };
  }
});
</script>

<style lang="scss" scoped>
.wallet-list {
  width: 1040px;
  height: 440px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  //noinspection CssInvalidPseudoSelector
  :deep(.el-tabs) {
    width: 1040px;
    .el-tabs__header {
      .el-tabs__item {
        padding: 0;
        width: 180px;
        text-align: center;
        //line-height: unset !important;
        font-family: PingFangSC-Regular, cursive;
        font-size: 18px;
        color: #c2c7d2;
        font-weight: 400;
      }
      .is-active {
        color: #fff;
        font-weight: 600;
      }
    }
    .el-tabs__nav-wrap::after {
      background: #ffffff10;
    }
    .el-tabs__active-bar {
      background: var(--aux-color);
      width: 180px !important;
    }
  }
  .wallet-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
