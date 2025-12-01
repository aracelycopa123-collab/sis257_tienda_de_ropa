<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCarritoStore } from '@/stores'

const carritoStore = useCarritoStore()
const mostrarToast = ref(false)
const mensaje = ref('')

let timeoutId: number | null = null

watch(() => carritoStore.items.length, (newLength, oldLength) => {
  if (newLength > oldLength) {
    mensaje.value = 'Producto agregado al carrito'
    mostrarToast.value = true
    
    if (timeoutId) clearTimeout(timeoutId)
    
    timeoutId = window.setTimeout(() => {
      mostrarToast.value = false
    }, 3000)
  }
})
</script>

<template>
  <Transition name="toast">
    <div v-if="mostrarToast" class="toast-notification">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <span>{{ mensaje }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.toast-notification {
  position: fixed;
  top: 80px;
  right: 30px;
  background: #000000;
  color: #ffffff;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10000;
  font-size: 0.875rem;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-notification svg {
  flex-shrink: 0;
}

/* Toast Animation */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .toast-notification {
    top: 70px;
    right: 20px;
    left: 20px;
    font-size: 0.8125rem;
    padding: 14px 20px;
  }
}
</style>
