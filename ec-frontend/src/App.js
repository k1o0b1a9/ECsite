import React, { useState, useEffect } from 'react';
import './App.css';
import ProductList from './ProductList';
import Filter from './Filter';
import Cart from './cart';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

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
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // ページ読み込み時にローカルストレージからカートのデータを読み込む
  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

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

  // カートが更新されるたびにローカルストレージに保存する
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cartItems');
    }
  }, [cartItems]);

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

    setNotification(`${product.name} has been added to the cart!`);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(prevCartItems => 
      prevCartItems
        .map(item => (item._id === id ? { ...item, quantity } : item))
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prevCartItems => prevCartItems.filter(item => item._id !== id));
  };

  return (
    <Router>
      <div className="container">
        <h1>EC Site</h1>
        <nav>
          <Link to="/" className="button">Home</Link>
          <Link to="/cart" className="button">Cart ({cartItems.length})</Link>
        </nav>

        {showNotification && <div className="notification">{notification}</div>}

        <Routes>
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
          <Route path="/cart" element={<Cart cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;