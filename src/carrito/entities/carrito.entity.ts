import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Entity('carrito')
export class Carrito {
  @PrimaryGeneratedColumn('identity', { name: 'id_carrito' })
  id: number;

  @Column('int', { name: 'id_usuario' })
  idUsuario: number;

  @Column('int', { name: 'id_producto' })
  idProducto: number;

  @Column('int')
  cantidad: number;

  @ManyToOne(() => Usuario, (usuario: Usuario) => usuario.carritos)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Producto, (producto: Producto) => producto.carritos)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;
}
