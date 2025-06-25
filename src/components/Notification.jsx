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

 return (<div className="p-6 text-[15px] text-gray-800 max-h-[520px] w-[580px] overflow-y-auto rounded-2xl bg-white/70">

    <h2 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
      <span className="text-purple-600">🔔</span> Notifications
    </h2>

    {loading ? (
      <p className="text-gray-500 animate-pulse">Fetching latest alerts...</p>
    ) : notifications.length === 0 ? (
      <p className="text-gray-500 italic">You’re all caught up!</p>
    ) : (
      <ul className="space-y-3">
        {notifications.map((notif) => (
          <li
            key={notif._id}
            className="bg-white/70 border border-purple-100 shadow-sm p-3 rounded-lg hover:bg-purple-50 transition"
          >
            <p className="text-gray-800">
              <span className="text-purple-600">🔔</span> {notif.message}
            </p>
            <div className="text-[11px] text-gray-500 mt-1 text-right">
              {new Date(notif.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);
}

export default NotificationPopup;
