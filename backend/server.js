const express = require('express');
const cors = require('cors');
const { Low, JSONFile } = require('lowdb');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
const PORT = 3000;

// Lowdb setup
const file = path.join(__dirname, 'data', 'products.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

app.use(cors());
app.use(express.json());

// GET all products
app.get('/api/products', async (req, res) => {
  await db.read();
  res.json(db.data.products || []);
});

// POST new product
app.post('/api/products', async (req, res) => {
  const { productName, supplierName, price, date } = req.body;
  if (!productName || !supplierName || !price) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const newProduct = {
    id: nanoid(),
    productName,
    supplierName,
    price,
    date: date || new Date().toISOString(),
  };
  await db.read();
  db.data.products = db.data.products || [];
  db.data.products.push(newProduct);
  await db.write();
  res.status(201).json(newProduct);
});

// PUT update product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { productName, supplierName, price, date } = req.body;
  await db.read();
  const products = db.data.products || [];
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  products[index] = {
    ...products[index],
    productName: productName || products[index].productName,
    supplierName: supplierName || products[index].supplierName,
    price: price || products[index].price,
    date: date || products[index].date,
  };
  await db.write();
  res.json(products[index]);
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  await db.read();
  const products = db.data.products || [];
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  const deleted = products.splice(index, 1);
  await db.write();
  res.json({ message: 'Product deleted', product: deleted[0] });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
}); 