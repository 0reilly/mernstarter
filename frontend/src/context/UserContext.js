import React, { createContext, useState, useEffect } from 'react';
import { setupIframeMessageListener, isInIframe } from '../utils/iframeUtils';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(() => localStorage.getItem('username'));
  const [isIframe] = useState(isInIframe());

  useEffect(() => {
    if (isIframe) {
      // Setup iframe message listener
      const cleanup = setupIframeMessageListener((newUsername) => {
        if (newUsername) {
          localStorage.setItem('username', newUsername);
          setUsername(newUsername);
        }
      });

      return cleanup;
    }
  }, [isIframe]);

  const updateUser = (newUsername) => {
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
    <UserContext.Provider value={{ 
      username, 
      updateUser, 
      clearUser,
      isIframe 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider; 