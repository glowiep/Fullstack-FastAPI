// src/routes.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import ObservationsSection from './sections/Observations';
import BehaviorsSection from './sections/Behaviors';
import ReportsSection from './sections/Reports';
import ImportSection from './sections/Import';
import StudentsSection from './sections/Students';
import CoursesSection from './sections/Courses';
import AttendanceSection from './sections/Attendance';
import App from './App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/login', element: <Login /> },
    ],
  },
  { path: '/home', element: <Home /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/observations', element: <ObservationsSection /> },
  { path: '/behaviors', element: <BehaviorsSection /> },
  { path: '/reports', element: <ReportsSection /> },
  { path: '/students', element: <StudentsSection /> },
  { path: '/courses', element: <CoursesSection /> },
  { path: '/attendance', element: <AttendanceSection /> },
  { path: '/import', element: <ImportSection /> },

  // Catch-all route to redirect unknown paths to root
  { path: '*', element: <Navigate to="/home" replace /> },
]);

export default router;