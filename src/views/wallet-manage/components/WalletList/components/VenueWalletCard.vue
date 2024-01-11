<template>
  <div class="VenueWalletCard" :class="{ 'wallet-loading': walletLoading }">
    <el-image :src="walletInfo['background']" class="icon-back">
      <template #placeholder>
        <div></div>
      </template>
      <template #error>
        <div></div>
      </template>
    </el-image>
    <div class="wallet-name">
      <el-image style="height: 32px; width: 32px; margin-right: 16px" :src="walletInfo.svg" fit="contain">
        <template #placeholder>
          <div></div>
        </template>
        <template #error>
          <div></div>
        </template>
      </el-image>
      {{ walletInfo.name }}钱包
    </div>
    <div class="wallet-number">
      <CountTo
        :startVal="Number(startVal)"
        :endVal="Number(priceToFixed(walletInfoStore.amount)) || 0"
        :duration="1000"
      />
    </div>
    <div class="in-out">
      <div class="box" @click.stop="onShowPopUpsHandle(1)">转入</div>
      <div class="cut"></div>
      <div class="box" @click.stop="onShowPopUpsHandle(2)">转出</div>
    </div>
    <div v-if="walletInfoStore.walletMaintain" :class="{ 'wallet-maintain': walletInfoStore.walletMaintain }">
      <!--      <svg-icon name="pop_maintenance" size="3" :bottom="20"></svg-icon>-->
      <el-image class="maintain-image" :src="popMaintenance" fit="fill">
        <template #placeholder>
          <div></div>
        </template>
        <template #error>
          <div></div>
        </template>
      </el-image>
      <span>维护中</span>
    </div>
    <teleport to="#app">
      <div :class="{ 'game-wallet-pop-ups': true, 'game-wallet-done-pop-ups': !showPopUps }" @click.stop="closePopUps">
        <div :class="{ 'game-wallet-page': true, 'game-wallet-page-done': !showPopUps }" @click.stop>
          <div class="form">
            <el-form
              ref="walletFormRef"
              :model="formData"
              status-icon
              :rules="walletRules"
              label-width="120px"
              class="demo-ruleForm"
              label-position="top"
            >
              <el-form-item :label="`${inOutStatus === 1 ? '转入' : '转出'}金额`" prop="birthday">
                <div class="wallet-amount-box">
                  {{ walletInfo.name }}钱包金额 <span>{{ priceToFixed(walletInfoStore.amount) }}</span>
                </div>
                <div class="per-slot">
                  <el-input
                    v-model.number="formData.amount"
                    @input="verifyAmount"
                    type="number"
                    placeholder="请输入金额"
                  />
                  <div class="all" @click="toAll">全部</div>
                </div>
              </el-form-item>
              <el-form-item>
                <div class="btn-box">
                  <el-button type="primary" @click="walletInOut(walletFormRef)">
                    <LoadingCard v-show="submitLoading" />
                    立即转账
                  </el-button>
                  <el-button link @click.stop="closePopUps">取消</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, reactive, ref, watch } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { priceToFixed } from '@/utils/numberFunction';
import CountTo from '@/components/VueCountTo/index.vue';
import defaultImageHook from '@/hooks/defaultImageHook';
import { useStore } from 'vuex';
import { mainToTripartiteWallet, tripartiteToMainWallet } from '@/api/wallet';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import LoadingCard from '@/components/LoadingCard/index.vue';
import { ElMessage } from 'element-plus';

const defaultWalletInfo = {
  amount: 0,
  walletMaintain: false,
  walletStatus: false
};

export default defineComponent({
  name: 'VenueWalletCard',
  props: {
    walletInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isInt: {
      type: Boolean,
      default: false
    }
  },
  components: { SvgIcon, CountTo, LoadingCard },
  setup(props) {
    const { defaultTeamLogo } = defaultImageHook();

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const popMaintenance = require('@/assets/image/wallet/pop_maintenance.png');

    const walletFormRef = ref(null);

    const { showPopUps, onShowPopUps, closePopUps } = popUpsMittBusHook(`closeGameWallet${props.walletInfo.gameId}`);

    const walletLoading = ref(false);

    const store = useStore();

    const centerAmount = computed(() => {
      return store.getters.getCenterAmount;
    });

    const walletInfoStore = computed(() => {
      const temp = store.getters.getWalletList.filter((wallet: any) => {
        return +wallet.gameId === +props.walletInfo.gameId;
      });
      return temp.length ? temp[0] : Object.assign(defaultWalletInfo, { gameId: +props.walletInfo.gameId });
    });

    const startVal = ref(0);

    watch(
      () => walletInfoStore.value.amount,
      (_, oldVal) => {
        startVal.value = Number(oldVal) ? Number(oldVal) : 0;
      },
      { deep: true }
    );

    const formData: any = reactive({
      game_id: +walletInfoStore.value.gameId,
      amount: null
    });

    // 转入1 转出2
    const inOutStatus = ref(1);

    function walletIn() {
      return new Promise((resolve) => {
        mainToTripartiteWallet(formData)
          .then((res: any) => {
            if (+res.code === 1) {
              resolve(true);
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
            resolve(false);
          });
      });
    }

    function walletOut() {
      return new Promise((resolve) => {
        tripartiteToMainWallet(formData)
          .then((res: any) => {
            if (+res.code === 1) {
              resolve(true);
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
            resolve(false);
          });
      });
    }

    const submitLoading = ref(false);

    const { proxy }: any = getCurrentInstance();

    async function walletInOut(formEl: any) {
      if (!formEl || submitLoading.value) return;
      formEl.validate(async (valid: any) => {
        if (valid) {
          submitLoading.value = true;
          let result: any = false;
          switch (inOutStatus.value) {
            case 1:
              result = await walletIn();
              break;
            case 2:
              result = await walletOut();
              break;
          }
          submitLoading.value = false;
          if (!result) return;
          closePopUps();
          proxy.mittBus.emit('changeToast', {
            header: 'pop_notice',
            text: '转账成功'
          });
          store.dispatch('wallet/toGetTripartiteBalance', { game_id: +walletInfoStore.value.gameId }).finally(() => {
            // submitLoading.value = false;
          });
          store.dispatch('wallet/getCenterAmount').then(() => {});
        } else {
          return false;
        }
      });
    }

    function onShowPopUpsHandle(status: number) {
      Object.assign(formData, { amount: null });
      inOutStatus.value = status;
      onShowPopUps();
    }

    const walletRules = reactive({});

    function toAll() {
      switch (inOutStatus.value) {
        case 1:
          formData.amount = centerAmount.value;
          break;
        case 2:
          formData.amount = walletInfoStore.value.amount;
          break;
      }
    }

    function verifyAmount() {
      if (formData.amount < 0) {
        formData.amount = 0;
      }
      switch (inOutStatus.value) {
        case 1:
          if (formData.amount > centerAmount.value) {
            formData.amount = Number(priceToFixed(centerAmount.value));
          }
          break;
        case 2:
          if (formData.amount > walletInfoStore.value.amount) {
            formData.amount = Number(priceToFixed(walletInfoStore.value.amount));
          }
          break;
      }
      if (formData.amount) {
        formData.amount = props.isInt
          ? Number.parseInt(String(priceToFixed(formData.amount)))
          : Number(priceToFixed(formData.amount));
      }
    }

    onMounted(() => {
      walletLoading.value = true;

      store.dispatch('wallet/toGetTripartiteBalance', { game_id: +walletInfoStore.value.gameId }).finally(() => {
        walletLoading.value = false;
      });
    });

    return {
      defaultTeamLogo,
      priceToFixed,
      startVal,
      walletInfoStore,
      walletLoading,
      walletInOut,
      showPopUps,
      onShowPopUps,
      closePopUps,
      centerAmount,
      formData,
      onShowPopUpsHandle,
      walletRules,
      walletFormRef,
      submitLoading,
      inOutStatus,
      toAll,
      verifyAmount,
      popMaintenance
    };
  }
});
</script>

<!--suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.VenueWalletCard {
  height: 208px;
  width: 508px;
  margin-bottom: 24px;
  background: #17191e;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  .wallet-name {
    margin: 26px 0 26px 48px;
    font-family: PingFangSC-Regular, cursive;
    font-size: 18px;
    color: #ffffff;
    font-weight: 400;
    display: flex;
    align-items: center;
  }
  .wallet-number {
    margin-left: 96px;
    font-family: DIN-Medium, cursive;
    font-size: 28px;
    color: #ffffff;
    font-weight: 600;
  }
  .icon-back {
    position: absolute;
    right: 60px;
    bottom: 62px;
    height: 120px;
    width: 120px;
  }
  .in-out {
    background: #33363f;
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    .box {
      flex-grow: 1;
      height: 62px;
      line-height: 62px;
      text-align: center;
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #ffffff;
      font-weight: 500;
      cursor: pointer;
    }
    .cut {
      height: 18px;
      width: 1.5px;
      border-radius: 1px;
      background-color: #ffffff30;
    }
  }
}
.wallet-loading {
  &:after {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    background: #ffffff10;
    top: 0;
    left: 0;
    line-height: 208px;
    color: #ffffff;
    font-size: 18px;
    text-align: center;
  }
}
.wallet-maintain {
  position: absolute;
  font-family: PingFangSC-Regular, cursive;
  background-color: #ffffff20;
  backdrop-filter: blur(5px);
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  font-size: 24px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .maintain-image {
    height: 74px;
    width: 74px;
    margin-bottom: 20px;
  }
}
.form {
  margin: 58px;
  :deep(.el-form-item__label) {
    font-family: PingFangSC-Medium;
    height: 40px;
    font-size: 20px;
    color: #ffffff;
    text-align: center;
    font-weight: 600;
  }
  :deep(.el-input__wrapper) {
    background-color: transparent;
    box-shadow: 0 1px 0 rgba(83, 88, 101, 1);
    border-radius: 0;
  }
  :deep(.el-form-item.is-error .el-input__wrapper) {
    box-shadow: 0 1px 0 #f56c6c;
    border-radius: 0;
  }
  :deep(.el-input__inner) {
    color: #fff;
  }
  :deep(.el-button--primary) {
    width: 100%;
    height: 54px;
    margin-top: 20px;
    background: #ee9e01;
    border-color: #ee9e01;
    border-radius: 8px;
    font-size: 16px;
    color: #fff;
  }
  ::placeholder {
    font-size: 14px;
    color: #535865;
    letter-spacing: 0;
    font-weight: 400;
  }
  .per-slot {
    position: relative;
    width: 100%;
    .all {
      height: 32px;
      padding: 0 10px;
      position: absolute;
      background: var(--component-pop-ups-bg);
      right: 0;
      top: 0;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: var(--aux-color);
      font-weight: 600;
      cursor: pointer;
    }
  }
  .btn-box {
    width: 100%;
    display: flex;
    justify-content: space-around;
    font-family: PingFangSC-Regular, cursive;
    :deep(.el-button--primary) {
      width: 155px;
      height: 38px;
      margin-top: 20px;
      background: var(--aux-color);
      border-color: var(--aux-color);
      border-radius: 4px;
      font-size: 16px;
      color: #fff;
    }
    :deep(.is-link) {
      width: 155px;
      height: 38px;
      margin-top: 20px;
      border-radius: 4px;
      font-size: 16px;
      color: #fff;
    }
  }
}
</style>
