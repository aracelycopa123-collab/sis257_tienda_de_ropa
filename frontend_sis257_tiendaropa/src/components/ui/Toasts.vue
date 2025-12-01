<template>
  <div class="toasts-container" aria-live="polite">
    <transition-group name="toast" tag="div">
      <div v-for="t in toasts" :key="t.id" :class="['toast', t.type]">
        <div class="toast-message">{{ t.message }}</div>
        <button class="toast-close" @click="remove(t.id)">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Toast { id: number; message: string; type: string }
const toasts = ref<Toast[]>([])

function remove(id: number) {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
}

// expose globally for simple use
(window as any).__app_toasts = {
  push(message: string, type = 'info', timeout = 3500) {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    toasts.value.push({ id, message, type })
    if (timeout > 0) setTimeout(() => remove(id), timeout)
  }
}
</script>

<style scoped>
.toasts-container { position: fixed; right: 18px; bottom: 18px; z-index: 9999; display:flex; flex-direction:column; gap:8px }
.toast-enter-from, .toast-leave-to { opacity:0; transform: translateY(8px) }
.toast-enter-active, .toast-leave-active { transition: all 200ms ease }
.toast { background:#111; color:#fff; padding:10px 12px; border-radius:8px; min-width:200px; display:flex; align-items:center; justify-content:space-between; gap:8px }
.toast.info { background:#111 }
.toast.success { background:#2a9d8f }
.toast.error { background:#e63946 }
.toast-close { background:transparent; border:none; color:#fff; font-size:14px; cursor:pointer }
.toast-message { flex:1 }
</style>
