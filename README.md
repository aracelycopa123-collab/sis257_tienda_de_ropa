
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
- id (PK)  
- nombre  
- apellido  
- correo  
- contraseña_hash  
- rol (admin / cliente)  
- activo  

### Producto
- id (PK)  
- nombre  
- descripción  
- precio  
- stock  
- categoría_id (FK)  
- talla_id (FK)  
- color_id (FK)  
- imagen_url  
- activo  

### Categoría
- id (PK)  
- nombre  
- descripción  
- activo  

### Color
- id (PK)  
- nombre  
- código_hex  
- activo  

### Talla
- id (PK)  
- nombre  
- descripción  
- activo  

### Venta
- id (PK)  
- cliente_id (FK → Usuario)  
- fecha_venta  
- total  
- estado (pendiente, pagada, cancelada)  

### DetalleVenta
- id (PK)  
- venta_id (FK → Venta)  
- producto_id (FK → Producto)  
- cantidad  
- precio_unitario  

