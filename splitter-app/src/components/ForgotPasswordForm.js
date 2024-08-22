import React, { useState } from 'react';
import "./forgotPasswordForm.css";

function ForgotPasswordForm({ onSubmit, onBackToLogin }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError("Please enter an email address.");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setError("");
        onSubmit({ email });
    };

    return (
        <form onSubmit={handleResetPassword} className='form'>
            <h2>Forgot Password</h2>
            <p>Enter your email address to reset your password.</p>
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" 
                required 
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Reset Password</button>
            <div className="back-to-login">
                <a href="#" onClick={onBackToLogin}>Back to Login</a>
            </div>
        </form>
    );
}

export default ForgotPasswordForm;