import { getCurrentInstance } from 'vue';
import popUpsControlHook from '@/hooks/PopUpsControlHook';

export default function openCustomerService(exclude: string[] = []) {
  const { proxy }: any = getCurrentInstance();

  const { closeOtherPopUps } = popUpsControlHook(proxy, exclude);

  function open() {
    closeOtherPopUps();
    proxy.mittBus.emit('showFullTimeCustomer', true);
  }
  function close() {
    proxy.mittBus.emit('showFullTimeCustomer');
  }

  return { open, close };
}
