<template>
  <div class="retrieve-password">
    <div class="retrieve-password-header">
      <svg-icon name="last_more" @click.stop="showRegister(1)"></svg-icon>
    </div>
    <div class="retrieve-password-main">
      <div class="title">找回密码</div>
      <div class="subtitle">
        <span>新用户？</span>
        <span @click="showRegister(2)">创建账号</span>
      </div>
      <div class="form">
        <el-form
          ref="retrievePasswordRuleFormRef"
          :model="retrievePasswordRuleForm"
          :rules="retrievePasswordRules"
          label-width="120px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item label="账号" prop="phone">
            <el-input
              v-model="retrievePasswordRuleForm.phone"
              placeholder="请输入手机号/用户名"
              type="text"
              maxlength="11"
            />
            <template #error>
              <div class="form-error-info">
                <span>{{ accountError }}</span>
                <svg-icon name="remind"></svg-icon>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="设置新密码" prop="password_new">
            <el-input
              v-model="retrievePasswordRuleForm.password_new"
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
          <el-form-item label="确认密码" prop="password_confirm">
            <el-input
              v-model="retrievePasswordRuleForm.password_confirm"
              placeholder="请输入6-20位数字或英文"
              type="password"
              show-password
              maxlength="20"
            />
            <template #error>
              <div class="form-error-info">
                <span>{{ confirmPasswordError }}</span>
                <svg-icon name="remind"></svg-icon>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="验证码" prop="captcha_code">
            <el-input
              v-model="retrievePasswordRuleForm.captcha_code"
              placeholder="请输入短信验证码"
              type="text"
              maxlength="6"
            >
              <template #append>
                <div v-if="!countDown" @click="registerSendCode">获取验证码</div>
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
              :loading="retrievePasswordLoading"
              :disabled="retrievePasswordLoading"
              @click="retrievePasswordSubmitForm(retrievePasswordRuleFormRef)"
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
import { defineComponent, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { ElMessage } from 'element-plus';
import { getPhoneCode } from '@/api/register';
import { findPassword } from '@/api/retrieve-password';
import popUpsMittBusHook from '@/hooks/PopUpsMittBusHook';

export default defineComponent({
  name: 'LoginBox',
  props: {},
  components: { SvgIcon },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const retrievePasswordRuleFormRef = ref(null);
    const countDown = ref(0);
    const accountError = ref('');
    const newPasswordError = ref('');
    const confirmPasswordError = ref('');
    const codeError = ref('');
    const retrievePasswordLoading = ref(false);
    function onShowPopUps(bool: boolean) {
      proxy.mittBus.emit('closeUserInfoPage', bool);
    }
    /**
     * 账号验证
     */
    const validateAccount = (rule: any, value: any, callback: any) => {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (value === '') {
        accountError.value = '请输入账号';
        callback(new Error(accountError.value));
      } else if (!reg.test(value)) {
        accountError.value = '请输入正确的手机号';
        callback(new Error(accountError.value));
      } else {
        callback();
      }
    };
    /**
     * 密码验证
     */
    const validatePassword = (rule: any, value: any, callback: any) => {
      const reg = /(\w)*(\w)\2{2}(\w)*/g;
      const reg1 = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
      const reg2 = /^(?!.*([!-~])\1{2,})(?!.*(?:012|210|123|321|234|432|345|543|456|654|567|765|678|876|789|987)).+$/i;
      if (value === '') {
        newPasswordError.value = '请输入新密码';
        callback(new Error(newPasswordError.value));
      } else if (reg.test(value)) {
        newPasswordError.value = '密码不可使用超过3个相同的字母或数字';
        callback(new Error(newPasswordError.value));
      } else if (!reg1.test(value)) {
        newPasswordError.value = '密码必须包含字母和数字';
        callback(new Error(newPasswordError.value));
      } else if (retrievePasswordRuleForm.phone && value.indexOf(retrievePasswordRuleForm.phone) !== -1) {
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
     * 确认密码验证
     */
    const validateConfirmPassword = (rule: any, value: any, callback: any) => {
      const reg = /(\w)*(\w)\2{2}(\w)*/g;
      const reg1 = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
      const reg2 = /^(?!.*([!-~])\1{2,})(?!.*(?:012|210|123|321|234|432|345|543|456|654|567|765|678|876|789|987)).+$/i;
      if (value === '') {
        confirmPasswordError.value = '请输入新密码';
        callback(new Error(confirmPasswordError.value));
      } else if (reg.test(value)) {
        confirmPasswordError.value = '密码不可使用超过3个相同的字母或数字';
        callback(new Error(confirmPasswordError.value));
      } else if (!reg1.test(value)) {
        confirmPasswordError.value = '密码必须包含字母和数字';
        callback(new Error(confirmPasswordError.value));
      } else if (retrievePasswordRuleForm.phone && value.indexOf(retrievePasswordRuleForm.phone) !== -1) {
        confirmPasswordError.value = '密码不可包含用户手机号';
        callback(new Error(confirmPasswordError.value));
      } else if (value.length < 6 || value.length > 20) {
        confirmPasswordError.value = '密码请输入6-20位数字和字母';
        callback(new Error(confirmPasswordError.value));
      } else if (!reg2.test(value)) {
        confirmPasswordError.value = '密码不可使用超过3个连续数字';
        callback(new Error(confirmPasswordError.value));
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
    const retrievePasswordRuleForm = reactive({
      phone: '',
      password_new: '',
      password_confirm: '',
      captcha_code: ''
    });
    /**
     * 表单验证字段
     */
    const retrievePasswordRules = reactive({
      phone: [{ validator: validateAccount, trigger: 'blur' }],
      password_new: [{ validator: validatePassword, trigger: 'blur' }],
      password_confirm: [{ validator: validateConfirmPassword, trigger: 'blur' }],
      captcha_code: [{ validator: validateCode, trigger: 'blur' }]
    });
    /**
     * 点击注册
     */
    const retrievePasswordSubmitForm = (formEl: any) => {
      if (!formEl) return;
      formEl.validate((valid: any) => {
        if (valid) {
          retrievePasswordLoading.value = true;
          if (retrievePasswordLoading.value) {
            findPassword(retrievePasswordRuleForm)
              .then((res: any) => {
                if (+res.code === 1) {
                  ElMessage({
                    message: '用户密码找回成功',
                    customClass: 'copy-message',
                    grouping: true
                  });
                  proxy.mittBus.emit('showRegisterDialog', 1);
                }
                retrievePasswordLoading.value = false;
              })
              .catch((err: any) => {
                ElMessage({
                  message: err.msg || err.message,
                  customClass: 'copy-message',
                  grouping: true
                });
                retrievePasswordLoading.value = false;
              });
          }
        } else {
          return false;
        }
      });
    };
    let timer: any = null;
    const registerSendCode = async () => {
      if (!retrievePasswordRuleForm.phone) return ElMessage.error('请输入正确的手机号');
      await getPhoneCode({ phone: retrievePasswordRuleForm.phone })
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
    /**
     * 打开注册
     */
    const showRegister = (index: number) => {
      proxy.mittBus.emit('showRegisterDialog', index);
    };
    onMounted(() => {});
    return {
      retrievePasswordRuleForm,
      retrievePasswordRules,
      retrievePasswordSubmitForm,
      retrievePasswordRuleFormRef,
      onShowPopUps,
      showRegister,
      registerSendCode,
      countDown,
      accountError,
      newPasswordError,
      confirmPasswordError,
      codeError,
      retrievePasswordLoading
    };
  }
});
</script>

<style lang="scss" scoped>
.retrieve-password {
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
    margin: 140px auto 0;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    .title {
      font-size: 38px;
      color: #ffffff;
      letter-spacing: 0;
    }
    .subtitle {
      line-height: 54px;
      font-size: 16px;
      letter-spacing: 0;
      font-weight: 400;
      color: #fff;
      span:nth-child(2) {
        margin-left: 12px;
        color: #ee9e01;
        cursor: pointer;
      }
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
