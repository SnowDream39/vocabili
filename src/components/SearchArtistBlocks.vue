<template>    
  <div class="artists-container shadow-box">
    <el-button 
      v-for="artist in data"
      @click="handleDetail(type, artist.id)"
    >{{ artist.name }}</el-button>
  </div>
</template>

<script lang="ts" setup>

defineProps(['type','data','loading'])


const handleDetail = (type: string, id: string) => {
  const fullUrl = window.location.origin + `/artist/${type}/` + id;
  window.open(fullUrl, '_blank');
}


</script>

<style scoped>
.artists-container {
  z-index: 1;
  width: min(450px, 90%);
  padding: 30px 20px;


  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;

}

:deep(.el-button+.el-button) {
  margin-left: 0;
}
</style>