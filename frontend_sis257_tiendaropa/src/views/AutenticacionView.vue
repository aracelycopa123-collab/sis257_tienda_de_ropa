<template>
  <div class="profile-page">
    <div class="container">
      <div class="page-header-row">
        <h2 class="page-title">MI CUENTA</h2>
      </div>

      <div class="profile-layout">
        <aside class="side-nav">
          <div class="nav-top">
            <div class="avatar large">{{ initials }}</div>
            <div class="greeting">Hola!</div>
          </div>
          <nav class="nav-list">
            <RouterLink to="/perfil" class="nav-item">Perfil</RouterLink>
            <RouterLink to="/direcciones" class="nav-item">Direcciones</RouterLink>
            <RouterLink to="/ventas" class="nav-item">Pedidos</RouterLink>
            <RouterLink to="/tarjetas" class="nav-item">Tarjetas de crédito</RouterLink>
            <RouterLink to="/auth" class="nav-item active">Autenticación</RouterLink>
            <button class="nav-item logout" @click="logout">Salir</button>
          </nav>
        </aside>

        <section class="auth-card card">
          <div class="auth-header">
            <h3 class="section-title">AUTENTICACIÓN</h3>
          </div>

          <div class="pass-card card">
            <div class="pass-row">
              <div class="pass-text">
                <div class="label">CONTRASEÑA</div>
                <div class="masked">********************</div>
              </div>
              <div class="pass-action">
                <button class="btn btn-dark" @click="openChangePassword">MODIFICAR CONTRASEÑA</button>
              </div>
            </div>
          </div>

          <div class="sessions-card card" style="margin-top:18px">
            <h4>GESTIÓN DE SESIONES</h4>
            <p class="muted">Usted tiene {{ sessionsCount }} sesiones activas</p>
            <a href="#" @click.prevent="viewSessions">VER SESIONES</a>
          </div>
        </section>
      </div>
    </div>

    <!-- Change password modal -->
    <div v-if="showChange" class="modal-overlay" @click.self="showChange = false">
      <div class="modal card">
        <div class="modal-header"><h4>Modificar contraseña</h4><button class="btn btn-ghost" @click="showChange = false">✕</button></div>
        <form @submit.prevent="changePassword">
          <div class="field"><label>Contraseña actual</label><input v-model="pw.current" type="password" /></div>
          <div class="field"><label>Nueva contraseña</label><input v-model="pw.new" type="password" /></div>
          <div class="field"><label>Confirmar</label><input v-model="pw.confirm" type="password" /></div>
          <div style="margin-top:12px"><button class="btn btn-primary" type="submit">Guardar</button> <button type="button" class="btn btn-ghost" @click="showChange=false">Cancelar</button></div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()
const showChange = ref(false)
const pw = ref({ current: '', new: '', confirm: '' })
const sessionsCount = ref(1)

const initials = computed(() => {
  const u: any = authStore.user
  if (!u) return 'U'
  if (typeof u === 'string') return (u.charAt(0) || 'U').toUpperCase()
  const name = u.nombreUsuario || u.nombre || 'U'
  return (name.charAt(0) || 'U').toUpperCase()
})

function logout() { authStore.logout() }
function openChangePassword() { showChange.value = true }
function viewSessions() { (window as any).__app_toasts?.push?.('Listado de sesiones (simulado).', 'info') }

async function changePassword() {
  if (!pw.value.new || pw.value.new !== pw.value.confirm) {
    ;(window as any).__app_toasts?.push?.('Las contraseñas no coinciden', 'error')
    return
  }
  try {
    // Simulate call - replace with real endpoint if available
    ;(window as any).__app_toasts?.push?.('Contraseña actualizada (simulado)', 'success')
    showChange.value = false
    pw.value = { current: '', new: '', confirm: '' }
  } catch (err) {
    ;(window as any).__app_toasts?.push?.('Error actualizando contraseña', 'error')
  }
}
</script>

<style scoped>
.container { max-width: 1100px; margin: 28px auto; padding: 0 18px }
.profile-layout { display:grid; grid-template-columns:420px 1fr; gap:20px }
.card { background:#fff; border-radius:8px; padding:18px; box-shadow:0 6px 18px rgba(15,15,15,0.06) }
.side-nav { padding:18px 12px }
.nav-list { display:flex; flex-direction:column; gap:12px; margin-top:18px }
.nav-item { padding:8px 12px; color:#666; font-weight:700 }
.nav-item.active { color:#111; border-left:4px solid #111; padding-left:8px }
.avatar.large { width:84px; height:84px; border-radius:50%; background:#e9e9e9; display:flex; align-items:center; justify-content:center; font-size:28px }
.section-title { font-weight:800 }
.pass-card { padding:12px; display:flex; align-items:center }
.pass-row { display:flex; justify-content:space-between; align-items:center }
.pass-text .label { font-weight:800 }
.pass-text .masked { margin-top:8px; color:#666 }
.pass-action .btn { padding:10px 16px }
.btn-dark { background:#000; color:#fff; border-radius:6px; padding:10px 16px; border:none }
.sessions-card { padding:16px }
.muted { color:#888 }
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:1200 }
.modal { width:90%; max-width:720px }
.field { margin-bottom:10px }
.field label { display:block; font-weight:700; margin-bottom:6px }
.field input { width:100%; padding:8px; border-radius:6px; border:1px solid #e6e6e6 }
.btn-primary { background:#111; color:#fff; padding:8px 12px; border-radius:6px; border:none }
.btn-ghost { background:transparent; border:1px solid #eee; padding:8px 12px }
@media (max-width:900px) { .profile-layout { grid-template-columns:1fr } }
</style>
