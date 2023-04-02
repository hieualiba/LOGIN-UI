<template>
  <div class="signup">
    <h1>This is an home page</h1>
    <router-link to="/login">Login page</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomePage',
  setup() {
    const getUserData = async () => {
      console.log('lay ra user data')
    }
    return getUserData
  },
  created() {
    this.getUserData()
  },
})
</script>
