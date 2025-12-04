import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { Cliente } from './entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClientesModule {}



// app_productos_demo.js
// Archivo DEMO largo para aumentar contribuciones en GitHub
// Backend Node + Express + MongoDB (estructura simulada)

// ---------------------------
// IMPORTS
// ---------------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------
// CONEXIÓN A BD (SIMULADO)
// ---------------------------
mongoose
  .connect("mongodb://localhost:27017/tienda_demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("BD conectada (DEMO)"))
  .catch((err) => console.error("Error BD:", err));

// ---------------------------
// MODELO PRODUCTO
// ---------------------------
const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  categoria: { type: String, default: "general" },
  imagen: { type: String, default: null },
  fechaRegistro: { type: Date, default: Date.now },
});

const Producto = mongoose.model("Producto", productoSchema);

// ---------------------------
// CRUD PRODUCTOS
// ---------------------------

// Crear un producto
app.post("/api/productos", async (req, res) => {
  try {
    const nuevo = new Producto(req.body);
    await nuevo.save();
    res.json({ mensaje: "Producto creado", data: nuevo });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener todos los productos
app.get("/api/productos", async (req, res) => {
  try {
    const lista = await Producto.find();
    res.json(lista);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Buscar producto por ID
app.get("/api/productos/:id", async (req, res) => {
  try {
    const p = await Producto.findById(req.params.id);
    if (!p) return res.status(404).json({ mensaje: "No encontrado" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Actualizar producto
app.put("/api/productos/:id", async (req, res) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ mensaje: "Actualizado", data: actualizado });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Eliminar producto
app.delete("/api/productos/:id", async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Producto eliminado" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------------------
// ENDPOINTS ADICIONALES (para hacer el archivo más largo)
// ---------------------------

// Filtrar por categoría
app.get("/api/categoria/:cat", async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: req.params.cat });
    res.json(productos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Actualizar stock
app.patch("/api/productos/:id/stock", async (req, res) => {
  try {
    const { nuevoStock } = req.body;
    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      { stock: nuevoStock },
      { new: true }
    );
    res.json(actualizado);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Listar productos sin stock
app.get("/api/productos/sin-stock", async (req, res) => {
  try {
    const sinStock = await Producto.find({ stock: 0 });
    res.json(sinStock);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener productos caros
app.get("/api/productos/carros", async (req, res) => {
  try {
    const caros = await Producto.find({ precio: { $gte: 500 } });
    res.json(caros);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener productos baratos
app.get("/api/productos/baratos", async (req, res) => {
  try {
    const baratos = await Producto.find({ precio: { $lte: 100 } });
    res.json(baratos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------------------
// SERVIDOR
// ---------------------------
app.listen(5000, () => {
  console.log("Servidor DEMO ejecutándose en el puerto 5000");
});

// ---------------------------
// FIN DEL ARCHIVO (120+ líneas)
// ---------------------------
