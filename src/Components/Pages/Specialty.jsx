// @ts-nocheck
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";

const fields = [
  { id: "name", label: "Name" },
  { id: "numberOfPlaces", label: "Number of Places" },
];

export default function Specialty() {
  //! -----------------------------------------------> Declaration <------------------------
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [specialty, setSpecialty] = useState({
    nbrSpecialty: "",
    name: "",
    numberOfPlaces: "",
  });
  const [specialties, setSpecialties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(null); // For update tracking
  // Validation helper functions
  const isValidName = (value) => /^[A-Za-z]+$/.test(value); // Only letters
  const isValidNumberOfPlaces = (num) => /^\d+$/.test(num) && parseInt(num) > 0; // Must be a positive integer

  // Additional state for alert messages
  const [alertMessage, setAlertMessage] = useState("");

  //! -----------------------------------------------> Functions <------------------------

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    const response = await fetch("http://localhost:9090/specialities/all");
    const data = await response.json();
    setSpecialties(data);
  };

  //? ===========> Add Specialty <=============

  const addSpecialty = async () => {
    // Validation checks
    if (!isValidName(specialty.name)) {
      setAlertMessage("Please provide a valid name.");
      setError(true);
      return;
    }
    if (!isValidNumberOfPlaces(specialty.numberOfPlaces)) {
      setAlertMessage("Number of Places must be a positive integer.");
      setError(true);
      return;
    }
    const duplicate = specialties.some(
      (s) => s.nbrSpecialty === specialty.nbrSpecialty
    );
    if (duplicate) {
      setAlertMessage("A specialty with this ID already exists.");
      setError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:9090/specialities/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(specialty),
      });

      if (response.ok) {
        setSuccess(true);
        fetchSpecialties();
        setSpecialty({ nbrSpecialty: "", name: "", numberOfPlaces: "" });
      } else {
        setAlertMessage("Failed to add specialty.");
        setError(true);
      }
    } catch (error) {
      console.error("Error adding specialty:", error);
      setAlertMessage("An error occurred while adding the specialty.");
      setError(true);
    }
  };

  //? ===========> Update Specialty <=============

  const updateSpecialty = async () => {
    if (!selectedSpecialty) {
      setAlertMessage("Please select a specialty from the table to update.");
      setError(true);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:9090/specialities/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(specialty),
        }
      );

      if (response.ok) {
        setSuccess(true);
        fetchSpecialties();
        setSpecialty({ nbrSpecialty: "", name: "", numberOfPlaces: "" });
        setSelectedSpecialty(null); // Clear selected specialty
      } else {
        setAlertMessage("Failed to update specialty.");
        setError(true);
      }
    } catch (error) {
      console.error("Error updating specialty:", error);
      setAlertMessage("An error occurred while updating the specialty.");
      setError(true);
    }
  };

  //? ===========> Delete Specialty <=============

  const deleteSpecialty = async () => {
    if (!selectedSpecialty) {
      setAlertMessage("Please select a specialty from the table to delete.");
      setError(true);
      return;
    }
    const userConfirmed = window.confirm(
      `Are you sure you want to delete the Specialty: ${selectedSpecialty.name} ?`
    );

    if (!userConfirmed) {
      return; // Exit the function if the user cancels
    }

    try {
      const response = await fetch(
        `http://localhost:9090/specialities/delete/${selectedSpecialty.nbrSpecialty}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setSuccess(true);
        fetchSpecialties();
        setSpecialty({ nbrSpecialty: "", name: "", numberOfPlaces: "" });
        setSelectedSpecialty(null);
      } else {
        setAlertMessage("Failed to delete specialty.");
        setError(true);
      }
    } catch (error) {
      console.error("Error deleting specialty:", error);
      setAlertMessage("An error occurred while deleting the specialty.");
      setError(true);
    }
  };
  //? ===========> Filter Specialty <=============

  const filteredSpecialties = specialties.filter(
    (specialty) =>
      specialty.name
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase() || "") ||
      specialty.nbrSpecialty?.toString().includes(searchQuery || "")
  );

  const columns = [
    {
      field: "nbrSpecialty",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "numberOfPlaces",
      headerName: "Number of Places",
      flex: 1,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      align: "center",
    },
  ];

  //? ===========> Handle Row Click <=============

  const handleRowClick = (row) => {
    setSelectedSpecialty(row);
    setSpecialty({
      nbrSpecialty: row.nbrSpecialty,
      name: row.name,
      numberOfPlaces: row.numberOfPlaces,
    });
  };

  return (
    <>
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          mx: 9,
          display: "flex",
          fontSize: "2.5rem",
          fontWeight: "800",
          color: "#2c3e50",
          padding: "20px 0",
          borderBottom: "3px solid #ffa500",
          marginBottom: "30px",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-3px",
            left: 0,
            width: "60px",
            height: "3px",
          },
          "&:hover": {
            color: "#ffa500",
            transition: "color 0.3s ease-in-out",
          },
        }}
      >
        Manage Specialties
      </Typography>
      <Box sx={{ mx: 4, my: 2, display: "flex", alignItems: "center" }}>
        <TextField
          label="Search by ID or Name"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Box
        sx={{
          height: 300,
          width: "100%",
          "& .super-app-theme--header": {
            backgroundColor: "#ffa500",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            "& .MuiDataGrid-columnSeparator": {
              color: "#fff",
            },
            "& .MuiDataGrid-menuIcon": {
              color: "#fff",
            },
            "& .MuiDataGrid-sortIcon": {
              color: "#fff",
            },
          },
        }}
      >
        <DataGrid
          rows={filteredSpecialties}
          columns={columns}
          getRowId={(row) => row.nbrSpecialty}
          pageSize={4}
          onRowClick={({ row }) => handleRowClick(row)}
          sx={{
            height: 290,
            width: "100%",
            mx: "auto",
            border: "2px solid #ddd",
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "#fff8e1",
                cursor: "pointer",
              },
              "&.Mui-selected": {
                backgroundColor: "#fff3e0",
                "&:hover": {
                  backgroundColor: "#ffe0b2",
                },
              },
            },
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
          }}
        />
      </Box>

      <Box component="form">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {fields.map((field) => (
            <TextField
              key={field.id}
              sx={{ mx: 4, my: 2 }}
              id={`outlined-${field.id}`}
              label={field.label}
              variant="outlined"
              value={specialty[field.id]}
              onChange={(event) =>
                setSpecialty({
                  ...specialty,
                  [field.id]: event.target.value,
                })
              }
              error={
                field.id === "name"
                  ? Boolean(
                      specialty[field.id] && !isValidName(specialty[field.id])
                    ) // Ensure boolean
                  : field.id === "numberOfPlaces"
                  ? Boolean(
                      specialty[field.id] &&
                        !isValidNumberOfPlaces(specialty[field.id])
                    ) // Ensure boolean
                  : false
              }
              helperText={
                field.id === "name"
                  ? specialty[field.id] && !isValidName(specialty[field.id])
                    ? "Name must only contain letters."
                    : ""
                  : field.id === "numberOfPlaces"
                  ? specialty[field.id] &&
                    !isValidNumberOfPlaces(specialty[field.id])
                    ? "Number of places must be a valid number."
                    : ""
                  : ""
              }
            />
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <Button
            sx={{ display: "block", ml: 1 }}
            variant="contained"
            color="success"
            size="large"
            onClick={addSpecialty}
          >
            Add
          </Button>
          <Button
            sx={{ display: "block", ml: 1 }}
            variant="contained"
            color="primary"
            size="large"
            onClick={updateSpecialty}
          >
            Update
          </Button>
          <Button
            sx={{ display: "block", ml: 1 }}
            variant="contained"
            color="error"
            size="large"
            onClick={deleteSpecialty}
          >
            Delete
          </Button>

          {/* Error Snackbar */}
          <Snackbar
            open={error}
            autoHideDuration={3000}
            onClose={() => setError(false)}
          >
            <Alert severity="error" onClose={() => setError(false)}>
              There was an error!
            </Alert>
          </Snackbar>

          {/* Success Snackbar */}
          <Snackbar
            open={success}
            autoHideDuration={3000}
            onClose={() => setSuccess(false)}
          >
            <Alert severity="success" onClose={() => setSuccess(false)}>
              Action successful!
            </Alert>
          </Snackbar>
          <Snackbar
            open={error}
            autoHideDuration={3000}
            onClose={() => setError(false)}
          >
            <Alert severity="error" onClose={() => setError(false)}>
              {alertMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
}
