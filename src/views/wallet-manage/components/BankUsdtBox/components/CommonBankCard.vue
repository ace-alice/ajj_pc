<template>
  <div :class="{ CommonBankCard: true, maintain: +info['bank_status'] === 2 || true }">
    <el-image class="bottom-image" style="height: 70px; width: 70px" :src="info['bank_logo']" fit="cover">
      <template #placeholder>
        <div></div>
      </template>
      <template #error>
        <img style="height: 70px; width: 70px" :src="defaultTeamLogo" alt="" />
      </template>
    </el-image>
    <div class="default-card" v-if="+info['bank_status'] === 2" @click.stop="toSetDefault">维护中</div>
    <div class="default-card" v-else @click.stop="toSetDefault">设为默认</div>
    <div class="card-name">
      <el-image class="tag-image" style="height: 16px; width: 16px" :src="info['bank_logo']" fit="cover">
        <template #placeholder>
          <div></div>
        </template>
        <template #error>
          <img style="height: 16px; width: 16px" :src="defaultTeamLogo" alt="" />
        </template>
      </el-image>
      <div class="card-info">
        {{ info['bank_name'] }}
      </div>
    </div>
    <div class="card-number">
      {{ dealWithCardNumber(info['bank_account']) }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import defaultImageHook from '@/hooks/defaultImageHook';
import { dealWithCardNumber } from '@/utils/numberFunction';

export default defineComponent({
  name: 'CommonBankCard',
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  emits: ['setDefault'],
  components: {},
  setup(props, { emit }) {
    const { defaultTeamLogo } = defaultImageHook();

    function toSetDefault() {
      emit('setDefault', props.info);
    }

    return { defaultTeamLogo, toSetDefault, dealWithCardNumber };
  }
});
</script>

<style lang="scss" scoped>
.maintain {
  color: #ffffff20 !important;
}
.CommonBankCard {
  height: 82px;
  width: 366px;
  background: #262932;
  border-radius: 8px;
  position: relative;
  color: #ffffff;
  overflow: hidden;
  & + .CommonBankCard {
    margin-top: 16px;
  }
  .bottom-image {
    position: absolute;
    bottom: -32px;
    right: -6px;
    opacity: 0.3;
    border-radius: 50%;
  }
  .card-number {
    position: absolute;
    bottom: 16px;
    left: 24px;
    font-family: DIN-Medium, cursive;
    font-size: 18px;
    color: #ffffff;
    font-weight: 600;
  }
  .card-name {
    display: flex;
    align-items: center;
    position: absolute;
    left: 24px;
    top: 14px;
    .tag-image {
      padding: 4px;
      border-radius: 50%;
      background-color: #ffffff;
    }
    .card-info {
      margin-left: 14px;
      font-family: PingFangSC-Regular, cursive;
      font-size: 14px;
      color: #ffffff;
      font-weight: 400;
    }
  }
  .default-card {
    position: absolute;
    padding: 5px 13px;
    background-color: #00000020;
    backdrop-filter: blur(10px);
    border-radius: 0 8px 0 13px;
    font-family: PingFangSC-Regular, cursive;
    font-size: 14px;
    color: #ffffff;
    font-weight: 400;
    right: 0;
    top: 0;
    cursor: pointer;
    &:hover {
      background-color: var(--aux-color);
    }
    &:active {
      box-shadow: 12px 12px 24px #ffffff40 inset;
    }
  }
}
</style>
