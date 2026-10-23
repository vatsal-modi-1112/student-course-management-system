function Home({ setCurrentPage }) {
    return (
        <div className="login-container">

            <div className="login-box">

                <h1>Student Course Management System</h1>

                <button
                    onClick={() =>
                        setCurrentPage("login")
                    }
                    className="primary-btn"
                >
                    Student Login
                </button>

                <br /><br />

                <button
                    onClick={() =>
                        setCurrentPage("adminLogin")
                    }
                    className="primary-btn"
                >
                    Admin Login
                </button>

            </div>

        </div>
    );
}

export default Home;