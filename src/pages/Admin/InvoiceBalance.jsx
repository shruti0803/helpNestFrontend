import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import PaymentIcon from '@mui/icons-material/Payment';
import WorkIcon from '@mui/icons-material/WorkOutline';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';
import { Typography } from '@mui/material';

function InvoiceBalance() {
  const [invoiceData, setInvoiceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4002/invoiceBalance');
        const fetchedData = response.data.map((item, index) => ({
          id: index + 1, // Unique ID for each row
          bookId: item.Book_ID || 'N/A',
          billId: item.Bill_ID || 'N/A',
          billDate: item.Bill_Date ? new Date(item.Bill_Date).toLocaleDateString() : 'N/A',
          billMode: item.Bill_Mode || 'N/A',
          totalCost: item.Total_Cost ? parseFloat(item.Total_Cost).toFixed(2) : '0.00', // Ensure two decimal places
          paymentId: item.Payment_ID || 'N/A',
          spEmail: item.SP_Email || 'N/A',
          uEmail: item.U_Email || 'N/A',
          serviceName: item.Service_Name || 'N/A',
          serviceCategory: item.Service_Category || 'N/A',
          address: [
            item.Book_HouseNo,
            item.Book_Area,
            item.Book_City,
            item.Book_State,
            item.Book_City_PIN,
          ]
            .filter(Boolean) // Remove null or undefined values
            .join(', '),
        }));
        setInvoiceData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: 'bookId', headerName: 'Book ID', width: 120 },
    { field: 'billId', headerName: 'Bill ID', width: 150 },
    { field: 'billDate', headerName: 'Bill Date', width: 150 },
    {
      field: 'billMode',
      headerName: 'Bill Mode',
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center">
          <PaymentIcon style={{ color: 'green', marginRight: 4 }} />
          {params.value}
        </div>
      ),
    },
    {
      field: 'totalCost',
      headerName: 'Total Cost',
      width: 120,
      renderCell: (params) => `₹${params.value}`, // Display cost with rupee symbol
    },
    { field: 'paymentId', headerName: 'Payment ID', width: 150 },
    {
      field: 'spEmail',
      headerName: 'SP Email',
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center">
          <WorkIcon style={{ color: 'purple', marginRight: 4 }} />
          {params.value}
        </div>
      ),
    },
    {
      field: 'uEmail',
      headerName: 'User Email',
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center">
          <PersonIcon style={{ color: 'blue', marginRight: 4 }} />
          {params.value}
        </div>
      ),
    },
    { field: 'serviceName', headerName: 'Service Name', width: 200 },
    { field: 'serviceCategory', headerName: 'Service Category', width: 250 },
    {
      field: 'address',
      headerName: 'Address',
      width: 300,
      renderCell: (params) => (
        <div className="flex items-center">
          <HomeIcon style={{ color: 'brown', marginRight: 4 }} />
          {params.value}
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: '100%' }} >
      
      <Typography variant="h4" gutterBottom>
        Invoice Balance
      </Typography>
      <DataGrid
        rows={invoiceData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#3f51b5',
            color: 'black',
            fontWeight: 'bold',
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
  );
}

export default InvoiceBalance;