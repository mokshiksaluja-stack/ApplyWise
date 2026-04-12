import { createContext, useContext, useState, useCallback } from "react";
import { createNotificationApi, markNotifReadApi } from "../services/api";
import { initialNotifications } from "../data/dummyNotifications";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = useCallback(async (id) => {
    // Optimistic local update
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
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
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " Today",
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
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
