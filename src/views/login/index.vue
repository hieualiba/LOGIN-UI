<template>
  <DefaultLogin>
    <div>
      <h2 class="font-semibold text-3xl">Đăng nhập</h2>
      <p>
        Bạn chưa có tài khoản?
        <router-link to="/signup" href="" class="">Đăng ký tài khoản ngay!</router-link>
      </p>
      <a-form
        :model="formState"
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

        <a-form-item
          label="Mật khẩu"
          name="password"
          :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]"
        >
          <a-input-password v-model:value="formState.password">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-form-item name="remember" no-style>
            <a-checkbox v-model:checked="formState.remember">Duy trì đăng nhập</a-checkbox>
          </a-form-item>
          <router-link to="/forgot-password" class="login-form-forgot ml-20" href="#">
            Quên mật khẩu
          </router-link>
        </a-form-item>

        <a-form-item>
          <a-button
            :disabled="disabled"
            type="primary"
            html-type="submit"
            class="login-form-button"
          >
            Đăng nhập
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </DefaultLogin>
</template>

<script lang="ts">
import DefaultLogin from '../../components/defaultLogin/index.vue'
import { defineComponent, reactive, computed } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import axios from 'axios'
import router from '../../router/index'
interface FormState {
  email: string
  password: string
  remember: boolean
}

export default defineComponent({
  name: 'LoginPage',
  components: {
    DefaultLogin,
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const formState = reactive<FormState>({
      email: '',
      password: '',
      remember: true,
    })
    const onFinish = async (values: unknown) => {
      console.log('Success:', values)
      //code nam
      await axios
        .post('/user/login', {
          email: formState.email,
          password: formState.password,
        })
        .then((res) => {
          console.log(res.data)
          router.push('/')
          if (formState.remember) {
            localStorage.setItem('userToken', res.data.token)
          }
        })
        .catch(() => alert('Có lỗi xảy ra. Vui lòng thử lại'))
    }

    const onFinishFailed = (errorInfo: unknown) => {
      console.log('Failed:', errorInfo)
    }
    const disabled = computed(() => {
      return !(formState.email && formState.password)
    })
    return {
      formState,
      onFinish,
      onFinishFailed,
      disabled,
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
.ant-btn {
  width: 90%;
  height: 2em;
  border-radius: 5px;
  display: block;
  margin: auto;
  font-size: 1.5em;
}
.ant-form-item-label {
  min-width: 84px;
  text-align: left;
}
</style>
