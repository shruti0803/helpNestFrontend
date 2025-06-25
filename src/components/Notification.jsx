import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationPopup = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/notifications/bookingnotifications', {
          withCredentials: true,
        });
        setNotifications(res.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="p-4 text-sm text-gray-800 max-h-72 w-72 overflow-y-auto">
      <p className="font-semibold mb-2">Notifications</p>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className="border-b pb-1"
            >
              🔔 {notif.message}
              <div className="text-[10px] text-gray-400">{new Date(notif.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPopup;
