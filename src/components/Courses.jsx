import { useEffect, useMemo, useState } from "react";

function Courses({ student, setCurrentPage }){

    const [courses, setCourses]=useState([]);
    const [message, setMessage]=useState("");
    const [searchText, setSearchText] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("All");
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(()=>{
        async function loadCourses() {
            try {
                setLoading(true);

                const response = await fetch("http://localhost:5000/api/courses");

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load courses." 
                    );
                }

                setCourses(Array.isArray(data) ? data : []);
                setMessage("");
        
            } catch (error) {
                console.log("Course loading Error:",error);
                setMessage("Unable to load courses. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        loadCourses();
    }, []);

    const durations = useMemo(() => {
        return [
            ...new Set(
                courses
                    .map((course) => course.duration)
                    .filter(Boolean)
            ),
        ];
    }, [courses]);

    const filteredCourses = useMemo(() => {
        const search = searchText.trim().toLowerCase();

        return courses.filter((course) => {
            const matchesSearch = 
            (course.name || "").toLowerCase().includes(search) ||
            (course.description || "").toLowerCase().includes(search);

            const matchesDuration = 
                selectedDuration === "All" ||
                course.duration === selectedDuration;
            
            return matchesSearch && matchesDuration;
        });
    }, [courses, searchText, selectedDuration]);

    function clearFilters() {
        setSearchText("");
        setSelectedDuration("All");
    }

    async function enrollCourse(courseId) {
        if (!student || !student._id) {
            setMessage("Please login before enrolling in a course.");
            return;
        }

        try{
            setMessage("");

            const response= await fetch("http://localhost:5000/api/enrollments", 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        studentId: student._id,
                        courseId,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Enrollment failed.");
                return;
            }

            setMessage(data.message || "Enrollment successful.");
        } catch (error) {
            
            console.log("Enrollment error:", error);
            
            setMessage("Unable to connect to the server.");
        }
        
    };

    async function viewCourseDetails(courseId) {
        try {
            setMessage("");

            const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Unable to load course details.");
                return;
            }

            setSelectedCourse(data);
        
        } catch (error) {
            console.error("Course details error:", error);
            setMessage("Unable to connect to the server.");
        }
    }

    
    return(
        <div className="page">
            <header className="header">
                <div>
                    <h2>Student Portal</h2>
                    <p className="header-subtitle">
                        Discover your next learning opportunity
                    </p>
                </div>

                <button className="logout-btn" onClick={() => setCurrentPage("login")}>
                    LogOut
                </button>
            </header>

            <main className="content">
                <div className="page-heading">
                    <div>
                        <h1>Explore Courses</h1>
                        <p className="page-description">
                            Search and filter courses that interest you
                        </p>
                    </div>

                    <span className="result-count">
                        {filteredCourses.length} course(s) found
                    </span>
                </div>

                <div className="filter-panel">
                    <div className="filter-field">
                        <label htmlFor="courseSearch">
                            Search Courses
                        </label>

                        <input 
                            id="courseSearch"
                            type="text"
                            placeholder="Search by name or description..."
                            value={searchText}
                            onChange={(e) => 
                                setSearchText(e.target.value)
                            }
                        />
                    </div>

                    <div className="filter-field">
                        <label htmlFor="durationFilter">
                            Filter by Duration
                        </label>

                        <select
                            id="durationFilter"
                            value={selectedDuration}
                            onChange={(e) =>
                                setSelectedDuration(e.target.value)
                            }
                        >
                            <option value="All">All Durations</option>

                            {durations.map((duration) => (
                                <option key={duration} value={duration}>
                                    {duration}
                                </option>
                            ))}
                        </select> 
                    </div>

                    <button
                        type="button"
                        className="secondary-btn clear-btn"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>
                </div>

                {message && (
                    <div className="notice" role="status">
                        {message}
                    </div>
                )}

                {loading ? (
                    <div className="empty-state">
                        Loading courses...
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="empty-state">
                        <h3>No matching courses found</h3>
                        <p>
                            Try another search term or clear your filters.
                        </p>

                        <button
                            className="secondary-btn"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="course-list">
                        {filteredCourses.map((course) => (
                            <article className="course-card" key={course._id}>
                                <span className="course-label">
                                    Learning Course
                                </span>

                                <h3>{course.name}</h3>

                                <p>
                                    <strong>Duration:</strong>{" "}
                                    {course.duration}
                                </p>

                                <p className="course-description">
                                    {course.description}
                                </p>

                                <div className="course-actions">
                                    <button  
                                        className="secondary-btn" 
                                        onClick={() => viewCourseDetails(course._id)}
                                    >
                                        View Details
                                    </button>
                                    
                                    <button 
                                        onClick={()=> enrollCourse(course._id)}
                                    >
                                        Enroll
                                    </button>
                                </div>
                            </article>
                        ))}
                    
                    </div>
                )}

                <button className="back-btn" onClick={() => setCurrentPage("dashboard")}>
                    Back to Dashboard
                </button>
            </main>

            {selectedCourse && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedCourse(null)}
                >
                    <section
                        className="course-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="courseModalTitle"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="modal-close"
                            aria-label="Close course details"
                            onClick={() => setSelectedCourse(null)}
                        >
                            &times;
                        </button>

                        <span className="course-label">
                            Course Details
                        </span>

                        <h2 id="courseModalTitle">
                            {selectedCourse.name}
                        </h2>

                        <div className="detail-item">
                            <strong>Duration</strong>
                            <p>{selectedCourse.duration}</p>
                        </div>

                        <div className="detail-item">
                            <strong>Description</strong>
                            <p>{selectedCourse.description}</p>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={() => {
                                    enrollCourse(selectedCourse._id);
                                }}
                            >
                                Enroll in This Course
                            </button>

                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() => setSelectedCourse(null)}
                            >
                                Close
                            </button>
                        </div>
                    </section>
                </div>
            )}

        </div>
    );

}
export default Courses;