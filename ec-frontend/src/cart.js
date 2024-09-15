import React from 'react';

function Cart({ cartItems, updateQuantity, removeFromCart }) {
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item._id}>
              <div className="cart-item">
                <h2>{item.name}</h2>
                <p>Price: ${item.price}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => removeFromCart(item._id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <h3>Total Price: ${getTotalPrice()}</h3>
    </div>
  );
}

export default Cart;