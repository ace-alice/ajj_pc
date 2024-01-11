<template>
  <div class="welfare-card">
    <div v-for="card in showCard" :key="card.key">
      <el-image style="height: 64px; width: 64px" :src="card['svg']" fit="fill">
        <template #placeholder>
          <div></div>
        </template>
        <template #error>
          <div></div>
        </template>
      </el-image>
      <div class="card-name">{{ card['name'] }}</div>
      <div class="card-key">{{ priceToFixed(cardInfo[card.key]) }}</div>
    </div>
    <div class="more-card" v-show="showCard.length < 6">
      <div>
        升级成为
        <span>vip{{ nextLevel }}</span>
        可解锁更多专属权益
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { priceToFixed } from '@/utils/numberFunction';

export default defineComponent({
  name: 'WelfareCard',
  props: {
    cardInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    currentLevel: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {},
  setup(props) {
    const svgNameObj: any = [
      {
        name: '晋级礼金',
        key: 'upgrade',
        svg: require('@/assets/image/vip/vip_cashgift.png')
      },
      {
        name: '生日礼金',
        key: 'birthday',
        svg: require('@/assets/image/vip/vip_brigift.png')
      },
      {
        name: '提款额度',
        key: 'withdrawals_limit',
        svg: require('@/assets/image/vip/vip_lines.png')
      },
      {
        name: '提款次数',
        key: 'withdrawals',
        svg: require('@/assets/image/vip/vip_number.png')
      },
      {
        name: '月首充返现',
        key: 'first_bonus_cap',
        svg: require('@/assets/image/vip/vip_first_cash.png')
      },
      {
        name: '月复活金',
        key: 'resurrection_bonus_cap',
        svg: require('@/assets/image/vip/vip_month_cash.png')
      }
    ];

    const showCard = computed(() => {
      return svgNameObj.filter((card: any) => {
        return props.cardInfo[card.key] && Number(props.cardInfo[card.key]) > 0;
      });
    });

    const nextLevel = computed(() => {
      return Number(props.currentLevel['vip_current_level']) < 10
        ? Number(props.currentLevel['vip_current_level']) + 1
        : 0;
    });

    return { showCard, nextLevel, priceToFixed };
  }
});
</script>

<style lang="scss" scoped>
.welfare-card {
  display: flex;
  & > div {
    flex-shrink: 0;
    height: 148px;
    width: 224px;
    background: var(--component-bg);
    border-radius: 8px;
    margin-right: 24px;
    font-size: 16px;
    font-weight: 600;
    font-family: PingFangSC-Medium;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .card-name {
      color: #c2c7d2;
      line-height: 24px;
      margin-top: 10px;
    }
    .card-key {
      color: var(--aux-color);
      line-height: 24px;
    }
  }
  .more-card {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #c2c7d2;
    flex-grow: 1;
    font-weight: 600;
    text-align: center;
    white-space: pre-wrap;
    span {
      color: var(--aux-color);
    }
  }
}
</style>
