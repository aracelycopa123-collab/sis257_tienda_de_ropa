<template>
  <div class="profile-page">
    <div class="container">
      <div class="page-header-row">
        <h2 class="page-title">Mi perfil</h2>
      </div>

      <!-- Confirm dialog (used instead of native confirm) -->
      <div v-if="confirmDialog.visible" class="modal-overlay" @click.self="confirmCancel">
        <div class="modal card">
          <div class="modal-header">
            <h4>Confirmar</h4>
            <button class="btn btn-ghost" @click="confirmCancel">✕</button>
          </div>
          <div style="margin-top:8px">{{ confirmDialog.message }}</div>
          <div style="margin-top:12px; display:flex; gap:8px; justify-content:flex-end">
            <button class="btn btn-ghost" @click="confirmCancel">Cancelar</button>
            <button class="btn btn-primary" @click="confirmAccept">Confirmar</button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="loading">Cargando perfil…</div>

      <div v-else>
        <div :class="['profile-layout', { 'with-orders': showOrders }]">
          <section class="profile-card card">
            <div class="profile-top">
              <div class="avatar">{{ initials }}</div>
              <div class="meta">
                <h3>{{ profile?.nombre || profile?.usuario?.nombreUsuario || 'Usuario' }}</h3>
                <div class="muted">{{ profile?.usuario?.email || '' }}</div>
              </div>
              <div class="actions">
                <div style="display:flex;flex-direction:column;gap:10px;align-items:flex-end">
                  <button class="btn control-box" @click="openModal('orders')">Mis pedidos</button>
                  <button class="btn control-box btn-primary" @click="openModal('edit')">Editar perfil</button>
                </div>
              </div>
            </div>

            <div class="profile-content">
              <div class="info">
                <div class="info-row"><label>Nombre</label><div>{{ profile?.nombre || '—' }}</div></div>
                <div class="info-row"><label>Apellido</label><div>{{ profile?.apellido || '—' }}</div></div>
                <div class="info-row"><label>Teléfono</label><div>{{ profile?.telefono || '—' }}</div></div>
              </div>

              <div v-if="editMode" class="edit">
                <form class="edit-form" @submit.prevent="save">
                  <div class="field"><label>Nombre</label><input v-model="form.nombre" /></div>
                  <div class="field"><label>Apellido</label><input v-model="form.apellido" /></div>
                  <div class="form-actions"><button class="btn btn-primary" type="submit">Guardar</button> <button type="button" class="btn btn-ghost" @click="cancelEdit">Cancelar</button></div>
                </form>
                <div v-if="saveMessage" class="save-message">{{ saveMessage }}</div>
              </div>
            </div>
          </section>

          <!-- (mobile drawer/backdrop removed - using side modal instead) -->

          <!-- Center column: orders area on desktop. On mobile it becomes a drawer. -->
          <!-- Center column: reserved for content. Orders and edit now open in side modal -->
          <section class="center-area">
            <div class="muted">Presiona "Mis pedidos" o "Editar perfil" para abrir la ventana lateral.</div>
          </section>

          <!-- Right column removed: actions now live in the profile card -->
        </div>

        <!-- Side modal + backdrop (shows orders or edit form) -->
        <div v-if="modalType" class="side-modal-backdrop" @click.self="closeModal"></div>
        <aside v-if="modalType" class="side-modal card" :class="{ open: Boolean(modalType) }">
          <div class="modal-header">
            <h4 v-if="modalType === 'orders'">Mis pedidos</h4>
            <h4 v-else>Editar perfil</h4>
            <button class="btn btn-ghost" @click="closeModal">✕</button>
          </div>

          <div v-if="modalType === 'orders'" class="modal-body">
            <div v-if="!(profile?.ventas && profile.ventas.length)" class="no-orders modern-empty">No tienes pedidos aún</div>
            <div v-else class="orders-list">
              <article v-for="venta in profile.ventas" :key="venta.id" class="order-card" @click="openOrder(venta.id)">
                <div class="order-main">
                  <div style="display:flex;gap:12px;align-items:center">
                    <img :src="getFirstImage(venta)" alt="producto" class="order-thumb" />
                    <div class="order-meta">
                      <div class="order-id">Pedido #{{ venta.id }}</div>
                      <div class="order-date">{{ formatDate(venta.fechaCreacion) }}</div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div v-else class="modal-body">
            <form class="edit-form" @submit.prevent="saveInModal">
              <div class="field"><label>Nombre</label><input v-model="form.nombre" /></div>
              <div class="field"><label>Apellido</label><input v-model="form.apellido" /></div>
              <div class="field"><label>Teléfono</label><input v-model="form.telefono" /></div>
              <div class="form-actions"><button class="btn btn-primary" type="submit">Guardar</button> <button type="button" class="btn btn-ghost" @click="closeModal">Cancelar</button></div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
                import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
                import { RouterLink } from 'vue-router'
                import { useAuthStore } from '@/stores'
                import http from '@/plugins/axios'

                const authStore = useAuthStore()
                const profile = ref<any>(null)
                const loading = ref<boolean>(false)
                const error = ref<string | null>(null)
                const editMode = ref<boolean>(false)
                const saveMessage = ref<string>('')
                const form = reactive({ nombre: '', apellido: '', telefono: '', direccion: '' })

                const selectedOrder = ref<any>(null)
                const orderLoading = ref<boolean>(false)
                const orderError = ref<string | null>(null)

                const confirmingReceipt = ref<boolean>(false)
                const showOrders = ref<boolean>(false)
                const modalType = ref<'orders' | 'edit' | null>(null)
                const isMobile = ref<boolean>(false)

                function updateIsMobile() {
                  isMobile.value = window.innerWidth <= 880
                }

                onMounted(() => {
                  updateIsMobile()
                  window.addEventListener('resize', updateIsMobile)
                  void load()
                })
                onUnmounted(() => {
                  window.removeEventListener('resize', updateIsMobile)
                })

                const initials = computed(() => {
                  const name = profile.value?.usuario?.nombreUsuario || profile.value?.nombre || ''
                  return (name.charAt(0) || 'U').toUpperCase()
                })

                function formatDate(value: string | Date | undefined) {
                  if (!value) return '—'
                  const d = typeof value === 'string' ? new Date(value) : value
                  return new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }).format(d)
                }

                function formatCurrency(value: number | null | undefined) {
                  if (value === null || typeof value === 'undefined') return '—'
                  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(value))
                }

                function formatPayment(method: string | undefined) {
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

                function statusClass(status: string | undefined) {
                  const s = (status || '').toLowerCase()
                  if (s.includes('pend')) return 'yellow'
                  if (s.includes('proc') || s.includes('proces')) return 'blue'
                  if (s.includes('env') || s.includes('enviado')) return 'info'
                  if (s.includes('entreg') || s.includes('deliv')) return 'green'
                  if (s.includes('cancel') || s.includes('anul')) return 'red'
                  return 'gray'
                }

                function statusLabel(status: string | undefined) {
                  if (!status) return '—'
                  const s = status.toLowerCase()
                  if (s.includes('pend')) return 'Pendiente'
                  if (s.includes('env')) return 'Enviado'
                  if (s.includes('entreg') || s.includes('deliv')) return 'Entregado'
                  if (s.includes('anul') || s.includes('cancel')) return 'Anulada'
                  if (s.includes('realiz') || s.includes('confirm')) return 'Confirmada'
                  return status
                }

                function getFirstImage(venta: any) {
                  try {
                    const det = venta?.ventadetalles?.[0]
                    const img = det?.producto?.imagenes || det?.producto?.imagen || det?.producto?.imagenes
                    return img || '/placeholder.jpg'
                  } catch (e) {
                    return '/placeholder.jpg'
                  }
                }

                function productsSummary(venta: any) {
                  const items = venta?.ventadetalles || []
                  if (!items.length) return 'Sin productos listados'
                  const names = items.slice(0,3).map((d: any) => d.producto?.nombre || d.producto?.nombreProducto || 'Producto')
                  const more = items.length > 3 ? ` +${items.length - 3} más` : ''
                  return names.join(', ') + more
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
                    error.value = err?.response?.data?.message || err?.response?.data || err?.message || 'Error al cargar el perfil';
                    (window.console as any).error('Error cargando /clientes/me', err)
                  } finally {
                    loading.value = false
                  }
                }

                async function save() {
                  if (!profile.value) return
                  try {
                    await http.patch(`clientes/${profile.value.id}`, { ...form });
                    editMode.value = false
                    saveMessage.value = 'Perfil actualizado correctamente.'
                    await load();
                  } catch (err: any) {
                    saveMessage.value = err?.response?.data?.message || 'Error guardando datos';
                    (window.console as any).error('Error guardando cliente', err)
                  }
                }

                function toggleEdit() {
                  editMode.value = !editMode.value
                }

                function openEditInline() {
                  // close any side modal and open the inline edit area
                  modalType.value = null
                  editMode.value = true
                  // ensure form is populated with current values
                  if (profile.value) {
                    form.nombre = profile.value.nombre || ''
                    form.apellido = profile.value.apellido || ''
                    form.telefono = profile.value.telefono || ''
                    form.direccion = profile.value.direccion || ''
                  }
                }

                function openModal(type: 'orders' | 'edit') {
                  modalType.value = type
                }
                function closeModal() {
                  modalType.value = null
                }

                async function saveInModal() {
                  if (!profile.value) return
                  try {
                    await http.patch(`clientes/${profile.value.id}`, { ...form });
                    (window as any).__app_toasts.push('Perfil actualizado correctamente.', 'success')
                    await load();
                    closeModal()
                  } catch (err: any) {
                    (window as any).__app_toasts.push(err?.response?.data?.message || 'Error guardando datos', 'error')
                    (window.console as any).error('Error guardando cliente', err)
                  }
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

                async function openOrder(id: number) {
                  orderLoading.value = true
                  orderError.value = null
                  selectedOrder.value = null
                  try {
                    const res = await http.get(`ventas/${id}`)
                    selectedOrder.value = res.data
                  } catch (err: any) {
                    orderError.value = err?.response?.data?.message || err?.message || 'Error al cargar el pedido';
                    (window.console as any).error('Error cargando venta', err)
                  } finally {
                    orderLoading.value = false
                  }
                }

                function closeOrder() {
                  selectedOrder.value = null
                  orderError.value = null
                }

                // --- confirm dialog (local) ---
                const confirmDialog = reactive<{ visible: boolean; message: string; resolve: (v: boolean) => void }>({
                  visible: false,
                  message: '',
                  resolve: () => {},
                })

                function showConfirm(message: string) {
                  return new Promise<boolean>((resolve) => {
                    confirmDialog.message = message
                    confirmDialog.visible = true
                    confirmDialog.resolve = resolve
                  })
                }

                function confirmAccept() {
                  confirmDialog.visible = false
                  confirmDialog.resolve(true)
                }
                function confirmCancel() {
                  confirmDialog.visible = false
                  confirmDialog.resolve(false)
                }

                async function confirmReceipt(id: number) {
                  if (!selectedOrder.value) return
                  const ok = await showConfirm('¿Confirmas que recibiste este pedido? Esto marcará el pedido como entregado.')
                  if (!ok) return
                  confirmingReceipt.value = true
                  try {
                    await http.patch(`ventas/${id}`, { estado: 'entregada' })
                    const res = await http.get(`ventas/${id}`)
                    selectedOrder.value = res.data
                    await load();
                    (window as any).__app_toasts.push('Pedido marcado como entregado. Gracias por confirmar.', 'success')
                  } catch (err: any) {
                    (window.console as any).error('Error confirmando recepción', err)
                    (window as any).__app_toasts.push(err?.response?.data?.message || 'Error al confirmar la recepción', 'error')
                  } finally {
                    confirmingReceipt.value = false
                  }
                }

                async function createProfile() {
                  try {
                    loading.value = true
                    const payload = { nombre: authStore.user || '', apellido: '' }
                    await http.post('clientes/me', payload)
                    await load();
                    (window as any).__app_toasts.push('Perfil creado correctamente.', 'success')
                  } catch (err: any) {
                    (window.console as any).error('Error creando cliente', err)
                    (window as any).__app_toasts.push(err?.response?.data?.message || 'Error al crear perfil', 'error')
                  } finally {
                    loading.value = false
                  }
                }
                </script>

                <style scoped>
                /* (styles kept as previously) */
                .container { max-width: 1100px; margin: 28px auto; padding: 0 18px }
                .page-title { font-size: 1.5rem; margin-bottom: 18px }
                .page-header-row { display:flex; align-items:center; gap:12px }
                .profile-layout { display: grid; grid-template-columns: 1fr; gap: 20px }
                .profile-layout.with-orders { grid-template-columns: 1fr 360px }
                .card { background: #fff; border-radius: 8px; box-shadow: 0 6px 18px rgba(15,15,15,0.06); padding: 18px }
                .profile-top { display:flex; align-items:center; gap:16px }
                .avatar { width:72px; height:72px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:22px; color:#ffffff; background: linear-gradient(135deg,#4b6cb7 0%,#182848 100%); box-shadow: 0 6px 18px rgba(24,40,72,0.12) }
                .meta h3 { margin:0 }
                .muted { color:#777; font-size:0.9rem }
                .actions { margin-left:auto }
                .btn { padding:8px 12px; border-radius:6px; border:1px solid transparent; cursor:pointer }
                .btn-outline { background:transparent; border:1px solid #ddd }
                .btn-primary { background:#111; color:#fff }
                .btn-ghost { background:transparent; color:#111; border:1px solid #eee }
                .profile-content { display:flex; flex-direction:column; gap:12px; margin-top:16px }
                .info { width:100% }
                .info-row { display:flex; flex-direction:column; padding:12px 0; border-bottom:1px dashed #f1f1f1 }
                .info-row label { color:#666; margin-bottom:6px }
                .edit { width:100%; margin-top:6px }
                .edit-form .field { margin-bottom:10px }
                .edit-form label { display:block; font-size:0.9rem; color:#444; margin-bottom:6px }
                .edit-form input { width:100%; padding:8px; border-radius:6px; border:1px solid #e6e6e6 }
                .form-actions { display:flex; gap:8px; margin-top:8px }
                .save-message { margin-top:8px; color:green }
                .orders-card h3 { margin-top:0 }
                .orders-header { margin-bottom:8px }
                .orders-list { display:flex; flex-direction:column; gap:12px; margin-top:8px }
                .order-card { display:block; padding:14px; border-radius:10px; box-shadow:0 6px 18px rgba(15,15,15,0.04); background:#fff; border:1px solid #f1f3f5 }
                .order-main { display:flex; justify-content:space-between; align-items:center; gap:12px }
                .order-meta { display:flex; flex-direction:column }
                .order-id { font-weight:600 }
                .order-date { color:#777; font-size:0.9rem }
                .order-body { display:flex; justify-content:space-between; align-items:center; margin-top:10px }
                .order-left { display:flex; flex-direction:column; gap:6px }
                .order-info { color:#444 }
                .order-actions { display:flex; gap:8px }
                .order-thumb { width:64px; height:64px; object-fit:cover; border-radius:8px; box-shadow:0 6px 18px rgba(15,15,15,0.06) }
                .product-summary { color:#666; font-size:0.95rem }

                .order-card { transition: transform 160ms ease, box-shadow 160ms ease }
                .order-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(15,15,15,0.08) }
                @media (max-width: 880px) {
                  .profile-layout.with-orders { grid-template-columns: 1fr }
                  .profile-content { margin-top:8px }
                  .profile-top { gap:10px }
                }

                /* Two-column layout for desktop: profile / content */
                .profile-layout { grid-template-columns: 420px 1fr }
                .orders-area { padding: 20px }
                .control-box { padding:10px 14px; border-radius:8px; background: #111; border:1px solid rgba(0,0,0,0.08); color:#fff }
                .control-box.btn-primary { background:#000; color:#fff; border-color:transparent }

                /* Drawer styles for mobile (orders-area behaves as drawer) */
                .orders-area.drawer { position: fixed; right: 0; top: 0; bottom: 0; width: 92%; max-width: 420px; transform: translateX(100%); transition: transform 260ms cubic-bezier(.2,.9,.3,1); z-index: 1200; box-shadow: -8px 0 30px rgba(15,15,15,0.12) }
                .orders-area.drawer.open { transform: translateX(0) }

                /* Side modal used for orders/edit */
                .side-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 1150 }
                .side-modal { position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%) scale(.98); width: min(1000px, 92%); max-height: 86vh; opacity: 0; transition: all 260ms cubic-bezier(.2,.9,.3,1); z-index: 1160; overflow:auto; padding: 20px }
                .side-modal.open { transform: translate(-50%, -50%) scale(1); opacity: 1 }
                @media (max-width: 880px) {
                  .side-modal { right: 0; top: 0; left: 0; height: 100%; width: 100%; max-width: 100%; border-radius:0; transform: none }
                }

                /* Drawer styles for mobile */
                .orders-card.drawer { position: fixed; right: 0; top: 0; bottom: 0; width: 92%; max-width: 420px; transform: translateX(100%); transition: transform 260ms cubic-bezier(.2,.9,.3,1); z-index: 1200; box-shadow: -8px 0 30px rgba(15,15,15,0.12) }
                .orders-card.drawer.open { transform: translateX(0) }
                .drawer-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 1100 }

                /* small animation for the orders list */
                .orders-list .order-card { transform: translateY(8px); opacity: 0; transition: all 220ms ease }
                .orders-list .order-card:nth-child(1) { transition-delay: 30ms }
                .orders-list .order-card:nth-child(2) { transition-delay: 60ms }
                .orders-list .order-card:nth-child(3) { transition-delay: 90ms }
                .orders-card.open .orders-list .order-card { transform: translateY(0); opacity: 1 }

                /* Visual: hacer la tarjeta de perfil más vertical y con mayor padding */
                .profile-card { padding: 24px }
                .profile-card .meta h3 { font-size:1.15rem }
                .orders-card { padding: 22px }
                .fade-enter-active, .fade-leave-active { transition: opacity 220ms ease, transform 220ms ease }
                .fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px) }
                .modern-empty { display:flex; gap:12px; align-items:center; padding:18px; border-radius:10px; background:#fff; box-shadow:0 6px 18px rgba(15,15,15,0.04) }
                .empty-illustration { font-size:34px; background:linear-gradient(135deg,#eceff1,#ffffff); border-radius:8px; padding:8px }
                .empty-title { font-weight:600 }
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

/* small animation for the orders list */
.orders-list .order-card { transform: translateY(8px); opacity: 0; transition: all 220ms ease }
.orders-list .order-card:nth-child(1) { transition-delay: 30ms }
.orders-list .order-card:nth-child(2) { transition-delay: 60ms }
.orders-list .order-card:nth-child(3) { transition-delay: 90ms }
.orders-card.open .orders-list .order-card { transform: translateY(0); opacity: 1 }

/* Visual: hacer la tarjeta de perfil más vertical y con mayor padding */
.profile-card { padding: 24px }
.profile-card .meta h3 { font-size:1.15rem }
.orders-card { padding: 22px }
.fade-enter-active, .fade-leave-active { transition: opacity 220ms ease, transform 220ms ease }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px) }
.modern-empty { display:flex; gap:12px; align-items:center; padding:18px; border-radius:10px; background:#fff; box-shadow:0 6px 18px rgba(15,15,15,0.04) }
.empty-illustration { font-size:34px; background:linear-gradient(135deg,#eceff1,#ffffff); border-radius:8px; padding:8px }
.empty-title { font-weight:600 }
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
