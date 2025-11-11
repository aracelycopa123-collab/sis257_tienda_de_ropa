import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Venta } from "./Venta";
import { Producto } from "./Producto";

@Entity()
export class DetalleVenta {
  @PrimaryGeneratedColumn() id_DetalleVenta: number;

  @ManyToOne(() => Venta)
  @JoinColumn({ name: "id_Venta" })
  venta: Venta;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: "id_Producto" })
  producto: Producto;

  @Column("int") cantidad: number;

  @Column("decimal") precio_unitario: number;
}
