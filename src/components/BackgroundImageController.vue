<template>
  <div id="background-image-controller">
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
var verticalPicture: string;
var horizontalPicture: string;
var currentImageSetName = ref<string>("daidou");
var currentMode: "vertical" | "horizontal" = "vertical"
const imageSets = ref<{ [key: string]: any}>({});

/** 返回"url(...)"的形式
 * */ 
function selectRandomPicture(pictures: string[]) {
  const originalPicture = pictures[Math.floor(Math.random() * pictures.length)]
  const picture = String(originalPicture).includes('/') ? originalPicture : `url("https://pixiv.re/${originalPicture}.jpg")` // 默认是pixiv id，也可以输入别的
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
  horizontalPicture = selectRandomPicture(data.horizontalPictures)
  changePicture()
}

function changePicture() {
  const body = document.body;
  if (currentMode === "vertical") {
    body.style.backgroundImage = verticalPicture;
    localStorage.setItem("verticalPicture", verticalPicture)
  } else {
    body.style.backgroundImage = horizontalPicture;
  }
  console.log("已切换背景图片");
}

function resize() {
  const newMode = window.innerWidth < innerHeight ? "vertical" : "horizontal"
  if (newMode !== currentMode) {
    currentMode = newMode
    changePicture()
  }
}

loadImageSets()

onMounted(async () => {
  currentImageSetName.value = localStorage.getItem("backgroundImageSetName") ?? "vocaloid-daidou";
  await loadImageSets()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  localStorage.setItem('backgroundImageSetName', currentImageSetName.value);
})
</script>

<style lang="scss" scoped>
div#background-image-controller {
  width: 400px;
  max-width: 100%;
  display: flex;
}
</style>