# EC Project

このプロジェクトはシンプルなECサイトのバックエンドとフロントエンドを含んでいます。

## 構成

- `ec-frontend`: Reactを使用したフロントエンド部分。
- `ec-backend`: Expressと`nedb`を使用したバックエンドAPI。

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

3. `.env` ファイルに設定を追加（必要に応じて）:

    ```
    PORT=8080
    ```

4. サーバを起動:

    ```bash
    npm start
    ```

サーバーはデフォルトで `http://localhost:8080` で実行されます。

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

## ダミーデータ

サーバー起動時に、データベースが空の場合、自動的にダミーデータが生成されます。ダミーデータはサーバー起動時に一度だけ生成され、`products.db`ファイルに保存されます。

## 貢献

プルリクエストやフィードバックはいつでも歓迎します。

---
