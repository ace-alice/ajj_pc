import { computed, onMounted, reactive, Ref, ref } from 'vue';
import { priceToFixed } from '@/utils/numberFunction';
import { dictionary } from '@/api/global';
import { depositType, doDeposit } from '@/api/wallet/in-out-money';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

const defaultForm = {
  account_name: '',
  amount: null,
  channel_id: null,
  terminal: 1
};

const defaultRules = {
  account_name: null,
  amount: null,
  channel_id: null
};

export default function depositHook() {
  const store = useStore();

  const walletList: Ref<any[]> = ref([]);

  const currentHeadChannelId: Ref = ref(null);

  const currentChannel = computed(() => {
    const temp: any = walletList.value.filter((headChannel: any) => {
      return +headChannel.id === +currentHeadChannelId.value;
    });

    if (temp.length > 0) {
      formData.channel_id = temp[0]['channel'][0]?.id;
      return temp[0]['channel'];
    } else {
      formData.channel_id = null;
      return [];
    }
  });

  function getWalletList() {
    depositType({ terminal: 1 }).then((res: any) => {
      if (+res.code === 1) {
        walletList.value = res.data;
        if (walletList.value.length > 0) {
          currentHeadChannelId.value = walletList.value[0].id;
        }
      }
    });
  }

  const usdtExchangeRate = ref(0);

  function getUsdtExchangeRate() {
    dictionary({ primary_key: 'exchange_rate' }).then((res: any) => {
      if (+res.code === 1) {
        usdtExchangeRate.value = res.data.data.usdt;
      }
    });
  }

  const formData: any = reactive(Object.assign({}, defaultForm));

  const limitPrice = computed(() => {
    const temp = currentChannel.value.filter((channel: any) => {
      return +channel.id === +formData.channel_id;
    });
    if (temp.length) {
      return {
        walletMinPrice: temp[0].terminal_pc_min_quota || 0,
        walletMaxPrice: temp[0].terminal_pc_max_quota || 0
      };
    } else {
      return {
        walletMinPrice: 0,
        walletMaxPrice: 0
      };
    }
  });

  const isBlockchain = computed(() => {
    if (currentChannel.value.length && formData.channel_id) {
      const temp: any = currentChannel.value.filter((channel: any) => {
        return +channel.id === +formData.channel_id;
      });
      if (temp.length) {
        return Number(temp[0].is_blockchain) || 1;
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  });

  const activityMessage = computed(() => {
    if (currentChannel.value.length && formData.channel_id) {
      const temp: any = currentChannel.value.filter((channel: any) => {
        return +channel.id === +formData.channel_id;
      });
      if (temp.length && temp[0].day_max_amount) {
        return `每日最高可享优惠：${temp[0].day_max_amount}元`;
      } else {
        return '';
      }
    } else {
      return '';
    }
  });

  const showNumber = computed(() => {
    if (!Number(formData.amount)) return 0;
    if (usdtExchangeRate.value && isBlockchain.value === 2) {
      return priceToFixed(Number(formData.amount) / usdtExchangeRate.value);
    } else {
      return priceToFixed(Number(formData.amount));
    }
  });

  const walletPriceList = computed(() => {
    const totalPriceList: any = [];
    if (!limitPrice.value.walletMinPrice || !limitPrice.value.walletMaxPrice) return totalPriceList;
    const num0 = Math.min(
      Math.floor(Math.max(100, +limitPrice.value.walletMinPrice)),
      Math.floor(Math.min(50000, +limitPrice.value.walletMaxPrice))
    );
    let num1: number;
    let num2: number;
    let num3: number;
    let num4: number;
    const num5 = Math.floor(Math.min(50000, +limitPrice.value.walletMaxPrice));
    const numx = num5 - num0;
    if (numx > 0) {
      const numy = numx / 5;
      let numb = 10;
      if (numy >= 10000) {
        numb = 100000;
      }
      if (numy >= 1000) {
        numb = 10000;
      }
      if (numy >= 100) {
        numb = 1000;
      }
      num1 = Math.floor(Math.round(((numy + num0) / numb) * numb));
      num2 = Math.floor(Math.round(((numy * 2 + num0) / numb) * numb));
      num3 = Math.floor(Math.round(((numy * 3 + num0) / numb) * numb));
      num4 = Math.floor(Math.round(((numy * 4 + num0) / numb) * numb));
    } else {
      num1 = num2 = num3 = num4 = num0;
    }
    totalPriceList.push(num0, num1, num2, num3, num4, num5);
    return totalPriceList;
  });

  const messageLabel = computed(() => {
    if (isBlockchain.value === 2) {
      return `参考汇率1USDT≈${usdtExchangeRate.value}CNY，预计支付≈${showNumber.value}USDT汇率仅供参考，存款时以实时汇率为准。`;
    } else {
      return '';
    }
  });

  const amountPlaceholder = computed(() => {
    return `单笔金额${limitPrice.value.walletMinPrice}元至${limitPrice.value.walletMaxPrice}元`;
  });

  const formRules: any = reactive(Object.assign({}, defaultRules));

  const isApproved = ref(false);

  function verifyMethod(isSubmit: boolean, arg: string) {
    let tempApprove = true;
    for (const key of Object.keys(formRules)) {
      switch (key) {
        case 'account_name':
          if (!formData['account_name'] && +isBlockchain.value === 1) {
            if (isSubmit || key === arg) {
              formRules['account_name'] = '请输入存款人姓名';
            }
            tempApprove = false;
          } else {
            if (+isBlockchain.value !== 1) {
              formData['account_name'] = null;
            }
            formRules['account_name'] = null;
          }
          break;
        case 'amount':
          if (!formData['amount']) {
            if (isSubmit || key === arg) {
              formRules['amount'] = amountPlaceholder.value;
            }
            tempApprove = false;
          } else {
            if (+formData['amount'] < +limitPrice.value.walletMinPrice && isSubmit) {
              formData['amount'] = limitPrice.value.walletMinPrice;
            }
            if (+formData['amount'] > +limitPrice.value.walletMaxPrice) {
              formData['amount'] = limitPrice.value.walletMaxPrice;
            }
            formRules['amount'] = null;
          }
          break;
        case 'channel_id':
          if (!formData['channel_id']) {
            if (isSubmit || key === arg) {
              formRules['channel_id'] = '请选择存款线路';
            }
            tempApprove = false;
          } else {
            formRules['channel_id'] = null;
          }
          break;
      }
    }
    isApproved.value = tempApprove;
  }

  const submitLoad = ref(false);

  const detailInfo: Ref<any> = ref(null);

  function submit() {
    return new Promise((resolve) => {
      verifyMethod(true, '');
      if (!isApproved.value || submitLoad.value) return;
      submitLoad.value = true;
      doDeposit(formData)
        .then((res: any) => {
          if (+res.code === 1) {
            store.dispatch('wallet/getCenterAmount').then(() => {});
            detailInfo.value = res.data;
            Object.assign(formData, defaultForm);
            Object.assign(formRules, defaultRules);
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err: any) => {
          resolve(false);
          ElMessage({
            message: err.msg || err.message,
            customClass: 'copy-message',
            duration: 2 * 1000,
            grouping: true
          });
        })
        .finally(() => {
          submitLoad.value = false;
          isApproved.value = false;
        });
    });
  }

  onMounted(() => {
    getUsdtExchangeRate();
    getWalletList();
  });

  return {
    walletList,
    walletPriceList,
    formData,
    showNumber,
    currentHeadChannelId,
    currentChannel,
    limitPrice,
    submit,
    messageLabel,
    amountPlaceholder,
    formRules,
    verifyMethod,
    activityMessage,
    isBlockchain,
    detailInfo
  };
}
