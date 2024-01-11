<template>
  <div class="easter-gold">
    <el-table :data="list" style="width: 100%" border cell-class-name="vip-cell">
      <el-table-column prop="level_name" label="等级" align="center" />
      <el-table-column prop="burden" label="每月负盈利金额" align="center">
        <template #default="scope"> ≥¥{{ toFixed2(scope.row['burden']) }} </template>
      </el-table-column>
      <el-table-column prop="resurrection" label="复活金比例" align="center">
        <template #default="scope">{{ priceToFixed(scope.row['resurrection']) }}% </template>
      </el-table-column>
      <el-table-column prop="bonus_cap" label="奖金上限" align="center">
        <template #default="scope">{{ priceToFixed(scope.row['bonus_cap']) }} </template>
      </el-table-column>
    </el-table>
    <div class="vip-rules">
      <div>规则说明</div>
      <span> 1.月复活金每一个自然月为一个周期，如会员当月负盈利金额≥20万既可在VIP页面领取复活金。 </span>
      <span>
        2.复活金将于每月1号-5号派发，会员需在VIP页面领取，领取复活金需完成一倍有效流水，奖金派发时限内未领取则视为自动放弃。
      </span>
      <span>
        3.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
      </span>
      <span>
        4.每位有效会员、手机号码、电子邮箱、银行卡、IP地址、每台设备仅限一个账户享受此活动，对违规的会员，平台保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
      </span>
      <span> 5.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。 </span>
    </div>
    <div
      v-show="isReceive"
      v-loading="receiveLoad"
      element-loading-background="#00000020"
      class="receive-btn"
      @click="toApply"
    >
      领取复活金
    </div>
    <PriceToast
      :show="toastShow"
      :bonus-info="priceInfo"
      title="恭喜您获得月复活金"
      svg="pop_gift_general02"
      @success="toastShow = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { resurrectionVip, vipResurrectionApply, vipResurrectionStatus } from '@/api/vip-center';
import { priceToFixed, toFixed2 } from '@/utils/numberFunction';
import PriceToast from '@/views/vip-center/components/PriceToast.vue';

export default defineComponent({
  name: 'EasterGold',
  props: {},
  components: { PriceToast },
  setup() {
    const list = ref([]);

    async function getList() {
      const data: any = await resurrectionVip();
      if (Number(data.code) === 1) {
        list.value = data.data;
      }
    }

    const priceInfo: any = reactive({});

    const isReceive = ref(false);

    const toastShow = ref(false);

    async function getReceiveStatus() {
      const data: any = await vipResurrectionStatus();
      if (Number(data.code) === 1) {
        isReceive.value = data.data;
        Object.assign(priceInfo, data.data);
      }
    }

    const receiveLoad = ref(false);

    async function toApply() {
      if (receiveLoad.value) return;
      receiveLoad.value = true;
      vipResurrectionApply()
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

    return { list, isReceive, receiveLoad, toApply, priceToFixed, toFixed2, priceInfo, toastShow };
  }
});
</script>

<style lang="scss" scoped>
.easter-gold {
}
</style>
