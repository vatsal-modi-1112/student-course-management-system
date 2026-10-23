import { useEffect, useState } from "react";

function AdminCourses({ setCurrentPage, setSelectedCourse }) {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");

  const loadCourses = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/courses"
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load learning courses.");
        return;
      }

      setCourses(Array.isArray(data) ? data : data.courses || []);
      setMessage("");
    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to delete course.");
        return;
      }

      setMessage("Learning course deleted successfully.");
      loadCourses();
    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="container">
      <h2>Manage Learning Courses</h2>

      <button onClick={() => setCurrentPage("addCourse")}>
        Add Learning Course
      </button>

      {message && <p>{message}</p>}

      <table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Duration</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course.name}</td>
              <td>{course.duration}</td>
              <td>{course.description}</td>

              <td>
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setCurrentPage("editCourse");
                  }}
                >
                  Edit
                </button>

                <button onClick={() => deleteCourse(course._id)}>
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

export default AdminCourses;