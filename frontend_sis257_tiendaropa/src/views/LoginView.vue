<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body">
            <h3 class="card-title text-center mb-4">
              <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
            </h3>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input
                  v-model="email"
                  type="email"
                  class="form-control"
                  id="email"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  id="password"
                  required
                />
              </div>

              <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Cargando...' : 'Iniciar Sesión' }}
              </button>
            </form>

            <hr />

            <p class="text-center">
              ¿No tienes cuenta?
              <router-link to="/registro" class="link-danger">Regístrate aquí</router-link>
            </p>

            <div v-if="error" class="alert alert-danger mt-3">
              <i class="fas fa-exclamation-circle"></i> {{ error }}
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
import { useAuthStore } from '../stores/authStore'
import apiService from '../services/apiService'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await apiService.login(email.value, password.value)
    const { user, access_token } = response.data

    authStore.login(user, access_token)
    router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
