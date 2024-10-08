const express = require('express');
const Datastore = require('nedb');
const cors = require('cors');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

// 商品データ取得エンドポイント
app.get('/api/products', (req, res) => {
  db.find({}, (err, products) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(products);
  });
});

// 商品データ追加エンドポイント
app.post('/api/products', (req, res) => {
  const product = req.body;
  db.insert(product, (err, newDoc) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(201).json(newDoc);
  });
});

// ユーザー登録エンドポイント
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    usersDb.insert({ username, email, password: hashedPassword }, (err, newUser) => {
      if (err) {
        return res.status(500).send('Error registering user.');
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// ユーザーログインエンドポイント
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  usersDb.findOne({ email }, async (err, user) => {
    if (!user) {
      return res.status(400).send('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// ユーザーログアウトエンドポイント
app.post('/api/auth/logout', (req, res) => {
  // フロントエンドでJWTトークンを削除するだけで実装できます
  res.json({ message: 'Logged out successfully' });
});

// パスワード変更エンドポイント
app.post('/api/auth/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    usersDb.findOne({ _id: userId }, async (err, user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).send('Old password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      usersDb.update({ _id: userId }, { $set: { password: hashedNewPassword } }, {}, (err) => {
        if (err) {
          return res.status(500).send('Error updating password');
        }
        res.status(200).send('Password changed successfully');
      });
    });
  } catch (error) {
    res.status(500).send('Error processing request');
  }
});

// アカウント削除エンドポイント
app.delete('/api/auth/delete-account', async (req, res) => {
  const { password } = req.body; // フロントエンドから送信されたパスワード
  const token = req.headers.authorization?.split(' ')[1]; // トークンからユーザーIDを取得

  if (!token) {
    return res.status(401).send('Authorization token missing');
  }

  try {
    // トークンを検証して、ログインしているユーザーの情報を取得
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // データベースからユーザー情報を取得
    usersDb.findOne({ _id: userId }, async (err, user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }

      // 入力されたパスワードとユーザーのパスワードを比較
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).send('Invalid password'); // パスワードが一致しない場合
      }

      // パスワードが一致すればアカウントを削除
      usersDb.remove({ _id: userId }, {}, (err, numRemoved) => {
        if (err) {
          return res.status(500).send('Error deleting account');
        }
        res.status(200).send('Account deleted successfully');
      });
    });
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(500).send('Error processing request');
  }
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});