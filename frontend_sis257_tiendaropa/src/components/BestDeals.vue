<template>
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
                  <div v-for="(item, index) in bestDealsItems" :key="index" class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100">
                    <div class="card card-span h-100 text-white">
                      <img class="img-fluid h-100" :src="item.image" :alt="item.name" />
                      <div class="card-img-overlay ps-0"></div>
                      <div class="card-body ps-0 bg-200">
                        <h5 class="fw-bold text-1000 text-truncate">{{ item.name }}</h5>
                        <div class="fw-bold">
                          <span class="text-600 me-2 text-decoration-line-through">${{ item.originalPrice }}</span>
                          <span class="text-primary">${{ item.discountPrice }}</span>
                        </div>
                      </div>
                      <a class="stretched-link" href="#"></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const bestDealsItems = [
  {
    name: 'Zapato de Tacón',
    image: '/assets/img/gallery/flat-hill.png',
    originalPrice: '200',
    discountPrice: '175'
  },
  {
    name: 'Anillo Azul Océano',
    image: '/assets/img/gallery/blue-ring.png',
    originalPrice: '200',
    discountPrice: '175'
  },
  {
    name: 'Billetera Marrón',
    image: '/assets/img/gallery/wallet.png',
    originalPrice: '200',
    discountPrice: '175'
  },
  {
    name: 'Reloj de Pulsera',
    image: '/assets/img/gallery/wrist-watch.png',
    originalPrice: '200',
    discountPrice: '175'
  }
]
</script>

<style scoped>
.bg-200 {
  background-color: #f5f5f5;
}

.text-1000 {
  color: #212121;
}

.text-600 {
  color: #9e9e9e;
}

.text-primary {
  color: #ffa15c;
}

.card-span {
  border: none;
  overflow: hidden;
}

.card-span img {
  transition: transform 0.3s ease;
}

.card-span:hover img {
  transform: scale(1.1);
}

.py-11 {
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.mt-7 {
  margin-top: 4rem;
}

.mb-5 {
  margin-bottom: 3rem;
}
</style>
