<template>
  <div class="container">
    <h2>Mi perfil</h2>

    <div v-if="loading">Cargando...</div>
    <div v-else-if="profile">
      <p><strong>Usuario:</strong> {{ profile.usuario?.nombreUsuario || '—' }}</p>
      <p><strong>Nombre:</strong> {{ profile.nombre || '—' }}</p>
      <p><strong>Apellido:</strong> {{ profile.apellido || '—' }}</p>
      <p><strong>Teléfono:</strong> {{ profile.telefono || '—' }}</p>
      <p><strong>Dirección:</strong> {{ profile.direccion || '—' }}</p>
      <button @click="editMode = !editMode">Editar</button>

      <div v-if="editMode">
        <h3>Editar datos</h3>
        <form @submit.prevent="save">
          <div>
            <label>Nombre</label>
            <input v-model="form.nombre" />
          </div>
          <div>
            <label>Apellido</label>
            <input v-model="form.apellido" />
          </div>
          <div>
            <label>Teléfono</label>
            <input v-model="form.telefono" />
          </div>
          <div>
            <label>Dirección</label>
            <input v-model="form.direccion" />
          </div>
          <button type="submit">Guardar</button>
        </form>
      </div>

      <section style="margin-top:20px">
        <h3>Pedidos</h3>
        <div v-if="!(profile.ventas && profile.ventas.length)">No hay pedidos aún.</div>
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
            <tr v-for="venta in profile.ventas" :key="venta.id">
              <td>{{ venta.id }}</td>
              <td>{{ formatDate(venta.fechaCreacion) }}</td>
              <td>{{ venta.estado }}</td>
              <td>{{ formatPayment(venta.metodoPago) }}</td>
              <td>{{ formatCurrency(venta.totalVenta) }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
    <div v-else>
      <p>No se encontró perfil. ¿Iniciaste sesión?</p>
      <p v-if="error" style="color:crimson">{{ error }}</p>
      <div style="margin-top:12px;display:flex;gap:8px">
        <RouterLink to="/login" class="btn-login">Iniciar Sesión</RouterLink>
        <RouterLink to="/register" class="btn-register">Registrarse</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores'
import http from '@/plugins/axios'

const authStore = useAuthStore()
const profile = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const editMode = ref(false)
const form = reactive({ nombre: '', apellido: '', telefono: '', direccion: '' })

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

async function load() {
  loading.value = true
  try {
    const res = await http.get('clientes/me')
    profile.value = res.data
    form.nombre = profile.value.nombre || ''
    form.apellido = profile.value.apellido || ''
    form.telefono = profile.value.telefono || ''
    form.direccion = profile.value.direccion || ''
  } catch (err: any) {
    profile.value = null
    // capture possible server message
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
    await load()
  } catch (err) {
    console.error(err)
  }
}

onMounted(load)
</script>

<style scoped>
.container { max-width: 720px; margin: 24px auto }
.orders-table { width: 100%; border-collapse: collapse; margin-top: 8px }
.orders-table th, .orders-table td { border: 1px solid #eee; padding: 8px; text-align: left }
.orders-table th { background: #fafafa }
</style>
