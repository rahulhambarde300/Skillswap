"use client";
import React, { useState, useEffect } from "react";

const NotificationsDropdown = ({ isOpen, userId, setHasUnreadNotifications}) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let isActive = true;

    async function fetchNotifications() {
      if (isOpen) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("No token found");
            return;
          }

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/notifications/unread`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!isActive) return;

          const data = await res.json();
          setNotifications(data);

          const unreadExists = data.some(
            (notification) => !notification.isRead
          );
          setHasUnreadNotifications(unreadExists);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    }
    fetchNotifications();

    return () => {
      isActive = false;
    };
  }, [isOpen, userId, setHasUnreadNotifications]);

  // Function to mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/notifications/${notificationId}/read`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedNotifications = notifications.filter((notification) => notification.id !== notificationId);
        setNotifications(updatedNotifications);

        setHasUnreadNotifications(updatedNotifications.length > 0);

      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    } else {
      console.error("No token found");
    }
  };
  return (
    <div
      className={`absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="px-4 py-3 font-medium text-center text-gray-700 bg-gray-50">
        Notifications
      </div>
      <ul className="divide-y divide-gray-100 max-h-60 overflow-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li
  key={notification.id}
  className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
  onClick={() => handleMarkAsRead(notification.id)}
>
              <div className="font-medium text-gray-900">
                {notification.content}
              </div>
              <div className="text-right text-sm text-gray-500">
                {new Date(notification.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </li>
          ))
        ) : (
          <li className="px-4 py-3 text-center text-gray-500">
            No new notifications.
          </li>
        )}
      </ul>
    </div>
  );
};

export default NotificationsDropdown;
