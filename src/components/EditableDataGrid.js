import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const EditableDataGrid = ({
  contacts,
  setContacts,
  loading,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
}) => {
  const [editingRowId, setEditingRowId] = useState(null); // Track currently editing row
  const [editingRowData, setEditingRowData] = useState({}); // Track data for the editing row

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowToSave, setRowToSave] = useState(null);

  // Handle row selection
  const handleRowSelection = (rowId, rowData) => {
    if (editingRowId === rowId) {
      // If the same row is clicked, deselect it
      setEditingRowId(null);
      setEditingRowData({});
    } else {
      setEditingRowId(rowId);
      setEditingRowData({ ...rowData });
    }
  };

  // Handle inline edit changes
  const handleEditChange = (e, field) => {
    const { value } = e.target;
    setEditingRowData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const confirmSave = () => {
    setIsDialogOpen(false);
    if (rowToSave) {
      performSave(rowToSave);
      setRowToSave(null);
    }
  };

  const cancelSave = () => {
    setIsDialogOpen(false);
    setEditingRowId(null);
    setEditingRowData({});
  };

  const handleSaveClick = () => {
    setRowToSave(editingRowData);
    setIsDialogOpen(true);
  };

  const performSave = async (rowData) => {
    try {
      const response = await fetch(
        `http://localhost:4000/contacts/${editingRowId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rowData),
        }
      );

      if (response.ok) {
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === editingRowId ? { ...contact, ...rowData } : contact
          )
        );
        setEditingRowId(null);
        setEditingRowData({});
      } else {
        console.error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const columns = [
    {
      field: "checkbox",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={params.row.id === editingRowId}
          onChange={() => handleRowSelection(params.row.id, params.row)}
        />
      ),
    },
    {
      field: "firstName",
      headerName: "First Name",
      width: 150,
      renderCell: (params) =>
        params.row.id === editingRowId ? (
          <TextField
            value={editingRowData.firstName}
            onChange={(e) => handleEditChange(e, "firstName")}
            fullWidth
          />
        ) : (
          params.row.firstName
        ),
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 150,
      renderCell: (params) =>
        params.row.id === editingRowId ? (
          <TextField
            value={editingRowData.lastName}
            onChange={(e) => handleEditChange(e, "lastName")}
            fullWidth
          />
        ) : (
          params.row.lastName
        ),
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      width: 150,
      renderCell: (params) =>
        params.row.id === editingRowId ? (
          <TextField
            value={editingRowData.dob}
            onChange={(e) => handleEditChange(e, "dob")}
            fullWidth
          />
        ) : (
          params.row.dob
        ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      renderCell: (params) =>
        params.row.id === editingRowId ? (
          <TextField
            value={editingRowData.email}
            onChange={(e) => handleEditChange(e, "email")}
            fullWidth
          />
        ) : (
          params.row.email
        ),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      sortable: false, // disable sorting by phone
      renderCell: (params) =>
        params.row.id === editingRowId ? (
          <TextField
            value={editingRowData.phone}
            onChange={(e) => handleEditChange(e, "phone")}
            fullWidth
          />
        ) : (
          params.row.phone
        ),
    },
    {
      field: "address",
      headerName: "Address",
      width: 200,
      sortable: false, // disable sorting by address
      renderCell: (params) =>
        params.row.id === editingRowId ? (
          <TextField
            value={editingRowData.address}
            onChange={(e) => handleEditChange(e, "address")}
            fullWidth
          />
        ) : (
          params.row.address
        ),
    },
    {
      field: "city",
      headerName: "City",
      width: 150,
      renderCell: (params) =>
        params.row.id === editingRowId ? (
          <TextField
            value={editingRowData.city}
            onChange={(e) => handleEditChange(e, "city")}
            fullWidth
          />
        ) : (
          params.row.city
        ),
    },
    {
      field: "state",
      headerName: "State",
      width: 150,
      renderCell: (params) =>
        params.row.id === editingRowId ? (
          <TextField
            value={editingRowData.state}
            onChange={(e) => handleEditChange(e, "state")}
            fullWidth
          />
        ) : (
          params.row.state
        ),
    },
    {
      field: "zipCode",
      headerName: "Zip Code",
      width: 100,
      sortable: false, // disable sorting by zip code
      renderCell: (params) =>
        params.row.id === editingRowId ? (
          <TextField
            value={editingRowData.zipCode}
            onChange={(e) => handleEditChange(e, "zipCode")}
            fullWidth
          />
        ) : (
          params.row.zipCode
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={handleSaveClick}
          disabled={params.row.id !== editingRowId}
        >
          <SaveIcon />
        </IconButton>
      ),
    },
  ];

  // Controlled pagination model state
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: currentPage - 1, // Convert 1-based to 0-based
  });

  useEffect(() => {
    setPaginationModel((prev) => ({
      ...prev,
      page: currentPage - 1, // Update the model when currentPage changes
    }));
  }, [currentPage]);

  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
    const newPage = newModel.page + 1; // Convert 0-based to 1-based
    if (onPageChange) {
      onPageChange(newPage); // Only call onPageChange if it's provided
    }
  };

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={contacts}
        columns={columns}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[]}
        rowCount={totalCount} // Total number of rows (for server-side pagination)
        loading={loading} // Show loading spinner when data is being fetched
        components={{
          Toolbar: null, // This removes the toolbar
        }}
      />
      <Dialog open={isDialogOpen} onClose={cancelSave}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to save the changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelSave} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmSave} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditableDataGrid;
