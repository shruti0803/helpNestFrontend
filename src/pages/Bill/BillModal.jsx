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
    const base = Number(totalHours) * Number(ratePerHour);
    if (!isNaN(base)) {
      setBaseAmount(base.toFixed(2));
      const fee = Math.round(base * 0.05);
      setUserPlatformFee(fee);
      setTotalAmountPaid((base + fee).toFixed(2));
    }
  }, [totalHours, ratePerHour]);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post(
        'http://localhost:5000/api/bills/createbill',
        {
          bookingId: booking._id,
          totalHours,
          ratePerHour,
          description,
          paymentMode,
          paymentId,
        },
        { withCredentials: true }
      );

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
    <div className="fixed inset-0  bg-black/40 z-50 flex items-center justify-center">
     <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-purple-600"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-purple-700 mb-4 text-center">🧾 Generate Bill</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          {/* Booking Info */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="text-purple-600 font-semibold mb-2">Booking Details</h3>
            <p><strong>Booking ID:</strong> {booking._id}</p>
            <p><strong>Service:</strong> {booking.service || "N/A"}</p>
          </div>

          {/* Work Details */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="text-purple-600 font-semibold mb-2">Work Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Total Hours Worked</label>
                <input
                  type="number"
                  value={totalHours}
                  onChange={(e) => setTotalHours(e.target.value)}
                  placeholder="e.g. 4"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Rate per Hour (₹)</label>
                <input
                  type="number"
                  value={ratePerHour}
                  onChange={(e) => setRatePerHour(e.target.value)}
                  placeholder="e.g. 200"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <label className="block mt-4 mb-1 font-medium">Work Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details of the work done..."
              required
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Clear Breakdown */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="text-purple-600 font-semibold mb-4">💰 Payment Breakdown</h3>
            <div className="grid grid-cols-3 gap-4 text-center text-sm font-medium text-gray-600">
              <div>
                <p className="mb-1">Base Amount</p>
                <input
                  type="text"
                  value={`₹${baseAmount}`}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-center cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">TotalHours × Rate</p>
              </div>
              <div>
                <p className="mb-1">Platform Fee (5%)</p>
                <input
                  type="text"
                  value={`₹${userPlatformFee}`}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-center cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Service fee</p>
              </div>
              <div>
                <p className="mb-1">Total Payable</p>
                <input
                  type="text"
                  value={`₹${totalAmountPaid}`}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-center cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Base + Fee</p>
              </div>
            </div>
          </div>

          {/* Payment Mode */}
          {/* <div className="bg-white border rounded-xl p-4">
            <h3 className="text-purple-600 font-semibold mb-2">Payment Information</h3>
            <label className="block mb-1 font-medium">Select Payment Mode</label>
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
              className="w-full px-3 py-2 border rounded-md mt-3"
            />
          </div> */}

          {/* Message */}
          {message && (
            <div className="text-center text-purple-600 font-medium">{message}</div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
          >
            ✅ Submit Bill
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillModal;
