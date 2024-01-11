<template>
  <div class="AddAccountCard" @click.stop="onShowPopUps(!showPopUps)">
    <div class="icon-box">
      <svg-icon name="function_add" :bottom="2" />
    </div>
    <div>添加虚拟币账户</div>
    <teleport to="#app">
      <div :class="{ 'wallet-pop-ups': true, 'wallet-done-pop-ups': !showPopUps }" @click.stop="closePopUps">
        <div :class="{ 'wallet-page': true, 'wallet-page-done': !showPopUps }" @click.stop>
          <AddUsdtPopUps @close="closePopUps" />
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import AddUsdtPopUps from '@/views/wallet-manage/components/BankUsdtBox/components/AddUsdtPopUps.vue';

export default defineComponent({
  name: 'AddUsdtCard',
  props: {},
  components: { SvgIcon, AddUsdtPopUps },
  setup() {
    const { showPopUps, onShowPopUps, closePopUps } = popUpsMittBusHook('closeAddUsdtPopUps');

    return { showPopUps, onShowPopUps, closePopUps };
  }
});
</script>

<style lang="scss" scoped>
.AddAccountCard {
  height: 80px;
  width: 364px;
  border: 1px dashed var(--aux-color);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: PingFangSC-Regular, cursive;
  font-size: 16px;
  color: var(--aux-color);
  letter-spacing: 0;
  font-weight: 400;
  cursor: pointer;
  .icon-box {
    width: 38px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    border: 1px solid var(--aux-color);
    border-radius: 50%;
    margin-right: 16px;
  }
}
div + .AddAccountCard {
  margin-top: 16px;
}
</style>
