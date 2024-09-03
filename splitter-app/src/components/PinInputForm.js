// 


import React, { useState } from 'react';
import "./AuthForm.css";
import PropTypes from 'prop-types';

function PinInputForm({ onSubmit }) {
    const [pin, setPin] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(pin);
    };

    return (
        <form onSubmit={handleSubmit} className='form'>
            <h2>Enter PIN</h2>
                <input
                    type="text"
                    id="pin"
                    value={pin}
                    placeholder="PIN"
                    onChange={(e) => setPin(e.target.value)}
                    required
                    maxLength="6"
                    pattern="\d{6}"
                />
            <button type="submit">Verify PIN</button>
        </form>
    );
}

PinInputForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default PinInputForm;