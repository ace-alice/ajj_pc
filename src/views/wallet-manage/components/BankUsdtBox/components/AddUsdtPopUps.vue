<template>
  <div class="AddUsdtPopUps">
    <el-scrollbar>
      <div class="wallet add-bank-box">
        <div class="title">添加虚拟币账户</div>
        <div class="add-tag">是否还需要 <span @click="toAddUsdt">添加银行卡账户</span></div>
        <div class="title-label">虚拟币币种</div>
        <div class="no-click-input usdt-list">
          <el-radio-group v-model="formData.protocol_id" @change="protocolIdChange">
            <div v-for="info in usdtList" :key="info['protocol_id']">
              <el-radio :label="info['protocol_id']">{{ info['protocol'] }}</el-radio>
            </div>
          </el-radio-group>
        </div>
        <ErrBox :message="formRules.protocol_id" />
        <div class="title-label">虚拟币地址</div>
        <el-input
          @input="verifyMethod(false, 'protocol_address')"
          v-model.trim="formData.protocol_address"
          placeholder="请输入虚拟币地址"
        />
        <ErrBox :message="formRules.protocol_address" />
        <div class="title-label">手机号</div>
        <div class="no-click-input">
          <span class="no-data">{{ phoneHandling(formData.phone) }}</span>
        </div>
        <div class="title-label">验证码</div>
        <div class="per-slot">
          <el-input
            @input="verifyMethod(false, 'captcha_code')"
            v-model.number="formData.captcha_code"
            type="number"
            placeholder="请输入短信验证码"
          />
          <div class="all" @click="sendCode">{{ countdown !== 60 ? countdown : '获取验证码' }}</div>
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
import { computed, defineComponent, getCurrentInstance, onMounted, reactive, Ref, ref } from 'vue';
import { getLocal } from '@/utils/storage';
import { phoneHandling } from '@/utils/numberFunction';
import { useStore } from 'vuex';
import { addUsdtCard, getUsdtProtocolList } from '@/api/wallet/bank-usdt';
import LoadingCard from '@/components/LoadingCard/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { ElMessage } from 'element-plus';

const defaultForm = {
  protocol: null,
  protocol_address: null,
  protocol_id: null,
  protocol_img: null,
  captcha_code: null,
  phone: getLocal('userInfo').phone
};

const defaultRules = {
  protocol_address: null,
  protocol_id: null,
  captcha_code: null
};

export default defineComponent({
  name: 'AddUsdtPopUps',
  props: {},
  emits: ['close'],
  components: { SvgIcon, LoadingCard },
  setup(props, { emit }) {
    function closePage(init: boolean = false) {
      emit('close');
      if (init) {
        Object.assign(formRules, defaultRules);
        Object.assign(formData, defaultForm);
      }
    }

    const formData: any = reactive(Object.assign({}, defaultForm));

    const formRules: any = reactive(Object.assign({}, defaultRules));

    const { proxy }: any = getCurrentInstance();

    function toAddUsdt() {
      closePage();
      proxy.mittBus.emit('closeAddBankPopUps', true);
    }

    const store = useStore();

    const countdown = computed(() => {
      return store.getters.countdown;
    });

    function sendCode() {
      store.dispatch('captchaCode/sentCode');
    }

    const usdtList: Ref<any[]> = ref([]);

    function dealWithUsdtList(parentName: string, data: any[]) {
      let result: any[] = [];
      if (data.length > 0) {
        data.forEach((list: any) => {
          if (list.children.length === 0) {
            result.push({
              protocol_id: list.id,
              protocol: `${parentName}-${list.protocol}`,
              protocol_img: list.file_id
            });
          } else {
            result = [...result, ...dealWithUsdtList(list.protocol, list.children)];
          }
        });
      }

      return result;
    }

    function getUsdtListFun() {
      getUsdtProtocolList()
        .then((res: any) => {
          if (+res.code === 1) {
            usdtList.value = dealWithUsdtList('', res.data);
          }
        })
        .catch(() => {
          // Toast.fail(err.msg || err.message);
        });
    }

    function protocolIdChange(label: number | string) {
      const temp = usdtList.value.filter((usdt: any) => {
        return +usdt.protocol_id === +label;
      });
      if (temp.length > 0) {
        Object.assign(formData, temp[0]);
      } else {
        Object.assign(formData, {
          protocol: null,
          protocol_id: null,
          protocol_img: null
        });
      }
      verifyMethod(false, 'protocol_id');
    }

    const isApproved = ref(false);

    function verifyMethod(isSubmit: boolean, arg: string) {
      let tempApprove = true;
      for (const key of Object.keys(formRules)) {
        switch (key) {
          case 'protocol_address':
            if (!formData['protocol_address']) {
              if (isSubmit || key === arg) {
                formRules['protocol_address'] = '请输入虚拟币地址';
              }
              tempApprove = false;
            } else {
              if (String(formData['protocol_address']).length < 24) {
                formRules['protocol_address'] = '虚拟币地址最少24位';
                tempApprove = false;
              } else {
                formRules['protocol_address'] = null;
              }
            }
            break;
          case 'protocol_id':
            if (!formData['protocol_id']) {
              if (isSubmit || key === arg) {
                formRules['protocol_id'] = '请选择虚拟币';
              }
              tempApprove = false;
            } else {
              formRules['protocol_id'] = null;
            }
            break;
          case 'captcha_code':
            if (!formData['captcha_code'] || String(formData['captcha_code']).length != 6) {
              if (isSubmit || key === arg) {
                formRules['captcha_code'] = '请输入6位短信验证码';
              }
              tempApprove = false;
            } else {
              formRules['captcha_code'] = null;
            }
            break;
        }
      }
      isApproved.value = tempApprove;
    }

    const submitLoad = ref(false);

    function submit() {
      verifyMethod(true, '');
      if (!isApproved.value || submitLoad.value) return;
      submitLoad.value = true;
      addUsdtCard(formData)
        .then((res: any) => {
          if (+res.code === 1) {
            closePage(true);
            store.dispatch('bankAndUsdt/toGetUsdtList');
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

    onMounted(() => {
      getUsdtListFun();
    });

    return {
      closePage,
      formData,
      toAddUsdt,
      phoneHandling,
      submit,
      sendCode,
      countdown,
      formRules,
      usdtList,
      protocolIdChange,
      verifyMethod,
      isApproved,
      submitLoad
    };
  }
});
</script>

<style lang="scss" scoped>
.AddUsdtPopUps {
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
  .usdt-list {
    height: auto;
    //noinspection CssInvalidPseudoSelector
    :deep(.el-radio-group) {
      flex-direction: column;
      .el-radio {
        font-family: PingFangSC-Regular, cursive;
        margin-right: 0;
        margin-bottom: 16px;
        width: 33%;
        flex-shrink: 0;
        --el-radio-font-size: 14px;
        --el-radio-input-border-color-hover: var(--aux-color);
        --el-radio-input-bg-color: #00000000;
        --el-radio-input-height: 18px;
        --el-radio-input-width: 18px;
        --el-radio-text-color: #c2c7d2;
        .is-checked {
          .el-radio__inner {
            border-color: var(--aux-color);
            background: #363841;
          }
          .el-radio__inner::after {
            height: 10px;
            width: 10px;
            background-color: var(--aux-color);
          }
        }
        .el-radio__label {
          margin-left: 16px;
        }
        .el-radio__input.is-checked + .el-radio__label {
          color: #c2c7d2;
        }
      }
    }
  }
}
</style>
