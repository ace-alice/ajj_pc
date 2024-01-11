<template>
  <div class="login-box">
    <div class="login-box-header">
      <svg-icon name="last_more" @click.stop="onShowPopUps(false)"></svg-icon>
    </div>
    <div class="login-box-main">
      <div class="title">登录</div>
      <div class="subtitle">
        <span>新用户？</span>
        <span @click.stop="showRegister">创建账户</span>
      </div>
      <div class="form">
        <el-form
          ref="loginRuleFormRef"
          :model="loginRuleForm"
          :rules="loginRules"
          label-width="120px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item label="账号" prop="account">
            <el-input v-model="loginRuleForm.account" placeholder="请输入手机号/用户名" type="text" maxlength="32" />
            <template #error>
              <div class="form-error-info">
                <span>{{ accountError }}</span>
                <svg-icon name="remind"></svg-icon>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginRuleForm.password"
              placeholder="请输入密码"
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
            <el-input v-model="loginRuleForm.captcha_code" placeholder="请输入验证码" type="text" maxlength="4">
              <template #append>
                <el-image @click="getLoginCodeImg" :src="codeImage" class="login-code-image">
                  <template #placeholder>
                    <div class="image-slot">
                      <img :src="defaultLoginCodeImage" />
                    </div>
                  </template>
                  <template #error>
                    <div class="image-slot">
                      <img :src="defaultLoginCodeImage" />
                    </div>
                  </template>
                </el-image>
              </template>
            </el-input>
            <template #error>
              <div class="form-error-info">
                <span>{{ codeError }}</span>
                <svg-icon name="remind"></svg-icon>
              </div>
            </template>
          </el-form-item>
          <div class="forgot-password">
            <span @click.stop="showRetrievePassword">忘记密码</span>
          </div>
          <el-form-item>
            <el-button
              type="primary"
              :loading="loginLoading"
              :disabled="loginLoading"
              @click="loginSubmitForm(loginRuleFormRef)"
            >
              登录
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
import { login, getPersonalInfo, loginCodeImg } from '@/api/login';
import store from '@/store';
import defaultImageHook from '@/hooks/defaultImageHook';

export default defineComponent({
  name: 'LoginBox',
  props: {},
  components: { SvgIcon },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const loginRuleFormRef = ref(null);
    const accountError = ref('');
    const passwordError = ref('');
    const codeError = ref('');
    const codeId = ref('');
    const codeImage = ref('');
    const loginLoading = ref(false);
    const { defaultLoginCodeImage } = defaultImageHook();
    // const { onShowPopUps, showPopUps } = popUpsMittBusHook('closeLoginPage', [], '');

    function onShowPopUps(bool: boolean) {
      proxy.mittBus.emit('closeUserInfoPage', bool);
    }
    /**
     * 账号验证
     */
    const validateAccount = (rule: any, value: any, callback: any) => {
      if (value === '') {
        accountError.value = '请输入账号';
        callback(new Error(accountError.value));
      } else if (value.length < 6 || value.length > 32) {
        accountError.value = '账号请输入6-32位手机号/用户名';
        callback(new Error(accountError.value));
      } else {
        callback();
      }
    };
    /**
     * 密码验证
     */
    const validatePassword = (rule: any, value: any, callback: any) => {
      if (value === '') {
        passwordError.value = '请输入密码';
        callback(new Error(passwordError.value));
      } else if (value.length < 6 || value.length > 20) {
        passwordError.value = '密码请输入6-20位数字和字母';
        callback(new Error(passwordError.value));
      } else {
        callback();
      }
    };
    /**
     * 图形验证码
     */
    const validateCode = (rule: any, value: any, callback: any) => {
      if (value === '') {
        codeError.value = '请输入验证码';
        callback(new Error(codeError.value));
      } else {
        callback();
      }
    };
    /**
     * 登录from表单
     */
    const loginRuleForm = reactive({
      account: '',
      password: '',
      captcha_code: '',
      captcha_id: ''
    });
    /**
     * 表单验证字段
     */
    const loginRules = reactive({
      account: [{ validator: validateAccount, trigger: 'blur' }],
      password: [{ validator: validatePassword, trigger: 'blur' }],
      captcha_code: [{ validator: validateCode, trigger: 'blur' }]
    });
    /**
     * 点击登录
     */
    const loginSubmitForm = (formEl: any) => {
      if (!formEl) return;
      formEl.validate((valid: any) => {
        if (valid) {
          loginLoading.value = true;
          if (loginLoading.value) {
            // loginRuleForm.captcha_code = codeId.value;
            loginRuleForm.captcha_id = codeId.value;
            login(loginRuleForm)
              .then((res: any) => {
                if (+res.code === 1) {
                  store.commit('user/SET_TOKEN', res.data.token);
                  loginSuccess();
                  onShowPopUps(false);
                }
                loginLoading.value = false;
              })
              .catch((err: any) => {
                ElMessage({
                  message: err.msg || err.message,
                  customClass: 'copy-message',
                  duration: 2 * 1000,
                  grouping: true
                });
                loginLoading.value = false;
              });
          }
        } else {
          return false;
        }
      });
    };
    /**
     * 登录成功后
     */
    const loginSuccess = async () => {
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
    /**
     * 获取图形验证码
     */
    const getLoginCodeImg = () => {
      loginCodeImg()
        .then((res: any) => {
          if (+res.code === 1) {
            codeImage.value = res.data.captcha_src ? res.data.captcha_src : defaultLoginCodeImage;
            codeId.value = res.data.captcha_id;
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
    const showRegister = () => {
      proxy.mittBus.emit('showRegisterDialog', 2);
    };
    /**
     * 打开找回密码
     */
    const showRetrievePassword = () => {
      proxy.mittBus.emit('showRegisterDialog', 3);
    };
    onMounted(() => {
      getLoginCodeImg();
    });
    return {
      loginRuleForm,
      loginRules,
      loginSubmitForm,
      loginRuleFormRef,
      loginSuccess,
      onShowPopUps,
      showRegister,
      showRetrievePassword,
      accountError,
      passwordError,
      codeError,
      loginLoading,
      defaultLoginCodeImage,
      getLoginCodeImg,
      codeId,
      codeImage
    };
  }
});
</script>

<style lang="scss" scoped>
.login-box {
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
        span {
          cursor: pointer;
        }
      }
      :deep(.el-input-group__append) {
        position: absolute;
        right: -20px;
        background-color: transparent;
        box-shadow: none;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #ee9e01;
        letter-spacing: 0;
        font-weight: 400;
      }
      .login-code-image {
        height: 28px;
        cursor: pointer;
      }
    }
  }
}
</style>
