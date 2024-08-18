import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedFilterType, setSelectedFilterType] = useState('');
  const [selectedFilterValue, setSelectedFilterValue] = useState('');
  const [showFilterTypeDropdown, setShowFilterTypeDropdown] = useState(false);
  const [showFilterValueDropdown, setShowFilterValueDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:8080/api/products');
        const data = await response.json();
        const productsWithDetails = data.map(product => ({
          ...product,
          showDetails: false
        }));
        setProducts(productsWithDetails);
        setFilteredProducts(productsWithDetails);
        setCategories([...new Set(data.map(product => product.category))]);
        setBrands([...new Set(data.map(product => product.brand))]);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedFilterValue]);

  const filterProducts = () => {
    let filtered = products;

    if (selectedFilterValue) {
      filtered = filtered.filter(product =>
        (selectedFilterType === 'category' && product.category === selectedFilterValue) ||
        (selectedFilterType === 'brand' && product.brand === selectedFilterValue)
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        Object.values(product).some(value =>
          typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = () => {
    filterProducts();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilter = () => {
    setSelectedFilterType('');
    setSelectedFilterValue('');
    setSearchQuery('');
    setSuggestions([]);
    setFilteredProducts(products);
  };

  const toggleDetails = (id) => {
    setFilteredProducts(products => products.map(product => 
      product._id === id ? { ...product, showDetails: !product.showDetails } : product
    ));
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    if (query.length > 0) {
      const filteredSuggestions = products
        .flatMap(product => 
          Object.entries(product) // [key, value] のペアを取得
            .filter(([key, value]) => key !== '_id') // _idを除外
            .map(([key, value]) => value) // 値を取得
        )
        .filter(value => typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())); // クエリを含む値をフィルタリング
  
      setSuggestions([...new Set(filteredSuggestions)]); // 重複を除去
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="container">
      <h1>EC Site</h1>
      <div className="filters">
        <div className="filter">
          <button 
            className="filter-input" 
            onClick={() => setShowFilterTypeDropdown(!showFilterTypeDropdown)}
          >
            {selectedFilterType ? `Filter by ${selectedFilterType}` : 'Select Filter'}
          </button>
          {showFilterTypeDropdown && (
            <ul className="dropdown">
              <li onClick={() => { setSelectedFilterType('category'); setShowFilterTypeDropdown(false); setShowFilterValueDropdown(true); }}>
                Category
              </li>
              <li onClick={() => { setSelectedFilterType('brand'); setShowFilterTypeDropdown(false); setShowFilterValueDropdown(true); }}>
                Brand
              </li>
              <li onClick={() => { clearFilter(); setShowFilterTypeDropdown(false); }}>
                Clear Filter
              </li>
            </ul>
          )}
        </div>
        {selectedFilterType && showFilterValueDropdown && (
          <div className="filter">
            <button 
              className="filter-input"
              onClick={() => setShowFilterValueDropdown(!showFilterValueDropdown)}
            >
              {selectedFilterValue || `Select ${selectedFilterType}`}
            </button>
            {showFilterValueDropdown && (
              <ul className="dropdown">
                <li onClick={() => { setSelectedFilterValue(''); setShowFilterValueDropdown(false); }}>All</li>
                {(selectedFilterType === 'category' ? categories : brands).map(value => (
                  <li key={value} onClick={() => { setSelectedFilterValue(value); setShowFilterValueDropdown(false); }}>
                    {value}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="filter">
          <input 
            type="text"
            className="filter-input" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={handleInputChange} 
            onKeyDown={handleKeyDown}  
          />
          <button 
            className="filter-input"
            onClick={handleSearch}
          >
            Search
          </button>
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index} 
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <ul>
        {filteredProducts.map(product => (
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
    </div>
  );
}

export default App;