import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  IconButton,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


function ManageHelper() {
    const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
const [selectedHelperId, setSelectedHelperId] = useState(null);

    const handleOpenVerifyDialog = (id) => {
  setSelectedHelperId(id);
  setOpenVerifyDialog(true);
};

const handleCloseVerifyDialog = () => {
  setOpenVerifyDialog(false);
  setSelectedHelperId(null);
};

const handleConfirmVerify = () => {
  if (selectedHelperId) {
    handleVerify(selectedHelperId);
    handleCloseVerifyDialog();
  }
};

  const [usersData, setUsersData] = useState([]);
  const navigate = useNavigate();

  const handleViewClick = (params) => {
    navigate(`/admin/viewHelper/${params.row._id}`);
  };

  const handleVerify = (id) => {
    fetch(`http://localhost:5000/api/admin/verify/${id}`, {
      method: 'PATCH',
    })
      .then((res) => res.json())
      .then(() => {
        setUsersData((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isVerified: true } : u))
        );
      });
      console.log("verified");
  };

  const handleDelete = (id) => {
    console.log(`Deleting user ${id}`);
    // Connect to DELETE API here
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/allHelpers')
      .then((response) => response.json())
      .then((data) => {
  const formattedData = data.map((user, index) => ({
    id: user._id, // This is required by DataGrid for unique row identification
    serial: index + 1, // This is your serial number
    _id: user._id,
    name: user.name,
    email: user.email,
    trainingProgress: user.trainingProgress,
    testScore: user.testScore,
    isVerified: user.isVerified,
    services: user.services?.join(', ') || 'N/A',
    submittedAt: user.submittedAt?.split('T')[0],
    accountNumber: user.accountNumber,
    govDocumentUrl: user.govDocumentUrl,
    governmentId: user.governmentId,
    city: user.city,
    phone: user.phone,
  }));
  setUsersData(formattedData);
})

      .catch((error) => {
        console.error('Error fetching helpers:', error);
      });
  }, []);

  const columns = [
  
 {
  field: 'serial',
  headerName: 'ID',
  width: 80,
  headerAlign: 'center',
  align: 'center',
  sortable: false,
  filterable: false,
},


,
    { field: 'name', headerName: 'Name', flex: 1.2, headerAlign: 'center', align: 'center' },
    { field: 'email', headerName: 'Email', flex: 1.5, headerAlign: 'center', align: 'center' },
    { field: 'trainingProgress', headerName: 'Training', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'testScore', headerName: 'Score', flex: 1, headerAlign: 'center', align: 'center' },
{
  field: 'isVerified',
  headerName: 'Verified',
  flex: 1,
  headerAlign: 'center',
  align: 'center',
  renderCell: (params) =>
    params.row.isVerified ? (
      <Chip label="Verified" color="success" size="small" />
    ) : (
      <Chip
        label="Not Verified"
        color="error"
        size="small"
        onClick={() => handleOpenVerifyDialog(params.row._id)}
        sx={{ cursor: 'pointer' }}
      />
    ),
},


    { field: 'services', headerName: 'Services', flex: 1.8, headerAlign: 'center', align: 'center' },
    { field: 'submittedAt', headerName: 'Submitted On', flex: 1.2, headerAlign: 'center', align: 'center' },
    { field: 'accountNumber', headerName: 'Account No.', flex: 1.2, headerAlign: 'center', align: 'center' },
    { field: 'governmentId', headerName: 'Govt ID', flex: 1.2, headerAlign: 'center', align: 'center' },
    {
      field: 'govDocumentUrl',
      headerName: 'Document',
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <a
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#1a73e8', textDecoration: 'underline' }}
        >
          View
        </a>
      ),
    },
    { field: 'phone', headerName: 'Phone', flex: 1.2, headerAlign: 'center', align: 'center' },
    { field: 'city', headerName: 'City', flex: 1.2, headerAlign: 'center', align: 'center' },
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
    <Box className="w-full px-4 py-4">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#880e4f' }}>
        Manage Helpers
      </Typography>

      <Paper elevation={3} sx={{ overflowX: 'auto', padding: 2 }}>
        <div style={{ minWidth: 1600 }}>
          <DataGrid
            rows={usersData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20]}
            disableSelectionOnClick
            getRowId={(row) => row._id}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#e0e0e0',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '15px',
                textAlign: 'center',
              },
              '& .MuiDataGrid-cell': {
                fontSize: '14px',
                padding: '10px',
                textAlign: 'center',
              },
              '& .MuiDataGrid-cell:hover': {
                backgroundColor: '#f3e5f5',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: '#ede7f6',
              },
            }}
          />
        </div>
      </Paper>
      <Dialog open={openVerifyDialog} onClose={handleCloseVerifyDialog}>
  <DialogTitle>Confirm Verification</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to verify this helper?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseVerifyDialog} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleConfirmVerify} color="primary" variant="contained">
      Verify
    </Button>
  </DialogActions>
</Dialog>

    </Box>

    
  );
  
}

export default ManageHelper;
