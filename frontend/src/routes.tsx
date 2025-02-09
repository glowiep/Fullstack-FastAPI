// src/routes.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import ObservationsSection from './sections/Observations';
import App from './App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/home', element: <Home /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/observations', element: <ObservationsSection /> },

  // Catch-all route to redirect unknown paths to root
  { path: '*', element: <Navigate to="/home" replace /> },
]);

export default router;