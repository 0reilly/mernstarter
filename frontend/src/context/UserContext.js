import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(() => localStorage.getItem('username'));

  const updateUser = (newUsername, subscriptionStatus) => {
    if (newUsername) {
      localStorage.setItem('username', newUsername);
      setUsername(newUsername);
    }
  };

  const clearUser = () => {
    localStorage.removeItem('username');
    setUsername(null);
  };

  return (
    <UserContext.Provider value={{ username, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}; 