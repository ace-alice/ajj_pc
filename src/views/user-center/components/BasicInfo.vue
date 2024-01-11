<!--suppress CssInvalidPseudoSelector -->
<template>
  <div class="BasicInfo">
    <div class="show-avatar">
      <el-image style="height: 64px; width: 64px" :src="userInfo['avatar_url']" fit="cover">
        <template #placeholder>
          <div></div>
        </template>
        <template #error>
          <img style="height: 64px; width: 64px" :src="defaultTeamLogo" alt="" />
        </template>
      </el-image>
      <div class="user-name">
        <div>{{ userInfo.username }}</div>
        <span class="change-bar" @click="showAvatar = !showAvatar">更改头像</span>
      </div>
    </div>
    <div class="show-info">
      <div :class="{ 'avatar-box': true, 'show-avatar-box': showAvatar }" :style="{ '--box-height': boxHeight }">
        <el-image
          :class="{ 'avatar-image': true, 'current-image': +avatar['file_id'] === +userForm['avatar_id'] }"
          style="height: 64px; width: 64px"
          :src="avatar['file_url']"
          fit="cover"
          v-for="avatar in avatarList"
          :key="avatar['file_id']"
          @click="setAvatarHandle(avatar)"
        >
          <template #placeholder>
            <div></div>
          </template>
          <template #error>
            <img style="height: 64px; width: 64px" :src="defaultTeamLogo" alt="" />
          </template>
        </el-image>
      </div>
      <div class="form">
        <el-form
          ref="userRuleFormRef"
          :model="userForm"
          :rules="userInfoRules"
          label-width="120px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              v-model="userForm['birthday']"
              type="date"
              :disabled="!!userInfo['birthday']"
              placeholder="年月日"
              :editable="false"
              :clearable="false"
              format="YYYY.MM.DD"
              value-format="x"
            />
          </el-form-item>
          <template v-if="!editPhone">
            <el-form-item label="手机号" prop="phone">
              <div class="phone-label">
                <span>{{ phoneHandling(userForm['phone']) }}</span>
                <span @click="editPhone = true">修改</span>
              </div>
            </el-form-item>
          </template>
          <template v-if="editPhone">
            <el-form-item label="旧手机号码" prop="old_phone">
              <el-input
                v-model="userForm.old_phone"
                disabled
                placeholder="请输入旧手机号码"
                type="text"
                maxlength="32"
              />
            </el-form-item>
            <el-form-item label="新手机号码" prop="new_phone">
              <el-input v-model="userForm.new_phone" placeholder="请输入新手机号码" type="text" maxlength="32" />
              <template #error>
                <div class="form-error-info">
                  <span>{{ errMessage.new_phone }}</span>
                  <svg-icon name="remind"></svg-icon>
                </div>
              </template>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha_code">
              <el-input v-model.number="userForm.captcha_code" type="text" placeholder="请输入验证码" maxlength="6">
                <template #append>
                  <div v-if="!countDown" @click="sendCode">获取验证码</div>
                  <div v-else>
                    <span>{{ countDown }}s</span>后重新发送
                  </div>
                </template>
              </el-input>
              <template #error>
                <div class="form-error-info">
                  <span>{{ errMessage.captcha_code }}</span>
                  <svg-icon name="remind"></svg-icon>
                </div>
              </template>
            </el-form-item>
          </template>
          <el-form-item>
            <el-button type="primary" @click="userSubmitForm(userRuleFormRef)"> 保存 </el-button>
            <span v-if="editPhone" class="closeEditPhone" @click="closeEditPhone">取消</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import defaultImageHook from '@/hooks/defaultImageHook';
import { getAvatarList, setUserInfo, phoneCaptcha, setPhone } from '@/api/user-center/user-info-setting';
import { phoneHandling } from '@/utils/numberFunction';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'BasicInfo',
  props: {},
  components: {},
  setup() {
    const store = useStore();

    const userRuleFormRef = ref(null);

    const userInfo = computed(() => {
      return store.getters.getUserInfo;
    });

    watch(
      () => userInfo.value,
      (newVal) => {
        Object.assign(userForm, {
          avatar_id: newVal.avatar_id,
          birthday: newVal.birthday ? newVal.birthday : null,
          phone: newVal.phone,
          old_phone: newVal.phone
        });
      },
      { deep: true }
    );

    const avatarList = ref([]);

    const boxHeight = computed(() => {
      if (avatarList.value.length === 1) {
        return 0;
      } else {
        return (Math.floor(avatarList.value.length / 6) + 1) * 104;
      }
    });

    const showAvatar = ref(false);

    function toGetAvatarList() {
      const params = {
        page: 1,
        limit: 99
      };
      getAvatarList(params).then((res: any) => {
        if (+res.code === 1) {
          avatarList.value = res.data.data;
        }
      });
    }

    const { defaultTeamLogo } = defaultImageHook();

    const userForm = reactive({
      avatar_id: userInfo.value.avatar_id,
      birthday: userInfo.value.birthday ? userInfo.value.birthday : null,
      phone: userInfo.value.phone,
      old_phone: userInfo.value.phone,
      new_phone: '',
      captcha_code: ''
    });

    function setAvatarHandle(avatar: any) {
      if (+userForm.avatar_id === +avatar.file_id) return;
      userForm.avatar_id = avatar.file_id;
    }

    /**
     * 验证码验证
     */
    const accountCodeValidator = (rule: any, value: any, callback: any) => {
      const reg = /^\d{6}$/;
      if (value === '') {
        errMessage.captcha_code = '验证码不能为空';
        callback(new Error(errMessage.captcha_code));
      } else if (!reg.test(value)) {
        errMessage.captcha_code = '请输入6位短信验证码';
        callback(new Error(errMessage.captcha_code));
      } else {
        errMessage.captcha_code = '';
        callback();
      }
    };

    /**
     * 账号验证
     */
    const registerPhoneValidator = (rule: any, value: any, callback: any) => {
      const reg = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;
      if (value === '') {
        errMessage.new_phone = '请输入手机号';
        callback(new Error(errMessage.new_phone));
        return '请输入手机号';
      } else if (!reg.test(value)) {
        errMessage.new_phone = '请输入正确的手机号';
        callback(new Error(errMessage.new_phone));
      } else if (value === userForm.old_phone) {
        errMessage.new_phone = '新手机号不能与旧手机号码相同';
        callback(new Error(errMessage.new_phone));
      } else {
        errMessage.new_phone = '';
        callback();
      }
    };

    /**
     * 表单验证字段
     */
    const userInfoRules = reactive({
      new_phone: [{ validator: registerPhoneValidator, trigger: ['blur', 'change'] }],
      captcha_code: [{ validator: accountCodeValidator, trigger: 'blur' }]
    });

    const errMessage = reactive({
      new_phone: '',
      captcha_code: ''
    });

    function dealForm() {
      const form: any = {};
      if (userForm.birthday && userForm.birthday !== userInfo.value.birthday) {
        form.birthday = Math.floor(userForm.birthday / 1000);
      }
      if (userForm.avatar_id && userForm.avatar_id !== userInfo.value.avatar_id) {
        form.avatar_id = userForm.avatar_id;
      }
      return form;
    }

    function dealForm2() {
      const form: any = {};
      if (userForm.old_phone) {
        form.old_phone = userForm.old_phone;
      }
      if (userForm.new_phone && userForm.new_phone !== userForm.old_phone) {
        form.new_phone = userForm.new_phone;
      }
      if (userForm.captcha_code) {
        form.captcha_code = userForm.captcha_code;
      }
      return form;
    }

    const { proxy }: any = getCurrentInstance();

    /**
     * 保存信息
     */
    const userSubmitForm = (formEl: any) => {
      if (!formEl) return;
      formEl.validate((valid: any) => {
        if (valid) {
          const form = dealForm();
          const form2 = dealForm2();
          if (Object.keys(form).length > 0) {
            setUserInfo(form)
              .then((res: any) => {
                if (+res.code === 1) {
                  store.dispatch('user/getUserInfo');
                  proxy.mittBus.emit('changeToast', {
                    header: 'pop_gift_effect',
                    text: '修改成功'
                  });
                  showAvatar.value = false;
                } else {
                  ElMessage({
                    message: res.msg || res.message,
                    duration: 2 * 1000,
                    customClass: 'copy-message',
                    grouping: true
                  });
                }
              })
              .catch((err: any) => {
                ElMessage({
                  message: err.msg || err.message,
                  duration: 2 * 1000,
                  customClass: 'copy-message',
                  grouping: true
                });
              });
          }
          if (Object.keys(form2).length > 2) {
            setPhone(form2)
              .then((res: any) => {
                if (+res.code === 1) {
                  store.dispatch('user/getUserInfo');
                  proxy.mittBus.emit('changeToast', {
                    header: 'pop_gift_effect',
                    text: '手机号换绑成功'
                  });
                  closeEditPhone();
                } else {
                  ElMessage({
                    message: res.msg || res.message,
                    duration: 2 * 1000,
                    customClass: 'copy-message',
                    grouping: true
                  });
                }
              })
              .catch((err: any) => {
                ElMessage({
                  message: err.msg || err.message,
                  duration: 2 * 1000,
                  customClass: 'copy-message',
                  grouping: true
                });
              });
          }
        } else {
          return false;
        }
      });
    };

    const editPhone = ref(false);

    function closeEditPhone() {
      editPhone.value = false;
      userForm.new_phone = '';
      userForm.captcha_code = '';
      countDown.value = 0;
      clearInterval(timer);
      timer = null;
    }

    const countDown = ref(0);

    let timer: any;

    function sendCode() {
      if (userForm.new_phone && !errMessage.new_phone && !timer) {
        phoneCaptcha({ phone: userForm.new_phone })
          .then((res: any) => {
            if (+res.code === 1) {
              ElMessage({
                message: '验证码发送成功',
                duration: 2 * 1000,
                customClass: 'copy-message',
                grouping: true
              });
              countDown.value = 60;
              timer = setInterval(() => {
                countDown.value--;
                if (+countDown.value === 0) {
                  clearInterval(timer);
                  timer = null;
                }
              }, 1000);
            }
          })
          .catch((err: any) => {
            ElMessage({
              message: err.msg || err.message,
              duration: 2 * 1000,
              customClass: 'copy-message',
              grouping: true
            });
          });
      }
    }

    onMounted(() => {
      toGetAvatarList();
    });

    return {
      userInfo,
      avatarList,
      defaultTeamLogo,
      userForm,
      userInfoRules,
      userSubmitForm,
      userRuleFormRef,
      showAvatar,
      boxHeight,
      setAvatarHandle,
      phoneHandling,
      editPhone,
      closeEditPhone,
      errMessage,
      countDown,
      sendCode
    };
  }
});
</script>

<style lang="scss" scoped>
.BasicInfo {
  width: 1050px;
  margin: 45px auto;
  display: flex;
  .phone-label {
    color: #c2c7d2;
    font-size: 19px;
    padding: 12px 8px;
    width: 100%;
    border-bottom: 1px solid rgba(83, 88, 101, 1);
    display: flex;
    justify-content: space-between;
    span:nth-child(2) {
      color: var(--aux-color);
      cursor: pointer;
      font-weight: 400;
    }
  }
  .closeEditPhone {
    padding: 0 22px;
    height: 40px;
    line-height: 40px;
    margin-top: 70px;
    border-color: #ee9e01;
    border-radius: 8px;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    transform: translateX(96px);
  }
  .avatar-box {
    width: 100%;
    height: 0;
    display: flex;
    flex-wrap: wrap;
    transition: height 0.3s linear;
    overflow: hidden;
    .avatar-image {
      margin: 10px 32px 30px 6px;
      border: none;
      overflow: visible;
      position: relative;
      cursor: pointer;
      .el-image__inner {
        border-radius: 50% !important;
      }
    }
    .current-image {
      &:after {
        content: '';
        position: absolute;
        left: -5px;
        top: -5px;
        height: 70px;
        width: 70px;
        border: 2px solid var(--aux-color);
        border-radius: 50%;
      }
    }
  }
  .show-avatar-box {
    height: calc(var(--box-height) * 1px);
  }
  .show-avatar {
    flex-shrink: 0;
    width: 436px;
    display: flex;
    .user-name {
      font-family: PingFangSC-Regular, cursive;
      font-size: 24px;
      color: #c2c7d2;
      font-weight: 400;
      margin-left: 24px;
      .change-bar {
        display: inline-block;
        background: var(--aux-color);
        border-radius: 13px;
        height: 26px;
        width: auto;
        padding: 0 12px;
        font-size: 14px;
        color: #ffffff;
        font-weight: 400;
        cursor: pointer;
        line-height: 26px;
        margin-top: 12px;
        &:hover {
          box-shadow: 12px 12px 24px #ffffff30 inset;
        }
        &:active {
          box-shadow: 12px 12px 24px #ffffff60 inset;
        }
      }
    }
  }
  .show-info {
    flex-grow: 1;
  }
  //noinspection CssInvalidPseudoSelector
  :deep(.el-image) {
    border-radius: 50px;
    border: 2px solid var(--aux-color);
    .el-image__inner {
      border-radius: 50%;
    }
  }

  .form {
    margin-top: 30px;
    width: 400px;
    .form-error-info {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      span {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #ef5040;
        letter-spacing: 0;
        font-weight: 400;
      }
      .icon-remind {
        width: 16px;
        height: 16px;
      }
    }
    :deep(.el-form-item__label) {
      font-family: PingFangSC-Medium;
      height: 40px;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 600;
    }
    :deep(.el-input__wrapper) {
      width: 100% !important;
      height: 56px !important;
      background-color: transparent;
      box-shadow: 0 1px 0 rgba(83, 88, 101, 1);
      border-radius: 0;
    }
    :deep(.el-form-item.is-error .el-input__wrapper) {
      box-shadow: 0 1px 0 #f56c6c;
      border-radius: 0;
    }
    :deep(.el-input__inner) {
      font-family: PingFangSC-Regular, cursive;
      font-size: 18px;
      color: #c2c7d2;
    }
    :deep(.el-button--primary) {
      width: 314px;
      height: 40px;
      margin-top: 70px;
      background: #ee9e01;
      border-color: #ee9e01;
      border-radius: 8px;
      font-size: 16px;
      color: #fff;
    }
    ::placeholder {
      font-size: 14px;
      color: #535865;
      letter-spacing: 0;
      font-weight: 400;
    }
    .forgot-password {
      display: flex;
      justify-content: flex-end;
      font-size: 14px;
      color: #ee9e01;
      letter-spacing: 0;
      font-weight: 500;
      line-height: 30px;
      cursor: pointer;
    }
    :deep(.el-date-editor) {
      width: 100%;
      &.el-input,
      &.el-input__wrapper {
        height: unset !important;
      }
      .el-input,
      .el-input__wrapper {
        width: 100% !important;
        height: 56px !important;
        .el-input__prefix {
          display: none;
        }
      }
    }
    :deep(.el-input-group__append) {
      position: absolute;
      right: 0;
      background-color: transparent;
      box-shadow: none;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ee9e01;
      letter-spacing: 0;
      font-weight: 400;
      cursor: pointer;
    }
  }
}
</style>
