import React, { useState } from 'react';

function LoginForm({ onSubmit, onForgotPassword, onSwitchToSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} className='form'>
            <h2>Login Form</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <a onClick={(e) => { e.preventDefault(); onForgotPassword(); }}>Forgot Password?</a>
            <button type="submit">Login</button>
            <p>Not a Member? <a onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }}>Signup now!</a></p>
        </form>
    );
}

export default LoginForm;