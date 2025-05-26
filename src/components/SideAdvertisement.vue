<template>

  <div class="side-container" id="left">
    <div class="image" @click="jumpToGenshin"></div>
  </div>
  <div class="side-container" id="right">
    <div class="image" @click="jumpToGenshin" ></div>
  </div>
</template>

<script lang="ts" setup>
function jumpToGenshin() {
  window.open("https://ys.mihoyo.com", "_blank")
}
</script>


<style lang="scss" scoped>

.side-container {
  position: fixed;
  z-index: 0;
  box-sizing: border-box;
  height: 100%; 
  display: flex;
  flex-direction: column;
  justify-content: center;

  .image {
    height: 400px;
    width: 200px;
    background-size: cover;
    background-position: center;
    cursor: pointer;
  }
}


div#left {
  left: 20px;
  .image {
    background-image: url('/promotion-image/Genshin1.webp');
  }
}

div#right {
  right: 20px;
  .image {
    background-image: url('/promotion-image/Genshin2.jpg');
  }
}

@media (max-width: 450px) {
  .side-container {
    display: none;
  }
}

</style>