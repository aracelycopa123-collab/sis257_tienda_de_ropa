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
            <RouterLink to="/direcciones" class="nav-item">Direcciones</RouterLink>
            <RouterLink to="/ventas" class="nav-item">Pedidos</RouterLink>
            <RouterLink to="/tarjetas" class="nav-item active">Tarjetas de crédito</RouterLink>
            <RouterLink to="/auth" class="nav-item">Autenticación</RouterLink>
            <button class="nav-item logout" @click="logout">Salir</button>
          </nav>
        </aside>

        <section class="card-payments card">
          <div class="payments-header">
            <h3 class="section-title">TARJETAS DE CRÉDITO</h3>
            <div style="margin-left:auto"><a href="#" @click.prevent="showAdd = true">AÑADIR TARJETA DE CRÉDITO</a></div>
          </div>

          <div v-if="!showAdd && !cards.length" class="no-cards card">
            <p class="empty-title">¡Aún no tienes ningún método de pago registrado!</p>
          </div>

          <div v-if="showAdd" class="add-card-area card">
            <div class="add-card-grid">
              <form class="card-form" @submit.prevent="submitCard">
                <h4>NUEVA TARJETA</h4>
                <p class="muted">INGRESA LOS DATOS DE TU TARJETA:</p>

                <div class="field"><label>Número de la tarjeta</label><input v-model="card.number" placeholder="0000 0000 0000 0000"/></div>
                <div class="field"><label>Nombre impreso en la tarjeta</label><input v-model="card.name" placeholder="Nombre"/></div>

                <div style="display:flex;gap:12px">
                  <div class="field" style="flex:1"><label>Válida hasta</label><input v-model="card.expiry" placeholder="MM/AA"/></div>
                  <div class="field" style="width:160px"><label>Código de seguridad</label><input v-model="card.cvc" placeholder="CVV"/></div>
                </div>

                <h4 style="margin-top:18px">DIRECCIÓN DE FACTURACIÓN</h4>
                <div class="field"><label>País</label>
                  <select v-model="card.pais">
                    <option>Bolivia</option>
                    <option>Argentina</option>
                    <option>Chile</option>
                  </select>
                </div>
                <div class="field"><label>Departamento</label><select v-model="card.departamento"><option>Departamento</option><option>La Paz</option><option>Santa Cruz</option></select></div>
                <div class="field"><label>Provincia</label><select v-model="card.provincia"><option>Provincia</option></select></div>
                <div class="field"><label>Ciudad</label><select v-model="card.ciudad"><option>Ciudad</option></select></div>

                <div style="margin-top:12px"><button class="btn btn-primary" type="submit">AÑADIR TARJETA</button> <button type="button" class="btn btn-ghost" @click="cancelAdd">Cancelar</button></div>
              </form>

              <div class="card-preview">
                <div class="preview-cc">
                  <div class="chip"></div>
                  <div class="number">{{ maskedNumber }}</div>
                  <div class="name">{{ card.name || 'NOMBRE' }}</div>
                  <div class="expiry">Válida hasta {{ card.expiry || '--/--' }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="cards.length" class="cards-list">
            <article v-for="c in cards" :key="c.id" class="saved-card">
              <div class="left">**** **** **** {{ c.last4 }}</div>
              <div class="right">{{ c.name }}</div>
            </article>
          </div>

        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()
const showAdd = ref(false)
const cards = ref<any[]>([])

const card = ref({ number: '', name: '', expiry: '', cvc: '', pais: 'Bolivia', departamento: '', provincia: '', ciudad: '' })

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

function logout() { authStore.logout() }
function cancelAdd() { showAdd.value = false }

const maskedNumber = computed(() => {
  const n = (card.value.number || '').replace(/\s+/g,'')
  if (!n) return '•••• •••• •••• ••••'
  const groups = n.padEnd(16,'•').match(/.{1,4}/g) || []
  return groups.join(' ')
})

function submitCard() {
  // In this version we simulate saving. If you want, we can add a backend endpoint.
  const last4 = card.value.number.replace(/\s+/g,'').slice(-4)
  cards.value.push({ id: Date.now(), last4, name: card.value.name })
  ;(window as any).__app_toasts?.push?.('Tarjeta añadida (simulada).', 'success')
  showAdd.value = false
  card.value = { number: '', name: '', expiry: '', cvc: '', pais: 'Bolivia', departamento: '', provincia: '', ciudad: '' }
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

.empty-title { text-align:center; font-weight:700; padding:40px 0 }
.add-card-grid { display:flex; gap:18px }
.card-form { flex:1 }
.card-preview { width:320px; display:flex; align-items:center; justify-content:center }
.preview-cc { width:300px; height:180px; background:#bdbdbd; border-radius:12px; padding:18px; color:#fff; display:flex; flex-direction:column; justify-content:space-between }
.preview-cc .chip { width:48px; height:34px; background:#e0e0e0; border-radius:6px }
.preview-cc .number { font-weight:700; font-size:1.1rem; letter-spacing:2px }
.preview-cc .name { font-weight:700 }
.preview-cc .expiry { font-size:0.9rem }
.field { margin-bottom:10px }
.field label { display:block; font-size:0.95rem; font-weight:700; margin-bottom:6px }
.field input, .field select { width:100%; padding:10px; border-radius:6px; border:1px solid #e6e6e6 }
.btn-primary { background:#000; color:#fff; padding:10px 14px; border-radius:6px; border:none }
.btn-ghost { background:transparent; border:1px solid #eee; padding:10px 14px; border-radius:6px }
.cards-list { margin-top:12px }
.saved-card { display:flex; justify-content:space-between; padding:12px; border-radius:8px; border:1px solid #f1f1f1; margin-bottom:8px }
@media (max-width: 900px) { .profile-layout { grid-template-columns: 1fr } .add-card-grid { flex-direction:column } .card-preview { width:100%; justify-content:flex-start } }
</style>
