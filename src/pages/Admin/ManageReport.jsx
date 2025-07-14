import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


function ManageReport() {
  const [reportData, setReportData] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
const [noteText, setNoteText] = useState('');
const [actionType, setActionType] = useState(null); // 'resolved' or 'rejected'
const openNoteDialog = (reportId, action) => {
  setSelectedReportId(reportId);
  setActionType(action); // 'resolved' or 'rejected'
  setNoteText('');
  setNoteDialogOpen(true);
};
const handleNoteConfirm = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/admin/updateReportStatus/${selectedReportId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: actionType, adminNote: noteText }),
    });

    if (!res.ok) throw new Error('Failed to update report');

    const updatedReport = await res.json();
    setReportData((prev) =>
      prev.map((r) =>
        r.id === selectedReportId ? { ...r, status: actionType } : r
      )
    );
  } catch (error) {
    console.error('Error updating report:', error);
  } finally {
    setNoteDialogOpen(false);
  }
};

const handleResolve = async (reportId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/admin/updateReportStatus/${reportId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'resolved' }),
    });

    if (!res.ok) throw new Error('Failed to resolve');

    const updatedReport = await res.json();
    setReportData((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
  } catch (error) {
    console.error('Error resolving report:', error);
  }
};

const handleReject = async (reportId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/admin/updateReportStatus/${reportId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'rejected' }),
    });

    if (!res.ok) throw new Error('Failed to reject');

    const updatedReport = await res.json();
    setReportData((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'rejected' } : r))
    );
  } catch (error) {
    console.error('Error rejecting report:', error);
  }
};

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/getReports')
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((report, index) => ({
          id: report._id,
          serial: index + 1,
          bookingId: report.booking?._id || 'N/A',
          bookingStatus: report.booking?.status || 'N/A',
          reporterName: report.reporter?.name || 'N/A',
          reporterEmail: report.reporter?.email || 'N/A',
          helperName: report.reportedHelper?.name || 'N/A',
          helperPhone: report.reportedHelper?.phone || 'N/A',
          reason: report.reason,
          details: report.details || '—',
          status: report.status,
          createdAt: new Date(report.createdAt).toLocaleDateString(),
        }));
        setReportData(formatted);
      })
      .catch((err) => {
        console.error('Failed to fetch reports:', err);
      });
  }, []);

  const handleDelete = (id) => {
    console.log('Delete clicked for:', id);
    // Call DELETE API if needed
  };

  const columns = [
    { field: 'serial', headerName: 'ID', width: 80, headerAlign: 'center', align: 'center' },
    { field: 'reporterName', headerName: 'User Name', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'reporterEmail', headerName: 'User Email', flex: 1.5, headerAlign: 'center', align: 'center' },
    { field: 'helperName', headerName: 'Helper Name', flex: 1.2, headerAlign: 'center', align: 'center' },
    { field: 'helperPhone', headerName: 'Helper Phone', flex: 1.2, headerAlign: 'center', align: 'center' },
    { field: 'reason', headerName: 'Reason', flex: 1.5, headerAlign: 'center', align: 'center' },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const color = params.value === 'pending' ? 'warning' : params.value === 'resolved' ? 'success' : 'error';
        return <Chip label={params.value} color={color} size="small" />;
      },
    },
    { field: 'createdAt', headerName: 'Reported On', flex: 1.2, headerAlign: 'center', align: 'center' },
    {
  field: 'actions',
  headerName: 'Actions',
  flex: 1,
  renderCell: (params) => (
    <div className="flex justify-around w-full">
      <IconButton
  style={{ color: 'green' }}
  onClick={() => openNoteDialog(params.row.id, 'resolved')}
  disabled={params.row.status !== 'pending'}
  title="Mark as Resolved"
>
  <CheckCircleIcon />
</IconButton>
<IconButton
  style={{ color: 'red' }}
  onClick={() => openNoteDialog(params.row.id, 'rejected')}
  disabled={params.row.status !== 'pending'}
  title="Reject Report"
>
  <DeleteIcon />
</IconButton>

    </div>
  ),
},

  ];

  return (
    <Box className="w-full px-4 py-4">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#880e4f' }}>
        Manage Reports
      </Typography>

      <Paper elevation={3} sx={{ overflowX: 'auto', padding: 2 }}>
        <div style={{ minWidth: 1200 }}>
          <DataGrid
            rows={reportData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20]}
            disableSelectionOnClick
            getRowId={(row) => row.id}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#fce4ec',
                color: '#000',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell:hover': {
                backgroundColor: '#f3e5f5',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: '#ead7edff',
              },
            }}
          />
        </div>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Report Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Full details of the selected report can go here (you can show more data or expand with additional fields).
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} >
  <DialogTitle>{`Add Admin Note for ${actionType === 'resolved' ? 'Resolve' : 'Reject'}`}</DialogTitle>
  <DialogContent>
    <DialogContentText>Please provide a brief note:</DialogContentText>
    <textarea
      rows={4}
      value={noteText}
      onChange={(e) => setNoteText(e.target.value)}
      style={{ width: '100%', marginTop: 10, padding: 8 }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setNoteDialogOpen(false)} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleNoteConfirm} disabled={!noteText.trim()} color="primary">
      Submit
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}

export default ManageReport;
