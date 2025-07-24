import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DescriptionIcon from '@mui/icons-material/Description';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import axios from 'axios';
import { Typography } from '@mui/material';
import {
  IconButton,
 
  Box,
  Paper,
  Chip,
  Button,
} from '@mui/material';
function InvoiceBalance() {
  const [billData, setBillData] = useState([]);

  useEffect(() => {
  const fetchBills = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/allBills');
      const data = response.data;

      const formatted = Array.isArray(data)
        ? data.map((bill, index) => ({
            id: index + 1,
            userName: bill.userId?.name || 'N/A',
            helperName: bill.helperId?.name || 'N/A',
            service: bill.bookingId?.service || 'N/A',
            description: bill.description || 'N/A',
            totalHours: bill.totalHours || 0,
            ratePerHour: bill.ratePerHour || 0,
            baseAmount: bill.baseAmount || 0,
            platformFee: bill.userPlatformFee || 0,
            totalAmountPaid: bill.totalAmountPaid || 0,
            paymentMode: bill.paymentMode || 'N/A',
            paymentStatus: bill.paymentStatus || 'N/A',
            paymentId: bill.paymentId || 'N/A',
            createdAt: bill.createdAt ? new Date(bill.createdAt).toLocaleString() : 'N/A',
          }))
        : [];

      setBillData(formatted);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  fetchBills();
}, []);


  const columns = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'userName', headerName: 'User', width: 150 },
{ field: 'helperName', headerName: 'Helper', width: 180 },
{ field: 'service', headerName: 'Service', width: 180 },

    
    { field: 'totalHours', headerName: 'Hours', width: 90 },
    { field: 'ratePerHour', headerName: 'Rate/hr', width: 100 },
    {
      field: 'baseAmount',
      headerName: 'Base ₹',
      width: 100,
      renderCell: (params) => `₹${params.value}`,
    },
    {
      field: 'platformFee',
      headerName: 'Platform Fee',
      width: 120,
      renderCell: (params) => `₹${params.value}`,
    },
    {
      field: 'totalAmountPaid',
      headerName: 'Total Paid',
      width: 120,
      renderCell: (params) => (
        <div className="flex items-center">
          <MonetizationOnIcon style={{ color: 'green', marginRight: 4 }} />
          ₹{params.value}
        </div>
      ),
    },
    {
      field: 'paymentMode',
      headerName: 'Mode',
      width: 120,
      renderCell: (params) => (
        <div className="flex items-center">
          <PaymentIcon style={{ color: 'blue', marginRight: 4 }} />
          {params.value}
        </div>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 220,
      renderCell: (params) => (
        <div className="flex items-center">
          <DescriptionIcon style={{ color: 'gray', marginRight: 4 }} />
          {params.value}
        </div>
      ),
    },
    {
      field: 'paymentStatus',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Paid' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    { field: 'paymentId', headerName: 'Payment ID', width: 220 },
    { field: 'createdAt', headerName: 'Created At', width: 180 },
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#880e4f' }}>
        Bill Transactions
      </Typography>

      <DataGrid
        rows={billData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#3f51b5',
            color: 'black',
            fontWeight: 'bolder',
          },
          '& .MuiDataGrid-cell:hover': {
            backgroundColor: '#e3f2fd',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#f1f1f1',
          },
        }}
      />
    </div>
  );
}

export default InvoiceBalance;
