import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
    // Aquí puedes verificar la presencia del token o cualquier otro método de autenticación
    return !!localStorage.getItem('authToken'); // Ejemplo simple
};

const ProtectedRoute = ({ element }) => {
    const location = useLocation();
    
    return isAuthenticated() ? element : <Navigate to="/" state={{ from: location }} />;
};

export default ProtectedRoute;
