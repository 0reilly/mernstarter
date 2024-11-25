import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(() => localStorage.getItem('username'));
  const [isSubscribed, setIsSubscribed] = useState(() => 
    localStorage.getItem('isSubscribed') === 'true'
  );

  const updateUser = (newUsername, subscriptionStatus) => {
    if (newUsername) {
      localStorage.setItem('username', newUsername);
      setUsername(newUsername);
    }
    
    localStorage.setItem('isSubscribed', subscriptionStatus);
    setIsSubscribed(subscriptionStatus);
  };

  const clearUser = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isSubscribed');
    setUsername(null);
    setIsSubscribed(false);
  };

  return (
    <UserContext.Provider value={{ username, isSubscribed, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}; 