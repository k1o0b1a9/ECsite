import React, { useState, useEffect } from 'react';
import './App.css';
import ProductList from './ProductList';
import Filter from './Filter';
import Cart from './Cart';
import Login from './Login'; 
import Register from './Register';
import ChangePassword from './ChangePassword'; 
import DeleteAccount from './DeleteAccount';  
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
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [token, setToken] = useState(null);

  // パスワード変更機能
  const handleChangePassword = async (oldPassword, newPassword) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (response.ok) {
        alert('Password changed successfully');
      } else {
        alert('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  // アカウント削除機能
  const handleDeleteAccount = async (password) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),  // パスワードを送信
      });
      if (response.ok) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        alert('Account deleted successfully');
      } else {
        alert('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  // ページ読み込み時にローカルストレージからカートのデータを読み込む
  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    const savedToken = localStorage.getItem('token');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

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

    setNotification(`${product.name} has been added to the Cart!`);
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

  // 新規登録機能
  const handleRegister = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.status === 201) {
        alert('Registration successful');
      } else {
        alert('Registration failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  // ログイン機能
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
        alert('Login successful');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // ログアウト機能
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
    alert('Logged out');
  };

  return (
    <Router>
      <div className="container">
        <h1>EC Site</h1>
        <nav>
        <Link to="/" className="button">Home</Link>
        <Link to="/cart" className="button">Cart ({cartItems.length})</Link>
          {isLoggedIn ? (
            <>
              <Link to="/change-password" className="button">Change Password</Link>
              <Link to="/delete-account" className="button">Delete Account</Link>
              <button onClick={handleLogout} className="button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="button">Login</Link>
              <Link to="/register" className="button">Register</Link>
            </>
          )}
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
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/register" element={<Register handleRegister={handleRegister} />} />
          <Route path="/change-password" element={<ChangePassword handleChangePassword={handleChangePassword} />} />
          <Route path="/delete-account" element={<DeleteAccount handleDeleteAccount={handleDeleteAccount} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;