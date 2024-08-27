import React, { useState } from "react";
import "./AuthForm.css";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import PinInputForm from "./PinInputForm";
import PasswordChangeForm from "./PasswordChangeForm";
import VerificationMessage from "./VerificationMessage";
import NotificationModal from "./NotificationModal";

import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || `http://localhost:4000/api`;

function AuthForm() {
    const navigate = useNavigate();
    const [formState, setFormState] = useState('login');
    const [notification, setNotification] = useState(null);
    const [resetData, setResetData] = useState({ email: '', pin: '' });

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const handleApiRequest = async (endpoint, formData) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            return await response.json();
        } catch (error) {
            console.error("Fetch error:", error);
            throw new Error("An error occurred. Please try again later.");
        }
    };

    const handleLogin = async (formData) => {
        try {
            const data = await handleApiRequest("/auth/login", formData);
            showNotification(data.message || "Login successful", "success");
            navigate("/expenses");

            // Handle successful login (e.g., store token, redirect)
        } catch (error) {
            showNotification(error.message, "error");
        }
    };

    const handleSignup = async (formData) => {
        try {
            await handleApiRequest("/auth/signup", formData);
            setFormState('verificationMessage');
        } catch (error) {
            showNotification(error.message, "error");
        }
    };

    const handleForgotPassword = async (formData) => {
        try {
            await handleApiRequest("/auth/forgotpassword", formData);
            setResetData({ ...resetData, email: formData.email });
            setFormState('pinInput');
            showNotification("Password reset PIN sent to your email", "success");
        } catch (error) {
            showNotification(error.message, "error");
        }
    };

    const handlePinVerification = async (pin) => {
        try {
            await handleApiRequest("/auth/verifypin", { email: resetData.email, pin });
            setResetData({ ...resetData, pin });
            setFormState('passwordChange');
            showNotification("PIN verified successfully", "success");
        } catch (error) {
            showNotification(error.message, "error");
        }
    };

    const handlePasswordChange = async (newPassword) => {
        try {
                const resetPayload = {
                    email: resetData.email,
                    pin: resetData.pin,
                    newPassword
                };
            await handleApiRequest("/auth/resetpassword", resetPayload);
            setFormState('login');
            showNotification("Password changed successfully", "success");
        } catch (error) {
            showNotification(error.message, "error");
        }
    };

    const renderForm = () => {
        switch (formState) {
            case 'login':
                return <LoginForm onSubmit={handleLogin} onForgotPassword={() => setFormState('forgotPassword')} onSwitchToSignup={() => setFormState('signup')} />;
            case 'signup':
                return <SignupForm onSubmit={handleSignup} onSwitchToLogin={() => setFormState('login')} />;
            case 'forgotPassword':
                return <ForgotPasswordForm onSubmit={handleForgotPassword} onBackToLogin={() => setFormState('login')} />;
            case 'pinInput':
                return <PinInputForm onSubmit={handlePinVerification} />;
            case 'passwordChange':
                return <PasswordChangeForm onSubmit={handlePasswordChange} />;
            case 'verificationMessage':
                return <VerificationMessage onBackToLogin={() => setFormState('login')} />;
            default:
                return null;
        }
    };

    return (
        <div className='container'>
            <div className='form-container'>
                <h1 className="project-title">Splitter App</h1>
                {(formState === 'login' || formState === 'signup') && (
                    <div className="form-toggle">
                        <button className={formState === 'login' ? "active" : ""} onClick={() => setFormState('login')}>Login</button>
                        <button className={formState === 'signup' ? "active" : ""} onClick={() => setFormState('signup')}>SignUp</button>
                    </div>
                )}
                {renderForm()}
                {notification && (
                    <NotificationModal
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </div>
        </div>
    );
}

export default AuthForm;