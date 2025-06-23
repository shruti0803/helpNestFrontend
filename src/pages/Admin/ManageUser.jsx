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
    fetch('http://localhost:5000/api/admin/allUsers')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((user, index) => ({
          id: index + 1,
          name: user.name,
          email: user.email,
        
         
          
        }));
        setUsersData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

const columns = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1.5 },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    renderCell: (params) => (
      <div className="flex justify-around w-full">
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
 <div className="w-full px-4">
  <Typography variant="h4" gutterBottom>
    Manage Users
  </Typography>

  <div style={{ height: 600, width: '100%' }}>
    <DataGrid
      rows={usersData}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10, 20]}
      disableSelectionOnClick
      autoHeight={false}
      sx={{
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#3f51b5',
          color: 'black',
          fontWeight: 'bold',
          fontSize: '16px',
        },
        '& .MuiDataGrid-cell': {
          fontSize: '15px',
          padding: '12px',
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