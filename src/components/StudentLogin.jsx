import { useState } from "react";

function StudentLogin({onLogin}){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/students/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            // Save student information
            localStorage.setItem(
                "student",
                JSON.stringify(data.student)
            );

            onLogin(data.student);

        } catch (error) {
            console.log(error);
            setMessage("Unable to connect to server");
        }
    };

    

    return(
        <div className="login-container">

            <div className="login-box">

                <h1>Student Login</h1>

                <p className="login-text">
                    Student Course Management System
                </p>

                <form onSubmit={handleLogin}>

                    <label>Email</label>

                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}  />
                    
                    <label>Password</label>

                    <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button type="Submit" className="primary-btn">
                        Login
                    </button>

                </form>


            </div>

        </div>
    );
}

export default StudentLogin;

