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
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ElSelect, ElOption, ElButton } from 'element-plus';
import { bgManager } from '@/main';

var verticalPicture: string;
var horizontalPicture: string;
var currentImageSetName = ref<string>("daidou");
const imageSets = ref<{ [key: string]: any}>({});

/** 返回"url(...)"的形式
 * */
function selectRandomPicture(pictures: string[]) {
  const originalPicture = pictures[Math.floor(Math.random() * pictures.length)]
  const picture = String(originalPicture).includes('/') ? originalPicture : `url("https://h.pixiv.ddns-ip.net/${originalPicture}")` // 默认是pixiv id，也可以输入别的
  return picture
}

async function loadImageSets() {
  let response = await fetch("/image-api/list.json");
  let filesList = await response.json();
  for (let filename of filesList) {
    const response = await fetch(`image-api/${filename}.json`);
    const data = await response.json();
    imageSets.value[filename] = data;
  }
}

function refreshPicture() {
  const data = imageSets.value[currentImageSetName.value]
  verticalPicture = selectRandomPicture(data.verticalPictures)
  localStorage.setItem("verticalPicture", verticalPicture)
  horizontalPicture = selectRandomPicture(data.horizontalPictures)
  localStorage.setItem("horizontalPicture", horizontalPicture)
  bgManager.refreshPicture()
}

loadImageSets()

onMounted(async () => {
  currentImageSetName.value = localStorage.getItem("backgroundImageSetName") ?? "vocaloid-daidou";
  await loadImageSets()
})

onBeforeUnmount(() => {
  localStorage.setItem('backgroundImageSetName', currentImageSetName.value);
})
</script>

<style lang="scss" scoped>

</style>
