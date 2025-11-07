import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Carrito } from 'src/carrito/entities/carrito.entity';
import { Venta } from 'src/ventas/entities/venta.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn('identity', { name: 'id_usuario' })
  idUsuario: number;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column('varchar', { length: 200, unique: true })
  correo: string;

  @Column('varchar', { length: 20, unique: true })
  usuario: string;

  @Column('varchar', { length: 100 })
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'cliente'], default: 'cliente' })
  rol: 'admin' | 'cliente';

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';

  @OneToMany(() => Carrito, (carrito: Carrito) => carrito.usuario)
  carritos: Carrito[];

  @OneToMany(() => Venta, (venta: Venta) => venta.usuario)
  ventas: Venta[];
}
