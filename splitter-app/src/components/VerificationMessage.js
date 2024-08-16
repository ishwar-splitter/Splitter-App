import React from 'react';

function VerificationMessage({ onBackToLogin }) {
    return (
        <div className='form'>
            <h2>Verification Email Sent</h2>
            <p>A verification link has been sent to your email. Please check your inbox and click the link to verify your account.</p>
            <button onClick={onBackToLogin}>Back to Login</button>
        </div>
    );
}

export default VerificationMessage;