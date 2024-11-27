import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactSearch from "..//ContactSearch";

describe("ContactSearch Component", () => {
  let mockOnSearch, mockSetSearchParams, searchParams;

  beforeEach(() => {
    mockOnSearch = jest.fn();
    mockSetSearchParams = jest.fn();
    searchParams = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    };
  });

  test("renders all input fields and buttons", () => {
    render(
      <ContactSearch
        searchParams={searchParams}
        setSearchParams={mockSetSearchParams}
        onSearch={mockOnSearch}
        isLoading={false}
      />
    );

    expect(screen.getByLabelText(/FIRST NAME/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/LAST NAME/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/EMAIL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PHONE/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /More Filters/i })
    ).toBeInTheDocument();
  });

  test("validates email format with invalid email 'wewew'", () => {
    jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock alert

    const mockOnSearch = jest.fn();
    const mockSetSearchParams = jest.fn();
    const searchParams = { email: "wewew" }; // Invalid email

    render(
      <ContactSearch
        searchParams={searchParams}
        setSearchParams={mockSetSearchParams}
        onSearch={mockOnSearch}
        isLoading={false}
      />
    );

    // Simulate clicking the "Search" button
    fireEvent.click(screen.getByRole("button", { name: /Search/i }));

    // Validate that alert is triggered with the correct message
    expect(window.alert).toHaveBeenCalledWith("Invalid email address!");

    // Ensure the search function was NOT called
    expect(mockOnSearch).not.toHaveBeenCalled();

    window.alert.mockRestore(); // Restore original implementation
  });

  test("validates phone number format with invalid phone number '123'", () => {
    jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock alert

    const mockOnSearch = jest.fn();
    const mockSetSearchParams = jest.fn();
    const searchParams = { phone: "123" }; // Invalid phone number

    render(
      <ContactSearch
        searchParams={searchParams}
        setSearchParams={mockSetSearchParams}
        onSearch={mockOnSearch}
        isLoading={false}
      />
    );

    // Simulate clicking the "Search" button
    fireEvent.click(screen.getByRole("button", { name: /Search/i }));

    // Validate that alert is triggered with the correct message
    expect(window.alert).toHaveBeenCalledWith("Invalid phone number!");

    // Ensure the search function was NOT called
    expect(mockOnSearch).not.toHaveBeenCalled();

    window.alert.mockRestore(); // Restore original implementation
  });

  test("validates date format with invalid date '29-02-2024'", () => {
    jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock alert

    const mockOnSearch = jest.fn();
    const mockSetSearchParams = jest.fn();
    const searchParams = { dob: "29-02-2024" }; // Invalid date format

    render(
      <ContactSearch
        searchParams={searchParams}
        setSearchParams={mockSetSearchParams}
        onSearch={mockOnSearch}
        isLoading={false}
      />
    );

    // Simulate clicking the "Search" button
    fireEvent.click(screen.getByRole("button", { name: /Search/i }));

    // Validate that alert is triggered with the correct message
    expect(window.alert).toHaveBeenCalledWith(
      "Invalid birthdate format! Use YYYY-MM-DD."
    );

    // Ensure the search function was NOT called
    expect(mockOnSearch).not.toHaveBeenCalled();

    window.alert.mockRestore(); // Restore original implementation
  });

  test("triggers search with valid inputs", () => {
    render(
      <ContactSearch
        searchParams={{ ...searchParams, email: "Ashleigh64@yahoo.com" }}
        setSearchParams={mockSetSearchParams}
        onSearch={mockOnSearch}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Search/i }));

    expect(mockOnSearch).toHaveBeenCalled();
  });

  test("resets search parameters", () => {
    render(
      <ContactSearch
        searchParams={{ ...searchParams, firstName: "Veronica" }}
        setSearchParams={mockSetSearchParams}
        onSearch={mockOnSearch}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Reset/i }));

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    });
    expect(mockOnSearch).toHaveBeenCalled();
  });
});
