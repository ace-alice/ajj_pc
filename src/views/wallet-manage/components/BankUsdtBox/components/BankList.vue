<template>
  <div class="BankList">
    <transition
      enter-active-class="animate__animated animate__lightSpeedInLeft"
      leave-active-class="animate__animated animate__lightSpeedOutLeft"
    >
      <DefaultBankCard :info="defaultCard" :key="defaultCard['id']" v-show="defaultCard['id']" />
    </transition>
    <div class="bank-toast">银行卡最多只能添加5张</div>
    <transition-group enter-active-class="animate__animated animate__lightSpeedInLeft">
      <CommonBankCard v-for="bank in commonCard" :key="bank['id']" :info="bank" @setDefault="toSetDefault" />
      <AddBankCard v-show="list.length < 5" key="add" />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import DefaultBankCard from '@/views/wallet-manage/components/BankUsdtBox/components/DefaultBankCard.vue';
import CommonBankCard from '@/views/wallet-manage/components/BankUsdtBox/components/CommonBankCard.vue';
import AddBankCard from '@/views/wallet-manage/components/BankUsdtBox/components/AddBankCard.vue';
import { setDefaultApi } from '@/api/wallet/bank-usdt';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'BankList',
  props: {},
  components: { DefaultBankCard, CommonBankCard, AddBankCard },
  setup() {
    const store = useStore();

    const list = computed(() => {
      return store.getters.getBankList;
    });

    const defaultCard = computed(() => {
      const temp = list.value.filter((bank: any) => {
        return +bank.bank_default === 1;
      });
      if (temp.length > 0) {
        return temp[0];
      } else {
        return {};
      }
    });

    const commonCard = computed(() => {
      return list.value.filter((bank: any) => {
        return +bank.bank_default !== 1;
      });
    });

    function toSetDefault(bank: any) {
      setDefaultApi({ id: bank.id, bank_default: 1 }).then((res: any) => {
        if (+res.code === 1) {
          store.dispatch('bankAndUsdt/toGetBankList');
        }
      });
    }

    onMounted(() => {
      store.dispatch('bankAndUsdt/toGetBankList');
    });

    return { list, defaultCard, commonCard, toSetDefault };
  }
});
</script>

<style lang="scss" scoped>
.BankList {
  width: 366px;
  height: 500px;
  margin: auto;
  .bank-toast {
    font-family: PingFangSC-Regular, cursive;
    font-size: 14px;
    color: #ef5040;
    font-weight: 400;
    margin: 12px 0;
  }
}
</style>
