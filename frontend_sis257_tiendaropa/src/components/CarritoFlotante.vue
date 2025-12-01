<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCarritoStore } from '@/stores'
import { watch, onUnmounted, ref, computed } from 'vue'

const router = useRouter()
const carritoStore = useCarritoStore()

// Vista compacta o expandida
const vistaExpandida = ref(false)

// Máximo de miniaturas a mostrar en vista compacta
const MAX_THUMBNAILS = 8

// Miniaturas visibles (primeras 8)
const thumbnailsVisibles = computed(() => {
  return carritoStore.items.slice(0, MAX_THUMBNAILS)
})

// Items extra (después de las 4 miniaturas)
const itemsExtra = computed(() => {
  return Math.max(0, carritoStore.items.length - MAX_THUMBNAILS)
})

// Evitar scroll del body cuando el carrito está abierto
watch(
  () => carritoStore.isOpen,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
      vistaExpandida.value = false // Reset al abrir
    } else {
      document.body.style.overflow = ''
    }
  },
)

onUnmounted(() => {
  document.body.style.overflow = ''
})

const formatoPrecio = (precio: number) => {
  return precio.toFixed(2)
}

const irACheckout = () => {
  carritoStore.cerrarCarrito()
  router.push('/checkout')
}

const irACarritoCompleto = () => {
  carritoStore.cerrarCarrito()
  router.push('/carrito')
}

const toggleVista = () => {
  vistaExpandida.value = !vistaExpandida.value
}
</script>

<template>
  <!-- Overlay -->
  <Transition name="overlay">
    <div
      v-if="carritoStore.isOpen"
      class="cart-overlay"
      @click="carritoStore.cerrarCarrito()"
    ></div>
  </Transition>

  <!-- Sidebar del Carrito -->
  <Transition name="cart">
    <aside v-if="carritoStore.isOpen" class="cart-sidebar">
      <!-- Header -->
      <div class="cart-header">
        <h2 class="cart-title">Carrito</h2>
        <button @click="carritoStore.cerrarCarrito()" class="cart-close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M15 5L5 15M5 5l10 10" />
          </svg>
        </button>
      </div>

      <!-- Cart Content -->
      <div class="cart-content">
        <!-- Empty State -->
        <div v-if="carritoStore.estaVacio" class="cart-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
          </svg>
          <p class="empty-message">Tu carrito está vacío</p>
        </div>

        <!-- VISTA COMPACTA (por defecto) -->
        <div v-else-if="!vistaExpandida" class="cart-compact">
          <!-- Resumen visual con miniaturas -->
          <div class="compact-summary">
            <div class="thumbnails-row">
              <div 
                v-for="item in thumbnailsVisibles" 
                :key="item.id" 
                class="thumbnail-item"
              >
                <img :src="item.imagen" :alt="item.nombre" />
                <span v-if="item.cantidad > 1" class="thumbnail-qty">{{ item.cantidad }}</span>
              </div>
              <!-- Indicador de más productos -->
              <div v-if="itemsExtra > 0" class="thumbnail-more">
                +{{ itemsExtra }}
              </div>
            </div>
            
            <div class="compact-info">
              <div class="compact-info-row">
                <p class="compact-count">
                  {{ carritoStore.cantidadTotal }} artículo{{ carritoStore.cantidadTotal > 1 ? 's' : '' }} en tu carrito
                </p>
                <button @click="toggleVista" class="btn-ver-detalles">
                  Ver detalles
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </button>
              </div>
              <p class="compact-total">
                Total: <strong>{{ formatoPrecio(carritoStore.precioTotal) }} Bs</strong>
              </p>
            </div>
          </div>
        </div>

        <!-- VISTA EXPANDIDA (lista completa) -->
        <div v-else class="cart-items">
          <!-- Botón para colapsar -->
          <button @click="toggleVista" class="btn-toggle-view compact-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 10l4-4 4 4" />
            </svg>
            Vista compacta
          </button>

          <article v-for="item in carritoStore.items" :key="item.id" class="cart-item">
            <!-- Image -->
            <div class="item-image">
              <img :src="item.imagen" :alt="item.nombre" />
            </div>

            <!-- Info -->
            <div class="item-info">
              <h3 class="item-name">{{ item.nombre }}</h3>
              <div class="item-details">
                <span>{{ item.talla }}</span>
                <span class="separator">·</span>
                <span>{{ item.color }}</span>
              </div>
              <div class="item-bottom">
                <div class="item-price">{{ formatoPrecio(item.precio) }} Bs</div>
                <!-- Quantity Controls -->
                <div class="item-controls">
                  <button
                    @click="carritoStore.decrementarCantidad(item.id)"
                    class="qty-btn"
                    :disabled="item.cantidad <= 1"
                  >
                    −
                  </button>
                  <span class="qty-value">{{ item.cantidad }}</span>
                  <button
                    @click="carritoStore.incrementarCantidad(item.id)"
                    class="qty-btn"
                    :disabled="item.cantidad >= item.stock"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <!-- Remove -->
            <button @click="carritoStore.removerItem(item.id)" class="item-remove">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 4L4 12M4 4l8 8" />
              </svg>
            </button>
          </article>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="!carritoStore.estaVacio" class="cart-footer">
        <div class="cart-summary">
          <div class="summary-row items-count">
            <span class="summary-label">{{ carritoStore.cantidadTotal }} artículo{{ carritoStore.cantidadTotal > 1 ? 's' : '' }}</span>
          </div>
          <div class="summary-row total">
            <span class="summary-label">Total</span>
            <span class="summary-value">{{ formatoPrecio(carritoStore.precioTotal) }} Bs</span>
          </div>
        </div>

        <button class="btn-checkout" @click="irACheckout" :disabled="carritoStore.estaVacio">
          Proceder al pago
        </button>

        <button @click="carritoStore.vaciarCarrito()" class="btn-clear">
          Vaciar carrito
        </button>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
/* Overlay */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}

/* Sidebar */
.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 420px;
  max-height: 100vh;
  background: #ffffff;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 20px rgba(0, 0, 0, 0.1);
}

/* Header */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  border-bottom: 1px solid #e5e5e5;
}

.cart-title {
  font-size: 1.25rem;
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #000000;
  margin: 0;
}

.cart-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #666666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.cart-close:hover {
  color: #000000;
}

/* Content */
.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}

/* Sin scroll en vista compacta */
.cart-content:has(.cart-compact) {
  flex: none;
  overflow-y: visible;
}

/* Empty State */
.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999999;
}

.cart-empty svg {
  margin-bottom: 20px;
  opacity: 0.3;
}

.empty-message {
  font-size: 0.9375rem;
  letter-spacing: 0.5px;
  font-weight: 300;
}

/* ========== VISTA COMPACTA ========== */
.cart-compact {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.compact-summary {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.thumbnails-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.thumbnail-item {
  position: relative;
  width: 60px;
  height: 75px;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-qty {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #000;
  color: #fff;
  font-size: 0.625rem;
  font-weight: 600;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-more {
  width: 60px;
  height: 75px;
  border-radius: 6px;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
}

.compact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.compact-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.compact-count {
  font-size: 0.9375rem;
  color: #666;
  margin: 0;
}

.compact-total {
  font-size: 1.125rem;
  color: #000;
  margin: 0;
  text-align: center;
}

.compact-total strong {
  font-weight: 600;
}

.btn-ver-detalles {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 20px;
  color: #666;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-ver-detalles:hover {
  background: #fff;
  border-color: #000;
  color: #000;
}

.btn-toggle-view {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #333;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-toggle-view:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.btn-toggle-view.compact-btn {
  margin-bottom: 20px;
  background: #f8f8f8;
}

/* ========== VISTA EXPANDIDA (Lista) ========== */

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: 70px 1fr auto;
  gap: 12px;
  position: relative;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.item-image {
  width: 70px;
  height: 85px;
  background: #fafafa;
  overflow: hidden;
  border-radius: 4px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.item-name {
  font-size: 0.875rem;
  font-weight: 400;
  color: #000000;
  margin: 0;
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-details {
  font-size: 0.75rem;
  color: #666666;
  display: flex;
  gap: 6px;
}

.separator {
  color: #cccccc;
}

.item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  gap: 8px;
}

.item-price {
  font-size: 0.875rem;
  color: #000000;
  font-weight: 500;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border-radius: 2px;
}

.qty-btn:hover:not(:disabled) {
  border-color: #000000;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  font-size: 0.8125rem;
  color: #000000;
  min-width: 16px;
  text-align: center;
}

.item-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: #cccccc;
  padding: 4px;
  transition: color 0.2s ease;
  align-self: flex-start;
}

.item-remove:hover {
  color: #ff4444;
}

/* Footer */
.cart-footer {
  border-top: 1px solid #e5e5e5;
  padding: 24px 30px;
  background: #fafafa;
}

.cart-summary {
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.summary-row.items-count {
  margin-bottom: 12px;
}

.summary-row.items-count .summary-label {
  color: #666666;
  font-size: 0.8125rem;
}

.summary-row.total {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e5e5;
  font-size: 1rem;
  margin-bottom: 0;
}

.summary-label {
  color: #666666;
  letter-spacing: 0.5px;
}

.summary-row.total .summary-label {
  color: #000000;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.8125rem;
}

.summary-value {
  color: #000000;
  font-weight: 500;
}

.summary-row.total .summary-value {
  font-size: 1.125rem;
}

.btn-checkout {
  width: 100%;
  background: #000000;
  color: #ffffff;
  border: none;
  padding: 16px;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-bottom: 12px;
}

.btn-checkout:hover {
  background: #333333;
}

.btn-checkout:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-clear {
  width: 100%;
  background: transparent;
  color: #666666;
  border: 1px solid #e5e5e5;
  padding: 14px;
  font-size: 0.8125rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  border-color: #000000;
  color: #000000;
}

/* Animations */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.cart-enter-active,
.cart-leave-active {
  transition: transform 0.3s ease;
}

.cart-enter-from,
.cart-leave-to {
  transform: translateX(100%);
}

/* Responsive */
@media (max-width: 480px) {
  .cart-sidebar {
    max-width: 100%;
  }

  .cart-header {
    padding: 20px;
  }
  
  .cart-content {
    padding: 16px;
  }
  
  .cart-footer {
    padding: 20px;
  }

  .cart-title {
    font-size: 1rem;
  }

  .cart-item {
    grid-template-columns: 60px 1fr auto;
    gap: 10px;
  }

  .item-image {
    width: 60px;
    height: 75px;
  }
  
  .item-name {
    font-size: 0.8125rem;
  }
  
  .item-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
