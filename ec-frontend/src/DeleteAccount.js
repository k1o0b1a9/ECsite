import React from 'react';

function DeleteAccount({ handleDeleteAccount }) {
  const onDelete = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      handleDeleteAccount();
    }
  };

  return (
    <div>
      <h2>Delete Account</h2>
      <button onClick={onDelete}>Delete Account</button>
    </div>
  );
}

export default DeleteAccount;