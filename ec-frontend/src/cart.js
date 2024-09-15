import React from 'react';

function Cart({ cartItems }) {
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
              <h2>{item.name}</h2>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </li>
          ))}
        </ul>
      )}
      <h3>Total Price: ${getTotalPrice()}</h3>
    </div>
  );
}

export default Cart;