import React, { useState, useEffect } from 'react';
import './App.css';
import ProductList from './ProductList';
import Filter from './Filter';
import Cart from './cart';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';  // SwitchをRoutesに変更

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
  const [cartItems, setCartItems] = useState([]);

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
          Object.entries(product)
            .filter(([key]) => key !== '_id')
            .map(([key, value]) => value)
        )
        .filter(value => typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase()));

      setSuggestions([...new Set(filteredSuggestions)]);
    } else {
      setSuggestions([]);
    }
  };

  const addToCart = (product) => {
    setCartItems(prevCartItems => {
      const isInCart = prevCartItems.find(item => item._id === product._id);

      if (isInCart) {
        return prevCartItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCartItems, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <Router>
      <div className="container">
        <h1>EC Site</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart ({cartItems.length})</Link>
        </nav>

        <Routes>  {/* Switch を Routes に変更 */}
          <Route path="/" element={
            <>
              <Filter
                categories={categories}
                brands={brands}
                selectedFilterType={selectedFilterType}
                setSelectedFilterType={setSelectedFilterType}
                selectedFilterValue={selectedFilterValue}
                setSelectedFilterValue={setSelectedFilterValue}
                showFilterTypeDropdown={showFilterTypeDropdown}
                setShowFilterTypeDropdown={setShowFilterTypeDropdown}
                showFilterValueDropdown={showFilterValueDropdown}
                setShowFilterValueDropdown={setShowFilterValueDropdown}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleInputChange={handleInputChange}
                handleSearch={handleSearch}
                handleKeyDown={handleKeyDown}
                suggestions={suggestions}
                setSuggestions={setSuggestions} 
              />
              <ProductList products={filteredProducts} toggleDetails={toggleDetails} addToCart={addToCart} />
            </>
          } />
          <Route path="/cart" element={<Cart cartItems={cartItems} />} />  {/* Route 内で element にコンポーネントを指定 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;