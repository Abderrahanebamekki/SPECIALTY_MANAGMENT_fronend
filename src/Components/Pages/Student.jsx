/* eslint-disable no-unused-vars */
// @ts-nocheck

import { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import Typography from "@mui/material/Typography";

export default function Student() {
    const [students, setStudents] = useState([]);
    const [studentsF, setStudentsF] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalA, setShowModalA] = useState(false);
    const [showModalD, setShowModalD] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);

    const [studentToDelete, setStudentToDelete] = useState(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("");

    const [messageAD, setMessageAD] = useState(null);
    const [messageTypeAD, setMessageTypeAD] = useState("");

    const validateStudent = (target) => {
        const {name , value} = target ;
        const numStudentRegex = /^[A-Za-z0-9]+$/; // Letters and numbers
        const nameRegex = /^[A-Za-z]+$/; // Letters only
        const avgRegex = /^\d+(\.\d+)?$/; // Numbers (allow decimals)
        console.log("name is : " + name + "values is :" + value);
        if ( name === "numStudent" && !numStudentRegex.test(value)) {
            return { isValid: false, error: "Student ID must contain only letters and numbers." };
        }
        if (name === "firstName" && !nameRegex.test(value)) {
            return { isValid: false, error: "First Name must contain only letters." };
        }
        if (name === "lastName" && !nameRegex.test(value)) {
            return { isValid: false, error: "Last Name must contain only letters." };
        }
        if ((name==="avgS1" || name==="avgS2" || name==="avgS3" || name==="avgS4") && !avgRegex.test(value)) {
            return { isValid: false, error: "Average must contain only numbers." };
        }
       return { isValid: true };
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://localhost:9090/student/getAll");
            console.log("Fetched students:", response.data.data);
            setStudents(response.data.data);
            setStudentsF(response.data.data);
            // setMessageType("success")
            // setMessage("Success to fetch student data.");
            // setTimeout(() => setMessage(null), 5000);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setMessageType("Failed")
            setMessage("Failed to fetch student data.");
            setTimeout(() => setMessage(null), 5000);
        }
    };
    // Fetch student data from the backend
    useEffect(() => {
        fetchStudents();
    }, []);

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:9090/student/delete/${studentToDelete}`);
            setMessageType("success")
            setMessage("Success to delete student data.");
            setTimeout(() => setMessage(null), 5000);
        } catch (error) {
            console.error("Error deleting student:", error);
            setMessageType("Failed")
            setMessage("Failed to Delete student data.");
            setTimeout(() => setMessage(null), 5000);
        } finally {
            setShowModalD(false);
            fetchStudents();
        }

    };

    const handleAddition = () => {
        setShowModalA(true);
    }


    const handleUpdate = (student) => {
        setCurrentStudent(student);
        setShowModal(true);
    };

    const handleDelete = (numStudent) => {
        setStudentToDelete(numStudent);
        setShowModalD(true);
    }

    const handleConfirmUpdate = async () => {
        try {
            const response = await axios.put("http://localhost:9090/student/update", currentStudent);
            console.log("Updated student:", response.data);
            setMessageType("success")
            setMessage("Success to update student data.");
            setTimeout(() => setMessage(null), 5000);
            fetchStudents();

            setShowModal(false);
        } catch (error) {
            console.error("Error updating student:", error);
            setMessageType("Failed")
            setMessage("Failed to update student data.");
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
        const {name, value} = e.target;
        const validationResult = validateStudent(e.target);

        if (!validationResult.isValid) {
            setMessageAD(validationResult.error);
            setMessageTypeAD("error");
            setTimeout(() => setMessageAD(null), 5000);
            return;
        }

        setCurrentStudent({...currentStudent, [name]: value});
    };

    const handleInputChangeA = (e) => {
        const validationResult = validateStudent(e.target);

        if (!validationResult.isValid) {
            setMessageAD(validationResult.error);
            setMessageTypeAD("error");
            setTimeout(() => setMessageAD(null), 5000);
            return;
        }
        const {name, value} = e.target;
        setStudent({...student, [name]: value});  // Update 'student' state, not 'currentStudent'
    };


    const handleConfirmAdd = async () => {
        if(student.firstName === "" || student.lastName === "" || student.numStudent === "" || student.avgS1 === 0.0 || student.avgS2 === 0.0 || student.avgS3 === 0.0 || student.avgS4 === 0.0 ){
            setMessageAD("fill all filed please");
            setMessageTypeAD("error");
            setTimeout(() => setMessageAD(null), 5000);
            return;
        }
        try {
            const response = await axios.post("http://localhost:9090/student/addStudent", student);
            console.log("Added student:", response.data);
            setMessageType("success")
            setMessage("Success to Add new  student .");
            setTimeout(() => setMessage(null), 5000);
            fetchStudents();
        } catch (error) {
            console.error("Error adding student:", error);
            setMessageType("Failed")
            setMessage("Failed to Add new student.");
            setTimeout(() => setMessage(null), 5000);
        }
        setShowModalA(false);
    }

    const handleCancelAdd = () => {
        setShowModalA(false);
    }
    const [student, setStudent] = useState({
        numStudent: "",
        firstName: "",
        lastName: "",
        avgS1: 0.0,
        avgS2: 0.0,
        avgS3: 0.0,
        avgS4: 0.0
    });

    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        const searchValue = e.target.value.toLowerCase(); // Convert to lowercase for case-insensitive search
        setStudentsF(
            searchValue
                ? students.filter(
                    (student) =>
                        student.numStudent.toLowerCase().includes(searchValue) ||
                        student.firstName.toLowerCase().includes(searchValue) ||
                        student.lastName.toLowerCase().includes(searchValue)
                )
                : students
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
                    Manage Student
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
                        <h3>Add Student</h3>
                        <NotificationAD message={messageAD} type={messageTypeAD} />
                        <form>
                            <div>
                                <label>Student number:</label>
                                <input
                                    type="text"
                                    name="numStudent"
                                    value={student.numStudent || ""}
                                    onChange={handleInputChangeA}
                                    style={{marginBottom: "10px", display: "block", width: "100%"}}
                                />
                            </div>
                            <div>
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={student.firstName || ""}
                                    onChange={handleInputChangeA}
                                    style={{marginBottom: "10px", display: "block", width: "100%"}}
                                />
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={student.lastName || ""}
                                    onChange={handleInputChangeA}
                                    style={{marginBottom: "10px", display: "block", width: "100%"}}
                                />
                            </div>
                            <div>
                                <label>Avg S1:</label>
                                <input
                                    type="text"
                                    name="avgS1"
                                    value={student.avgS1 || ""}
                                    onChange={handleInputChangeA}
                                    style={{marginBottom: "10px", display: "block", width: "100%"}}
                                />
                            </div>
                            <div>
                                <label>Avg S2:</label>
                                <input
                                    type="text"
                                    name="avgS2"
                                    value={student.avgS2 || ""}
                                    onChange={handleInputChangeA}
                                    style={{marginBottom: "10px", display: "block", width: "100%"}}
                                />
                            </div>
                            <div>
                                <label>Avg S3:</label>
                                <input
                                    type="text"
                                    name="avgS3"
                                    value={student.avgS3 || ""}
                                    onChange={handleInputChangeA}
                                    style={{marginBottom: "10px", display: "block", width: "100%"}}
                                />
                            </div>
                            <div>
                                <label>Avg S4:</label>
                                <input
                                    type="text"
                                    name="avgS4"
                                    value={student.avgS4 || ""}
                                    onChange={handleInputChangeA}
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
                        <th style={{border: "1px solid #ddd", padding: "8px"}}>numStudent</th>
                        <th style={{border: "1px solid #ddd", padding: "8px"}}>First Name</th>
                        <th style={{border: "1px solid #ddd", padding: "8px"}}>Last Name</th>
                        <th style={{border: "1px solid #ddd", padding: "8px"}}>Avg S1</th>
                        <th style={{border: "1px solid #ddd", padding: "8px"}}>Avg S2</th>
                        <th style={{border: "1px solid #ddd", padding: "8px"}}>Avg S3</th>
                        <th style={{border: "1px solid #ddd", padding: "8px"}}>Avg S4</th>
                        <th style={{border: "1px solid #ddd", padding: "8px"}}>Average</th>
                        <th style={{border: "1px solid #ddd", padding: "8px"}}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {studentsF.map((student, index) => (
                        <tr
                            key={student.numStudent}
                            style={{
                                backgroundColor: index % 2 === 0 ? "#f3f3f3" : "#ffffff",
                                border: "1px solid #ddd",
                            }}
                        >
                            <td style={{padding: "8px"}}>{student.numStudent}</td>
                            <td style={{padding: "8px"}}>{student.firstName}</td>
                            <td style={{padding: "8px"}}>{student.lastName}</td>
                            <td style={{padding: "8px"}}>{student.avgS1}</td>
                            <td style={{padding: "8px"}}>{student.avgS2}</td>
                            <td style={{padding: "8px"}}>{student.avgS3}</td>
                            <td style={{padding: "8px"}}>{student.avgS4}</td>
                            <td style={{padding: "8px"}}>{(student.avgS1 + student.avgS2 + student.avgS3 + student.avgS4) / 4}</td>
                            <td style={{padding: "8px"}}>
                                <button
                                    style={{
                                        backgroundColor: "#4caf50",
                                        color: "white",
                                        marginRight: "5px",
                                    }}
                                    onClick={() => handleUpdate(student)}
                                >
                                    Update
                                </button>
                                <button
                                    style={{backgroundColor: "#f44336", color: "white"}}
                                    onClick={() => handleDelete(student.numStudent)}
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
                {showModal && currentStudent && (
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
                        <h3>Update Student</h3>
                        <NotificationAD message={messageAD} type={messageTypeAD} />
                        <form>
                            <div>
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={currentStudent.firstName}
                                    onChange={handleInputChange}
                                    style={{marginBottom: "10px", display: "block", width: "100%"}}
                                />
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={currentStudent.lastName}
                                    onChange={handleInputChange}
                                    style={{marginBottom: "10px", display: "block", width: "100%"}}
                                />
                            </div>
                            <div>
                                <label>Avg S1:</label>
                                <input
                                    type="text"
                                    name="avgS1"
                                    value={currentStudent.avgS1}
                                    onChange={handleInputChange}
                                    style={{marginBottom: "10px", display: "block", width: "100%"}}
                                />
                            </div>
                            <div>
                                <label>Avg S2:</label>
                                <input
                                    type="text"
                                    name="avgS2"
                                    value={currentStudent.avgS1}
                                    onChange={handleInputChange}
                                    style={{marginBottom: "10px", display: "block", width: "100%"}}
                                />
                            </div>
                            <div>
                                <label>Avg S3:</label>
                                <input
                                    type="text"
                                    name="avgS1"
                                    value={currentStudent.avgS1}
                                    onChange={handleInputChange}
                                    style={{marginBottom: "10px", display: "block", width: "100%"}}
                                />
                            </div>
                            <div>
                                <label>Avg S4:</label>
                                <input
                                    type="text"
                                    name="avgS1"
                                    value={currentStudent.avgS1}
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
