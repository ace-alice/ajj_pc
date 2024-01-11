<template>
  <div :class="{ DefaultBankCard: true, maintain: +info['bank_status'] === 2 || true }">
    <el-image class="icon-image" style="height: 88px; width: 88px" :src="info['bank_logo']" fit="cover">
      <template #placeholder>
        <div></div>
      </template>
      <template #error>
        <img style="height: 88px; width: 88px" :src="defaultTeamLogo" alt="" />
      </template>
    </el-image>
    <div class="default-tag" v-if="!isWithdraw">{{ +info['bank_status'] === 2 ? '维护中' : '当前默认' }}</div>
    <div class="default-tag change" @click="changeBank" v-else>{{ list.length > 1 ? '更换' : '添加' }}</div>
    <div class="card-name">
      <el-image class="tag-image" style="height: 24px; width: 24px" :src="info['bank_logo']" fit="cover">
        <template #placeholder>
          <div></div>
        </template>
        <template #error>
          <img style="height: 24px; width: 24px" :src="defaultTeamLogo" alt="" />
        </template>
      </el-image>
      <div class="card-info">
        <div>{{ info['bank_name'] }}</div>
        <div v-show="!isWithdraw">储蓄卡</div>
      </div>
    </div>
    <div class="card-number">
      {{ dealWithCardNumber(info['bank_account']) }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance } from 'vue';
import defaultImageHook from '@/hooks/defaultImageHook';
import { dealWithCardNumber } from '@/utils/numberFunction';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'DefaultBankCard',
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isWithdraw: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  emits: ['show'],
  setup(props, { emit }) {
    const { defaultTeamLogo } = defaultImageHook();

    const store = useStore();

    const list = computed(() => {
      return store.getters.getBankList;
    });

    const { proxy }: any = getCurrentInstance();

    function changeBank() {
      if (list.value.length === 1) {
        proxy.mittBus.emit('closeWithdrawPopUps', false);
        return proxy.mittBus.emit('closeAddBankPopUps', true);
      }
      emit('show');
    }

    return { defaultTeamLogo, dealWithCardNumber, list, changeBank };
  }
});
</script>

<style lang="scss" scoped>
.maintain {
  color: #ffffff20 !important;
}
.DefaultBankCard {
  height: 186px;
  width: 366px;
  background-image: linear-gradient(-49deg, #262932 0%, #474d60 100%);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  .default-tag {
    position: absolute;
    padding: 8px 13px;
    background-color: #00000020;
    backdrop-filter: blur(10px);
    border-radius: 0 8px 0 13px;
    font-family: PingFangSC-Regular, cursive;
    font-size: 14px;
    color: #ffffff;
    font-weight: 400;
    right: 0;
    top: 0;
  }
  .change {
    &:hover {
      background: var(--aux-color);
      cursor: pointer;
    }
  }
  .card-name {
    display: flex;
    align-items: center;
    position: absolute;
    left: 24px;
    top: 18px;
    .tag-image {
      padding: 5px;
      border-radius: 50%;
      background-color: #ffffff;
    }
    .card-info {
      margin-left: 16px;
      div:nth-child(1) {
        padding: 3px 0;
        font-family: PingFangSC-Regular, cursive;
        font-size: 16px;
        color: #ffffff;
        font-weight: 400;
      }
      div:nth-child(2) {
        padding: 3px 0;
        opacity: 0.6;
        font-family: PingFangSC-Regular, cursive;
        font-size: 14px;
        color: #ffffff60;
        letter-spacing: 0;
        font-weight: 400;
      }
    }
  }
  .card-number {
    position: absolute;
    bottom: 32px;
    left: 24px;
    font-family: DIN-Medium, cursive;
    font-size: 22px;
    color: #ffffff;
    font-weight: 600;
  }
  .icon-image {
    position: absolute;
    bottom: 30px;
    right: 20px;
    opacity: 0.4;
    border-radius: 50%;
  }
}
</style>
