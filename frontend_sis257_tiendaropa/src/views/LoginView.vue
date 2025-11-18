<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/index'

const router = useRouter()
const usuario = ref('')
const clave = ref('')
const error = ref(false)
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  error.value = false
  const authStore = useAuthStore()

  try {
    const success = await authStore.login(usuario.value, clave.value)

    if (success) {
      router.push(authStore.returnUrl || '/dashboard')
    } else {
      error.value = true
    }
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo y Título -->
      <div class="text-center mb-5">
        <img
          src="/src/assets/img/gallery/logo.png"
          alt="Majestic"
          class="logo mb-4"
        />
        <h1 class="login-title mb-2">Bienvenido</h1>
        <p class="login-subtitle">Ingresa a tu cuenta</p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="onSubmit" class="login-form">
        <div class="form-group mb-4">
          <label for="usuario" class="form-label">Usuario</label>
          <input
            v-model="usuario"
            type="text"
            class="form-control"
            id="usuario"
            placeholder="Ingresa tu usuario"
            autofocus
            required
          />
        </div>

        <div class="form-group mb-4">
          <label for="clave" class="form-label">Contraseña</label>
          <input
            v-model="clave"
            type="password"
            class="form-control"
            id="clave"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        <div v-if="error" class="alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>Usuario o contraseña incorrectos</span>
        </div>

        <button
          type="submit"
          class="btn-login"
          :disabled="loading"
        >
          <span v-if="loading">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Ingresando...
          </span>
          <span v-else>Iniciar Sesión</span>
        </button>
      </form>

      <!-- Link volver -->
      <div class="text-center mt-4">
        <a href="/" class="link-back">
          ← Volver al inicio
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: white;
  padding: 60px 50px;
  border-radius: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.logo {
  height: 60px;
  opacity: 0.9;
}

.login-title {
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: -0.5px;
  color: #2c3e50;
  margin: 0;
}

.login-subtitle {
  font-size: 0.95rem;
  color: #95a5a6;
  font-weight: 300;
  letter-spacing: 0.3px;
}

.login-form {
  margin-top: 40px;
}

.form-group {
  position: relative;
}

.form-label {
  display: block;
  color: #95a5a6;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.form-control {
  width: 100%;
  height: 54px;
  border: 1px solid #e5e5e5;
  border-radius: 0;
  font-size: 0.9375rem;
  color: #000000;
  background: #ffffff;
  padding: 0 16px;
  transition: all 0.3s ease;
}

.form-control::placeholder {
  color: #d1d5db;
  opacity: 1;
  font-weight: 300;
}

.form-control:focus {
  outline: none;
  border-color: #000000;
  box-shadow: none;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: #fff5f5;
  border: 1px solid #fee;
  border-left: 3px solid #e74c3c;
  color: #c0392b;
  font-size: 0.9rem;
  border-radius: 0;
}

.alert-error svg {
  flex-shrink: 0;
}

.btn-login {
  width: 100%;
  height: 54px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 0;
  font-size: 0.95rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-login:hover:not(:disabled) {
  background: #34495e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.15);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.link-back {
  color: #95a5a6;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 300;
  letter-spacing: 0.3px;
  transition: color 0.2s ease;
}

.link-back:hover {
  color: #2c3e50;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 2px;
}

@media (max-width: 576px) {
  .login-card {
    padding: 40px 30px;
  }

  .login-title {
    font-size: 1.75rem;
  }
}
</style>
