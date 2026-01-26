import { useState, useEffect } from 'react'
import api from '../api'

export default function UserProfileModal({ userId, onClose, onMessage }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (userId) {
            fetchUser()
        }
    }, [userId])

    const fetchUser = async () => {
        try {
            const response = await api.get(`/users/${userId}`)
            setUser(response.data)
        } catch (error) {
            console.error('Failed to fetch user profile:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!userId) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {loading ? (
                    <div className="flex flex-col items-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400">Loading profile...</p>
                    </div>
                ) : user ? (
                    <div className="flex flex-col items-center">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${user.role === 'admin' ? 'from-blue-600 to-blue-400' : 'from-gray-600 to-gray-400'} flex items-center justify-center text-3xl font-bold text-white mb-6 shadow-lg ${user.role === 'admin' ? 'shadow-blue-500/20' : 'shadow-gray-500/20'}`}>
                            {user.name?.[0]?.toUpperCase()}
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                        <p className="text-blue-400 text-sm mb-6 font-medium capitalize">{user.role}</p>

                        {user.role !== 'admin' && (
                            <div className="w-full space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-[#2a2a2a]/50">
                                    <span className="text-gray-500">Faculty</span>
                                    <span className="text-gray-200 font-medium">{user.faculty || 'Not set'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-[#2a2a2a]/50">
                                    <span className="text-gray-500">Department</span>
                                    <span className="text-gray-200 font-medium">{user.department || 'Not set'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-[#2a2a2a]/50">
                                    <span className="text-gray-500">Level</span>
                                    <span className="text-gray-200 font-medium">{user.level || 'Not set'}</span>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => onMessage(user)}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Send Message
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-red-400">User not found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
