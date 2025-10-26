
import React, { useState, useEffect } from 'react';
import { Notification as NotificationType } from '../types';

interface NotificationProps {
  notification: NotificationType;
  onDismiss: (id: number) => void;
}

const NotificationIcon: React.FC<{ type: NotificationType['type'] }> = ({ type }) => {
    if (type === 'increase') {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
    if (type === 'decrease') {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
    return null;
}

export const Notification: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(notification.id), 300);
    }, 7000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bgColor = notification.type === 'increase' ? 'bg-red-800/90 border-red-600' : 'bg-green-800/90 border-green-600';

  return (
    <div
      className={`relative w-full max-w-sm p-4 rounded-lg shadow-lg text-white transition-all duration-300 ease-in-out transform ${bgColor} ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
           <NotificationIcon type={notification.type} />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium">{notification.zoneName}</p>
          <p className="mt-1 text-sm text-gray-300">{notification.message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button onClick={() => onDismiss(notification.id)} className="inline-flex text-gray-400 hover:text-white">
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
