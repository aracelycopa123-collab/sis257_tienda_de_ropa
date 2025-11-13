<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="jumbotron bg-light p-5 rounded">
          <h1 class="display-4">
            <i class="fas fa-tshirt text-danger"></i> Bienvenido a Tienda de Ropa
          </h1>
          <p class="lead">Descubre la mejor colección de ropa para ti</p>
          <hr class="my-4" />
          <router-link to="/productos" class="btn btn-primary btn-lg">
            <i class="fas fa-shopping-bag"></i> Ver Productos
          </router-link>
        </div>

        <div class="row mt-5">
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-body text-center">
                <i class="fas fa-shipping-fast fa-3x text-primary mb-3"></i>
                <h5 class="card-title">Envío Rápido</h5>
                <p class="card-text">Entrega en 24-48 horas</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-body text-center">
                <i class="fas fa-lock fa-3x text-success mb-3"></i>
                <h5 class="card-title">Pago Seguro</h5>
                <p class="card-text">Transacciones protegidas</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-body text-center">
                <i class="fas fa-undo fa-3x text-warning mb-3"></i>
                <h5 class="card-title">Devoluciones</h5>
                <p class="card-text">30 días de garantía</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-body text-center">
                <i class="fas fa-headset fa-3x text-info mb-3"></i>
                <h5 class="card-title">Soporte</h5>
                <p class="card-text">Atención al cliente 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Vista principal
</script>

<style scoped>
.jumbotron {
  border-left: 5px solid #dc3545;
}
</style>
