import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const navLinkClass = ({ isActive }) =>
        `block px-4 py-2 rounded transition-colors ${isActive
            ? 'bg-blue-600/10 text-blue-500 font-medium border-r-2 border-blue-500 rounded-r-none'
            : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
        }`

    return (
        <div className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] border-r border-white/5 flex flex-col h-screen transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between">
                <Logo className="h-7" />
                {/* Close button for mobile */}
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-[#2a2a2a] rounded-lg md:hidden text-gray-400"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="p-4">
                <NavLink
                    to="/profile"
                    onClick={() => window.innerWidth < 768 && onClose()}
                    className={({ isActive }) => `flex items-center gap-3 p-2 rounded-xl transition-all ${isActive ? 'bg-[#2a2a2a] ring-1 ring-gray-700' : 'hover:bg-[#2a2a2a]'}`}
                >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user?.role === 'admin' ? 'from-blue-600 to-blue-400' : 'from-gray-600 to-gray-400'} flex items-center justify-center text-white font-bold shadow-lg`}>
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user?.name === 'Admin user' ? 'Admin' : user?.name}</p>
                        <p className="text-[10px] text-gray-500 truncate capitalize font-medium">{user?.role}</p>
                    </div>
                </NavLink>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-4 mb-2">Main Menu</p>
                <NavLink to="/" className={navLinkClass} onClick={() => window.innerWidth < 768 && onClose()}>
                    Dashboard
                </NavLink>
                <NavLink to="/spaces" className={navLinkClass} onClick={() => window.innerWidth < 768 && onClose()}>
                    Campus Spaces
                </NavLink>
                <NavLink to="/announcements" className={navLinkClass} onClick={() => window.innerWidth < 768 && onClose()}>
                    Announcements
                </NavLink>
                <NavLink to="/direct-messages" className={navLinkClass} onClick={() => window.innerWidth < 768 && onClose()}>
                    Direct Messages
                </NavLink>
                {user?.role === 'admin' && (
                    <NavLink to="/admin" className={navLinkClass} onClick={() => window.innerWidth < 768 && onClose()}>
                        Admin Panel
                    </NavLink>
                )}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors text-left flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                </button>
            </div>
        </div>
    )
}
