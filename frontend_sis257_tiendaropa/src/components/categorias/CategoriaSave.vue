<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'
import type { Categoria, CategoriaDTO } from '@/models/categoria'
import http from '@/plugins/axios'

const props = defineProps<{
  show: boolean
  categoria?: Categoria
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const nombre = ref('')
const isEdit = ref(false)

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (props.categoria) {
        isEdit.value = true
        nombre.value = props.categoria.nombre
      } else {
        isEdit.value = false
        nombre.value = ''
      }
    }
  }
)

const guardarCategoria = async () => {
  if (!nombre.value.trim()) {
    alert('El nombre es obligatorio')
    return
  }

  const categoriaData: CategoriaDTO = {
    nombre: nombre.value,
  }

  try {
    if (isEdit.value && props.categoria) {
      await http.patch(`categorias/${props.categoria.id}`, categoriaData)
    } else {
      await http.post('categorias', categoriaData)
    }
    emit('saved')
    cerrarModal()
  } catch (error: any) {
    console.error('Error al guardar categoría:', error)
    const mensaje = error.response?.data?.message || 'No se pudo guardar la categoría'
    alert(Array.isArray(mensaje) ? mensaje.join('\n') : mensaje)
  }
}

const cerrarModal = () => {
  nombre.value = ''
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
            <h2 class="modal-title">{{ isEdit ? 'Editar Categoría' : 'Nueva Categoría' }}</h2>
            <button @click="cerrarModal" class="modal-close" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="guardarCategoria" class="modal-body">
            <div class="form-group">
              <label for="nombre" class="form-label">Nombre de la Categoría *</label>
              <input
                v-model="nombre"
                type="text"
                class="form-input"
                id="nombre"
                placeholder="Ej: Ropa Casual, Deportiva..."
                maxlength="50"
                required
                autofocus
              />
              <span class="form-hint">Máximo 50 caracteres</span>
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
  max-width: 500px;
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

.form-group {
  margin-bottom: 0;
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

.form-hint {
  display: block;
  font-size: 0.75rem;
  color: #95a5a6;
  margin-top: 6px;
  letter-spacing: 0.2px;
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

  .modal-footer {
    flex-direction: column-reverse;
  }
}
</style>
