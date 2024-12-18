/* eslint-disable no-unused-vars */
// @ts-nocheck

import { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import Typography from "@mui/material/Typography";

export default function Student() {
  const [specialities, setSpecialities] = useState([]);
  const [specialitiesF, setSpecialitiesF] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalA, setShowModalA] = useState(false);
  const [showModalD, setShowModalD] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState(null);

  const [studentToDelete, setSpecialtyToDelete] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  const [messageAD, setMessageAD] = useState(null);
  const [messageTypeAD, setMessageTypeAD] = useState("");

  const validateSpecialty = (taget) => {
    const {name , value} = taget;
    const numPlaceRegex = /^$|^[0-9]+$/;
    const nameRegex = /^$|^[A-Za-z]+$/;

    if (name === "numberOfPlaces" && !numPlaceRegex.test(value)) {
      return { isValid: false, error: "Number of place must contain only  numbers." };
    }
    if (name === "name" && !nameRegex.test(value)) {
      return { isValid: false, error: "Name must contain only letters." };
    }
    return { isValid: true };
  };

  const fetchSpecialities = async () => {
    try {
      const response = await axios.get("http://localhost:9090/speciality/specialities");
      setSpecialities(response.data.data);
      setSpecialitiesF(response.data.data);
      // setMessageType("success")
      // setMessage("Success to fetch student data.");
      // setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error("Error fetching specialities data:", err);
      setMessageType("Failed")
      setMessage("Failed to fetch specialities data.");
      setTimeout(() => setMessage(null), 5000);
    }
  };
  // Fetch student data from the backend
  useEffect(() => {
    fetchSpecialities();
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:9090/speciality/delete_speciality/${studentToDelete}`);
      setMessageType("success")
      setMessage("Success to delete specialty data.");
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error("Error deleting student:", error);
      setMessageType("Failed")
      setMessage("Failed to Delete specialty data.");
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setShowModalD(false);
      fetchSpecialities();
    }

  };

  const handleAddition = () => {
    setShowModalA(true);
  }


  const handleUpdate = (speciality) => {
    setCurrentSpecialty(speciality);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setSpecialtyToDelete(id);
    setShowModalD(true);
  }

  const handleConfirmUpdate = async () => {
    try {
      const response = await axios.put("http://localhost:9090/speciality/update_speciality", currentSpecialty);
      setMessageType("success")
      setMessage("Success to update specialty data.");
      setTimeout(() => setMessage(null), 5000);
      fetchSpecialities();

      setShowModal(false);
    } catch (error) {
      console.error("Error updating student:", error);
      setMessageType("Failed")
      setMessage("Failed to update specialty data.");
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleCancelDelete = () => {
    setShowModalD(false);
  };
  const handleCancelUpdate = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const validationResult = validateSpecialty(e.target);

    if (!validationResult.isValid) {
      setMessageAD(validationResult.error);
      setMessageTypeAD("error");
      setTimeout(() => setMessageAD(null), 5000);
      return;
    }
    const {name, value} = e.target;
    setCurrentSpecialty({...currentSpecialty, [name]: value});
  };

  const handleInputChangeAS = (e) => {
    const validationResult = validateSpecialty(e.target);

    if (!validationResult.isValid) {
      setMessageAD(validationResult.error);
      setMessageTypeAD("error");
      setTimeout(() => setMessageAD(null), 5000);
      return;
    }
    const {name, value} = e.target;
    setSpecialty({...specialty, [name]: value});  // Update 'student' state, not 'currentStudent'
  };


  const handleConfirmAdd = async () => {
    if(specialty.name === "" || specialty.numberOfPlaces === 0){
      setMessageAD("fill all filed please");
      setMessageTypeAD("error");
      setTimeout(() => setMessageAD(null), 5000);
      return;
    }
    try {
      const response = await axios.post(
          "http://localhost:9090/speciality/new_speciality",
          specialty
      );

      if (response.status >= 200 && response.status < 300) {
        setMessageType("success");
        setMessage(response.data.message || "Specialty added successfully!");
        setTimeout(() => setMessage(null), 5000);
        setSpecialty({
          name: "",
          numberOfPlaces: 0
        })
        fetchSpecialities(); // Refresh the list of specialties
      } else {
        // Handle unexpected response
        setMessageType("error");
        setMessage(response.data.message || "Failed to add specialty.");
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (error) {
      // Handle network or server errors
      setMessageType("error");
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message || "Bad request.");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setShowModalA(false); // Hide modal in all cases
    }
  };


  const handleCancelAdd = () => {
    setShowModalA(false);
  }
  const [specialty, setSpecialty] = useState({
    name: "",
    numberOfPlaces: 0
  });

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const searchValue = e.target.value.toUpperCase(); // Convert to lowercase for case-insensitive search
    setSpecialitiesF(
        searchValue
            ? specialities.filter(
                (specialty) =>
                    specialty.name.toUpperCase().includes(searchValue)
            )
            : specialities
    );
  };


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
  const NotificationAD = ({ message, type }) => {
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
          Manage Specialty
        </Typography>
        <div style={{paddingRight: "20px" , paddingLeft :"20px"}}>
          <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: "10px",
                fontSize: "16px",
                width: "100%",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
          />
        </div>

        {showModalA && (
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
              <h3>Add Specialty</h3>
              <NotificationAD message={messageAD} type={messageTypeAD} />
              <form>
                <div>
                  <label>Specialty Name:</label>
                  <input
                      type="text"
                      name="name"
                      value={specialty.name || ""}
                      onChange={handleInputChangeAS}
                      style={{marginBottom: "10px", display: "block", width: "100%"}}
                  />
                </div>
                <div>
                  <label>Number of place:</label>
                  <input
                      type="text"
                      name="numberOfPlaces"
                      value={specialty.numberOfPlaces || ""}
                      onChange={handleInputChangeAS}
                      style={{marginBottom: "10px", display: "block", width: "100%"}}
                  />
                </div>
              </form>
              <div style={{display: "flex", justifyContent: "flex-end"}}>
                <button
                    style={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      marginRight: "5px",
                      padding: "10px 15px",
                    }}
                    onClick={handleConfirmAdd}
                >
                  Confirm
                </button>
                <button
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      padding: "10px 15px",
                    }}
                    onClick={handleCancelAdd}
                >
                  Cancel
                </button>
              </div>
            </div>
        )}

        <table style={{width: "100%", borderCollapse: "collapse"}}>
          <thead>
          <tr>
            <th style={{border: "1px solid #ddd", padding: "8px"}}>name</th>
            <th style={{border: "1px solid #ddd", padding: "8px"}}>number of places</th>
            <th style={{border: "1px solid #ddd", padding: "8px"}}>Actions</th>
          </tr>
          </thead>
          <tbody>
          {specialitiesF.map((specialty, index) => (
              <tr
                  key={specialty.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f3f3f3" : "#ffffff",
                    border: "1px solid #ddd",
                  }}
              >
                <td style={{padding: "8px"}}>{specialty.name}</td>
                <td style={{padding: "8px"}}>{specialty.numberOfPlaces}</td>
                <td style={{padding: "8px"}}>
                  <button
                      style={{
                        backgroundColor: "#4caf50",
                        color: "white",
                        marginRight: "5px",
                      }}
                      onClick={() => handleUpdate(specialty)}
                  >
                    Update
                  </button>
                  <button
                      style={{backgroundColor: "#f44336", color: "white"}}
                      onClick={() => handleDelete(specialty.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        {showModalD && (
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
                }}
            >
              <h3>Delete Student</h3>

              <h5>Are you sure you want to delete this student?</h5>

              <div style={{display: "flex", justifyContent: "flex-end"}}>
                <button
                    style={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      marginRight: "5px",
                      padding: "10px 15px",
                    }}
                    onClick={handleConfirmDelete}
                >
                  Confirm
                </button>
                <button
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      padding: "10px 15px",
                    }}
                    onClick={handleCancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
        )}

        {/* Update Modal */}
        {showModal && currentSpecialty && (
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
                }}
            >
              <h3>Update specialty</h3>
              <NotificationAD message={messageAD} type={messageTypeAD} />
              <form>
                <div>
                  <label>Name:</label>
                  <input
                      type="text"
                      name="name"
                      value={currentSpecialty.name}
                      onChange={handleInputChange}
                      style={{marginBottom: "10px", display: "block", width: "100%"}}
                  />
                </div>
                <div>
                  <label>number of palces:</label>
                  <input
                      type="text"
                      name="numberOfPlaces"
                      value={currentSpecialty.numberOfPlaces}
                      onChange={handleInputChange}
                      style={{marginBottom: "10px", display: "block", width: "100%"}}
                  />
                </div>
                {/* Add more fields as needed */}
              </form>
              <div style={{display: "flex", justifyContent: "flex-end"}}>
                <button
                    style={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      marginRight: "5px",
                      padding: "10px 15px",
                    }}
                    onClick={handleConfirmUpdate}
                >
                  Confirm
                </button>
                <button
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      padding: "10px 15px",
                    }}
                    onClick={handleCancelUpdate}
                >
                  Cancel
                </button>
              </div>
            </div>
        )}
        {/* Background Overlay */}
        {showModal && (
            <div
                onClick={handleCancelUpdate}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 999,
                }}
            ></div>
        )}
        <div className="animated-button-container">
          <div className="icon-container" onClick={handleAddition}>
            <FaPlus className="add-icon"/>
          </div>
        </div>
      </>
  );
}
