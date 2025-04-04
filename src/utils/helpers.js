// Memoization cache
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Date formatting with memoization
export const formatDate = memoize((date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Currency formatting with memoization
export const formatCurrency = memoize((amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
});

// File size formatting with memoization
export const formatFileSize = memoize((bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Email validation with regex caching
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (email) => emailRegex.test(email);

// Password strength validation with optimized regex
const passwordRegex = {
  upperCase: /[A-Z]/,
  lowerCase: /[a-z]/,
  numbers: /\d/,
  specialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

export const isStrongPassword = (password) => {
  if (password.length < 8) return false;
  
  return (
    passwordRegex.upperCase.test(password) &&
    passwordRegex.lowerCase.test(password) &&
    passwordRegex.numbers.test(password) &&
    passwordRegex.specialChar.test(password)
  );
};

// Debounce function with cleanup
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    // Return cleanup function
    return () => clearTimeout(timeout);
  };
};

// Local storage helpers with error handling and type safety
export const storage = {
  set: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (e) {
      console.error('Error saving to localStorage', e);
      return false;
    }
  },
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing from localStorage', e);
      return false;
    }
  },
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Error clearing localStorage', e);
      return false;
    }
  },
};

// Performance monitoring
export const performance = {
  measure: (label, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${label} took ${end - start}ms`);
    return result;
  },
  measureAsync: (label, fn) => {
    const start = performance.now();
    return fn().then(result => {
      const end = performance.now();
      console.log(`${label} took ${end - start}ms`);
      return result;
    });
  },
}; 