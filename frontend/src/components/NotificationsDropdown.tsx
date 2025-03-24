// src/components/NotificationsDropdown.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNotificationStore } from '../stores/useNotificationStore';
import { MdFiberManualRecord } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const NotificationsDropdown: React.FC = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const MAX_NOTIFICATIONS = 10;
  const displayedNotifications = notifications.slice(0, MAX_NOTIFICATIONS);

  const handleNotificationClick = async (notificationId: string, link: string) => {
    // Close the dropdown when a notification is clicked
    setIsOpen(false);
    try {
      // Notify the backend that the notification has been read.
      await fetch(`http://localhost:5000/notifications/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notificationId }),
      });
      // Update the store locally.
      markAsRead(notificationId);
      // Navigate using react-router without reloading the page.
      navigate(link);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <svg
          className="h-6 w-6 text-gray-600 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-red-100 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20">
          <ul className="py-1">
            {displayedNotifications.length ? (
              displayedNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() =>
                    handleNotificationClick(notification.id, notification.link)
                  }
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {notification.notification_type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.timestamp * 1000).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {!notification.read && (
                      <MdFiberManualRecord className="text-blue-500 mr-1" size={10} />
                    )}
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {notification.message}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                No notifications
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
