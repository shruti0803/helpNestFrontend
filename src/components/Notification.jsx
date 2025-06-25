import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationPopup = ({ setHasUnread }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('role'); // 'helper' or 'user'
    const fetchNotifications = async () => {
      try {
        let combined = [];

        if (role === 'helper') {
          const taskRes = await axios.get('http://localhost:5000/api/bookings/tasks', {
            withCredentials: true,
          });

          console.log('🧑‍🔧 Helper tasks:', taskRes.data);
          combined = (taskRes.data.bookings || []).map((booking) => ({
            _id: booking._id,
            message: `New booking request for ${booking.service} on ${booking.date} at ${booking.time}`,
            createdAt: booking.createdAt,
          }));
        }

if (role === 'user') {
  // 1. Get scheduled bookings
  const userRes = await axios.get('http://localhost:5000/api/bookings/requests', {
    withCredentials: true,
  });

  const rawBookings = userRes.data;
  console.log('👤 Raw user bookings:', rawBookings);

  const scheduled = rawBookings
    .filter((booking) => booking.status === 'Scheduled')
    .map((booking) => ({
      _id: booking._id,
      message: `📅 Scheduled booking: ${booking.service} on ${booking.date} at ${booking.time}`,
      createdAt: booking.createdAt,
    }));

  console.log('👤 Filtered scheduled bookings:', scheduled);

  // 2. Get pending bills
  const billRes = await axios.get('http://localhost:5000/api/bills/allBills', {
    withCredentials: true,
  });

  console.log("💸 User bills:", billRes.data);

  const pendingBills = billRes.data
    .filter((bill) => bill.paymentStatus === 'Pending')
    .map((bill) => ({
      _id: bill._id,
      message: `💸 Pending bill: ₹${bill.totalAmountPaid
}  on ${bill.createdAt
}`,
      createdAt: bill.createdAt,
    }));

  // 3. Combine both types
  combined = [...combined, ...scheduled, ...pendingBills];
}




        combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        console.log('🔔 Final combined notifications:', combined);

        setNotifications(combined);
        setHasUnread(combined.length > 0);
      } catch (error) {
        console.error('❌ Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [setHasUnread]);

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
            <li key={notif._id} className="border-b pb-1">
              🔔 {notif.message}
              <div className="text-[10px] text-gray-400">
                {new Date(notif.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPopup;
