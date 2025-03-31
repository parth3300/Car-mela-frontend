import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';

const Notification = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-300' : 'border-red-300';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`${bgColor} ${textColor} ${borderColor} border rounded-lg shadow-lg p-4 max-w-md w-full flex items-center justify-between`}
      >
        <div className="flex-1">
          {message}
        </div>
        <button
          onClick={onClose}
          className={`ml-4 p-1 rounded-full hover:${type === 'success' ? 'bg-green-200' : 'bg-red-200'} transition-colors`}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;