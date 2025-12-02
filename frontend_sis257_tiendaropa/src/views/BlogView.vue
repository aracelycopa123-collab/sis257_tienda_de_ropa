<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  window.scrollTo(0, 0)
})

const blogPosts = [
  {
    id: 1,
    title: 'El Arte del Minimalismo en el Armario Moderno',
    date: '15 de Octubre, 2024',
    category: 'Tendencias',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    excerpt: 'Descubre cómo crear un guardarropa versátil con piezas esenciales que trascienden las temporadas y definen tu estilo personal.'
  },
  {
    id: 2,
    title: 'Guía Completa: Cómo Combinar Texturas y Tonos Neutros',
    date: '8 de Octubre, 2024',
    category: 'Estilo',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    excerpt: 'La elegancia está en los detalles. Aprende a mezclar diferentes texturas manteniendo una paleta de colores sofisticada.'
  },
  {
    id: 3,
    title: 'Sostenibilidad: El Futuro de la Moda de Lujo',
    date: '1 de Octubre, 2024',
    category: 'Sostenibilidad',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea1f1d94?w=800&q=80',
    excerpt: 'Explora cómo las marcas premium están redefiniendo el lujo con prácticas conscientes y materiales sostenibles.'
  },
  {
    id: 4,
    title: 'Piezas de Inversión: Qué Buscar en Ropa de Calidad',
    date: '24 de Septiembre, 2024',
    category: 'Guías',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
    excerpt: 'No todas las prendas son iguales. Descubre los indicadores de calidad que hacen que una pieza valga la pena.'
  },
  {
    id: 5,
    title: 'El Poder del Negro: Construyendo un Look Atemporal',
    date: '17 de Septiembre, 2024',
    category: 'Inspiración',
    image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80',
    excerpt: 'Explora la versatilidad del negro en la moda contemporánea y cómo crear looks sofisticados con esta paleta monocromática.'
  },
  {
    id: 6,
    title: 'Transición de Temporada: Del Verano al Otoño',
    date: '10 de Septiembre, 2024',
    category: 'Tendencias',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    excerpt: 'Adapta tu guardarropa a los cambios climáticos sin sacrificar estilo. Tips de layering y piezas clave para la transición.'
  }
]

const featuredPost = {
  id: 1,
  title: 'La Nueva Era del Minimalismo Escandinavo',
  date: '22 de Octubre, 2024',
  category: 'Editorial',
  image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80',
  excerpt: 'Una exploración profunda sobre cómo el diseño nórdico continúa influenciando la moda global y redefiniendo el concepto de lujo accesible en 2024.'
}
</script>

<template>
  <div class="blog-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">Blog de Moda</h1>
          <div class="hero-divider"></div>
          <p class="hero-subtitle">
            Inspiración, tendencias y consejos de estilo para el guardarropa contemporáneo
          </p>
        </div>
      </div>
    </section>

    <!-- Featured Post -->
    <section class="featured-section">
      <div class="featured-container">
        <article class="featured-post">
          <div class="row align-items-center">
            <div class="col-lg-7">
              <img :src="featuredPost.image" :alt="featuredPost.title" class="featured-image" />
            </div>
            <div class="col-lg-5">
              <div class="featured-content">
                <span class="post-category">{{ featuredPost.category }}</span>
                <h2 class="featured-title">{{ featuredPost.title }}</h2>
                <p class="featured-excerpt">{{ featuredPost.excerpt }}</p>
                <div class="post-meta">
                  <span class="post-date">{{ featuredPost.date }}</span>
                </div>
                <a href="#!" class="btn-read-more">Leer Artículo Completo</a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Blog Grid -->
    <section class="blog-section">
      <div class="blog-container">
        <div class="section-header">
          <h2 class="section-title">Últimas Publicaciones</h2>
          <div class="section-divider"></div>
        </div>

        <div class="row g-4">
          <div v-for="post in blogPosts" :key="post.id" class="col-lg-4 col-md-6">
            <article class="blog-card">
              <a href="#!" class="card-image-link">
                <img :src="post.image" :alt="post.title" class="card-image" />
              </a>
              <div class="card-content">
                <span class="post-category">{{ post.category }}</span>
                <h3 class="card-title">
                  <a href="#!">{{ post.title }}</a>
                </h3>
                <p class="card-excerpt">{{ post.excerpt }}</p>
                <div class="card-footer">
                  <span class="post-date">{{ post.date }}</span>
                  <a href="#!" class="read-more-link">Leer más</a>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Load More -->
        <div class="load-more-section">
          <button class="btn-load-more">Cargar Más Artículos</button>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section">
      <div class="newsletter-container">
        <div class="newsletter-content">
          <h2 class="newsletter-title">Suscríbete a Nuestro Newsletter</h2>
          <p class="newsletter-subtitle">
            Recibe las últimas tendencias, consejos de estilo y ofertas exclusivas directamente en tu correo
          </p>
          <form class="newsletter-form">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              class="newsletter-input"
              required
            />
            <button type="submit" class="btn-newsletter">Suscribirse</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Editorial Premium Design - Inspirado en COS, Kinfolk, The Gentlewoman */

.blog-page {
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

/* Featured Post */
.featured-section {
  padding: 80px 0;
  border-bottom: 1px solid #e5e5e5;
}

.featured-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.featured-image {
  width: 100%;
  height: 600px;
  object-fit: cover;
  display: block;
}

.featured-content {
  padding: 0 60px;
}

.post-category {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 1.5px;
  color: #999999;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.featured-title {
  font-size: 2.25rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: #000000;
  line-height: 1.3;
  margin-bottom: 24px;
}

.featured-excerpt {
  font-size: 1.0625rem;
  line-height: 1.8;
  color: #666666;
  margin-bottom: 30px;
  font-weight: 300;
}

.post-meta {
  margin-bottom: 30px;
}

.post-date {
  font-size: 0.875rem;
  color: #999999;
  letter-spacing: 0.5px;
}

.btn-read-more {
  display: inline-block;
  background: #000000;
  color: #ffffff;
  padding: 14px 40px;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.3s ease;
}

.btn-read-more:hover {
  background: #333333;
  color: #ffffff;
}

/* Blog Grid */
.blog-section {
  padding: 80px 0;
}

.blog-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 3px;
  color: #000000;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.section-divider {
  width: 60px;
  height: 1px;
  background: #000000;
  margin: 0 auto;
}

/* Blog Cards */
.blog-card {
  background: #ffffff;
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.blog-card:hover {
  transform: translateY(-5px);
}

.card-image-link {
  display: block;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  transition: transform 0.5s ease;
  display: block;
}

.card-image-link:hover .card-image {
  transform: scale(1.05);
}

.card-content {
  padding: 30px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  color: #000000;
  line-height: 1.4;
  margin-bottom: 16px;
  margin-top: 0;
}

.card-title a {
  color: #000000;
  text-decoration: none;
  transition: color 0.2s ease;
}

.card-title a:hover {
  color: #666666;
}

.card-excerpt {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #666666;
  margin-bottom: 24px;
  font-weight: 300;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f5f5f5;
}

.read-more-link {
  font-size: 0.8125rem;
  color: #000000;
  text-decoration: none;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 400;
  transition: opacity 0.2s ease;
}

.read-more-link:hover {
  opacity: 0.6;
}

/* Load More */
.load-more-section {
  text-align: center;
  margin-top: 60px;
}

.btn-load-more {
  background: transparent;
  border: 1px solid #e5e5e5;
  color: #000000;
  padding: 14px 50px;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-load-more:hover {
  background: #000000;
  border-color: #000000;
  color: #ffffff;
}

/* Newsletter Section */
.newsletter-section {
  background: #f8f8f8;
  padding: 80px 0;
}

.newsletter-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 40px;
}

.newsletter-content {
  text-align: center;
}

.newsletter-title {
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 2px;
  color: #000000;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.newsletter-subtitle {
  font-size: 1rem;
  line-height: 1.7;
  color: #666666;
  margin-bottom: 40px;
  font-weight: 300;
}

.newsletter-form {
  display: flex;
  gap: 0;
  max-width: 500px;
  margin: 0 auto;
}

.newsletter-input {
  flex: 1;
  padding: 16px 24px;
  border: 1px solid #e5e5e5;
  font-size: 0.9375rem;
  color: #000000;
  background: #ffffff;
  outline: none;
  transition: border-color 0.2s ease;
}

.newsletter-input:focus {
  border-color: #000000;
}

.newsletter-input::placeholder {
  color: #999999;
}

.btn-newsletter {
  background: #000000;
  color: #ffffff;
  border: none;
  padding: 16px 40px;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.3s ease;
  white-space: nowrap;
}

.btn-newsletter:hover {
  background: #333333;
}

/* Responsive */
@media (max-width: 991px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .featured-image {
    height: 400px;
    margin-bottom: 40px;
  }
  
  .featured-content {
    padding: 0;
  }
  
  .featured-title {
    font-size: 1.75rem;
  }
  
  .card-image {
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
  
  .featured-section,
  .blog-section,
  .newsletter-section {
    padding: 60px 0;
  }
  
  .section-title,
  .newsletter-title {
    font-size: 1.5rem;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .btn-newsletter {
    width: 100%;
  }
}
</style>
