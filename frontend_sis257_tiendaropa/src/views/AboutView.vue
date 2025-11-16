<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">Sobre Nosotros</h1>
          <div class="hero-divider"></div>
          <p class="hero-subtitle">
            Definiendo el futuro de la moda minimalista desde 2024
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="content-section">
      <div class="content-container">
        <!-- Brand Story -->
        <div class="content-block">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" 
                alt="Tienda moderna" 
                class="content-image"
              />
            </div>
            <div class="col-lg-6">
              <div class="content-text">
                <h2 class="section-title">Nuestra Historia</h2>
                <p class="section-paragraph">
                  Fundada en 2024, MAJESTIC nace de la visión de crear una experiencia de compra 
                  donde la calidad y el diseño atemporal se encuentren con la accesibilidad. 
                  Inspirados por las marcas nórdicas de lujo contemporáneo, creamos colecciones 
                  que trascienden las tendencias efímeras.
                </p>
                <p class="section-paragraph">
                  Cada pieza es cuidadosamente seleccionada pensando en la versatilidad, 
                  durabilidad y el minimalismo sofisticado que define el estilo moderno.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Philosophy -->
        <div class="content-block reverse">
          <div class="row align-items-center">
            <div class="col-lg-6 order-lg-2">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" 
                alt="Filosofía de diseño" 
                class="content-image"
              />
            </div>
            <div class="col-lg-6 order-lg-1">
              <div class="content-text">
                <h2 class="section-title">Nuestra Filosofía</h2>
                <p class="section-paragraph">
                  Creemos en el poder de la simplicidad. Cada prenda en nuestra colección 
                  está diseñada para ser combinable, duradera y relevante más allá de las 
                  estaciones. Rechazamos la moda rápida y apostamos por piezas que acompañen 
                  tu estilo de vida.
                </p>
                <p class="section-paragraph">
                  Nuestro compromiso va más allá de la estética: trabajamos con materiales 
                  de calidad superior y procesos que respetan tanto al artesano como al medio ambiente.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Values Grid -->
        <div class="values-section">
          <h2 class="section-title text-center mb-5">Nuestros Valores</h2>
          <div class="row g-4">
            <div class="col-md-4">
              <div class="value-card">
                <div class="value-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3 class="value-title">Calidad Atemporal</h3>
                <p class="value-description">
                  Seleccionamos materiales premium que mejoran con el tiempo y diseños 
                  que permanecen relevantes año tras año.
                </p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="value-card">
                <div class="value-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h3 class="value-title">Diseño Minimalista</h3>
                <p class="value-description">
                  Menos es más. Cada detalle tiene un propósito, cada línea está 
                  cuidadosamente considerada.
                </p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="value-card">
                <div class="value-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <h3 class="value-title">Sostenibilidad</h3>
                <p class="value-description">
                  Comprometidos con prácticas responsables que cuiden nuestro planeta 
                  y las futuras generaciones.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Section -->
        <div class="team-section">
          <h2 class="section-title text-center mb-5">Nuestro Equipo</h2>
          <div class="row g-4">
            <div class="col-md-3 col-sm-6">
              <div class="team-member">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" 
                  alt="Directora Creativa" 
                  class="team-image"
                />
                <h4 class="team-name">Ana Martínez</h4>
                <p class="team-role">Directora Creativa</p>
              </div>
            </div>
            <div class="col-md-3 col-sm-6">
              <div class="team-member">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" 
                  alt="Director de Diseño" 
                  class="team-image"
                />
                <h4 class="team-name">Carlos Ruiz</h4>
                <p class="team-role">Director de Diseño</p>
              </div>
            </div>
            <div class="col-md-3 col-sm-6">
              <div class="team-member">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" 
                  alt="Gerente de Producción" 
                  class="team-image"
                />
                <h4 class="team-name">Laura Sánchez</h4>
                <p class="team-role">Gerente de Producción</p>
              </div>
            </div>
            <div class="col-md-3 col-sm-6">
              <div class="team-member">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" 
                  alt="Director de Marketing" 
                  class="team-image"
                />
                <h4 class="team-name">Diego Torres</h4>
                <p class="team-role">Director de Marketing</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Visit Us -->
        <div class="visit-section">
          <div class="visit-content">
            <h2 class="section-title text-center">Visítanos</h2>
            <p class="section-paragraph text-center">
              Descubre nuestra colección completa en nuestras tiendas físicas. 
              Nuestro equipo está listo para ayudarte a encontrar las piezas perfectas.
            </p>
            <div class="row g-4 mt-4">
              <div class="col-md-6">
                <div class="location-card">
                  <h4 class="location-title">La Paz - Centro</h4>
                  <p class="location-address">
                    Av. 16 de Julio, Edificio Torres Gundlach<br />
                    Piso 3, Local 305<br />
                    Lunes a Sábado: 10:00 - 20:00
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="location-card">
                  <h4 class="location-title">Santa Cruz - Mall Ventura</h4>
                  <p class="location-address">
                    Av. Cristóbal de Mendoza<br />
                    Nivel 2, Local 247<br />
                    Lunes a Domingo: 10:00 - 22:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Editorial Premium Design - Inspirado en COS, Arket, The Row */

.about-page {
  background: #ffffff;
}

/* Hero Section */
.hero-section {
  background: #f8f8f8;
  padding: 120px 0 80px 0;
  margin-top: 80px;
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.hero-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 300;
  letter-spacing: 4px;
  color: #000000;
  text-transform: uppercase;
  margin-bottom: 30px;
}

.hero-divider {
  width: 60px;
  height: 1px;
  background: #000000;
  margin: 0 auto 30px auto;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: #666666;
  line-height: 1.8;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* Content Section */
.content-section {
  padding: 80px 0;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.content-block {
  margin-bottom: 100px;
}

.content-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;
}

.content-text {
  padding: 0 60px;
}

.section-title {
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 2px;
  color: #000000;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.section-paragraph {
  font-size: 1rem;
  line-height: 1.8;
  color: #666666;
  margin-bottom: 20px;
  font-weight: 300;
}

/* Values Section */
.values-section {
  margin-bottom: 100px;
  padding-top: 60px;
  border-top: 1px solid #e5e5e5;
}

.value-card {
  text-align: center;
  padding: 40px 20px;
  transition: background 0.3s ease;
}

.value-card:hover {
  background: #fafafa;
}

.value-icon {
  color: #000000;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.value-title {
  font-size: 1.125rem;
  font-weight: 400;
  letter-spacing: 1px;
  color: #000000;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.value-description {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #666666;
  font-weight: 300;
}

/* Team Section */
.team-section {
  margin-bottom: 100px;
  padding-top: 60px;
  border-top: 1px solid #e5e5e5;
}

.team-member {
  text-align: center;
}

.team-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  margin-bottom: 20px;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.team-member:hover .team-image {
  filter: grayscale(0%);
}

.team-name {
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 1px;
  color: #000000;
  margin-bottom: 8px;
}

.team-role {
  font-size: 0.875rem;
  color: #999999;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 300;
}

/* Visit Section */
.visit-section {
  background: #f8f8f8;
  padding: 80px 0;
  margin: 0 -40px;
}

.visit-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.location-card {
  background: #ffffff;
  padding: 40px;
  height: 100%;
}

.location-title {
  font-size: 1.125rem;
  font-weight: 400;
  letter-spacing: 1px;
  color: #000000;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.location-address {
  font-size: 0.9375rem;
  line-height: 1.8;
  color: #666666;
  font-weight: 300;
  margin: 0;
}

/* Responsive */
@media (max-width: 991px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .content-text {
    padding: 40px 0;
  }
  
  .content-image {
    height: 400px;
  }
  
  .team-image {
    height: 300px;
  }
}

@media (max-width: 767px) {
  .hero-section {
    padding: 80px 0 60px 0;
  }
  
  .hero-title {
    font-size: 1.75rem;
    letter-spacing: 2px;
  }
  
  .content-section {
    padding: 60px 0;
  }
  
  .content-block {
    margin-bottom: 60px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .values-section,
  .team-section {
    margin-bottom: 60px;
  }
  
  .visit-section {
    padding: 60px 0;
  }
}
</style>
