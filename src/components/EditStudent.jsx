import { useState } from "react";

function EditStudent({ student, setCurrentPage }) {
  const [name, setName] = useState(student?.name || "");
  const [email, setEmail] = useState(student?.email || "");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState(student?.course || "");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!student?._id) {
      setMessage("Student ID is missing.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setMessage("Please login as admin first.");
        return;
      }

      const updatedData = {
        name,
        email,
        course
      };

      if (password.trim() !== "") {
        updatedData.password = password;
      }

      const response = await fetch(
        `http://localhost:5000/api/students/${student._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to update student.");
        return;
      }

      alert("Student updated successfully!");

      setCurrentPage("adminStudents");
    } catch (error) {
      console.log(error);
      setMessage("Unable to connect to the server.");
    }
  }

  if (!student) {
    return (
      <div className="page">
        <p>No student selected.</p>

        <button onClick={() => setCurrentPage("adminStudents")}>
          Back to Students
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="form-container">
        <h2>Update Student</h2>

        <form onSubmit={handleSubmit}>
          <label>Student Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Degree Programme</label>

          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            <option value="">Select Programme</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="BBA">BBA</option>
            <option value="MBA">MBA</option>
            <option value="B.Com">B.Com</option>
            <option value="M.Com">M.Com</option>
            <option value="B.Sc">B.Sc</option>
            <option value="M.Sc">M.Sc</option>
          </select>

          <label>New Password (Optional)</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />

          <button type="submit" className="primary-btn">
            Update Student
          </button>
        </form>

        {message && <p>{message}</p>}

        <button
          type="button"
          className="secondary-btn"
          onClick={() => setCurrentPage("adminStudents")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditStudent;