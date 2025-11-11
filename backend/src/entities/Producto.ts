import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Categoria } from "./Categoria";

@Entity()
export class Producto {
  @PrimaryGeneratedColumn() id_Producto: number;

  @Column() nombre: string;

  @Column({ nullable: true }) descripcion: string;

  @Column("decimal") precio: number;

  @Column("int") stock: number;

  @Column({ nullable: true }) color: string;

  @Column({ nullable: true }) talla: string;

  @ManyToOne(() => Categoria)
  @JoinColumn({ name: "id_Categoria" })
  categoria: Categoria;

  @Column({ nullable: true }) imagen: string;

  @Column({ default: true }) estado: boolean;
}
