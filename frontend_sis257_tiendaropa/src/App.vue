<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'
import ToastNotification from './components/ToastNotification.vue'

const route = useRoute()

// Páginas donde NO se muestra el header
const hideHeader = computed(() => {
  const pagesWithoutHeader = ['/login', '/register', '/dashboard', '/categorias', '/colores', '/productos', '/clientes', '/ventas', '/checkout', '/no-autorizado', '/cuenta']
  return pagesWithoutHeader.some(page => route.path.startsWith(page))
})

// Páginas donde NO se muestra el footer
const hideFooter = computed(() => {
  const pagesWithoutFooter = ['/login', '/register', '/dashboard', '/categorias', '/colores', '/productos', '/clientes', '/ventas', '/checkout', '/no-autorizado', '/cuenta']
  return pagesWithoutFooter.some(page => route.path.startsWith(page))
})
</script>

<template>
  <MainHeader v-if="!hideHeader" />
  <main class="main" id="top">
    <RouterView />
  </main>
  <MainFooter v-if="!hideFooter" />

  <!-- Toast Notification Global -->
  <ToastNotification />
</template>

<style>
@import '/src/assets/css/theme.css';

html {
  scroll-behavior: smooth;
}

body {
  font-family: "Jost", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
