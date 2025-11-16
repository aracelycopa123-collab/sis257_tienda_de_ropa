<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores'
import CarritoWidget from './CarritoWidget.vue'
import CarritoFlotante from './CarritoFlotante.vue'

const authStore = useAuthStore()
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top bg-white">
    <div class="container-fluid px-5">
      <RouterLink to="/" class="navbar-brand">
        <span class="brand-text">MAJESTIC</span>
      </RouterLink>
      
      <button 
        class="navbar-toggler border-0" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarSupportedContent" 
        aria-controls="navbarSupportedContent" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Inicio</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link">Sobre Nosotros</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/blog" class="nav-link">Blog</RouterLink>
          </li>
        </ul>
        
        <div class="navbar-actions">
          <!-- Carrito Widget -->
          <CarritoWidget />
          
          <!-- Botón de Login cuando NO está logueado -->
          <RouterLink v-if="!authStore.token" to="/login" class="btn-login">
            Iniciar Sesión
          </RouterLink>
          
          <!-- Botón de Ir al Panel cuando SÍ está logueado -->
          <RouterLink v-else to="/dashboard" class="btn-panel">
            Ir al Panel
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- Carrito Flotante (Sidebar) -->
  <CarritoFlotante />
</template>

<style scoped>
/* Estilo editorial premium */

.navbar {
  border-bottom: 1px solid #e5e5e5;
  padding: 0;
  background: #ffffff !important;
  transition: all 0.3s ease;
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

.nav-link {
  color: #666666;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  padding: 8px 20px !important;
  transition: color 0.2s ease;
  position: relative;
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

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-login {
  background: #000000;
  color: #ffffff;
  border: none;
  padding: 10px 28px;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
}

.btn-login:hover {
  background: #333333;
  color: #ffffff;
}

.btn-panel {
  background: transparent;
  color: #000000;
  border: 1px solid #e5e5e5;
  padding: 10px 28px;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
}

.btn-panel:hover {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
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
  
  .navbar-actions {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e5e5e5;
  }
  
  .btn-login {
    width: 100%;
    text-align: center;
  }
}
</style>
