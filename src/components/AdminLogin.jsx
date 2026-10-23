import { useState } from "react";

function AdminLogin({ onLogin, setCurrentPage }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage]= useState("");

    async function handleLogin(e) {
        e.preventDefault();

        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/admin/login",
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
                setMessage(data.message || "Admin login failed");
                
                return;  
            }
            onLogin(data.token, data.admin); 

        } catch (error) {
            console.log(error);

            setMessage("Unable to connect to server");
        }
    }

    return(
        <div className="login-container">

            <div className="login-box">

                <h1>Admin Login</h1>

                <form onSubmit={handleLogin}>

                    <label>Email</label>

                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}  required/>
                    
                    <label>Password</label>

                    <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required/>

                    <button type="Submit" className="primary-btn">
                        Login
                    </button>

                </form>

                {message && <p>{message}</p>}

                <button type="button" onClick={() => setCurrentPage("home")} className="primary-btn">
                    Back
                </button>

            </div>

        </div>
    );
}

export default AdminLogin;