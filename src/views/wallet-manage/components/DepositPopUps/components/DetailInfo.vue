<template>
  <div class="DetailInfo" v-if="detailInfo && +detailInfo['getway']">
    <div class="detail-box-x" @click="closePage">X</div>
    <div class="detail-box-header">
      <div class="detail-header">
        <div>{{ countdown ? '待支付' : '已过期' }}</div>
        <div v-if="countdown">
          剩余支付时间：{{ String(Math.floor(countdown / 60)).padStart(2, '0') }}分{{
            String(Math.floor(countdown % 60)).padStart(2, '0')
          }}秒
        </div>
        <div v-else>已过期</div>
        <div>
          付款成功后金额自动到账。如超过15分钟仍未到账，请联系
          <span @click="service.open">在线客服</span> 帮您处理。
        </div>
      </div>
    </div>
    <div class="detail-box-body getway2-body" v-if="detailInfo && +detailInfo['getway'] === 3">
      <iframe :src="detailInfo && detailInfo['redirect_url']" class="detail-iframe" />
    </div>
    <div class="detail-box-body" v-if="detailInfo && +detailInfo['getway'] === 2">
      <div class="detail-title">存款信息</div>
      <div v-if="detailInfo && detailInfo['info'] && detailInfo['info']['amount']">
        <div class="label-left">存款金额</div>
        <div class="info-right">
          <span>{{ detailInfo['info']['amount'] }}</span>
        </div>
      </div>
      <div v-if="detailInfo && detailInfo['info'] && detailInfo['info']['exchange_price']">
        <div class="label-left">汇率</div>
        <div class="info-right">
          <span>{{ detailInfo['info']['exchange_price'] }}</span>
        </div>
      </div>
      <div v-if="detailInfo && detailInfo['info'] && detailInfo['info']['currency_type']">
        <div class="label-left">协议类型</div>
        <div class="info-right">
          <span>{{ detailInfo['info']['currency_type'] }}</span>
        </div>
      </div>
      <div v-if="detailInfo && detailInfo['info'] && detailInfo['info']['convert_amount']">
        <div class="label-left">支付金额</div>
        <div class="info-right">
          <span>{{ detailInfo['info']['convert_amount'] }}</span>
          <Copy :message="detailInfo['info']['convert_amount']" />
        </div>
      </div>
      <div v-if="detailInfo && detailInfo['info'] && detailInfo['info']['order_no']">
        <div class="label-left">订单号</div>
        <div class="info-right">
          <span>{{ detailInfo['info']['order_no'] }}</span>
          <Copy :message="detailInfo['info']['order_no']" />
        </div>
      </div>
      <div v-if="detailInfo && detailInfo['info'] && detailInfo['info']['protocol_address']">
        <div class="label-left">充值地址</div>
        <div class="info-right">
          <span>{{ detailInfo['info']['protocol_address'] }}</span>
          <Copy :message="detailInfo['info']['protocol_address']" />
        </div>
      </div>
      <div class="divider"></div>
      <div class="qr-title">充币地址二维码</div>
      <div class="qr-box">
        <QrcodeVue :value="detailInfo['info']['protocol_address']" level="H" />
      </div>
    </div>
    <div class="detail-box-footer" v-if="detailInfo && +detailInfo['getway'] === 3">
      <div class="footer-title">温馨提示：</div>
      <div>1.平台充值账户会不定时更换，请在获取最新信息后充值，否则将无法即时到账!</div>
      <div>2.填写的金额当与实际充值金额完全一致，否则将无法即时到账</div>
      <div>3.若存在10分钟后仍未到账，请联系 <span @click="service.open">在线客服</span></div>
    </div>
    <div class="detail-box-footer" v-if="detailInfo && +detailInfo['getway'] === 2">
      <div class="footer-title">温馨提示：</div>
      <div>1.请注意转账时要考虑到提币手续费因素，确保到账金额为30.262,错误金额将导致充值无法自动到账!</div>
      <div>
        2.请核对好数字币<span v-if="detailInfo && detailInfo['info'] && detailInfo['info']['protocol_address']"
          >钱包地址:{{ detailInfo['info']['protocol_address'] }}</span
        >
      </div>
      <div>
        3.请注意<span v-if="detailInfo && detailInfo['info'] && detailInfo['info']['currency_type']"
          >转账网络协议为{{ detailInfo['info']['currency_type'] }}</span
        >,错误的协议类型将导致无法自动到账
      </div>
      <div>4.请勿重复转账,每次充值都要重新发起订单获取最新收款地址</div>
      <div>5.订单到账金额参考实时汇率,5分钟不到账请联系 <span @click="service.open">在线客服</span></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import openCustomerService from '@/hooks/OpenCustomerService';
import QrcodeVue from 'qrcode-vue3';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';

export default defineComponent({
  name: 'DetailInfo',
  props: {
    detailInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: { QrcodeVue },
  emits: ['close'],
  setup(props, { emit }) {
    const service = openCustomerService(['closeDepositDetailPopUps']);

    function closePage() {
      emit('close');
    }

    let timer: any;

    const countdown = ref(30 * 60);

    watch(
      () => props.detailInfo,
      (newValue) => {
        if (newValue && newValue['getway']) {
          countdown.value = 30 * 60;
          clearInterval(timer);
          timer = null;
          timer = setInterval(() => {
            if (!countdown.value) {
              // countdown.value = 30 * 60;
              clearInterval(timer);
              timer = null;
              return;
            }
            countdown.value--;
          }, 1000);
        }
      },
      { deep: true }
    );

    return { service, closePage, countdown };
  }
});
</script>

<style lang="scss" scoped>
.DetailInfo {
  position: relative;
  .detail-box-x {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    text-align: center;
    z-index: 99;
    font-size: 20px;
    cursor: pointer;
  }
  .detail-box-header {
    height: 205px;
    width: 100%;
    background: #17191e;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .detail-header {
      width: 453px;
      div:nth-child(1) {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #ffffff;
        font-weight: 600;
        margin-bottom: 16px;
      }
      div:nth-child(2) {
        font-family: PingFangSC-Regular, cursive;
        font-size: 18px;
        color: #c2c7d2;
        font-weight: 400;
        margin-bottom: 12px;
      }
      div:nth-child(3) {
        width: 340px;
        line-height: 1.2em;
        font-family: PingFangSC-Regular, cursive;
        font-size: 14px;
        color: #c2c7d2;
        font-weight: 400;
        span {
          color: var(--aux-color);
          cursor: pointer;
        }
      }
    }
    &::before {
      content: '';
      position: absolute;
      width: 644px;
      height: 240px;
      border-radius: 100%;
      background: #17191e;
      bottom: -73px;
      left: -53px;
      border: 2px solid #ffffff30;
      z-index: -5;
    }
  }
  .detail-box-body {
    width: 453px;
    border-radius: 12px;
    background-color: #fff;
    margin: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .detail-title {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #17191e;
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 24px;
    }
    & > div {
      width: calc(100% - 80px);
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      .label-left {
        width: 88px;
        flex-shrink: 0;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #c2c7d2;
        font-weight: 600;
      }
      .info-right {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #535865;
        font-weight: 600;
        span:nth-child(1) {
          flex-grow: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        span:nth-child(2) {
          flex-shrink: 0;
        }
      }
    }
    .divider {
      height: 1px;
      background-color: #00000005;
      width: 100%;
      margin-top: 8px;
      margin-bottom: 24px;
    }
    .qr-title {
      width: auto;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #535865;
      font-weight: 600;
    }
    .qr-box {
      height: 120px;
      width: 120px;
      margin-bottom: 24px;
      overflow: hidden;
      //noinspection CssInvalidPseudoSelector
      :deep(img) {
        height: 120px;
        width: 120px;
      }
    }
  }
  .detail-box-footer {
    width: 453px;
    border-radius: 12px;
    margin: 24px auto 42px;
    position: relative;
    font-family: PingFangSC-Regular, cursive;
    font-size: 12px;
    color: #c2c7d2;
    font-weight: 400;
    div {
      line-height: 1.5em;
    }
    span {
      color: var(--aux-color);
      cursor: pointer;
    }
    .footer-title {
      font-size: 14px;
      margin-bottom: 12px;
    }
  }
  .detail-iframe {
    height: 100%;
    width: 100%;
    border: none;
    border-radius: 12px;
  }
  .getway2-body {
    height: 460px;
  }
}
</style>
