<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/index'
import http from '@/plugins/axios'

const router = useRouter()
const authStore = useAuthStore()

// Vista activa: 'login' | 'register'
const activeView = ref<'login' | 'register'>('login')
// Tipo de registro: 'cliente' | 'admin'
const registerType = ref<'cliente' | 'admin'>('cliente')

// Campos de login
const usuario = ref('')
const clave = ref('')
const error = ref(false)
const loading = ref(false)

// Campos de registro
const regForm = ref({
  nombreUsuario: '',
  clave: '',
  confirmarClave: '',
  nombre: '',
  apellido: '',
  cedula: '',
  genero: '',
  fechaNacimiento: '',
  telefono: '',
  direccion: '',
})
const regError = ref('')
const regLoading = ref(false)

// Helper para verificar si es admin
function isAdminRole(role: string | null): boolean {
  if (!role) return false
  const regex = /admin|administrador|super/i
  return regex.test(role)
}

async function onLogin() {
  loading.value = true
  error.value = false

  try {
    const success = await authStore.login(usuario.value, clave.value)

    if (success) {
      const role = localStorage.getItem('role') || authStore.role
      
      if (isAdminRole(role)) {
        router.push(authStore.returnUrl || '/dashboard')
      } else {
        // Cliente va directo a la página principal
        const returnUrl = authStore.returnUrl
        const adminRoutes = ['/dashboard', '/categorias', '/productos', '/clientes', '/ventas']
        const isAdminRoute = adminRoutes.some(route => returnUrl?.startsWith(route))
        
        if (returnUrl && !isAdminRoute && returnUrl !== '/login') {
          router.push(returnUrl)
        } else {
          router.push('/') // Ir a la página principal, no a /cuenta
        }
      }
    } else {
      error.value = true
    }
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function onRegister() {
  regError.value = ''
  
  if (regForm.value.clave !== regForm.value.confirmarClave) {
    regError.value = 'Las contraseñas no coinciden'
    return
  }
  
  if (regForm.value.clave.length < 4) {
    regError.value = 'La contraseña debe tener al menos 4 caracteres'
    return
  }

  regLoading.value = true

  try {
    const payload = {
      nombreUsuario: regForm.value.nombreUsuario,
      clave: regForm.value.clave,
      nombre: regForm.value.nombre,
      apellido: regForm.value.apellido,
      cedula: regForm.value.cedula || undefined,
      genero: regForm.value.genero || undefined,
      fechaNacimiento: regForm.value.fechaNacimiento || undefined,
      telefono: regForm.value.telefono,
      direccion: regForm.value.direccion,
      rol: registerType.value, // Enviar el rol directamente al backend
    }

    const response = await http.post('auth/register', payload)
    
    if (response.data) {
      // Ya no necesitamos hacer PATCH, el rol se guarda en el registro

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token)
        authStore.token = response.data.access_token
      }
      if (response.data.usuario?.nombreUsuario) {
        localStorage.setItem('user', response.data.usuario.nombreUsuario)
        authStore.user = response.data.usuario.nombreUsuario
      }
      
      // Usar el rol del usuario creado o el tipo de registro
      const finalRole = response.data.usuario?.rol || registerType.value
      localStorage.setItem('role', finalRole)
      authStore.role = finalRole

      ;(window as any).__app_toasts?.push?.('Cuenta creada exitosamente', 'success', 3500)
      
      if (registerType.value === 'admin') {
        router.push('/dashboard')
      } else {
        router.push('/') // Cliente va a la página principal después de registrarse
      }
    }
  } catch (err: any) {
    regError.value = err?.response?.data?.message || 'Error al crear la cuenta'
  } finally {
    regLoading.value = false
  }
}

function switchToRegister(type: 'cliente' | 'admin') {
  registerType.value = type
  activeView.value = 'register'
  regError.value = ''
}

function switchToLogin() {
  activeView.value = 'login'
  error.value = false
}
</script>

<template>
  <div class="auth-page">
    <!-- Fondo con patrón sutil -->
    <div class="auth-background">
      <div class="pattern"></div>
    </div>

    <div class="auth-container">
      <!-- Panel izquierdo - Branding -->
      <div class="brand-panel">
        <div class="brand-content">
          <div class="brand-logo">ROMA</div>
          <div class="brand-tagline">Elegancia en cada detalle</div>
          <div class="brand-divider"></div>
          <p class="brand-description">
            Accede a tu cuenta para disfrutar de una experiencia de compra exclusiva
          </p>
        </div>
        <div class="brand-footer">
          <span>Moda Premium</span>
          <span class="dot">•</span>
          <span>Desde 2024</span>
        </div>
      </div>

      <!-- Panel derecho - Formularios -->
      <div class="form-panel">
        
        <!-- ==================== VISTA DE LOGIN ==================== -->
        <div v-if="activeView === 'login'" class="form-content">
          <div class="form-header">
            <h1>Bienvenido</h1>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <form @submit.prevent="onLogin" class="auth-form">
            <div class="input-group">
              <label>Usuario</label>
              <div class="input-wrapper">
                <input
                  v-model="usuario"
                  type="text"
                  placeholder="Tu nombre de usuario"
                  autofocus
                  required
                />
              </div>
            </div>

            <div class="input-group">
              <label>Contraseña</label>
              <div class="input-wrapper">
                <input
                  v-model="clave"
                  type="password"
                  placeholder="Tu contraseña"
                  required
                />
              </div>
            </div>

            <div v-if="error" class="error-message">
              <span>Credenciales incorrectas</span>
            </div>

            <button type="submit" class="btn-primary" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              <span>{{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}</span>
            </button>
          </form>

          <div class="divider">
            <span>¿Nuevo aquí?</span>
          </div>

          <div class="register-options">
            <button class="btn-option" @click="switchToRegister('cliente')">
              <div class="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="option-text">
                <span class="option-title">Cliente</span>
                <span class="option-desc">Compra y seguimiento</span>
              </div>
            </button>
            
            <button class="btn-option" @click="switchToRegister('admin')">
              <div class="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
                </svg>
              </div>
              <div class="option-text">
                <span class="option-title">Administrador</span>
                <span class="option-desc">Gestión del sistema</span>
              </div>
            </button>
          </div>
        </div>

        <!-- ==================== VISTA DE REGISTRO ==================== -->
        <div v-else class="form-content">
          <button @click="switchToLogin" class="btn-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>

          <div class="form-header">
            <h1>Crear Cuenta</h1>
            <div class="account-type">
              <span :class="['type-indicator', registerType]"></span>
              {{ registerType === 'admin' ? 'Administrador' : 'Cliente' }}
            </div>
          </div>

          <form @submit.prevent="onRegister" class="auth-form compact">
            <div class="input-group">
              <label>Usuario</label>
              <input v-model="regForm.nombreUsuario" type="text" placeholder="Elige un usuario" required maxlength="15" />
            </div>

            <div class="input-row">
              <div class="input-group">
                <label>Contraseña</label>
                <input v-model="regForm.clave" type="password" placeholder="Contraseña" required />
              </div>
              <div class="input-group">
                <label>Confirmar</label>
                <input v-model="regForm.confirmarClave" type="password" placeholder="Repetir" required />
              </div>
            </div>

            <div class="input-row">
              <div class="input-group">
                <label>Nombre</label>
                <input v-model="regForm.nombre" type="text" placeholder="Tu nombre" />
              </div>
              <div class="input-group">
                <label>Apellido</label>
                <input v-model="regForm.apellido" type="text" placeholder="Tu apellido" />
              </div>
            </div>

            <div v-if="registerType === 'cliente'" class="input-row">
              <div class="input-group">
                <label>Cédula / CI</label>
                <input v-model="regForm.cedula" type="text" placeholder="Número de CI" maxlength="15" />
              </div>
              <div class="input-group">
                <label>Género</label>
                <select v-model="regForm.genero">
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div v-if="registerType === 'cliente'" class="input-row">
              <div class="input-group">
                <label>Fecha de Nacimiento</label>
                <input v-model="regForm.fechaNacimiento" type="date" />
              </div>
              <div class="input-group">
                <label>Teléfono</label>
                <input v-model="regForm.telefono" type="tel" placeholder="Teléfono" />
              </div>
            </div>

            <div v-if="registerType === 'cliente'" class="input-group">
              <label>Dirección</label>
              <input v-model="regForm.direccion" type="text" placeholder="Tu dirección completa" />
            </div>

            <div v-if="regError" class="error-message">
              <span>{{ regError }}</span>
            </div>

            <button type="submit" class="btn-primary" :disabled="regLoading">
              <span v-if="regLoading" class="loading-spinner"></span>
              <span>{{ regLoading ? 'Creando...' : 'Crear Cuenta' }}</span>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="form-footer">
          <a href="/">Volver a la tienda</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.pattern {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.02) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.02) 0%, transparent 50%);
}

.auth-container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  background: #fff;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

/* Brand Panel */
.brand-panel {
  flex: 0 0 380px;
  background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.brand-panel::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
}

.brand-content {
  position: relative;
  z-index: 1;
}

.brand-logo {
  font-size: 2.5rem;
  font-weight: 200;
  letter-spacing: 12px;
  color: #fff;
  margin-bottom: 8px;
}

.brand-tagline {
  font-size: 0.85rem;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  margin-bottom: 40px;
}

.brand-divider {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.4), transparent);
  margin-bottom: 30px;
}

.brand-description {
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(255,255,255,0.6);
  font-weight: 300;
}

.brand-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.75rem;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
}

.dot {
  opacity: 0.5;
}

/* Form Panel */
.form-panel {
  flex: 1;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow-y: auto;
  max-height: 90vh;
}

.form-content {
  display: flex;
  flex-direction: column;
  position: relative;
}

.form-header {
  margin-bottom: 20px;
}

.form-header h1 {
  font-size: 1.5rem;
  font-weight: 300;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.form-header p {
  font-size: 0.9rem;
  color: #888;
  margin: 0;
}

.account-type {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.type-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1a1a1a;
}

.type-indicator.admin {
  background: #1a1a1a;
}

.type-indicator.cliente {
  background: #666;
}

/* Form Styles */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.auth-form.compact {
  gap: 12px;
}

.input-row {
  display: flex;
  gap: 12px;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-group label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #666;
}

.input-wrapper {
  position: relative;
}

.input-group input,
.input-group select {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #e5e5e5;
  background: #fafafa;
  font-size: 0.9rem;
  color: #1a1a1a;
  transition: all 0.3s ease;
}

.input-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.input-group input::placeholder {
  color: #bbb;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #1a1a1a;
  background: #fff;
}

.error-message {
  padding: 14px 18px;
  background: #fafafa;
  border-left: 2px solid #1a1a1a;
  font-size: 0.85rem;
  color: #666;
}

.btn-primary {
  height: 48px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  margin-top: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #333 0%, #555 100%);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  margin: 36px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #eee;
}

.divider span {
  padding: 0 20px;
  font-size: 0.8rem;
  color: #999;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Register Options */
.register-options {
  display: flex;
  gap: 16px;
}

.btn-option {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid #eee;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-option:hover {
  border-color: #1a1a1a;
  background: #fafafa;
}

.option-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.option-icon svg {
  width: 22px;
  height: 22px;
  color: #1a1a1a;
}

.option-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.option-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
}

.option-desc {
  font-size: 0.75rem;
  color: #999;
}

/* Back Button */
.btn-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid #eee;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back:hover {
  border-color: #1a1a1a;
}

.btn-back svg {
  width: 18px;
  height: 18px;
  color: #1a1a1a;
}

/* Footer */
.form-footer {
  padding-top: 16px;
  text-align: center;
  margin-top: auto;
}

.form-footer a {
  font-size: 0.8rem;
  color: #999;
  text-decoration: none;
  letter-spacing: 1px;
  transition: color 0.2s;
}

.form-footer a:hover {
  color: #1a1a1a;
}

/* Responsive */
@media (max-width: 900px) {
  .auth-container {
    flex-direction: column;
    max-width: 500px;
  }
  
  .brand-panel {
    flex: 0 0 auto;
    padding: 40px 30px;
  }
  
  .brand-logo {
    font-size: 2rem;
    letter-spacing: 8px;
  }
  
  .brand-description {
    display: none;
  }
  
  .form-panel {
    padding: 40px 30px;
  }
  
  .input-row {
    flex-direction: column;
    gap: 18px;
  }
  
  .register-options {
    flex-direction: column;
  }
}

@media (max-width: 500px) {
  .auth-page {
    padding: 0;
  }
  
  .auth-container {
    min-height: 100vh;
    box-shadow: none;
  }
  
  .brand-panel {
    padding: 30px 24px;
  }
  
  .form-panel {
    padding: 30px 24px;
  }
}
</style>
