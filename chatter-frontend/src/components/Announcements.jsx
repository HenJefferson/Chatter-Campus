import { useState, useEffect } from 'react'
import api from '../api'

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const fetchAnnouncements = async () => {
        try {
            // Placeholder: Fetch announcements from API
            // For now, we'll use dummy data since the backend endpoint might not exist yet
            // const response = await api.get('/announcements')
            // setAnnouncements(response.data)

            setAnnouncements([
                {
                    id: 1,
                    title: 'Welcome to Chatter Campus!',
                    content: 'We are excited to launch our new student communication platform. Connect with your peers and faculty members here.',
                    author: 'Admin',
                    date: new Date().toISOString()
                },
                {
                    id: 2,
                    title: 'Exam Schedule Released',
                    content: 'The final exam schedule for the Spring semester has been posted. Check the student portal for details.',
                    author: 'Registrar',
                    date: new Date(Date.now() - 86400000).toISOString()
                }
            ])
        } catch (error) {
            console.error('Failed to fetch announcements:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-8 text-gray-400">Loading announcements...</div>

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-[#242424]">
            <h1 className="text-2xl font-bold text-white mb-6">Announcements</h1>
            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-bold text-white">{announcement.title}</h2>
                            <span className="text-xs text-gray-500">
                                {new Date(announcement.date).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-gray-300 mb-4">{announcement.content}</p>
                        <div className="text-xs text-blue-400 font-medium">
                            Posted by {announcement.author}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
