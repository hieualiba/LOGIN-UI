<template>
  <DefaultLogin>
    <p v-if="step === 4">
      Bạn đã thay đổi mật khẩu thành công. Click vào
      <router-link to="/login"> đây </router-link>
      để đăng nhập vào hệ thống.
    </p>
    <div v-else>
      <h2 class="font-semibold text-3xl">Quên mật khẩu</h2>
      <p class="mb-12">Vui lòng cung cấp các thông tin dưới đây để được cấp lại mật khẩu ?</p>
      <a-form
        :model="formState"
        :rules="rules"
        name="normal_login"
        class="login-form text-left"
        @finish="onFinish"
        @finish-failed="onFinishFailed"
      >
        <a-form-item
          label="Email"
          name="email"
          :rules="[{ required: true, type: 'email', message: 'Vui lòng nhập email của bạn!' }]"
        >
          <a-input v-model:value="formState.email">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <div v-if="step === 2">
          <a-form-item
            :rules="[{ required: true, message: 'Vui lòng nhập OTP!' }]"
            label="OTP"
            name="code"
            style="margin-bottom: 0"
          >
            <a-input-group compact>
              <a-input v-model:value="formState.code" />
              <a-button :disabled="!disabled" html-type="button" type="primary" @click="resendOtp"
                >Gửi lại</a-button
              >
            </a-input-group>
          </a-form-item>

          <a-statistic-countdown :value="deadline" format="mm:ss" @finish="countDown">
            <template #prefix>
              <span>Mã OTP sẽ hết hạn sau</span>
            </template>
            <template #suffix>
              <span>s</span>
            </template>
          </a-statistic-countdown>
        </div>

        <div v-if="step === 3">
          <a-form
            ref="formRef"
            name="custom-validation"
            :model="formState"
            :rules="rules"
            @finish="handleFinish"
            @finish-failed="handleFinishFailed"
          >
            <a-form-item has-feedback label="Password" name="pass">
              <a-input v-model:value="formState.pass" type="password" autocomplete="off" />
            </a-form-item>
            <a-form-item has-feedback label="Confirm" name="checkPass">
              <a-input v-model:value="formState.checkPass" type="password" autocomplete="off" />
            </a-form-item>
            <!-- <a-form-item>
              <a-button type="primary" html-type="submit">Submit</a-button>
            </a-form-item> -->
          </a-form>
        </div>

        <a-form-item>
          <a-button
            :disabled="disabled"
            type="primary"
            html-type="submit"
            class="login-form-button"
            :loading="loading"
          >
            {{ submitBtnName() }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </DefaultLogin>
</template>

<script lang="ts">
import DefaultLogin from '../../components/defaultLogin/index.vue'
import { defineComponent, reactive, ref } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
import { notification } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import axios from 'axios'

interface FormState {
  email: string
  code: string
  tokenOtp: string
  pass: string
  checkPass: string
  count: number
}

export default defineComponent({
  name: 'ForgotPassword',
  components: {
    DefaultLogin,
    UserOutlined,
  },
  setup() {
    const step = ref<number>(1)
    const deadline = ref(Date.now() + 1000 * 60 * 1.5)
    const disabled = ref<boolean>(false)
    const loading = ref<boolean>(false)
    const formRef = ref<FormInstance>()
    const formState = reactive<FormState>({
      email: '',
      code: '',
      tokenOtp: '',
      pass: '',
      checkPass: '',
      count: 5,
    })
    const nextStep = () => {
      step.value += 1
      if (step.value > 4) {
        step.value = 1
      }
    }
    const openNotificationWithIcon = (type: string) => {
      notification[type]({
        message: 'LỖI XÁC THỰC OTP',
        description: `Xác thực OTP thất bại! Bạn còn ${formState.count} lần nhập OTP. OTP sẽ hết hạn sau 1 phút 30 giây`,
        duration: 3,
      })
    }
    const submitBtnName = () => {
      /* if (step.value === 1) {
        return 'GỬI MÃ OTP'
      } else if (step.value === 2 || step.value === 3) {
        return 'XÁC NHẬN OTP'
      } else {
        return 'ĐỔI MẬT KHẨU'
      } */
      switch (step.value) {
        case 1:
          return 'GỬI MÃ OTP'
        case 2:
          return 'XÁC NHẬN OTP'
        case 3:
          return 'XÁC NHẬN OTP'
        case 4:
          return 'ĐỔI MẬT KHẨU'
        default:
          break
      }
    }
    // Lay OTP
    const sendOtpStep1 = async () => {
      loading.value = true
      //code nam
      await axios
        .get('/user/password/forgot?email=' + formState.email)
        .then((res) => {
          console.log(res)
          if (res.data) {
            localStorage.setItem('tokenOtp', res.data.token)
            step.value === 1 ? nextStep() : (step.value = 2)
          } else {
            alert('Co loi xay ra')
          }
          loading.value = false
        })
        .catch(() => alert('Có lỗi xảy ra. Vui lòng thử lại'))
      //code hung
      /* await axios.get('/user/password/forgot?email=' + formState.email).then((res) => {
        console.log(res)
        localStorage.setItem('tokenOtp', res.data)
      }) */
    }
    // gui OTP xac minh
    const sendOtpStep2 = async () => {
      formState.tokenOtp = localStorage.getItem('tokenOtp')
      //code nam
      await axios
        .post('/user/password/forgot/confirm', {
          otp: formState.code,
          token: formState.tokenOtp,
        })
        .then((res) => {
          console.log(res)
          if (res.data.token) {
            nextStep()
          } else {
            formState.count-- && openNotificationWithIcon('warning')
          }
        })
        .catch(() => alert('Có lỗi xảy ra. Vui lòng thử lại'))
      //code hung
      /* await axios
        .get(
          '/v1/users/authentificationotp?email=' + formState.email + '&otp=' + formState.code
        )
        .then((res) => {
          console.log(res)
          if (res.data) {
            nextStep()
          } else {
            formState.count-- && openNotificationWithIcon('warning')
          }
        }) */
    }
    // gui mat khau thay doi
    const sendOtpStep3 = async () => {
      formState.tokenOtp = localStorage.getItem('tokenOtp')
      //code nam
      await axios
        .post('/user/password/forgot/change', {
          confirmPassword: formState.checkPass,
          password: formState.pass,
          token: formState.tokenOtp,
        })
        .then((res) => {
          console.log(res)
          alert(res.data.message)
          nextStep()
        })
        .catch(() => alert('Có lỗi xảy ra. Vui lòng thử lại'))

      //code hung
      /* await axios
        .get(
          '/v1/users/resetPassword?token=' +
            formState.tokenOtp +
            '&email=' +
            formState.email +
            '&newPassword=' +
            formState.pass
        )
        .then((res) => {
          console.log(res)
        })
        .catch(() => alert('Có lỗi xảy ra. Vui lòng thử lại'))
      nextStep() */
    }
    // lay lai OTP
    const resendOtp = () => {
      console.log('gui lai otp')
      sendOtpStep1()
      disabled.value = false
      deadline.value = Date.now() + 1000 * 60 * 1.5
    }
    const countDown = () => {
      console.log('deadline')
      disabled.value = true
    }
    const onFinish = (values: FormState) => {
      console.log(step.value)
      switch (step.value) {
        case 1:
          sendOtpStep1()
          deadline.value = Date.now() + 1000 * 60 * 1.5
          break
        case 2:
          if (formState.count === 0) {
            alert('Đã hết số lần nhập')
            formState.count = 0
          } else {
            sendOtpStep2()
          }
          break
        case 3:
          sendOtpStep3()
          break
        default:
          break
      }
      console.log('Success:', values)
      console.log('OTP', formState.code)
    }
    const onFinishFailed = (errorInfo: unknown) => {
      console.log('Failed:', errorInfo)
    }
    let validateOtp = async (_rule: Rule, value: unknown) => {
      if (value === '') {
        return Promise.reject('Vui lòng nhập mã OTP')
      } else {
        return Promise.resolve()
      }
    }
    let validatePass = async (_rule: Rule, value: string) => {
      if (value === '') {
        return Promise.reject('vui lòng nhập mật khẩu')
      } else {
        if (formState.checkPass !== '') {
          formRef.value.validateFields('checkPass')
        }
        return Promise.resolve()
      }
    }
    let validatePass2 = async (_rule: Rule, value: string) => {
      if (value === '') {
        return Promise.reject('Vui lòng nhập lại mật khẩu')
      } else if (value !== formState.pass) {
        return Promise.reject('Mật khẩu nhập lại chưa chính xác')
      } else {
        return Promise.resolve()
      }
    }
    const rules: Record<string, Rule[]> = {
      pass: [{ required: true, validator: validatePass, trigger: 'change' }],
      checkPass: [{ required: true, validator: validatePass2, trigger: 'change' }],
      code: [{ required: true, validator: validateOtp, trigger: 'change' }],
    }
    const handleFinish = (values: FormState) => {
      console.log(values, formState)
    }
    const handleFinishFailed = (errors) => {
      console.log(errors)
    }
    return {
      step,
      formState,
      deadline,
      formRef,
      rules,
      disabled,
      loading,
      onFinish,
      onFinishFailed,
      nextStep,
      sendOtpStep1,
      sendOtpStep2,
      sendOtpStep3,
      resendOtp,
      countDown,
      handleFinishFailed,
      handleFinish,
      openNotificationWithIcon,
      submitBtnName,
    }
  },
})
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
.ant-input-group.ant-input-group-compact {
  display: flex;
}
.login-form-button {
  width: 90%;
  height: 2em;
  border-radius: 5px;
  display: block;
  margin: auto;
  font-size: 1.25em;
}
.ant-form-item-label {
  min-width: 84px;
  text-align: left;
}
.ant-statistic-content {
  font-size: 1em;
  text-align: center;
  margin: 12px 0;
}
</style>
