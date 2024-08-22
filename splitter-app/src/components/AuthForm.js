import React, { useState } from "react";
import "./AuthForm.css";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import VerificationMessage from "./VerificationMessage";
import NotificationModal from "./NotificationModal";

const API_URL = process.env.REACT_APP_API_URL;

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [showVerificationMessage, setShowVerificationMessage] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleSubmit = async (formData) => {
        let endpoint;
        
        // Determine the endpoint based on the current state and formData
        if (isForgotPassword) {
            endpoint = "/auth/forgotpassword";
            console.log("Forgot password submission detected");
        } else if (isLogin) {
            endpoint = "/auth/login";
        } else {
            endpoint = "/auth/signup";
        }

        try {
            console.log(`Submitting ${endpoint} data:`, formData);
            console.log(`API URL: ${API_URL}${endpoint}`);

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                if (isForgotPassword) {
                    setNotification({ message: "Password reset link sent to your email", type: "success" });
                    setIsForgotPassword(false);
                    setIsLogin(true);
                } else if (!isLogin) {
                    setShowVerificationMessage(true);
                } else {
                    setNotification({ message: data.message || "Login successful", type: "success" });
                    console.log("Login success", data);
                    // Here you might want to store the user's token or redirect them
                }
            } else {
                setNotification({ message: data.error || "An error occurred", type: "error" });
                console.error("Request error", data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setNotification({ message: "An error occurred. Please try again later.", type: "error" });
        }
    };

    const renderForm = () => {
        if (showVerificationMessage) {
            return <VerificationMessage onBackToLogin={() => { setIsLogin(true); setShowVerificationMessage(false); }} />;
        }
        if (isForgotPassword) {
            return <ForgotPasswordForm onSubmit={handleSubmit} onBackToLogin={() => setIsForgotPassword(false)} />;
        }
        if (isLogin) {
            return <LoginForm onSubmit={handleSubmit} onForgotPassword={() => setIsForgotPassword(true)} onSwitchToSignup={() => setIsLogin(false)} />;
        }
        return <SignupForm onSubmit={handleSubmit} onSwitchToLogin={() => setIsLogin(true)} />;
    };

    return (
        <div className='container'>
            <div className='form-container'>
                <h1 className="project-title">Splitter App</h1>
                {!isForgotPassword && !showVerificationMessage && (
                    <div className="form-toggle">
                        <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
                        <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>SignUp</button>
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