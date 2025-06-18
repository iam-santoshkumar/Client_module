import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Box,
  Input,
  Spinner,
  Text,
  Flex,
  IconButton,
  Select,
  Button,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useHistory } from "react-router-dom";

const customStyles = {
  tableWrapper: {
    style: {
      width: "100%",
      overflowX: "hidden", 
      border: "2px solid gray", 
    },
  },
  table: {
    style: {
      width: "100%",
      tableLayout: "fixed", // Fixed layout to keep columns within the container width
    },
  },
  headCells: {
    style: {
      fontSize: "16px",
      fontWeight: "bold",
      backgroundColor: "#f2f2f2",
      color: "#333",
      textAlign: "center",
      padding: "6px 8px",
      borderRight: "1px solid #ddd",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100px", // Fixed width for each header cell to avoid overflow
    },
  },
  cells: {
    style: {
      fontSize: "14px",
      textAlign: "center",
      padding: "6px 8px",
      borderRight: "1px solid #ddd",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      maxWidth: "100px", // Set a max width for cells to prevent overflow
    },
  },
  rows: {
    style: {
      minHeight: "40px",
      "&:nth-of-type(odd)": {
        backgroundColor: "#f9f9f9",
      },
      "&:hover": {
        backgroundColor: "#e8e8e8",
      },
    },
  },
};

const UpdatedInfoTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const role = sessionStorage.getItem("role");
  const history = useHistory();

  const goToAdminDashboard = () => {
    history.replace("/admin-dashboard"); // Relative path
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/get-UpdateInfo`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data from server.");
        }
        return response.json();
      })
      .then((data) => {
        // Sort data by 'updated_at' in descending order
        const sortedData = data.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setData(sortedData);
        setFilteredData(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);
  

  useEffect(() => {
    const filtered = data.filter((item) => {
      // Check 'addedBy', 'updatedBy', and 'company.nameOfCompany'
      const searchFields = [
        item.addedBy,
        item.updatedBy,
        item.company?.nameOfCompany, // Ensure to check if 'company' exists
      ];
      return searchFields.some((field) =>
        field
          ? field.toString().toLowerCase().includes(search.toLowerCase())
          : false
      );
    });
    setFilteredData(filtered);
  }, [search, data]);

  if (loading) {
    return (
      <Box textAlign="center" my={6}>
        <Spinner size="xl" />
        <Text mt={4}>Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" my={6}>
        <Text color="red.500">Error: {error}</Text>
      </Box>
    );
  }
  const formatName = (name) => (name ? name.replace(/_/g, " ") : "--");
  const columns = [
    {
      name: "Sr. No",
      cell: (row, index) =>
        (currentPage - 1) * rowsPerPage + index + 1,
      width: "80px",
    },
    {
      name: "Added By",
      selector: (row) => formatName(row.addedBy),
      sortable: true,
    },
    {
      name: "Updated By",
      selector: (row) => formatName(row.updatedBy),
      sortable: true,
    },
    {
      name: "Company Name",
      selector: (row) => row.company?.nameOfCompany || "N/A",
      sortable: true,
      width:"600px"
    },
    {
      name: "Updated At",
      selector: (row) => new Date(row.updated_at).toLocaleString(),
      sortable: true,
    },
  ];

  // Calculate the total pages for the custom pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handlePageChange = (event) => {
    const page = Number(event.target.value);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Box m={4} mb={20}>
      <Flex justify="space-between" align="center" mb={4}>
        {/* <Text fontSize="xl">Applications Table</Text> */}
        <Input
          placeholder="Search..."
          mb={2}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="500px"
          borderColor="green"
          borderWidth="2px"
        />

        <Flex align="center" gap={2}>
          <IconButton
            aria-label="Previous Page"
            icon={<FaChevronLeft />}
            onClick={handlePrevPage}
            isDisabled={currentPage === 1}
            colorScheme="blue"
          />
          <Input
            mt={5}
            value={currentPage}
            onChange={handlePageChange}
            width="60px"
            textAlign="center"
            type="number"
            min={1}
            max={totalPages}
          />
          <Text>of {totalPages}</Text>
          <IconButton
            aria-label="Next Page"
            icon={<FaChevronRight />}
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages}
            colorScheme="blue"
          />
          <Text fontWeight="bold">Rows per page :</Text>
          <Select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to the first page when changing rows per page
            }}
            width="80px"
          >
            {[25, 50, 75, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Flex>
        <Button colorScheme="green" onClick={goToAdminDashboard}>
          Go to Dashboard
        </Button>
      </Flex>
      <DataTable
        columns={columns}
        data={filteredData.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        )}
        highlightOnHover
        pointerOnHover
        defaultSortFieldId={1}
        responsive
        customStyles={customStyles}
      />
    </Box>
  );
};

export default UpdatedInfoTable;
