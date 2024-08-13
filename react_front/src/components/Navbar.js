import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      {currentUser && currentUser.role === 'admin' && (
        <Link to="/admin">Admin Dashboard</Link>
      )}
      {currentUser && (
        <>
          <Link to="/auto-bidding">Auto-Bidding Config</Link>
          <button onClick={logout}>Logout</button>
        </>
      )}
      {!currentUser && <Link to="/login">Login</Link>}
    </nav>
  );
}

export default Navbar;