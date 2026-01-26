import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import {
    LayoutDashboard,
    MessageSquare,
    Bell,
    Search,
    Send,
    User,
    Newspaper,
    ArrowRight,
    Calendar,
    Zap,
    Megaphone
} from 'lucide-react'

export default function DashboardHome() {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        spaces: 0,
        messages: 0,
        notifications: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const [spacesRes, dmRes, notifyRes] = await Promise.all([
                api.get('/spaces'),
                api.get('/direct-messages'),
                api.get('/notifications')
            ])

            setStats({
                spaces: spacesRes.data.length,
                messages: dmRes.data.length,
                notifications: (notifyRes.data.data || notifyRes.data).filter(n => !n.read_at).length
            })
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0f0f0f] relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>

            {/* Subtle Gradient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 pt-10 pb-24 relative z-10">
                {/* Welcome Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{user?.name === 'Admin user' ? 'Admin' : user?.name}</span>!
                    </h1>
                    <p className="text-gray-400 text-xl font-medium">
                        Here's what's happening on campus today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <StatCard
                        title="Joined Spaces"
                        value={stats.spaces}
                        icon={<LayoutDashboard className="w-6 h-6" />}
                        color="blue"
                        link="/spaces"
                    />
                    <StatCard
                        title="Active Chats"
                        value={stats.messages}
                        icon={<MessageSquare className="w-6 h-6" />}
                        color="cyan"
                        link="/direct-messages"
                    />
                    <StatCard
                        title="New Notifications"
                        value={stats.notifications}
                        icon={<Bell className="w-6 h-6" />}
                        color="yellow"
                        link="#"
                    />
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Quick Actions */}
                    <div className="lg:col-span-3 bg-[#161616]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Zap className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Quick Actions</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <ActionButton
                                to="/spaces"
                                label="Browse Spaces"
                                icon={<Search className="w-5 h-5" />}
                                description="Find and join new campus communities"
                                color="blue"
                            />
                            <ActionButton
                                to="/direct-messages"
                                label="Send Message"
                                icon={<Send className="w-5 h-5" />}
                                description="Start a conversation with classmates"
                                color="cyan"
                            />
                            <ActionButton
                                to="/profile"
                                label="Edit Profile"
                                icon={<User className="w-5 h-5" />}
                                description="Manage your account and preferences"
                                color="purple"
                            />
                            <ActionButton
                                to="/announcements"
                                label="View News"
                                icon={<Newspaper className="w-5 h-5" />}
                                description="Stay updated with latest announcements"
                                color="orange"
                            />
                        </div>
                    </div>

                    {/* Announcements Preview */}
                    <div className="lg:col-span-2 bg-[#161616]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Megaphone className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Latest News</h3>
                            </div>
                            <Link to="/announcements" className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group">
                                View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="space-y-5">
                            <NewsCard
                                title="Semester Exams Schedule"
                                excerpt="The exam schedule for the current semester has been released. Please check your portal..."
                                date="2 hours ago"
                            />
                            <NewsCard
                                title="New Library Resources"
                                excerpt="We have added 500+ new digital journals to the library portal for all students..."
                                date="Yesterday"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, color, link }) {
    const colors = {
        blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
        cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400',
        yellow: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/20 text-yellow-400',
    }

    return (
        <Link to={link} className={`group relative overflow-hidden bg-gradient-to-br ${colors[color]} border rounded-3xl p-8 transition-all hover:scale-[1.02] hover:shadow-2xl`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {icon}
            </div>
            <div className="flex justify-between items-end">
                <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{title}</h4>
                    <span className="text-5xl font-black text-white">{value}</span>
                </div>
                <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-white/10 transition-colors`}>
                    {icon}
                </div>
            </div>
        </Link>
    )
}

function ActionButton({ to, label, icon, description, color }) {
    const colors = {
        blue: 'hover:border-blue-500/50 group-hover:bg-blue-500/10 text-blue-400',
        cyan: 'hover:border-cyan-500/50 group-hover:bg-cyan-500/10 text-cyan-400',
        purple: 'hover:border-purple-500/50 group-hover:bg-purple-500/10 text-purple-400',
        orange: 'hover:border-orange-500/50 group-hover:bg-orange-500/10 text-orange-400',
    }

    return (
        <Link to={to} className={`flex items-start gap-4 p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group ${colors[color]}`}>
            <div className={`p-3 rounded-xl bg-white/5 border border-white/10 transition-colors ${colors[color].split(' ')[1]}`}>
                {icon}
            </div>
            <div>
                <p className="text-lg font-bold text-white mb-1 group-hover:text-white transition-colors">{label}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
        </Link>
    )
}

function NewsCard({ title, excerpt, date }) {
    return (
        <div className="p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all cursor-pointer group">
            <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{date}</span>
            </div>
            <h4 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h4>
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{excerpt}</p>
        </div>
    )
}
