<script setup>
import { onMounted, ref } from 'vue'
import Accueil from './components/Accueil.vue';

</script>

<template>
  <router-view></router-view>
</template>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

:deep(.accueil-root) {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
}
</style>