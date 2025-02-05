import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../../context/Firebase'; 

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useFirebase();
  console.log("cuurent: ", currentUser)

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
