import { computed, onMounted, reactive, ref, watch } from 'vue';
import { parseTime } from '@/utils/timeFormat';
import { useStore } from 'vuex';

export default function formDataHook(
  getList: Function,
  limit: number,
  unLogin: boolean = true,
  exclude: string[] = []
) {
  const defaultForm = {
    page: 1,
    limit,
    total: 0,
    timeArr: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
    start_time: parseTime(new Date(), '{y}-{m}-{d}'),
    end_time: parseTime(new Date(), '{y}-{m}-{d}'),
    status: null,
    type: null,
    game_id: 1
  };

  const form: any = reactive(defaultForm);

  function resetForm() {
    Object.assign(form, defaultForm);
    toGetList();
  }

  const loading = ref(false);

  function filterForm() {
    const tempForm: any = {};
    for (const key of Object.keys(form)) {
      if (key === 'total') continue;
      if (key === 'timeArr') continue;
      if (exclude.includes(key)) continue;
      if (!form[key]) continue;
      if (form[key] instanceof Array && form[key].length === 0) continue;
      tempForm[key] = form[key];
    }
    return tempForm;
  }

  function setForm(query: any) {
    Object.assign(form, query);
  }

  const dataList = ref([]);

  function toGetList() {
    if (loading.value) return;
    loading.value = true;
    const query = filterForm();
    getList(query)
      .then((res: any) => {
        if (+res.code === 1) {
          dataList.value = res.data.data;
          form.total = res.data.total;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }

  watch(
    () => form.timeArr,
    (newVal) => {
      if (newVal.length === 2) {
        for (const time of timeBarList) {
          if (newVal[0] === getOffTime(time.timeArr[0]) && newVal[1] === getOffTime(time.timeArr[1])) {
            timeType.value = time.id;
          }
        }
      } else {
        timeType.value = 0;
      }
    }
  );

  function validTime(date: Date) {
    return date.getTime() > new Date().getTime();
  }

  const timeBarList = [
    { id: 1, label: '今天', timeArr: [0, 0] },
    { id: 3, label: '近7日', timeArr: [6, 0] },
    { id: 4, label: '近30日', timeArr: [29, 0] }
  ];

  /**
   * 游戏列表
   */
  const gameList = [
    {
      id: 1,
      label: '小艾电竞'
    },
    {
      id: 4,
      label: '小艾体育'
    },
    {
      id: 3,
      label: '平博体育'
    },
    {
      id: 2,
      label: '沙巴体育'
    },
    {
      id: 5,
      label: 'AG真人'
    }
  ];

  const statusList = [
    { id: null, label: '全部' },
    { id: 1, label: '成功' },
    { id: 2, label: '已取消' },
    { id: 3, label: '待处理' }
  ];

  function setTime() {
    if (form.timeArr.length > 1) {
      form.start_time = form.timeArr[0];
      form.end_time = form.timeArr[1];
    } else {
      form.start_time = null;
      form.end_time = null;
    }
    toGetList();
  }

  function resetTime() {
    setForm({
      start_time: null,
      end_time: null,
      timeArr: []
    });
    toGetList();
  }

  function setStatus(status: number) {
    switch (status) {
      case 1:
        return ['成功', '#0EA94A'];

      case 3:
        return ['已取消', '#DC5A06'];

      case 4:
        return ['待处理', '#999'];
      default:
        return ['未知', '#999'];
    }
  }

  const timeType = ref(1);

  function getOffTime(num: number) {
    const nowTime = new Date().getTime();
    const offTime = 1000 * 60 * 60 * 24 * num;
    return parseTime(nowTime - offTime, '{y}-{m}-{d}');
  }

  function setTimeBar(time: any) {
    timeType.value = time.id;
    form.timeArr = [getOffTime(time.timeArr[0]), getOffTime(time.timeArr[1])];
    setTime();
  }

  const store = useStore();

  const isLogin = computed(() => {
    return Boolean(store.getters.getToken) || false;
  });

  watch(
    () => isLogin.value,
    (newVal) => {
      if (newVal) toGetList();
    }
  );

  onMounted(() => {
    if (!unLogin && !isLogin.value) return;
    toGetList();
  });

  return {
    form,
    dataList,
    toGetList,
    setForm,
    validTime,
    timeBarList,
    resetTime,
    setTime,
    timeType,
    getOffTime,
    setStatus,
    setTimeBar,
    statusList,
    loading,
    resetForm,
    gameList,
    isLogin
  };
}
