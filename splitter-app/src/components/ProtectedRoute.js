import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { userpool } from '../userpool';

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const user = userpool.getCurrentUser();
        if (user) {
            user.getSession((err, session) => {
                if (err) {
                    setIsAuthenticated(false);
                } else if (session.isValid()) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
                setIsLoading(false);
            });
        } else {
            setIsAuthenticated(false);
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;