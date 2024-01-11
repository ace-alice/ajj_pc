<template>
  <div class="first-back">
    <el-table :data="list" style="width: 100%" border cell-class-name="vip-cell">
      <el-table-column prop="level_name" label="等级" align="center" />
      <el-table-column prop="min_recharge" label="月首充条件" align="center">
        <template #default="scope"> ≥¥{{ priceToFixed(scope.row['min_recharge']) }} </template>
      </el-table-column>
      <el-table-column prop="inverse_ratio" label="返现比例" align="center">
        <template #default="scope"> {{ priceToFixed(scope.row['inverse_ratio']) }}% </template>
      </el-table-column>
      <el-table-column prop="bonus_cap" label="奖金上限" align="center">
        <template #default="scope"> ¥{{ priceToFixed(scope.row['bonus_cap']) }} </template>
      </el-table-column>
      <el-table-column prop="multiple" label="流水倍数" align="center">
        <template #default="scope"> {{ scope.row['multiple'] }}倍 </template>
      </el-table-column>
    </el-table>
    <div class="vip-rules">
      <div>规则说明</div>
      <span> 1.会员每月首充金额≥500元即可在VIP页面申请此活动，充值后如有提款操作则本月无法申请此活动。 </span>
      <span>
        2.充值成功后请在VIP页面领取奖金，会员需完成对应有效流水即可提款，此活动不可与其它活动共享。
        例：本金1000元，奖金150元 （1000+150）*12=13800元
      </span>
      <span> 3.会员在注册成功30天后，即可申请领取月首充活动。 </span>
      <span> 4.VIP会员单笔存款要求以及对应活动奖金以会员申请后充值到账时间所对应的VIP等级为准。 </span>
      <span>
        5.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
      </span>
      <span>
        6.每位有效会员、手机号码、电子邮箱、银行卡、IP地址、每台设备只能享受一次活动，对违规的会员，平台保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
      </span>
      <span> 7.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。 </span>
    </div>
    <div
      v-show="isReceive"
      v-loading="receiveLoad"
      element-loading-background="#00000020"
      class="receive-btn"
      @click="toVipMonthFirstRechargeApply"
    >
      领取每月首充返现
    </div>
    <PriceToast
      :show="toastShow"
      :bonus-info="priceInfo"
      title="恭喜您获得首充返现"
      svg="pop_gift_general01"
      @success="toastShow = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { firstVip, isRechargeStatus, vipMonthFirstRechargeApply } from '@/api/vip-center';
import { priceToFixed } from '@/utils/numberFunction';
import PriceToast from '@/views/vip-center/components/PriceToast.vue';

export default defineComponent({
  name: 'FirstBack',
  props: {},
  components: { PriceToast },
  setup() {
    const list = ref([]);

    async function getList() {
      const data: any = await firstVip();
      if (Number(data.code) === 1) {
        list.value = data.data;
      }
    }

    const priceInfo: any = reactive({});

    const isReceive = ref(false);

    const toastShow = ref(false);

    async function getReceiveStatus() {
      const data: any = await isRechargeStatus();
      if (Number(data.code) === 1) {
        isReceive.value = Boolean(Number(data.data.status));
        Object.assign(priceInfo, data.data);
      }
    }

    const receiveLoad = ref(false);

    function toVipMonthFirstRechargeApply() {
      if (receiveLoad.value) return;
      receiveLoad.value = true;
      vipMonthFirstRechargeApply()
        .then((res: any) => {
          if (+res.code === 1) {
            isReceive.value = false;
            toastShow.value = true;
          }
        })
        .finally(() => {
          receiveLoad.value = false;
        });
    }

    onMounted(() => {
      getList();
      getReceiveStatus();
    });

    return { list, isReceive, receiveLoad, toVipMonthFirstRechargeApply, priceToFixed, toastShow, priceInfo };
  }
});
</script>

<style lang="scss" scoped>
.first-back {
}
</style>
