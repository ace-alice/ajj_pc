<template>
  <div class="no-click-input select-place-item" @click.stop="onShowPopUps(!showPopUps)">
    <span v-if="form.place && form.province" class="value">{{ form.province }} >> {{ form.place }}</span>
    <span v-else class="no-data">请选择开户城市</span>
    <svg-icon name="function_Right" class="right-icon" />
    <teleport to="#app">
      <div :class="{ 'select-pop-ups': true, 'select-done-pop-ups': !showPopUps }" @click.stop="closePopUps">
        <div :class="{ 'select-page': true, 'select-page-done': !showPopUps }" @click.stop>
          <div class="select-bank">
            <el-scrollbar>
              <div class="wallet select-bank-box">
                <div class="title">开户城市</div>
                <div class="select-tabs">
                  <div class="title-label-two select-tab" @click="changeShow('province')">
                    <div>选择开户的省份</div>
                    <svg-icon name="Top_Down" size="0.8" :class="{ 'select-icon': true, up: !showPlace }" />
                    <div v-if="formData.province" class="select-info">{{ formData.province }}</div>
                    <div class="select-info nodata" v-else>请选择</div>
                  </div>
                  <div class="title-label-two select-tab" @click="changeShow('place')">
                    <div>选择开户的城市</div>
                    <svg-icon name="Top_Down" size="0.8" :class="{ 'select-icon': true, up: showPlace }" />
                    <div v-if="formData.place" class="select-info">{{ formData.place }}</div>
                    <div class="select-info nodata" v-else>请选择</div>
                  </div>
                </div>
                <div v-show="!showPlace">
                  <el-radio-group
                    v-model="formData.province"
                    class="select-bank-radio-group select-province-radio-group"
                    @change="changeShow('place', true)"
                  >
                    <el-radio v-for="place in list" :key="place['id']" :label="place['cname']">
                      {{ place['cname'] }}
                    </el-radio>
                  </el-radio-group>
                </div>
                <div v-show="showPlace">
                  <el-radio-group v-model="formData.place" class="select-bank-radio-group select-province-radio-group">
                    <el-radio v-for="place in placeList" :key="place['id']" :label="place['cname']">
                      {{ place['cname'] }}
                    </el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-scrollbar>
            <div :class="{ 'select-btn': true, active: isActive }" @click="onSubmit">确认</div>
            <svg-icon name="last_more" size="1.5" class="close-icon" @click.stop="closePopUps" />
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';
import { getAreaList } from '@/api/wallet/bank-usdt';
import SvgIcon from '@/components/SvgIcon/index.vue';

export default defineComponent({
  name: 'SelectPlaceItem',
  props: {
    form: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  emits: ['submit'],
  components: { SvgIcon },
  setup(props, { emit }) {
    const { showPopUps, onShowPopUps, closePopUps } = popUpsMittBusHook('closeSelectPlacePopUps', [
      'closeAddBankPopUps'
    ]);

    const list = ref([]);

    function getList() {
      getAreaList().then((res: any) => {
        if (Number(res.code) === 1) {
          list.value = res.data;
        }
      });
    }

    const formData = reactive({
      province: '',
      place: ''
    });

    function onSubmit() {
      if (!isActive.value) return;
      emit('submit', formData);
      closePopUps();
    }

    const isActive = computed(() => {
      return (
        formData.province &&
        formData.place &&
        (props.form.province !== formData.province || props.form.place !== formData.place)
      );
    });

    const placeList = computed(() => {
      const temp: any[] = list.value.filter((p: any) => {
        return p.cname === formData.province;
      });
      if (temp.length > 0) {
        return temp[0].children;
      } else {
        return [];
      }
    });

    const showPlace = ref(false);

    function changeShow(tab: string, to: boolean = false) {
      if (tab === 'province') {
        showPlace.value = false;
      }
      if (tab === 'place') {
        if (formData.province) {
          showPlace.value = true;
        }
      }
      if (to) {
        setTimeout(() => {
          if (placeList.value.length > 0) {
            formData.place = placeList.value[0].cname;
          }
        }, 10);
      }
    }

    onMounted(() => {
      getList();
    });

    return {
      showPopUps,
      onShowPopUps,
      closePopUps,
      formData,
      isActive,
      onSubmit,
      list,
      placeList,
      showPlace,
      changeShow
    };
  }
});
</script>

<style lang="scss" scoped>
.select-place-item {
  .bank-label {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    .bank-image {
      margin: 0 6px;
      border-radius: 50%;
    }
  }
}
.select-bank {
  height: 100%;
  width: 100%;
  font-family: PingFangSC-Regular, cursive;
  font-size: 16px;
  color: #ffffff;
  font-weight: 400;
  position: relative;
  .close-icon {
    position: absolute;
    top: 32px;
    left: 66px;
    cursor: pointer;
  }
  .select-btn {
    position: absolute;
    bottom: 32px;
    left: 425px;
    height: 54px;
    width: 390px;
    margin: 26px auto 36px;
    background: #ffffff60;
    border-radius: 4px;
    text-align: center;
    line-height: 54px;
    font-family: PingFangSC-Regular, cursive;
    font-size: 16px;
    color: #ffffff;
    font-weight: 400;
    cursor: not-allowed;
  }
  .active {
    background: var(--aux-color);
    cursor: pointer;
    &:hover {
      box-shadow: 12px 12px 24px #ffffff30 inset;
    }
    &:active {
      box-shadow: 12px 12px 24px #ffffff60 inset;
    }
  }
  .select-bank-box {
    width: 1012px;
    margin: 100px auto 10px;
    .select-tabs {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .select-tab {
        cursor: pointer;
        display: flex;
        align-items: center;
        .select-info {
          min-width: 76px;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: var(--aux-color);
          font-weight: 600;
        }
        .nodata {
          color: #535865;
        }
        .select-icon {
          margin: 0 16px;
          transition: all 0.5s ease-in-out;
        }
        .up {
          transform: rotateZ(180deg);
        }
      }
    }
    .tag-image {
      border-radius: 50%;
      margin: 0 12px;
    }
  }
}
</style>
