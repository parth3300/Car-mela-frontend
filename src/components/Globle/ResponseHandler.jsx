import React, { useState, useEffect } from 'react';
import Notification from './Notification';

const ResponseHandler = ({ 
  resourceName = '', 
  action = '', 
  error = null, 
  success = null, 
  onClear 
}) => {
  // State to track the last valid action and success values
  const [lastValidState, setLastValidState] = useState({
    action: '',
    success: null
  });

  // Update lastValidState when we get meaningful values
  useEffect(() => {
    if (action && action !== '') {
      setLastValidState(prev => ({ ...prev, action }));
    }
    if (success && success !== null && success !== '') {
      setLastValidState(prev => ({ ...prev, success }));
    }
  }, [action, success]);

  // Default messages
  const defaultMessages = {
    create: `${resourceName} created successfully! 🎉`,
    update: `${resourceName} updated successfully! 🎉`,
    delete: `${resourceName} deleted successfully!`,
    error: `Failed to ${lastValidState.action || 'perform action'} ${resourceName}. Please try again.`
  };

  // Determine notification message and type
  let message = '';
  let type = '';

  if (success || lastValidState.success) {
    type = 'success';
    const currentSuccess = success || lastValidState.success;
    message = typeof currentSuccess === 'string' 
      ? currentSuccess 
      : defaultMessages[lastValidState.action] || 'Operation completed successfully!';
  } else if (error) {
    type = 'error';
    if (typeof error === 'string') {
      message = error;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.response?.data) {
      // Handle API error responses
      const apiError = error.response.data;
      message = typeof apiError === 'object' 
        ? Object.values(apiError).flat().join(' ') 
        : apiError.toString();
    } else {
      message = defaultMessages.error;
    }
  }

  return (
    <>
      {message && (
        <Notification
          message={message}
          type={type}
          onClose={onClear}
        />
      )}
    </>
  );
};

export default ResponseHandler;