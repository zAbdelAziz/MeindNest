// src/hooks/useNotificationsSSE.ts
import { useEffect } from 'react';
import { useNotificationStore } from '../stores/useNotificationStore';

export const useNotificationsSSE = () => {
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    // Adjust the endpoint URL to your backend SSE notifications endpoint
    const eventSource = new EventSource('http://localhost:5000/sse/notifications?user_id=12345');

    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        addNotification(notification);
      } catch (error) {
        console.error('Error parsing SSE notification:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      // Optionally implement reconnection logic here
    };

    return () => {
      eventSource.close();
    };
  }, [addNotification]);
};
