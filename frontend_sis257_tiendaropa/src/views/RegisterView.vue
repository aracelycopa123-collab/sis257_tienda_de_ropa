<template>
  <div class="container">
    <h2>Registro de cuenta</h2>
    <form @submit.prevent="submit">
      <div>
        <label>Usuario</label>
        <input v-model="form.nombreUsuario" required maxlength="15" />
      </div>
      <div>
        <label>Clave</label>
        <input type="password" v-model="form.clave" required />
      </div>
      <div>
        <label>Nombre</label>
        <input v-model="form.nombre" />
      </div>
      <div>
        <label>Apellido</label>
        <input v-model="form.apellido" />
      </div>
      <div>
        <label>Teléfono</label>
        <input v-model="form.telefono" />
      </div>
      <div>
        <label>Dirección</label>
        <input v-model="form.direccion" />
      </div>
      <button type="submit">Crear cuenta</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  nombreUsuario: '',
  clave: '',
  nombre: '',
  apellido: '',
  telefono: '',
  direccion: '',
})

const error = ref('')

const submit = async () => {
  error.value = ''
  try {
    const ok = await authStore.register(form)
    if (ok) {
      router.push('/')
    } else {
      error.value = 'No se pudo crear la cuenta.'
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || err?.message || 'Error'
  }
}
</script>

<style scoped>
.container { max-width: 520px; margin: 24px auto; }
form > div { margin-bottom: 8px }
.error { color: red }
</style>
