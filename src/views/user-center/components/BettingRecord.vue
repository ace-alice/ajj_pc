<template>
  <div class="BettingRecord">
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
            <div class="filter-card-title">游戏名称</div>
            <el-radio-group v-model="filterStatus" class="filter-card-radio-group">
              <el-radio v-for="status in gameList" :key="status.id" :label="status.id">{{ status.label }}</el-radio>
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
      <el-table-column prop="game_venue" label="场馆名称" align="center" />
      <el-table-column prop="game_event" label="游戏&赛事名称" width="220">
        <template #default="scope">
          <div>
            <span v-if="scope.row['game_name']"> {{ scope.row['game_name'] }}</span>
            <span v-else>--</span>
          </div>
          <div>
            <span v-if="scope.row['game_event']"> {{ scope.row['game_event'] }}</span>
            <span v-else>--</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="战队">
        <template #default="scope">
          <div v-if="scope.row['team_home_name'] && scope.row['team_away_name']">
            <div>{{ scope.row['team_home_name'] }}</div>
            <div>{{ scope.row['team_away_name'] }}</div>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column prop="bet_odds" label="赔率" align="center">
        <template #default="scope">
          <span>{{ priceToFixed(scope.row['bet_odds']) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="game_type" label="盘口类型&竞猜详情" width="220">
        <template #default="scope">
          <div>
            <span v-if="scope.row['game_type']"> {{ scope.row['game_type'] }}</span>
            <span v-else>--</span>
          </div>
          <div>
            <span v-if="scope.row['game_detail']"> {{ scope.row['game_detail'] }}</span>
            <span v-else>--</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bet_amount" label="投注金额">
        <template #default="scope">
          <div>
            <span v-if="scope.row['bet_amount']"> {{ priceToFixed(scope.row['bet_amount']) }}</span>
            <span v-else>--</span>
          </div>
          <div>
            <div class="winlost" v-if="scope.row['bet_winlost']">
              {{ priceToFixed(scope.row['bet_winlost']) }}
              <span
                :style="{
                  color:
                    Number(scope.row['bet_winlost']) > 0
                      ? '#0EA94A'
                      : Number(scope.row['bet_winlost']) === 0
                      ? ''
                      : '#DC5A06'
                }"
                >{{
                  Number(scope.row['bet_winlost']) > 0 ? '赢' : Number(scope.row['bet_winlost']) === 0 ? '平' : '输'
                }}</span
              >
            </div>
            <span v-else>--</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="recharge_amount" label="投注时间&投注单号" width="220">
        <template #default="scope">
          <div>
            <span v-if="scope.row['game_order_time']"> {{ parseTime(scope.row['game_order_time']) }}</span>
            <span v-else>--</span>
          </div>
          <div>
            <div v-if="scope.row['game_order']" class="game-order">
              <span>{{ scope.row['game_order'] }}</span>
              <Copy :message="scope.row['game_order']" />
            </div>
            <span v-else>--</span>
          </div>
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
import { getBetRecordList } from '@/api/user-center/in-out-record';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { parseTime } from '@/utils/timeFormat';
import { priceToFixed } from '@/utils/numberFunction';
import NoDataPage from '@/components/NoDataPage/index.vue';

export default defineComponent({
  name: 'BettingRecord',
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
      resetForm,
      gameList
    } = formDataHook(getBetRecordList, 10, false);
    watch(
      () => props.active,
      (newVal) => {
        if (newVal === 'betting-record') {
          resetForm();
        }
      }
    );

    const showFilterCard = ref(false);

    function showFilterCardHandle() {
      filterStatus.value = form.game_id;
      showFilterCard.value = true;
    }

    function onConfirm() {
      setForm({ game_id: filterStatus.value });
      showFilterCard.value = false;
      toGetList();
    }

    function onReset() {
      setForm({ game_id: 1 });
      showFilterCard.value = false;
      toGetList();
    }

    const filterStatus: Ref<any> = ref(1);

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
      gameList
    };
  }
});
</script>

<style lang="scss" scoped>
.BettingRecord {
  width: 100%;
  margin: 24px auto 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .winlost {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  //noinspection CssInvalidPseudoSelector
  :deep(.el-table__cell) {
    div,
    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .game-order {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    span:nth-child(1) {
      display: inline-block;
      max-width: calc(100% - 40px);
    }
  }
}
</style>
