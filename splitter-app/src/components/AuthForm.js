import React, { useState } from "react";
import "./AuthForm.css"

const API_URL = process.env.REACT_APP_API_URL;

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [resetSuccess, setResetSuccess] = useState(false);
    const [showVerificationMessage, setShowVerificationMessage] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? "/login" : "/signup";
        const body = isLogin ? {
            "email": email,
            "password": password
        } : {
            "name": name,
            "email": email,
            "password": password
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();

            if (response.ok) {
                if (!isLogin) {
                    setShowVerificationMessage(true);
                } else {
                    alert(data.message);
                    console.log("login success", data);
                }
            } else {
                alert(data.error);
                console.log("login error", data);
            }
        } catch (error) {
            console.log(error);
            alert("An error occurred while processing your request. Please try again later.");
        }
    }

    return (
        <div className='container'>
            <div className='form-container'>
                <h1 className="project-title">Splitter App</h1>
                {!isForgotPassword && (
                    <div className="form-toggle">
                        <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
                        <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>SignUp</button>
                    </div>
                )}
                {!isLogin && !isForgotPassword && showVerificationMessage ? (
                    <div className='form'>
                        <h2>Verification Email Sent</h2>
                        <p>A verification link has been sent to your email. Please check your inbox and click the link to verify your account.</p>
                        <button onClick={() => { setIsLogin(true); setShowVerificationMessage(false); }}>Back to Login</button>
                    </div>
                ) : isLogin && !isForgotPassword ?

                        <form onSubmit={handleSubmit} className='form'>
                            <h2>Login Form</h2>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotPassword(true); }}>Forgot Password?</a>
                            <button>Login</button>
                            <p>Not a Member? <a href="" onClick={() => setIsLogin(false)}>Signup now!</a></p>
                        </form>

                        : !isLogin && !isForgotPassword ?

                            <form onSubmit={handleSubmit} className='form'>
                                <h2>SignUp Form</h2>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                                <button>Signup</button>
                                <p>Already a Member? <a href="" onClick={() => setIsLogin(true)}>Login Here!</a></p>
                            </form>

                            :
                            <div className='form'>
                                <h2>Forgot Password</h2>
                                <p>Enter your email address to reset your password.</p>
                                <input type="email" placeholder="Email" />
                                <button>Reset Password</button>
                                <p><a href="" onClick={() => setIsForgotPassword(false)}>Back to Login</a></p>

                            </div>
                }
            </div>
        </div>
    )
}

export default AuthForm;