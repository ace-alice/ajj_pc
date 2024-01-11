<template>
  <div class="no-click-input select-bank-item" @click.stop="onShowPopUpsHandle">
    <div v-if="isSelectBankInfo" class="bank-label">
      <el-image class="bank-image" style="height: 24px; width: 24px" :src="isSelectBankInfo['bank_logo']" fit="cover">
        <template #placeholder>
          <div></div>
        </template>
        <template #error>
          <img style="height: 24px; width: 24px" :src="bankDefaultImage" alt="" />
        </template>
      </el-image>
      <span class="value">{{ isSelectBankInfo['bank_name'] }}</span>
    </div>
    <span v-else class="no-data">请选择开户银行</span>
    <svg-icon name="function_Right" class="right-icon" />
  </div>
  <teleport to="#app">
    <div :class="{ 'select-pop-ups': true, 'select-done-pop-ups': !showPopUps }" @click.stop="closePopUps">
      <div :class="{ 'select-page': true, 'select-page-done': !showPopUps }" @click.stop>
        <div class="select-bank">
          <el-scrollbar>
            <div class="wallet select-bank-box">
              <div class="title">开户银行</div>
              <div class="title-label-two">选择银行</div>
              <div>
                <el-radio-group v-model="CurrentBank" class="select-bank-radio-group">
                  <el-radio v-for="bank in list" :key="bank['id']" :label="bank['id']">
                    <el-image class="tag-image" style="height: 24px; width: 24px" :src="bank['bank_logo']" fit="cover">
                      <template #placeholder>
                        <div></div>
                      </template>
                      <template #error>
                        <img style="height: 24px; width: 24px" :src="bankDefaultImage" alt="" />
                      </template>
                    </el-image>
                    <span>{{ bank['bank_name'] }}</span>
                  </el-radio>
                </el-radio-group>
              </div>
              <div :class="{ 'select-btn': true, active: isActive }" @click="onSubmit">确认</div>
            </div>
          </el-scrollbar>
          <svg-icon name="last_more" size="1.5" class="close-icon" @click.stop="closePopUps" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import { getBankInfoList } from '@/api/wallet/bank-usdt';
import defaultImageHook from '@/hooks/defaultImageHook';

export default defineComponent({
  name: 'SelectBankItem',
  props: {
    bankId: {
      type: Number,
      default: 0
    }
  },
  emits: ['submit'],
  components: {},
  setup(props, { emit }) {
    const { showPopUps, onShowPopUps, closePopUps } = popUpsMittBusHook('closeSelectBankPopUps', [
      'closeAddBankPopUps'
    ]);

    function onShowPopUpsHandle() {
      CurrentBank.value = props.bankId;
      onShowPopUps(!showPopUps.value);
    }

    const CurrentBank = ref(0);

    const list = ref([]);

    function getList() {
      getBankInfoList().then((res: any) => {
        if (Number(res.code) === 1) {
          list.value = res.data;
        }
      });
    }

    const isSelectBankInfo = computed(() => {
      if (!props.bankId) return null;
      const temp = list.value.filter((bank: any) => {
        return +props.bankId === +bank.id;
      });
      if (temp.length > 0) {
        return temp[0];
      } else {
        return null;
      }
    });

    const CurrentBankInfo = computed(() => {
      if (!CurrentBank.value) return null;
      const temp = list.value.filter((bank: any) => {
        return +CurrentBank.value === +bank.id;
      });
      if (temp.length > 0) {
        return temp[0];
      } else {
        return null;
      }
    });

    const isActive = computed(() => {
      return CurrentBankInfo.value && +props.bankId !== +CurrentBank.value;
    });

    function onSubmit() {
      if (!isActive.value) return;
      emit('submit', CurrentBankInfo.value);
      closePopUps();
    }

    const { bankDefaultImage } = defaultImageHook();

    onMounted(() => {
      getList();
    });

    return {
      showPopUps,
      onShowPopUps,
      closePopUps,
      CurrentBank,
      onShowPopUpsHandle,
      list,
      bankDefaultImage,
      onSubmit,
      isActive,
      isSelectBankInfo
    };
  }
});
</script>

<style lang="scss" scoped>
.select-bank-item {
  .bank-label {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    .bank-image {
      margin: 0 6px;
      border-radius: 50%;
    }
  }
}
.select-bank {
  height: 100%;
  width: 100%;
  font-family: PingFangSC-Regular, cursive;
  font-size: 16px;
  color: #ffffff;
  font-weight: 400;
  position: relative;
  .close-icon {
    position: absolute;
    top: 32px;
    left: 66px;
    cursor: pointer;
  }
  .select-bank-box {
    width: 1012px;
    margin: 100px auto 10px;
    .tag-image {
      border-radius: 50%;
      margin: 0 12px;
    }
    .select-btn {
      height: 54px;
      width: 390px;
      margin: 26px auto 36px;
      background: #ffffff60;
      border-radius: 4px;
      text-align: center;
      line-height: 54px;
      font-family: PingFangSC-Regular, cursive;
      font-size: 16px;
      color: #ffffff;
      font-weight: 400;
      cursor: not-allowed;
    }
    .active {
      background: var(--aux-color);
      cursor: pointer;
      &:hover {
        box-shadow: 12px 12px 24px #ffffff30 inset;
      }
      &:active {
        box-shadow: 12px 12px 24px #ffffff60 inset;
      }
    }
  }
}
</style>
