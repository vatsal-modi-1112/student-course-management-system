import { useEffect, useState } from "react";

function MyCourses({ student, setCurrentPage }) {

    const [myCourses, setMyCourses] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {

        // If no student is logged in
        if (!student || !student._id) {
            setMessage("Please login first.");
            return;
        }

        fetch(`http://localhost:5000/api/enrollments/student/${student._id}`)
            .then((response) => response.json())
            .then((data) => {

                if (Array.isArray(data)) {
                    setMyCourses(data);
                    setMessage("");
                } else {
                    setMessage(data.message || "No courses found.");
                }

            })
            .catch((error) => {
                console.log("Error:", error);
                setMessage("Unable to load courses.");
            });

    }, [student]);


    return (
        <div className="page">

            <header className="header">
                <h2>Student Portal</h2>
                
                <button className="logout-btn"onClick={()=>setCurrentPage("login")}>LogOut</button>
                
            </header>

            <main className="content">

                <h2>My Enrolled Courses</h2>

                {message && (
                    <p>{message}</p>
                )}

                <div className="course-list">

                    {myCourses.map((item) => (

                        <div className="course-card" key={item._id}>

                            <h3>{item.course.name}</h3>

                            <p>
                                <strong>Duration:</strong>{" "}
                                {item.course.duration}
                            </p>

                            <p>
                                {item.course.description}
                            </p>

                            <span className="status">
                                Status: {item.status}
                            </span>

                        </div>

                    ))}

                </div>

                <button
                    className="back-btn"
                    onClick={() => setCurrentPage("dashboard")}
                >
                    Back to Dashboard
                </button>

            </main>

        </div>
    );
}

export default MyCourses;