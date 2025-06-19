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
const Navbar = () => {
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
        dispatch(logout());
      } if (helperData) {
  await fetch('/api/helpers/logout', {
    method: 'GET',
    credentials: 'include',
  });
  localStorage.removeItem("helperToken");
  dispatch(logoutHelper());


  if (admin) {
        await fetch('/api/admin/logout', {
          method: 'GET',
          credentials: 'include',
        });
        dispatch(logoutAdmin());
      }
  // 🧹 Clear persisted data
  // persistor.purge();
}
      
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

  return (
    <>
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand / Logo */}
            <div className="text-xl font-bold text-purple-600">HelpNest</div>

            {/* For desktop */}
            <div className="hidden md:flex space-x-6 items-center">
              <Link to="/" className="text-gray-700 hover:text-purple-600">Home</Link>

              {user && (
                <Link to="/requests" className="text-gray-700 hover:text-purple-600">Requests</Link>
              )}

              {helperData && (
                <Link to="/tasks" className="text-gray-700 hover:text-purple-600">Tasks</Link>
              )}

              <a href="#" className="text-gray-700 hover:text-purple-600">Services</a>

              {(user || helperData) ? (
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full bg-purple-600 text-white flex justify-center items-center font-bold cursor-pointer"
                    title={`Logged in as ${displayName}`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {userInitial}
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
                <button onClick={openLogin} className="text-gray-700 hover:text-blue-600">
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                aria-label="Toggle menu"
              >
                {isOpen ? 'Close' : 'Menu'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100">Home</Link>

              {user && (
                <Link to="/requests" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100">Requests</Link>
              )}

              {helperData && (
                <Link to="/tasks" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100">Tasks</Link>
              )}

              <a href="#" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100">Services</a>

              {(user || helperData) ? (
                <>
                  <div
                    className="w-8 h-8 rounded-full bg-orange-600 text-white flex justify-center items-center font-bold"
                    title={`Logged in as ${displayName}`}
                  >
                    {userInitial}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={openLogin}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100"
                >
                  Login
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
          className="flex flex-col items-center justify-center bg-purple-300 text-white w-24 h-24 rounded-lg cursor-not-allowed shadow-md"
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
