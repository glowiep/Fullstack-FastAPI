// src/routes.jsx
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
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
]);

export default router;