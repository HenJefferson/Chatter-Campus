import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import {
    Globe,
    Building2,
    Hash,
    ArrowRight,
    Search,
    Loader2,
    Compass,
    Users
} from 'lucide-react'

export default function SpacesList() {
    const [spaces, setSpaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchSpaces()
    }, [])

    const fetchSpaces = async () => {
        try {
            const response = await api.get('/spaces')
            setSpaces(response.data)
        } catch (error) {
            console.error('Failed to fetch spaces:', error)
        } finally {
            setLoading(false)
        }
    }

    const categorizeSpaces = (spaces) => {
        const categories = {
            general: [],
            faculty: [],
            department: []
        }

        spaces.forEach(space => {
            if (!space.faculty && !space.department) {
                categories.general.push(space)
            } else if (space.faculty && !space.department) {
                categories.faculty.push(space)
            } else {
                categories.department.push(space)
            }
        })

        return categories
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse"></div>
                </div>
                <p className="text-gray-400 font-medium animate-pulse">Discovering campus spaces...</p>
            </div>
        )
    }

    const categories = categorizeSpaces(spaces)

    const SpaceCard = ({ space, type }) => {
        const configs = {
            general: { icon: <Globe className="w-6 h-6" />, color: 'purple' },
            faculty: { icon: <Building2 className="w-6 h-6" />, color: 'blue' },
            department: { icon: <Hash className="w-6 h-6" />, color: 'green' }
        }
        const { icon, color } = configs[type]

        const colorClasses = {
            purple: 'group-hover:bg-purple-500 text-purple-400 bg-purple-500/10 border-purple-500/20',
            blue: 'group-hover:bg-blue-500 text-blue-400 bg-blue-500/10 border-blue-500/20',
            green: 'group-hover:bg-green-500 text-green-400 bg-green-500/10 border-green-500/20'
        }

        return (
            <Link
                key={space.id}
                to={`/spaces/${space.id}`}
                className="group relative bg-[#161616] border border-white/5 rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-2xl hover:border-white/10 overflow-hidden"
            >
                {/* Background Glow */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}-500/5 blur-3xl group-hover:bg-${color}-500/10 transition-all`}></div>

                <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${colorClasses[color]} border group-hover:text-white group-hover:shadow-lg group-hover:shadow-${color}-500/20`}>
                        {icon}
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${colorClasses[color]}`}>
                        {type}
                    </span>
                </div>

                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">{space.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-6">{space.description || 'No description available for this campus space.'}</p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-medium">Join Community</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
            </Link>
        )
    }

    return (
        <div className="p-6 md:p-10 h-full overflow-y-auto bg-[#0f0f0f]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Compass className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Campus Spaces</h2>
                        </div>
                        <p className="text-gray-400 max-w-xl text-lg">
                            Connect with students across the campus, your faculty, and department in real-time.
                        </p>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search spaces..."
                            className="bg-[#161616] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-white w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-16">
                    {categories.general.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-widest">General Spaces</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categories.general.map(space => <SpaceCard key={space.id} space={space} type="general" />)}
                            </div>
                        </section>
                    )}

                    {categories.faculty.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-widest">Faculty Spaces</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categories.faculty.map(space => <SpaceCard key={space.id} space={space} type="faculty" />)}
                            </div>
                        </section>
                    )}

                    {categories.department.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-widest">Department Spaces</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categories.department.map(space => <SpaceCard key={space.id} space={space} type="department" />)}
                            </div>
                        </section>
                    )}
                </div>

                {spaces.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="p-6 bg-white/5 rounded-full mb-6">
                            <Users className="w-12 h-12 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No spaces found</h3>
                        <p className="text-gray-500 max-w-xs">Ask an admin to create a space for your community.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
