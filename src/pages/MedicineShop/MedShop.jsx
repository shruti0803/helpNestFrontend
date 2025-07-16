import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiShoppingCart, FiPlus, FiMinus, FiSearch,  FiMapPin, FiClock } from 'react-icons/fi';
import { FaCapsules } from 'react-icons/fa';
import { loadRazorpayScript } from '../Bill/RazorpayPayment';
import Swal from 'sweetalert2';
import CarouselHero from '../../components/CarouselHero';
import CategoryCards from '../../components/CategoryCards';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import OrderHistoryModal from './OrderHistoryModal';
const MedShop = () => {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
 const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
 const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medRes, cartRes] = await Promise.all([
          axios.get('http://localhost:5000/api/shop'),
          axios.get('http://localhost:5000/api/shop/getCart', { withCredentials: true })
        ]);

        setMedicines(medRes.data);

        const backendCart = cartRes.data.items || [];
        const cartMap = {};
        backendCart.forEach(item => {
          cartMap[item._id] = item.quantity;
        });
        setCart(cartMap);

      } catch (err) {
        console.error('Error loading shop or cart:', err);
      }
    };

    fetchData();
  }, []);

  const handleAdd = async (item) => {
     if (item.prescriptionRequired) {
      setSelectedMed(item);
      setPrescriptionModalOpen(true);
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/shop/add', {
        medicineId: item._id,
        quantity: 1,
      }, { withCredentials: true });

      setCart((prev) => ({
        ...prev,
        [item._id]: (prev[item._id] || 0) + 1,
      }));
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleRemove = async (item) => {
    try {
      await axios.post('http://localhost:5000/api/shop/remove', {
        medicineId: item._id,
      }, { withCredentials: true });

      setCart((prev) => {
        if (!prev[item._id]) return prev;
        const updated = { ...prev };
        updated[item._id]--;
        if (updated[item._id] <= 0) delete updated[item._id];
        return updated;
      });
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const handleBuyNow = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/shop/checkout', {}, { withCredentials: true });
      const { razorpayOrderId, amount, key } = res.data;

      const options = {
        key,
        amount,
        currency: "INR",
        name: "HelpNest",
        description: "Medicine Purchase",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await axios.post('http://localhost:5000/api/shop/confirm-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, { withCredentials: true });

            Swal.fire({
              title: '✅ Payment Successful!',
              text: 'Your medicine order has been placed.',
              icon: 'success',
              confirmButtonColor: '#6b46c1'
            });
            setCart({});
          } catch (err) {
            alert("❌ Payment succeeded but backend failed");
            console.error("Confirm payment failed:", err);
          }
        },
        theme: { color: "#6b46c1" }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Razorpay flow failed:", err);
      alert("❌ Failed to initiate payment.");
    }
  };

  const filteredMeds = medicines.filter((med) =>
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const med = medicines.find((m) => m._id === id);
    return sum + qty * (med?.price || 0);
  }, 0);

  return (
    <div className="min-h-screen px-2 py-20 bg-gradient-to-br from-white to-purple-50">
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="fixed top-20 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg"
      >
        <FiShoppingCart className="inline mr-2" /> Cart
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-purple-100 p-4 pt-20 border-l border-purple-300 shadow-xl transform transition-transform duration-300 z-40 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <h2 className="text-xl font-bold text-purple-800 flex items-center gap-2">
          <FiShoppingCart /> Your Cart
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
          <FiClock className="text-green-500" />
          <span>Delivery in <span className="font-semibold text-green-600">2 hours</span></span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 mt-1">
          <FiMapPin className="text-blue-500" />
          <span>Delivering to: <span className="font-semibold text-purple-700">Your saved address</span></span>
        </div>

        {Object.keys(cart).length === 0 ? (
          <p className="text-gray-500 mt-4">Your cart is empty.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {Object.entries(cart).map(([id, qty]) => {
              const med = medicines.find((m) => m._id === id);
              return (
                <li
                  key={id}
                  className="bg-white border border-purple-200 p-3 rounded-lg flex justify-between items-center"
                >
                  <div className="text-sm font-medium text-purple-800">{med?.name}</div>
                  <div className="text-sm text-gray-700">x{qty}</div>
                </li>
              );
            })}
            <li className="pt-4 font-semibold text-purple-800 text-right">
              Total: ₹{total}
            </li>
          </ul>
        )}

        <div className="mt-6 space-y-2">
          <button
            onClick={handleBuyNow}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
          >
            Buy Now
          </button>

          <button
        onClick={() => setShowModal(true)}
        className="w-full border border-purple-500 text-purple-700 py-2 rounded-lg transition hover:bg-purple-100"
      >
        Order History
      </button>

      {showModal && <OrderHistoryModal onClose={() => setShowModal(false)} />}
        </div>
      </div>

      <main className="flex-1 px-2 sm:px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
            <FaCapsules className="text-purple-500" /> Medicine Shop
          </h1>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow border border-purple-200 w-full md:w-[840px]">
            <FiSearch className="text-purple-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name"
              className="outline-none text-sm text-purple-800 w-full"
            />
          </div>
        </div>

        <CarouselHero />
        <CategoryCards />
<hr></hr>
        <h2 className="text-xl sm:text-2xl font-semibold text-purple-800 mb-4 mt-8 border-l-4 border-purple-500 pl-3">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMeds.map((med) => (
            <div
              key={med._id}
              className="bg-white rounded-2xl shadow p-4 border border-purple-100 hover:shadow-lg transition flex flex-col justify-between"
            >
              <img
                src={med.imageUrl || 'https://via.placeholder.com/150'}
                alt={med.name}
                className="h-40 w-full object-cover rounded-xl mb-3"
              />
              <h2 className="text-lg font-semibold text-purple-800 mb-1">
                {med.name}
              </h2>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{med.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-purple-700 font-bold">₹{med.price}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRemove(med)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full"
                  >
                    <FiMinus />
                  </button>
                  <button
                    onClick={() => handleAdd(med)}
                    className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-full"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
          <Dialog open={prescriptionModalOpen} onClose={() => setPrescriptionModalOpen(false)}>
        <DialogTitle>Prescription Required</DialogTitle>
        <DialogContent>
          <p className="text-purple-800 font-medium">
            This medicine requires a valid prescription to proceed.
            Please upload your prescription. It will be reviewed before this item is allowed in your cart.
          </p>
         <input
  type="file"
  className="mt-4"
  onChange={(e) => setPrescriptionFile(e.target.files[0])}
/>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrescriptionModalOpen(false)} color="secondary">Cancel</Button>
         <Button
  onClick={async () => {
    if (!prescriptionFile || !selectedMed) return;

    const formData = new FormData();
    formData.append("prescription", prescriptionFile);
    formData.append("medicineId", selectedMed._id);

    try {
      await axios.post('http://localhost:5000/api/shop/upload-prescription', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire('Uploaded', 'Your prescription will be reviewed shortly.', 'info');
    } catch (error) {
      console.error('Prescription upload failed:', error);
      Swal.fire('Error', 'Failed to upload prescription.', 'error');
    }

    setPrescriptionModalOpen(false);
    setSelectedMed(null);
    setPrescriptionFile(null);
  }}
  variant="contained"
  color="primary"
>
  Upload
</Button>

        </DialogActions>
      </Dialog>
      </main>
    </div>
  );
};

export default MedShop;