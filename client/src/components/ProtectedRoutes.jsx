import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

export const ProtectedRoutes = ({ children }) => {
    const { isAuthenticated } = useSelector(state => state.auth);

    // Redirect to login if the user is not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return children;
}

// AuthenticatedUser: Prevents authenticated users from accessing login/register pages
export const AuthenticatedUser = ({ children }) => {
    const { isAuthenticated } = useSelector(state => state.auth);

    // Redirect to home if the user is already authenticated
    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return children;
}

// AdminRoute: Ensures only users with the "instructor" role can access admin pages
export const AdminRoute = ({ children }) => {
    const { user, isAuthenticated } = useSelector(state => state.auth);

    // Redirect to login if the user is not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Check if the user's role is "instructor" (admin)
    if (user?.role !== "instructor") {
        return <Navigate to="/" replace />
    }

    return children;
}