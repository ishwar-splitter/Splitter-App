import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { userpool } from "../userpool";

export const authenticate = async (email, password) => {
    return new Promise((resolve, reject) => {  
        const user = new CognitoUser({
            Username: email,
            Pool: userpool
        });

        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        user.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                console.log("User authenticated successfully:", result);
                resolve(result);
            },
            onFailure: (err) => {
                console.error("User authentication failed:", err);
                reject(err);
            },
        });
    });
}

export const logout = () => {
    const user = userpool.getCurrentUser();
    if (user) {
        user.signOut();
        window.location.href = "/";
        console.log("User signed out successfully");
    } else {
        console.log("No user to sign out");
    }
}