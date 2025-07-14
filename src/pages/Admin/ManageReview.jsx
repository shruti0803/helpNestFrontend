import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Paper, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

function ManageReview() {
  const [reviewsData, setReviewsData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/allReviews')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((review, index) => ({
          id: review._id,
          serial: index + 1,
          service: review.service,
          rating: review.rating,
          comment: review.comment,
          reviewerName: review.reviewer?.name || 'N/A',
          helperName: review.helper?.name || 'N/A',
          createdAt: new Date(review.createdAt).toLocaleDateString(),
        }));
        setReviewsData(formatted);
      })
      .catch(err => console.error('Failed to fetch reviews:', err));
  }, []);

  const handleDelete = (id) => {
    console.log('Delete review with ID:', id);
    // You can connect DELETE API here
  };

  const columns = [
    { field: 'serial', headerName: 'ID', width: 80, headerAlign: 'center', align: 'center' },
    { field: 'reviewerName', headerName: 'Reviewer', flex: 1.2, headerAlign: 'center', align: 'center' },
    { field: 'helperName', headerName: 'Helper', flex: 1.2, headerAlign: 'center', align: 'center' },
    { field: 'service', headerName: 'Service', flex: 1.4, headerAlign: 'center', align: 'center' },
    {
      field: 'rating',
      headerName: 'Rating',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={`${params.row.rating} ★`}
          color={params.row.rating >= 4 ? 'success' : params.row.rating >= 2 ? 'warning' : 'error'}
          size="small"
        />
      )
    },
    {
      field: 'comment',
      headerName: 'Comment',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
    },
    { field: 'createdAt', headerName: 'Date', flex: 1.2, headerAlign: 'center', align: 'center' },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className="flex gap-2">
          <IconButton style={{ color: 'blue' }}>
            <VisibilityIcon />
          </IconButton>
          <IconButton style={{ color: 'red' }} onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Box className="w-full px-4 py-4">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#4a148c' }}>
        Manage Reviews
      </Typography>

      <Paper elevation={3} sx={{ overflowX: 'auto', padding: 2 }}>
        <div style={{ minWidth: 1200 }}>
          <DataGrid
            rows={reviewsData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20]}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#e0e0e0',
                fontWeight: 'bold',
                fontSize: '15px',
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
    </Box>
  );
}

export default ManageReview;
