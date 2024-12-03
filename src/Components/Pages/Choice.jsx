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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

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
  const [alertMessage, setAlertMessage] = useState("");
  const [assignedChoices, setAssignedChoices] = useState({});
  //* ===========> Filter Student <=============
  const filteredStudents = students.filter(
    (student) =>
      student.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //* ===========> Students To Show  <=============

  const processedStudents = filteredStudents.map((student) => {
    const choices = student.choices || [];
    console.log(choices);
    return {
      ...student,
      choice1:
        choices.find((c) => c.orderChoice === 1)?.specialityName ||
        "No Choice 1",
      choice2:
        choices.find((c) => c.orderChoice === 2)?.specialityName ||
        "No Choice2",
      choice3:
        choices.find((c) => c.orderChoice === 3)?.specialityName ||
        "No Choice 3",
      choice4:
        choices.find((c) => c.orderChoice === 4)?.specialityName ||
        "No Choice 4",
      assignedChoice:
        assignedChoices[student.nbrStudent] ||
        student.assignedChoice ||
        "Not Assigned",
    };
  });

  //* ===========>  Selected Choices <=============

  const [selectedChoices, setSelectedChoices] = useState([]);
  //* ===========> DataGrid Columns <=============
  const columns = [
    {
      field: "nbrStudent",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      flex: 0.3,
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
    {
      field: "choice1",
      headerName: "Choice 1",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
    {
      field: "choice2",
      headerName: "Choice 2",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
    {
      field: "choice3",
      headerName: "Choice 3",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
    {
      field: "choice4",
      headerName: "Choice 4",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
    {
      field: "  ",
      headerName: "Assigned Choice",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
  ];

  //! -----------------------------------------------> Functions <------------------------

  //? ===========>  Use Effect <=============
  useEffect(() => {
    fetchStudents();
    fetchSpecialities();
  }, []);

  //? ===========> Handel Change on Add Choice  <=============

  const handleChoiceChange = (order, value) => {
    // Update the selectedChoices state when a new choice is selected
    // setSelectedChoices((prevChoices) => ({
    //   ...prevChoices,
    //   [order]: value, // Update the specific choice's value
    // }));

    setSelectedChoices({ ...selectedChoices, [order]: value });
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
      setAlertMessage("Error fetching specialties");
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
      setAlertMessage("No Selected Student!");
      return;
    }

    const updatedChoices = Object.entries(selectedChoices)
      .filter(([order, name]) => name && !isNaN(parseInt(order, 10))) // Ensure both order and name are valid
      .map(([order, name]) => ({
        choiceOrder: parseInt(order, 10), // Convert order to integer
        specialtyName: name, // Use `specialityName` to match backend DTO
      }));

    try {
      // Prepare the payload
      const payload = {
        nbrStudent: selectedStudent.nbrStudent, // Send the student's ID
        choices: updatedChoices, // Send the list of choices
      };

      console.log("payload :", payload);
      // Make the POST request to the backend
      const response = await fetch("http://localhost:9090/choices/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send the entire payload
      });

      if (response.ok) {
        setSuccess(true);
        setAlertMessage("Choices Successfully Assigned!");
      } else {
        setError(true);
        const errorText = await response.text();
        setAlertMessage(`Response Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding choices:", error);
      setAlertMessage("Error adding choices!");
      setError(true);
    }
  };

  //? ===========> Delete Choice <=============
  const deleteChoices = async () => {
    if (!selectedStudent) {
      setError(true);
      setAlertMessage("No Selected Student!");
      return;
    }
    const userConfirmed = window.confirm(
      `Are you sure you want to delete All Choices for the student: ${selectedStudent.fname} ${selectedStudent.lname} ?`
    );

    if (!userConfirmed) {
      return; // Exit the function if the user cancels
    }

    try {
      // Make the DELETE request
      const response = await fetch(
        `http://localhost:9090/choices/delete/${selectedStudent.nbrStudent}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setSuccess(true);
        setAlertMessage("Choices Successfully Deleted!");
      } else {
        setError(true);
        const errorText = await response.text();
        setAlertMessage(`Response Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting choices:", error);
      setError(true);
      setAlertMessage("Error deleting choices!");
    }
  };

  //? ===========> Update Choice <=============

  const updateChoice = async () => {
    if (!selectedStudent) {
      setError(true);
      setAlertMessage("No Selected Student!");
      return;
    }

    // Validate that no duplicate specialty names are selected
    const choiceNames = Object.values(selectedChoices).filter((name) => name);
    const hasDuplicates = new Set(choiceNames).size !== choiceNames.length;

    if (hasDuplicates) {
      setError(true);
      setAlertMessage("Duplicate specialty choices are not allowed!");
      return;
    }

    // Map selected choices to match the backend's expected structure
    const updatedChoices = Object.entries(selectedChoices)
      .filter(([order, name]) => name && !isNaN(parseInt(order, 10))) // Ensure valid input
      .map(([order, name]) => ({
        choiceOrder: parseInt(order, 10),
        specialtyName: name, // Ensure spelling matches backend expectation
      }));

    try {
      console.log("Updating choices:", updatedChoices);

      const response = await fetch(
        `http://localhost:9090/choices/update/${selectedStudent.nbrStudent}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedChoices),
        }
      );

      if (response.ok) {
        setSuccess(true);
        setAlertMessage("Choices successfully updated!");
      } else {
        setError(true);
        const errorText = await response.text();
        setAlertMessage(`Response Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error updating choices:", error);
      setAlertMessage("Error updating choices!");
      setError(true);
    }
  };

  //? ===========> Assign Choice <=============
  const assignChoices = async () => {
    try {
      // 1. Sort students by MoyGeneral in descending order
      const sortedStudents = [...students].sort(
        (a, b) => b.MoyGeneral - a.MoyGeneral
      );

      // Track remaining places for each specialty
      let specialtyPlaces = {};

      // Initialize specialty places
      for (const specialty of specialties) {
        specialtyPlaces[specialty.name] = specialty.numberOfPlaces;
      }

      // Track assignments
      const assignments = {};

      // 2. Process each student
      for (const student of sortedStudents) {
        let assigned = false;

        // Get student's choices sorted by order
        const sortedChoices = (student.choices || []).sort(
          (a, b) => a.orderChoice - b.orderChoice
        );

        // 3 & 4. Try each choice in order
        for (const choice of sortedChoices) {
          const specialtyName = choice.specialtyName;

          // Check if specialty has available places
          if (specialtyPlaces[specialtyName] > 0) {
            // Assign the choice
            assignments[student.nbrStudent] = specialtyName;
            specialtyPlaces[specialtyName]--;

            // Update specialty places in backend

            // await fetch(`http://localhost:9090/specialities/decrease-place/`, {
            //   method: "PUT",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({
            //     name: specialtyName,
            //     numberOfPlaces: specialtyPlaces[specialtyName],
            //   }),
            // });

            // // Save assignment to backend
            // await fetch(`http://localhost:9090/student/assign-choice`, {
            //   method: "PUT",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({
            //     nbrStudent: student.nbrStudent,
            //     assignedChoice: specialtyName,
            //   }),
            // });

            assigned = true;
            break;
          }
        }

        if (!assigned) {
          assignments[student.nbrStudent] = "No Assignment";
        }
      }

      // 5. Update state to show assignments
      setAssignedChoices(assignments);

      // Refresh student data to show new assignments
      await fetchStudents();

      setSuccess(true);
      setAlertMessage("Choices assigned successfully!");
    } catch (error) {
      console.error("Error assigning choices:", error);
      setError(true);
      setAlertMessage("Error assigning choices!");
    }
  };
  //? ===========> Handel Row Click <=============

  const handleRowClick = (row) => {
    console.log("the student clicked is :", row);

    setSelectedStudent(row);

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
          rows={processedStudents}
          columns={columns}
          getRowId={(row) => row.nbrStudent}
          pageSize={4}
          onRowClick={({ row }) => handleRowClick(row)}
          sx={{
            height: 300,
            width: "100%",
            mx: "auto",
            border: "none",
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
                  key={order}
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

        {/*? ============>  Management Buttons    <================================ */}

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
            onClick={deleteChoices}
          >
            Delete
          </Button>
          <Button
            sx={{ display: "block", ml: 1 }}
            size="large"
            variant="contained"
            color="secondary"
            onClick={assignChoices}
          >
            Assign
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
      <Snackbar
        open={error}
        autoHideDuration={3000}
        onClose={() => setError(false)}
      >
        <Alert severity="error" onClose={() => setError(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  ); //
}
