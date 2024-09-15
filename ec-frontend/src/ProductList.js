import React from 'react';

function ProductList({ products, toggleDetails, addToCart }) {
  return (
    <ul className="product-list">
      {products.map(product => (
        <li key={product._id}>
          <h2 onClick={() => toggleDetails(product._id)}>{product.name}</h2>
          {product.showDetails && (
            <div>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ProductList;