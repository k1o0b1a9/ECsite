import React, { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        const productsWithDetails = data.map(product => ({
          ...product,
          showDetails: false
        }));
        setProducts(productsWithDetails);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }

    fetchProducts();
  }, []);

  const toggleDetails = (id) => {
    setProducts(products => products.map(product => 
      product._id === id ? { ...product, showDetails: !product.showDetails } : product
    ));
  };

  return (
    <div>
      <h1>EC Site</h1>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            <h2 onClick={() => toggleDetails(product._id)} style={{ cursor: 'pointer' }}>
              {product.name}
            </h2>
            {product.showDetails && (
              <div>
                <p>Description: {product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Category: {product.category}</p>
                <p>Brand: {product.brand}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
