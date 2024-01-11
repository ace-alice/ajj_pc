<template>
  <div class="wallet-manage">
    <div class="title">我的钱包</div>
    <div class="hello">您好，尊敬的VIP用户</div>
    <div class="wallet-box">
      <BankUsdtBox />
      <div class="middle-box">
        <WalletInfo />
        <WalletList />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BankUsdtBox from './components/BankUsdtBox/index.vue';
import WalletInfo from './components/WalletInfo/index.vue';
import WalletList from './components/WalletList/index.vue';

export default defineComponent({
  name: 'WalletManage',
  props: {},
  components: { BankUsdtBox, WalletInfo, WalletList },
  setup() {
    return {};
  }
});
</script>

<style lang="scss" scoped>
.wallet-manage {
  width: 100%;
  .title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #ffffff;
    letter-spacing: 2px;
    font-weight: 600;
    margin: 32px 0 16px;
  }
  .hello {
    font-family: PingFangSC-Regular, cursive;
    font-size: 18px;
    color: var(--aux-color);
    font-weight: 400;
    margin-bottom: 40px;
  }
  .wallet-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 78px;

    div {
      flex-shrink: 0;
    }
    .middle-box {
      width: 1040px;
    }
  }
}
</style>
