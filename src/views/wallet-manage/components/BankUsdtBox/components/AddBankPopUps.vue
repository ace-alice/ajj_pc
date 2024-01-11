<template>
  <div class="AddBankPopUps">
    <el-scrollbar>
      <div class="wallet add-bank-box">
        <div class="title">添加银行卡账户</div>
        <div class="add-tag">是否还需要 <span @click="toAddUsdt">添加虚拟币账户</span></div>
        <div class="title-label">开户人</div>
        <el-input
          v-model.trim="formData.owner_name"
          placeholder="请输入开户人真实姓名"
          @input="verifyMethod(false, 'owner_name')"
        />
        <ErrBox :message="formRules.owner_name" />
        <div class="title-label">开户银行</div>
        <SelectBankItem @submit="changeBankInfo" :bank-id="formData['bank_id'] || 0" />
        <ErrBox :message="formRules.bank_id" />
        <div class="title-label">开户城市</div>
        <SelectPlaceItem @submit="changePlaceInfo" :form="formData" />
        <ErrBox :message="formRules.place" />
        <div class="title-label">银行卡号</div>
        <el-input
          v-model.trim="formData.bank_account"
          @input="verifyMethod(false, 'bank_account')"
          placeholder="请输入银行卡号"
        />
        <ErrBox :message="formRules.bank_account" />
        <div class="title-label">手机号</div>
        <div class="no-click-input">
          <span class="no-data">{{ phoneHandling(formData.phone) }}</span>
        </div>
        <div class="title-label">验证码</div>
        <div class="per-slot">
          <el-input
            v-model.trim="formData.captcha_code"
            @input="verifyMethod(false, 'captcha_code')"
            placeholder="请输入短信验证码"
          />
          <div class="all" @click="sendCode">{{ countdown !== 60 ? countdown + 's' : '获取验证码' }}</div>
        </div>
        <ErrBox :message="formRules.captcha_code" />
        <div :class="{ submit: true, active: isApproved }" @click="submit">
          <LoadingCard v-show="submitLoad" />
          确认
        </div>
      </div>
    </el-scrollbar>
    <svg-icon name="last_more" size="1.5" class="close-icon" @click.stop="closePage" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, reactive, ref } from 'vue';
import { getLocal } from '@/utils/storage';
import { phoneHandling } from '@/utils/numberFunction';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { useStore } from 'vuex';
import { addBankCard } from '@/api/wallet/bank-usdt';
import LoadingCard from '@/components/LoadingCard/index.vue';
import SelectBankItem from '@/views/wallet-manage/components/BankUsdtBox/components/SelectBankItem.vue';
import SelectPlaceItem from '@/views/wallet-manage/components/BankUsdtBox/components/SelectPlaceItem.vue';
import { ElMessage } from 'element-plus';

const defaultForm = {
  bank_account: null,
  bank_name: null,
  place: null,
  province: null,
  owner_name: null,
  bank_id: null,
  bank_logo: null,
  captcha_code: null,
  phone: getLocal('userInfo').phone
};

const defaultRules = { bank_account: null, place: null, owner_name: null, bank_id: null, captcha_code: null };

export default defineComponent({
  name: 'AddBankPopUps',
  props: {},
  emits: ['close'],
  components: { SvgIcon, LoadingCard, SelectBankItem, SelectPlaceItem },
  setup(props, { emit }) {
    function closePage(init: boolean = false) {
      emit('close');
      if (init) {
        Object.assign(formRules, defaultRules);
        Object.assign(formData, defaultForm);
      }
    }

    const formData: any = reactive(Object.assign({}, defaultForm));

    const { proxy }: any = getCurrentInstance();

    function toAddUsdt() {
      closePage();
      proxy.mittBus.emit('closeAddUsdtPopUps', true);
    }

    const formRules: any = reactive(Object.assign({}, defaultRules));

    const store = useStore();

    const countdown = computed(() => {
      return store.getters.countdown;
    });

    function sendCode() {
      store.dispatch('captchaCode/sentCode');
    }

    const submitLoad = ref(false);

    function submit() {
      verifyMethod(true, '');
      if (!isApproved.value || submitLoad.value) return;
      submitLoad.value = true;
      addBankCard(formData)
        .then((res: any) => {
          if (+res.code === 1) {
            closePage(true);
            store.dispatch('bankAndUsdt/toGetBankList');
          } else {
            ElMessage({
              message: res.msg || res.message,
              duration: 2 * 1000,
              customClass: 'copy-message',
              grouping: true
            });
          }
        })
        .catch((err: any) => {
          ElMessage({
            message: err.msg || err.message,
            duration: 2 * 1000,
            customClass: 'copy-message',
            grouping: true
          });
        })
        .finally(() => {
          submitLoad.value = false;
          isApproved.value = false;
        });
    }

    const isApproved = ref(false);

    function verifyMethod(isSubmit: boolean, arg: string) {
      let tempApprove = true;
      for (const key of Object.keys(formRules)) {
        switch (key) {
          case 'owner_name':
            if (!formData['owner_name']) {
              if (isSubmit || key === arg) {
                formRules['owner_name'] = '请输入开户人真实姓名';
              }
              tempApprove = false;
            } else {
              formRules['owner_name'] = null;
            }
            break;
          case 'place':
            if (!formData['place']) {
              if (isSubmit || key === arg) {
                formRules['place'] = '请选择开户城市';
              }
              tempApprove = false;
            } else {
              formRules['place'] = null;
            }
            break;
          case 'bank_account':
            if (!formData['bank_account']) {
              if (isSubmit || key === arg) {
                formRules['bank_account'] = '请输入银行卡号';
              }
              tempApprove = false;
            } else {
              if (!/^\d+$/.test(formData['bank_account'])) {
                formRules['bank_account'] = '银行账号必须为纯数字';
                tempApprove = false;
              } else if (formData['bank_account'].length < 12) {
                formRules['bank_account'] = '银行账号最少12位';
                tempApprove = false;
              } else {
                formRules['bank_account'] = null;
              }
            }
            break;
          case 'captcha_code':
            if (!formData['captcha_code'] || String(formData['captcha_code']).length != 6) {
              if (isSubmit || key === arg) {
                formRules['captcha_code'] = '请输入6位短信验证码';
              }
              tempApprove = false;
            } else {
              if (!/^\d+$/.test(formData['captcha_code'])) {
                formRules['captcha_code'] = '短信验证码必须为纯数字';
                tempApprove = false;
              } else {
                formRules['captcha_code'] = null;
              }
            }
            break;
          case 'bank_id':
            if (!formData['bank_id']) {
              if (isSubmit || key === arg) {
                formRules['bank_id'] = '请选择开户行';
              }
              tempApprove = false;
            } else {
              formRules['bank_id'] = null;
            }
            break;
        }
      }
      isApproved.value = tempApprove;
    }

    function changeBankInfo(bankInfo: any) {
      console.log(bankInfo);
      Object.assign(formData, {
        bank_id: +bankInfo.id,
        bank_name: bankInfo.bank_name,
        bank_logo: bankInfo.bank_logo
      });
    }

    function changePlaceInfo(placeInfo: any) {
      Object.assign(formData, {
        province: placeInfo.province,
        place: placeInfo.place
      });
    }

    return {
      closePage,
      formData,
      toAddUsdt,
      phoneHandling,
      sendCode,
      submit,
      countdown,
      formRules,
      submitLoad,
      verifyMethod,
      isApproved,
      changeBankInfo,
      changePlaceInfo
    };
  }
});
</script>

<style lang="scss" scoped>
.AddBankPopUps {
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
  .add-bank-box {
    width: 366px;
    margin: 100px auto 150px;
    //noinspection CssInvalidPseudoSelector
    :deep(.el-input) {
      .el-input__inner {
        color: #ffffff !important;
        font-size: 18px !important;
      }
    }
  }
  .add-tag {
    font-family: PingFangSC-Regular, cursive;
    font-size: 16px;
    color: #ffffff;
    font-weight: 400;
    margin-bottom: 48px;
    span {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: var(--aux-color);
      font-weight: 600;
      cursor: pointer;
    }
  }
}
</style>
