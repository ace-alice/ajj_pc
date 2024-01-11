<template>
  <div class="text-tooltip">
    <el-tooltip
      class="tip-item"
      effect="dark"
      :disabled="isShowTooltip"
      :content="tipContentAlert"
      placement="bottom-start"
      popper-class="popper-tooltip"
    >
      <p class="over-flow" :class="tipClassName" @mouseover="tipOnMouseOver(tipRefName)">
        <span :ref="tipRefName"
          >{{ tipContent || '-'
          }}<span v-if="tipContent2">
            <span>{{ tipContent2.split(',')[0] }}</span>
            <span>VS</span>
            <span>{{ tipContent2.split(',')[1] }}</span>
          </span>
        </span>
      </p>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, ref } from 'vue';

export default defineComponent({
  name: 'TooltipOver',
  props: {
    tipContent: {
      type: String,
      default: () => {
        return '';
      }
    },
    tipContent2: {
      type: String,
      default: ''
    },
    tipClassName: {
      type: String,
      default: () => {
        return '';
      }
    },
    tipRefName: {
      type: String,
      default: () => {
        return '';
      }
    }
  },
  components: {},
  setup(props) {
    const isShowTooltip = ref(true);
    const { proxy }: any = getCurrentInstance();
    const tipOnMouseOver = (str: string) => {
      const parentWidth = proxy.$refs[str].parentNode.offsetWidth;
      const contentWidth = proxy.$refs[str].offsetWidth;
      isShowTooltip.value = contentWidth <= parentWidth;
    };

    const tipContentAlert = computed(() => {
      if (props.tipContent2) {
        return `${props.tipContent}  ${props.tipContent2.split(',')[0]} VS ${props.tipContent2.split(',')[1]}`;
      }
      return props.tipContent;
    });
    return {
      isShowTooltip,
      tipOnMouseOver,
      tipContentAlert
    };
  }
});
</script>

<style lang="scss" scoped>
.over-flow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
.tip-width {
  max-width: calc(100% - 66px);
}
p {
  margin: 0;
}
</style>
