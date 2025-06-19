import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { IconButton, Menu, MenuItem, Select, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Menu, MenuItem, Select, MenuItem as MuiMenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import WorkIcon from '@mui/icons-material/WorkOutline';

function ManageUser() {
  const [usersData, setUsersData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filteredRole, setFilteredRole] = useState('');
  const [filteredStatus, setFilteredStatus] = useState('');

  const navigate = useNavigate();

  const handleViewClick = (params) => {
    // Check if the user is a service provider
    if (params.row.role === 'Service Provider') {
      navigate(`/admin/viewSp/${params.row.email}`); // Navigate to viewSp page
    } else {
      navigate(`/admin/viewUser/${params.row.email}`); // Navigate to viewUser page
    }
  };

  useEffect(() => {
    fetch('http://localhost:4002/customers')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((user, index) => ({
          id: index + 1,
          name: user.U_Name,
          email: user.U_Email,
          phone: user.U_Phone,
          role: user.is_SP === 1 ? 'Service Provider' : 'User',
          status: user.Active==1?'Active': 'Not Active',
        }));
        setUsersData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    {
      field: 'role',
      headerName: 'Role',
      width: 250,
      renderCell: (params) => (
        <div className="flex items-center">
          {params.value === 'Service Provider' ? (
            <>
              <WorkIcon style={{ color: 'green', marginRight: 4 }} />
              <span>Service Provider</span>
            </>
          ) : (
            <>
              <PersonIcon style={{ color: 'blue', marginRight: 4 }} />
              <span>User</span>
            </>
          )}
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <div
          style={{
            color: params.value === 'Active' ? 'green' : 'gray',
            fontWeight: 'bold',
            padding: '5px 10px',
            textAlign: 'center',
            borderRadius: '5px',
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <div className="flex justify-around">
          <IconButton style={{ color: 'blue' }} onClick={() => handleViewClick(params)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton style={{ color: 'red' }} onClick={() => console.log(`Deleting user ${params.row.id}`)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <div style={{ height: 400 }}>
         {/* Filter section */}
      
      
      <Box  p={2} sx={{ border: '1px solid #ccc', borderRadius: 1, backgroundColor: '#f9f9f9' }}>
      <h1 className='text-xl font-bold mb-2'>Filter</h1>
      <div className=" flex">
      
        
      <FormControl style={{ width: 150, marginRight: 10 }}>
  <Select
    value={filteredRole}
    onChange={(e) => setFilteredRole(e.target.value)}
    displayEmpty
    renderValue={(selected) => {
      return selected === '' ? <span style={{ color: 'gray' }}>Select Role</span> : selected;
    }}
  >
    <MuiMenuItem value="" sx={{ color: 'gray' }}>Select Role</MuiMenuItem>
    <MuiMenuItem value="User">User</MuiMenuItem>
    <MuiMenuItem value="Service Provider">Service Provider</MuiMenuItem>
  </Select>
</FormControl>

<FormControl style={{ width: 150 }}>
  <Select
    value={filteredStatus}
    onChange={(e) => setFilteredStatus(e.target.value)}
    displayEmpty
    renderValue={(selected) => {
      return selected === '' ? <span style={{ color: 'gray' }}>Select Status</span> : selected;
    }}
  >
    <MuiMenuItem value="" sx={{ color: 'gray' }}>Select Status</MuiMenuItem>
    <MuiMenuItem value="Active">Active</MuiMenuItem>
    <MuiMenuItem value="Inactive">Inactive</MuiMenuItem>
  </Select>
</FormControl>

      </div>
      </Box>
      
        <DataGrid
          rows={usersData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#3f51b5',
              color: 'black',
              fontWeight: 'bold',
      fontSize: '16px',
            },
            '& .MuiDataGrid-cell:hover': {
              backgroundColor: '#e3f2fd',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#e0e0e0',
            },
          }}
        />
      </div>
    </div>
  );
}

export default ManageUser;