import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { VentaDetalle } from 'src/ventaDetalle/entities/ventaDetalle.entity';

@Entity('venta')
export class Venta {
  @PrimaryGeneratedColumn('identity', { name: 'id_venta' })
  idVenta: number;

  @Column('timestamp', { name: 'fecha', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: ['efectivo', 'tarjeta', 'transferencia'],
    name: 'metodo_pago',
  })
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';

  @Column('int', { name: 'id_usuario' })
  idUsuario: number;

  @ManyToOne(() => Usuario, (usuario: Usuario) => usuario.ventas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @OneToMany(() => VentaDetalle, (vd: VentaDetalle) => vd.venta)
  ventaDetalles: VentaDetalle[];
}
