import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (username, password) => {
    // In a real app, you'd make an API call here
    if (username === 'admin1' && password === 'admin2') {
      setCurrentUser({ username, role: 'admin' });
      return 'admin'
    } else if (username === 'user1' && password === 'user2') {
      setCurrentUser({ username, role: 'user' });
      return 'user'
    } else {
      return False;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}