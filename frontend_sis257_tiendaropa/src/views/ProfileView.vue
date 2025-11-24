<template>
  <div class="profile-page">
    <div class="container">
      <h2 class="page-title">Mi perfil</h2>

      <div v-if="loading" class="loading">Cargando perfil…</div>

      <div v-else-if="profile" class="profile-layout">
        <section class="profile-card card">
          <div class="profile-top">
            <div class="avatar">{{ initials }}</div>
            <div class="meta">
              <h3>{{ profile.usuario?.nombreUsuario || '—' }}</h3>
              <div class="muted">Miembro desde: {{ formatDate(profile.usuario?.fechaCreacion || profile.fechaCreacion) }}</div>
            </div>
            <div class="actions">
              <button class="btn btn-outline" @click="toggleEdit">{{ editMode ? 'Cancelar' : 'Editar perfil' }}</button>
            </div>
          </div>

          <div class="profile-content">
            <div class="info">
              <div class="info-row"><label>Nombre</label><div>{{ profile.nombre || '—' }}</div></div>
              <div class="info-row"><label>Apellido</label><div>{{ profile.apellido || '—' }}</div></div>
              <div class="info-row"><label>Teléfono</label><div>{{ profile.telefono || '—' }}</div></div>
              <div class="info-row"><label>Dirección</label><div>{{ profile.direccion || '—' }}</div></div>
            </div>

            <aside class="edit">
              <h4>Editar información</h4>
              <form class="edit-form" @submit.prevent="save">
                <div class="field"><label>Nombre</label><input v-model="form.nombre" /></div>
                <div class="field"><label>Apellido</label><input v-model="form.apellido" /></div>
                <div class="field"><label>Teléfono</label><input v-model="form.telefono" /></div>
                <div class="field"><label>Dirección</label><input v-model="form.direccion" /></div>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">Guardar</button>
                  <button type="button" class="btn btn-ghost" @click="cancelEdit">Restablecer</button>
                </div>
                <div v-if="saveMessage" class="save-message">{{ saveMessage }}</div>
              </form>
            </aside>
          </div>
        </section>
        <!-- Order details modal -->
        <div v-if="selectedOrder" class="modal-overlay" @click.self="closeOrder">
          <div class="modal card">
            <div class="modal-header">
              <h4>Pedido #{{ selectedOrder.id }}</h4>
              <button class="btn btn-ghost" @click="closeOrder">Cerrar</button>
            </div>
            <div v-if="orderLoading" class="loading">Cargando pedido…</div>
            <div v-else>
              <div class="modal-meta">
                <div>Fecha: {{ formatDate(selectedOrder.fechaCreacion) }}</div>
                <div>Estado: <span :class="['badge', statusClass(selectedOrder.estado)]">{{ selectedOrder.estado }}</span></div>
                <div>Método: {{ formatPayment(selectedOrder.metodoPago) }}</div>
              </div>

              <table class="order-details-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="det of (selectedOrder.ventadetalles || [])" :key="det.id">
                    <td>{{ det.producto?.nombre || det.producto?.nombreProducto || '—' }}</td>
                    <td>{{ det.cantidad }}</td>
                    <td>{{ formatCurrency(det.precioUnitario) }}</td>
                    <td>{{ formatCurrency(det.subtotal) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="text-align:right">Total</td>
                    <td>{{ formatCurrency(selectedOrder.totalVenta) }}</td>
                  </tr>
                </tfoot>
              </table>

              <div v-if="orderError" class="error" style="margin-top:8px">{{ orderError }}</div>
            </div>
          </div>
        </div>

        <section class="orders-card card">
          <h3>Pedidos</h3>
          <div v-if="!(profile.ventas && profile.ventas.length)" class="no-orders">No hay pedidos aún.</div>
          <table v-else class="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Método de pago</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="venta in profile.ventas" :key="venta.id" class="order-row" @click="openOrder(venta.id)">
                <td>{{ venta.id }}</td>
                <td>{{ formatDate(venta.fechaCreacion) }}</td>
                <td><span :class="['badge', statusClass(venta.estado)]">{{ venta.estado }}</span></td>
                <td>{{ formatPayment(venta.metodoPago) }}</td>
                <td>{{ formatCurrency(venta.totalVenta) }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <div v-else class="no-profile">
        <p>No se encontró perfil. ¿Iniciaste sesión?</p>
        <p v-if="error" class="error">{{ error }}</p>
        <div style="margin-top:12px;display:flex;gap:8px">
          <RouterLink to="/login" class="btn-login">Iniciar Sesión</RouterLink>
          <RouterLink to="/register" class="btn-register">Registrarse</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores'
import http from '@/plugins/axios'

const authStore = useAuthStore()
const profile = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const editMode = ref(false)
const saveMessage = ref('')
const form = reactive({ nombre: '', apellido: '', telefono: '', direccion: '' })

const selectedOrder = ref<any>(null)
const orderLoading = ref(false)
const orderError = ref<string | null>(null)

const initials = computed(() => {
  const name = profile.value?.usuario?.nombreUsuario || profile.value?.nombre || ''
  return (name.charAt(0) || 'U').toUpperCase()
})

function formatDate(value: string | Date) {
  if (!value) return '—'
  const d = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }).format(d)
}

function formatCurrency(value: number) {
  if (value === null || typeof value === 'undefined') return '—'
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(value))
}

function formatPayment(method: string) {
  if (!method) return '—'
  const map: Record<string,string> = {
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia',
    qr: 'QR',
    'cotización': 'Cotización',
    otro: 'Otro',
  }
  return map[method] || method
}

function statusClass(status: string) {
  const s = (status || '').toLowerCase()
  if (s.includes('pend')) return 'yellow'
  if (s.includes('proc') || s.includes('proces')) return 'blue'
  if (s.includes('env') || s.includes('enviado')) return 'info'
  if (s.includes('entreg') || s.includes('deliv')) return 'green'
  if (s.includes('cancel') || s.includes('anul')) return 'red'
  return 'gray'
}

async function load() {
  loading.value = true
  try {
    const res = await http.get('clientes/me')
    profile.value = res.data
    form.nombre = profile.value.nombre || ''
    form.apellido = profile.value.apellido || ''
    form.telefono = profile.value.telefono || ''
    form.direccion = profile.value.direccion || ''
    saveMessage.value = ''
  } catch (err: any) {
    profile.value = null
    error.value = err?.response?.data?.message || err?.response?.data || err?.message || 'Error al cargar el perfil'
    console.error('Error cargando /clientes/me', err)
  } finally {
    loading.value = false
  }
}

async function save() {
  if (!profile.value) return
  try {
    await http.patch(`clientes/${profile.value.id}`, { ...form })
    editMode.value = false
    saveMessage.value = 'Perfil actualizado correctamente.'
    await load()
  } catch (err: any) {
    saveMessage.value = err?.response?.data?.message || 'Error guardando datos'
    console.error('Error guardando cliente', err)
  }
}

function toggleEdit() {
  editMode.value = !editMode.value
}

function cancelEdit() {
  if (profile.value) {
    form.nombre = profile.value.nombre || ''
    form.apellido = profile.value.apellido || ''
    form.telefono = profile.value.telefono || ''
    form.direccion = profile.value.direccion || ''
  }
  editMode.value = false
  saveMessage.value = ''
}

onMounted(load)

async function openOrder(id: number) {
  orderLoading.value = true
  orderError.value = null
  selectedOrder.value = null
  try {
    const res = await http.get(`ventas/${id}`)
    selectedOrder.value = res.data
  } catch (err: any) {
    orderError.value = err?.response?.data?.message || err?.message || 'Error al cargar el pedido'
    console.error('Error cargando venta', err)
  } finally {
    orderLoading.value = false
  }
}

function closeOrder() {
  selectedOrder.value = null
  orderError.value = null
}
</script>

<style scoped>
.container { max-width: 1100px; margin: 28px auto; padding: 0 18px }
.page-title { font-size: 1.5rem; margin-bottom: 18px }
.profile-layout { display: grid; grid-template-columns: 1fr 430px; gap: 20px }
.card { background: #fff; border-radius: 8px; box-shadow: 0 6px 18px rgba(15,15,15,0.06); padding: 18px }
.profile-top { display:flex; align-items:center; gap:16px }
.avatar { width:64px; height:64px; border-radius:50%; background:#f0f0f0; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:20px }
.meta h3 { margin:0 }
.muted { color:#777; font-size:0.9rem }
.actions { margin-left:auto }
.btn { padding:8px 12px; border-radius:6px; border:1px solid transparent; cursor:pointer }
.btn-outline { background:transparent; border:1px solid #ddd }
.btn-primary { background:#111; color:#fff }
.btn-ghost { background:transparent; color:#111; border:1px solid #eee }
.profile-content { display:flex; gap:20px; margin-top:16px }
.info { flex:1 }
.info-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px dashed #f1f1f1 }
.info-row label { color:#666; width:120px }
.edit { width:360px }
.edit-form .field { margin-bottom:10px }
.edit-form label { display:block; font-size:0.9rem; color:#444; margin-bottom:6px }
.edit-form input { width:100%; padding:8px; border-radius:6px; border:1px solid #e6e6e6 }
.form-actions { display:flex; gap:8px; margin-top:8px }
.save-message { margin-top:8px; color:green }
.orders-card h3 { margin-top:0 }
.orders-table { width:100%; border-collapse:collapse; margin-top:8px }
.orders-table th, .orders-table td { border-bottom:1px solid #f0f0f0; padding:10px; text-align:left }
.orders-table th { color:#666; font-size:0.9rem }
.badge { padding:6px 10px; border-radius:999px; color:#fff; font-size:0.85rem }
.badge.yellow { background:#f6b93b }
.badge.blue { background:#0984e3 }
.badge.info { background:#00a8ff }
.badge.green { background:#00b894 }
.badge.red { background:#e55039 }
.badge.gray { background:#b2bec3 }
.no-orders { color:#666 }
.loading { color:#666 }
.no-profile { padding:20px }
.error { color:crimson }

.order-row { cursor: pointer }
.order-row:hover { background:#fafafa }

.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:1200 }
.modal { width:90%; max-width:720px; padding:18px }
.modal-header { display:flex; align-items:center; justify-content:space-between; gap:12px }
.modal-meta { display:flex; gap:12px; flex-wrap:wrap; margin:12px 0 }
.order-details-table { width:100%; border-collapse:collapse; margin-top:8px }
.order-details-table th, .order-details-table td { padding:8px; border-bottom:1px solid #f0f0f0 }


@media (max-width: 900px) {
  .profile-layout { grid-template-columns: 1fr; }
  .edit { width:100% }
}
</style>
