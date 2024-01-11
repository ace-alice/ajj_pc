<template>
  <div class="update-account-box">
    <div class="update-account-box-header">
      <svg-icon name="last_more" @click.stop="settingClick"></svg-icon>
    </div>
    <div class="update-account-box-main">
      <div class="title">修改账户密码</div>
      <div class="form">
        <el-form
          ref="accountRuleFormRef"
          :model="accountRuleForm"
          :rules="accountRules"
          label-width="120px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item label="新密码" prop="password">
            <el-input
              v-model="accountRuleForm.password"
              placeholder="请输入6-20位数字或英文"
              type="password"
              show-password
              maxlength="20"
            />
            <template #error>
              <div class="form-error-info">
                <span>{{ passwordError }}</span>
                <svg-icon name="remind"></svg-icon>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="确认密码" prop="new_password">
            <el-input
              v-model="accountRuleForm.new_password"
              placeholder="请输入6-20位数字或英文"
              type="password"
              show-password
              maxlength="20"
            />
            <template #error>
              <div class="form-error-info">
                <span>{{ newPasswordError }}</span>
                <svg-icon name="remind"></svg-icon>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <template #default>
              <span class="account-phone">{{ phoneHandling(accountRuleForm.phone) }}</span>
            </template>
            <template #error>
              <div class="form-error-info">
                <span>{{ phoneError }}</span>
                <svg-icon name="remind"></svg-icon>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="验证码" prop="captcha_code">
            <el-input v-model="accountRuleForm.captcha_code" placeholder="请输入短信验证码" type="text" maxlength="6">
              <template #append>
                <div v-if="!countDown" @click="accountSendCode">获取验证码</div>
                <div v-else>
                  <span>{{ countDown }}s</span>后重新发送
                </div>
              </template>
            </el-input>
            <template #error>
              <div class="form-error-info">
                <span>{{ codeError }}</span>
                <svg-icon name="remind"></svg-icon>
              </div>
            </template>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="accountLoading"
              :disabled="accountLoading"
              @click="accountSubmitForm(accountRuleFormRef)"
            >
              确认
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, nextTick, onMounted, reactive, ref } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { ElMessage } from 'element-plus';
import { updateAccountPassword, pubCode } from '@/api/setting';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import store from '@/store';
import { removeLocal } from '@/utils/storage';

export default defineComponent({
  name: 'LoginBox',
  props: {},
  components: { SvgIcon },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const accountRuleFormRef = ref(null);
    const countDown = ref(0);
    const newPasswordError = ref('');
    const phoneError = ref('');
    const passwordError = ref('');
    const codeError = ref('');
    const accountLoading = ref(false);
    const store = useStore();
    const router = useRouter();
    const userInfo = computed(() => {
      return store.getters.getUserInfo;
    });

    function onShowPopUps(bool: boolean) {
      proxy.mittBus.emit('closeAccountSetting', bool);
    }

    /**
     * 密码验证
     */
    const validatePassword = (rule: any, value: any, callback: any) => {
      const reg = /(\w)*(\w)\2{2}(\w)*/g;
      const reg1 = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
      const reg2 = /^(?!.*([!-~])\1{2,})(?!.*(?:012|210|123|321|234|432|345|543|456|654|567|765|678|876|789|987)).+$/i;
      if (value === '') {
        passwordError.value = '请输入新密码';
        callback(new Error(passwordError.value));
      } else if (reg.test(value)) {
        passwordError.value = '密码不可使用超过3个相同的字母或数字';
        callback(new Error(passwordError.value));
      } else if (!reg1.test(value)) {
        passwordError.value = '密码必须包含字母和数字';
        callback(new Error(passwordError.value));
      } else if (accountRuleForm.phone && value.indexOf(accountRuleForm.phone) !== -1) {
        passwordError.value = '密码不可包含用户手机号';
        callback(new Error(passwordError.value));
      } else if (value.length < 6 || value.length > 20) {
        passwordError.value = '密码请输入6-20位数字和字母';
        callback(new Error(passwordError.value));
      } else if (!reg2.test(value)) {
        passwordError.value = '密码不可使用超过3个连续数字';
        callback(new Error(passwordError.value));
      } else {
        callback();
      }
    };
    const validateNewPassword = (rule: any, value: any, callback: any) => {
      const reg = /(\w)*(\w)\2{2}(\w)*/g;
      const reg1 = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
      const reg2 = /^(?!.*([!-~])\1{2,})(?!.*(?:012|210|123|321|234|432|345|543|456|654|567|765|678|876|789|987)).+$/i;
      if (value === '') {
        newPasswordError.value = '请输入确认密码';
        callback(new Error(newPasswordError.value));
      } else if (reg.test(value)) {
        newPasswordError.value = '密码不可使用超过3个相同的字母或数字';
        callback(new Error(newPasswordError.value));
      } else if (!reg1.test(value)) {
        newPasswordError.value = '密码必须包含字母和数字';
        callback(new Error(newPasswordError.value));
      } else if (accountRuleForm.phone && value.indexOf(accountRuleForm.phone) !== -1) {
        newPasswordError.value = '密码不可包含用户手机号';
        callback(new Error(newPasswordError.value));
      } else if (value.length < 6 || value.length > 20) {
        newPasswordError.value = '密码请输入6-20位数字和字母';
        callback(new Error(newPasswordError.value));
      } else if (!reg2.test(value)) {
        newPasswordError.value = '密码不可使用超过3个连续数字';
        callback(new Error(newPasswordError.value));
      } else {
        callback();
      }
    };
    /**
     * 手机号验证
     */
    const validatePhone = (rule: any, value: any, callback: any) => {
      const reg = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;
      if (value === '') {
        phoneError.value = '请输入手机号';
        callback(new Error(phoneError.value));
      } else if (!reg.test(value)) {
        phoneError.value = '请输入正确的手机号';
        callback(new Error(phoneError.value));
      } else {
        callback();
      }
    };
    /**
     * 验证码验证
     */
    const validateCode = (rule: any, value: any, callback: any) => {
      const reg = /^\d{6}$/;
      if (value === '') {
        codeError.value = '请输入验证码';
        callback(new Error(codeError.value));
      } else if (!reg.test(value)) {
        codeError.value = '请输入6位短信验证码';
        callback(new Error(codeError.value));
      } else {
        callback();
      }
    };
    /**
     * 注册from表单
     */
    const accountRuleForm = reactive({
      phone: '',
      password: '',
      new_password: '',
      captcha_code: ''
    });
    /**
     * 表单验证字段
     */
    const accountRules = reactive({
      password: [{ validator: validatePassword, trigger: 'blur' }],
      new_password: [{ validator: validateNewPassword, trigger: 'blur' }],
      phone: [{ validator: validatePhone, trigger: 'blur' }],
      captcha_code: [{ validator: validateCode, trigger: 'blur' }]
    });
    /**
     * 处理手机号
     */
    const phoneHandling = (row: string | number) => {
      let str = String(row);
      str = str.substring(0, 4) + '****' + str.substring(str.length - 4, str.length);
      return str;
    };
    /**
     * 修改用户密码
     */
    const accountSubmitForm = (formEl: any) => {
      if (!formEl) return;
      formEl.validate((valid: any) => {
        if (valid) {
          accountLoading.value = true;
          if (accountLoading.value) {
            updateAccountPassword(accountRuleForm)
              .then((res: any) => {
                if (+res.code === 1) {
                  ElMessage({
                    message: '账户密码修改成功',
                    customClass: 'copy-message',
                    duration: 2 * 1000,
                    grouping: true
                  });
                  onShowPopUps(false);
                  store.commit('user/REMOVE_TOKEN');
                  store.commit('user/REMOVE_USER_INFO');
                  removeLocal('userInfo');
                  removeLocal('token');
                  proxy.$refs['accountRuleFormRef'].resetFields();
                  router.push({ name: 'Home' });
                }
                accountLoading.value = false;
              })
              .catch((err: any) => {
                ElMessage({
                  message: err.msg || err.message,
                  customClass: 'copy-message',
                  duration: 2 * 1000,
                  grouping: true
                });
                accountLoading.value = false;
              });
          }
        } else {
          return false;
        }
      });
    };
    let timer: any = null;
    const accountSendCode = async () => {
      if (accountRuleForm.phone === '') return ElMessage.error('请输入手机号码');
      await pubCode()
        .then((res: any) => {
          if (+res.code === 1) {
            ElMessage({
              message: '验证码发送成功',
              customClass: 'copy-message',
              duration: 2 * 1000,
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
            customClass: 'copy-message',
            duration: 2 * 1000,
            grouping: true
          });
        });
    };
    const settingClick = () => {
      proxy.mittBus.emit('showSettingDialog', 1);
    };
    onMounted(() => {
      nextTick(() => {
        accountRuleForm.phone = userInfo.value.phone;
      });
    });
    return {
      userInfo,
      accountRuleForm,
      accountRules,
      accountSubmitForm,
      accountRuleFormRef,
      onShowPopUps,
      settingClick,
      accountSendCode,
      countDown,
      newPasswordError,
      phoneError,
      passwordError,
      codeError,
      accountLoading,
      phoneHandling
    };
  }
});
</script>

<style lang="scss" scoped>
.update-account-box {
  &-header {
    margin: 32px 0 0 66px;
    :deep(.icon-last_more) {
      width: 16px;
      height: 16px;
      opacity: 0.6;
      cursor: pointer;
    }
  }
  &-main {
    width: 390px;
    margin: 60px auto 0;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    .title {
      margin-top: 20px;
      font-size: 38px;
      color: #ffffff;
      letter-spacing: 0;
    }
    .form {
      margin-top: 30px;
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
      :deep(.account-phone) {
        width: 100%;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #535865;
        letter-spacing: 0;
        font-weight: 400;
        border-bottom: 1px solid rgba(83, 88, 101, 1);
      }
      :deep(.el-form-item__label) {
        font-family: PingFangSC-Medium;
        height: 40px;
        font-size: 16px;
        color: #c2c7d2;
        letter-spacing: 0;
        font-weight: 500;
      }
      :deep(.el-input__wrapper) {
        background-color: transparent;
        box-shadow: 0 1px 0 rgba(83, 88, 101, 1);
        border-radius: 0;
      }
      :deep(.el-form-item.is-error .el-input__wrapper) {
        box-shadow: 0 1px 0 #f56c6c;
        border-radius: 0;
      }
      :deep(.el-input__inner) {
        color: #fff;
      }
      :deep(.el-button--primary) {
        width: 100%;
        height: 54px;
        margin-top: 20px;
        background: #ee9e01;
        border-color: #ee9e01;
        border-radius: 8px;
        font-size: 16px;
        color: #fff;
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
    }
  }
}
</style>
