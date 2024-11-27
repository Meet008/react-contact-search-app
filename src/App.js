import React, { useState, useEffect } from "react";
import { Container, Box, Typography } from "@mui/material";
import ContactSearch from "./components/ContactSearch";
import EditableDataGrid from "./components/EditableDataGrid";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // Current page starts at 1
  const [pageSize] = useState(25); // Default page size
  const [totalCount, setTotalCount] = useState(0); // Total number of contacts

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // DataGrid uses 0-based indexing
  };

  useEffect(() => {
    fetchContacts({}, currentPage);
  }, [currentPage]);

  // Fetch contacts based on the search parameters
  const fetchContacts = async (query = {}, page = 1, pageSize = 25) => {
    setLoading(true);
    let url = "http://localhost:4000/contacts";
    const queryParams = new URLSearchParams();

    Object.keys(query).forEach((key) => {
      if (query[key]) {
        queryParams.append(`${key}_like`, query[key]);
      }
    });

    queryParams.append("_page", page); // Use `_page` for the current page
    queryParams.append("_limit", pageSize); // Use `_limit` for page size

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      const totalCount = response.headers.get("X-Total-Count"); // Extract total count from headers

      if (totalCount) {
        setTotalCount(Number(totalCount)); // Update the total count
      }
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when the search button is clicked
  const handleSearch = () => {
    setCurrentPage(1);
    fetchContacts(searchParams);
  };

  // Reset filters and fetch all contacts
  const handleResetFilter = () => {
    setSearchParams({});
    setCurrentPage(1); // Reset to first page
    fetchContacts(); // Fetch all contacts
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contact-Search App
        </Typography>
        <ContactSearch
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          onSearch={handleSearch}
          onResetFilter={handleResetFilter} // Pass reset handler here
        />
        <EditableDataGrid
          contacts={contacts}
          setContacts={setContacts}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
        />
      </Box>
    </Container>
  );
};

export default App;
