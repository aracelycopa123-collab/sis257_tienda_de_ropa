<script setup lang="ts">
import { useCarritoStore } from '@/stores'

const carritoStore = useCarritoStore()
</script>

<template>
  <button @click="carritoStore.abrirCarrito()" class="cart-widget">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>
    <Transition name="badge">
      <span v-if="carritoStore.cantidadTotal > 0" class="cart-badge">
        {{ carritoStore.cantidadTotal }}
      </span>
    </Transition>
  </button>
</template>

<style scoped>
.cart-widget {
  position: relative;
  background: none;
  border: none;
  color: #000000;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.cart-widget:hover {
  opacity: 0.6;
}

.cart-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #000000;
  color: #ffffff;
  font-size: 0.625rem;
  font-weight: 400;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

/* Badge Animation */
.badge-enter-active,
.badge-leave-active {
  transition: all 0.2s ease;
}

.badge-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.badge-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
