<template>
  <div class="wrapper bg-blue-800 w-full h-screen flex">
    <div class="w-4/6 h-5/6 bg-white m-auto flex rounded-xl">
      <div class="w-1/2 h-full flex">
        <img
          class="m-auto w-5/6"
          src="https://assets.topdev.vn/images/2021/05/19/6764a7070cdc6a69bd1f6b4f588871a7-SqYcD.png"
          alt="blueco logo"
        />
      </div>
      <div class="w-1/2 h-full flex">
        <div class="w-4/6 m-auto">
          <h1 class="font-bold text-4xl">BLUECO GLOBAL</h1>
          <h2 class="font-medium text-2xl mb-10">Ứng dụng quản lý công việc</h2>
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DefaultLogin',
})
</script>
