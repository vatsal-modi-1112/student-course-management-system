import { useState } from "react";

import Home from "./components/Home";
import StudentLogin from "./components/StudentLogin";
import StudentDashboard from "./components/StudentDashboard";
import Courses from "./components/Courses";
import MyCourses from "./components/MyCourses";
import Profile from "./components/Profile";

import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminStudents from "./components/AdminStudents";
import AdminCourses from "./components/AdminCourses";

import AddStudent from "./components/AddStudent";
import EditStudent from "./components/EditStudent";
import AddCourse from "./components/AddCourse";
import EditCourse from "./components/EditCourse";

function App() {

    const [student, setStudent] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState("");

    const [currentPage, setCurrentPage] = useState("home");

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    function handleStudentLogin(studentData) {
        setStudent(studentData);

        localStorage.setItem(
            "student",
            JSON.stringify(studentData)
        );

        setCurrentPage("dashboard");
    }

    function handleStudentLogout() {
        localStorage.removeItem("student");

        setStudent(null);

        setCurrentPage("home");
    }

    function handleAdminLogin(adminToken, adminData) {
        if (!adminToken) {
            alert("Admin login failed, No token received.");
            return;
        }

        localStorage.setItem("adminToken", adminToken);

        setToken(adminToken);
        setAdmin(adminData);

        localStorage.removeItem("student");
        setStudent(null);

        setCurrentPage("adminDashboard");
    }

    function handleAdminLogout() {
        localStorage.removeItem("adminToken");

        setToken("");
        setAdmin(null);

        setCurrentPage("home");
    }

    if (currentPage === "home") {
        return (
            <Home
                setCurrentPage={setCurrentPage}
            />
        );
    }

    if (currentPage === "login") {
        return (
            <StudentLogin
                onLogin={handleStudentLogin}
            />
        );
    }

    if (currentPage === "adminLogin") {
        return (
            <AdminLogin
                onLogin={handleAdminLogin}
                setCurrentPage={setCurrentPage}
            />
        );
    }

    if (currentPage === "dashboard" && student) {
        return (
            <StudentDashboard
                student={student}
                setCurrentPage={setCurrentPage}
                onLogOut={handleStudentLogout}
            />
        );
    }

    if (currentPage === "courses" && student) {
        return (
            <Courses
                student={student}
                setCurrentPage={setCurrentPage}
            />
        );
    }

    if (currentPage === "mycourses" && student) {
        return (
            <MyCourses
                student={student}
                setCurrentPage={setCurrentPage}
            />
        );
    }

    if (currentPage === "profile" && student) {
        return (
            <Profile
                student={student}
                setCurrentPage={setCurrentPage}
            />
        );
    }

    if (currentPage === "adminDashboard" && admin && token) {
        return (
            <AdminDashboard
                admin={admin}
                setCurrentPage={setCurrentPage}
                onLogout={handleAdminLogout}
            />
        );
    }

    if (currentPage === "adminStudents" && admin && token) {
        return (
            <AdminStudents
                token={token}
                setCurrentPage={setCurrentPage}
                setSelectedStudent={setSelectedStudent}
            />
        );
    }

    if (currentPage === "adminCourses" && admin && token) {
        return (
            <AdminCourses
                token={token}
                setCurrentPage={setCurrentPage}
                setSelectedCourse={setSelectedCourse}
            />
        );
    }

    

if (currentPage === "addStudent") {
  return (
    <AddStudent setCurrentPage={setCurrentPage} />
  );
}

if (currentPage === "editStudent") {
  return (
    <EditStudent
      student={selectedStudent}
      setCurrentPage={setCurrentPage}
    />
  );
}

if (currentPage === "addCourse") {
  return (
    <AddCourse setCurrentPage={setCurrentPage} />
  );
}

if (currentPage === "editCourse") {
  return (
    <EditCourse
      course={selectedCourse}
      setCurrentPage={setCurrentPage}
    />
  );
}

    return (
        <Home
            setCurrentPage={setCurrentPage}
        />
    );
}

export default App;