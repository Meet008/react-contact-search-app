import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, TextField, IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const EditableDataGrid = ({ contacts, setContacts, loading }) => {
  const [editingRowId, setEditingRowId] = useState(null); // Track currently editing row
  const [editingRowData, setEditingRowData] = useState({}); // Track data for the editing row

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

  // Save changes to db.json
  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/contacts/${editingRowId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingRowData),
        }
      );

      if (response.ok) {
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === editingRowId
              ? { ...contact, ...editingRowData }
              : contact
          )
        );
        setEditingRowId(null); // Reset editing state after saving
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
      renderCell: (params) => (
        <IconButton
          onClick={handleSave}
          disabled={params.row.id !== editingRowId}
        >
          <SaveIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={contacts}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        loading={loading}
        getRowId={(row) => row.id}
        onRowSelection={(selection) => {
          if (selection.length > 0) {
            const selectedRow = contacts.find(
              (contact) => contact.id === selection[0]
            );
            handleRowSelection(selectedRow.id, selectedRow);
          }
        }}
      />
    </Box>
  );
};

export default EditableDataGrid;
