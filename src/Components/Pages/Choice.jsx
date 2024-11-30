/* eslint-disable no-unused-vars */
// @ts-nocheck

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
// import { GridRowsProp, GridColDef } from "@mui/x-data-grid";
export default function Choice() {
  //! -----------------------------------------------> Declaration <------------------------
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
  const [specialties, setSpecialties] = useState([]);
  const [specialtiesNames, setSpecialtiesNames] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // To track selected student for update
  const [choices, setChoices] = useState(["", "", "", ""]); // State for the 4 choices
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  //* ===========> Filter Student <=============
  const filteredStudents = students.filter(
    (student) =>
      student.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //* ===========> Students To Show  <=============

  const processedStudents = filteredStudents.map((student) => {
    const choices = student.choices || [];
    return {
      ...student,
      choice1:
        choices.find((c) => c.orderChice === 1)?.nameSpecialty || "No Choice1",
      choice2:
        choices.find((c) => c.orderChice === 2)?.nameSpecialty || "No Choice2",
      choice3:
        choices.find((c) => c.orderChice === 3)?.nameSpecialty ||
        "No Choice 3",
      choice4:
        choices.find((c) => c.orderChice === 4)?.nameSpecialty ||
        "No Choice 4",
    };
  });

  //* ===========>  Selected Choices <=============
  const [selectedChoices, setSelectedChoices] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
  });
  //* ===========> DataGrid Columns <=============
  const columns = [
    { field: "nbrStudent", headerName: "ID", width: 10 },
    { field: "fname", headerName: "First Name", width: 100 },
    { field: "lname", headerName: "Last Name", width: 100 },
    { field: "moyS1", headerName: "Moy S1", width: 80 },
    { field: "moyS2", headerName: "Moy S2", width: 80 },
    { field: "moyS3", headerName: "Moy S3", width: 80 },
    { field: "moyS4", headerName: "Moy S4", width: 80 },
    { field: "MoyGeneral", headerName: "Moy General", width: 110 },

    { field: "choice1", headerName: "Choice 1", width: 130 },
    { field: "choice2", headerName: "Choice 2", width: 130 },
    { field: "choice3", headerName: "Choice 3", width: 130 },
    { field: "choice4", headerName: "Choice 4", width: 130 },
  ];

  //! -----------------------------------------------> Functions <------------------------

  //? ===========>  Use Effect <=============
  useEffect(() => {
    fetchStudents();
    fetchSpecialities();
  }, [students,specialties]);

  //? ===========> Handel Change on Add Choice  <=============

  const handleChoiceChange = (order, value) => {
    // Update the selectedChoices state when a new choice is selected
    setSelectedChoices((prevChoices) => ({
      ...prevChoices,
      [order]: value, // Update the specific choice's value
    }));
  };

  //? ===========> Fetch Specialities<=============

  const fetchSpecialities = async () => {
    try {
      const response = await fetch("http://localhost:9090/specialities/all");
      const data = await response.json();
      // console.log(data);
      setSpecialties(data); // Store the full specialties data
      const names = data.map((spec) => spec.name || "Unnamed Specialty");
      setSpecialtiesNames(names); // Extract names
    } catch (error) {
      console.error("Error fetching specialties:", error);
    }
  };

  //? ===========> Fetch Students <=============

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

  //? ===========> Add Choice <=============

  const addChoice = async () => {
    if (!selectedStudent) {
      setError(true);
      return;
    }

    // Validate that all choices are filled
    if (Object.values(selectedChoices).some((choice) => !choice)) {
      setError(true);
      return;
    }

    const updatedChoices = Object.entries(selectedChoices).map(
      ([order, name]) => ({
        orderChoice: parseInt(order),
        nameSpecialty: name,
      })
    );

    try {
      const payload = {
        nbrStudent: selectedStudent.nbrStudent,
        choices: updatedChoices, // Send the updated choices to the backend
      };

      const response = await fetch("http://localhost:3002/choices/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error adding choices:", error);
      setError(true);
    }
  };

  //? ===========> Update Choice <=============

  const updateChoice = async () => {
    if (!selectedStudent) {
      setError(true);
      return;
    }

    const updatedChoices = Object.entries(selectedChoices).map(
      ([order, name]) => ({
        orderChoice: parseInt(order),
        nameSpecialty: name,
      })
    );

    try {
      const payload = {
        nbrStudent: selectedStudent.nbrStudent,
        choices: updatedChoices, // Send the updated choices to the backend
      };

      const response = await fetch("http://localhost:3002/choices/add", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error updating choices:", error);
      setError(true);
    }
  };

  //? ===========> Delete Choice <=============

  const deleteChoice = async () => {
    if (!selectedStudent) {
      setError(true);
      return;
    }
    if (
      !window.confirm("Are you sure you want to delete this student's choices?")
    ) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3002/choices/delete/${selectedStudent.nbrStudent}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setSuccess(true);
        // Optionally, refresh data here
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error deleting choices:", error);
      setError(true);
    }
  };

  //? ===========> Handel Row Click <=============

  const handleRowClick = (row) => {
    console.log("the student clicked is :", row);

    setStudent(row);

    // Initialize the selectedChoices with the student's choices
    const initialChoices = row.choices.reduce((acc, choice) => {
      acc[choice.orderChoice] = choice.nameSpecialty;
      return acc;
    }, {});

    setSelectedChoices(initialChoices); // Set the selected choices
  };

  return (
    <>
      {/*? ===========>  Header Text <============= */}

      <Typography variant="h3" gutterBottom sx={{ mx: 9, display: "flex" }}>
        Manage Choices
      </Typography>

      {/*? ===================================================>  Search Textfield <================================ */}

      <Box sx={{ mx: 4, my: 2, display: "flex", alignItems: "center" }}>
        <TextField
          label="Search by ID, First Name, or Last Name"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {/*? ===================================================>  Data Grid  <================================ */}

      <Box sx={{ height: 300, width: "100%" }}>
        <DataGrid
          rows={processedStudents}
          columns={columns}
          // getRowId={(row) => row.nbrStudent}
          getRowId={(row) => row.nbrStudent}
          pageSize={4}
          // checkboxSelection
          onRowClick={({ row }) => handleRowClick(row)}
          sx={{
            height: 300,
            width: "100%",
            mx: "auto",
          }}
        />
      </Box>

      {/*? ===================================================> Form   <================================ */}

      <Container
        component="form"
        sx={{
          display: "flex",
          width: "100%",
          mt: 6,
          alignItems: "center",
          flexDirection: "column",
          gap: 1, // Add spacing between items
          padding: 1, // Optional padding
          border: "1px solid lightgray",
        }}
      >
        <Box
          sx={{
            display: "flex",
            m: 4,
            gap: 4,
            alignContent: "center",
            justifyContent: "space-around",
            flexDirection: "row",
            width: "100%",
          }}
        >
          {/*? ============> Selecte Choice    <================================ */}

          {[1, 2, 3, 4].map((order) => {
            // Check if there is a selected student
            const selectedSpecialtyName = selectedChoices[order] || null;
            const inputLabel = selectedSpecialtyName
              ? `${order}: ${selectedSpecialtyName}` // If a choice is selected, show the name
              : `Choice ${order}`; // If no student or choice selected, show default

            return (
              <FormControl key={order}>
                {/* Dynamically set the label to show the current selection or the default text */}
                <InputLabel id={`choice-${order}-label`}>
                  {inputLabel}
                </InputLabel>

                <Select
                  labelId={`choice-${order}-label`}
                  id={`choice-${order}`}
                  value={selectedChoices[order] || ""}
                  onChange={(e) => handleChoiceChange(order, e.target.value)}
                  sx={{ width: "150px" }}
                >
                  {specialties.map((specialty) => (
                    <MenuItem
                      key={specialty.nbrSpecialty}
                      value={specialty.name}
                    >
                      {specialty.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          })}
        </Box>

        {/*? ============>  Mangment Buttons    <================================ */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Button
            sx={{ display: "block", ml: 1 }}
            variant="contained"
            color="success"
            onClick={addChoice}
            size="large"
          >
            Add
          </Button>
          <Button
            sx={{ display: "block", ml: 1 }}
            variant="contained"
            color="primary"
            onClick={updateChoice}
            size="large"
          >
            Update
          </Button>
          <Button
            sx={{ display: "block", ml: 1 }}
            size="large"
            variant="contained"
            color="error"
            onClick={deleteChoice}
          >
            Delete
          </Button>
        </Box>
      </Container>

      {/*? ==================================================>  Error Mangment     <================================ */}

      <Snackbar
        open={error}
        autoHideDuration={3000}
        onClose={() => setError(false)}
      >
        <Alert severity="error" onClose={() => setError(false)}>
          There was an error!
        </Alert>
      </Snackbar>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Action successful!
        </Alert>
      </Snackbar>
    </>
  ); //
}
