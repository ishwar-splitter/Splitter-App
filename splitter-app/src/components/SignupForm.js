import React, { useState } from 'react';

function SignupForm({ onSubmit, onSwitchToLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, email, password });
    };

    return (
        <form onSubmit={handleSubmit} className='form'>
            <h2>SignUp Form</h2>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button>Signup</button>
            <p>Already a Member? <a href="" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Login Here!</a></p>
        </form>
    );
}

export default SignupForm;