<<<<<<< HEAD
# frontend_tienda_de_ropa

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
=======
# sis257_tienda_de_ropa

## Descripción inicial del negocio

La **Tienda de Ropa “Moda Urbana”** es un negocio dedicado a la venta de prendas de vestir para hombres, mujeres y niños.  
El objetivo del sistema es automatizar la gestión de productos, controlar el inventario y facilitar el proceso de compra para los clientes.  

El sistema permitirá a los administradores registrar y actualizar información sobre los productos, tallas, colores y categorías.  
También contará con una funcionalidad de venta, donde los clientes podrán realizar pedidos, y el sistema calculará los totales y actualizará el stock de los productos.

Este proyecto busca digitalizar los procesos principales del negocio, mejorando la organización, el control y la eficiencia en las ventas.

## Entidades y campos tentativos

se describen las entidades iniciales del sistema y los campos que podrían formar parte de la base de datos:

### Usuario
- id_Usuario(PK)  
- nombre    
- correo  
- contraseña 
- rol (admin / cliente)  
- fecha_registro
- estado 

### Producto
- id_Producto(PK)  
- nombre  
- descripción  
- precio  
- stock  
- color
- talla
- id_Categoria (FK)    
- imagen  
- categoría
- estado
- imagen  

### Categoría
- id (PK)  
- nombre  
- descripción  
- activo  


### Venta
- id_Venta (PK)  
- id_Usuario  
- fecha_venta  
- total  
- metodo_pago

### DetalleVenta
- id_DetalleVenta(PK)  
- id_Venta (FK → Venta)  
- id_Producto (FK → Producto)  
- cantidad  
- precio_unitario  

### Carrito
- id_Carrito
- id_Usuario
- id_Producto 
- Cantidad


>>>>>>> 35732a87ec1529a0145912b75573d23d9d5f3386
