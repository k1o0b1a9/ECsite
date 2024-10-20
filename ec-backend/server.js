const express = require('express');
const Datastore = require('nedb');
const cors = require('cors');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// 環境変数の読み込み
dotenv.config();

const app = express();

// データベースのインスタンス作成
const db = new Datastore({ filename: 'products.db', autoload: true });
const usersDb = new Datastore({ filename: 'users.db', autoload: true }); // ユーザー用データベース

// CORSの詳細設定
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'], // フロントエンドのURLを許可
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 許可するHTTPメソッド
  allowedHeaders: ['Content-Type', 'Authorization'], // 許可するヘッダー
}));
app.use(express.json());

// ルーティング
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// ダミーデータの生成
function generateDummyData(num) {
  const dummyProducts = [];
  for (let i = 0; i < num; i++) {
    dummyProducts.push({
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      brand: faker.company.companyName()
    });
  }
  return dummyProducts;
}

function addDummyData() {
  const dummyProducts = generateDummyData(10);
  db.insert(dummyProducts, (err, newDocs) => {
    if (err) {
      console.error('ダミーデータの追加に失敗しました:', err);
    } else {
      console.log('ダミーデータを追加しました:', newDocs);
    }
  });
}

db.count({}, (err, count) => {
  if (count === 0) {
    addDummyData();
  }
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack); // エラーログをコンソールに出力
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});