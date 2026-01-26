import { useState, useEffect } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { Bell, BellOff, CheckCircle2, Clock } from 'lucide-react'

export default function Notifications() {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!user) return

        fetchNotifications()

        // Listen for new notifications in real-time
        const channel = window.Echo.private(`App.Models.User.${user.id}`)

        channel.notification((notification) => {
            console.log('New notification received:', notification)
            setNotifications(prev => [notification, ...prev])
            setUnreadCount(prev => prev + 1)

            // Optional: Play a subtle sound or show a toast
        })

        return () => {
            window.Echo.leave(`App.Models.User.${user.id}`)
        }
    }, [user])

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications')
            const data = response.data.data || response.data
            setNotifications(data)
            setUnreadCount(data.filter(n => !n.read_at).length)
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        }
    }

    const markAsRead = async (id) => {
        try {
            await api.post(`/notifications/${id}/read`)
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error('Failed to mark notification as read:', error)
        }
    }

    const markAllAsRead = async () => {
        try {
            await api.post('/notifications/read-all')
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })))
            setUnreadCount(0)
        } catch (error) {
            console.error('Failed to mark all as read:', error)
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-xl transition-all ${isOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
                <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'animate-pulse text-blue-400' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#1a1a1a]">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="fixed md:absolute right-4 md:right-0 top-20 md:top-full mt-2 w-[calc(100vw-32px)] md:w-96 bg-[#161616] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Bell className="w-4 h-4 text-blue-400" />
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-10 text-center flex flex-col items-center gap-3">
                                    <div className="p-4 bg-white/5 rounded-full">
                                        <BellOff className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <p className="text-gray-500 text-sm">All caught up! No new notifications.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-white/5 transition-all cursor-pointer group relative ${!notification.read_at ? 'bg-blue-500/5' : ''}`}
                                            onClick={() => !notification.read_at && markAsRead(notification.id)}
                                        >
                                            {!notification.read_at && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                            )}
                                            <div className="flex gap-3">
                                                <div className={`p-2 rounded-lg h-fit ${!notification.read_at ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500'}`}>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm leading-relaxed ${!notification.read_at ? 'text-white font-medium' : 'text-gray-400'}`}>
                                                        {notification.data.message || notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(notification.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <div className="p-3 bg-white/5 border-t border-white/5 text-center">
                                <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors">
                                    View all activity
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
