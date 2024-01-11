<template>
  <div class="UsdtList">
    <transition
      enter-active-class="animate__animated animate__lightSpeedInLeft"
      leave-active-class="animate__animated animate__lightSpeedOutLeft"
    >
      <DefaultUsdtCard :info="defaultCard" :key="defaultCard['id']" v-show="defaultCard['id']" />
    </transition>
    <div class="bank-toast">虚拟账户最多只能添加5张</div>
    <transition-group enter-active-class="animate__animated animate__lightSpeedInLeft">
      <CommonUsdtCard v-for="bank in commonCard" :key="bank['id']" :info="bank" @setDefault="toSetDefault" />
      <AddUsdtCard v-show="list.length < 5" key="add" />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import DefaultUsdtCard from '@/views/wallet-manage/components/BankUsdtBox/components/DefaultUsdtCard.vue';
import CommonUsdtCard from '@/views/wallet-manage/components/BankUsdtBox/components/CommonUsdtCard.vue';
import AddUsdtCard from '@/views/wallet-manage/components/BankUsdtBox/components/AddUsdtCard.vue';
import { setDefaultUsdtApi } from '@/api/wallet/bank-usdt';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'UsdtList',
  props: {},
  components: { DefaultUsdtCard, CommonUsdtCard, AddUsdtCard },
  setup() {
    const store = useStore();

    const list = computed(() => {
      return store.getters.getUsdtList;
    });

    const defaultCard = computed(() => {
      const temp = list.value.filter((bank: any) => {
        return +bank.protocol_default === 1;
      });
      if (temp.length > 0) {
        return temp[0];
      } else {
        return {};
      }
    });

    const commonCard = computed(() => {
      return list.value.filter((bank: any) => {
        return +bank.protocol_default !== 1;
      });
    });

    function toSetDefault(bank: any) {
      setDefaultUsdtApi({ id: bank.id, protocol_default: 1 }).then((res: any) => {
        if (+res.code === 1) {
          store.dispatch('bankAndUsdt/toGetUsdtList');
        }
      });
    }

    onMounted(() => {
      store.dispatch('bankAndUsdt/toGetUsdtList');
    });

    return { list, defaultCard, commonCard, toSetDefault };
  }
});
</script>

<style lang="scss" scoped>
.UsdtList {
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
