<template>
  <div class="withdraw wallet">
    <WalletForBricks />
    <div>
      <DefaultBankCard
        :info="defaultCard"
        :isWithdraw="true"
        v-if="defaultCard['id']"
        @show="showChange = !showChange"
      />
      <div v-else class="add-card" @click.stop="closePage">
        <div class="icon-box">
          <svg-icon name="function_add" :bottom="2" />
        </div>
        <div>添加银行卡</div>
      </div>
    </div>
    <template v-if="showChange">
      <div class="title-label-two">更换银行卡</div>
      <div>
        <el-radio-group v-model="currentCardId" class="select-bank-radio-group change-bank-radio-group">
          <el-radio v-for="bank in list" :key="bank.id" :label="bank['id']" :disabled="+bank['bank_status'] === 2">
            <el-image class="tag-image" style="height: 24px; width: 24px" :src="bank['bank_logo']" fit="cover">
              <template #placeholder>
                <div></div>
              </template>
              <template #error>
                <img style="height: 24px; width: 24px" :src="bankDefaultImage" alt="" />
              </template>
            </el-image>
            <span>{{ dealWithCardNumber(bank['bank_account']) }}</span>
            <span class="pl" v-if="+bank['bank_default'] === 1">默认</span>
            <span class="pl" v-if="+bank['bank_status'] === 2">维护中</span>
          </el-radio>
        </el-radio-group>
        <div v-if="list.length < 5" class="add-card add-w" @click.stop="closePage">
          <div class="icon-box">
            <svg-icon name="function_add" :bottom="2" />
          </div>
          <div>添加银行卡</div>
        </div>
      </div>
    </template>
    <ErrBox :message="formRules.bank_id" />
    <div class="title-label">提款金额</div>
    <div class="mask-box per-slot">
      <el-input
        v-model.number="formData.money"
        @blur="verifyMethod(false, 'money')"
        @input="verifyMethod(false, 'money')"
        type="number"
        :placeholder="placeholder"
      />
      <div class="all" @click="toAll">全部</div>
      <div v-if="flowingWater > 0" class="mask">
        <span>无法提款，流水还需要</span>
        <span>{{ priceToFixed(flowingWater) }}</span>
      </div>
    </div>
    <ErrBox :message="formRules.money" />
    <div>{{ availableMessage }}</div>
    <div class="title-label">验证码</div>
    <div class="per-slot">
      <el-input
        v-model.trim="formData.captcha_code"
        placeholder="请输入验证码"
        @blur="verifyMethod(false, 'captcha_code')"
        @input="verifyMethod(false, 'captcha_code')"
      />
      <div class="all" @click="sendCode">{{ countdown !== 60 ? countdown + 's' : '获取验证码' }}</div>
    </div>
    <ErrBox :message="formRules.captcha_code" />
    <div>请输入发送至手机尾号{{ phone }}的验证码</div>
    <div class="title-label">交易密码</div>
    <div>
      <el-input
        v-if="hasPassword"
        @blur="verifyMethod(false, 'password')"
        @input="verifyMethod(false, 'password')"
        v-model.trim="formData.password"
        placeholder="请输入交易密码"
      />
      <div v-else class="no-click-input" @click="goSettingPwd">
        <span class="no-data">请设置交易密码</span>
        <svg-icon name="function_Right" class="right-icon" />
      </div>
    </div>
    <ErrBox :message="formRules.password" />
    <div :class="{ submit: true, active: isApproved }" @click="submit">
      <LoadingCard v-show="submitLoad" />
      确认
    </div>
    <div class="help">遇到问题？ <span class="service" @click="service.open">在线客服</span></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import WalletForBricks from '@/views/wallet-manage/components/WithdrawPopUps/components/WalletForBricks.vue';
import DefaultBankCard from '@/views/wallet-manage/components/BankUsdtBox/components/DefaultBankCard.vue';
import openCustomerService from '@/hooks/OpenCustomerService';
import withdrawHook from '@/views/wallet-manage/components/WithdrawPopUps/hooks/withdrawHook';
import { priceToFixed } from '@/utils/numberFunction';
import LoadingCard from '@/components/LoadingCard/index.vue';
import defaultImageHook from '@/hooks/defaultImageHook';
import { dealWithCardNumber } from '@/utils/numberFunction';

export default defineComponent({
  name: 'BankWithdrawTab',
  props: {},
  emits: ['close'],
  components: { WalletForBricks, DefaultBankCard, LoadingCard },
  setup(props, { emit }) {
    const { proxy }: any = getCurrentInstance();

    const {
      defaultCard,
      formData,
      hasPassword,
      countdown,
      sendCode,
      toAll,
      submit,
      phone,
      flowingWater,
      verifyMethod,
      formRules,
      submitLoad,
      isApproved,
      usdtMessage,
      frequency,
      availableQuota,
      placeholder,
      availableMessage,
      currentCardId,
      list,
      showChange
    } = withdrawHook(1);

    function closePage() {
      emit('close');
      proxy.mittBus.emit('closeAddBankPopUps', true);
    }

    const service = openCustomerService();

    const { bankDefaultImage } = defaultImageHook();

    const goSettingPwd = () => {
      proxy.mittBus.emit('openSettingPwd', 1);
    };

    return {
      service,
      closePage,
      defaultCard,
      formData,
      hasPassword,
      countdown,
      sendCode,
      toAll,
      submit,
      phone,
      flowingWater,
      priceToFixed,
      formRules,
      submitLoad,
      isApproved,
      usdtMessage,
      frequency,
      availableQuota,
      placeholder,
      availableMessage,
      verifyMethod,
      currentCardId,
      list,
      bankDefaultImage,
      dealWithCardNumber,
      showChange,
      goSettingPwd
    };
  }
});
</script>

<style lang="scss" scoped>
.withdraw {
  .add-w {
    height: 80px !important;
  }
  .add-card {
    height: 130px;
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
}
</style>
