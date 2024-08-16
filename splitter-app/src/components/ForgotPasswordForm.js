import React, { useState } from 'react';

function ForgotPasswordForm({ onBackToLogin }) {
    const [email, setEmail] = useState("");
    const [resetLinkSent, setResetLinkSent] = useState(false);

    const handleResetPassword = (e) => {
        e.preventDefault();
        // Implement password reset logic here
        setResetLinkSent(true);
    };

    return (
        <div className='form'>
            <h2>Forgot Password</h2>
            {!resetLinkSent ? (
                <>
                    <p>Enter your email address to reset your password.</p>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <button onClick={handleResetPassword}>Reset Password</button>
                    </>
            ) : (
                <>
                <p>Password reset link has been sent to the registered email.</p>
                <button onClick={(e) => { e.preventDefault(); onBackToLogin(); }}>Back to Login</button>
</>
            )}
        </div>
    );
}

export default ForgotPasswordForm;