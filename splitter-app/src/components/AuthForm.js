import React, { useState } from "react";
import "./AuthForm.css";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import VerificationMessage from "./VerificationMessage";

const API_URL = process.env.REACT_APP_API_URL;

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [showVerificationMessage, setShowVerificationMessage] = useState(false);

    const handleSubmit = async (formData) => {
        const endpoint = isLogin ? "/login" : "/signup";
        try {
            console.log(`Submitting ${isLogin ? 'login' : 'signup'} data:`, formData);
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
                if (!isLogin) {
                    setShowVerificationMessage(true);
                } else {
                    alert(data.message || "Login successful");
                    console.log("Login success", data);
                    // Here you might want to store the user's token or redirect them
                }
            } else {
                alert(data.error || "An error occurred");
                console.error("Login/Signup error", data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    const renderForm = () => {
        if (!isLogin && !isForgotPassword && showVerificationMessage) {
            return <VerificationMessage onBackToLogin={() => { setIsLogin(true); setShowVerificationMessage(false); }} />;
        }
        if (isLogin && !isForgotPassword) {
            return <LoginForm onSubmit={handleSubmit} onForgotPassword={() => setIsForgotPassword(true)} onSwitchToSignup={() => setIsLogin(false)} />;
        }
        if (!isLogin && !isForgotPassword) {
            return <SignupForm onSubmit={handleSubmit} onSwitchToLogin={() => setIsLogin(true)} />;
        }
        return <ForgotPasswordForm onBackToLogin={() => setIsForgotPassword(false)} />;
    };

    return (
        <div className='container'>
            <div className='form-container'>
                <h1 className="project-title">Splitter App</h1>
                {!isForgotPassword && (
                    <div className="form-toggle">
                        <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
                        <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>SignUp</button>
                    </div>
                )}
                {renderForm()}
            </div>
        </div>
    );
}

export default AuthForm;