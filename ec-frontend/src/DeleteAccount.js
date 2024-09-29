import React, { useState } from 'react';

const DeleteAccount = ({ handleDeleteAccount }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleDeleteAccount(password);
  };

  return (
    <div>
      <h2>Delete Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Delete Account</button>
      </form>
    </div>
  );
};

export default DeleteAccount;