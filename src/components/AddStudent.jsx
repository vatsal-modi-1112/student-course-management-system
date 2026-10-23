import { useState } from "react";

function AddStudent({ setCurrentPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setMessage("Please login as admin first.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            email,
            password,
            course
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to add student.");
        return;
      }

      alert("Student added successfully!");

      setCurrentPage("adminStudents");
    } catch (error) {
      console.log(error);
      setMessage("Unable to connect to the server.");
    }
  }

  return (
    <div className="page">
      <div className="form-container">
        <h2>Add Student</h2>

        <form onSubmit={handleSubmit}>
          <label>Student Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student name"
            required
          />

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
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

          <button type="submit" className="primary-btn">
            Add Student
          </button>
        </form>

        {message && <p>{message}</p>}

        <button
          type="button"
          className="secondary-btn"
          onClick={() => setCurrentPage("adminStudents")}
        >
          Back to Students
        </button>
      </div>
    </div>
  );
}

export default AddStudent;