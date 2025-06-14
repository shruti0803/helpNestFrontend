import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const BillModal = ({ isOpen, onClose, booking }) => {
  const [totalHours, setTotalHours] = useState('');
  const [ratePerHour, setRatePerHour] = useState('');
  const [baseAmount, setBaseAmount] = useState('');
  const [userPlatformFee, setUserPlatformFee] = useState('');
  const [totalAmountPaid, setTotalAmountPaid] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMode, setPaymentMode] = useState('Online');
  const [paymentId, setPaymentId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Auto-calculate base, fee, total
    const base = Number(totalHours) * Number(ratePerHour);
    if (!isNaN(base)) {
      setBaseAmount(base.toFixed(2));
      const fee = Math.round(base * 0.05);
      setUserPlatformFee(fee);
      setTotalAmountPaid(base + fee);
    }
  }, [totalHours, ratePerHour]);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/bills/createbill', {
        bookingId: booking._id,
        totalHours,
        ratePerHour,
        description,
        paymentMode,
        paymentId,
      },{
  withCredentials: true
});

      setMessage('✅ Bill created successfully!');
      setTimeout(() => {
        onClose();
        setTotalHours('');
        setRatePerHour('');
        setDescription('');
        setPaymentMode('Online');
        setPaymentId('');
        setMessage('');
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error creating bill. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-purple-600"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold text-purple-700 mb-4">Create Payment Bill</h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <p><strong>Booking ID:</strong> {booking._id}</p>
          <p><strong>Service:</strong> {booking.service || "N/A"}</p>

          <input
            type="number"
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
            placeholder="Total Hours"
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <input
            type="number"
            value={ratePerHour}
            onChange={(e) => setRatePerHour(e.target.value)}
            placeholder="Rate Per Hour"
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description of work done"
            required
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
          />

          <input
            type="text"
            value={baseAmount}
            readOnly
            placeholder="Base Amount"
            className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
          />

          <input
            type="text"
            value={userPlatformFee}
            readOnly
            placeholder="Platform Fee (5%)"
            className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
          />

          <input
            type="text"
            value={totalAmountPaid}
            readOnly
            placeholder="Total Amount Paid"
            className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
          />

          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Online">Online</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Netbanking">Netbanking</option>
            <option value="Wallet">Wallet</option>
          </select>

          <input
            type="text"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            placeholder="Payment ID (optional)"
            className="w-full px-3 py-2 border rounded-md"
          />

          {message && <p className="text-center text-sm text-purple-600">{message}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700"
          >
            Submit Bill
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillModal;
