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
    <button id="background-image-refresh-button" class="btn-primary" @click="refreshPicture">随机图片</button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import { useBgManager } from '@/plugins/BackgroundImagePlugin'
import { getImageSet, getImageSets } from '@/utils/api/image';

const bgManager = useBgManager()
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
  bgManager.setPicture()
}

onMounted(async () => {
  currentImageSetName.value = localStorage.getItem("backgroundImageSetName") ?? "vocaloid-daidou";
  await loadImageSets()
})

</script>

<style lang="scss" scoped>

</style>
