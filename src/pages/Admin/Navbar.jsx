// src/pages/Admin/Navbar.jsx
import React, { useState } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  NotificationsOutlined,
  SearchOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAdminProfile from '../../../hooks/useGetAdminProfile';

const Navbar = () => {
  const { admin, loading } = useAdminProfile(); // 👈 hook usage
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/admin/logout", {
        method: "GET",
        credentials: "include",
      });
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Box className="flex font-poppins items-center justify-between py-4 w-full">
      {/* Search Bar */}
      <Box className="flex items-center gap-2 w-full">
        <Box className="hidden md:flex items-center h-12 bg-gray-200 rounded-lg w-full">
          <InputBase placeholder="Search" className="ml-2 flex-1" />
          <IconButton type="button" className="p-1">
            <SearchOutlined />
          </IconButton>
        </Box>
      </Box>

      {/* Right Side: Notifications, Settings, Avatar */}
      <Box className="flex items-center gap-2">
        <IconButton><NotificationsOutlined /></IconButton>
        <IconButton><SettingsOutlined /></IconButton>

        <IconButton onClick={handleAvatarClick}>
          {loading ? (
            <Avatar sx={{ bgcolor: 'grey.400' }}>...</Avatar>
          ) : admin?.A_Name ? (
            <Avatar sx={{ bgcolor: 'green' }}>
              {admin.A_Name[0].toUpperCase()}
            </Avatar>
          ) : (
            <Avatar sx={{ bgcolor: 'grey.400' }}>A</Avatar>
          )}
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
