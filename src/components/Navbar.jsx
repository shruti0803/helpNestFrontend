import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import LoginRegister from './Auth/LoginForm';
import LoginHelper from './Auth/LoginHelper';
import { logout } from '../../redux/userSlice';
import { FaUser, FaHandsHelping, FaUserShield } from 'react-icons/fa';
import useGetHelperProfile from '../../hooks/useGetHelperProfile';
import { logoutHelper } from '../../redux/helperSlice';
import { useNavigate } from "react-router-dom";
import AdminLogin from './Auth/LoginAdmin';
import { logoutAdmin } from '../../redux/adminSlice';
import { FaBell } from 'react-icons/fa';
import { FaHome, FaClipboardList, FaTasks } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import NotificationPopup from './Notification';
import { FaMapMarkedAlt } from "react-icons/fa"; 
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { FiMenu, FiX } from 'react-icons/fi'; // Add this at the top
import axios from 'axios';


const Navbar = () => {
  const location = useLocation();
 
const [showNotifications, setShowNotifications] = useState(false);
const [hasUnreadNotification, setHasUnreadNotification] = useState(false);

const [unreadCount, setUnreadCount] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authRole, setAuthRole] = useState(null); // user | helper | null
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const helperData = useSelector((state) => state.helper.helper);

  const user = useSelector((state) => state.user.user);
  const admin=useSelector((state)=> state.admin.admin);
  const dispatch = useDispatch();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeDropdown = () => setDropdownOpen(false);
 const handleProfile = () => {
    navigate("/profile");
  };
  const handleLogout = async () => {
    closeDropdown();
    try {
      if (user) {
        await fetch('/api/users/logout', {
          method: 'GET',
          credentials: 'include',
        });
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        dispatch(logout());
      } if (helperData) {
  await fetch('/api/helpers/logout', {
    method: 'GET',
    credentials: 'include',
  });
  localStorage.removeItem("helperToken");
  localStorage.removeItem("role");
  dispatch(logoutHelper());
      }

  if (admin) {
        await fetch('/api/admin/logout', {
          method: 'GET',
          credentials: 'include',
        });
        dispatch(logoutAdmin());
      }
  // 🧹 Clear persisted data
  // persistor.purge();

      
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const displayName = user?.name || helperData?.name || admin?.name;
  const userInitial = displayName ? displayName.charAt(0).toUpperCase() : null;

  const openLogin = () => {
     dispatch(logoutHelper()); // Clear previous helper
    setShowAuth(true);
    setIsOpen(false);
  };

  const closeAuth = () => {
    setShowAuth(false);
    setAuthRole(null);
  };

  useEffect(() => {
    console.log("Navbar helperData changed:", helperData);
  }, [helperData]);



useEffect(() => {
  const pollUnreadNotifications = async () => {
    const role = localStorage.getItem('role');
    if (!role) return;

    console.log("🔁 Polling notifications as role:", role);

    try {
      const dynamic = [];

      // Fetch seen notifications
      const seenRes = await axios.get(`http://localhost:5000/api/notifications/${role}`, {
        withCredentials: true
      });
      const seenList = seenRes.data;
      //console.log("👁️ Seen from DB:", seenList);

      const seenMap = new Map();
      seenList.forEach(n => seenMap.set(`${n.type}_${n.refId}`, true));

      if (role === 'helper') {
        const res = await axios.get('http://localhost:5000/api/bookings/tasks', { withCredentials: true });
        const bookings = res.data.bookings || [];
        //console.log("📦 Helper bookings:", bookings);

        bookings.forEach(b => {
          dynamic.push({
            _id: b._id,
            type: 'request',
          });
        });

        //console.log("🧠 Constructed helper dynamic notifications:", dynamic);
      }

      if (role === 'user') {
        const res1 = await axios.get('http://localhost:5000/api/bookings/requests', { withCredentials: true });
        const bookings = res1.data || [];
        //console.log("📦 User bookings:", bookings);

        bookings.forEach(b => {
          if (b.status === 'Scheduled') {
            dynamic.push({
              _id: b._id,
              type: 'scheduled',
            });
          }
        });

        const res2 = await axios.get('http://localhost:5000/api/bills/allBills', { withCredentials: true });
        const bills = res2.data || [];
        //console.log("💸 User bills:", bills);

        bills.forEach(bill => {
          if (bill.paymentStatus === 'Pending') {
            dynamic.push({
              _id: bill._id,
              type: 'bill',
            });
          }
        });

       // console.log("🧠 Constructed user dynamic notifications:", dynamic);
      }

      // Match against seen
      const withSeen = dynamic.map(n => ({
        ...n,
        seen: seenMap.has(`${n.type}_${n._id}`)
      }));

      //console.log("📋 With seen info:", withSeen);

      const unseenCount = withSeen.filter(n => !n.seen).length;
     // console.log("🔢 Unseen count:", unseenCount);

      setUnreadCount(unseenCount);
      setHasUnreadNotification(unseenCount > 0);
    } catch (err) {
      console.error('❌ Background notification poll error:', err.message);
    }
  };

  pollUnreadNotifications();
  const interval = setInterval(pollUnreadNotifications, 5000);
  return () => clearInterval(interval);
}, []);



  return (
    <>
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand / Logo */}
            <div className="text-xl font-bold text-purple-600">HelpNest</div>

            {/* For desktop */}
            <div className="hidden md:flex space-x-8 items-center">
             

<div className={`h-16  flex items-center ${location.pathname === '/' ? 'border-b-4 border-purple-600 font-bold text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}>
  <Link to="/" className="flex items-center space-x-2 text-sm" title="Home">
    <FaHome size={20} />
    <span>Home</span>
  </Link>
</div>
{user && (
<div className={`h-16  flex items-center ${location.pathname === '/community' ? 'border-b-4 border-purple-600 font-bold text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}>
  <Link to="/community" className="flex items-center space-x-2 text-sm" title="Community">
 <FaMapMarkedAlt size={20} />
<span>Local Hub</span>
  </Link>
</div>

)}

{user && (
 <div className={`h-16 flex items-center ${location.pathname === '/requests' ? 'border-b-4 border-purple-600 font-bold text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}>
  <Link to="/requests" className="flex items-center space-x-2 text-sm" title="Requests">
    <FaClipboardList size={20} />
    <span>Requests</span>
  </Link>
</div>


)}

{helperData && (
 <div className={`h-16 flex items-center ${location.pathname === '/tasks' ? 'border-b-4 border-purple-600 font-bold text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}>
  <Link
    to="/tasks"
    className="flex items-center space-x-2 text-sm"
    title="Tasks"
  >
    <FaTasks size={20} />
    <span>Tasks</span>
  </Link>
</div>


)}


{(user || helperData ) && (
  <div className="relative">
    <div
      className={`h-16 flex items-center cursor-pointer ${
        showNotifications ? 'border-b-4 border-purple-600 font-bold text-purple-600' : 'text-gray-700 hover:text-purple-600'
      }`}
      onClick={() => setShowNotifications((prev) => !prev)}
    >
      <div className="flex items-center space-x-2 text-sm">
        <div className="relative">
  <FaBell size={20} className={hasUnreadNotification ? 'text-yellow-500' : ''} />
  {hasUnreadNotification && unreadCount > 0 && (
  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
  {unreadCount}
</span>

  )}
</div>

        <span>Alerts</span>
      </div>
    </div>

    {showNotifications && (
     <div className="absolute right-0 mt-2 w-[580px] bg-gradient-to-br from-purple-200 to-white border border-purple-200 rounded-2xl shadow-xl z-50">


      <NotificationPopup
  setHasUnread={(hasUnread, count) => {
    setHasUnreadNotification(hasUnread);
    setUnreadCount(count);
  }}
/>

      </div>
    )}
  </div>
)}




             

              {(user || helperData) ? (
                <div className="relative">
                 <div className="flex flex-col items-center cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)} title={`Logged in as ${displayName}`}>
  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex justify-center items-center font-bold">
    {userInitial}
  </div>
 
</div>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-md z-50">
                      <button
                        onClick={handleProfile}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={openLogin} className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
 <FaUserCircle size={20} />

  <span>Login</span>
</button>
              )}
             
            </div>

            {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
  <button
    onClick={toggleMenu}
    className="text-gray-700 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 text-2xl"
    aria-label="Toggle menu"
  >
    {isOpen ? <FiX /> : <FiMenu />}
  </button>
</div>
          </div>
        </div>

        {/* Mobile menu */}
       {isOpen && (
  <div className="md:hidden bg-white shadow-md">
    <div className="px-2 pt-2 pb-3 space-y-1 text-sm">
      <Link
        to="/"
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-50 transition"
      >
        <FaHome size={20} />
        <span>Home</span>
      </Link>

      {user && (
        <Link
          to="/requests"
          className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-50 transition"
        >
          <FaClipboardList size={20} />
          <span>Requests</span>
        </Link>
      )}

      {helperData && (
        <Link
          to="/tasks"
          className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-50 transition"
        >
          <FaClipboardList size={20} />
          <span>Tasks</span>
        </Link>
      )}

      {user && (
        <Link
          to="/community"
          className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-50 transition"
          title="Community"
        >
          <FaMapMarkedAlt size={20} />
          <span>Local Hub</span>
        </Link>
      )}

      {(user || helperData) && (
        <div className="relative">
          <div
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-50 transition cursor-pointer"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <div className="relative">
              <FaBell size={20} className={hasUnreadNotification ? 'text-yellow-500' : ''} />
              {hasUnreadNotification && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {unreadCount}
                </span>
              )}
            </div>
            <span>Alerts</span>
          </div>

          {showNotifications && (
            <div className="fixed inset-0 bg-white z-50 p-4 md:hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-purple-700">Notifications</h2>
                <button onClick={() => setShowNotifications(false)} className="text-2xl font-bold text-gray-600">
                  &times;
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <NotificationPopup
                  setHasUnread={(hasUnread, count) => {
                    setHasUnreadNotification(hasUnread);
                    setUnreadCount(count);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {(user || helperData) ? (
        <>
          <div className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-50 transition">
            <div
              className="w-6 h-6 rounded-full bg-black text-white flex justify-center items-center font-bold"
              title={`Logged in as ${displayName}`}
            >
              {userInitial}
            </div>
            <button onClick={handleProfile}>My Profile</button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-red-100 transition"
          >
            <FaSignOutAlt size={18} className="text-black" />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <button
          onClick={openLogin}
          className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition"
        >
          <FaSignOutAlt size={18} className="text-black" />
            <span>Login</span>
        </button>
      )}
    </div>
  </div>
)}

      </nav>

      {/* Auth modal selection */}
      

{showAuth && !authRole && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-md text-center w-[380px] max-w-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-6">Login As</h2>
      <div className="flex justify-between space-x-4">
        <button
          onClick={() => setAuthRole('user')}
          className="flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700 text-white w-24 h-24 rounded-lg shadow-md transition"
          title="User"
        >
          <FaUser size={32} />
          <span className="mt-2 font-semibold">User</span>
        </button>

        <button
          onClick={() => setAuthRole('helper')}
          className="flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700 text-white w-24 h-24 rounded-lg shadow-md transition"
          title="Helper"
        >
          <FaHandsHelping size={32} />
          <span className="mt-2 font-semibold">Helper</span>
        </button>

        <button
          onClick={() => setAuthRole('admin')}
          className="flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700 text-white w-24 h-24 rounded-lg shadow-md transition"
          title="Admin"
        >
          <FaUserShield size={32} />
          <span className="mt-2 font-semibold">Admin</span>
        </button>
      </div>

      <button
        onClick={closeAuth}
        className="text-red-500 mt-6 text-sm hover:underline"
      >
        Cancel
      </button>
    </div>
  </div>
)}


      {/* User login form */}
      {showAuth && authRole === 'user' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-[700px] max-w-[90vw]">
            <button
              onClick={closeAuth}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
              aria-label="Close"
            >
              &times;
            </button>
            <LoginRegister onLoginSuccess={() => closeAuth()} />
          </div>
        </div>
      )}

      {/* Helper login form */}
      {showAuth && authRole === 'helper' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-50 p-6 rounded-lg shadow-lg  relative w-[700px] max-w-[90vw]">
            <button
              onClick={closeAuth}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
              aria-label="Close"
            >
              &times;
            </button>
            <LoginHelper onLoginSuccess={() => closeAuth()} />
          </div>
        </div>
      )}
       {showAuth && authRole === 'admin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-50 p-6 rounded-lg shadow-lg  relative w-[700px] max-w-[90vw]">
            <button
              onClick={closeAuth}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
              aria-label="Close"
            >
              &times;
            </button>
            <AdminLogin onLoginSuccess={() => closeAuth()} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
