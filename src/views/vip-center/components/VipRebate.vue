<template>
  <div class="vip-rebate">
    <el-table :data="list" style="width: 100%" border cell-class-name="vip-cell">
      <el-table-column prop="level_name" label="等级" align="center" />
      <el-table-column prop="ia_rebate" label="小艾竞技" align="center">
        <template #default="scope"> {{ priceToFixed(scope.row['ia_rebate']) }}% </template>
      </el-table-column>
      <el-table-column prop="xj_rebate" label="小艾体育" align="center">
        <template #default="scope"> {{ priceToFixed(scope.row['xj_rebate']) }}% </template>
      </el-table-column>
      <el-table-column prop="pb_rebate" label="平博体育" align="center">
        <template #default="scope"> {{ priceToFixed(scope.row['pb_rebate']) }}% </template>
      </el-table-column>
      <el-table-column prop="sb_rebate" label="沙巴体育" align="center">
        <template #default="scope"> {{ priceToFixed(scope.row['sb_rebate']) }}% </template>
      </el-table-column>
      <el-table-column prop="ag_rebate" label="AG真人" align="center">
        <template #default="scope"> {{ priceToFixed(scope.row['ag_rebate']) }}% </template>
      </el-table-column>
    </el-table>
    <div class="vip-rules">
      <div>规则说明</div>
      <span> 1.电竞、体育返水将于每日凌晨2:00系统自动派发，领取返水奖金需完成一倍有效流水。 </span>
      <span>
        2.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
      </span>
      <span>
        3.每位有效会员、手机号码、电子邮箱、银行卡、IP地址、每台设备仅限一个账户享受此活动，对违规的会员，平台保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
      </span>
      <span> 4.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。 </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { rebateVip } from '@/api/vip-center';
import { priceToFixed } from '@/utils/numberFunction';

export default defineComponent({
  name: 'VipRebate',
  props: {},
  components: {},
  setup() {
    const list = ref([]);

    async function getList() {
      const data: any = await rebateVip();
      if (Number(data.code) === 1) {
        list.value = data.data;
      }
    }

    onMounted(() => {
      getList();
    });

    return { list, priceToFixed };
  }
});
</script>

<style lang="scss" scoped>
.vip-rebate {
}
</style>
