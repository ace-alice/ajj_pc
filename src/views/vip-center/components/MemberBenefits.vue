<template>
  <div class="member-Benefits">
    <el-table :data="list" style="width: 100%" border cell-class-name="vip-cell">
      <el-table-column prop="level_name" label="等级" align="center"> </el-table-column>
      <el-table-column prop="upgrade" label="晋级礼金" align="center">
        <template #default="scope"> ¥{{ priceToFixed(scope.row['upgrade']) }} </template>
      </el-table-column>
      <el-table-column prop="birthday" label="生日礼金" align="center">
        <template #default="scope"> ¥{{ priceToFixed(scope.row['birthday']) }} </template>
      </el-table-column>
      <el-table-column prop="withdrawals_limit" label="单日提款额度" align="center">
        <template #default="scope"> ¥{{ toFixed2(scope.row['withdrawals_limit']) }} </template>
      </el-table-column>
      <el-table-column prop="withdrawals" label="单日提款次数" align="center">
        <template #default="scope"> {{ scope.row['withdrawals'] }}次 </template>
      </el-table-column>
    </el-table>
    <div class="vip-rules">
      <div>规则说明</div>
      <span> 1.晋升标准：会员充值且流水达到相应级别即可晋升相应VIP等级。 </span>
      <span> 2.晋升顺序：VIP等级不可越级晋升，每天仅限晋升一级。 </span>
      <span> 3.晋级奖金：会员晋级成功晋级奖金将需要在我的活动页面中领取，每个VIP等级的晋级奖金仅限领取一次。 </span>
      <span>
        4.保级标准：会员在达到某VIP等级后，90天内投注需要完成保级要求。如果在此期间完成晋升，保级要求按照当前等级计算。
      </span>
      <span>
        5.降级标准：如果会员在90天内没有完成相应的保级流水，系统会自动降级1个等级，相应的返水及其它活动福利也会调整至降级后的等级。
      </span>
      <span> 6.月首充返现：会员在注册成功30天后，即可申请领取月首充活动。 </span>
      <span>
        7.生日奖金：会员在注册后90天内生日，今年将不能领取生日礼金，另注册时间大于90天的会员需在生日当天到我的活动页面领取，每年仅限领取一次。
      </span>
      <span> 8.奖金流水：晋级奖金、生日奖金领取后需要完成一倍有效流水后即可提款，此活动不可以与其它活动共享。 </span>
      <span>
        9.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
      </span>
      <span> 10.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。 </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { memberVip } from '@/api/vip-center';
import { priceToFixed, toFixed2 } from '@/utils/numberFunction';

export default defineComponent({
  name: 'MemberBenefits',
  props: {},
  components: {},
  setup() {
    const list = ref([]);

    async function getList() {
      const data: any = await memberVip();
      if (Number(data.code) === 1) {
        list.value = data.data;
      }
    }

    onMounted(() => {
      getList();
    });

    return { list, priceToFixed, toFixed2 };
  }
});
</script>

<style lang="scss" scoped>
.member-Benefits {
  //noinspection CssInvalidPseudoSelector
}
</style>
