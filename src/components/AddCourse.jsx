import { useState } from "react";

function AddCourse({ setCurrentPage }) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {

      const token = localStorage.getItem("adminToken");

      if (!token) {
        setMessage("Please login as admin first.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/courses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            duration,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to add course.");
        return;
      }

      alert("Learning course added successfully!");
      setCurrentPage("adminCourses");
    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="container">
      <h2>Add Learning Course</h2>

      <form onSubmit={handleSubmit}>
        <label>Course Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Example: React.js"
          required
        />

        <label>Duration</label>
        <input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Example: 2 Months"
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">Add Course</button>
      </form>

      {message && <p>{message}</p>}

      <button onClick={() => setCurrentPage("adminCourses")}>
        Back
      </button>
    </div>
  );
}

export default AddCourse;