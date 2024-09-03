import React, { useState } from "react";
import "./AuthForm.css";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import PasswordChangeForm from "./PasswordChangeForm";
import VerificationMessage from "./VerificationMessage";
import NotificationModal from "./NotificationModal";
import { CognitoUserAttribute, CognitoUser } from "amazon-cognito-identity-js";
import { userpool} from '../userpool';


import { authenticate } from "../services/authenticate";

import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || `http://ishwarapi.dev.bibek65.tech/api`;

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
            const data = await authenticate(formData.email, formData.password);
            console.log(data);
            showNotification(data.message || "Login successful", "success");
            navigate("/expenses");
            // Handle successful login (e.g., store token, redirect)
        } catch (error) {
            showNotification(error.message, "error");
        }
    };

    const handleSignup = async (formData) => {
        const attributeList = [
            new CognitoUserAttribute({
                Name: 'email',
                Value: formData.email,
            }),
            new CognitoUserAttribute({
                Name: 'name',
                Value: formData.name,
            })
        ];
          
          
        try {
            
            userpool.signUp(formData.email, formData.password, attributeList, null, (error, result) => {
                if (error) {
                    showNotification(error.message, "error");
                } else {
                    try{
                        handleApiRequest("/auth/signup", {
                            email: formData.email,
                            name: formData.name,
                            cognitoId: result.userSub
                        });
                        showNotification("Signup successful", "success");
                        setFormState('verificationMessage');
                    } catch (error) {
                        showNotification(error.message, "error");
                    }
                    
                }
            });
        } catch (error) {
            showNotification(error.message, "error");
        }
    };

    const handleForgotPassword = async (formData) => {
       try {
           const user = new CognitoUser({
            Username: formData.email,
            Pool: userpool
           });
           user.forgotPassword({
            onSuccess: (data) => {
                showNotification("Password reset PIN sent to your email", "success");
                setResetData({ email: formData.email, pin: '' });
                setFormState('passwordChange');
            },
            onFailure: (error) => {
                showNotification(error.message, "error");
            }
           });
       } catch (error) {
        showNotification(error.message, "error");
       }
    };


    const handlePasswordChange = async (formData) => {
        try {
            const user = new CognitoUser({
                Username: resetData.email,
                Pool: userpool
            });
            user.confirmPassword(formData.pin, formData.newPassword, {
                onSuccess: () => {
                    showNotification("Password changed successfully", "success");
                    setFormState('login');
                },
                onFailure: (error) => {
                    showNotification(error.message, "error");
                }
            });
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