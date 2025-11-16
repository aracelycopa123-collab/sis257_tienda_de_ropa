<template>
  <section class="py-0" id="category">
    <div class="container">
      <div class="row h-100">
        <div class="col-lg-7 mx-auto text-center mt-7 mb-5">
          <h5 class="fs-3 fs-lg-5 fw-bold mb-0 lh-sm">Nuestras Categorías</h5>
        </div>
      </div>
      <nav>
        <div class="nav nav-tabs justify-content-center" id="nav-tab" role="tablist">
          <button class="nav-link active" id="nav-women-tab" data-bs-toggle="tab" data-bs-target="#nav-women" type="button" role="tab" aria-controls="nav-women" aria-selected="true">Mujeres</button>
          <button class="nav-link" id="nav-men-tab" data-bs-toggle="tab" data-bs-target="#nav-men" type="button" role="tab" aria-controls="nav-men" aria-selected="false">Hombres</button>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <!-- Women Tab -->
        <div class="tab-pane fade show active" id="nav-women" role="tabpanel" aria-labelledby="nav-women-tab">
          <ul class="nav nav-pills mb-5 mt-5 justify-content-center" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="pills-dresses-tab" data-bs-toggle="pill" data-bs-target="#pills-dresses" type="button" role="tab">Vestidos</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="pills-wtshirt-tab" data-bs-toggle="pill" data-bs-target="#pills-wtshirt" type="button" role="tab">Camisetas</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="pills-wshoes-tab" data-bs-toggle="pill" data-bs-target="#pills-wshoes" type="button" role="tab">Zapatos</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="pills-wwatch-tab" data-bs-toggle="pill" data-bs-target="#pills-wwatch" type="button" role="tab">Relojes</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="pills-wsunglasses-tab" data-bs-toggle="pill" data-bs-target="#pills-wsunglasses" type="button" role="tab">Gafas</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="pills-wbagpacks-tab" data-bs-toggle="pill" data-bs-target="#pills-wbagpacks" type="button" role="tab">Mochilas</button>
            </li>
          </ul>

          <div class="tab-content" id="pills-tabContent">
            <!-- Dresses Tab -->
            <div class="tab-pane fade" id="pills-dresses" role="tabpanel">
              <div class="carousel slide" id="carouselCategoryDresses" data-bs-touch="false" data-bs-interval="false">
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <div class="row h-100 align-items-center g-2">
                      <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100" v-for="i in 4" :key="i">
                        <div class="card card-span h-100 text-white">
                          <img class="img-fluid h-100" :src="`/majestic-v1.0.1/public/assets/img/gallery/shirt-${i}.png`" alt="Producto" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Vestido</h5>
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
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselCategoryDresses" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselCategoryDresses" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Siguiente</span>
                </button>
              </div>
              <div class="col-12 d-flex justify-content-center mt-5">
                <a class="btn btn-lg btn-dark" href="#!">Ver Todo</a>
              </div>
            </div>

            <!-- T-Shirts Tab -->
            <div class="tab-pane fade show active" id="pills-wtshirt" role="tabpanel">
              <div class="carousel slide" id="carouselCategoryWTshirt" data-bs-touch="false" data-bs-interval="false">
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <div class="row h-100 align-items-center g-2">
                      <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100">
                        <div class="card card-span h-100 text-white">
                          <img class="img-fluid h-100" src="/majestic-v1.0.1/public/assets/img/gallery/red-tshirt.png" alt="Camiseta Roja" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Camiseta Roja</h5>
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
                          <img class="img-fluid h-100" src="/majestic-v1.0.1/public/assets/img/gallery/pink-tshirt.png" alt="Camiseta Rosa" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Camiseta Rosa</h5>
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
                          <img class="img-fluid h-100" src="/majestic-v1.0.1/public/assets/img/gallery/orange-tshirt.png" alt="Camiseta Naranja" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Camiseta Naranja</h5>
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
                          <img class="img-fluid h-100" src="/majestic-v1.0.1/public/assets/img/gallery/purple-tshirt.png" alt="Camiseta Morada" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Camiseta Morada</h5>
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
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselCategoryWTshirt" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselCategoryWTshirt" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Siguiente</span>
                </button>
              </div>
              <div class="col-12 d-flex justify-content-center mt-5">
                <a class="btn btn-lg btn-dark" href="#!">Ver Todo</a>
              </div>
            </div>

            <!-- Shoes Tab -->
            <div class="tab-pane fade" id="pills-wshoes" role="tabpanel">
              <div class="carousel slide" id="carouselCategoryWShoes" data-bs-touch="false" data-bs-interval="false">
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <div class="row h-100 align-items-center g-2">
                      <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100" v-for="i in 4" :key="i">
                        <div class="card card-span h-100 text-white">
                          <img class="img-fluid h-100" :src="`/majestic-v1.0.1/public/assets/img/gallery/shoe-${i}.png`" alt="Zapato" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Zapato</h5>
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
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselCategoryWShoes" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselCategoryWShoes" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Siguiente</span>
                </button>
              </div>
              <div class="col-12 d-flex justify-content-center mt-5">
                <a class="btn btn-lg btn-dark" href="#!">Ver Todo</a>
              </div>
            </div>

            <!-- Watch Tab -->
            <div class="tab-pane fade" id="pills-wwatch" role="tabpanel">
              <div class="carousel slide" id="carouselCategoryWwatch" data-bs-touch="false" data-bs-interval="false">
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <div class="row h-100 align-items-center g-2">
                      <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100" v-for="i in 4" :key="i">
                        <div class="card card-span h-100 text-white">
                          <img class="img-fluid h-100" :src="`/majestic-v1.0.1/public/assets/img/gallery/watch-${i}.png`" alt="Reloj" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Reloj</h5>
                            <div class="fw-bold">
                              <span class="text-600 me-2 text-decoration-line-through">$500</span>
                              <span class="text-primary">$275</span>
                            </div>
                          </div>
                          <a class="stretched-link" href="#"></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselCategoryWwatch" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselCategoryWwatch" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Siguiente</span>
                </button>
              </div>
              <div class="col-12 d-flex justify-content-center mt-5">
                <a class="btn btn-lg btn-dark" href="#!">Ver Todo</a>
              </div>
            </div>

            <!-- Sunglasses Tab -->
            <div class="tab-pane fade" id="pills-wsunglasses" role="tabpanel">
              <div class="carousel slide" id="carouselCategoryWSunglasses" data-bs-touch="false" data-bs-interval="false">
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <div class="row h-100 align-items-center g-2">
                      <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100" v-for="i in 4" :key="i">
                        <div class="card card-span h-100 text-white">
                          <img class="img-fluid h-100" :src="`/majestic-v1.0.1/public/assets/img/gallery/sunglass-${i}.png`" alt="Gafas" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Gafas de Sol</h5>
                            <div class="fw-bold">
                              <span class="text-600 me-2 text-decoration-line-through">$500</span>
                              <span class="text-primary">$275</span>
                            </div>
                          </div>
                          <a class="stretched-link" href="#"></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselCategoryWSunglasses" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselCategoryWSunglasses" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Siguiente</span>
                </button>
              </div>
              <div class="col-12 d-flex justify-content-center mt-5">
                <a class="btn btn-lg btn-dark" href="#!">Ver Todo</a>
              </div>
            </div>

            <!-- Bagpacks Tab -->
            <div class="tab-pane fade" id="pills-wbagpacks" role="tabpanel">
              <div class="carousel slide" id="carouselCategoryWBagpacks" data-bs-touch="false" data-bs-interval="false">
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <div class="row h-100 align-items-center g-2">
                      <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100" v-for="i in 4" :key="i">
                        <div class="card card-span h-100 text-white">
                          <img class="img-fluid h-100" :src="`/majestic-v1.0.1/public/assets/img/gallery/bagpacks-${i}.png`" alt="Mochila" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Mochila</h5>
                            <div class="fw-bold">
                              <span class="text-600 me-2 text-decoration-line-through">$500</span>
                              <span class="text-primary">$275</span>
                            </div>
                          </div>
                          <a class="stretched-link" href="#"></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselCategoryWBagpacks" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselCategoryWBagpacks" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Siguiente</span>
                </button>
              </div>
              <div class="col-12 d-flex justify-content-center mt-5">
                <a class="btn btn-lg btn-dark" href="#!">Ver Todo</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Men Tab -->
        <div class="tab-pane fade" id="nav-men" role="tabpanel" aria-labelledby="nav-men-tab">
          <ul class="nav nav-pills mb-5 mt-5 justify-content-center" id="pills-tab-men" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="pills-tshirt-tab" data-bs-toggle="pill" data-bs-target="#pills-tshirt" type="button" role="tab">Camisetas</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="pills-shirt-tab" data-bs-toggle="pill" data-bs-target="#pills-shirt" type="button" role="tab">Camisas</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="pills-shoes-tab" data-bs-toggle="pill" data-bs-target="#pills-shoes" type="button" role="tab">Zapatos</button>
            </li>
          </ul>

          <div class="tab-content" id="pills-tabContentMen">
            <!-- Men T-Shirts -->
            <div class="tab-pane fade show active" id="pills-tshirt" role="tabpanel">
              <div class="carousel slide" id="carouselCategoryTshirt" data-bs-touch="false" data-bs-interval="false">
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <div class="row h-100 align-items-center g-2">
                      <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100">
                        <div class="card card-span h-100 text-white">
                          <img class="img-fluid h-100" src="/majestic-v1.0.1/public/assets/img/gallery/white-tshirt.png" alt="Camiseta Blanca" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Camiseta Blanca</h5>
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
                          <img class="img-fluid h-100" src="/majestic-v1.0.1/public/assets/img/gallery/sky-tshirt.png" alt="Camiseta Celeste" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Camiseta Celeste</h5>
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
                          <img class="img-fluid h-100" src="/majestic-v1.0.1/public/assets/img/gallery/yellow-tshirt.png" alt="Camiseta Amarilla" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Camiseta Amarilla</h5>
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
                          <img class="img-fluid h-100" src="/majestic-v1.0.1/public/assets/img/gallery/black-tshirt.png" alt="Camiseta Negra" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Camiseta Negra</h5>
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
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselCategoryTshirt" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselCategoryTshirt" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Siguiente</span>
                </button>
              </div>
              <div class="col-12 d-flex justify-content-center mt-5">
                <a class="btn btn-lg btn-dark" href="#!">Ver Todo</a>
              </div>
            </div>

            <!-- Men Shirts -->
            <div class="tab-pane fade" id="pills-shirt" role="tabpanel">
              <div class="carousel slide" id="carouselCategoryShirt" data-bs-touch="false" data-bs-interval="false">
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <div class="row h-100 align-items-center g-2">
                      <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100" v-for="i in [5,6,7,8]" :key="i">
                        <div class="card card-span h-100 text-white">
                          <img class="img-fluid h-100" :src="`/majestic-v1.0.1/public/assets/img/gallery/shirt-${i}.png`" alt="Camisa" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Camisa</h5>
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
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselCategoryShirt" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselCategoryShirt" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Siguiente</span>
                </button>
              </div>
              <div class="col-12 d-flex justify-content-center mt-5">
                <a class="btn btn-lg btn-dark" href="#!">Ver Todo</a>
              </div>
            </div>

            <!-- Men Shoes -->
            <div class="tab-pane fade" id="pills-shoes" role="tabpanel">
              <div class="carousel slide" id="carouselCategoryShoes" data-bs-touch="false" data-bs-interval="false">
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <div class="row h-100 align-items-center g-2">
                      <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100" v-for="i in [5,6,7,8]" :key="i">
                        <div class="card card-span h-100 text-white">
                          <img class="img-fluid h-100" :src="`/majestic-v1.0.1/public/assets/img/gallery/shoe-${i}.png`" alt="Zapato" />
                          <div class="card-img-overlay ps-0"></div>
                          <div class="card-body ps-0 bg-200">
                            <h5 class="fw-bold text-1000 text-truncate">Zapato</h5>
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
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselCategoryShoes" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselCategoryShoes" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Siguiente</span>
                </button>
              </div>
              <div class="col-12 d-flex justify-content-center mt-5">
                <a class="btn btn-lg btn-dark" href="#!">Ver Todo</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
