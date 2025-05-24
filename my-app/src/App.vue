<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Popup from './components/Popup.vue'

</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <popup class="popup" title="Nouvelle Vague" body="Trois artistes proposent, chacun à leur tour, leur langage visuel, leur sensibilité, leur savoir technique et… leur imaginaire. Tous ont envie de partager avec nous ces projections aussi courtes que denses. Elles s’enchaînent sous nos yeux et nous interpellent. Elles sont décalées, audacieuses, mouvementées ou délicates…" imagesrc="public/assets/test.png"></popup>
</template>

<style scoped>

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.popup:hover{
  will-change: filter;
  transition: filter 300ms;
  filter: drop-shadow(1px 1px  1em white);
}
</style>
