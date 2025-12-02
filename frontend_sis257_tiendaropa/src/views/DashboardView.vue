<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import DashboardHeader from '@/components/DashboardHeader.vue'

const router = useRouter()
const authStore = useAuthStore()

const menuItems = [
  {
    title: 'Categorías',
    description: 'Gestiona las categorías de productos',
    icon: 'grid',
    route: '/categorias',
    color: '#2c3e50'
  },
  {
    title: 'Productos',
    description: 'Administra el inventario de productos',
    icon: 'package',
    route: '/productos',
    color: '#34495e'
  },
  {
    title: 'Clientes',
    description: 'Gestiona la información de clientes',
    icon: 'users',
    route: '/clientes',
    color: '#546e7a'
  },
  {
    title: 'Ventas',
    description: 'Visualiza el historial de ventas',
    icon: 'shopping-cart',
    route: '/ventas',
    color: '#607d8b'
  }
]

const navigateTo = (route: string) => {
  router.push(route)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <DashboardHeader />
    
    <div class="dashboard-container">
      <div class="container-fluid px-5 py-5">
        <!-- Header -->
        <div class="dashboard-header mb-5">
          <h1 class="dashboard-title">Panel de Administración</h1>
          <p class="dashboard-welcome">Hola, {{ authStore.user }}</p>
        </div>

      <!-- Dashboard Grid -->
      <div class="dashboard-grid">
        <div 
          v-for="item in menuItems" 
          :key="item.route" 
          class="dashboard-module"
          @click="navigateTo(item.route)"
        >
          <div class="module-content">
            <div class="module-icon">
              <i :data-feather="item.icon"></i>
            </div>
            <h2 class="module-title">{{ item.title }}</h2>
            <p class="module-description">{{ item.description }}</p>
            <div class="module-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
/* Inspirado en tiendas premium: COS, Everlane, Arket */

.dashboard-wrapper {
  min-height: 100vh;
  background: #ffffff;
}

.dashboard-container {
  padding-top: 80px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header Section */
.dashboard-header {
  padding-bottom: 40px;
  border-bottom: 1px solid #e5e5e5;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: -0.5px;
  color: #000000;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.dashboard-welcome {
  font-size: 0.875rem;
  color: #666666;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 0;
}

/* Dashboard Grid - Estilo Editorial */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1px;
  background: #e5e5e5;
  border: 1px solid #e5e5e5;
  margin-top: 40px;
}

.dashboard-module {
  background: #ffffff;
  padding: 60px 40px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-module:hover {
  background: #fafafa;
}

.dashboard-module:hover .module-arrow {
  transform: translateX(8px);
  opacity: 1;
}

.dashboard-module:hover .module-icon i {
  transform: scale(1.05);
}

.module-content {
  text-align: center;
  width: 100%;
}

.module-icon {
  margin-bottom: 32px;
}

.module-icon i {
  width: 48px;
  height: 48px;
  color: #000000;
  stroke-width: 1.5;
  transition: transform 0.3s ease;
}

.module-title {
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: -0.3px;
  color: #000000;
  margin-bottom: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.module-description {
  font-size: 0.875rem;
  color: #666666;
  line-height: 1.6;
  font-weight: 300;
  letter-spacing: 0.2px;
  margin: 0 0 24px 0;
}

.module-arrow {
  font-size: 1.5rem;
  color: #000000;
  opacity: 0;
  transform: translateX(0);
  transition: all 0.25s ease;
  font-weight: 300;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding-top: 80px;
  }

  .dashboard-title {
    font-size: 2rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    margin-top: 40px;
  }

  .dashboard-module {
    padding: 50px 30px;
    min-height: 280px;
  }

  .module-title {
    font-size: 1.25rem;
  }
}
</style>
