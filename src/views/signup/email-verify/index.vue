<template>
  <DefaultLogin>
    <h1 class="text-2xl mb-12">Xác thực tài khoản</h1>
    <!-- step 1 -->
    <div v-if="step === 1">
      <p>Tài khoản đang xác thực, vui lòng chờ trong giây lát</p>
    </div>
    <!-- step 2 -->
    <div v-if="step === 2">
      <p>
        Bạn xác thực tài khoản thành công. Click vào
        <router-link to="/login"> đây</router-link>
        để đăng nhập vào hệ thống.
      </p>
    </div>
    <div v-if="step === 3" class="text-left text-lg">
      Xác thực tài khoản thất bại
      <p class="text-red-600">*Lý do: Tài khoản này đã được xác thực.</p>
      <router-link to="/login" class="float-right mt-12 underline"
        ><i>Trở lại màn hình đăng nhập.</i></router-link
      >
    </div>
  </DefaultLogin>
</template>
<script lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import DefaultLogin from '../../../components/defaultLogin/index.vue'

export default {
  name: 'EmailVerify',
  components: {
    DefaultLogin,
  },
  setup() {
    const verify = ref<unknown>(0)
    const step = ref<number>(1)
    const emailVerify = async () => {
      /* const storageEmailToken = localStorage.getItem('tokenRegister') */
      await axios
        //code nam
        .get('/user/register/confirm?token=' + localStorage.getItem('tokenRegister'))
        .then((res) => {
          console.log(res)
          if (res.data) {
            console.log(res)
            return (verify.value = res.data.data.verifyEmail)
          } else {
            return (verify.value = 3)
          }
        })
        .catch(() => alert('Có lỗi xảy ra. Vui lòng thử lại'))
      console.log(verify.value)
      if (verify.value === 1) {
        step.value++
      }
      if (verify.value === 0) {
        alert('Xác thực thất bại!')
      }
      if (verify.value === 3) {
        step.value = 3
      }
    }
    return { verify, step, emailVerify }
  },
  created() {
    this.emailVerify()
  },
}
</script>
