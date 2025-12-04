<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <!-- Logo y Título -->
        <div class="text-center mb-4">
          <img
            src="/src/assets/img/gallery/logo.png"
            alt="ROMA"
            class="logo mb-3"
          />
          <h1 class="register-title">Crear Cuenta</h1>
          <p class="register-subtitle">Regístrate como cliente para realizar compras</p>
          <div class="role-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Registro de Cliente</span>
          </div>
        </div>

        <form class="register-form" @submit.prevent="submit">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Usuario *</label>
              <input
                v-model="form.nombreUsuario"
                type="text"
                class="form-control"
                placeholder="Elige un nombre de usuario"
                required
                maxlength="15"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Contraseña *</label>
              <input
                type="password"
                v-model="form.clave"
                class="form-control"
                placeholder="Crea una contraseña segura"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input
                v-model="form.nombre"
                type="text"
                class="form-control"
                placeholder="Tu nombre"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Apellido</label>
              <input
                v-model="form.apellido"
                type="text"
                class="form-control"
                placeholder="Tu apellido"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Cédula / CI</label>
              <input
                v-model="form.cedula"
                type="text"
                class="form-control"
                placeholder="Número de CI"
                maxlength="15"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Género</label>
              <select v-model="form.genero" class="form-control">
                <option value="">Seleccionar</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Fecha de Nacimiento</label>
              <input
                v-model="form.fechaNacimiento"
                type="date"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input
                v-model="form.telefono"
                type="tel"
                class="form-control"
                placeholder="Tu número de teléfono"
              />
            </div>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Dirección</label>
            <input
              v-model="form.direccion"
              type="text"
              class="form-control"
              placeholder="Tu dirección de envío"
            />
          </div>

          <div v-if="error" class="alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{{ error }}</span>
          </div>

          <button class="btn-register full-width" type="submit" :disabled="loading">
            <span v-if="loading">
              <span class="spinner"></span>
              Creando cuenta...
            </span>
            <span v-else>Crear mi cuenta</span>
          </button>

          <div class="login-link full-width">
            <span>¿Ya tienes una cuenta?</span>
            <RouterLink to="/login">Inicia sesión aquí</RouterLink>
          </div>
        </form>

        <!-- Link volver -->
        <div class="text-center mt-4">
          <a href="/" class="link-back">← Volver al inicio</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores'
import { useRouter, RouterLink } from 'vue-router'
import http from '@/plugins/axios'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)

const form = reactive({
  nombreUsuario: '',
  clave: '',
  nombre: '',
  apellido: '',
  cedula: '',
  genero: '',
  fechaNacimiento: '',
  telefono: '',
  direccion: '',
})

const error = ref('')

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    const ok = await authStore.register(form)
    if (ok) {
      // try to create the Cliente profile for the just-created usuario
      try {
        const clientePayload = {
          nombre: form.nombre ?? '',
          apellido: form.apellido ?? undefined,
          cedula: form.cedula ?? undefined,
          genero: form.genero ?? undefined,
          fechaNacimiento: form.fechaNacimiento ?? undefined,
          telefono: form.telefono ?? undefined,
          direccion: form.direccion ?? undefined,
        }
        await http.post('clientes/me', clientePayload)
      } catch (e) {
        // non-blocking - log for debugging
        ;(window.console as any).error('Crear cliente falló:', e)
      }

      // show success toast if available and navigate to profile
      ;(window as any).__app_toasts?.push?.('¡Cuenta creada correctamente! Bienvenido/a', 'success', 3500)
      router.push('/cuenta')
    } else {
      error.value = 'No se pudo crear la cuenta.'
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || err?.message || 'Error al crear la cuenta'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.register-container {
  width: 100%;
  max-width: 900px;
}

.register-card {
  background: white;
  padding: 30px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* Ensure header elements don't overlap: give title higher stacking and extra top spacing */
.register-card,
.register-container {
  position: relative;
}

.register-title {
  position: relative;
  z-index: 2;
  margin-top: 6px; /* small gap to avoid overlapping icons */
}

.role-badge {
  margin-top: 8px;
  z-index: 1;
}
.logo {
  height: 50px;
  opacity: 0.9;
}

.register-title {
  font-size: 1.75rem;
  font-weight: 300;
  letter-spacing: -0.5px;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.register-subtitle {
  font-size: 0.9rem;
  color: #95a5a6;
  font-weight: 300;
  margin: 0 0 16px 0;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.register-form {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-row {
  display: contents;
}

.form-group {
  margin-bottom: 20px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

/* Small safeguard: if any small decorative arrow/icon uses absolute positioning,
   keep it from covering text by lowering its z-index when inside the card */
.register-card svg {
  z-index: 0;
}

.form-label {
  display: block;
  color: #7f8c8d;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.form-control {
  width: 100%;
  height: 48px;
  border: 1px solid #e5e5e5;
  border-radius: 0;
  font-size: 0.9rem;
  color: #2c3e50;
  background: #ffffff;
  padding: 0 14px;
  transition: all 0.2s ease;
}

select.form-control {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}

.form-control::placeholder {
  color: #bdc3c7;
  font-weight: 300;
}

.form-control:focus {
  outline: none;
  border-color: #2c3e50;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fff5f5;
  border: 1px solid #fee;
  border-left: 3px solid #e74c3c;
  color: #c0392b;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.btn-register {
  width: 100%;
  height: 50px;
  background: #27ae60;
  color: white;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-register:hover:not(:disabled) {
  background: #219a52;
}

.btn-register:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.login-link a {
  color: #2c3e50;
  font-weight: 500;
  text-decoration: none;
  margin-left: 6px;
}

.login-link a:hover {
  text-decoration: underline;
}

.link-back {
  color: #95a5a6;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 300;
  transition: color 0.2s ease;
}

.link-back:hover {
  color: #2c3e50;
}

@media (max-width: 576px) {
  .register-card {
    padding: 30px 24px;
  }

  .register-container {
    max-width: 520px;
  }

  .register-form {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .register-title {
    font-size: 1.5rem;
  }
}
</style>
