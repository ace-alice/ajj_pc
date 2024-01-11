<template>
  <div class="LetterItem" @click="readHandler">
    <div class="tag-image">
      <el-image style="height: 48px; width: 48px" :src="detail['tag_logo']" fit="cover">
        <template #placeholder>
          <div></div>
        </template>
        <template #error>
          <img style="height: 48px; width: 48px" :src="defaultTeamLogo" alt="" />
        </template>
      </el-image>
    </div>
    <div class="detail-info">
      <div>
        <span> {{ detail['title'] }}</span>
        <span> {{ parseTime(detail['create_time'], '{m}-{d}') }}</span>
      </div>
      <div>
        {{ detail['content'] }}
      </div>
    </div>
    <div :class="{ 'msg-unfold': true, 'no-read': !isRead }">
      <svg-icon name="msg_unfold" size="1.7" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import defaultImageHook from '@/hooks/defaultImageHook';
import { parseTime } from '@/utils/timeFormat';
import { setReadLetter } from '@/api/message-center';

export default defineComponent({
  name: 'LetterItem',
  props: {
    detail: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  emits: ['read'],
  components: { SvgIcon },
  setup(props, { emit }) {
    const { defaultTeamLogo } = defaultImageHook();

    const isRead = ref(+props.detail.status === 1);

    function readHandler() {
      emit('read');
      if (isRead.value) return;
      setReadLetter({ ids: [props.detail.id] }).then((res: any) => {
        if (+res.code === 1) {
          isRead.value = true;
        }
      });
    }

    return { defaultTeamLogo, parseTime, readHandler, isRead };
  }
});
</script>

<style lang="scss" scoped>
.LetterItem {
  height: 100%;
  flex-grow: 1;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  .tag-image {
    flex-shrink: 0;
    width: 80px;
    display: flex;
    justify-content: center;
  }
  .detail-info {
    flex-grow: 1;
    overflow: hidden;
    & > div {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:nth-child(1) {
        display: flex;
        justify-content: space-between;
        span:nth-child(1) {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #ffffff;
          font-weight: 600;
        }
        span:nth-child(2) {
          font-family: PingFangSC-Regular, cursive;
          font-size: 14px;
          color: #ffffff;
        }
      }
      &:nth-child(2) {
        font-family: PingFangSC-Regular, cursive;
        font-size: 14px;
        color: #c2c7d2;
        margin-top: 6px;
      }
    }
  }
  .msg-unfold {
    flex-shrink: 0;
    width: 64px;
    display: flex;
    justify-content: center;
    position: relative;
  }
  .no-read {
    &:after {
      content: '';
      position: absolute;
      height: 10px;
      width: 10px;
      background: var(--chinese-red);
      border-radius: 50%;
      right: 16px;
    }
  }
}
</style>
