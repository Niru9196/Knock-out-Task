import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { FirebaseProvider } from './context/Firebase';
import React from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ProtectedRoute } from './config/proctectedRoutes/ProctectedRoutes';
import './index.css'
import App from './App';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
         <App /> 
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Login />,
  },
]);

// Render the root of the app
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FirebaseProvider>
      <RouterProvider router={router} />
    </FirebaseProvider>
  </React.StrictMode>
);
