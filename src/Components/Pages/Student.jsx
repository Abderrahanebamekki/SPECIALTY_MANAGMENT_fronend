/* eslint-disable no-unused-vars */
// @ts-nocheck

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
// import { GridRowsProp, GridColDef } from "@mui/x-data-grid";
const fields = [
  { id: "fname", label: "First Name" },
  { id: "lname", label: "Last Name" },
  { id: "moyS1", label: "Moy S1" },
  { id: "moyS2", label: "Moy S2" },
  { id: "moyS3", label: "Moy S3" },
  { id: "moyS4", label: "Moy S4" },
];
export default function Student() {
  //! -----------------------------------------------> Declaration  <------------------------
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [student, setStudent] = useState({
    nbrStudent: "",
    fname: "",
    lname: "",
    moyS1: "",
    moyS2: "",
    moyS3: "",
    moyS4: "",
  });
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null); // To track selected student for update
  const isValidName = (value) => /^[A-Za-z]+$/.test(value); // Only letters
  const isValidScore = (value) =>
    !isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 20;
  const [alertMessage, setAlertMessage] = useState("");

  //! -----------------------------------------------> Functions <------------------------

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const response = await fetch("http://localhost:9090/student/with-choices");
    const data = await response.json();
    setStudents(
      data.map((student) => ({
        ...student,
        MoyGeneral:
          (student.moyS1 + student.moyS2 + student.moyS3 + student.moyS4) / 4,
      }))
    );
  };

  //? ===========> Add Student <=============

  const addStudent = async () => {
    // Check if fields are valid
    if (
      !isValidName(student.fname) ||
      !isValidName(student.lname) ||
      !isValidScore(student.moyS1) ||
      !isValidScore(student.moyS2) ||
      !isValidScore(student.moyS3) ||
      !isValidScore(student.moyS4)
    ) {
      setAlertMessage("Please fill all fields with valid data.");
      setError(true);
      return;
    }

    const duplicate = students.some((s) => s.nbrStudent === student.nbrStudent);
    if (duplicate) {
      setAlertMessage("Student with this ID already exists.");
      setError(true);
      return;
    }
    const newStudent = { ...student };
    try {
      const response = await fetch("http://localhost:9090/student/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        setSuccess(true);
        fetchStudents();
        setStudent({
          nbrStudent: "",
          fname: "",
          lname: "",
          moyS1: "",
          moyS2: "",
          moyS3: "",
          moyS4: "",
        });
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error adding student:", error);
      setAlertMessage("An error occurred while adding the student.");
      setError(true);
    }
  };

  //? ===========> Update Student <=============

  const updateStudent = async () => {
    if (!selectedStudent) {
      setAlertMessage("Please select a student from the table to update.");
      setError(true);
      return;
    }
    try {
      const response = await fetch(`http://localhost:9090/student/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      if (response.ok) {
        setSuccess(true);
        fetchStudents();
        setStudent({
          nbrStudent: "",
          fname: "",
          lname: "",
          moyS1: "",
          moyS2: "",
          moyS3: "",
          moyS4: "",
        });
        setSelectedStudent(null); // Clear selected student
      } else {
        setAlertMessage("Failed to update student.");
        setError(true);
      }
    } catch (error) {
      console.error("Error updating student:", error);
      setAlertMessage("An error occurred while updating the student.");
      setError(true);
    }
  };

  //? ===========> Delete Student <=============

  const deleteStudent = async () => {
    if (!selectedStudent) {
      setAlertMessage("Please select a student from the table to delete.");
      setError(true);
      return;
    }
    const userConfirmed = window.confirm(
      `Are you sure you want to delete the student: ${selectedStudent.fname} ${selectedStudent.lname}?`
    );

    if (!userConfirmed) {
      return; // Exit the function if the user cancels
    }
    try {
      const response = await fetch(
        `http://localhost:9090/student/delete/${selectedStudent.nbrStudent}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setSuccess(true);
        fetchStudents();
        setStudent({
          nbrStudent: "",
          fname: "",
          lname: "",
          moyS1: "",
          moyS2: "",
          moyS3: "",
          moyS4: "",
        });
        setSelectedStudent(null);
      } else {
        setAlertMessage("Failed to delete student.");
        setError(true);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      setAlertMessage("An error occurred while deleting the student.");
      setError(true);
    }
  };

  //? ===========> Filter Student <=============

  const filteredStudents = students.filter(
    (student) =>
      student.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      field: "nbrStudent",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      flex: 0.9,
    },
    {
      field: "fname",
      headerName: "First Name",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
    {
      field: "lname",
      headerName: "Last Name",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
    {
      field: "moyS1",
      headerName: "Moy S1",

      headerClassName: "super-app-theme--header",
      flex: 1,
    },
    {
      field: "moyS2",
      headerName: "Moy S2",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
    {
      field: "moyS3",
      headerName: "Moy S3",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
    {
      field: "moyS4",
      headerName: "Moy S4",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
    {
      field: "MoyGeneral",
      headerName: "Moy General",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
  ];

  //? ===========> Handel Row Click <=============

  const handleRowClick = (row) => {
    console.log(row);

    setSelectedStudent(row);
    setStudent({
      nbrStudent: row.nbrStudent,
      fname: row.fname,
      lname: row.lname,
      moyS1: row.moyS1,
      moyS2: row.moyS2,
      moyS3: row.moyS3,
      moyS4: row.moyS4,
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
        Manage Students
      </Typography>

      <Box sx={{ mx: 4, my: 2, display: "flex", alignItems: "center" }}>
        <TextField
          label="Search by ID, First Name, or Last Name"
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
          rows={filteredStudents}
          columns={columns}
          getRowId={(row) => row.nbrStudent}
          pageSize={4}
          onRowClick={({ row }) => handleRowClick(row)}
          sx={{
            height: 300,
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
        {fields.map((field) => (
          <TextField
            key={field.id}
            sx={{ mx: 4, my: 1, height: "10" }}
            id={`outlined-${field.id}`}
            label={field.label}
            variant="outlined"
            value={student[field.id]}
            onChange={(event) =>
              setStudent({
                ...student,
                [field.id]: event.target.value,
              })
            }
            error={
              field.id === "fname" || field.id === "lname"
                ? Boolean(student[field.id] && !isValidName(student[field.id])) // Ensure boolean
                : Boolean(student[field.id] && !isValidScore(student[field.id])) // Ensure boolean
            }
            helperText={
              field.id === "fname" || field.id === "lname"
                ? student[field.id] && !isValidName(student[field.id])
                  ? "Name must only contain letters."
                  : ""
                : student[field.id] && !isValidScore(student[field.id])
                ? "Score must be a number between 0 and 20."
                : ""
            }
          />
        ))}

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
            onClick={addStudent}
          >
            Add
          </Button>
          <Button
            sx={{ display: "block", ml: 1 }}
            variant="contained"
            color="primary"
            size="large"
            onClick={updateStudent}
          >
            Update
          </Button>
          <Button
            sx={{ display: "block", ml: 1 }}
            variant="contained"
            color="error"
            size="large"
            onClick={deleteStudent}
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
