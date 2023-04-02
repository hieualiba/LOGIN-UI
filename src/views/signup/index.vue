<template>
  <DefaultLogin>
    <div v-if="step === 1">
      <!-- step 1 -->
      <h2 class="font-semibold text-3xl">Đăng ký</h2>
      <a-form
        ref="formRef"
        name="custom-validation"
        :model="formState"
        :rules="rules"
        v-bind="layout"
        @finish="handleFinish"
        @finish-failed="handleFinishFailed"
      >
        <a-form-item label="Email" name="email">
          <a-input v-model:value="formState.email">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item has-feedback label="Password" name="pass">
          <a-input v-model:value="formState.pass" type="password" autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="Confirm" name="checkPass">
          <a-input v-model:value="formState.checkPass" type="password" autocomplete="off" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit"> Submit </a-button>
          <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- step 2 -->
    <div v-if="step === 2">
      <p>
        Bạn đã yêu cầu đăng ký tài khoản thành công, vui lòng check lại email và xác nhận đăng ký!
      </p>
    </div>
    <!-- step 3 -->
    <div v-if="step === 3">
      <p>
        Bạn xác thực tài khoản thành công. Click vào
        <router-link to="/login"> đây</router-link>
        để đăng nhập vào hệ thống.
      </p>
    </div>
    <router-link to="/login" class="m-auto">Trở lại trang đăng nhập</router-link>
  </DefaultLogin>
</template>

<script lang="ts">
import DefaultLogin from '../../components/defaultLogin/index.vue'
import type { Rule } from 'ant-design-vue/es/form'
import { defineComponent, reactive, ref } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { UserOutlined } from '@ant-design/icons-vue'
import axios from 'axios'
interface FormState {
  email: string
  pass: string
  checkPass: string
}

export default defineComponent({
  name: 'SignUpPage',
  components: {
    DefaultLogin,
    UserOutlined,
  },
  setup() {
    const step = ref(1)
    const formRef = ref<FormInstance>()
    const formState = reactive<FormState>({
      email: '',
      pass: '',
      checkPass: '',
    })
    let validatePass = async (_rule: Rule, value: string) => {
      if (value === '') {
        return Promise.reject('Please input the password')
      } else {
        var lowerCaseLetters = /[a-z]/g
        var upperCaseLetters = /[A-Z]/g
        var numbers = /[0-9]/g
        var special = /\W/g
        var whiteSpace = /\s/g
        if (value.length < 8) {
          return Promise.reject('Mật khẩu phải có ít nhất 8 ký tự')
        }
        if (!value.match(lowerCaseLetters)) {
          return Promise.reject('Mật khẩu phải bao gồm chữ cái viết thường')
        }
        if (!value.match(upperCaseLetters)) {
          return Promise.reject('Mật khẩu phải bao gồm chữ cái viết hoa')
        }
        if (!value.match(numbers)) {
          return Promise.reject('Mật khẩu phải bao gồm chữ số')
        }
        if (!value.match(special)) {
          return Promise.reject('Mật khẩu phải bao gồm kí tự đặc biệt')
        }
        if (value.match(whiteSpace)) {
          return Promise.reject('Mật khẩu không được có dấu cách')
        }
        if (formState.checkPass !== '') {
          formRef.value.validateFields('checkPass')
        }
        return Promise.resolve()
      }
    }
    let validatePass2 = async (_rule: Rule, value: string) => {
      if (value === '') {
        return Promise.reject('Please input the password again')
      } else if (value !== formState.pass) {
        return Promise.reject("Two inputs don't match!")
      } else {
        return Promise.resolve()
      }
    }

    const rules: Record<string, Rule[]> = {
      email: [{ required: true, type: 'email', trigger: 'change' }],
      pass: [{ required: true, validator: validatePass, trigger: 'change' }],
      checkPass: [{ required: true, validator: validatePass2, trigger: 'change' }],
    }
    const layout = {
      labelCol: { span: 4 },
    }
    const handleFinish = async (values: FormState) => {
      console.log('value', values, formState)
      await axios
        .post('/user/register', {
          email: formState.email,
          password: formState.pass,
        })
        .then((res) => {
          step.value += 1
          if (step.value > 2) {
            step.value === 1
          }
          localStorage.setItem('tokenRegister', res.data.token)
        })
        .catch(() => alert('Có lỗi xảy ra. Vui lòng thử lại'))
    }
    const handleFinishFailed = (errors) => {
      console.log(errors)
    }
    const resetForm = () => {
      formRef.value.resetFields()
    }
    return {
      step,
      formState,
      formRef,
      rules,
      layout,
      handleFinishFailed,
      handleFinish,
      resetForm,
    }
  },
})
</script>
<style lang="scss">
.ant-form-item-label {
  min-width: 84px;
  text-align: start;
}
.ant-col-14 {
  max-width: 100%;
}
</style>
