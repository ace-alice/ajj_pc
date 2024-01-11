<template>
  <div class="TradeRecord">
    <div class="filter-box">
      <div class="has-date">
        <el-date-picker
          v-model="form['timeArr']"
          type="daterange"
          range-separator="—"
          format="YYYY.MM.DD"
          start-placeholder="选择日期"
          end-placeholder="选择日期"
          value-format="YYYY-MM-DD"
          :editable="false"
          :disabled-date="validTime"
          :clearable="false"
          @change="setTime"
        >
        </el-date-picker>
        <div class="reset-btn" @click.stop="resetTime">
          <svg-icon name="function_date" size="1.8"></svg-icon>
        </div>
      </div>
      <div>
        <div class="filter-bar" @click="showFilterCardHandle">
          筛选
          <div class="filter-card" v-show="showFilterCard">
            <div class="filter-card-title">筛选类型</div>
            <el-radio-group v-model="filterStatus" class="filter-card-radio-group">
              <el-radio :key="0" :label="null">全部</el-radio>
              <el-radio v-for="status in tradeTypeList" :key="status['id']" :label="status['id']">{{
                status['title_cn']
              }}</el-radio>
            </el-radio-group>
            <div class="control-bar">
              <div @click.stop="onConfirm">确认</div>
              <div @click.stop="onReset">重置</div>
            </div>
          </div>
          <teleport to="#app">
            <div class="filter-card-pop" v-show="showFilterCard" @click="showFilterCard = false"></div>
          </teleport>
        </div>
        <div class="time-bar-box">
          <div
            :class="{ 'time-bar': true, 'active-bar': +time.id === timeType }"
            v-for="time in timeBarList"
            :key="time.id"
            @click="setTimeBar(time)"
          >
            {{ time.label }}
          </div>
        </div>
      </div>
    </div>

    <el-table
      :data="dataList"
      style="width: 100%; min-height: 286px"
      cell-class-name="user-cell"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.1)"
    >
      <el-table-column prop="amount" label="交易金额" align="center">
        <template #default="scope">
          <span>{{ priceToFixed(scope.row['amount']) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_name"
        label="交易类型"
        align="center"
      />016639881805532uu6w3][[POIUUYTREWQQQQQQQQQQQQQLKJKJJGFFDSAMNBVCXZZ
      <el-table-column prop="create_time" label="交易时间" align="center" width="210">
        <template #default="scope">
          <span v-if="scope.row['create_time']">{{ parseTime(scope.row['create_time']) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="other_id" label="交易单号" align="center" width="350">
        <template #default="scope">
          <span v-if="scope.row['other_id']"
            >{{ scope.row['other_id'] }} <Copy :message="scope.row['other_id']"
          /></span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="余额" align="center">
        <template #default="scope">
          <span>{{ priceToFixed(scope.row['available_balance']) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="备注" align="center"> </el-table-column>
      <template #empty>
        <NoDataPage />
      </template>
    </el-table>

    <el-pagination
      v-model:currentPage="form.page"
      :page-size="form.limit"
      background
      layout="prev, pager, next"
      :total="form.total"
      @current-change="toGetList"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from 'vue';
import formDataHook from '@/hooks/FormDataHook';
import { getTradeRecordList, getTradeRecordType } from '@/api/user-center/in-out-record';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { parseTime } from '@/utils/timeFormat';
import { priceToFixed } from '@/utils/numberFunction';
import NoDataPage from '@/components/NoDataPage/index.vue';

export default defineComponent({
  name: 'TradeRecord',
  props: {
    active: {
      type: String,
      default: ''
    }
  },
  components: { SvgIcon, NoDataPage },
  setup(props) {
    const {
      form,
      dataList,
      toGetList,
      validTime,
      timeBarList,
      resetTime,
      setTime,
      timeType,
      setTimeBar,
      setForm,
      loading,
      resetForm
    } = formDataHook(getTradeRecordList, 10, false);

    watch(
      () => props.active,
      (newVal) => {
        if (newVal === 'trade-record') {
          resetForm();
        }
      }
    );

    const showFilterCard = ref(false);

    function showFilterCardHandle() {
      filterStatus.value = form.type;
      showFilterCard.value = true;
    }

    function onConfirm() {
      setForm({ type: filterStatus.value });
      showFilterCard.value = false;
      toGetList();
    }

    function onReset() {
      setForm({ type: null });
      showFilterCard.value = false;
      toGetList();
    }

    const tradeTypeList = ref([]);

    function getTradeRecordTypeFun() {
      getTradeRecordType().then((result: any) => {
        if (+result.code === 1) {
          tradeTypeList.value = result.data;
        }
      });
    }

    const filterStatus: Ref<any> = ref(null);

    onMounted(() => {
      getTradeRecordTypeFun();
    });

    return {
      dataList,
      form,
      validTime,
      setTime,
      resetTime,
      toGetList,
      parseTime,
      priceToFixed,
      timeBarList,
      timeType,
      setTimeBar,
      showFilterCard,
      filterStatus,
      showFilterCardHandle,
      onConfirm,
      onReset,
      loading,
      tradeTypeList
    };
  }
});
</script>

<style lang="scss" scoped>
.TradeRecord {
  width: 100%;
  margin: 24px auto 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
