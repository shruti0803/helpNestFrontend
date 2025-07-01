import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiShoppingCart, FiPlus, FiMinus, FiSearch } from 'react-icons/fi';
import { FaCapsules } from 'react-icons/fa';

const MedShop = () => {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState('');

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
  try {
    await axios.post('http://localhost:5000/api/shop/add', {
      medicineId: item._id,
      quantity: 1,
    }, { withCredentials: true }); // assumes user is authenticated via cookies

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


  const filteredMeds = medicines.filter((med) =>
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const med = medicines.find((m) => m._id === id);
    return sum + qty * (med?.price || 0);
  }, 0);

  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <div className="w-80 bg-purple-100 p-4 border-r border-purple-300">
        <h2 className="text-xl font-bold text-purple-800 flex items-center gap-2">
          <FiShoppingCart /> Cart
        </h2>
        {Object.keys(cart).length === 0 ? (
          <p className="text-gray-500 mt-4">Your cart is empty.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {Object.entries(cart).map(([id, qty]) => {
              const med = medicines.find((m) => m._id === id);
              return (
                <li
                  key={id}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span>{med?.name}</span>
                  <span className="text-sm text-gray-600">x{qty}</span>
                </li>
              );
            })}
            <li className="pt-4 font-semibold text-purple-800">
              Total: ₹{total}
            </li>
          </ul>
        )}

        <div className="mt-6 space-y-2">
  <button
    onClick={() => alert("Proceeding to payment...")}
    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
  >
    Buy Now
  </button>
  <button
    onClick={() => alert("Navigate to order history")}
    className="w-full border border-purple-500 text-purple-700 py-2 rounded-lg transition hover:bg-purple-100"
  >
    Order History
  </button>
</div>

      </div>

      {/* Main Shop */}
      <main className="flex-1 p-6 bg-gradient-to-br from-white to-purple-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
            <FaCapsules className="text-purple-500" /> Medicine Shop
          </h1>
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded shadow border border-purple-200">
            <FiSearch className="text-purple-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name"
              className="outline-none text-sm text-purple-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeds.map((med) => (
            <div
              key={med._id}
              className="bg-white rounded-2xl shadow p-4 border border-purple-100 hover:shadow-lg transition"
            >
              <img
                src={med.imageUrl || 'https://via.placeholder.com/150'}
                alt={med.name}
                className="h-40 w-full object-cover rounded-xl mb-3"
              />
              <h2 className="text-lg font-semibold text-purple-800 mb-1">
                {med.name}
              </h2>
              <p className="text-gray-600 text-sm mb-2">{med.description}</p>
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
      </main>
    </div>
  );
};

export default MedShop;