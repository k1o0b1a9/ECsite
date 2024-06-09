const Datastore = require('nedb');
const { faker } = require('@faker-js/faker');

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

// ダミーデータを追加
addDummyData();
