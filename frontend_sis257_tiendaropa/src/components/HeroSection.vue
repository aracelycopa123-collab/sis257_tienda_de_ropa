<template>
  <section class="py-11 bg-light-gradient border-bottom border-white border-5">
    <div class="bg-holder overlay overlay-light"
        style="background-image:url(/assets/img/gallery/header-bg.png);background-size:cover;">
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
            <img class="img-fluid" src="/assets/img/gallery/her.png" width="790" alt="Para ella" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="card card-span h-100 text-white">
            <img class="img-fluid" src="/assets/img/gallery/him.png" width="790" alt="Para él" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Component logic goes here
</script>

<style scoped>
.bg-light-gradient {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.border-5 {
  border-width: 5px !important;
}

.bg-holder {
  position: relative;
  z-index: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.5;
}

.overlay-light {
  opacity: 0.3;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  text-align: center;
  color: #212121;
}

.card-span {
  border: none;
}

.card-img-overlay {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
}
</style>
