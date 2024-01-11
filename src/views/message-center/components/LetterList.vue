<template>
  <div class="letter-list">
    <div class="letter-list-main">
      <div class="letter-list-box">
        <div :class="{ 'checked-box': true, 'show-checked': checkedArr.length }">
          <div class="selected">
            <span>{{ checkedArr.length }}</span>
            选中
          </div>
          <div class="select-all" @click="selectAll">
            <svg-icon name="msg_select all"></svg-icon>
          </div>
          <svg-icon name="msg_read" @click="onReadLetter"></svg-icon>
          <svg-icon name="msg_delete" @click="openMessageBox"></svg-icon>
        </div>
        <el-checkbox-group v-model="checkedArr" ref="checkboxGroup">
          <div class="letter-item-card" v-for="letter in dataList" :key="letter['id'] + 'a' + letter['status']">
            <div class="checked-card">
              <el-checkbox :label="letter['id']" />
            </div>
            <LetterItem :detail="letter" @read="setCurrentLetter(letter)" />
          </div>
          <NoDataPage v-show="dataList.length === 0" />
        </el-checkbox-group>
      </div>
      <div class="letter-detail-box" v-if="currentLetter['id']">
        <div class="letter-detail-title">{{ currentLetter['title'] }}</div>
        <div class="letter-detail-content">
          {{ currentLetter['content'] }}
        </div>
      </div>
      <div class="no-letter-detail-box" v-else>未选择信息</div>
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
import { computed, defineComponent, Ref, ref, watch } from 'vue';
import { getLetter } from '@/api/message-center';
import formDataHook from '@/hooks/FormDataHook';
import SvgIcon from '@/components/SvgIcon/index.vue';
import LetterItem from '@/views/message-center/components/LetterItem.vue';
import { delLetter, setReadLetter } from '@/api/message-center';
import NoDataPage from '@/components/NoDataPage/index.vue';
import { ElMessageBox } from 'element-plus';

const defaultLetter = {
  id: null,
  title: '',
  content: ''
};

export default defineComponent({
  name: 'LetterList',
  props: {
    active: {
      type: String,
      default: ''
    }
  },
  components: { SvgIcon, LetterItem, NoDataPage },
  setup(props) {
    const { dataList, toGetList, form, setForm } = formDataHook(getLetter, 6, false);

    const currentId = ref('0');

    const currentLetter = computed(() => {
      const temp = dataList.value.filter((letter: any) => {
        return String(letter.id) === String(currentId.value);
      });
      if (temp.length > 0) {
        return temp[0];
      } else {
        return defaultLetter;
      }
    });

    function setCurrentLetter(letter: any) {
      currentId.value = String(letter.id);
    }

    const checkedArr: Ref<any[]> = ref([]);

    watch(
      () => props.active,
      (newVal) => {
        if (newVal === 'letter') {
          setForm({ page: 1 });
          toGetList();
        }
      }
    );

    watch(
      () => dataList.value,
      () => {
        checkedArr.value = [];
      },
      { deep: true }
    );

    function selectAll() {
      const hasAll = dataList.value.every((data: any) => {
        return checkedArr.value.includes(data.id);
      });
      if (hasAll) {
        checkedArr.value = [];
      } else {
        const set = new Set();
        dataList.value.forEach((data: any) => {
          set.add(data.id);
        });
        checkedArr.value = [...set];
      }
    }

    function onReadLetter() {
      if (checkedArr.value.length > 0) {
        setReadLetter({ ids: checkedArr.value }).then((res: any) => {
          if (+res.code === 1) {
            checkedArr.value = [];
            setForm({ page: 1 });
            toGetList();
          }
        });
      }
    }

    function onDeleteLetter() {
      if (checkedArr.value.length > 0) {
        delLetter({ ids: checkedArr.value }).then((res: any) => {
          if (+res.code === 1) {
            checkedArr.value = [];
            setForm({ page: 1 });
            toGetList();
          }
        });
      }
    }

    const openMessageBox = () => {
      ElMessageBox.confirm('是否确定永久删除此信息？', '删除信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        center: true,
        showClose: false,
        customClass: 'letter-message',
        cancelButtonClass: 'letter-cancel',
        confirmButtonClass: 'letter-confirm'
      })
        .then(() => {
          onDeleteLetter();
        })
        .catch(() => {});
    };

    return {
      dataList,
      toGetList,
      form,
      setForm,
      checkedArr,
      currentLetter,
      setCurrentLetter,
      selectAll,
      onDeleteLetter,
      onReadLetter,
      openMessageBox
    };
  }
});
</script>

<style lang="scss" scoped>
.letter-list {
  font-family: PingFangSC-Medium;
  color: #ffffff;
  width: 1122px;
  overflow: hidden;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .letter-list-main {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 80px;
  }
  .letter-list-box {
    width: 408px;
    min-height: 150px;
    .letter-item-card {
      height: 62px;
      width: 408px;
      display: flex;
      justify-items: center;
      margin-top: 24px;
    }
    .show-checked {
      height: 62px !important;
    }
    .checked-box {
      width: 100%;
      height: 0;
      background: var(--aux-color);
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      transition: height 0.3s ease-in-out;

      > *:not(.selected) {
        cursor: pointer;
      }

      .selected {
        width: 160px;
        span {
          margin: 0 10px;
        }
      }
      .select-all {
        height: 42px;
        width: 42px;
        background: #ffffff20;
        border-radius: 50%;
        text-align: center;
        line-height: 42px;
      }
    }
  }
  .letter-detail-box {
    width: 626px;
    min-height: 150px;
    .letter-detail-title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #ffffff;
      font-weight: 600;
      margin: 52px 0;
    }
    .letter-detail-content {
      font-family: PingFangSC-Regular, cursive;
      font-size: 14px;
      color: #ffffff;
    }
  }
  .no-letter-detail-box {
    width: 626px;
    height: 300px;
    line-height: 300px;
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #c2c7d2;
    font-weight: 600;
  }

  //noinspection CssInvalidPseudoSelector
  :deep(.el-checkbox-group) {
    line-height: unset;
  }
  .checked-card {
    height: 62px;
    width: 42px;
    display: flex;
    flex-shrink: 0;
    justify-content: flex-end;
    align-items: center;
    //noinspection CssInvalidPseudoSelector
    :deep(.el-checkbox) {
      --el-checkbox-bg-color: #00000000;
      --el-checkbox-input-border: 1px solid #c2c7d2;
      --el-checkbox-input-height: 18px;
      --el-checkbox-input-width: 18px;
      --el-checkbox-checked-input-border-color: var(--aux-color);
      --el-checkbox-checked-bg-color: var(--aux-color);
      --el-checkbox-font-weight: 600;
      --el-checkbox-input-border-color-hover: var(--aux-color);
      .el-checkbox__inner:after {
        height: 12px;
        width: 6px;
        top: -1.5px;
        left: 4.5px;
        border-width: 2px;
      }
      .el-checkbox__label {
        display: none !important;
      }
    }
  }
}
</style>
