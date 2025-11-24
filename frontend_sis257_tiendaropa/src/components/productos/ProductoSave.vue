<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Producto, ProductoDTO } from '@/models/producto'
import type { Categoria } from '@/models/categoria'
import http from '@/plugins/axios'

const props = defineProps<{
  show: boolean
  producto?: Producto
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const nombre = ref('')
const descripcion = ref('')
const precio = ref<number>(0)
const stock = ref<number>(0)
const talla = ref('')
const color = ref('')
const genero = ref('unisex')
const imagenes = ref('')
const idCategoria = ref<number | null>(null)

// predefined size sets
const clothingSizes = ['XS','S','M','L','XL','XXL']
const shoeSizes = ['35','36','37','38','39','40','41','42','43','44','45']
const otherSizes = ['Única']
const useCustomTalla = ref(false)

const categorias = ref<Categoria[]>([])
const isEdit = ref(false)

const cargarCategorias = async () => {
  try {
    const { data } = await http.get('categorias')
    categorias.value = data
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (props.producto) {
        isEdit.value = true
        nombre.value = props.producto.nombre
        descripcion.value = props.producto.descripcion
        precio.value = props.producto.precio
        stock.value = props.producto.stock
        talla.value = props.producto.talla
        color.value = props.producto.color
        genero.value = props.producto.genero || 'unisex'
        imagenes.value = props.producto.imagenes
        idCategoria.value = props.producto.idCategoria
        // if existing product talla doesn't exist in current sizes list, switch to custom input
        const currentSizes = sizesList()
        if (talla.value && !currentSizes.includes(talla.value)) {
          useCustomTalla.value = true
        }
      } else {
        isEdit.value = false
        resetForm()
      }
      cargarCategorias()
    }
  }
)

// when category changes, reset custom talla flag and clear talla if necessary
watch(idCategoria, (newVal) => {
  useCustomTalla.value = false
  // if current talla is not in the new list, clear it
  const list = sizesList()
  if (talla.value && !list.includes(talla.value)) {
    talla.value = ''
  }
})

const resetForm = () => {
  nombre.value = ''
  descripcion.value = ''
  precio.value = 0
  stock.value = 0
  talla.value = ''
  color.value = ''
  genero.value = 'unisex'
  imagenes.value = ''
  idCategoria.value = null
  useCustomTalla.value = false
}

// computed list of sizes depending on selected category name
function sizesList() {
  try {
    const cat = categorias.value.find((c) => c.id === idCategoria.value)
    const name = (cat?.nombre || '').toLowerCase()
    if (name.includes('zapato') || name.includes('calzado') || name.includes('shoe')) return shoeSizes
    if (name.includes('accesorio') || name.includes('joya')) return otherSizes
    // default clothing sizes
    return clothingSizes
  } catch (e) {
    return clothingSizes
  }
}

const guardarProducto = async () => {
  if (!nombre.value.trim() || !descripcion.value.trim() || !idCategoria.value) {
    alert('Por favor complete todos los campos obligatorios')
    return
  }

  const productoData: ProductoDTO = {
    nombre: nombre.value,
    descripcion: descripcion.value,
    precio: Number(precio.value),
    stock: Number(stock.value),
    talla: talla.value,
    color: color.value,
    genero: genero.value,
    imagenes: imagenes.value,
    idCategoria: Number(idCategoria.value),
  }

  try {
    if (isEdit.value && props.producto) {
      await http.patch(`productos/${props.producto.id}`, productoData)
    } else {
      await http.post('productos', productoData)
    }
    emit('saved')
    cerrarModal()
  } catch (error: any) {
    console.error('Error al guardar producto:', error)
    const mensaje = error.response?.data?.message || 'No se pudo guardar el producto'
    alert(Array.isArray(mensaje) ? mensaje.join('\n') : mensaje)
  }
}

const cerrarModal = () => {
  resetForm()
  emit('close')
}

onMounted(() => {
  cargarCategorias()
})

// if user selects 'Otro...' in select, switch to custom input
watch(talla, (val) => {
  if (val === '__other__') {
    useCustomTalla.value = true
    talla.value = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">{{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
            <button @click="cerrarModal" class="modal-close" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="guardarProducto" class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label for="nombre" class="form-label">Nombre del Producto *</label>
                <input
                  v-model="nombre"
                  type="text"
                  class="form-input"
                  id="nombre"
                  placeholder="Camisa de algodón..."
                  maxlength="100"
                  required
                />
              </div>

              <div class="form-group">
                <label for="categoria" class="form-label">Categoría *</label>
                <select v-model="idCategoria" class="form-input form-select" id="categoria" required>
                  <option :value="null" disabled>Selecciona una categoría</option>
                  <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                    {{ cat.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group form-group-full">
                <label for="descripcion" class="form-label">Descripción *</label>
                <textarea
                  v-model="descripcion"
                  class="form-textarea"
                  id="descripcion"
                  rows="3"
                  placeholder="Describe las características..."
                  maxlength="500"
                  required
                ></textarea>
              </div>

              <div class="form-group">
                <label for="precio" class="form-label">Precio (Bs.) *</label>
                <input
                  v-model.number="precio"
                  type="number"
                  class="form-input"
                  id="precio"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
              </div>

              <div class="form-group">
                <label for="stock" class="form-label">Stock *</label>
                <input
                  v-model.number="stock"
                  type="number"
                  class="form-input"
                  id="stock"
                  min="0"
                  placeholder="0"
                  required
                />
              </div>

              <div class="form-group">
                <label for="talla" class="form-label">Talla *</label>
                <div v-if="!useCustomTalla">
                  <select v-model="talla" class="form-input form-select" id="talla" required>
                    <option value="" disabled>Selecciona una talla</option>
                    <option v-for="s in sizesList()" :key="s" :value="s">{{ s }}</option>
                    <option value="__other__">Otro...</option>
                  </select>
                </div>
                <div v-else>
                  <input v-model="talla" type="text" class="form-input" id="talla" placeholder="Ej: 35, 36 o S, M..." required />
                  <div style="margin-top:6px"><a href="#" @click.prevent="useCustomTalla=false">Usar lista de tallas</a></div>
                </div>
              </div>

              <div class="form-group">
                <label for="color" class="form-label">Color *</label>
                <input
                  v-model="color"
                  type="text"
                  class="form-input"
                  id="color"
                  placeholder="Negro, Blanco..."
                  required
                />
              </div>

              <div class="form-group">
                <label for="genero" class="form-label">Género *</label>
                <select v-model="genero" class="form-input form-select" id="genero" required>
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              <div class="form-group form-group-full">
                <label for="imagenes" class="form-label">URL de Imagen *</label>
                <input
                  v-model="imagenes"
                  type="url"
                  class="form-input"
                  id="imagenes"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
              </div>

              <div class="form-group form-group-full" v-if="imagenes">
                <label class="form-label">Vista Previa</label>
                <div class="image-preview">
                  <img :src="imagenes" alt="Preview" @error="() => {}" />
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
  max-width: 700px;
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

.form-group-full {
  grid-column: 1 / -1;
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

.form-input,
.form-select {
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

.form-textarea {
  width: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 0;
  font-size: 0.9375rem;
  color: #000000;
  background: #ffffff;
  padding: 16px;
  transition: all 0.2s ease;
  resize: vertical;
  font-family: inherit;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #d1d5db;
  font-weight: 300;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #000000;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23000000' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}

.image-preview {
  border: 1px solid #e5e5e5;
  padding: 20px;
  display: inline-block;
}

.image-preview img {
  max-width: 150px;
  max-height: 150px;
  display: block;
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
