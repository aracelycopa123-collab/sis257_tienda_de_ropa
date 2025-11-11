import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn() id_Usuario: number;

  @Column() nombre: string;

  @Column({ unique: true }) correo: string;

  @Column() contraseña: string; // guardar hash

  @Column({ default: 'cliente' }) rol: 'admin' | 'cliente';

  @CreateDateColumn() fecha_registro: Date;

  @Column({ default: true }) estado: boolean;
}

