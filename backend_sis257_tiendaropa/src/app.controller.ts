import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}


const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ---------------------------
// Datos en memoria (simulación)
// ---------------------------
let products = [
  { id: 1, name: "Remera básica", price: 15.99, stock: 50, category: "Ropa" },
  { id: 2, name: "Jean azul", price: 39.99, stock: 30, category: "Ropa" },
  { id: 3, name: "Zapatillas running", price: 69.00, stock: 20, category: "Calzado" }
];

let users = [
  { id: 1, name: "Ana Perez", email: "ana@example.com", role: "cliente" },
  { id: 2, name: "Admin", email: "admin@example.com", role: "admin" }
];

let orders = []; // { id, userId, items: [{productId, qty}], total, status }

// ---------------------------
// Utilidades y helpers
// ---------------------------
const generateId = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return 1;
  return Math.max(...arr.map(x => x.id)) + 1;
};

const findProduct = (id) => products.find(p => p.id === Number(id));
const findUser = (id) => users.find(u => u.id === Number(id));

const calculateOrderTotal = (items) => {
  let total = 0;
  for (const it of items) {
    const p = findProduct(it.productId);
    if (!p) throw new Error(`Producto ${it.productId} no existe`);
    total += p.price * it.qty;
  }
  return Number(total.toFixed(2));
};

// ---------------------------
// Middleware simple
// ---------------------------
function logRequests(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

app.use(logRequests);

// Simula autenticación con query ?user=1
function simpleAuth(req, res, next) {
  const userId = Number(req.query.user || 0);
  if (!userId) return res.status(401).json({ error: "Falta ?user=ID para simular auth" });
  const u = findUser(userId);
  if (!u) return res.status(401).json({ error: "Usuario no encontrado" });
  req.user = u;
  next();
}

// ---------------------------
// Rutas: Productos
// ---------------------------
app.get('/api/products', (req, res) => {
  // filtros opcionales: ?category=Ropa&minPrice=10&maxPrice=50
  let list = products.slice();
  if (req.query.category) list = list.filter(p => p.category === req.query.category);
  if (req.query.minPrice) list = list.filter(p => p.price >= Number(req.query.minPrice));
  if (req.query.maxPrice) list = list.filter(p => p.price <= Number(req.query.maxPrice));
  res.json(list);
});

app.get('/api/products/:id', (req, res) => {
  const p = findProduct(req.params.id);
  if (!p) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(p);
});

app.post('/api/products', simpleAuth, (req, res) => {
  // solo admin
  if (req.user.role !== 'admin') return res.status(403).json({ error: "Acceso denegado" });
  const { name, price, stock, category } = req.body;
  if (!name || price == null) return res.status(400).json({ error: "Faltan campos" });
  const newP = { id: generateId(products), name, price: Number(price), stock: Number(stock || 0), category: category || "General" };
  products.push(newP);
  res.status(201).json(newP);
});

app.put('/api/products/:id', simpleAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: "Acceso denegado" });
  const p = findProduct(req.params.id);
  if (!p) return res.status(404).json({ error: "Producto no encontrado" });
  const { name, price, stock, category } = req.body;
  if (name) p.name = name;
  if (price != null) p.price = Number(price);
  if (stock != null) p.stock = Number(stock);
  if (category) p.category = category;
  res.json(p);
});

app.delete('/api/products/:id', simpleAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: "Acceso denegado" });
  const id = Number(req.params.id);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Producto no encontrado" });
  const removed = products.splice(idx, 1)[0];
  res.json({ removed });
});

// ---------------------------
// Rutas: Usuarios (solo lectura / creación básica)
// ---------------------------
app.get('/api/users', (req, res) => {
  res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email })));
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Faltan campos" });
  const exists = users.some(u => u.email === email);
  if (exists) return res.status(409).json({ error: "Email ya registrado" });
  const newU = { id: generateId(users), name, email, role: "cliente" };
  users.push(newU);
  res.status(201).json(newU);
});

// ---------------------------
// Rutas: Pedidos (orders)
// ---------------------------
app.post('/api/orders', simpleAuth, (req, res) => {
  // Crear pedido: body.items = [{ productId, qty }]
  const items = req.body.items;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "Items vacíos" });

  // Validar stock
  try {
    for (const it of items) {
      const p = findProduct(it.productId);
      if (!p) return res.status(400).json({ error: `Producto ${it.productId} no existe` });
      if (it.qty > p.stock) return res.status(400).json({ error: `Stock insuficiente para ${p.name}` });
      if (it.qty <= 0) return res.status(400).json({ error: `Cantidad inválida para ${p.name}` });
    }

    const total = calculateOrderTotal(items);
    const newOrder = {
      id: generateId(orders),
      userId: req.user.id,
      items,
      total,
      status: 'pendiente',
      createdAt: new Date().toISOString()
    };

    // Reducir stock (simulación)
    for (const it of items) {
      const p = findProduct(it.productId);
      p.stock -= it.qty;
    }

    orders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', simpleAuth, (req, res) => {
  // admin ve todo, cliente ve solo sus pedidos
  if (req.user.role === 'admin') return res.json(orders);
  res.json(orders.filter(o => o.userId === req.user.id));
});

app.get('/api/orders/:id', simpleAuth, (req, res) => {
  const o = orders.find(x => x.id === Number(req.params.id));
  if (!o) return res.status(404).json({ error: "Pedido no encontrado" });
  if (req.user.role !== 'admin' && o.userId !== req.user.id) return res.status(403).json({ error: "Acceso denegado" });
  res.json(o);
});

app.put('/api/orders/:id/status', simpleAuth, (req, res) => {
  // Cambiar estado (solo admin)
  if (req.user.role !== 'admin') return res.status(403).json({ error: "Acceso denegado" });
  const o = orders.find(x => x.id === Number(req.params.id));
  if (!o) return res.status(404).json({ error: "Pedido no encontrado" });
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "Falta status" });
  o.status = status;
  res.json(o);
});

// ---------------------------
// Rutas auxiliares de ejemplo
// ---------------------------
app.get('/api/stats', (req, res) => {
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  res.json({ totalProducts, totalUsers, totalOrders, revenue: Number(revenue.toFixed(2)) });
});

// Endpoint para "resetear" datos (solo admin)
app.post('/api/reset', simpleAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: "Acceso denegado" });
  products = [
    { id: 1, name: "Remera básica", price: 15.99, stock: 50, category: "Ropa" },
    { id: 2, name: "Jean azul", price: 39.99, stock: 30, category: "Ropa" },
    { id: 3, name: "Zapatillas running", price: 69.00, stock: 20, category: "Calzado" }
  ];
  users = [
    { id: 1, name: "Ana Perez", email: "ana@example.com", role: "cliente" },
    { id: 2, name: "Admin", email: "admin@example.com", role: "admin" }
  ];
  orders = [];
  res.json({ ok: true, message: "Datos reseteados" });
});

// ---------------------------
// Código de ayuda: seed masivo (genera muchos productos)
// ---------------------------
app.post('/api/seed-products', simpleAuth, (req, res) => {
  // solo admin puede ejecutar
  if (req.user.role !== 'admin') return res.status(403).json({ error: "Acceso denegado" });
  const count = Number(req.body.count || 100);
  const baseId = generateId(products);
  for (let i = 0; i < count; i++) {
    products.push({
      id: baseId + i,
      name: `Producto semilla ${baseId + i}`,
      price: Number((Math.random() * 100).toFixed(2)),
      stock: Math.floor(Math.random() * 100),
      category: i % 2 === 0 ? "Ropa" : "Accesorios"
    });
  }
  res.json({ ok: true, added: count });
});

// ---------------------------
// Manejo de errores y server start
// ---------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(port, () => {
  console.log(`Backend de ejemplo corriendo en http://localhost:${port}`);
  console.log('Usa ?user=1 (cliente) o ?user=2 (admin) para simular autenticación.');
});
