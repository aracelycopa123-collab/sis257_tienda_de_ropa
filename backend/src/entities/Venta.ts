import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Entity()
export class Venta {
  @PrimaryGeneratedColumn() id_Venta: number;

  @ManyToOne(() => Usuario)
  usuario: Usuario;

  @CreateDateColumn() fecha_venta: Date;

  @Column("decimal") total: number;

  @Column() metodo_pago: string;
}
