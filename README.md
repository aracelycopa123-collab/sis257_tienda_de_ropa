# sis257_tienda_de_ropa

## Descripción inicial del negocio

La **Tienda de Ropa “ROMA”** es un negocio dedicado a la venta de prendas de vestir para hombres, mujeres, niños realiza ventas online.  
El objetivo del sistema es automatizar la gestión de productos, controlar el inventario y facilitar el proceso de compra para los clientes.  

El sistema permitirá a los administradores registrar y actualizar información sobre los productos, tallas, colores y categorías.  
También contará con una funcionalidad de venta, donde los clientes podrán realizar pedidos, y el sistema calculará los totales y actualizará el stock de los productos.

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



