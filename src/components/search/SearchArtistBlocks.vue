<template>
  <div class="artists-container suspend-panel">
    <button
      class="btn-primary"
      v-for="artist in data"
      @click="handleDetail(type, artist.id)"
    >{{ artist.name }}</button>
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

</style>
