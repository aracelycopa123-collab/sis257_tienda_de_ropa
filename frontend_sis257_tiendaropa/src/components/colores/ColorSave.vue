<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Color, ColorDTO } from '@/models/color'
import http from '@/plugins/axios'

const props = defineProps<{
  show: boolean
  color?: Color
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const nombre = ref('')
const codigoHex = ref('#000000')
const isEdit = ref(false)

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (props.color) {
        isEdit.value = true
        nombre.value = props.color.nombre
        codigoHex.value = props.color.codigoHex || '#000000'
      } else {
        isEdit.value = false
        resetForm()
      }
    }
  }
)

const resetForm = () => {
  nombre.value = ''
  codigoHex.value = '#000000'
}

const guardarColor = async () => {
  if (!nombre.value.trim()) {
    alert('El nombre del color es obligatorio')
    return
  }

  const colorData: ColorDTO = {
    nombre: nombre.value.trim(),
    codigoHex: codigoHex.value,
  }

  try {
    if (isEdit.value && props.color) {
      await http.patch(`colores/${props.color.id}`, colorData)
    } else {
      await http.post('colores', colorData)
    }
    emit('saved')
    cerrarModal()
  } catch (error: any) {
    console.error('Error al guardar color:', error)
    const mensaje = error.response?.data?.message || 'No se pudo guardar el color'
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
            <h2 class="modal-title">{{ isEdit ? 'Editar Color' : 'Nuevo Color' }}</h2>
            <button @click="cerrarModal" class="modal-close" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="guardarColor" class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label for="nombre" class="form-label">Nombre del Color *</label>
                <input
                  v-model="nombre"
                  type="text"
                  class="form-input"
                  id="nombre"
                  placeholder="Ej: Rojo, Azul Marino"
                  maxlength="50"
                  required
                  autofocus
                />
              </div>

              <div class="form-group">
                <label for="codigoHex" class="form-label">Código de Color</label>
                <div class="color-picker-wrapper">
                  <input
                    v-model="codigoHex"
                    type="color"
                    class="form-color"
                    id="codigoHex"
                  />
                  <input
                    v-model="codigoHex"
                    type="text"
                    class="form-input color-code"
                    placeholder="#000000"
                    maxlength="7"
                  />
                  <div class="color-preview" :style="{ backgroundColor: codigoHex }"></div>
                </div>
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

.modal-container {
  background: #ffffff;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

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

.modal-body {
  padding: 30px;
}

.form-grid {
  display: flex;
  flex-direction: column;
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

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-color {
  width: 54px;
  height: 54px;
  border: 1px solid #e5e5e5;
  border-radius: 0;
  cursor: pointer;
  padding: 4px;
}

.color-code {
  flex: 1;
}

.color-preview {
  width: 54px;
  height: 54px;
  border: 1px solid #e5e5e5;
  border-radius: 0;
}

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

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
