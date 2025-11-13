<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body">
            <h3 class="card-title text-center mb-4">
              <i class="fas fa-user-plus"></i> Crear Cuenta
            </h3>

            <form @submit.prevent="handleRegistro">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre Completo</label>
                <input
                  v-model="formData.nombre"
                  type="text"
                  class="form-control"
                  id="nombre"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="form-control"
                  id="email"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="telefono" class="form-label">Teléfono</label>
                <input
                  v-model="formData.telefono"
                  type="tel"
                  class="form-control"
                  id="telefono"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input
                  v-model="formData.password"
                  type="password"
                  class="form-control"
                  id="password"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="confirm-password" class="form-label">Confirmar Contraseña</label>
                <input
                  v-model="formData.confirmPassword"
                  type="password"
                  class="form-control"
                  id="confirm-password"
                  required
                />
              </div>

              <button type="submit" class="btn btn-success w-100 mb-3" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Registrando...' : 'Registrarse' }}
              </button>
            </form>

            <hr />

            <p class="text-center">
              ¿Ya tienes cuenta?
              <router-link to="/login" class="link-primary">Inicia sesión aquí</router-link>
            </p>

            <div v-if="error" class="alert alert-danger mt-3">
              <i class="fas fa-exclamation-circle"></i> {{ error }}
            </div>
            <div v-if="success" class="alert alert-success mt-3">
              <i class="fas fa-check-circle"></i> {{ success }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '../services/apiService'

const router = useRouter()

const formData = ref({
  nombre: '',
  email: '',
  telefono: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegistro = async () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  try {
    loading.value = true
    error.value = ''
    success.value = ''

    await apiService.registro(formData.value)
    success.value = 'Cuenta creada exitosamente. Redirigiendo...'

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al registrarse'
  } finally {
    loading.value = false
  }
}
</script>
