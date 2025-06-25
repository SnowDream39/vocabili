<template>
  <div class="w-full h-[200px] flex justify-center items-center">
    <button class="w-30 h-10 my-4 bg-blue-500 dark:bg-blue-700 rounded-2 flex justify-center items-center text-white" @click="router.push('/admin/comment')">
      Comment
    </button>
    <button class="w-30 h-10 my-4 bg-blue-500 dark:bg-blue-700 rounded-2 flex justify-center items-center text-white" @click="router.push('/admin/user')">
      User
    </button>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';

</script>
