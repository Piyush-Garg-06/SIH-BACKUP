import { useState, useEffect } from 'react';
import webSocketService from '../utils/webSocketService';

export const useWebSocket = () => {
  const [alerts, setAlerts] = useState([]);
  const [unreadAlerts, setUnreadAlerts] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Listen for new disease alerts
    const unsubscribeAlerts = webSocketService.onDiseaseAlert((data) => {
      console.log('Received new alert:', data);
      setAlerts(prevAlerts => {
        // Add the new alert to the beginning of the array
        const newAlerts = [data.alert, ...prevAlerts];
        // Keep only the latest 50 alerts to prevent memory issues
        return newAlerts.slice(0, 50);
      });
    });

    // Listen for unread alerts
    const unsubscribeUnread = webSocketService.onUnreadAlerts((data) => {
      console.log('Received unread alerts:', data);
      setUnreadAlerts(data.alerts || []);
    });

    // Listen for resolved alerts
    const unsubscribeResolved = webSocketService.onAlertResolved((data) => {
      console.log('Alert resolved:', data);
      // Remove the resolved alert from the alerts list
      setAlerts(prevAlerts => 
        prevAlerts.filter(alert => alert._id !== data.alert._id)
      );
      
      // Remove the resolved alert from unread alerts
      setUnreadAlerts(prevUnread => 
        prevUnread.filter(alert => alert._id !== data.alert._id)
      );
    });

    // Check connection status
    const checkConnection = () => {
      setConnected(webSocketService.isConnected);
    };

    // Check connection status periodically
    const interval = setInterval(checkConnection, 5000);
    checkConnection();

    // Cleanup function
    return () => {
      unsubscribeAlerts();
      unsubscribeUnread();
      unsubscribeResolved();
      clearInterval(interval);
    };
  }, []);

  const markAlertAsRead = (alertId) => {
    setUnreadAlerts(prevUnread => 
      prevUnread.filter(alert => alert._id !== alertId)
    );
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const clearUnreadAlerts = () => {
    setUnreadAlerts([]);
  };

  return {
    alerts,
    unreadAlerts,
    connected,
    markAlertAsRead,
    clearAlerts,
    clearUnreadAlerts
  };
};

export default useWebSocket;