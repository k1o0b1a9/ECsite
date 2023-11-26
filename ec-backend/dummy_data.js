const mongoose = require('mongoose');
require('dotenv').config();

// MongoDBへの接続
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// 商品スキーマの定義
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  brand: String
});

// 商品モデルの作成
const Product = mongoose.model('Product', ProductSchema);

// ダミーデータ
const dummyProducts = [
  { name: '商品1', description: 'これは商品1です', price: 1000, category: 'カテゴリ1', brand: 'ブランド1' },
  { name: '商品2', description: 'これは商品2です', price: 2000, category: 'カテゴリ2', brand: 'ブランド2' },
];

// ダミーデータを追加する関数
async function addDummyData() {
  try {
    await Product.insertMany(dummyProducts);
    console.log('ダミーデータを追加しました');
    mongoose.disconnect();
  } catch (error) {
    console.error('ダミーデータの追加に失敗しました:', error);
  }
}

addDummyData();
