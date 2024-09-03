import React, { useState, useEffect } from 'react';
import './NotificationModal.css';

function NotificationModal({ message, type, onClose }) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300); // Match this with the CSS animation duration
    };

    return (
        <div className={`notification-modal ${type} ${isClosing ? 'closing' : ''}`}>
            <p>{message}</p>
            <button className="close-button" onClick={handleClose}>×</button>
        </div>
    );
}

export default NotificationModal;