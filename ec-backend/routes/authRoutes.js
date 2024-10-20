const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Datastore = require('nedb');
const usersDb = new Datastore({ filename: 'users.db', autoload: true });

const authRoutes = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// ユーザー登録エンドポイント
authRoutes.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      usersDb.insert({ username, email, password: hashedPassword }, (err, newUser) => {
        if (err) return next(err); // エラーをミドルウェアに渡す
        res.status(201).json({ message: 'User registered successfully' });
      });
    } catch (error) {
      next(error); // エラーをミドルウェアに渡す
    }
});

// アカウント削除エンドポイント
authRoutes.delete('/delete-account', async (req, res) => {
    const { password } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).send('Authorization token missing');
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
  
      usersDb.findOne({ _id: userId }, async (err, user) => {
        if (!user) {
          return res.status(404).send('User not found');
        }
  
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          return res.status(400).send('Invalid password');
        }
  
        usersDb.remove({ _id: userId }, {}, (err, numRemoved) => {
          if (err) {
            return res.status(500).send('Error deleting account');
          }
          res.status(200).send('Account deleted successfully');
        });
      });
    } catch (error) {
      res.status(500).send('Error processing request');
    }
});

// ユーザーログインエンドポイント
authRoutes.post('/login', (req, res) => {
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
authRoutes.post('/logout', (req, res) => {
    // ログアウト処理はクライアント側でJWTを削除するだけです
    res.json({ message: 'Logged out successfully' });
});

// パスワード変更エンドポイント
authRoutes.post('/change-password', async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).send('Authorization token missing');
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
  
      usersDb.findOne({ _id: userId }, async (err, user) => {
        if (err) return next(err); // エラーをミドルウェアに渡す
        if (!user) {
          return res.status(404).send('User not found');
        }
  
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(400).send('Old password is incorrect');
        }
  
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        usersDb.update({ _id: userId }, { $set: { password: hashedNewPassword } }, {}, (err) => {
          if (err) return next(err); // エラーをミドルウェアに渡す
          res.status(200).send('Password changed successfully');
        });
      });
    } catch (error) {
      next(error); // エラーをミドルウェアに渡す
    }
});

module.exports = authRoutes;