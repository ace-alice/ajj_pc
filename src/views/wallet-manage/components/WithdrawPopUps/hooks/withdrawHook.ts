import { computed, getCurrentInstance, onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { dictionary } from '@/api/global';
import { priceToFixed } from '@/utils/numberFunction';
import { doWithdraw, todayWithdrawTime } from '@/api/wallet/in-out-money';
import { ElMessage } from 'element-plus';

const defaultForm = {
  password: null,
  money: null,
  captcha_code: null,
  terminal: 1,
  domain: window.location.href
};

const defaultFormRules = { bank_id: '', password: '', money: '', captcha_code: '' };

export default function withdrawHook(currency: 1 | 2) {
  const store = useStore();

  const currentCardId = ref(0);

  const list = computed(() => {
    const list = currency === 1 ? store.getters.getBankList : store.getters.getUsdtList;
    const temp = list.filter((bank: any) => {
      return (currency === 1 && +bank.bank_default === 1) || (currency === 2 && +bank.protocol_default === 1);
    });
    if (temp.length > 0) {
      currentCardId.value = temp[0].id;
    }
    return list;
  });

  const defaultCard = computed(() => {
    const temp = list.value.filter((bank: any) => {
      return +bank.id === +currentCardId.value;
    });
    if (temp.length > 0) {
      return temp[0];
    } else {
      return {};
    }
  });

  watch(
    () => defaultCard.value,
    (newValue) => {
      formData.bank_id = newValue.id || null;
    },
    { deep: true }
  );

  const hasPassword = computed(() => {
    return +store.getters.getUserInfo?.funds_password !== 0;
  });

  const formData: any = reactive(
    Object.assign({}, defaultForm, {
      currency: currency,
      bank_id: defaultCard.value?.id || null
    })
  );

  const formRules: any = reactive(Object.assign({}, defaultFormRules));

  const userInfo = computed(() => {
    return store.getters.getUserInfo;
  });

  const phone = computed(() => {
    const phone = userInfo.value?.phone || '';
    return phone.length > 4 ? phone.substring(phone.length - 4, phone.length) : '';
  });

  const countdown = computed(() => {
    return store.getters.countdown;
  });

  const flowingWater = computed(() => {
    return store.getters.flowingWater || 0;
  });

  const centerAmount = computed(() => {
    return store.getters.getCenterAmount;
  });

  function sendCode() {
    store.dispatch('captchaCode/sentCode').then(() => {});
  }

  function toAll() {
    formData.money = centerAmount.value;
  }

  const submitLoad = ref(false);

  const { proxy }: any = getCurrentInstance();

  function submit() {
    verifyMethod(true, '');
    if (!isApproved.value || submitLoad.value) return;
    submitLoad.value = true;
    doWithdraw(formData)
      .then((res: any) => {
        if (+res.code === 1) {
          store.dispatch('wallet/getCenterAmount').then(() => {});
          Object.assign(formData, defaultForm);
          Object.assign(formRules, defaultFormRules);
          proxy.mittBus.emit('closeWithdrawPopUps');
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
        store.commit('captchaCode/INIT');
      });
  }

  const minAmount = ref(0);
  const maxAmount = ref(0);
  const exchangeRate = ref(0);
  const frequency = ref(0);
  const availableQuota = ref(0);

  const availableMessage = computed(() => {
    return `今日可用取款次数${frequency.value}次，今日可用取款额度${priceToFixed(availableQuota.value)}`;
  });

  const placeholder = computed(() => {
    return `单笔金额${minAmount.value}元至${maxAmount.value}元`;
  });

  /**
   * 获取提现信息
   */
  const getTodayWithdrawTime = async () => {
    const data: any = await todayWithdrawTime();
    if (Number(data.code) === 1) {
      // console.log(data.data)
      frequency.value = data.data.withdrawals;
      availableQuota.value = data.data.withdrawals_limit;
    }
  };

  const usdtMessage = computed(() => {
    if (currency === 1) return '';
    return `参考汇率1USDT≈${exchangeRate.value}CNY，预计支付≈${
      formData.money && exchangeRate.value ? priceToFixed(formData.money / exchangeRate.value) : 0
    }USDT汇率仅供参考，存款时以实时汇率为准。`;
  });

  /**
   * 获取限额
   */
  const getDictionary = async () => {
    const data: any = await dictionary({ primary_key: 'withdraw_limit' });
    if (Number(data.code) === 1) {
      minAmount.value = +data.data.data.minimum_limit;
      maxAmount.value = +data.data.data.maximum_limit;
    }
    if (currency === 1) return;
    const uData: any = await dictionary({ primary_key: 'exchange_rate' });
    if (Number(uData.code) === 1) {
      exchangeRate.value = +uData.data.data.usdt;
    }
  };

  const isApproved = ref(false);

  function verifyMethod(isSubmit: boolean, arg: string) {
    let tempApprove = true;
    for (const key of Object.keys(formRules)) {
      switch (key) {
        case 'money':
          if (!formData['money']) {
            if (isSubmit || key === arg) {
              formRules['money'] = '请输入出款金额';
            }
            tempApprove = false;
          } else {
            if (frequency.value < 1) {
              formRules['money'] = '今日已无取款次数';
            } else if (formData['money'] > availableQuota.value) {
              formData['money'] = +priceToFixed(availableQuota.value);
            } else if (isSubmit && minAmount.value > formData['money']) {
              formData['money'] = +priceToFixed(minAmount.value);
            } else if (formData['money'] > maxAmount.value) {
              formData['money'] = +priceToFixed(maxAmount.value);
            } else {
              formData['money'] = +priceToFixed(formData['money']);
            }
            formRules['money'] = null;
          }
          break;
        case 'password':
          if (!formData['password']) {
            if (isSubmit || key === arg) {
              formRules['password'] = '请输入交易密码';
            }
            tempApprove = false;
          } else {
            if (!/^[a-zA-Z]\w{5,19}$/.test(formData['password'])) {
              formRules['password'] = '交易密码请输入6-20位数字和字母';
              tempApprove = false;
            } else {
              formRules['password'] = null;
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
              formRules['bank_id'] = '请添加出款账户';
            }
            tempApprove = false;
          } else {
            if (currency === 1 && +defaultCard.value?.bank_status === 2) {
              formRules['bank_id'] = '当前出款账户已维护请选择其他出款账户';
            } else {
              formRules['bank_id'] = null;
            }
          }
          break;
      }
    }
    isApproved.value = tempApprove;
  }

  const showChange = ref(false);

  onMounted(() => {
    getDictionary().then(() => {});
    getTodayWithdrawTime().then(() => {});
    store.dispatch('user/getFlowingWater').then(() => {});
  });

  return {
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
  };
}
