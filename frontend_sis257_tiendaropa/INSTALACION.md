# 🚀 Guía de Instalación - Frontend Tienda de Ropa

## Requisitos Previos

Asegúrate de tener instalados:
- **Node.js** >= 16 (https://nodejs.org/)
- **npm** (viene con Node.js) o **yarn**

Verifica la instalación:
```bash
node --version
npm --version
```

## 📦 Pasos de Instalación

### 1. Navegar al directorio del proyecto

```bash
cd c:/Final/sis257_tienda_de_ropa/frontend_sis257_tiendaropa
```

### 2. Instalar dependencias

```bash
npm install
```

O si usas yarn:
```bash
yarn install
```

### 3. Configurar variables de entorno

Crea o edita el archivo `.env`:

```env
VITE_BASE_URL_ENDPOINT=http://localhost:3000/api/v1/
VITE_APP_TITLE=Tienda de Ropa
```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

El servidor se ejecutará en: **http://localhost:5173**

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de la build de producción
npm run preview

# Verificar tipos TypeScript
npm run type-check

# Ejecutar linter/formatter
npm run format (si está configurado)
```

## ⚙️ Requisitos de Backend

Para que el frontend funcione correctamente, necesitas que el backend esté corriendo:

**URL del Backend:** `http://localhost:3000/api/v1/`

Si tu backend está en otro puerto, actualiza el `.env`:

```env
VITE_BASE_URL_ENDPOINT=http://localhost:TUpuerto/api/v1/
```

## 📱 Características Principales

✅ Catálogo de productos
✅ Carrito de compras
✅ Login/Registro
✅ Checkout con múltiples métodos de pago
✅ Interfaz responsiva
✅ Integración con API Backend

## 🎨 Estructura de Carpetas

```
src/
├── components/        # Componentes reutilizables
├── views/            # Páginas principales
├── router/           # Configuración de rutas
├── stores/           # Gestión de estado (Pinia)
├── services/         # Servicios API
├── models/           # Interfaces TypeScript
├── helpers/          # Funciones auxiliares
├── assets/           # Estilos y recursos
└── App.vue           # Componente raíz
```

## 🌐 Rutas Disponibles

- **/** - Página de inicio
- **/productos** - Catálogo de productos
- **/productos/:id** - Detalle del producto
- **/carrito** - Carrito de compras
- **/checkout** - Pago/Checkout
- **/login** - Iniciar sesión
- **/registro** - Crear cuenta

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)**:

1. El token se almacena en `localStorage`
2. Se envía automáticamente en cada request
3. Válido para proteger rutas

Ejemplo de uso:
```typescript
// En LoginView.vue
const response = await apiService.login(email, password)
// El token se guarda automáticamente en authStore
```

## 🐛 Solución de Problemas

### Error: Cannot find module 'vue'
```bash
npm install
```

### Puerto 5173 ya en uso
```bash
npm run dev -- --port 5174
```

### CORS error
Asegúrate que el backend tenga CORS habilitado:
```typescript
// Backend NestJS
app.enableCors()
```

### Productos no cargan
1. Verifica que el backend está corriendo
2. Revisa la URL en `.env`
3. Abre la consola (F12) y ve los errores

## 📊 Gestión de Estado

### Carrito
```typescript
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
cartStore.addItem(product)
cartStore.total // Total del carrito
```

### Autenticación
```typescript
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
authStore.isAuthenticated // ¿Está logueado?
authStore.user // Datos del usuario
```

## 📝 Próximas Mejoras

- [ ] Carrito persistente en localStorage
- [ ] Búsqueda avanzada
- [ ] Reseñas de productos
- [ ] Historial de compras
- [ ] Notificaciones push
- [ ] Dark mode

## 🤝 Soporte

Para dudas o problemas, contacta al equipo de desarrollo del grupo SIS257.

---

**Última actualización:** Noviembre 2024
**Versión:** 1.0.0
