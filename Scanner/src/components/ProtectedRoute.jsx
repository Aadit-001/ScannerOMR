import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/firebase_configuration';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !auth.currentUser) {
    // Redirect to error page if not authenticated
    return <Navigate to="/error" replace />;
  }

  return children;
};

export default ProtectedRoute;
