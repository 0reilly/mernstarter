import React, { createContext, useState, useEffect } from 'react';
import { setupIframeMessageListener, isInIframe } from '../utils/iframeUtils';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(() => localStorage.getItem('username'));
  const [isIframe] = useState(isInIframe());

  useEffect(() => {
    // Always listen for messages, whether in iframe or not
    const handleMessage = (event) => {
      console.log('UserContext received message:', event.data);
      if (event.data.type === 'SET_USERNAME' && event.data.username) {
        console.log('Setting username from message:', event.data.username);
        localStorage.setItem('username', event.data.username);
        setUsername(event.data.username);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // If we're in an iframe, notify the parent that we're ready
    if (isIframe) {
      console.log('In iframe, sending ready message');
      window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isIframe]);

  const updateUser = (newUsername) => {
    if (newUsername) {
      console.log('Updating username:', newUsername);
      localStorage.setItem('username', newUsername);
      setUsername(newUsername);
    }
  };

  const clearUser = () => {
    console.log('Clearing user');
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