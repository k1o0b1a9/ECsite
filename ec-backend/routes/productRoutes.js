const express = require('express');
const Datastore = require('nedb');
const db = new Datastore({ filename: 'products.db', autoload: true });

const productRoutes = express.Router();

// 商品データ取得エンドポイント
productRoutes.get('/', (req, res, next) => {
    db.find({}, (err, products) => {
      if (err) return next(err); 
      res.json(products);
    });
});

// 商品データ追加エンドポイント
productRoutes.post('/', (req, res, next) => {
    const product = req.body;
    db.insert(product, (err, newDoc) => {
      if (err) return next(err);
      res.status(201).json(newDoc);
    });
});

module.exports = productRoutes;