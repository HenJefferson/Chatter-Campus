
import { createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import DashboardHome from './pages/DashboardHome'
import ProtectedRoute from './components/ProtectedRoute'
import SpacesList from './components/SpacesList'
import ChatView from './components/ChatView'
import Announcements from './components/Announcements'
import AdminPanel from './pages/AdminPanel'
import DirectMessages from './pages/DirectMessages'

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
        children: [
            {
                path: '/',
                element: <DashboardHome />,
            },
            {
                path: 'profile',
                element: <Profile />,
            },
            {
                path: 'spaces',
                element: <SpacesList />,
            },
            {
                path: 'announcements',
                element: <Announcements />,
            },
            {
                path: 'admin',
                element: <AdminPanel />,
            },
            {
                path: 'spaces/:spaceId',
                element: <ChatView />,
            },
            {
                path: 'direct-messages',
                element: <DirectMessages />,
            },
            {
                path: 'direct-messages/:userId',
                element: <DirectMessages />,
            },
        ],
    },
]);

export default router
