<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white">
    <div class="container-fluid px-5">
      <RouterLink to="/dashboard" class="navbar-brand">
        <span class="brand-text">MAJESTIC</span>
      </RouterLink>
      
      <button 
        class="navbar-toggler border-0" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/categorias" class="nav-link">Categorías</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/productos" class="nav-link">Productos</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/clientes" class="nav-link">Clientes</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/ventas" class="nav-link">Ventas</RouterLink>
          </li>
        </ul>
        
        <div class="d-flex align-items-center gap-4">
          <RouterLink to="/" class="btn-home">
            Ir al Inicio
          </RouterLink>
          <span class="user-name">{{ authStore.user }}</span>
          <button @click="authStore.logout()" class="btn-logout">
            Salir
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Estilo editorial premium - inspirado en COS/Everlane */

.navbar {
  border-bottom: 1px solid #e5e5e5;
  padding: 0;
  background: #ffffff !important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.container-fluid {
  padding-top: 20px;
  padding-bottom: 20px;
}

.navbar-brand {
  padding: 0;
  margin: 0;
}

.brand-text {
  font-size: 1.125rem;
  font-weight: 400;
  letter-spacing: 2px;
  color: #000000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  transition: opacity 0.2s ease;
}

.navbar-brand:hover .brand-text {
  opacity: 0.6;
}

.navbar-nav {
  gap: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  color: #666666;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  padding: 8px 20px !important;
  transition: color 0.2s ease;
  position: relative;
  text-transform: capitalize;
}

.nav-link:hover {
  color: #000000;
}

.nav-link.router-link-active {
  color: #000000;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 1px;
  background: #000000;
}

.user-name {
  font-size: 0.875rem;
  color: #666666;
  font-weight: 400;
  letter-spacing: 0.3px;
}

.btn-home {
  background: transparent;
  border: 1px solid #e5e5e5;
  color: #000000;
  padding: 8px 20px;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-home:hover {
  background: #000000;
  border-color: #000000;
  color: #ffffff;
}

.btn-logout {
  background: transparent;
  border: 1px solid #e5e5e5;
  color: #000000;
  padding: 8px 24px;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background: #000000;
  border-color: #000000;
  color: #ffffff;
}

.navbar-toggler {
  padding: 0;
}

.navbar-toggler:focus {
  box-shadow: none;
}

@media (max-width: 991px) {
  .navbar-nav {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e5e5e5;
  }
  
  .nav-link {
    padding: 12px 0 !important;
  }
  
  .nav-link.router-link-active::after {
    left: 0;
  }
  
  .d-flex {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e5e5e5;
  }
}
</style>
