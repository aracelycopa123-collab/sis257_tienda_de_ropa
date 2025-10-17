import { Venta } from 'src/venta/entities/venta.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column('varchar', { length: 100 })
  nombre: string;
  @Column('varchar', { length: 50 })
  cargo: string;
  @Column('decimal', { precision: 10, scale: 2 })
  salario: number;
  @Column('date', { name: 'fecha_ingreso' })
  fechaIngreso: Date;
  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;
  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Venta, (venta) => venta.empleados)
  ventas: Venta[];
}
