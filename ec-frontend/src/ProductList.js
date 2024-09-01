import React from 'react';

function ProductList({ products, toggleDetails }) {
  return (
    <ul>
      {products.map(product => (
        <li key={product._id}>
          <h2 onClick={() => toggleDetails(product._id)}>
            {product.name}
          </h2>
          {product.showDetails && (
            <div className="product-details">
              <p>Description: {product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
              <p>Brand: {product.brand}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ProductList;