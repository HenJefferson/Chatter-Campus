import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Notifications from '../components/Notifications'
import UserProfileModal from '../components/UserProfileModal'
import api from '../api'

export default function Dashboard() {
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const handleOpenProfile = (e) => {
            setSelectedUserId(e.detail)
        }
        window.addEventListener('open-profile', handleOpenProfile)
        return () => window.removeEventListener('open-profile', handleOpenProfile)
    }, [])

    const handleStartChat = (user) => {
        setSelectedUserId(null)
        navigate(`/direct-messages/${user.id}`)
    }

    return (
        <div className="flex h-screen bg-[#242424] text-white relative">
            {/* Sidebar with mobile state */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <main className="flex-1 overflow-hidden relative flex flex-col w-full">
                <header className="h-16 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between px-4 md:px-6">
                    {/* Hamburger Menu for Mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 hover:bg-[#2a2a2a] rounded-lg md:hidden text-gray-400"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Spacer for desktop to push notifications to the right */}
                    <div className="hidden md:block"></div>

                    <Notifications />
                </header>
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <Outlet />
                </div>
            </main>

            {selectedUserId && (
                <UserProfileModal
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                    onMessage={handleStartChat}
                />
            )}
        </div>
    )
}
