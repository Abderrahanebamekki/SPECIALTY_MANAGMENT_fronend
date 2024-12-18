/* eslint-disable no-unused-vars */
// @ts-nocheck

import { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";
import Typography from "@mui/material/Typography";

const Notification = ({ message, type }) => {
  if (!message) return null;

  const style = {
    padding: "10px",
    color: type === "success" ? "green" : "red",
    backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
    border: type === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
    borderRadius: "4px",
    margin: "10px 0",
  };

  return <div style={style}>{message}</div>;
};

const Dropdown = ({ name, value, options, onChange }) => (
    <div style={{ marginBottom: "10px" }}>
      <label htmlFor={name} style={{ display: "block", marginBottom: "5px" }}>{name.charAt(0).toUpperCase() + name.slice(1)}:</label>
      <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
      >
        <option>Select an option</option>
        {options.map((option, index) => (
            <option key={index} value={option.id}>{option.name}</option>
        ))}
      </select>
    </div>
);

export default function Choice(){
  const [studentsF, setStudentsF] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [specialities, setSpecialities] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [choices, setChoices] = useState({
    choice1: null,
    choice2: null,
    choice3: null,
    choice4: null,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:9090/student/Affected_spe");
      setStudentsF(response.data.data);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setMessageType("Failed");
      setMessage("Failed to fetch student data.");
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const fetchSpecialities = async () => {
    try {
      const response = await axios.get("http://localhost:9090/speciality/specialities");
      setSpecialities(response.data.data);
    } catch (err) {
      console.error("Error fetching specialities data:", err);
      setMessageType("Failed");
      setMessage("Failed to fetch specialities data.");
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleRowClick = async (student) => {
    await fetchSpecialities();
    setCurrentStudent(student);
    if (student.choice1 === "Nan") {
      setShowAddForm(true);
    } else {
      setShowUpdateForm(true);
    }
  };

  const handleCancelA = () => {
    setShowAddForm(false);
  };

  const handleCancelU = () => {
    setShowUpdateForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChoices((prevChoices) => ({
      ...prevChoices,
      [name]: value,
    }));
  };

  const handleSubmitA = async () => {
    if (Object.values(choices).some(choice => choice === null)) {
      setMessage("Select all choices");
      setMessageType("error");
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    const list = [];
    list.push(choices.choice1);
    list.push(choices.choice2);
    list.push(choices.choice3);
    list.push(choices.choice4);
    const listChoices = [];
    for (let i = 0 ; i<list.length ; i++){
      const ch = {
        "specialty" : list[i],
        "orderChoice":i+1
      }
      listChoices.push(ch)
    }

    console.log(listChoices[0]);


    axios
        .post(`http://localhost:9090/choices/new_choice/${currentStudent.numStudent}`, listChoices)
        .then(() => {
            fetchStudents();
             handleCancelA();
        })
        .catch((error) => {
          console.error("Error updating choices:", error);
          alert("An error occurred while updating the choices. Please try again.");
        });
  };

  const handleSubmitU = async () => {
    if (Object.values(choices).some(choice => choice === null)) {
      setMessage("Select all choices");
      setMessageType("error");
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    const list = [];
    list.push(choices.choice1);
    list.push(choices.choice2);
    list.push(choices.choice3);
    list.push(choices.choice4);
    const listChoices = [];
    for (let i = 0 ; i<list.length ; i++){
      const ch = {
        "specialty" : list[i],
        "orderChoice":i+1
      }
      listChoices.push(ch)
    }

    console.log(listChoices[0]);


    axios
        .put(`http://localhost:9090/choices/update_choice/${currentStudent.numStudent}`, listChoices)
        .then(() => {
            fetchStudents();
            handleCancelU();
        })
        .catch((error) => {
          console.error("Error updating choices:", error);
          alert("An error occurred while updating the choices. Please try again.");
        });
  };

  return (
      <>
        <Notification message={message} type={messageType} />
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
              borderBottom: "3px solid #0851ec",
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
                color: "#0851ec",
                transition: "color 0.3s ease-in-out",
              },
            }}
        >
          Manage Choice
        </Typography>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>numStudent</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>First Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Last Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Average</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>choice 1</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>choice 2</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>choice 3</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>choice 4</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Result</th>
          </tr>
          </thead>
          <tbody>
          {studentsF.map((student) => (
              <tr
                  key={student.numStudent}
                  style={{ backgroundColor: "#f3f3f3", border: "1px solid #ddd" }}
                  onClick={() => handleRowClick(student)}
              >
                <td style={{ padding: "8px" }}>{student.numStudent}</td>
                <td style={{ padding: "8px" }}>{student.firstName}</td>
                <td style={{ padding: "8px" }}>{student.lastName}</td>
                <td style={{ padding: "8px" }}>{student.average}</td>
                <td style={{ padding: "8px" }}>{student.choice1}</td>
                <td style={{ padding: "8px" }}>{student.choice2}</td>
                <td style={{ padding: "8px" }}>{student.choice3}</td>
                <td style={{ padding: "8px" }}>{student.choice4}</td>
                <td style={{ padding: "8px" }}>{student.assignedSpeciality}</td>
              </tr>
          ))}
          </tbody>
        </table>
        {showAddForm && (
            <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  padding: "20px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
                  zIndex: 1000,
                  width: "400px",
                }}
            >
              <Notification message={message} type={messageType} />
              <h1>Add new choices</h1>
              <form>
                <Dropdown name="choice1" value={choices.choice1} options={specialities} onChange={handleChange} />
                <Dropdown name="choice2" value={choices.choice2} options={specialities} onChange={handleChange} />
                <Dropdown name="choice3" value={choices.choice3} options={specialities} onChange={handleChange} />
                <Dropdown name="choice4" value={choices.choice4} options={specialities} onChange={handleChange} />
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                  <button
                      type="button"
                      onClick={handleCancelA}
                      style={{
                        backgroundColor: "#f44336", // Red for Cancel
                        color: "white",
                        padding: "10px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        flex: 1, // Adjusts button size equally
                      }}
                  >
                    Cancel
                  </button>
                  <button
                      type="submit"
                      onClick={handleSubmitA}
                      style={{
                        backgroundColor: "#0851ec", // Blue for Confirm
                        color: "white",
                        padding: "10px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        flex: 1, // Adjusts button size equally
                      }}
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
        )}

        {showUpdateForm && (
            <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  padding: "20px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
                  zIndex: 1000,
                  width: "400px",
                }}
            >
              <Notification message={message} type={messageType} />
              <h1>Update new choices</h1>
              <form>
                <Dropdown name="choice1" value={choices.choice1} options={specialities} onChange={handleChange} />
                <Dropdown name="choice2" value={choices.choice2} options={specialities} onChange={handleChange} />
                <Dropdown name="choice3" value={choices.choice3} options={specialities} onChange={handleChange} />
                <Dropdown name="choice4" value={choices.choice4} options={specialities} onChange={handleChange} />
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                  <button
                      type="button"
                      onClick={handleCancelU}
                      style={{
                        backgroundColor: "#f44336", // Red for Cancel
                        color: "white",
                        padding: "10px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        flex: 1, // Adjusts button size equally
                      }}
                  >
                    Cancel
                  </button>
                  <button
                      type="submit"
                      onClick={handleSubmitU}
                      style={{
                        backgroundColor: "#0851ec", // Blue for Confirm
                        color: "white",
                        padding: "10px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        flex: 1, // Adjusts button size equally
                      }}
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
        )}

      </>
  );
}



// {showUpdateForm && (
//     <div
//         style={{
//           position: "fixed",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           backgroundColor: "white",
//           padding: "20px",
//           boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
//           zIndex: 1000,
//           width: "400px",
//         }}
//     >
//       <h1>Update choices</h1>
//       <form>
//         <div style={{marginBottom: "10px"}}>
//           <label htmlFor="choice1" style={{display: "block", marginBottom: "5px"}}>Choice 1:</label>
//           <select
//               id="choice1"
//               name="choice1"
//               value={choices.choice1}
//               onChange={handleChange}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 borderRadius: "4px",
//                 border: "1px solid #ccc",
//               }}
//           >
//             <option value={currentStudent.choice1}>{currentStudent.choice1}</option>
//             {
//               specialities.map((spe, index) => (
//                   <option value={spe}>{spe.name}</option>
//               ))
//             }
//           </select>
//         </div>
//
//         <div style={{marginBottom: "10px"}}>
//           <label htmlFor="choice2" style={{display: "block", marginBottom: "5px"}}>Choice 2:</label>
//           <select
//               id="choice2"
//               name="choice2"
//               value={choices.choice2}
//               onChange={handleChange}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 borderRadius: "4px",
//                 border: "1px solid #ccc",
//               }}
//           >
//             <option value={currentStudent.choice2}>{currentStudent.choice2}</option>
//             {
//               specialities.map((spe, index) => (
//                   <option value={spe}>{spe.name}</option>
//               ))
//             }
//           </select>
//         </div>
//
//         <div style={{marginBottom: "10px"}}>
//           <label htmlFor="choice3" style={{display: "block", marginBottom: "5px"}}>Choice 3:</label>
//           <select
//               id="choice3"
//               name="choice3"
//               value={choices.choice3}
//               onChange={handleChange}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 borderRadius: "4px",
//                 border: "1px solid #ccc",
//               }}
//           >
//             <option value={currentStudent.choice3}>{currentStudent.choice3}</option>
//             {
//               specialities.map((spe, index) => (
//                   <option value={spe}>{spe.name}</option>
//               ))
//             }
//           </select>
//         </div>
//
//         <div style={{marginBottom: "10px"}}>
//           <label htmlFor="choice4" style={{display: "block", marginBottom: "5px"}}>Choice 4:</label>
//           <select
//               id="choice4"
//               name="choice4"
//               value={choices.choice4}
//               onChange={handleChange}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 borderRadius: "4px",
//                 border: "1px solid #ccc",
//               }}
//           >
//             <option value={currentStudent.choice4}>{currentStudent.choice4}</option>
//             {
//               specialities.map((spe, index) => (
//                   <option value={spe}>{spe.name}</option>
//               ))
//             }
//           </select>
//         </div>
//
//         <div style={{display: "flex", justifyContent: "space-between", gap: "10px"}}>
//           <button
//               type="button"
//               onClick={() => handleCancelU()}
//               style={{
//                 backgroundColor: "#f44336", // Red for Cancel
//                 color: "white",
//                 padding: "10px",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 flex: 1, // Adjusts button size equally
//               }}
//           >
//             Cancel
//           </button>
//
//           <button
//               type="submit"
//               onClick={() => handleSubmitU() }
//               style={{
//                 backgroundColor: "#0851ec", // Blue for Confirm
//                 color: "white",
//                 padding: "10px",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 flex: 1, // Adjusts button size equally
//               }}
//           >
//             Confirm
//           </button>
//         </div>
//
//       </form>
//     </div>
// )}
