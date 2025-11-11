import dotenv from "dotenv";
dotenv.config(); 
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "./entities/Usuario";
import { Categoria } from "./entities/Categoria";
import { Producto } from "./entities/Producto";
import { Venta } from "./entities/Venta";
import { DetalleVenta } from "./entities/DetalleVenta";
import { Carrito } from "./entities/Carrito";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables del .env

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Usuario, Categoria, Producto, Venta, DetalleVenta, Carrito],
  synchronize: true, // ⚠ solo desarrollo: crea automáticamente las tablas
});
