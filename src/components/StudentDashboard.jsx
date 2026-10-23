function StudentDashboard({ student, setCurrentPage, onLogOut }){
    return(
        <div className="page">
            <header className="header">
                <h2>Student Portal</h2>

                 <button className="logout-btn" onClick={onLogOut}>LogOut</button>

            </header>
            

            <main className="Content">

                <div className="Welcome">
                    <h2>Welcome, {student.name}</h2>
                    <p>
                        Manage your courses and profile from here.
                    </p>
                </div>


                <div className="menu">
                    <button onClick={()=>setCurrentPage("dashboard")}>Dashboard</button>

                    <button onClick={()=>{console.log("Button is Clicked!");setCurrentPage("courses")}}>Courses</button>

                    <button onClick={()=>setCurrentPage("mycourses")}>My Courses</button>

                    <button onClick={()=>setCurrentPage("profile")}>Profile</button>

                </div>

                <div className="cards">
                    <div className="card">
                        <h3>Available Courses</h3>

                        <p>View</p>
                        
                        <button onClick={()=>setCurrentPage("courses")}>View Courses</button>
                    </div>

                    <div className="card">
                        <h3>My Courses</h3>
                        
                        <p>View</p>

                        <button onClick={()=>setCurrentPage("mycourses")}>View My Courses</button>
                    </div>

                    <div className="card">
                        <h3>Student Profile</h3>
                        
                        <p>&#10003;</p>

                        <button onClick={()=>setCurrentPage("profile")}>View Profile</button>
                    </div>

                </div>

            </main>

        </div>
    
    );
}

export default StudentDashboard;