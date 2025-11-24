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
            <RouterLink v-if="isAdmin" to="/dashboard" class="nav-item">Panel administrador</RouterLink>
            <RouterLink to="/perfil" class="nav-item">Perfil</RouterLink>
            <RouterLink to="/direcciones" class="nav-item active">Direcciones</RouterLink>
            <RouterLink to="/ventas" class="nav-item">Pedidos</RouterLink>
            <RouterLink to="/tarjetas" class="nav-item">Tarjetas de crédito</RouterLink>
            <RouterLink to="/auth" class="nav-item">Autenticación</RouterLink>
            <button class="nav-item logout" @click="logout">Salir</button>
          </nav>
        </aside>

        <section class="addresses-card card">
          <div class="addresses-header">
            <h3 class="section-title">DIRECCIONES</h3>
            <div style="margin-left:auto"><a href="#" @click.prevent="showAdd = true">AÑADIR DIRECCIÓN</a></div>
          </div>

          <div v-if="!showAdd" class="no-addresses card">
            <p class="empty-title">No tienes ninguna dirección registrada.</p>
          </div>

          <div v-else class="add-address card">
            <form class="address-form" @submit.prevent="submitAddress">
              <div class="field"><label>País</label>
                <select v-model="address.pais">
                  <option value="Bolivia">Bolivia</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Chile">Chile</option>
                </select>
              </div>

              <div class="field"><label>Departamento</label>
                <select v-model="address.departamento">
                  <option value="">Departamento</option>
                  <option>La Paz</option>
                  <option>Santa Cruz</option>
                  <option>Cochabamba</option>
                </select>
              </div>

              <div class="field"><label>Provincia</label>
                <select v-model="address.provincia">
                  <option value="">Provincia</option>
                </select>
              </div>

              <div class="field"><label>Ciudad</label>
                <select v-model="address.ciudad">
                  <option value="">Ciudad</option>
                </select>
              </div>

              <div class="field"><label>Dirección</label><input v-model="address.direccion" placeholder="Calle, número, referencia"/></div>

              <div style="margin-top:12px"><button class="btn btn-primary" type="submit">AÑADIR DIRECCIÓN</button> <button type="button" class="btn btn-ghost" @click="cancelAdd">Cancelar</button></div>
            </form>
          </div>

        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()
const showAdd = ref(false)

const address = ref({ pais: 'Bolivia', departamento: '', provincia: '', ciudad: '', direccion: '' })

const initials = computed(() => {
  const u: any = authStore.user
  if (!u) return 'U'
  if (typeof u === 'string') return (u.charAt(0) || 'U').toUpperCase()
  const name = u.nombreUsuario || u.nombre || 'U'
  return (name.charAt(0) || 'U').toUpperCase()
})

const isAdmin = computed(() => {
  const regex = /admin|administrador|super/i
  const candidates: Array<string | null | undefined> = [authStore.role, localStorage.getItem('role')]
  const u: any = authStore.user
  if (u && typeof u === 'object') {
    candidates.push(u.rol || u.role || null)
    if (u.usuario && typeof u.usuario === 'object') candidates.push(u.usuario.rol || u.usuario.role || null)
  }
  for (const c of candidates) {
    if (!c) continue
    try {
      if (regex.test(String(c))) return true
    } catch {}
  }
  return false
})

function logout() {
  authStore.logout()
}

function cancelAdd() {
  showAdd.value = false
}

function submitAddress() {
  // placeholder: send to backend if endpoint exists
  ;(window as any).__app_toasts?.push?.('Dirección añadida (simulada).', 'success')
  showAdd.value = false
  address.value = { pais: 'Bolivia', departamento: '', provincia: '', ciudad: '', direccion: '' }
}
</script>

<style scoped>
.container { max-width: 1100px; margin: 28px auto; padding: 0 18px }
.page-title { font-size: 1.5rem; margin-bottom: 18px }
.profile-layout { display: grid; grid-template-columns: 420px 1fr; gap: 20px }
.card { background: #fff; border-radius: 8px; box-shadow: 0 6px 18px rgba(15,15,15,0.06); padding: 18px }
.side-nav { padding: 18px 12px; display:flex; flex-direction:column; gap:18px }
.side-nav .nav-top { display:flex; align-items:center; gap:12px }
.avatar.large { width:84px; height:84px; font-size:28px; display:flex; align-items:center; justify-content:center; border-radius:50%; background:#e9e9e9 }
.nav-list { display:flex; flex-direction:column; gap:12px; margin-top:18px }
.nav-item { background: transparent; border: none; text-align: left; padding: 8px 12px; color:#666; font-weight:700; text-decoration:none; cursor:pointer }
.nav-item.active, .nav-item:hover { color:#111; border-left:4px solid #111; padding-left:8px }
.nav-item.logout { color:#e53935; font-weight:700 }

.addresses-card { min-height: 280px }
.addresses-header { display:flex; align-items:center; gap:12px; margin-bottom:12px }
.address-form .field { margin-bottom:10px }
.address-form label { display:block; font-size:0.95rem; font-weight:700; margin-bottom:6px }
.address-form select, .address-form input { width:100%; padding:10px; border-radius:6px; border:1px solid #e6e6e6 }
.empty-title { text-align:center; font-weight:700; padding:40px 0 }

@media (max-width: 900px) {
  .profile-layout { grid-template-columns: 1fr }
  .side-nav { order: -1; display:flex; flex-direction:row; gap:12px; padding:12px }
  .nav-list { flex-direction:row; gap:8px; overflow:auto }
}
</style>
