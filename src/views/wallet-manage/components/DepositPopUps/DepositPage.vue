<!--suppress CssInvalidPseudoSelector -->
<template>
  <div class="DepositPage">
    <el-scrollbar>
      <div class="deposit-box wallet">
        <div class="title">存款</div>
        <div class="title-label-two">存款方式</div>
        <div class="active-box" v-show="activityMessage">{{ activityMessage }}</div>
        <el-radio-group v-model="currentHeadChannelId" class="wallet-radio-group wallet-2-radio-group">
          <el-radio v-for="channel in walletList" :key="channel.id" :label="channel.id">
            <div class="channel-box">
              <el-image class="logo-image" style="height: 32px; width: 32px" :src="channel['deposit_logo']" fit="cover">
                <template #placeholder>
                  <div></div>
                </template>
                <template #error>
                  <img style="height: 32px; width: 32px" :src="defaultTeamLogo" alt="" />
                </template>
              </el-image>
              <span>{{ channel['deposit_name'] }}</span>
            </div>
          </el-radio>
        </el-radio-group>
        <div class="title-label-two" v-if="currentChannel.length">可选线路</div>
        <el-radio-group v-model="formData.channel_id" class="wallet-radio-group">
          <el-radio v-for="channel in currentChannel" :key="channel.id" :label="channel.id">{{
            channel['channel_name']
          }}</el-radio>
        </el-radio-group>
        <ErrBox :message="formRules['channel_id']" />
        <div class="title-label" v-show="+isBlockchain !== 2">姓名</div>
        <el-input
          v-show="+isBlockchain !== 2"
          v-model.trim="formData.account_name"
          @input="verifyMethod(false, 'account_name')"
          placeholder="请输入存款人姓名"
        />
        <ErrBox :message="formRules['account_name']" />
        <div class="title-label">存款金额</div>
        <div class="per-slot">
          <el-input
            type="number"
            @blur="verifyMethod(false, 'amount')"
            @input="verifyMethod(false, 'amount')"
            v-model.number="formData.amount"
            :placeholder="amountPlaceholder"
          />
          <div class="all"></div>
        </div>
        <ErrBox :message="formRules['amount']" />
        <div class="message-label" v-if="messageLabel">{{ messageLabel }}</div>
        <el-radio-group v-model="formData.amount" class="wallet-radio-group" @change="verifyMethod(false, 'amount')">
          <el-radio v-for="Price in walletPriceList" :key="Price" :label="Price">{{ Price }}</el-radio>
        </el-radio-group>
        <div :class="{ submit: true, active: true }" @click="submitHandle">立即存款</div>
        <div class="help">
          7x24小时极速到账服务。如超过15分钟仍未到账，请联系
          <span @click="service.open" class="service">在线客服</span> 帮您处理。
        </div>
      </div>
    </el-scrollbar>
    <svg-icon name="last_more" size="1.5" class="close-icon" @click.stop="closePage" />
    <teleport to="#app">
      <div :class="{ 'detail-pop-ups': true, 'detail-done-pop-ups': !showPopUps }" @click.stop>
        <div :class="{ 'detail-page': true, 'detail-page-done': !showPopUps }" @click.stop>
          <DetailInfo :detailInfo="detailInfo" @close="closePopUps" />
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import depositHook from '@/views/wallet-manage/hooks/depositHook';
import defaultImageHook from '@/hooks/defaultImageHook';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import openCustomerService from '@/hooks/OpenCustomerService';
import ErrBox from '@/components/ErrBox/index.vue';
import DetailInfo from '@/views/wallet-manage/components/DepositPopUps/components/DetailInfo.vue';

export default defineComponent({
  name: 'DepositPage',
  emits: ['close'],
  props: {},
  components: { ErrBox, SvgIcon, DetailInfo },
  setup(props, { emit }) {
    function closePage() {
      emit('close');
    }

    const { defaultTeamLogo } = defaultImageHook();

    const {
      currentHeadChannelId,
      currentChannel,
      formData,
      walletList,
      walletPriceList,
      submit,
      messageLabel,
      amountPlaceholder,
      formRules,
      verifyMethod,
      activityMessage,
      isBlockchain,
      detailInfo
    } = depositHook();

    const { showPopUps, onShowPopUps, closePopUps } = popUpsMittBusHook('closeDepositDetailPopUps');

    async function submitHandle() {
      const result = await submit();
      if (result) {
        closePage();
        setTimeout(() => {
          if (!detailInfo.value.getway) return;
          if (+detailInfo.value.getway === 3) {
            window.open(detailInfo.value.redirect_url, '_blank');
          }
          if (+detailInfo.value.getway === 2) {
            onShowPopUps(true);
          }
        }, 10);
      }
    }

    const service = openCustomerService(['closeDepositDetailPopUps']);

    return {
      closePage,
      currentHeadChannelId,
      currentChannel,
      formData,
      walletList,
      walletPriceList,
      defaultTeamLogo,
      submit,
      messageLabel,
      amountPlaceholder,
      showPopUps,
      onShowPopUps,
      closePopUps,
      service,
      submitHandle,
      formRules,
      verifyMethod,
      activityMessage,
      isBlockchain,
      detailInfo
    };
  }
});
</script>

<style lang="scss" scoped>
.DepositPage {
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
  .deposit-box {
    width: 390px;
    height: 500px;
    margin: 100px auto 150px;
  }
  .active-box {
    color: var(--aux-color);
    margin-bottom: 16px;
  }
}
</style>
