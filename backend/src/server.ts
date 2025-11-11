import dotenv from "dotenv";
dotenv.config();  // Esto carga las variables del archivo .env

import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";

dotenv.config(); // Carga las variables del .env

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Base de datos conectada");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  })
  .catch((err) => console.error("Error al conectar la base de datos", err));
