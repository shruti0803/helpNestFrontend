import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEnvelope, FaPhone, FaList } from "react-icons/fa";

const ViewUser = () => {
  const [userData, setUserData] = useState(null); // State for user details
  const [orders, setOrders] = useState([]); // State for orders
  const { email } = useParams(); // Extract 'email' from the URL

  // Fetch User Details
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:4002/userDetails/${email}`);
        const data = await response.json();
        setUserData(data[0]); // Assuming API returns an array with one user object
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [email]);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:4002/allOrders/${email}`);
        const data = await response.json();
        setOrders(data); // Store Orders Data
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [email]);

  // Loading State
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Profile Section */}
      <aside className="w-1/3 bg-white p-6 shadow-lg">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-3xl">
            {userData.U_Name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-4 text-lg font-semibold">{userData.U_Name}</h2>
          <span className="text-sm text-gray-500">User</span>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-4">Details</h3>
          <hr></hr>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center py-1">
              <FaEnvelope className="mr-2 text-xl text-gray-500" />
              <strong>Email:</strong> {userData.U_Email}
            </li>
            <li className="flex items-center py-1">
              <FaList className="mr-2 text-xl text-gray-500" />
              <strong>Name:</strong> {userData.U_Name}
            </li>
            <li className="flex items-center py-1">
              <FaPhone className="mr-2 text-xl text-gray-500" />
              <strong>Phone:</strong> {userData.U_Phone}
            </li>
          </ul>
        </div>
      </aside>

      {/* Right Content Section */}
      <main className="flex-1 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Orders</h3>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-2">Book ID</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Booked On</th>
                <th className="pb-2">Service Name</th>
                <th className="pb-2">Service Category</th>
                <th className="pb-2">Service Provider</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr
                    key={order.Book_ID}
                    className={index % 2 === 0 ? "bg-slate-200" : "bg-white"}
                  >
                    <td className="py-2 px-2">{order.Book_ID}</td>
                    <td className="px-2">{order.Book_Status}</td>
                    <td className="px-2">{new Date(order.Book_Date).toLocaleDateString()}</td>
                    <td className="px-2">{order.Service_Name}</td>
                    <td className="px-2">{order.Service_Category}</td>
                    <td className="px-2">{order.SP_Email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No orders available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ViewUser;