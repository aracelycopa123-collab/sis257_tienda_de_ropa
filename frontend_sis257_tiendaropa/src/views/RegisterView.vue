<template>
  <div class="register-page">
    <div class="container">
      <div class="card register-card">
        <h2>Crear cuenta</h2>
        <p class="muted">Crea una cuenta para realizar pedidos y ver tu historial.</p>

        <form class="register-form" @submit.prevent="submit">
          <div class="two-cols">
            <div class="field">
              <label>Usuario *</label>
              <input v-model="form.nombreUsuario" required maxlength="15" />
            </div>
            <div class="field">
              <label>Clave *</label>
              <input type="password" v-model="form.clave" required />
            </div>
          </div>

          <div class="two-cols">
            <div class="field">
              <label>Nombre</label>
              <input v-model="form.nombre" />
            </div>
            <div class="field">
              <label>Apellido</label>
              <input v-model="form.apellido" />
            </div>
          </div>

          <div class="field">
            <label>Teléfono</label>
            <input v-model="form.telefono" />
          </div>

          <div class="field">
            <label>Dirección</label>
            <input v-model="form.direccion" />
          </div>

          <div class="form-actions">
            <button class="btn btn-primary" type="submit">Crear cuenta</button>
            <RouterLink to="/login" class="btn btn-ghost">Ya tengo cuenta</RouterLink>
          </div>

          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores'
import { useRouter, RouterLink } from 'vue-router'

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
      router.push('/perfil')
    } else {
      error.value = 'No se pudo crear la cuenta.'
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || err?.message || 'Error'
  }
}
</script>

<style scoped>
.register-card { max-width:680px; margin: 24px auto; padding:20px }
.muted { color:#666 }
.two-cols { display:flex; gap:12px }
.field { flex:1; margin-bottom:12px }
.field label { display:block; margin-bottom:6px; color:#333 }
.field input { width:100%; padding:8px; border-radius:6px; border:1px solid #e6e6e6 }
.form-actions { display:flex; gap:8px; align-items:center }
.error { color:crimson; margin-top:8px }
.btn-ghost { background:transparent; border:1px solid #eee; padding:8px 12px }
.btn-primary { background:#111; color:#fff; padding:8px 12px }

@media (max-width:700px){ .two-cols{ flex-direction:column } }
</style>
