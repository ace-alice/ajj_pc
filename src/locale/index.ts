import { createI18n } from 'vue-i18n';

// 简体中文
import zhCnLocale from 'element-plus/es/locale/lang/zh-cn';

// 英文
import enUsLocale from 'element-plus/es/locale/lang/en';

// 导入自定义根语言文件
import rootZhCN from './langs/zh_CN';
import rootEnUS from './langs/en-US';

const messages = {
  'zh-CN': {
    el: zhCnLocale.el,
    ...rootZhCN
  },
  'en-US': {
    el: enUsLocale.el,
    ...rootEnUS
  }
};

// 导出语言国际化
export const i18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  warnHtmlMessage: 'off',
  messages
});

export const locale = zhCnLocale;
