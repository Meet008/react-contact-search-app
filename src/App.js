import React, { useState, useEffect } from "react";
import { Container, Box, Typography } from "@mui/material";
import ContactSearch from "./components/ContactSearch";
import EditableDataGrid from "./components/EditableDataGrid";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch contacts based on the search parameters
  const fetchContacts = async (query = {}, page = 1, pageSize = 10) => {
    setLoading(true);
    let url = "http://localhost:4000/contacts";
    const queryParams = new URLSearchParams();

    Object.keys(query).forEach((key) => {
      if (query[key]) {
        queryParams.append(key, query[key]);
      }
    });

    url += `?page=${page}&pageSize=${pageSize}`;

    if (queryParams.toString()) {
      url += `&${queryParams.toString()}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when the search button is clicked
  const handleSearch = () => {
    fetchContacts(searchParams);
  };

  // Reset filters and fetch all contacts
  const handleResetFilter = () => {
    setSearchParams({});
    fetchContacts(); // Fetch all contacts again
  };

  useEffect(() => {
    fetchContacts(); // Initially load all contacts when the component mounts
  }, []);

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
        />
      </Box>
    </Container>
  );
};

export default App;
