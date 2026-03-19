import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();

      const newSocket = io('http://localhost:4000', {
        withCredentials: true,
      });

      newSocket.on(`newNotification-${user._id}`, (data) => {
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast.success(data.message, {
          duration: 4000,
          position: 'top-right',
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [isAuthenticated, user, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notification/${id}`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notification/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      const removedNotification = notifications.find(n => n._id === id);
      if (removedNotification && !removedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      toast.error('Failed to clear notifications');
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteAllNotifications,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
