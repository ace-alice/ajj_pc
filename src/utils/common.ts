export function setPageTitle(pageTitle: string) {
  const title = '小艾竞技';
  // 设置页面 title
  window.document.title = title ? ` ${title}-${pageTitle}` : `${pageTitle}`;
}
