# EC Project

このプロジェクトはシンプルなECサイトのバックエンドとフロントエンドを含んでいます。

## 構成

- `ec-frontend`: Reactを使用したフロントエンド部分。
- `ec-backend`: ExpressとMongoDBを使用したバックエンドAPI。

## セットアップ手順

### バックエンド (`ec-backend`)

1. ディレクトリに移動:

```bash
cd ec-backend
```

2. 依存関係をインストール:

```bash
npm install
```

3. `.env` ファイルにMongoDBの接続文字列を設定:

```
MONGODB_URI=your_mongodb_connection_string
```

4. サーバを起動:

```bash
npm start
```

### フロントエンド (`ec-frontend`)

1. ディレクトリに移動:

```bash
cd ec-frontend
```

2. 依存関係をインストール:

```bash
npm install
```

3. アプリケーションを起動:

```bash
npm start
```

アプリケーションはデフォルトで `http://localhost:3000` で実行されます。

## 貢献

プルリクエストやフィードバックはいつでも歓迎します。

---