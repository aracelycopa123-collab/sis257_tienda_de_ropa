import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Ventas')
export class Venta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ name: 'fecha' })
  fecha: Date;

  @Column({ name: 'total', type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ name: 'cliente_id' })
  idCliente: number;

  @Column({ name: 'empleado_id' })
  idEmpleado: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  echaCreacion: Date;
  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;
  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.ventas)
  cliente: Cliente;

  @ManyToOne(() => Venta, (venta) => venta.empleados)
  empleados: Empleado;
}
