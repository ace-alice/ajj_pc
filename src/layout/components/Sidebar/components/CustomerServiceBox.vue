<template>
  <div
    :class="{ 'customer-service-box': true, 'customer-service-box-active': showPopUps }"
    @click.stop="onShowPopUps(!showPopUps)"
  >
    <svg-icon :name="comInfo.iconName"></svg-icon>
    <teleport to="#app">
      <div
        :class="{ 'customer-service-box-pop-ups': true, 'customer-service-box-done-pop-ups': !showPopUps }"
        @click.stop
      >
        <div class="title-bar">
          <el-image class="tag-image" style="height: 48px; width: 48px" :src="fullTimeImage" fit="cover">
            <template #placeholder>
              <div></div>
            </template>
            <template #error>
              <img style="height: 48px; width: 48px" :src="defaultTeamLogo" alt="" />
            </template>
          </el-image>
          <div>小艾小助手</div>
          <svg-icon name="next_more" class="next-more" size="1" @click="closePopUps" />
        </div>
        <div class="card-bar" @click="toFullTimeCustomer">
          <el-image class="card-image" style="height: 136px; width: 136px" :src="fullTimeImage" fit="cover">
            <template #placeholder>
              <div></div>
            </template>
            <template #error>
              <img style="height: 136px; width: 136px" :src="defaultTeamLogo" alt="" />
            </template>
          </el-image>
          <div class="card-info">
            <div class="card-info-title">在线客服</div>
            <div>您可以点击</div>
            <div>
              <span class="gold">24小时客服 </span>
              <span>向我提问</span>
            </div>
          </div>
        </div>
        <div class="full-time-bar" @click="toFullTimeCustomer">
          <span>24小时客服</span>
          <svg-icon name="function_next" />
        </div>
        <div class="content-bar" v-for="contact in contactList" :key="contact['id']">
          <span>{{ getLabel(String(contact['identity'])) }}</span>
          <span>{{ contact['address'] }} <Copy :message="contact['address']" /></span>
        </div>
      </div>
    </teleport>
    <FullTimeCustomer />
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import SvgIcon from '@/components/SvgIcon/index.vue';
import defaultImageHook from '@/hooks/defaultImageHook';
import FullTimeCustomer from '@/layout/components/Sidebar/components/FullTimeCustomer.vue';
import { getContactUs } from '@/api/contact-us';

export default defineComponent({
  name: 'CustomerServiceBox',
  props: {
    comInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: { SvgIcon, FullTimeCustomer },
  setup() {
    const { showPopUps, onShowPopUps, closePopUps } = popUpsMittBusHook('showCustomerServiceBox');

    const { defaultTeamLogo } = defaultImageHook();

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fullTimeImage = require('@/assets/image/icons/full-time.png');

    const { proxy }: any = getCurrentInstance();

    function toFullTimeCustomer() {
      closePopUps();
      proxy.mittBus.emit('showFullTimeCustomer', true);
    }

    const contactList = ref([]);

    function getLabel(identity: string) {
      if (identity === '2') {
        return '商务接洽';
      }
      if (identity === '3') {
        return '意见反馈';
      }
    }

    function getContactUsFun() {
      getContactUs().then((res: any) => {
        contactList.value = [];
        if (Number(res.code) === 1) {
          contactList.value = res.data.filter((contact: any) => {
            return ['2', '3'].includes(String(contact.identity));
          });
        }
      });
    }

    onMounted(() => {
      getContactUsFun();
    });

    return {
      showPopUps,
      onShowPopUps,
      closePopUps,
      defaultTeamLogo,
      fullTimeImage,
      toFullTimeCustomer,
      contactList,
      getLabel
    };
  }
});
</script>

<style lang="scss" scoped>
.customer-service-box {
  transition: all 0.2s linear;
}
.customer-service-box-active {
  background: var(--aux-color);
}
.customer-service-box-pop-ups {
  position: absolute;
  width: 420px;
  top: 88px;
  right: 88px;
  padding-bottom: 45px;
  background: var(--component-pop-ups-bg);
  z-index: 150;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.5s ease-in-out;
  & > div {
    width: calc(100% - 74px);
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Regular, cursive;
    font-size: 16px;
    color: #c2c7d2;
  }
  .title-bar {
    height: 80px;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #ffffff;
    font-weight: 600;
    border-bottom: 1px solid #ffffff10;
  }
  .card-bar {
    background: #00000080;
    height: 154px;
    border-radius: 8px;
    margin-top: 16px;
    align-items: flex-end;
    justify-content: center;
    cursor: pointer;
    .card-info {
      padding: 0 0 36px 14px;
      width: 174px;
      font-family: PingFangSC-Regular, cursive;
      font-size: 14px;
      color: #c2c7d2;
      line-height: 20px;
      .card-info-title {
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #ffffff;
        font-weight: 600;
        margin-bottom: 14px;
      }
      .gold {
        color: var(--aux-color);
      }
    }
  }
  .full-time-bar {
    width: calc(100% - 94px);
    margin-top: 28px;
    cursor: pointer;
  }
  .content-bar {
    width: calc(100% - 94px);
    padding: 0 10px;
    margin-top: 22px;
  }
}
.customer-service-box-done-pop-ups {
  transform: translateX(615px);
}
.next-more {
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s linear;
  &:hover {
    opacity: 1;
  }
}
.tag-image {
  border-radius: 50%;
  background: #00000080;
}
</style>
