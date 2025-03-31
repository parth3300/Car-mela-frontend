import React, { useState, useEffect, useRef } from 'react';
import Notification from './Notification';

const ResponseHandler = ({ 
  resourceName = '', 
  action = '', 
  error = null, 
  success = null, 
  onClear 
}) => {
  const [lastValidState, setLastValidState] = useState({
    action: '',
    success: null
  });
  const [visibleNotification, setVisibleNotification] = useState(null);
  const timerRef = useRef(null);
  const notificationShownRef = useRef(false);

  // Clear any existing timer
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Reset notification tracking when props reset
  useEffect(() => {
    if (!success && !error) {
      notificationShownRef.current = false;
    }
  }, [success, error]);

  // Update lastValidState when we get meaningful values
  useEffect(() => {
    if (action && action !== '') {
      setLastValidState(prev => ({ ...prev, action }));
    }
    if (success && success !== null && success !== '') {
      setLastValidState(prev => ({ ...prev, success }));
    }
  }, [action, success]);

  // Handle notification display and timing
  useEffect(() => {
    // Only proceed if we have a message to show and haven't shown it yet
    const hasMessage = success || error;
    if (!hasMessage || notificationShownRef.current) return;

    // Clear any existing timer
    clearTimer();

    // Determine the notification content
    const defaultMessages = {
      create: `${resourceName} created successfully! 🎉`,
      update: `${resourceName} updated successfully! 🎉`,
      delete: `${resourceName} deleted successfully!`,
      error: `Failed to ${lastValidState.action || 'perform action'} ${resourceName}. Please try again.`
    };

    let message = '';
    let type = '';
    
    if (success) {
      type = 'success';
      action = success.message
      message = typeof success === 'string' 
        ? success 
        : defaultMessages[action] || success.message || 'Operation completed successfully!';

      notificationShownRef.current = true;
    } else if (error) {
      type = 'error';
      if (typeof error === 'string') {
        message = error;
      } else if (error?.message) {
        message = error.message;
      } else if (error?.response?.data) {
        const apiError = error.response.data;
        // Handle field-specific errors like {"country":["Ensure this field has no more than 30 characters."]}
        if (typeof apiError === 'object') {
          message = Object.entries(apiError)
            .map(([field, errors]) => {
              const fieldName = field.replace(/_/g, ' ');
              return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${Array.isArray(errors) ? errors.join(' ') : errors}`;
            })
            .join('. ');
        } else {
          message = apiError.toString();
        }
      } else {
        message = defaultMessages.error;
      }
      notificationShownRef.current = true;
    }
    
    // Set the notification to be visible
    setVisibleNotification({ message, type });

    // Set timer to hide the notification after 6 seconds
    timerRef.current = setTimeout(() => {
      setVisibleNotification(null);
      if (onClear) onClear();
    }, 4000);

    // Clean up timer on unmount
    return () => clearTimer();
  }, [success, error, action, resourceName, onClear, lastValidState.action]);

  // Handle manual close
  const handleClose = () => {
    clearTimer();
    setVisibleNotification(null);
    if (onClear) onClear();
  };

  return (
    <>
      {visibleNotification && (
        <Notification
          message={visibleNotification.message}
          type={visibleNotification.type}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default ResponseHandler;