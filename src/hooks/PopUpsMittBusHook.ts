import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import popUpsControlHook from '@/hooks/PopUpsControlHook';
import { useRoute } from 'vue-router';

export default function popUpsMittBusHook(mittName: string, exclude: string[] = [], excludeRoute: string = '') {
  const { proxy }: any = getCurrentInstance();

  const route = useRoute();

  const { closeOtherPopUps } = popUpsControlHook(proxy, [mittName, ...exclude]);

  const showPopUps = ref(false);

  function onShowPopUps(show: boolean = true) {
    if (route.name === excludeRoute) return;
    showPopUps.value = show;
    closeOtherPopUps();
  }

  function closePopUps() {
    showPopUps.value = false;
  }

  onMounted(() => {
    window.addEventListener('click', closePopUps);
    proxy.mittBus.on(mittName, (show: boolean = false) => {
      showPopUps.value = show;
    });
  });

  onUnmounted(() => {
    window.removeEventListener('click', closePopUps);
    proxy.mittBus.off(mittName);
  });

  return { showPopUps, onShowPopUps, closePopUps, route };
}
