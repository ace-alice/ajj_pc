<template>
  <div class="register-box">
    <div class="register-box-header">
      <svg-icon name="last_more" @click.stop="onShowPopUps(false)"></svg-icon>
    </div>
    <div class="register-box-main">
      <div class="welcome">Welcome</div>
      <div class="title">创建账户</div>
      <div class="subtitle">
        <span>已经有账户？</span>
        <span @click="showLogin">登录</span>
      </div>
      <div class="form">
        <el-form
          ref="registerRuleFormRef"
          :model="registerRuleForm"
          :rules="registerRules"
          label-width="120px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerRuleForm.username"
              placeholder="请输入6-32位数字和英文"
              type="text"
              maxlength="32"
            />
            <template #error>
              <div class="form-error-info">
                <span>{{ usernameError }}</span>
                <svg-icon name="remind"></svg-icon>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="registerRuleForm.phone" placeholder="请输入手机号" type="text" maxlength="11" />
            <template #error>
              <div class="form-error-info">
                <span>{{ phoneError }}</span>
                <svg-icon name="remind"></svg-icon>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="密码设置" prop="password">
            <el-input
              v-model="registerRuleForm.password"
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
          <el-form-item label="验证码" prop="captcha_code">
            <el-input v-model="registerRuleForm.captcha_code" placeholder="请输入短信验证码" type="text" maxlength="6">
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
          <el-form-item label="推广码" prop="invitation_code">
            <el-input
              v-model="registerRuleForm.invitation_code"
              placeholder="请输入推广码（非必填）"
              type="text"
              autocomplete="off"
            />
          </el-form-item>
          <div class="form-checkbox">
            <el-checkbox v-model="registerCheck" size="large" />
            <div class="form-checkbox-info">
              我已阅读并同意
              <span>服务条款</span>
              和
              <span>隐私政策</span>
            </div>
          </div>
          <el-form-item>
            <el-button
              type="primary"
              :loading="registerLoading"
              :disabled="registerLoading || !registerCheck"
              @click="registerSubmitForm(registerRuleFormRef)"
            >
              创建账户
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
import { getPersonalInfo } from '@/api/login';
import { phoneRegister, registerPhoneCaptcha } from '@/api/register';
import store from '@/store';
import { useRoute } from 'vue-router';
import { getLocal } from '@/utils/storage';

export default defineComponent({
  name: 'LoginBox',
  props: {},
  components: { SvgIcon },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const registerRuleFormRef = ref(null);
    const countDown = ref(0);
    const usernameError = ref('');
    const phoneError = ref('');
    const passwordError = ref('');
    const codeError = ref('');
    const registerLoading = ref(false);
    const registerCheck = ref(false);
    const route = useRoute();

    function onShowPopUps(bool: boolean) {
      proxy.mittBus.emit('closeUserInfoPage', bool);
    }

    /**
     * 账号验证
     */
    const validateAccount = (rule: any, value: any, callback: any) => {
      const reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,32}$/;
      if (value === '') {
        usernameError.value = '请输入账号';
        callback(new Error(usernameError.value));
      } else if (!reg.test(value)) {
        usernameError.value = '账号请输入6-32位手机号/用户名';
        callback(new Error(usernameError.value));
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
        passwordError.value = '请输入密码';
        callback(new Error(passwordError.value));
      } else if (reg.test(value)) {
        passwordError.value = '密码不可使用超过3个相同的字母或数字';
        callback(new Error(passwordError.value));
      } else if (!reg1.test(value)) {
        passwordError.value = '密码必须包含字母和数字';
        callback(new Error(passwordError.value));
      } else if (registerRuleForm.phone && value.indexOf(registerRuleForm.phone) !== -1) {
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
    let registerRuleForm = reactive({
      username: '',
      phone: '',
      password: '',
      captcha_code: '',
      invitation_code: ''
    });
    /**
     * 表单验证字段
     */
    const registerRules = reactive({
      username: [{ validator: validateAccount, trigger: 'blur' }],
      password: [{ validator: validatePassword, trigger: 'blur' }],
      phone: [{ validator: validatePhone, trigger: 'blur' }],
      captcha_code: [{ validator: validateCode, trigger: 'blur' }]
    });
    /**
     * 点击注册
     */
    const registerSubmitForm = (formEl: any) => {
      if (!formEl) return;
      formEl.validate((valid: any) => {
        if (valid) {
          registerLoading.value = true;
          if (registerLoading.value) {
            if (route.query.invite_id) {
              const params = {
                invite_id: route.query.invite_id
              };
              registerRuleForm = { ...registerRuleForm, ...params };
            }
            if (route.query.code || getLocal('code')) {
              const params = {
                code: route.query.code || getLocal('code')
              };
              registerRuleForm = { ...registerRuleForm, ...params };
            }
            phoneRegister(registerRuleForm)
              .then((res: any) => {
                if (+res.code === 1) {
                  store.commit('user/SET_TOKEN', res.data.token);
                  ElMessage({
                    message: '注册成功',
                    duration: 2 * 1000,
                    customClass: 'copy-message',
                    grouping: true
                  });
                  registerSuccess();
                  // onShowPopUps(false);
                }
                registerLoading.value = false;
              })
              .catch((err: any) => {
                ElMessage({
                  message: err.msg || err.message,
                  customClass: 'copy-message',
                  duration: 2 * 1000,
                  grouping: true
                });
                registerLoading.value = false;
              });
          }
        } else {
          return false;
        }
      });
    };
    /**
     * 注册成功后
     */
    const registerSuccess = async () => {
      const { data, code }: any = await getPersonalInfo();
      if (+code === 1) {
        store.commit('user/SET_USER_INFO', data);
        ElMessage({
          message: '登录成功',
          customClass: 'copy-message',
          duration: 2 * 1000,
          grouping: true
        });
      }
    };
    let timer: any = null;
    const registerSendCode = async () => {
      if (registerRuleForm.phone === '') return ElMessage.error('请输入手机号码');
      await registerPhoneCaptcha({ phone: registerRuleForm.phone })
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
     * 打开登录
     */
    const showLogin = () => {
      proxy.mittBus.emit('showRegisterDialog', 1);
    };
    onMounted(() => {});
    return {
      registerRuleForm,
      registerRules,
      registerSubmitForm,
      registerRuleFormRef,
      registerSuccess,
      onShowPopUps,
      showLogin,
      registerSendCode,
      countDown,
      usernameError,
      phoneError,
      passwordError,
      codeError,
      registerLoading,
      registerCheck
    };
  }
});
</script>

<style lang="scss" scoped>
.register-box {
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
    margin: 30px auto;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    .welcome {
      font-size: 38px;
      color: #ee9e01;
      letter-spacing: 0;
    }
    .title {
      margin-top: 20px;
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
      .form-checkbox {
        display: flex;
        align-items: center;
        :deep(.el-checkbox.el-checkbox--large .el-checkbox__inner) {
          width: 18px;
          height: 18px;
          background-color: transparent;
          border: 1px solid rgba(194, 199, 210, 1);
        }
        :deep(.is-checked.el-checkbox--large .el-checkbox__inner) {
          background-color: #ee9e01;
          border-color: #ee9e01;
        }
        :deep(.el-checkbox__inner::after) {
          top: 3px;
          left: 6px;
          font-size: 20px;
        }
        &-info {
          display: flex;
          margin-left: 16px;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #c2c7d2;
          letter-spacing: 0;
          line-height: 20px;
          font-weight: 500;
          span {
            color: #ee9e01;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
