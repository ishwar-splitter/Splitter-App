import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "./AuthForm.css";

function PasswordChangeForm({ onSubmit }) {
    const [pin, setPin] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        onSubmit({ pin, newPassword });
    };

    return (
        <form onSubmit={handleSubmit} className='form'>
            <h2>Change Password</h2>
            <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                required
            />
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                required
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Change Password</button>
        </form>
    );
}

PasswordChangeForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default PasswordChangeForm;