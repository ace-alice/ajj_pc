<template>
  <div class="InRecord">
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
              <el-radio v-for="status in statusList" :key="status.id" :label="status.id">{{ status.label }}</el-radio>
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
      ref="tableRef"
      :data="dataList"
      style="width: 100%; min-height: 286px"
      cell-class-name="user-cell"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.1)"
      row-key="id"
      :expand-row-keys="expandRowKeys"
      @row-click="rowClick"
    >
      <el-table-column type="expand">
        <template #default="props">
          <div class="expand-box">
            <div class="expand-box-column">
              <div>
                <span v-if="priceToFixed(props.row['recharge_amount'])" :style="{ color: '#0EA94A' }"
                  >+{{ priceToFixed(props.row['recharge_amount']) }}</span
                >
                <span v-else>--</span>
              </div>
              <div>
                交易状态:
                <span :style="{ color: setStatus(Number(props.row['order_status_client']))[1] }">{{
                  setStatus(Number(props.row['order_status_client']))[0]
                }}</span>
              </div>
              <div>
                交易时间:
                <span v-if="props.row['create_time']">{{ parseTime(props.row['create_time']) }}</span>
                <span v-else>--</span>
              </div>
              <div>
                交易方式:
                <span v-if="props.row['cash_type_name']">{{ props.row['cash_type_name'] }}</span>
                <span v-else>--</span>
              </div>
              <div class="order">
                订单编号:
                <span v-if="props.row['order_number']"
                  >{{ props.row['order_number'] }} <Copy :message="props.row['order_number']"
                /></span>
                <span v-else>--</span>
              </div>
            </div>
            <svg-icon name="function_closed" class="expand-close-icon" size="1.6" @click.stop="closeExpand" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cash_type_name" label="类型" align="center" />
      <el-table-column prop="create_time" label="时间" align="center">
        <template #default="scope">
          <span v-if="scope.row['create_time']">{{ parseTime(scope.row['create_time']) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="order_status_client" label="交易状态" align="center">
        <template #default="scope">
          <span :style="{ color: setStatus(Number(scope.row['order_status_client']))[1] }">{{
            setStatus(Number(scope.row['order_status_client']))[0]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="recharge_amount" label="金额" align="center">
        <template #default="scope">
          <span>{{ priceToFixed(scope.row['recharge_amount']) }}</span>
        </template>
      </el-table-column>
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
import { defineComponent, ref, Ref, watch } from 'vue';
import formDataHook from '@/hooks/FormDataHook';
import { getDepositList } from '@/api/user-center/in-out-record';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { parseTime } from '@/utils/timeFormat';
import { priceToFixed } from '@/utils/numberFunction';
import NoDataPage from '@/components/NoDataPage/index.vue';

export default defineComponent({
  name: 'InRecord',
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
      setStatus,
      setTimeBar,
      statusList,
      setForm,
      loading,
      resetForm
    } = formDataHook(getDepositList, 10, false);

    watch(
      () => props.active,
      (newVal) => {
        if (newVal === 'in-record') {
          resetForm();
        }
      }
    );

    const showFilterCard = ref(false);

    function showFilterCardHandle() {
      filterStatus.value = form.status;
      showFilterCard.value = true;
    }

    function onConfirm() {
      setForm({ status: filterStatus.value });
      showFilterCard.value = false;
      toGetList();
    }

    function onReset() {
      setForm({ status: null });
      showFilterCard.value = false;
      toGetList();
    }

    const filterStatus: Ref<any> = ref(null);

    const tableRef = ref();

    const expandRowKeys: Ref<any> = ref([]);

    function rowClick(row: any) {
      expandRowKeys.value = [];
      if (tableRef.value) {
        expandRowKeys.value.push(row.id);
        tableRef.value.toggleRowExpansion(row, true);
      }
    }

    function closeExpand() {
      if (tableRef.value) {
        expandRowKeys.value = [];
      }
    }

    return {
      dataList,
      form,
      validTime,
      setTime,
      resetTime,
      toGetList,
      parseTime,
      priceToFixed,
      setStatus,
      timeBarList,
      timeType,
      setTimeBar,
      showFilterCard,
      statusList,
      filterStatus,
      showFilterCardHandle,
      onConfirm,
      onReset,
      loading,
      rowClick,
      tableRef,
      expandRowKeys,
      closeExpand
    };
  }
});
</script>

<style lang="scss" scoped>
.InRecord {
  width: 100%;
  margin: 24px auto 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .expand-box {
    height: 64px;
    position: absolute;
    width: 1069px;
    background: #2a2c33 !important;
    border-radius: 8px;
    top: -62px;
    right: 0;
    font-family: PingFangSC-Regular, cursive;
    font-size: 14px;
    color: #c2c7d2;
    font-weight: 400;
    .expand-close-icon {
      position: absolute;
      top: 21px;
      right: 21px;
      cursor: pointer;
    }
    .expand-box-column {
      width: calc(100% - 80px);
      height: 100%;
      display: flex;
      align-items: center;
      & > div {
        flex-shrink: 0;
        padding: 0 32px 0 0;
        .order {
          flex-grow: 1;
        }
        &:nth-child(1) {
          padding: 0 32px;
          text-align: center;
          font-family: PingFangSC-Regular, cursive;
          font-size: 18px;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
