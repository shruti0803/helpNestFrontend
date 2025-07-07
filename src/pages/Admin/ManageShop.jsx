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
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
const [prescriptions, setPrescriptions] = useState([]);

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
const fetchPrescriptions = async () => {
  try {
  const res = await fetch('http://localhost:5000/api/admin/unverified-prescriptions', {
  credentials: 'include',
});


    const json = await res.json();
    console.log('Prescriptions response:', json);

    // CASE 1: If backend returns { prescriptions: [...] }
    if (Array.isArray(json.prescriptions)) {
      setPrescriptions(json.prescriptions);
    }
    // CASE 2: If backend directly returns an array
    else if (Array.isArray(json)) {
      setPrescriptions(json);
    } else {
      console.error('Unexpected format:', json);
      setPrescriptions([]);
    }
  } catch (err) {
    console.error('Error fetching prescriptions:', err);
    setPrescriptions([]);
  }
};


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
  const handleVerify = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/admin/verify-prescription/${id}`, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await res.json();
    console.log('✅ Verified:', data);

    // Refresh prescriptions list
    fetchPrescriptions();
  } catch (err) {
    console.error('❌ Error verifying prescription:', err);
  }
};

const handleAddStock = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/shop/${id}/stock`, {
      method: 'PUT',
    });
    const data = await res.json();
    console.log('Stock updated:', data);
    fetchMedicines(); // refresh table
  } catch (err) {
    console.error('Error updating stock:', err);
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
    {
  field: 'addStock',
  headerName: 'Add Stock',
  width: 120,
  renderCell: (params) => (
    <Button
      size="small"
      variant="contained"
      onClick={() => handleAddStock(params.row._id)}
      sx={{
        minWidth: 'unset',
        px: 2,
        backgroundColor: '#f5f5dc',
        color: 'black', // ✅ makes the '+' text black
        fontWeight: 'bold', // optional: makes it thicker
        '&:hover': {
          backgroundColor: '#e0dec0',
        },
      }}
    >
      +
    </Button>
  ),
}

,
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
        <div className=' flex gap-2'>
        <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>
          Add Medicine
        </Button>
       <Button variant="contained" color="primary" onClick={() => {
  fetchPrescriptions();
  setVerifyModalOpen(true);
}}>
  Verify Prescription
</Button>

        </div>
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
      <Dialog open={verifyModalOpen} onClose={() => setVerifyModalOpen(false)} maxWidth="md" fullWidth>
  <DialogTitle>Verify Prescriptions</DialogTitle>
  <DialogContent dividers>
    {prescriptions.length === 0 ? (
      <Typography>No unverified prescriptions.</Typography>
    ) : (
      prescriptions.map((p, index) => (
        <Box key={index} mb={3} borderBottom="1px solid #ccc" pb={2}>
         <Typography variant="subtitle1"><strong>Medicine:</strong> {p.medicine?.name || 'Unknown'}</Typography>
<Typography variant="subtitle1"><strong>User:</strong> {p.user?.name || 'Unknown'}</Typography>
<a href={p.fileUrl} target="_blank" rel="noreferrer">
  <Button variant="outlined" size="small">View Prescription</Button>
</a>

          <Box mt={1} display="flex" gap={2}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleVerify(p._id)}
            >
              Verify
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleReject(p._id)}
            >
              Reject
            </Button>
          </Box>
        </Box>
      ))
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setVerifyModalOpen(false)} color="secondary">Close</Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default ManageShop;