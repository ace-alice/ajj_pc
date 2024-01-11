import { computed, onMounted, onUnmounted, ref } from 'vue';

export default function testSpeedHook() {
  const webSiteLists = ref([
    { siteUrl: 'http://aijj.vip', name: '线路一', speed: 0 },
    { siteUrl: 'http://ajj.one', name: '线路二', speed: 0 },
    { siteUrl: 'http://aijj.bet', name: '线路三', speed: 0 },
    { siteUrl: 'http://ajj.tv', name: '线路四', speed: 0 },
    { siteUrl: 'http://ajj.bet', name: '线路五', speed: 0 },
    { siteUrl: 'http://aijj.me', name: '线路六', speed: 0 }
  ]);

  function setCode(num: number) {
    if (num > 400) {
      return '400+';
    } else {
      return String(num);
    }
  }

  function testSpeed(siteUrl: string, index: number) {
    const image = new Image();
    image.src = siteUrl;
    const start = new Date().getTime();
    image.onload = function () {
      const end = new Date().getTime();
      webSiteLists.value[index].speed = end - start;
    };
    image.onerror = function () {
      const end = new Date().getTime();
      webSiteLists.value[index].speed = end - start;
    };
  }

  function initSpeed() {
    webSiteLists.value.forEach((webSite, index) => {
      testSpeed(webSite.siteUrl, index);
    });
  }

  const deviceType = computed(() => {
    // android终端
    const isAndroid = /(Android)/i.test(navigator.userAgent);
    // ios终端
    const isiOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);

    if (isAndroid) {
      return 'android';
    }
    if (isiOS) {
      return 'ios';
    }
    return 'other';
  });

  function toPath(url: string) {
    if (deviceType.value == 'ios') {
      location.href = url;
    } else {
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('target', '_blank');
      link.click();
    }
  }

  let timer: any = null;

  onMounted(() => {
    initSpeed();
    timer = setInterval(() => {
      initSpeed();
    }, 10000);
  });

  onUnmounted(() => {
    clearInterval(timer);
    timer = null;
  });

  return { setCode, webSiteLists, toPath };
}
