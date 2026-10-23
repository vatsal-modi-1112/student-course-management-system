import { useEffect, useState } from "react";

function AdminStudents({ setCurrentPage, setSelectedStudent }) {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  const loadStudents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/students",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load students.");
        return;
      }

      setStudents(Array.isArray(data) ? data : data.students || []);
      setMessage("");
    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to delete student.");
        return;
      }

      setMessage("Student deleted successfully.");
      loadStudents();
    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="container">
      <h2>Manage Students</h2>

      <button onClick={() => setCurrentPage("addStudent")}>
        Add Student
      </button>

      {message && <p>{message}</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Degree Programme</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.course}</td>

              <td>
                <button
                  onClick={() => {
                    setSelectedStudent(student);
                    setCurrentPage("editStudent");
                  }}
                >
                  Edit
                </button>

                <button onClick={() => deleteStudent(student._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setCurrentPage("adminDashboard")}>
        Back to Admin Dashboard
      </button>
    </div>
  );
}

export default AdminStudents;