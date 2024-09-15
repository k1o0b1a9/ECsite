import React from 'react';

function ProductList({ products, toggleDetails, addToCart }) {
  return (
    <ul className="product-list">
      {products.map(product => (
        <li key={product._id}>
          {/* 商品名とカートに追加ボタンを常に表示 */}
          <div className="product-summary">
            <h2 onClick={() => toggleDetails(product._id)}>{product.name}</h2>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>

          {/* 詳細はクリックで折り畳み・展開 */}
          {product.showDetails && (
            <div className="product-details">
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ProductList;