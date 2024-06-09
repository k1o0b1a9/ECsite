const express = require('express');
const Datastore = require('nedb');
const cors = require('cors');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');

// 環境変数の読み込み
dotenv.config();

const app = express();

// データベースのインスタンス作成（メモリ内）
const db = new Datastore({ filename: 'products.db', autoload: true });

// ダミーデータを生成する関数
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

// ダミーデータを追加する関数
function addDummyData() {
  const dummyProducts = generateDummyData(10); // 10件のダミーデータを生成
  db.insert(dummyProducts, (err, newDocs) => {
    if (err) {
      console.error('ダミーデータの追加に失敗しました:', err);
    } else {
      console.log('ダミーデータを追加しました:', newDocs);
    }
  });
}

// 初回起動時にダミーデータを挿入
db.count({}, (err, count) => {
  if (count === 0) {
    addDummyData();
  }
});

// CORSの設定（フロントエンドからのリクエストを許可する）
app.use(cors());
app.use(express.json()); // POSTデータを扱うためのミドルウェア

// 商品データを取得するAPIエンドポイント
app.get('/api/products', (req, res) => {
  db.find({}, (err, products) => {
    if (err) {
      return res.status(500).send(err.message);
  }
    res.json(products);
  });
});

// 商品データを追加するためのエンドポイント
app.post('/api/products', (req, res) => {
  const product = req.body;
  db.insert(product, (err, newDoc) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(201).json(newDoc);
  });
});

// サーバーを起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
