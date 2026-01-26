import { useAuth } from '../context/AuthContext'

export default function UserProfile() {
    const { user } = useAuth()

    if (!user) return null

    return (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 max-w-sm w-full">
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white mb-4">
                    {user.name?.[0]?.toUpperCase()}
                </div>

                <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-gray-400 text-sm mb-4 capitalize">{user.role}</p>

                <div className="w-full space-y-3">
                    {user.role !== 'admin' && (
                        <>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Faculty</span>
                                <span className="text-gray-300">{user.faculty || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Department</span>
                                <span className="text-gray-300">{user.department || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Level</span>
                                <span className="text-gray-300">{user.level || 'N/A'}</span>
                            </div>
                        </>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Email</span>
                        <span className="text-gray-300">{user.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Member Since</span>
                        <span className="text-gray-300">
                            {new Date(user.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
