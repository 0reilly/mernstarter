import '@testing-library/jest-dom';
import '@testing-library/react';
import '@testing-library/user-event';

// Polyfill for TextEncoder and TextDecoder
if (typeof TextEncoder === 'undefined') {
  class TextEncoder {
    encode(string) {
      const codeUnits = new Uint8Array(string.length * 3);
      let codePoint;
      let encodedLength = 0;
      
      for (let i = 0; i < string.length; i++) {
        codePoint = string.charCodeAt(i);
        
        if (codePoint < 0x80) {
          codeUnits[encodedLength++] = codePoint;
        } else if (codePoint < 0x800) {
          codeUnits[encodedLength++] = 0xC0 | (codePoint >> 6);
          codeUnits[encodedLength++] = 0x80 | (codePoint & 0x3F);
        } else {
          codeUnits[encodedLength++] = 0xE0 | (codePoint >> 12);
          codeUnits[encodedLength++] = 0x80 | ((codePoint >> 6) & 0x3F);
          codeUnits[encodedLength++] = 0x80 | (codePoint & 0x3F);
        }
      }
      
      return codeUnits.subarray(0, encodedLength);
    }
  }
  
  class TextDecoder {
    decode(buffer) {
      let result = '';
      let i = 0;
      
      while (i < buffer.length) {
        let codePoint;
        const byte1 = buffer[i++];
        
        if ((byte1 & 0x80) === 0) {
          codePoint = byte1;
        } else if ((byte1 & 0xE0) === 0xC0) {
          const byte2 = buffer[i++] & 0x3F;
          codePoint = ((byte1 & 0x1F) << 6) | byte2;
        } else if ((byte1 & 0xF0) === 0xE0) {
          const byte2 = buffer[i++] & 0x3F;
          const byte3 = buffer[i++] & 0x3F;
          codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
        }
        
        result += String.fromCharCode(codePoint);
      }
      
      return result;
    }
  }
  
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Force React to use development mode for tests
// This fixes the "act(...) is not supported in production builds of React" error
process.env.NODE_ENV = 'development';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});