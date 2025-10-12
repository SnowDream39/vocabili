<template>
  <div id="background-image-controller" class="w-[400px] max-w-8/9 flex flex-row items-center">
    <el-select
      v-model="currentImageSetName"
      id="background-image-selecter"
      placeholder="选择背景图片集"
      @change="refreshPicture"
    >
      <el-option
        v-for="(value, key) in imageSets"
        :key="key"
        :value="key"
        :label="value.name + ' by ' + value.contributor"
        :title="value.description"
      />
    </el-select>
    <el-button id="background-image-refresh-button" type="primary" @click="refreshPicture">随机图片</el-button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { ElSelect, ElOption, ElButton } from 'element-plus';
import { bgManager } from '@/main';
import { getImageSet, getImageSets } from '@/utils/api/image';

var currentImageSetName = ref<string>("vocaloid-daidou");
const imageSets = ref<{ [key: string]: any}>({});

async function loadImageSets() {
  let filesList = await getImageSets();
  for (let filename of filesList) {
    imageSets.value[filename] = await getImageSet(filename);
  }
}

async function refreshPicture() {
  if (currentImageSetName.value != bgManager.imageSet) {
    bgManager.imageSet = currentImageSetName.value
    localStorage.setItem("backgroundImageSetName", currentImageSetName.value)
    await bgManager.loadImageSet()
  }
  bgManager.refreshPicture()
}

onMounted(async () => {
  currentImageSetName.value = localStorage.getItem("backgroundImageSetName") ?? "vocaloid-daidou";
  await loadImageSets()
})

</script>

<style lang="scss" scoped>

</style>
