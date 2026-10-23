function Profile({ student, setCurrentPage }){
    return(
        <div className="page">

            <header className="header">
                <h2>Student Portal</h2>

                <h2>My Profile</h2>
            </header>

            <main className="content">

                <div className="profile-card">

                    <div className="profile-icon">

                    </div>

                    <h2>{student.name}</h2>

                    <div className="profile-details">

                        <p>
                            <strong>Name:</strong>
                            {student.name}
                        </p>
                        
                        <p>
                            <strong>Email:</strong>
                            {student.email}
                        </p>

                        <p>
                            <strong>Course:</strong>
                            {student.course}
                        </p>

                    
                    </div>
                
                </div>

                <button className="back-btn" onClick={()=>setCurrentPage("dashboard")}>Back to Dashboard</button>

            </main>

        </div>
    );
}
export default Profile;