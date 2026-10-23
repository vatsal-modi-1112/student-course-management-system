import { useEffect, useState } from "react";

function AdminDashboard({ admin, setCurrentPage, onLogout }) {
    const [statistics, setStatistics] = useState({
        totalStudents: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        mostPopularCourse: null,
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function loadStatistics() {
            try {
                const token = localStorage.getItem("adminToken");

                if (!token) {
                    setMessage("Please log in as admin.");
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/admin/statistics",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setMessage(
                        data.message ||
                        "Unable to load dashboard statistics."
                    );
                    return;
                }

                setStatistics(data);
                setMessage("");
            } catch (error) {
                console.error("Statistics loading error:", error);
                setMessage("Unable to connect to the server.");
            } finally {
                setLoading(false);
            }
        }

        loadStatistics();
    }, []);

    return (
        <div className="page">
            <header className="header">
                <div>
                    <h2>Admin Dashboard</h2>
                    <p className="header-subtitle">
                        Student Course Management System
                    </p>
                </div>

                <button
                    className="logout-btn"
                    onClick={onLogout}
                >
                    Log Out
                </button>
            </header>

            <main className="content">
                <section className="welcome">
                    <h1>
                        Welcome, {admin?.name || "Admin"}
                    </h1>

                    <p>
                        View system statistics and manage student
                        and course records.
                    </p>
                </section>

                <div className="page-heading">
                    <div>
                        <h2>Dashboard Overview</h2>
                        <p className="page-description">
                            Summary of your current system data.
                        </p>
                    </div>
                </div>

                {message && (
                    <div className="notice" role="status">
                        {message}
                    </div>
                )}

                {loading ? (
                    <div className="empty-state">
                        Loading dashboard statistics...
                    </div>
                ) : (
                    <div className="cards">
                        <div className="card stat-card">
                            <span className="stat-label">
                                Total Students
                            </span>

                            <p className="stat-number">
                                {statistics.totalStudents}
                            </p>

                            <span className="stat-caption">
                                Registered students
                            </span>
                        </div>

                        <div className="card stat-card">
                            <span className="stat-label">
                                Total Courses
                            </span>

                            <p className="stat-number">
                                {statistics.totalCourses}
                            </p>

                            <span className="stat-caption">
                                Available course records
                            </span>
                        </div>

                        <div className="card stat-card">
                            <span className="stat-label">
                                Total Enrollments
                            </span>

                            <p className="stat-number">
                                {statistics.totalEnrollments}
                            </p>

                            <span className="stat-caption">
                                Recorded enrollments
                            </span>
                        </div>

                        <div className="card stat-card popular-card">
                            <span className="stat-label">
                                Most Popular Course
                            </span>

                            <p className="popular-course-name">
                                {statistics.mostPopularCourse
                                    ? statistics.mostPopularCourse.courseName
                                    : "No enrollments yet"}
                            </p>

                            {statistics.mostPopularCourse && (
                                <span className="stat-caption">
                                    {statistics.mostPopularCourse.enrollmentCount}{" "}
                                    enrollment(s)
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <section className="dashboard-section">
                    <h2>Management</h2>

                    <div className="menu">
                        <button
                            onClick={() =>
                                setCurrentPage("adminStudents")
                            }
                        >
                            Student Management
                        </button>

                        <button
                            onClick={() =>
                                setCurrentPage("adminCourses")
                            }
                        >
                            Course Management
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Dashboard
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;