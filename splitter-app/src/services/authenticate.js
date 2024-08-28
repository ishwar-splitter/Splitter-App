import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { userpool } from "../userpool";
import { setUserSession, clearUserSession } from "../components/userSession";
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
                const userAttributes = result.getIdToken().payload;
                const userData = {
                    id: userAttributes.sub,
                    name: userAttributes.name,
                    email: userAttributes.email
                };
                setUserSession(userData);
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
        clearUserSession();
        window.location.href = "/";
        console.log("User signed out successfully");
    } else {
        console.log("No user to sign out");
    }
}