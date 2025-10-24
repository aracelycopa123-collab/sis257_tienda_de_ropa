import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Carrito } from 'src/carrito/entities/carrito.entity';
import { VentaDetalle } from 'src/ventaDetalle/entities/ventaDetalle.entity';

@Entity('producto')
export class Producto {
  @PrimaryGeneratedColumn('identity', { name: 'id_producto' })
  idProducto: number;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'enum', enum: ['S', 'M', 'L', 'XL'] })
  talla: 'S' | 'M' | 'L' | 'XL';

  @Column('int')
  stock: number;

  @Column('varchar', { length: 50 })
  categoria: string;

  @Column('varchar', { length: 255 })
  imagen: string;

  @OneToMany(() => Carrito, (carrito: Carrito) => carrito.producto)
  carritos: Carrito[];

  @OneToMany(() => VentaDetalle, (vd: VentaDetalle) => vd.producto)
  ventaDetalles: VentaDetalle[];
}
