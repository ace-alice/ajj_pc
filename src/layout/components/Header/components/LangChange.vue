<template>
  <el-dropdown popper-class="lang-dropdown" trigger="click" @command="changeLang">
    <div class="lang-change">
      <svg-icon name="Top_language" class="blur"></svg-icon>
      <span>切换语言</span>
      <svg-icon name="Top_Down" size="0.5"></svg-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in langList"
          :command="lang.code"
          :disabled="currentLang === lang.code && langList.length > 1"
          :key="lang.code"
        >
          <div class="lang-dropdown-item">
            <svg-icon :name="lang.svg" size="1.6" />
            <div class="lang-name">{{ lang.label }}</div>
            <div>{{ lang.simple }}</div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
// import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'LangChange',
  components: { SvgIcon },
  setup() {
    const currentLang = computed(() => {
      return 'zh_cn';
    });

    const langList = [{ label: '简体中文', svg: 'language_cn', code: 'zh_cn', simple: 'CN' }];

    function changeLang(command: string | number) {
      // ElMessage(`click on item ${command}`);
    }

    return { currentLang, langList, changeLang };
  }
});
</script>

<style lang="scss" scoped>
.lang-change {
  display: flex;
  font-size: 16px;
  color: #ffffff;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  span {
    opacity: 0.7;
    font-family: PingFangSC-Regular, serif;
    font-weight: 400;
    margin: 0 7px;
    font-size: 16px;
  }
  .blur {
    filter: drop-shadow(0 80px #fff);
    //transform: translateY(-80px);
  }
}
</style>
