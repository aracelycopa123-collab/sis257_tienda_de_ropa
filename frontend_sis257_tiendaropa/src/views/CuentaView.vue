<template>
  <div class="cuenta-page">
    <!-- Elegant Header -->
    <header class="page-header">
      <RouterLink to="/" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
        </svg>
        <span>Volver</span>
      </RouterLink>
      <h1 class="page-title">Mi Cuenta</h1>
      <button class="logout-btn" @click="logout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>
        </svg>
      </button>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loader"></div>
    </div>

    <!-- Main Content -->
    <main v-else class="main-content">
      <!-- Profile Card -->
      <div class="profile-card">
        <div class="profile-visual">
          <div class="profile-pattern"></div>
        </div>
        <div class="avatar-wrapper">
          <div class="avatar">
            <span class="avatar-letter">{{ userInitial }}</span>
          </div>
        </div>
        <div class="profile-body">
          <div class="profile-info">
            <h2 class="profile-name">{{ fullName || 'Bienvenido' }}</h2>
            <span class="profile-username">@{{ cliente?.usuario?.nombreUsuario || 'usuario' }}</span>
          </div>
          <button class="edit-profile-btn" @click="openEditModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
            </svg>
            <span>Editar perfil</span>
          </button>
        </div>
        
        <!-- Contact Details -->
        <div class="contact-grid">
          <div class="contact-item">
            <div class="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
              </svg>
            </div>
            <div class="contact-text">
              <span class="contact-label">Teléfono</span>
              <span class="contact-value">{{ cliente?.telefono || 'No registrado' }}</span>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
              </svg>
            </div>
            <div class="contact-text">
              <span class="contact-label">Dirección</span>
              <span class="contact-value">{{ cliente?.direccion || 'No registrada' }}</span>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"/>
              </svg>
            </div>
            <div class="contact-text">
              <span class="contact-label">Cédula de Identidad</span>
              <span class="contact-value">{{ cliente?.cedula || 'No registrada' }}</span>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
            </div>
            <div class="contact-text">
              <span class="contact-label">Género</span>
              <span class="contact-value">{{ formatGenero(cliente?.genero) }}</span>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
              </svg>
            </div>
            <div class="contact-text">
              <span class="contact-label">Fecha de Nacimiento</span>
              <span class="contact-value">{{ formatFechaNacimiento(cliente?.fechaNacimiento) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Section -->
      <section class="section orders-section">
        <div class="section-title">
          <h3>Historial de Pedidos</h3>
          <span class="badge">{{ pedidos.length }}</span>
        </div>

        <!-- Empty State -->
        <div v-if="!pedidos.length" class="empty-state">
          <div class="empty-illustration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
            </svg>
          </div>
          <h4>Sin pedidos aún</h4>
          <p>Explora nuestra colección y encuentra tu próximo look</p>
          <RouterLink to="/" class="cta-btn">Ir de compras</RouterLink>
        </div>

        <!-- Orders List -->
        <div v-else class="orders-list">
          <article 
            v-for="pedido in pedidos" 
            :key="pedido.id" 
            class="order-card"
            :class="{ 'is-expanded': expandedOrder === pedido.id }"
          >
            <div class="order-header" @click="toggleOrder(pedido.id)">
              <div class="order-info">
                <span class="order-number">Pedido #{{ pedido.id }}</span>
                <span class="order-date">{{ formatDate(pedido.fechaCreacion) }}</span>
              </div>
              <div class="order-right">
                <span :class="['status-pill', getStatusClass(pedido.estado)]">
                  {{ getStatusLabel(pedido.estado) }}
                </span>
                <span class="order-amount">{{ formatCurrency(pedido.totalVenta) }}</span>
                <div class="expand-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Expandable Content -->
            <Transition name="expand">
              <div v-if="expandedOrder === pedido.id" class="order-content">
                <!-- Timeline de seguimiento -->
                <div class="tracking-section">
                  <h4 class="tracking-title">Seguimiento del pedido</h4>
                  <div class="tracking-timeline">
                    <div class="timeline-step" :class="{ active: true, completed: true }">
                      <div class="step-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div class="step-info">
                        <span class="step-name">Pedido recibido</span>
                        <span class="step-date">{{ formatDate(pedido.fechaCreacion) }}</span>
                      </div>
                    </div>
                    <div class="timeline-step" :class="{ active: isStepActive(pedido, 'confirmado'), completed: isStepCompleted(pedido, 'confirmado') }">
                      <div class="step-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                        </svg>
                      </div>
                      <div class="step-info">
                        <span class="step-name">Confirmado</span>
                        <span class="step-date">{{ pedido.fechaConfirmacion ? formatDate(pedido.fechaConfirmacion) : 'Pendiente' }}</span>
                      </div>
                    </div>
                    <div class="timeline-step" :class="{ active: isStepActive(pedido, 'en_preparacion'), completed: isStepCompleted(pedido, 'en_preparacion') }">
                      <div class="step-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                      </div>
                      <div class="step-info">
                        <span class="step-name">En preparación</span>
                        <span class="step-date">{{ isStepCompleted(pedido, 'en_preparacion') ? 'Completado' : 'Pendiente' }}</span>
                      </div>
                    </div>
                    <div class="timeline-step" :class="{ active: isStepActive(pedido, 'enviado'), completed: isStepCompleted(pedido, 'enviado') }">
                      <div class="step-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                        </svg>
                      </div>
                      <div class="step-info">
                        <span class="step-name">Enviado</span>
                        <span class="step-date">{{ pedido.fechaEnvio ? formatDate(pedido.fechaEnvio) : 'Pendiente' }}</span>
                      </div>
                    </div>
                    <div class="timeline-step" :class="{ active: isStepActive(pedido, 'entregado'), completed: isStepCompleted(pedido, 'entregado') }">
                      <div class="step-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                      </div>
                      <div class="step-info">
                        <span class="step-name">Entregado</span>
                        <span class="step-date">{{ pedido.fechaEntrega ? formatDate(pedido.fechaEntrega) : 'Pendiente' }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="pedido.numeroSeguimiento" class="tracking-number">
                    <span class="tracking-label">Número de seguimiento:</span>
                    <span class="tracking-code">{{ pedido.numeroSeguimiento }}</span>
                  </div>
                </div>

                <div class="products-grid">
                  <div v-for="det in pedido.ventadetalles" :key="det.id" class="product-item">
                    <div class="product-image">
                      <img :src="det.producto?.imagen || '/placeholder.jpg'" :alt="det.producto?.nombre" />
                    </div>
                    <div class="product-details">
                      <span class="product-name">{{ det.producto?.nombre || 'Producto' }}</span>
                      <span class="product-meta">Cantidad: {{ det.cantidad }}</span>
                    </div>
                    <span class="product-price">{{ formatCurrency(det.precioUnitario) }}</span>
                  </div>
                </div>
                <div class="order-footer">
                  <div class="footer-row">
                    <span>Método de pago</span>
                    <span>{{ pedido.metodoPago || 'No especificado' }}</span>
                  </div>
                  <div class="footer-row total">
                    <span>Total del pedido</span>
                    <span>{{ formatCurrency(pedido.totalVenta) }}</span>
                  </div>
                </div>
              </div>
            </Transition>
          </article>
        </div>
      </section>

      <!-- Account Settings -->
      <section class="section settings-section">
        <div class="section-title">
          <h3>Configuración</h3>
        </div>
        
        <div class="settings-list">
          <button class="setting-item" @click="openPasswordModal">
            <div class="setting-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
              </svg>
            </div>
            <div class="setting-text">
              <strong>Cambiar contraseña</strong>
              <span>Actualiza tu contraseña de acceso</span>
            </div>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
            </svg>
          </button>
        </div>
      </section>
    </main>

    <!-- Edit Profile Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="cuenta-modal-backdrop" @click.self="closeEditModal">
          <div class="cuenta-modal">
            <div class="modal-header">
              <h3>Editar perfil</h3>
              <button class="modal-close" @click="closeEditModal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <form @submit.prevent="saveProfile" class="modal-form">
              <div class="input-row">
                <div class="input-group">
                  <label>Nombre <span class="required">*</span></label>
                  <input v-model="form.nombre" type="text" placeholder="Ingresa tu nombre" required />
                  <span v-if="!form.nombre.trim()" class="input-hint">El nombre es obligatorio</span>
                </div>
                <div class="input-group">
                  <label>Apellido</label>
                  <input v-model="form.apellido" type="text" placeholder="Ingresa tu apellido" />
                </div>
              </div>
              <div class="input-row">
                <div class="input-group">
                  <label>Teléfono</label>
                  <input v-model="form.telefono" type="tel" placeholder="+591 ..." />
                </div>
                <div class="input-group">
                  <label>Cédula de Identidad</label>
                  <input v-model="form.cedula" type="text" placeholder="Número de CI" />
                </div>
              </div>
              <div class="input-row">
                <div class="input-group">
                  <label>Género</label>
                  <select v-model="form.genero">
                    <option value="">Seleccionar</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div class="input-group">
                  <label>Fecha de Nacimiento</label>
                  <input v-model="form.fechaNacimiento" type="date" />
                </div>
              </div>
              <div class="input-group full">
                <label>Dirección de envío</label>
                <input v-model="form.direccion" type="text" placeholder="Calle, número, ciudad" />
              </div>
              <div class="modal-actions">
                <button type="button" class="btn-secondary" @click="closeEditModal">Cancelar</button>
                <button type="submit" class="btn-primary" :disabled="saving || !form.nombre.trim()">
                  <span v-if="saving" class="btn-loader"></span>
                  {{ saving ? 'Guardando...' : 'Guardar cambios' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Change Password Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPasswordModal" class="cuenta-modal-backdrop" @click.self="closePasswordModal">
          <div class="cuenta-modal">
            <div class="modal-header">
              <h3>Cambiar contraseña</h3>
              <button class="modal-close" @click="closePasswordModal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <Transition name="fade">
              <div v-if="passwordSuccess" class="toast success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Contraseña actualizada correctamente</span>
              </div>
            </Transition>
            
            <Transition name="fade">
              <div v-if="passwordError" class="toast error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
                </svg>
                <span>{{ passwordError }}</span>
              </div>
            </Transition>

            <form @submit.prevent="changePassword" class="modal-form">
              <div class="input-group">
                <label>Contraseña actual</label>
                <div class="password-field">
                  <input 
                    v-model="passwordForm.actual" 
                    :type="showCurrentPw ? 'text' : 'password'" 
                    placeholder="••••••••" 
                  />
                  <button type="button" class="toggle-pw" @click="showCurrentPw = !showCurrentPw">
                    <svg v-if="!showCurrentPw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="input-group">
                <label>Nueva contraseña</label>
                <input v-model="passwordForm.nueva" type="password" placeholder="Mínimo 6 caracteres" />
                <div class="password-strength" v-if="passwordForm.nueva">
                  <div class="strength-bar" :class="passwordStrength"></div>
                  <span>{{ passwordStrengthText }}</span>
                </div>
              </div>
              <div class="input-group">
                <label>Confirmar contraseña</label>
                <input v-model="passwordForm.confirmar" type="password" placeholder="Repite la nueva contraseña" />
                <span v-if="passwordForm.confirmar && passwordForm.nueva !== passwordForm.confirmar" class="input-error">
                  Las contraseñas no coinciden
                </span>
              </div>
              <div class="modal-actions">
                <button type="button" class="btn-secondary" @click="closePasswordModal">Cancelar</button>
                <button type="submit" class="btn-primary" :disabled="!canChangePassword || changingPassword">
                  <span v-if="changingPassword" class="btn-loader"></span>
                  {{ changingPassword ? 'Actualizando...' : 'Actualizar contraseña' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import http from '@/plugins/axios'

const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(true)
const cliente = ref<any>(null)
const pedidos = ref<any[]>([])
const expandedOrder = ref<number | null>(null)

// Edit Profile
const showEditModal = ref(false)
const saving = ref(false)
const form = reactive({
  nombre: '',
  apellido: '',
  telefono: '',
  cedula: '',
  genero: '',
  fechaNacimiento: '',
  direccion: ''
})

// Change Password
const showPasswordModal = ref(false)
const changingPassword = ref(false)
const passwordSuccess = ref(false)
const passwordError = ref('')
const showCurrentPw = ref(false)
const passwordForm = reactive({
  actual: '',
  nueva: '',
  confirmar: ''
})

// Computed
const fullName = computed(() => {
  if (!cliente.value) return ''
  return [cliente.value.nombre, cliente.value.apellido].filter(Boolean).join(' ')
})

const userInitial = computed(() => {
  const name = fullName.value || cliente.value?.usuario?.nombreUsuario || 'U'
  return name.charAt(0).toUpperCase()
})

const canChangePassword = computed(() => {
  return passwordForm.actual.length > 0 &&
         passwordForm.nueva.length >= 6 &&
         passwordForm.nueva === passwordForm.confirmar
})

const passwordStrength = computed(() => {
  const pw = passwordForm.nueva
  if (pw.length < 6) return 'weak'
  if (pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw)) return 'strong'
  if (pw.length >= 6) return 'medium'
  return 'weak'
})

const passwordStrengthText = computed(() => {
  const s = passwordStrength.value
  if (s === 'weak') return 'Débil'
  if (s === 'medium') return 'Media'
  return 'Fuerte'
})

// Load data
onMounted(async () => {
  try {
    const res = await http.get('clientes/me')
    cliente.value = res.data
    pedidos.value = res.data?.ventas || []
  } catch (err: any) {
    // Si no existe cliente, crear un objeto vacío para mostrar el formulario
    if (err?.response?.status === 404) {
      cliente.value = { id: null, nombre: '', apellido: '', telefono: '', direccion: '', cedula: '' }
      pedidos.value = []
    } else {
      console.error(err)
    }
  } finally {
    loading.value = false
  }
})

// Methods
function toggleOrder(id: number) {
  expandedOrder.value = expandedOrder.value === id ? null : id
}

function formatCurrency(val: number | undefined) {
  if (!val) return 'Bs. 0.00'
  return `Bs. ${Number(val).toFixed(2)}`
}

function formatDate(val: string | undefined) {
  if (!val) return '—'
  return new Intl.DateTimeFormat('es-ES', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  }).format(new Date(val))
}

function formatGenero(genero: string | undefined) {
  if (!genero) return 'No registrado'
  const g = genero.toLowerCase()
  if (g === 'masculino') return 'Masculino'
  if (g === 'femenino') return 'Femenino'
  if (g === 'otro') return 'Otro'
  return genero
}

function formatFechaNacimiento(fecha: string | Date | undefined) {
  if (!fecha) return 'No registrada'
  return new Intl.DateTimeFormat('es-ES', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  }).format(new Date(fecha))
}

function getStatusClass(s: string | undefined) {
  const st = (s || '').toLowerCase()
  if (st.includes('pend')) return 'pending'
  if (st.includes('realiz') || st.includes('confirm') || st.includes('complet')) return 'completed'
  if (st.includes('prepar')) return 'preparing'
  if (st.includes('enviad')) return 'shipped'
  if (st.includes('entreg')) return 'delivered'
  if (st.includes('anul') || st.includes('cancel')) return 'cancelled'
  return 'default'
}

function getStatusLabel(s: string | undefined) {
  if (!s) return 'Pendiente'
  const st = s.toLowerCase()
  if (st.includes('pend')) return 'Pendiente'
  if (st.includes('realiz')) return 'Realizada'
  if (st.includes('confirm')) return 'Confirmado'
  if (st.includes('prepar')) return 'En preparación'
  if (st.includes('enviad')) return 'Enviado'
  if (st.includes('entreg')) return 'Entregado'
  if (st.includes('complet')) return 'Completado'
  if (st.includes('anul')) return 'Anulado'
  if (st.includes('cancel')) return 'Cancelado'
  return s
}

// Funciones para el timeline de seguimiento
const estadosOrden = ['pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado']

function getEstadoIndex(estado: string | undefined): number {
  if (!estado) return 0
  const st = estado.toLowerCase()
  if (st.includes('pend')) return 0
  if (st.includes('confirm')) return 1
  if (st.includes('prepar')) return 2
  if (st.includes('enviad')) return 3
  if (st.includes('entreg')) return 4
  return 0
}

function isStepActive(pedido: any, step: string): boolean {
  const currentIndex = getEstadoIndex(pedido.estado)
  const stepIndex = estadosOrden.indexOf(step)
  return currentIndex === stepIndex
}

function isStepCompleted(pedido: any, step: string): boolean {
  const currentIndex = getEstadoIndex(pedido.estado)
  const stepIndex = estadosOrden.indexOf(step)
  return currentIndex > stepIndex
}

// Edit Profile
function openEditModal() {
  form.nombre = cliente.value?.nombre || ''
  form.apellido = cliente.value?.apellido || ''
  form.telefono = cliente.value?.telefono || ''
  form.cedula = cliente.value?.cedula || ''
  form.genero = cliente.value?.genero || ''
  // Formatear fecha para input date (YYYY-MM-DD)
  if (cliente.value?.fechaNacimiento) {
    const fecha = new Date(cliente.value.fechaNacimiento)
    form.fechaNacimiento = fecha.toISOString().split('T')[0]
  } else {
    form.fechaNacimiento = ''
  }
  form.direccion = cliente.value?.direccion || ''
  showEditModal.value = true
  document.body.style.overflow = 'hidden'
}

function closeEditModal() {
  showEditModal.value = false
  document.body.style.overflow = ''
}

async function saveProfile() {
  saving.value = true
  try {
    if (cliente.value?.id) {
      // Cliente existe, actualizar
      await http.patch(`clientes/${cliente.value.id}`, form)
    } else {
      // Cliente no existe, crear uno nuevo asociado al usuario
      await http.post('clientes/me', form)
    }
    // Recargar datos del cliente
    const res = await http.get('clientes/me')
    cliente.value = res.data
    closeEditModal()
  } catch (err: any) {
    console.error('Error al guardar perfil:', err)
    alert(err?.response?.data?.message || 'Error al guardar los cambios')
  } finally {
    saving.value = false
  }
}

// Change Password
function openPasswordModal() {
  passwordForm.actual = ''
  passwordForm.nueva = ''
  passwordForm.confirmar = ''
  passwordSuccess.value = false
  passwordError.value = ''
  showCurrentPw.value = false
  showPasswordModal.value = true
  document.body.style.overflow = 'hidden'
}

function closePasswordModal() {
  showPasswordModal.value = false
  document.body.style.overflow = ''
}

async function changePassword() {
  if (!canChangePassword.value) return
  changingPassword.value = true
  passwordError.value = ''
  passwordSuccess.value = false
  
  try {
    await http.patch('auth/change-password', {
      claveActual: passwordForm.actual,
      claveNueva: passwordForm.nueva
    })
    passwordSuccess.value = true
    passwordForm.actual = ''
    passwordForm.nueva = ''
    passwordForm.confirmar = ''
    setTimeout(closePasswordModal, 1500)
  } catch (err: any) {
    passwordError.value = err?.response?.data?.message || 'Error al cambiar la contraseña'
  } finally {
    changingPassword.value = false
  }
}

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
/* ========================================
   CUENTA VIEW - PREMIUM FASHION STYLE
   ======================================== */

.cuenta-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%);
}

/* Override theme.css section padding */
.cuenta-page section {
  padding-top: 0;
  padding-bottom: 0;
}

/* ========================================
   HEADER
   ======================================== */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1a1a1a;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.6;
}

.back-link svg {
  width: 20px;
  height: 20px;
}

.page-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #1a1a1a;
  margin: 0;
}

.logout-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.25s ease;
}

.logout-btn svg {
  width: 18px;
  height: 18px;
  color: #666;
}

.logout-btn:hover {
  background: #1a1a1a;
  border-color: #1a1a1a;
}

.logout-btn:hover svg {
  color: #fff;
}

/* ========================================
   LOADING STATE
   ======================================== */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.loader {
  width: 40px;
  height: 40px;
  border: 2px solid #e0e0e0;
  border-top-color: #1a1a1a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ========================================
   MAIN CONTENT
   ======================================== */
.main-content {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px 60px;
}

/* ========================================
   PROFILE CARD
   ======================================== */
.profile-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
  margin-bottom: 24px;
}

.profile-visual {
  position: relative;
  height: 100px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
}

.profile-pattern {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.avatar-wrapper {
  position: relative;
  height: 36px;
}

.avatar {
  position: absolute;
  top: -36px;
  left: 24px;
  width: 72px;
  height: 72px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  border: 3px solid #fff;
  z-index: 10;
}

.avatar-letter {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: uppercase;
}

.profile-body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 24px 20px;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px;
  letter-spacing: -0.3px;
}

.profile-username {
  font-size: 14px;
  color: #888;
}

.edit-profile-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  border: 1.5px solid #1a1a1a;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.25s ease;
}

.edit-profile-btn svg {
  width: 16px;
  height: 16px;
}

.edit-profile-btn:hover {
  background: #1a1a1a;
  color: #fff;
}

/* Contact Grid */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: #f0f0f0;
  border-top: 1px solid #f0f0f0;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  background: #fff;
}

.contact-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7f7;
  border-radius: 12px;
}

.contact-icon svg {
  width: 20px;
  height: 20px;
  color: #666;
}

.contact-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #999;
}

.contact-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

/* ========================================
   SECTIONS
   ======================================== */
.section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.section-title h3 {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #1a1a1a;
  margin: 0;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  background: #1a1a1a;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 100px;
}

/* ========================================
   EMPTY STATE
   ======================================== */
.empty-state {
  text-align: center;
  padding: 56px 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.empty-illustration {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: #f7f7f7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-illustration svg {
  width: 36px;
  height: 36px;
  color: #bbb;
}

.empty-state h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.empty-state p {
  font-size: 14px;
  color: #888;
  margin: 0 0 24px;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  background: #1a1a1a;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-decoration: none;
  border-radius: 100px;
  transition: all 0.25s ease;
}

.cta-btn:hover {
  background: #333;
  transform: translateY(-1px);
}

/* ========================================
   ORDERS LIST
   ======================================== */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.25s ease;
}

.order-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.order-header:hover {
  background: #fafafa;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-number {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.order-date {
  font-size: 13px;
  color: #888;
}

.order-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-pill {
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: 100px;
}

.status-pill.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-pill.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-pill.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.status-pill.preparing {
  background: #e0e7ff;
  color: #3730a3;
}

.status-pill.shipped {
  background: #dbeafe;
  color: #1e40af;
}

.status-pill.delivered {
  background: #d1fae5;
  color: #065f46;
}

.status-pill.default {
  background: #f3f4f6;
  color: #4b5563;
}

/* Tracking Section */
.tracking-section {
  padding: 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.tracking-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #666;
  margin: 0 0 16px 0;
}

.tracking-timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 16px;
}

.tracking-timeline::before {
  content: '';
  position: absolute;
  top: 18px;
  left: 24px;
  right: 24px;
  height: 2px;
  background: #e5e5e5;
  z-index: 0;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  flex: 1;
}

.step-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step-icon svg {
  width: 18px;
  height: 18px;
  color: #ccc;
}

.timeline-step.completed .step-icon {
  background: #1a1a1a;
  border-color: #1a1a1a;
}

.timeline-step.completed .step-icon svg {
  color: #fff;
}

.timeline-step.active .step-icon {
  background: #fff;
  border-color: #1a1a1a;
  box-shadow: 0 0 0 4px rgba(26, 26, 26, 0.1);
}

.timeline-step.active .step-icon svg {
  color: #1a1a1a;
}

.step-info {
  text-align: center;
}

.step-name {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timeline-step.completed .step-name,
.timeline-step.active .step-name {
  color: #1a1a1a;
}

.step-date {
  display: block;
  font-size: 10px;
  color: #bbb;
  margin-top: 2px;
}

.timeline-step.completed .step-date {
  color: #666;
}

.tracking-number {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fff;
  border: 1px dashed #e5e5e5;
  border-radius: 8px;
  margin-top: 12px;
}

.tracking-label {
  font-size: 12px;
  color: #666;
}

.tracking-code {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  font-family: monospace;
  letter-spacing: 1px;
}

.order-amount {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  min-width: 90px;
  text-align: right;
}

.expand-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.expand-icon svg {
  width: 16px;
  height: 16px;
  color: #666;
}

.order-card.is-expanded .expand-icon {
  transform: rotate(180deg);
}

/* Order Content */
.order-content {
  border-top: 1px solid #f0f0f0;
}

.products-grid {
  padding: 16px 20px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
}

.product-item:not(:last-child) {
  border-bottom: 1px solid #f5f5f5;
}

.product-image {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.product-meta {
  font-size: 13px;
  color: #888;
}

.product-price {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.order-footer {
  background: #fafafa;
  padding: 16px 20px;
}

.footer-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  padding: 6px 0;
}

.footer-row.total {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid #e5e5e5;
}

/* ========================================
   SETTINGS
   ======================================== */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 18px 20px;
  background: #fff;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.setting-item:hover {
  background: #fafafa;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.setting-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 12px;
}

.setting-icon svg {
  width: 22px;
  height: 22px;
  color: #1a1a1a;
}

.setting-text {
  flex: 1;
}

.setting-text strong {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.setting-text span {
  font-size: 13px;
  color: #888;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: #ccc;
}

/* ========================================
   MODAL
   ======================================== */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
}

.modal {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.modal-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close svg {
  width: 18px;
  height: 18px;
  color: #666;
}

.modal-close:hover {
  background: #1a1a1a;
}

.modal-close:hover svg {
  color: #fff;
}

.modal-form {
  padding: 24px 28px 28px;
}

/* Form Elements */
.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.input-group {
  margin-bottom: 16px;
}

.input-group.full {
  margin-bottom: 0;
}

.input-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 8px;
}

.input-group input {
  width: 100%;
  padding: 14px 16px;
  background: #f7f7f7;
  border: 1.5px solid transparent;
  border-radius: 12px;
  font-size: 15px;
  color: #1a1a1a;
  transition: all 0.2s;
  box-sizing: border-box;
}

.input-group input::placeholder {
  color: #aaa;
}

.input-group input:focus {
  outline: none;
  background: #fff;
  border-color: #1a1a1a;
}

.input-error {
  display: block;
  font-size: 12px;
  color: #dc2626;
  margin-top: 6px;
}

.input-hint {
  display: block;
  font-size: 11px;
  color: #999;
  margin-top: 6px;
}

.required {
  color: #dc2626;
}

/* Password Field */
.password-field {
  position: relative;
}

.password-field input {
  padding-right: 48px;
}

.toggle-pw {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
}

.toggle-pw svg {
  width: 20px;
  height: 20px;
  color: #888;
}

/* Password Strength */
.password-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e5e5e5;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.strength-bar::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s;
}

.strength-bar.weak::after {
  width: 33%;
  background: #ef4444;
}

.strength-bar.medium::after {
  width: 66%;
  background: #f59e0b;
}

.strength-bar.strong::after {
  width: 100%;
  background: #10b981;
}

.password-strength span {
  font-size: 12px;
  color: #888;
  min-width: 50px;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.btn-secondary {
  flex: 1;
  padding: 14px 24px;
  background: #f5f5f5;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e5e5e5;
  color: #1a1a1a;
}

.btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: #1a1a1a;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #333;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Toast Notifications */
.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  margin: 20px 28px 0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.toast svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.toast.success {
  background: #d1fae5;
  color: #065f46;
}

.toast.error {
  background: #fee2e2;
  color: #991b1b;
}

/* ========================================
   TRANSITIONS
   ======================================== */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.95) translateY(10px);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 640px) {
  .page-header {
    padding: 16px 20px;
  }

  .page-title {
    display: none;
  }

  .main-content {
    padding: 20px 16px 40px;
  }

  .avatar-wrapper {
    height: 36px;
  }

  .avatar {
    left: 20px;
    width: 64px;
    height: 64px;
    top: -32px;
  }

  .avatar-letter {
    font-size: 24px;
  }

  .profile-body {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 20px;
  }

  .edit-profile-btn {
    width: 100%;
    justify-content: center;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .contact-item {
    padding: 16px 20px;
  }

  .order-header {
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;
  }

  .order-right {
    width: 100%;
    justify-content: space-between;
  }

  .order-amount {
    min-width: auto;
  }

  /* Timeline responsive */
  .tracking-timeline {
    flex-direction: column;
    gap: 0;
  }

  .tracking-timeline::before {
    display: none;
  }

  .timeline-step {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    position: relative;
  }

  .timeline-step:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 17px;
    top: 48px;
    width: 2px;
    height: calc(100% - 36px);
    background: #e5e5e5;
  }

  .timeline-step.completed:not(:last-child)::after {
    background: #1a1a1a;
  }

  .step-info {
    text-align: left;
    flex: 1;
  }

  .step-name {
    font-size: 13px;
  }

  .step-date {
    font-size: 11px;
  }

  .tracking-number {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .input-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .modal {
    border-radius: 20px 20px 0 0;
    max-height: 95vh;
  }

  .modal-backdrop {
    align-items: flex-end;
    padding: 0;
  }
}
</style>

<!-- Estilos globales para el modal (Teleport lo renderiza fuera del componente) -->
<style>
.cuenta-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
}

.cuenta-modal {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.cuenta-modal .modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.cuenta-modal .modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.cuenta-modal .modal-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.cuenta-modal .modal-close svg {
  width: 18px;
  height: 18px;
  color: #666;
}

.cuenta-modal .modal-close:hover {
  background: #1a1a1a;
}

.cuenta-modal .modal-close:hover svg {
  color: #fff;
}

.cuenta-modal .modal-form {
  padding: 24px 28px 28px;
}

.cuenta-modal .input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.cuenta-modal .input-group {
  margin-bottom: 16px;
}

.cuenta-modal .input-group.full {
  margin-bottom: 0;
}

.cuenta-modal .input-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 8px;
}

.cuenta-modal .input-group input,
.cuenta-modal .input-group select {
  width: 100%;
  padding: 14px 16px;
  background: #f7f7f7;
  border: 1.5px solid transparent;
  border-radius: 12px;
  font-size: 15px;
  color: #1a1a1a;
  transition: all 0.2s;
  box-sizing: border-box;
}

.cuenta-modal .input-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.cuenta-modal .input-group input::placeholder {
  color: #aaa;
}

.cuenta-modal .input-group input:focus,
.cuenta-modal .input-group select:focus {
  outline: none;
  background: #fff;
  border-color: #1a1a1a;
}

.cuenta-modal .input-hint {
  display: block;
  font-size: 11px;
  color: #999;
  margin-top: 6px;
}

.cuenta-modal .required {
  color: #dc2626;
}

.cuenta-modal .modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.cuenta-modal .btn-secondary {
  flex: 1;
  padding: 14px 24px;
  background: #f5f5f5;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.cuenta-modal .btn-secondary:hover {
  background: #e5e5e5;
  color: #1a1a1a;
}

.cuenta-modal .btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: #1a1a1a;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.cuenta-modal .btn-primary:hover:not(:disabled) {
  background: #333;
}

.cuenta-modal .btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cuenta-modal .btn-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: cuentaSpin 0.8s linear infinite;
}

@keyframes cuentaSpin {
  to { transform: rotate(360deg); }
}

/* Toast */
.cuenta-modal .toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  margin: 20px 28px 0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.cuenta-modal .toast svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.cuenta-modal .toast.success {
  background: #d1fae5;
  color: #065f46;
}

.cuenta-modal .toast.error {
  background: #fee2e2;
  color: #991b1b;
}

/* Password Field */
.cuenta-modal .password-field {
  position: relative;
}

.cuenta-modal .password-field input {
  padding-right: 48px;
}

.cuenta-modal .toggle-pw {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
}

.cuenta-modal .toggle-pw svg {
  width: 20px;
  height: 20px;
  color: #888;
}

/* Password Strength */
.cuenta-modal .password-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.cuenta-modal .strength-bar {
  flex: 1;
  height: 4px;
  background: #e5e5e5;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.cuenta-modal .strength-bar::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s;
}

.cuenta-modal .strength-bar.weak::after {
  width: 33%;
  background: #ef4444;
}

.cuenta-modal .strength-bar.medium::after {
  width: 66%;
  background: #f59e0b;
}

.cuenta-modal .strength-bar.strong::after {
  width: 100%;
  background: #10b981;
}

.cuenta-modal .password-strength span {
  font-size: 12px;
  color: #888;
  min-width: 50px;
}

.cuenta-modal .input-error {
  display: block;
  font-size: 12px;
  color: #dc2626;
  margin-top: 6px;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .cuenta-modal,
.modal-leave-active .cuenta-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .cuenta-modal,
.modal-leave-to .cuenta-modal {
  transform: scale(0.95) translateY(10px);
}

@media (max-width: 640px) {
  .cuenta-modal {
    border-radius: 20px 20px 0 0;
    max-height: 95vh;
  }

  .cuenta-modal-backdrop {
    align-items: flex-end;
    padding: 0;
  }
  
  .cuenta-modal .input-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
