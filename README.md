# 👗 Tienda de Ropa ROMA

**Sistema de gestión y venta online para tienda de ropa**

---

## 📋 Descripción

**Tienda de Ropa ROMA** es una aplicación web completa de e-commerce diseñada para la venta de prendas de vestir para hombres, mujeres y niños. El sistema permite a los clientes explorar el catálogo de productos, agregar artículos al carrito de compras y realizar pedidos en línea.

El panel de administración permite gestionar productos, categorías, colores, clientes, empleados y ventas de manera eficiente.

---

## ✨ Características

### 🛒 Para Clientes
- **Catálogo de productos** con filtros por categoría, color y talla
- **Carrito de compras** flotante con vista compacta e intuitiva
- **Sistema de pedidos** con seguimiento de estados
- **Perfil de usuario** para ver historial de compras
- **Registro e inicio de sesión** seguro

### 👨‍💼 Para Administradores
- **CRUD completo** de productos, categorías, colores, clientes y empleados
- **Gestión de ventas** con flujo de estados (pendiente → confirmado → en preparación → enviado → entregado)
- **Búsqueda y filtrado** en todas las tablas
- **Vista previa de imágenes** de productos

---

## 🔐 Sistema de Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para la autenticación:

| Rol | Acceso |
|-----|--------|
| **Administrador** | Panel completo de administración + tienda |
| **Cliente** | Tienda, carrito, pedidos y perfil personal |

### Credenciales de prueba

```
👤 Administrador
   Usuario: admin
   Contraseña: 123456

👤 Cliente
   Usuario: cliente1
   Contraseña: 123456
```

---

## 🗃️ Modelo de Datos

El sistema está compuesto por las siguientes entidades principales:

### Diagrama de Entidades

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuario   │────▶│   Cliente   │────▶│    Venta    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
┌─────────────┐     ┌─────────────┐     ┌──────▼──────┐
│  Categoría  │────▶│  Producto   │◀────│VentaDetalle │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │    Color    │
                    └─────────────┘
```

### 📊 Tablas del Sistema

| Entidad | Descripción |
|---------|-------------|
| **Usuario** | Credenciales de acceso (nombre_usuario, clave, rol) |
| **Cliente** | Datos personales (nombre, apellido, CI, teléfono, dirección, género, fecha_nacimiento) |
| **Empleado** | Personal de la tienda (nombre, apellido, cargo, teléfono) |
| **Categoría** | Clasificación de productos (nombre, descripción) |
| **Color** | Colores disponibles (nombre, código hexadecimal) |
| **Producto** | Artículos en venta (nombre, descripción, precio, stock, talla, imagen) |
| **Venta** | Pedidos realizados (fecha, total, estado, método de pago) |
| **VentaDetalle** | Productos incluidos en cada venta (cantidad, precio unitario) |

### Estados de una Venta

```
pendiente → confirmado → en_preparacion → enviado → entregado
     ↓           ↓              ↓            ↓
                        anulada
```

---

## 🚀 Instalación

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior
- [Docker](https://www.docker.com/) y Docker Compose
- [Git](https://git-scm.com/)

### Opción 1: Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/aracelycopa123-collab/sis257_tienda_de_ropa.git
cd sis257_tienda_de_ropa

# Levantar los contenedores
docker-compose up -d

# La aplicación estará disponible en:
# Frontend: http://localhost
# Backend API: http://localhost:3000
```

### Opción 2: Desarrollo Local

```bash
# Backend
cd backend_sis257_tiendaropa
npm install
npm run start:dev

# Frontend (en otra terminal)
cd frontend_sis257_tiendaropa
npm install
npm run dev
```

---

## 💻 Uso

### Acceso a la Aplicación

| Servicio | URL |
|----------|-----|
| 🌐 Tienda (Frontend) | http://localhost |
| 🔌 API (Backend) | http://localhost:3000 |
| 📚 Documentación API | http://localhost:3000/api |

### Flujo de Compra

1. **Explorar** el catálogo de productos
2. **Agregar** productos al carrito
3. **Iniciar sesión** o registrarse
4. **Confirmar** datos de envío
5. **Realizar** el pedido
6. **Seguir** el estado del pedido en "Mis Pedidos"

---

## 🛠️ Tecnologías

### Frontend
- **Vue.js 3** - Framework de JavaScript
- **Pinia** - Gestión de estado
- **Vue Router** - Enrutamiento
- **Vite** - Build tool
- **TypeScript** - Tipado estático

### Backend
- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para bases de datos
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Swagger** - Documentación API

### DevOps
- **Docker** - Contenedores
- **Docker Compose** - Orquestación

---

## 📁 Estructura del Proyecto

```
sis257_tienda_de_ropa/
├── 📂 backend_sis257_tiendaropa/
│   ├── src/
│   │   ├── auth/          # Autenticación JWT
│   │   ├── categorias/    # CRUD categorías
│   │   ├── clientes/      # CRUD clientes
│   │   ├── colores/       # CRUD colores
│   │   ├── productos/     # CRUD productos
│   │   ├── usuarios/      # CRUD usuarios
│   │   ├── ventas/        # CRUD ventas
│   │   └── venta-detalles/# Detalles de venta
│   └── Dockerfile
│
├── 📂 frontend_sis257_tiendaropa/
│   ├── src/
│   │   ├── components/    # Componentes Vue
│   │   ├── views/         # Páginas
│   │   ├── stores/        # Estado (Pinia)
│   │   ├── router/        # Rutas
│   │   └── models/        # Interfaces TypeScript
│   └── Dockerfile
│
├── 📂 scripts_sql/        # Scripts de datos de prueba
├── docker-compose.yml
└── README.md
```

---

## 👥 Colaboradores

<table>
  <tr>
    <!-- Tú -->
    <td align="center">
      <a href="https://github.com/aracelycopa123-collab">
        <img src="https://github.com/aracelycopa123-collab.png" width="100px;" alt="Aracely Copa"/>
        <br />
        <sub><b>Aracely Copa</b></sub>
      </a>
      <br />
      <sub>Desarrolladora</sub>
    </td>
    
    <!-- Roberto -->
    <td align="center">
      <a href="https://github.com/rober090401">
        <img src="https://github.com/rober090401.png" width="100px;" alt="Roberto Cañizares"/>
        <br />
        <sub><b>Roberto Cañizares</b></sub>
      </a>
      <br />
      <sub>Desarrollador</sub>
    </td>
  </tr>
</table>

---

## 📄 Licencia

Este proyecto fue desarrollado como parte del curso **SIS-257** de la carrera de Ingeniería en Sistemas.

---

<div align="center">

**⭐ Si te gustó el proyecto, no olvides darle una estrella ⭐**

Hecho con ❤️ en Bolivia 🇧🇴

</div>



