# Frontend - Tienda de Ropa

Frontend desarrollado con **Vue.js 3 + Vite + TypeScript + Bootstrap 5**, integrado con template Majestic para una interfaz moderna y responsiva.

## 🛍️ Características

- ✅ Catálogo de productos con búsqueda y filtros
- ✅ Carrito de compras persistente
- ✅ Sistema de autenticación (Login/Registro)
- ✅ Checkout completo con múltiples métodos de pago
- ✅ Interfaz responsiva basada en Bootstrap
- ✅ Integración con API backend NestJS
- ✅ Gestión de estado con Pinia
- ✅ Rutas protegidas
- ✅ Diseño profesional inspirado en Majestic

## 🚀 Requisitos

- Node.js >= 16
- npm o yarn

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

## 🗂️ Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── views/           # Vistas principales
│   ├── HomeView.vue              # Página de inicio
│   ├── ProductosView.vue         # Catálogo de productos
│   ├── ProductoDetalleView.vue   # Detalle de producto
│   ├── CarritoView.vue           # Carrito de compras
│   ├── CheckoutView.vue          # Pago/Checkout
│   ├── LoginView.vue             # Iniciar sesión
│   └── RegistroView.vue          # Registro de usuario
├── router/          # Configuración de rutas
├── stores/          # Stores de Pinia (estado global)
│   ├── authStore.ts              # Autenticación
│   └── cartStore.ts              # Carrito
├── services/        # Servicios API
│   └── apiService.ts             # Cliente HTTP con axios
├── models/          # Interfaces/Types TypeScript
├── helpers/         # Funciones utilitarias
├── assets/          # CSS, imágenes, fuentes
└── App.vue          # Componente raíz
```

## 🔌 Configuración API

Edita el archivo `.env`:

```env
VITE_BASE_URL_ENDPOINT=http://localhost:3000/api/v1/
VITE_APP_TITLE=Tienda de Ropa
```

## 🎨 Personalización de Estilos

Los estilos de Majestic están ubicados en:
- `public/assets/css/theme.min.css`

Puedes crear estilos personalizados en:
- `src/assets/css/`

## 📱 Páginas Principales

### 1. **Inicio (Home)**
- Bienvenida
- Ventajas del negocio
- Botones de acción

### 2. **Catálogo de Productos**
- Búsqueda por nombre
- Filtrado por categoría
- Ordenamiento por precio
- Tarjetas de productos
- Botón "Agregar al Carrito"

### 3. **Detalle de Producto**
- Información completa
- Especificaciones
- Selector de cantidad
- Agregar al carrito

### 4. **Carrito de Compras**
- Listado de productos
- Modificar cantidad
- Calcular total con IVA y envío
- Proceder al pago

### 5. **Checkout/Pago**
- Información de envío
- Selección de método de pago
- Resumen de pedido
- Confirmar compra

### 6. **Autenticación**
- Login
- Registro de usuario

## 🔐 Autenticación

El sistema usa JWT con las siguientes características:
- Token almacenado en localStorage
- Interceptor automático en requests
- Store de Pinia para gestionar estado de usuario
- Protección de rutas (próximamente)

## 📊 Gestión de Estado (Pinia)

### AuthStore
```typescript
- user: Usuario autenticado
- token: JWT Token
- isAuthenticated: Estado de autenticación
- login(): Iniciar sesión
- logout(): Cerrar sesión
- loadUserFromStorage(): Cargar usuario guardado
```

### CartStore
```typescript
- items: Productos en carrito
- total: Suma total
- addItem(): Agregar producto
- removeItem(): Eliminar producto
- updateQuantity(): Cambiar cantidad
- clearCart(): Vaciar carrito
```

## 🌐 Endpoints API Esperados

El frontend espera estos endpoints en el backend:

```
GET    /productos              - Listar productos
GET    /productos/:id          - Obtener producto
GET    /categorias             - Listar categorías
POST   /ventas                 - Crear venta/compra
GET    /ventas                 - Mis ventas
POST   /auth/login             - Iniciar sesión
POST   /auth/registro          - Registrar usuario
GET    /clientes               - Listar clientes
GET    /clientes/:id           - Obtener cliente
GET    /venta-detalles         - Detalles de venta
```

## 🎯 Próximas Mejoras

- [ ] Rutas protegidas
- [ ] Integración con pasarela de pago real
- [ ] Historial de compras
- [ ] Reseñas de productos
- [ ] Wishlist/Favoritos
- [ ] Notificaciones en tiempo real
- [ ] Dashboard admin
- [ ] Múltiples idiomas

## 📝 Notas Importantes

1. Asegúrate que el backend esté corriendo en `http://localhost:3000`
2. El frontend se ejecuta en `http://localhost:5173`
3. Los datos de productos deben venir del backend
4. El carrito se sincroniza con el store de Pinia
5. Los tokens se almacenan en localStorage

## 🤝 Contribuciones

Este proyecto está en desarrollo como parte del laboratorio SIS257.

## 📄 Licencia

Proyecto académico - SIS257

---

**Desarrollado por:** Grupo SIS257 - Tienda de Ropa
**Fecha:** Noviembre 2024
