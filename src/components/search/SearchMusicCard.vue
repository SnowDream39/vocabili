<template>
  <div class="producer_music_card dark:text-white">
    <div class="producer_music_card-info">
      <div class="producer_music_card-split">
        <div>{{ vocalist }}</div>
      </div>
      <div class="producer_music_card-center">
        <div class="producer_music_card-global-bold producer_music_card-title">{{ name }}</div>
      </div>
      <div class="producer_music_card-split">
        <div>{{ producer }}</div>
      </div>
    </div>
    <div class="producer_music_card-background">
      <div class="producer_music_card-background-mask" style="top: 0"><img :src="thumbnail" alt="thumbnail" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  producer: string;
  vocalist: string;
  name: string;
  thumbnail: string;
}>();

</script>

<style lang="scss" scoped>
.producer_music_card {
  display: inline-flex;
  position: relative;
  border-radius: 9px;
  margin: .5em 1em .5em 0;
  width: 330px;
  height: 8em;
  box-shadow: #454f54 5px 5px 7px -3px;
  overflow: hidden;
  flex: 0 0 auto;
  color: black;
  cursor: pointer;
}

.producer_music_card * {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: clip;
  white-space: nowrap;
}

.producer_music_card-title {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  font-size: 20px;
}

.producer_music_card-info {
  position: relative;
  z-index: 1;

  background: linear-gradient(to right, #eeeeee, #eeeeee80);

  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0.5em 1em 0.5em 1em;
  justify-content: space-around;
}

@media (prefer-color-scheme: dark) {
  .producer_music_card-info {
    background: linear-gradient(to right, #444444, #44444480);
  }
}

.producer_music_card-info-space {
  height: .75em;
}

.producer_music_card-global-bold {
  font-weight: bold;
}

.producer_music_card-split {
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.producer_music_card-center {
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.producer_music_card-note {
  font-size: 0.8em;
}

.producer_music_card-link {
  margin: 0 .25em;
}

.producer_music_card-link:last-child {
  margin: 0 .5em 0 .25em;
}

.producer_music_card-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  overflow: hidden;
  background: red;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.producer_music_card-background-mask {
  position: relative;
  min-width: 100%;
  min-height: 100%;
}

.producer_music_card-background-mask img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
