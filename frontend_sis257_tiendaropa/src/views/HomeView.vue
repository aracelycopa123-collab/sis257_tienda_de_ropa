<script setup lang="ts">
import FeaturedProducts from '@/components/FeaturedProducts.vue'
import ProductGallery from '@/components/ProductGallery.vue'
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="py-11 bg-light-gradient border-bottom border-white border-5">
      <div class="bg-holder overlay overlay-light" style="background-image:url(/src/assets/img/gallery/header-bg.png);background-size:cover;">
      </div>

      <div class="container">
        <div class="row flex-center">
          <div class="col-12 mb-10">
            <div class="d-flex align-items-center flex-column">
              <h1 class="fw-normal">Con un estilo excepcional, solo para ti</h1>
              <h1 class="fs-4 fs-lg-8 fs-md-6 fw-bold">Diseñado exclusivamente para ti</h1>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- For Her / For Him Section -->
    <section class="py-0" id="header" style="margin-top: -23rem !important;">
      <div class="container">
        <div class="row g-0">
          <div class="col-md-6">
            <div class="card card-span h-100 text-white">
              <img class="img-fluid" src="/src/assets/img/gallery/her.png" width="790" alt="Para Ella" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="card card-span h-100 text-white">
              <img class="img-fluid" src="/src/assets/img/gallery/him.png" width="790" alt="Para Él" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Exclusive Collection Section -->
    <section>
      <div class="container">
        <div class="row h-100 g-0">
          <div class="col-md-6">
            <div class="bg-300 p-4 h-100 d-flex flex-column justify-content-center">
              <h4 class="text-800">Colección exclusiva 2025</h4>
              <h1 class="fw-semi-bold lh-sm fs-4 fs-lg-5 fs-xl-6">Se exclusivo</h1>
              <p class="mb-5 fs-1">La mejor opción diaria en un rango de Super Ahorro dentro de un precio razonable. Es nuestra responsabilidad mantenerte 100 por ciento elegante. Sé inteligente y moderno con nosotros.</p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card card-span h-100 text-white">
              <img class="card-img h-100" src="/src/assets/img/gallery/outfit.png" alt="Outfit" />
              <div class="card-img-overlay bg-dark-gradient">
                <div class="d-flex align-items-end justify-content-center h-100">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row h-100 g-2 py-1">
          <div class="col-md-4">
            <div class="card card-span h-100 text-white">
              <img class="card-img h-100" src="/src/assets/img/gallery/vanity-bag.png" alt="Vanity Bags" />
              <div class="card-img-overlay bg-dark-gradient">
                <div class="d-flex align-items-end justify-content-center h-100">
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card card-span h-100 text-white">
              <img class="card-img h-100" src="/src/assets/img/gallery/hat.png" alt="Sombreros" />
              <div class="card-img-overlay bg-dark-gradient">
                <div class="d-flex align-items-end justify-content-center h-100">
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card card-span h-100 text-white">
              <img class="card-img h-100" src="/src/assets/img/gallery/high-heels.png" alt="Tacones" />
              <div class="card-img-overlay bg-dark-gradient">
                <div class="d-flex align-items-end justify-content-center h-100">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Featured Products Section -->
    <FeaturedProducts />

    <!-- Product Gallery Section -->
    <ProductGallery />
  </div>
</template>

<style scoped>
.bg-holder {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.bg-holder.overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.bg-holder.overlay-light::before {
  background-color: rgba(255, 255, 255, 0.5);
}

.bg-light-gradient {
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

.bg-dark-gradient {
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
}

.card-span {
  position: relative;
  overflow: hidden;
}

.card-img-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
