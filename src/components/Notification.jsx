import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationPopup = ({ setHasUnread }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const role = localStorage.getItem('role');
      try {
        const dynamic = []; // all current from booking/bills
        const seen = [];

        // 1. Fetch seen notification records
        const seenRes = await axios.get(
          `http://localhost:5000/api/notifications/${role}`,
          { withCredentials: true }
        );
        const seenList = seenRes.data; // [{ type, refId }]

        // 2. Fetch current booking/bills (same as your current logic) → populate `dynamic`
        if (role === 'helper') {
          const res = await axios.get('http://localhost:5000/api/bookings/tasks', { withCredentials: true });
         
          (res.data.bookings || []).forEach(b => {
            dynamic.push({
              _id: b._id,
              type: 'request',
              message: `New booking for ${b.service} on ${b.date}`,
              createdAt: b.createdAt
            });
          });
        }

        if (role === 'user') {
          const res1 = await axios.get('http://localhost:5000/api/bookings/requests', { withCredentials: true });
          res1.data.forEach(b => {
            if (b.status === 'Scheduled') {
              dynamic.push({
                _id: b._id,
                type: 'scheduled',
                message: `📅 Scheduled: ${b.service} on ${b.date} at ${b.time}`,
                createdAt: b.createdAt
              });
            }
          });

          const res2 = await axios.get('http://localhost:5000/api/bills/allBills', { withCredentials: true });
          res2.data.forEach(bill => {
            if (bill.paymentStatus === 'Pending') {
              dynamic.push({
                _id: bill._id,
                type: 'bill',
                message: `💸 Pending bill: ₹${bill.totalAmountPaid}`,
                createdAt: bill.createdAt
              });
            }
          });
        }

        // 3. Compare with seen
        const seenMap = new Map();
        seenList.forEach(n => seenMap.set(`${n.type}_${n.refId}`, true));

        const withSeen = dynamic.map(n => ({
          ...n,
          seen: seenMap.has(`${n.type}_${n._id}`) ? true : false
        }));

      setNotifications(
  withSeen.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
);

        const count = withSeen.filter(n => !n.seen).length;
setHasUnread(count > 0, count);

      } catch (err) {
        console.error('❌ Notification fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [setHasUnread]);

  // 🔁 On first load, mark unseen as seen
  useEffect(() => {
    const markAsSeen = async () => {
      const unseen = notifications.filter(n => !n.seen);
      if (unseen.length === 0) return;

      const grouped = unseen.reduce((acc, n) => {
        acc[n.type] = acc[n.type] || [];
        acc[n.type].push(n._id);
        return acc;
      }, {});

      const role = localStorage.getItem('role');
      for (const [type, ids] of Object.entries(grouped)) {
        await axios.post(
          `http://localhost:5000/api/notifications/${role}/mark-seen`,
          { type, ids },
          { withCredentials: true }
        );
      }
    };

    if (notifications.length > 0) {
      markAsSeen();
    }
  }, [notifications]);


 return (<div className="p-4 md:p-6 text-[15px] text-gray-800 max-h-screen md:max-h-[520px] w-full md:w-[580px] overflow-y-auto rounded-none md:rounded-2xl bg-white md:bg-white/70">


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
      className={`p-3 rounded-lg transition border shadow-sm ${
        notif.seen ? 'bg-white/70' : 'bg-yellow-100'
      }`}
    >
      <p>
        <span className="text-purple-600">🔔</span> {notif.message}
      </p>
      <div className="text-[11px] text-gray-500 text-right">
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
