<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCarritoStore } from '@/stores'
import { watch, onUnmounted } from 'vue'

const router = useRouter()
const carritoStore = useCarritoStore()

// Evitar scroll del body cuando el carrito está abierto
watch(
  () => carritoStore.isOpen,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
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

        <!-- Cart Items -->
        <div v-else class="cart-items">
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
          <div class="summary-row">
            <span class="summary-label">Subtotal</span>
            <span class="summary-value">{{ formatoPrecio(carritoStore.precioTotal) }} Bs</span>
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
  height: 100vh;
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

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 16px;
  position: relative;
}

.item-image {
  width: 80px;
  height: 100px;
  background: #fafafa;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-name {
  font-size: 0.9375rem;
  font-weight: 400;
  color: #000000;
  margin: 0;
  letter-spacing: 0.3px;
}

.item-details {
  font-size: 0.8125rem;
  color: #666666;
  display: flex;
  gap: 6px;
}

.separator {
  color: #cccccc;
}

.item-price {
  font-size: 0.875rem;
  color: #000000;
  font-weight: 400;
  margin-top: 4px;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  border-color: #000000;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  font-size: 0.875rem;
  color: #000000;
  min-width: 20px;
  text-align: center;
}

.item-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: #999999;
  padding: 4px;
  transition: color 0.2s ease;
}

.item-remove:hover {
  color: #000000;
}

/* Footer */
.cart-footer {
  border-top: 1px solid #e5e5e5;
  padding: 30px;
}

.cart-summary {
  margin-bottom: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.875rem;
}

.summary-row.total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e5e5;
  font-size: 1rem;
}

.summary-label {
  color: #666666;
  letter-spacing: 0.5px;
}

.summary-row.total .summary-label {
  color: #000000;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.8125rem;
}

.summary-value {
  color: #000000;
  font-weight: 400;
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

  .cart-header,
  .cart-content,
  .cart-footer {
    padding: 20px;
  }

  .cart-title {
    font-size: 1rem;
  }

  .cart-item {
    grid-template-columns: 70px 1fr auto;
  }

  .item-image {
    width: 70px;
    height: 90px;
  }
}
</style>
