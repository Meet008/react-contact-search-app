import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ContactSearch = ({
  searchParams,
  setSearchParams,
  onSearch,
  onResetFilter,
  isLoading,
}) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Handle input change and update search parameters
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Validation functions for email, phone, and date
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone); // Basic phone number validation
  const validateDate = (dob) => /^\d{4}-\d{2}-\d{2}$/.test(dob); // Date format YYYY-MM-DD

  const handleSearch = () => {
    if (searchParams.email && !validateEmail(searchParams.email)) {
      alert("Invalid email address!");
      return;
    }

    if (searchParams.phone && !validatePhone(searchParams.phone)) {
      alert("Invalid phone number!");
      return;
    }

    if (searchParams.dob && !validateDate(searchParams.dob)) {
      alert("Invalid birthdate format! Use YYYY-MM-DD.");
      return;
    }

    onSearch(); // Trigger search only if validation passes
  };

  // Reset search parameters
  const handleResetSearch = () => {
    setIsResetting(true);
    setSearchParams({
      firstName: "",
      lastName: "",
      dob: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    });
  };

  // Trigger search after reset
  useEffect(() => {
    if (isResetting) {
      onSearch(); // Trigger the search after reset
      setIsResetting(false);
    }
  }, [isResetting, onSearch]);

  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: 3,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Grid container spacing={3}>
        {/* Title */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Search Contacts
          </Typography>
        </Grid>

        {/* Search fields */}
        {["firstName", "lastName", "email", "phone"].map((field, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <TextField
              label={field.replace(/([A-Z])/g, " $1").toUpperCase()}
              name={field}
              value={searchParams[field] || ""}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ marginBottom: 2 }}
              placeholder={field === "dob" ? "YYYY-MM-DD" : ""}
            />
          </Grid>
        ))}

        {/* More Filters */}
        {showMoreFilters && (
          <>
            {["dob", "address", "city", "state", "zipCode"].map(
              (field, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <TextField
                    label={field.replace(/([A-Z])/g, " $1").toUpperCase()}
                    name={field}
                    value={searchParams[field] || ""}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ marginBottom: 2 }}
                    placeholder={field === "dob" ? "YYYY-MM-DD" : ""}
                  />
                </Grid>
              )
            )}
          </>
        )}
      </Grid>
      {/* Action Buttons */}
      <Grid
        item
        xs={12}
        sm={6}
        md={3}
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ height: "50px", padding: "16px" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Search"
          )}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          sx={{ height: "50px", padding: "16px" }}
          endIcon={showMoreFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {!showMoreFilters ? "More Filters" : "Less Filters"}
        </Button>

        {(Object.values(searchParams).some((val) => val !== "") ||
          isLoading) && (
          <IconButton
            color="error"
            onClick={handleResetSearch}
            sx={{ fontSize: "1.5rem", padding: "6px" }}
            aria-label="reset"
            disabled={isLoading}
          >
            <RefreshIcon />
          </IconButton>
        )}
      </Grid>
    </Box>
  );
};

export default ContactSearch;
