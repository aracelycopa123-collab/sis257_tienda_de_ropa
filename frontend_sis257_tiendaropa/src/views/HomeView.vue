<script setup lang="ts">
import CategoryTabs from '@/components/CategoryTabs.vue'
import FeaturedProducts from '@/components/FeaturedProducts.vue'
import ProductGallery from '@/components/ProductGallery.vue'
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="py-11 bg-light-gradient border-bottom border-white border-5">
      <div class="bg-holder overlay overlay-light" style="background-image:url(/majestic-v1.0.1/public/assets/img/gallery/header-bg.png);background-size:cover;">
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
              <img class="img-fluid" src="/majestic-v1.0.1/public/assets/img/gallery/her.png" width="790" alt="Para Ella" />
              <div class="card-img-overlay d-flex flex-center"> 
                <a class="btn btn-lg btn-light" href="#!">Para Ella</a>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card card-span h-100 text-white"> 
              <img class="img-fluid" src="/majestic-v1.0.1/public/assets/img/gallery/him.png" width="790" alt="Para Él" />
              <div class="card-img-overlay d-flex flex-center"> 
                <a class="btn btn-lg btn-light" href="#!">Para Él</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Best Deals Section -->
    <section class="py-0">
      <div class="container">
        <div class="row h-100">
          <div class="col-lg-7 mx-auto text-center mt-7 mb-5">
            <h5 class="fw-bold fs-3 fs-lg-5 lh-sm">Mejores Ofertas</h5>
          </div>
          <div class="col-12">
            <div class="carousel slide" id="carouselBestDeals" data-bs-touch="false" data-bs-interval="false">
              <div class="carousel-inner">
                <div class="carousel-item active" data-bs-interval="10000">
                  <div class="row h-100 align-items-center g-2">
                    <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100">
                      <div class="card card-span h-100 text-white">
                        <img class="img-fluid h-100" src="/majestic-v1.0.1/public/assets/img/gallery/flat-hill.png" alt="Producto" />
                        <div class="card-img-overlay ps-0"> </div>
                        <div class="card-body ps-0 bg-200">
                          <h5 class="fw-bold text-1000 text-truncate">Flat Hill Slingback</h5>
                          <div class="fw-bold">
                            <span class="text-600 me-2 text-decoration-line-through">$200</span>
                            <span class="text-primary">$175</span>
                          </div>
                        </div>
                        <a class="stretched-link" href="#"></a>
                      </div>
                    </div>
                    <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100">
                      <div class="card card-span h-100 text-white">
                        <img class="img-fluid h-100" src="/majestic-v1.0.1/public/assets/img/gallery/blue-ring.png" alt="Producto" />
                        <div class="card-img-overlay ps-0"> </div>
                        <div class="card-body ps-0 bg-200">
                          <h5 class="fw-bold text-1000 text-truncate">Ocean Blue Ring</h5>
                          <div class="fw-bold">
                            <span class="text-600 me-2 text-decoration-line-through">$200</span>
                            <span class="text-primary">$175</span>
                          </div>
                        </div>
                        <a class="stretched-link" href="#"></a>
                      </div>
                    </div>
                    <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100">
                      <div class="card card-span h-100 text-white">
                        <img class="img-fluid h-100" src="/majestic-v1.0.1/public/assets/img/gallery/wallet.png" alt="Producto" />
                        <div class="card-img-overlay ps-0"> </div>
                        <div class="card-body ps-0 bg-200">
                          <h5 class="fw-bold text-1000 text-truncate">Brown Leathered Wallet</h5>
                          <div class="fw-bold">
                            <span class="text-600 me-2 text-decoration-line-through">$200</span>
                            <span class="text-primary">$175</span>
                          </div>
                        </div>
                        <a class="stretched-link" href="#"></a>
                      </div>
                    </div>
                    <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100">
                      <div class="card card-span h-100 text-white">
                        <img class="img-fluid h-100" src="/majestic-v1.0.1/public/assets/img/gallery/wrist-watch.png" alt="Producto" />
                        <div class="card-img-overlay ps-0"> </div>
                        <div class="card-body ps-0 bg-200">
                          <h5 class="fw-bold text-1000 text-truncate">Silverside Wristwatch</h5>
                          <div class="fw-bold">
                            <span class="text-600 me-2 text-decoration-line-through">$200</span>
                            <span class="text-primary">$175</span>
                          </div>
                        </div>
                        <a class="stretched-link" href="#"></a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <button class="carousel-control-prev" type="button" data-bs-target="#carouselBestDeals" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Anterior</span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#carouselBestDeals" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Siguiente</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 d-flex justify-content-center mt-5"> 
            <a class="btn btn-lg btn-dark" href="#!">Ver Todo</a>
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
              <div class="d-grid gap-2 d-md-block">
                <a class="btn btn-lg btn-dark" href="#" role="button">Explorar</a>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card card-span h-100 text-white">
              <img class="card-img h-100" src="/majestic-v1.0.1/public/assets/img/gallery/outfit.png" alt="Outfit" />
              <div class="card-img-overlay bg-dark-gradient">
                <div class="d-flex align-items-end justify-content-center h-100">
                  <a class="btn btn-lg text-light fs-1" href="#!" role="button">
                    Outfit
                    <svg class="bi bi-arrow-right-short" xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"> </path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row h-100 g-2 py-1">
          <div class="col-md-4">
            <div class="card card-span h-100 text-white">
              <img class="card-img h-100" src="/majestic-v1.0.1/public/assets/img/gallery/vanity-bag.png" alt="Vanity Bags" />
              <div class="card-img-overlay bg-dark-gradient">
                <div class="d-flex align-items-end justify-content-center h-100">
                  <a class="btn btn-lg text-light fs-1" href="#!" role="button">
                    Bolsos
                    <svg class="bi bi-arrow-right-short" xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"> </path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card card-span h-100 text-white">
              <img class="card-img h-100" src="/majestic-v1.0.1/public/assets/img/gallery/hat.png" alt="Sombreros" />
              <div class="card-img-overlay bg-dark-gradient">
                <div class="d-flex align-items-end justify-content-center h-100">
                  <a class="btn btn-lg text-light fs-1" href="#!" role="button">
                    Sombreros
                    <svg class="bi bi-arrow-right-short" xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"> </path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card card-span h-100 text-white">
              <img class="card-img h-100" src="/majestic-v1.0.1/public/assets/img/gallery/high-heels.png" alt="Tacones" />
              <div class="card-img-overlay bg-dark-gradient">
                <div class="d-flex align-items-end justify-content-center h-100">
                  <a class="btn btn-lg text-light fs-1" href="#!" role="button">
                    Tacones
                    <svg class="bi bi-arrow-right-short" xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"> </path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Tabs Section -->
    <CategoryTabs />

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
