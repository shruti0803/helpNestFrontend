import { useEffect, useState } from "react";
import axios from "axios";

const OrderHistoryModal = ({ onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  axios
    .get("http://localhost:5000/api/shop/orders/user", {
      withCredentials: true, // include cookies if auth requires it
    })
    .then((res) => {
      setOrders(res.data.orders || []);
    })
    .catch((err) => {
      console.error("Error fetching order history:", err);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✖
        </button>
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Your Order History</h2>

        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="border p-4 rounded-lg shadow-sm">
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                <p><strong>Payment:</strong> {order.paymentStatus}</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.medicineId?.name} × {item.quantity} = ₹{item.priceAtPurchase * item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryModal;
