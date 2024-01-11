<template>
  <div class="TransferPage">
    <el-scrollbar>
      <div class="transfer-box wallet">
        <div class="title">转账</div>
        <div class="transfer-switch">
          <span>进入场馆时自动带入余额</span>
          <el-switch
            v-model="autoTransfer"
            :loading="autoLoading"
            :before-change="beforeChangeAuto"
            style="--el-switch-on-color: #ee9e01; --el-switch-off-color: #262932"
            :disabled="autoLoading"
          />
        </div>
        <WalletForBricks />
        <div class="title-label-two">极速转账</div>
        <div class="transfer-convert">
          <div :class="{ bottom: mode }">
            <div>中心钱包</div>
            <div>{{ mode ? 'To' : 'From' }}</div>
            <div>
              <CountTo
                :startVal="Number(centerAmountStartVal)"
                :endVal="Number(priceToFixed(centerAmount)) || 0"
                :duration="1000"
              />
            </div>
          </div>
          <div :class="{ bottom: !mode }">
            <el-select
              ref="selectRef"
              v-model="formData.game_id"
              @visible-change="selectVisible"
              placeholder="请选择场馆"
              popper-class="venue-select"
            >
              <div class="box" @click.stop>
                <div class="select-title" @click.stop>
                  <div>选择场馆钱包</div>
                  <svg-icon
                    name="me_ wallet_refresh"
                    size="1.8"
                    :class="{ 'refresh-icon': true, loading: refreshWalletLoad }"
                    @click="toRefreshWalletList"
                  />
                </div>
                <el-radio-group v-model="radioGameId">
                  <el-option
                    v-for="wallet in gameList"
                    :key="wallet.gameId"
                    :label="wallet.name"
                    :value="wallet.gameId"
                  >
                    <div class="option-box" @click.stop>
                      <el-radio :label="Number(wallet.gameId)">{{ wallet.name }}</el-radio>
                    </div>
                  </el-option>
                </el-radio-group>
                <div class="select-footer" @click.stop>
                  <div @click="selectDefine">确认</div>
                  <div @click="selectCancel">取消</div>
                </div>
              </div>
            </el-select>
            <div>{{ mode ? 'From' : 'To' }}</div>
            <div>
              <CountTo
                :startVal="Number(currentVenueStartVal)"
                :endVal="Number(priceToFixed(currentVenueAmount)) || 0"
                :duration="1000"
              />
            </div>
          </div>
          <div class="change-mode" @click="changeMode">
            <svg-icon name="me_ wallet_cycle" size="1.2" />
          </div>
        </div>
        <div class="title-label">转账金额</div>
        <div class="per-slot">
          <el-input @input="verifyAmount" v-model.number="formData.amount" type="number" placeholder="请输入转账金额" />
          <div class="all" @click="toAll">全部</div>
        </div>
        <div :class="{ submit: true, active: formData.amount > 1 }" @click="submit">
          <LoadingCard v-show="submitLoading" />
          立即转账
        </div>
        <div class="help">遇到问题？ <span class="service" @click="service.open">在线客服</span></div>
      </div>
    </el-scrollbar>
    <svg-icon name="last_more" size="1.5" class="close-icon" @click.stop="closePage" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import WalletForBricks from '@/views/wallet-manage/components/WithdrawPopUps/components/WalletForBricks.vue';
import CountTo from '@/components/VueCountTo/index.vue';
import { priceToFixed } from '@/utils/numberFunction';
import { useStore } from 'vuex';
import openCustomerService from '@/hooks/OpenCustomerService';
import { mainToTripartiteWallet, setQuicklyTransfer, tripartiteToMainWallet } from '@/api/wallet';
import LoadingCard from '@/components/LoadingCard/index.vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'TransferPage',
  emits: ['close'],
  props: {},
  components: { SvgIcon, WalletForBricks, CountTo, LoadingCard },
  setup(props, { emit }) {
    function closePage() {
      emit('close');
    }

    const mode = ref(false);

    function changeMode() {
      mode.value = !mode.value;
      formData.amount = null;
    }

    const store = useStore();

    const autoTransfer = ref(false);

    const userInfo = computed(() => {
      return store.getters.getUserInfo || {};
    });

    watch(
      () => userInfo.value,
      (newVal) => {
        autoTransfer.value = Boolean(+newVal.is_on || false);
      },
      { deep: true }
    );

    const walletList = computed(() => {
      return store.getters.getWalletList;
    });

    const gameList = computed(() => {
      return store.getters.getGameList;
    });

    const formData: any = reactive({
      game_id: 1,
      amount: null
    });

    const currentVenueAmount = computed(() => {
      let amount = 0;
      walletList.value.forEach((wallet: any) => {
        if (+wallet.gameId === +formData.game_id) {
          amount = +wallet.amount;
        }
      });
      return amount;
    });

    const currentVenueStartVal = ref(0);

    watch(
      () => currentVenueAmount.value,
      (_, oldVal) => {
        formData.amount = null;
        currentVenueStartVal.value = oldVal;
      }
    );

    const centerAmount = computed(() => {
      return +store.getters.getCenterAmount;
    });

    const centerAmountStartVal = ref(0);

    watch(
      () => centerAmount.value,
      (_, oldVal) => {
        formData.amount = null;
        centerAmountStartVal.value = oldVal;
      }
    );

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

    async function submit() {
      if (!formData.amount || submitLoading.value) return;
      let result: any = false;
      submitLoading.value = true;
      switch (mode.value) {
        case false:
          result = await walletIn();
          break;
        case true:
          result = await walletOut();
          break;
      }
      submitLoading.value = false;
      if (!result) return;
      store.dispatch('wallet/toGetTripartiteBalance', { game_id: formData.game_id }).finally(() => {});
      store.dispatch('wallet/getCenterAmount').then(() => {});
    }

    const service = openCustomerService();

    function verifyAmount() {
      if (formData.amount < 0) {
        formData.amount = 0;
      }
      switch (mode.value) {
        case false:
          if (formData.amount > centerAmount.value) {
            formData.amount = Number(priceToFixed(centerAmount.value));
          }
          break;
        case true:
          if (formData.amount > currentVenueAmount.value) {
            formData.amount = Number(priceToFixed(currentVenueAmount.value));
          }
          break;
      }
      if (formData.amount) {
        formData.amount = Number(priceToFixed(formData.amount));
      }
    }

    function toAll() {
      if (mode.value) {
        formData.amount = currentVenueAmount.value;
      } else {
        formData.amount = centerAmount.value;
      }
    }

    const refreshWalletLoad = ref(false);

    function toRefreshWalletList() {
      if (refreshWalletLoad.value) return;
      refreshWalletLoad.value = true;
      setTimeout(() => {
        refreshWalletLoad.value = false;
      }, 1000);
    }

    const selectRef: any = ref(null);

    const radioGameId = ref(1);

    function selectVisible(bool: boolean) {
      if (bool) {
        radioGameId.value = formData.game_id;
      }
    }

    function selectDefine() {
      formData.game_id = radioGameId.value;
      if (selectRef.value) {
        selectRef.value.blur();
      }
    }

    function selectCancel() {
      if (selectRef.value) {
        selectRef.value.blur();
      }
    }

    const autoLoading = ref(false);

    function beforeChangeAuto() {
      return new Promise((resolve, reject) => {
        autoLoading.value = true;
        setQuicklyTransfer({ is_on: Number(!autoTransfer.value) })
          .then((res: any) => {
            if (+res.code === 1) {
              resolve(true);
              ElMessage({
                message: '设置成功',
                duration: 2 * 1000,
                customClass: 'copy-message',
                grouping: true
              });
              setTimeout(() => {
                store.dispatch('user/getUserInfo').then(() => {
                  autoLoading.value = false;
                });
              }, 500);
            } else {
              ElMessage({
                message: res.msg || res.message,
                duration: 2 * 1000,
                customClass: 'copy-message',
                grouping: true
              });
              autoLoading.value = false;
              reject(false);
            }
          })
          .catch((err: any) => {
            ElMessage({
              message: err.msg || err.message,
              duration: 2 * 1000,
              customClass: 'copy-message',
              grouping: true
            });
            autoLoading.value = false;
            reject(false);
          });
      });
    }

    onMounted(() => {
      nextTick(() => {
        autoTransfer.value = Boolean(+userInfo.value.is_on || false);
      });
    });

    return {
      selectDefine,
      selectCancel,
      closePage,
      formData,
      submit,
      mode,
      changeMode,
      currentVenueStartVal,
      priceToFixed,
      walletList,
      currentVenueAmount,
      centerAmount,
      centerAmountStartVal,
      gameList,
      service,
      toAll,
      verifyAmount,
      submitLoading,
      toRefreshWalletList,
      refreshWalletLoad,
      selectRef,
      radioGameId,
      selectVisible,
      autoTransfer,
      beforeChangeAuto,
      autoLoading
    };
  }
});
</script>

<style lang="scss" scoped>
.TransferPage {
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
}
</style>
