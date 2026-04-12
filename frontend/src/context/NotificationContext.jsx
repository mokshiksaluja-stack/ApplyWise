import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { fetchNotificationsApi, createNotificationApi, markNotifReadApi } from "../services/api";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    const userId = localStorage.getItem('studentId') || localStorage.getItem('userId');
    if (!userId || userId === 'null' || userId === 'undefined') return;
    
    setLoading(true);
    try {
      const { data } = await fetchNotificationsApi(userId);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = useCallback(async (id) => {
    // Optimistic local update
    setNotifications((prev) => prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n)));
    try {
      await markNotifReadApi(id);
    } catch {
      // Silent — local state is already updated
    }
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const addNotification = useCallback(async (payload) => {
    // Build local entry immediately for instant UI feedback
    const localEntry = {
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false,
      isImportant: false,
      type: "system",
      ...payload,
    };
    setNotifications((prev) => [localEntry, ...prev]);

    // Persist to backend if receiverId is provided
    try {
      if (payload.receiverId) {
        await createNotificationApi(payload);
      }
    } catch {
      // Silent — notification already shown locally
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, loading, unreadCount, markAsRead, markAllAsRead, addNotification, refreshNotifications: loadNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
