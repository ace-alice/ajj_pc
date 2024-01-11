<template>
  <div class="bulletin-list">
    <div class="bulletin-box">
      <BulletinItem v-for="bulletin in dataList" :detail="bulletin" :key="bulletin['id']" />
      <NoDataPage v-show="dataList.length === 0" />
    </div>
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
import { defineComponent, watch } from 'vue';
import BulletinItem from '@/views/message-center/components/BulletinItem.vue';
import formDataHook from '@/hooks/FormDataHook';
import { getAnnouncement } from '@/api/message-center';
import NoDataPage from '@/components/NoDataPage/index.vue';

export default defineComponent({
  name: 'BulletinList',
  props: {
    active: {
      type: String,
      default: ''
    }
  },
  components: { BulletinItem, NoDataPage },
  setup(props) {
    const { dataList, toGetList, form, setForm } = formDataHook(getAnnouncement, 6, true);

    watch(
      () => props.active,
      (newVal) => {
        if (newVal === 'bulletin') {
          setForm({ page: 1 });
          toGetList();
        }
      }
    );

    return { dataList, toGetList, form, setForm };
  }
});
</script>

<style lang="scss" scoped>
.bulletin-list {
  font-family: PingFangSC-Medium;
  color: #ffffff;
  width: 1122px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .bulletin-box {
    margin-bottom: 80px;
  }
}
</style>
