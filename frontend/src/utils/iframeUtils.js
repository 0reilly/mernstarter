export const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

export const setupIframeMessageListener = (callback) => {
  const handleMessage = (event) => {
    // Validate message origin if needed
    console.log('Received message in iframe:', event.data);
    
    if (event.data.type === 'SET_USERNAME') {
      callback(event.data.username);
    }
  };

  window.addEventListener('message', handleMessage);
  
  // Return cleanup function
  return () => window.removeEventListener('message', handleMessage);
}; 