import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "./AuthForm.css";

function PasswordChangeForm({ onSubmit }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword === confirmPassword) {
            onSubmit(newPassword);
        } else {
            alert("Passwords don't match");
        }
    };

    return (
        <form onSubmit={handleSubmit} className='form'>
            <h2>Change Password</h2>
                <input
                    type="password"
                    id="newPassword"
                    placeholder='New Password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength="8"
                />
                <input
                    type="password"
                    id="confirmPassword"
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="8"
                />
            <button type="submit">Change Password</button>
        </form>
    );
}

PasswordChangeForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default PasswordChangeForm;