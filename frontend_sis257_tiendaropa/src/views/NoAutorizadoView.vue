<template>
  <div class="no-autorizado-page">
    <div class="container">
      <div class="card no-auth-card">
        <div class="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
        </div>
        <h1>Acceso No Autorizado</h1>
        <p class="muted">No tienes permisos para acceder a esta página.</p>
        <p class="muted">Esta sección está reservada solo para administradores.</p>
        
        <div class="actions">
          <RouterLink to="/" class="btn btn-primary">Ir al Inicio</RouterLink>
          <RouterLink to="/cuenta" class="btn btn-outline">Mi Cuenta</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.no-autorizado-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  padding: 20px;
}

.no-auth-card {
  max-width: 500px;
  margin: 0 auto;
  padding: 60px 40px;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.icon-container {
  margin-bottom: 24px;
  color: #e74c3c;
}

h1 {
  font-size: 1.75rem;
  font-weight: 400;
  color: #2c3e50;
  margin-bottom: 16px;
}

.muted {
  color: #7f8c8d;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
}

.btn {
  padding: 12px 28px;
  border-radius: 0;
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #2c3e50;
  color: white;
}

.btn-primary:hover {
  background: #34495e;
}

.btn-outline {
  background: transparent;
  border: 1px solid #e5e5e5;
  color: #2c3e50;
}

.btn-outline:hover {
  background: #f8f9fa;
  border-color: #2c3e50;
}
</style>
