import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const categories = ["Tablet", "Syrup", "Injection", "Ointment", "Drops", "Others"];

const ManageShop = () => {
  const [medicines, setMedicines] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    category: 'Tablet',
    prescriptionRequired: false,
  });

  const fetchMedicines = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/shop');
      const data = await res.json();
      const formatted = data.map((med, i) => ({
        ...med,
        id: med._id,
        serial: i + 1,
      }));
      setMedicines(formatted);
    } catch (err) {
      console.error('Error fetching medicines:', err);
    }
  };

  const handleAddMedicine = async () => {
    try {
      await fetch('http://localhost:5000/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setOpenAddDialog(false);
      setForm({
        name: '', brand: '', description: '', price: '', stock: '', imageUrl: '', category: 'Tablet', prescriptionRequired: false
      });
      fetchMedicines();
    } catch (err) {
      console.error('Error adding medicine:', err);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const columns = [
    { field: 'serial', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'brand', headerName: 'Brand', flex: 1 },
    { field: 'price', headerName: 'Price (₹)', width: 100 },
    { field: 'stock', headerName: 'Stock', width: 100 },
    { field: 'category', headerName: 'Category', width: 120 },
    {
      field: 'prescriptionRequired',
      headerName: 'Prescription',
      width: 140,
      renderCell: (params) => (
        params.value ? <Chip label="Required" color="error" /> : <Chip label="No" color="success" />
      ),
    },
    {
      field: 'imageUrl',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <img src={params.value} alt="med" className="h-10 w-10 rounded" />
      ),
    },
  ];

  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
          Manage Medicines
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>
          Add Medicine
        </Button>
      </Box>

      <Paper elevation={3} sx={{ padding: 2 }}>
        <DataGrid
          rows={medicines}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          autoHeight
          disableSelectionOnClick
          getRowId={(row) => row._id}
          sx={{
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#ede7f6', fontWeight: 'bold' },
            '& .MuiDataGrid-cell': { textAlign: 'center' },
          }}
        />
      </Paper>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Medicine</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
          <TextField label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} fullWidth />
          <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={2} />
          <TextField label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} fullWidth />
          <TextField label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} fullWidth />
          <TextField label="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} fullWidth />
          <TextField
            select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            fullWidth
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Prescription Required"
            value={form.prescriptionRequired}
            onChange={(e) => setForm({ ...form, prescriptionRequired: e.target.value === 'true' })}
            fullWidth
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddMedicine} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageShop;