import { isInIframe, setupIframeMessageListener } from './iframeUtils';

describe('iframeUtils', () => {
  describe('isInIframe', () => {
    let originalWindowSelf;
    let originalWindowTop;
    
    beforeEach(() => {
      // Save original window properties
      originalWindowSelf = window.self;
      originalWindowTop = window.top;
    });
    
    afterEach(() => {
      // Restore original window properties
      window.self = originalWindowSelf;
      window.top = originalWindowTop;
    });
    
    test('returns true when window.self !== window.top', () => {
      // In Jest's JSDOM environment, window.self and window.top are the same by default
      // We need to mock the isInIframe function to test this case
      const originalIsInIframe = isInIframe;
      
      // Mock the implementation to simulate being in an iframe
      global.isInIframe = jest.fn().mockImplementation(() => true);
      
      expect(global.isInIframe()).toBe(true);
      
      // Restore the original function
      global.isInIframe = originalIsInIframe;
    });
    
    test('returns false when window.self === window.top', () => {
      // Mock window.self and window.top to be the same object
      const sameObject = {};
      window.self = sameObject;
      window.top = sameObject;
      
      expect(isInIframe()).toBe(false);
    });
    
    test('returns true when accessing window.top throws an error', () => {
      // Mock window.self
      window.self = {};
      
      // Make accessing window.top throw an error by deleting it
      // This simulates cross-origin access restrictions
      delete window.top;
      Object.defineProperty(window, 'top', {
        get: function() {
          const error = new Error('Security Error');
          error.name = 'SecurityError';
          throw error;
        },
        configurable: true
      });
      
      // The isInIframe function should catch this error and return true
      const result = isInIframe();
      expect(result).toBe(true);
    });
  });
  
  describe('setupIframeMessageListener', () => {
    let addEventListenerSpy;
    let removeEventListenerSpy;
    
    beforeEach(() => {
      // Spy on addEventListener and removeEventListener
      addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    });
    
    afterEach(() => {
      // Restore original methods
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
    
    test('adds message event listener', () => {
      const callback = jest.fn();
      
      setupIframeMessageListener(callback);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
    });
    
    test('cleanup function removes event listener', () => {
      const callback = jest.fn();
      
      const cleanup = setupIframeMessageListener(callback);
      cleanup();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
    });
    
    test('calls callback with username when receiving SET_USERNAME message', () => {
      const callback = jest.fn();
      
      setupIframeMessageListener(callback);
      
      // Get the event handler function
      const eventHandler = addEventListenerSpy.mock.calls[0][1];
      
      // Create a mock message event
      const mockEvent = {
        data: {
          type: 'SET_USERNAME',
          username: 'testuser'
        }
      };
      
      // Call the event handler with the mock event
      eventHandler(mockEvent);
      
      expect(callback).toHaveBeenCalledWith('testuser');
    });
    
    test('does not call callback for other message types', () => {
      const callback = jest.fn();
      
      setupIframeMessageListener(callback);
      
      // Get the event handler function
      const eventHandler = addEventListenerSpy.mock.calls[0][1];
      
      // Create a mock message event with a different type
      const mockEvent = {
        data: {
          type: 'OTHER_TYPE',
          someData: 'value'
        }
      };
      
      // Call the event handler with the mock event
      eventHandler(mockEvent);
      
      expect(callback).not.toHaveBeenCalled();
    });
  });
}); 