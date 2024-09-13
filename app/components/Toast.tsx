import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number; // New prop for custom duration
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 6000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`${bgColor} text-white px-4 py-2 rounded-md shadow-lg max-w-md text-center`}>
        {message}
      </div>
    </div>
  );
};

export default Toast;


