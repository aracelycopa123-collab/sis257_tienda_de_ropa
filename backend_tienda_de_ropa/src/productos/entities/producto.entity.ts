import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Carrito } from 'src/carrito/entities/carrito.entity';
import { VentaDetalle } from 'src/ventaDetalle/entities/ventaDetalle.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('producto')
export class Producto {
  @ApiProperty({
    example: 1,
    description: 'Identificador único del producto',
  })
  @PrimaryGeneratedColumn('identity', { name: 'id_producto' })
  idProducto: number;

  @ApiProperty({
    example: 'Camisa Casual',
    description: 'Nombre del producto',
    maxLength: 100
  })
  @Column('varchar', { length: 100 })
  nombre: string;

  @ApiProperty({
    example: 'Camisa de algodón con diseño moderno',
    description: 'Descripción detallada del producto'
  })
  @Column('text')
  descripcion: string;

  @ApiProperty({
    example: 299.99,
    description: 'Precio del producto',
    minimum: 0
  })
  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @ApiProperty({
    example: 'M',
    description: 'Talla del producto',
    enum: ['S', 'M', 'L', 'XL']
  })
  @Column({ type: 'enum', enum: ['S', 'M', 'L', 'XL'] })
  talla: 'S' | 'M' | 'L' | 'XL';

  @ApiProperty({
    example: 100,
    description: 'Cantidad disponible en inventario',
    minimum: 0
  })
  @Column('int')
  stock: number;

  @ApiProperty({
    example: 'Camisas',
    description: 'Categoría del producto',
    maxLength: 50
  })
  @Column('varchar', { length: 50 })
  categoria: string;

  @ApiProperty({
    example: 'https://ejemplo.com/imagen.jpg',
    description: 'URL de la imagen del producto',
    maxLength: 255
  })
  @Column('varchar', { length: 255 })
  imagen: string;

  @OneToMany(() => Carrito, (carrito: Carrito) => carrito.producto)
  carritos: Carrito[];

  @OneToMany(() => VentaDetalle, (vd: VentaDetalle) => vd.producto)
  ventaDetalles: VentaDetalle[];
}
