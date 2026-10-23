import { useState } from "react";

function EditCourse({ course, setCurrentPage }) {
  const [name, setName] = useState(course?.name || "");
  const [duration, setDuration] = useState(course?.duration || "");
  const [description, setDescription] = useState(
    course?.description || ""
  );
  const [message, setMessage] = useState("");

  if (!course) {
    return (
      <div className="container">
        <p>No learning course selected.</p>
        <button onClick={() => setCurrentPage("adminCourses")}>
          Back
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${course._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
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
        setMessage(data.message || "Unable to update course.");
        return;
      }

      alert("Learning course updated successfully!");
      setCurrentPage("adminCourses");
    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="container">
      <h2>Edit Learning Course</h2>

      <form onSubmit={handleSubmit}>
        <label>Course Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Duration</label>
        <input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">Update Course</button>
      </form>

      {message && <p>{message}</p>}

      <button onClick={() => setCurrentPage("adminCourses")}>
        Cancel
      </button>
    </div>
  );
}

export default EditCourse;