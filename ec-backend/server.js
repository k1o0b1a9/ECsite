const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});

const Product = mongoose.model('Product', ProductSchema);

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = 6000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
