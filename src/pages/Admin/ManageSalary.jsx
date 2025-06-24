import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageSalary = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchSalaryData();
  }, []);

  const fetchSalaryData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/allSalaries');
      const dataWithIds = response.data.map((item, index) => ({
        // This is required by DataGrid for unique row identification
    serial: index + 1,
        id: index + 1,
        ...item,
      }));
      setSalaryData(dataWithIds);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching salary data:', error);
      setLoading(false);
    }
  };

  const handlePayClick = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleConfirmPay = async () => {
    if (!selectedRow) return;
    try {
      await axios.post('http://localhost:5000/api/admin/pay-salary', {
        helperId: selectedRow.helperId || selectedRow._id || selectedRow.id,
      });

      setOpenDialog(false);

      Swal.fire({
        icon: 'success',
        title: 'Payment Successful',
        text: `₹${selectedRow.pendingAmount} paid to ${selectedRow.name}`,
        timer: 2000,
        showConfirmButton: false,
      });

      fetchSalaryData();
    } catch (error) {
      console.error('Error while paying salary:', error);
      Swal.fire('Payment Failed', 'Could not complete the payment.', 'error');
    }
  };

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


    { field: 'name', headerName: 'Helper Name', width: 200 },
    { field: 'phone', headerName: 'Phone Number', width: 150 },
    { field: 'accountNumber', headerName: 'Account No.', width: 160 },
    { field: 'ifscCode', headerName: 'IFSC Code', width: 140 },
    {
      field: 'totalEarned',
      headerName: 'Total Earned (₹)',
      width: 150,
      renderCell: (params) => `₹${params.row.totalEarned ?? 0}`,
    },
    {
      field: 'pendingAmount',
      headerName: 'Pending Amount (₹)',
      width: 180,
      renderCell: (params) => `₹${params.row.pendingAmount ?? 0}`,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) =>
        params.row.pendingAmount > 100 ? (
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handlePayClick(params.row)}
          >
            Pay Salary
          </Button>
        ) : (
          <Typography color="textSecondary">-</Typography>
        ),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Manage Salaries
      </Typography>

      <Paper elevation={3} sx={{ padding: 2 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <DataGrid
            rows={salaryData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            getRowId={(row) => row.id}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#3f51b5',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '16px',
              },
              '& .MuiDataGrid-cell:hover': {
                backgroundColor: '#f1f1f1',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: '#f9f9f9',
              },
            }}
          />
        )}
      </Paper>

      {/* Pay Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to pay{' '}
            <strong>₹{selectedRow?.pendingAmount}</strong> to{' '}
            <strong>{selectedRow?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmPay} color="primary" variant="contained">
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageSalary;
