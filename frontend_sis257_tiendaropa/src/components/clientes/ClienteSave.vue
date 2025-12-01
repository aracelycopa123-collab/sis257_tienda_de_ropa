<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Cliente, ClienteDTO } from '@/models/cliente'
import http from '@/plugins/axios'

const props = defineProps<{
  show: boolean
  cliente?: Cliente
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const nombre = ref('')
const apellido = ref('')
const telefono = ref('')
const direccion = ref('')
const isEdit = ref(false)

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (props.cliente) {
        isEdit.value = true
        nombre.value = props.cliente.nombre
        apellido.value = props.cliente.apellido || ''
        telefono.value = props.cliente.telefono || ''
        direccion.value = props.cliente.direccion || ''
      } else {
        isEdit.value = false
        resetForm()
      }
    }
  }
)

const resetForm = () => {
  nombre.value = ''
  apellido.value = ''
  telefono.value = ''
  direccion.value = ''
}

const guardarCliente = async () => {
  if (!nombre.value.trim()) {
    alert('El nombre es obligatorio')
    return
  }

  const clienteData: ClienteDTO = {
    nombre: nombre.value,
    apellido: apellido.value || undefined,
    telefono: telefono.value || undefined,
    direccion: direccion.value || undefined,
  }

  try {
    if (isEdit.value && props.cliente) {
      await http.patch(`clientes/${props.cliente.id}`, clienteData)
    } else {
      await http.post('clientes', clienteData)
    }
    emit('saved')
    cerrarModal()
  } catch (error: any) {
    console.error('Error al guardar cliente:', error)
    const mensaje = error.response?.data?.message || 'No se pudo guardar el cliente'
    alert(Array.isArray(mensaje) ? mensaje.join('\n') : mensaje)
  }
}

const cerrarModal = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">{{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}</h2>
            <button @click="cerrarModal" class="modal-close" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="guardarCliente" class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label for="nombre" class="form-label">Nombre *</label>
                <input
                  v-model="nombre"
                  type="text"
                  class="form-input"
                  id="nombre"
                  placeholder="Nombre del cliente"
                  maxlength="50"
                  required
                  autofocus
                />
              </div>

              <div class="form-group">
                <label for="apellido" class="form-label">Apellido</label>
                <input
                  v-model="apellido"
                  type="text"
                  class="form-input"
                  id="apellido"
                  placeholder="Apellido del cliente"
                  maxlength="50"
                />
              </div>

              <div class="form-group">
                <label for="telefono" class="form-label">Teléfono</label>
                <input
                  v-model="telefono"
                  type="tel"
                  class="form-input"
                  id="telefono"
                  placeholder="+591 71234567"
                  maxlength="30"
                />
              </div>

              <div class="form-group">
                <label for="direccion" class="form-label">Dirección</label>
                <input
                  v-model="direccion"
                  type="text"
                  class="form-input"
                  id="direccion"
                  placeholder="Dirección completa"
                  maxlength="100"
                />
              </div>
            </div>

            <!-- Footer -->
            <div class="modal-footer">
              <button type="button" @click="cerrarModal" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                {{ isEdit ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Overlay del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* Contenedor del modal */
.modal-container {
  background: #ffffff;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Header del modal */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px;
  border-bottom: 1px solid #e5e5e5;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: -0.5px;
  color: #000000;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #666666;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: #000000;
}

/* Body del modal */
.modal-body {
  padding: 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  color: #666666;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.form-input {
  width: 100%;
  height: 54px;
  border: 1px solid #e5e5e5;
  border-radius: 0;
  font-size: 0.9375rem;
  color: #000000;
  background: #ffffff;
  padding: 0 16px;
  transition: all 0.2s ease;
}

.form-input::placeholder {
  color: #d1d5db;
  font-weight: 300;
}

.form-input:focus {
  outline: none;
  border-color: #000000;
}

/* Footer del modal */
.modal-footer {
  display: flex;
  gap: 12px;
  padding-top: 30px;
  border-top: 1px solid #e5e5e5;
  margin-top: 30px;
}

.btn-primary {
  background: #000000;
  color: #ffffff;
  border: none;
  padding: 14px 32px;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.btn-primary:hover {
  background: #333333;
}

.btn-secondary {
  background: transparent;
  color: #000000;
  border: 1px solid #e5e5e5;
  padding: 14px 32px;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.btn-secondary:hover {
  background: #fafafa;
  border-color: #000000;
}

/* Animación del modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .modal-header {
    padding: 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }
}
</style>
