import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venta } from 'src/ventas/entities/venta.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Entity('venta_detalle')
export class VentaDetalle {
  @PrimaryGeneratedColumn('identity', { name: 'id_detalle' })
  idDetalle: number;

  @Column('int', { name: 'id_venta' })
  idVenta: number;

  @Column('int', { name: 'id_producto' })
  idProducto: number;

  @Column('int')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'precio_unitario' })
  precioUnitario: number;

  @ManyToOne(() => Venta, (venta: Venta) => venta.ventaDetalles)
  @JoinColumn({ name: 'id_venta' })
  venta: Venta;

  @ManyToOne(() => Producto, (producto: Producto) => producto.ventaDetalles)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;
}
