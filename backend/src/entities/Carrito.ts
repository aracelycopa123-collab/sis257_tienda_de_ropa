import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Producto } from "./Producto";

@Entity()
export class Carrito {
  @PrimaryGeneratedColumn() id_Carrito: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "id_Usuario" })
  usuario: Usuario;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: "id_Producto" })
  producto: Producto;

  @Column("int") cantidad: number;
}
