import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import Logo from '../components/Logo'
import { Eye, EyeOff, User, Mail, Lock, GraduationCap, Building2, Layers, AlertCircle } from 'lucide-react'

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        faculty: '',
        department: '',
        level: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [faculties, setFaculties] = useState({})
    const [levels, setLevels] = useState([])
    const [error, setError] = useState('')
    const { register } = useAuth()
    const navigate = useNavigate()
    const formRef = useRef(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [facultiesRes, levelsRes] = await Promise.all([
                    api.get('/reference/faculties'),
                    api.get('/reference/levels')
                ])
                setFaculties(facultiesRes.data)
                setLevels(levelsRes.data)
            } catch (err) {
                console.error('Failed to fetch reference data:', err)
            }
        }
        fetchData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.password_confirmation) {
            return setError('Passwords do not match')
        }

        try {
            await register(formData)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register')
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left Side - Brand Section */}
            <div className="md:w-1/2 bg-black text-white p-8 md:p-16 flex flex-col justify-between">
                <div>
                    <div className="mb-12">
                        <Logo className="h-16" />
                    </div>

                    <div className="max-w-md">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Join Your Learning Community
                        </h2>
                        <p className="text-gray-400 text-lg mb-12">
                            Create an account to start connecting with classmates, collaborating on projects, and staying updated with campus life.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Real-time Messaging</h3>
                                    <p className="text-sm text-gray-500">Chat with classmates and teachers instantly</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Study Groups</h3>
                                    <p className="text-sm text-gray-500">Collaborate on assignments and projects</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Event Updates</h3>
                                    <p className="text-sm text-gray-500">Never miss important campus events</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:hidden flex justify-center mt-8">
                    <button
                        onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors animate-bounce"
                        aria-label="Scroll to registration form"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </button>
                </div>

                <div className="mt-12 text-gray-500 text-sm">
                    &copy; 2026 Chatter Campus. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div ref={formRef} className="md:w-1/2 bg-white flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md my-8">
                    {/* Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-12">
                        <Link to="/login" className="flex-1 py-2 px-4 rounded-lg font-medium text-gray-500 hover:text-black text-center">
                            Login
                        </Link>
                        <button className="flex-1 py-2 px-4 rounded-lg bg-white shadow-sm font-medium text-black">
                            Sign Up
                        </button>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-black mb-2">Create Account</h2>
                        <p className="text-gray-500">Join thousands of students on Chatter Campus</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User className="w-5 h-5" />
                                </span>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all placeholder-gray-400"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </span>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all placeholder-gray-400"
                                    placeholder="student@university.edu"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Faculty</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Building2 className="w-5 h-5" />
                                    </span>
                                    <select
                                        value={formData.faculty}
                                        onChange={(e) => setFormData({ ...formData, faculty: e.target.value, department: '' })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all appearance-none"
                                        required
                                    >
                                        <option value="">Select Faculty</option>
                                        {Object.keys(faculties).map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Layers className="w-5 h-5" />
                                    </span>
                                    <select
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all appearance-none"
                                        required
                                    >
                                        <option value="">Select Level</option>
                                        {levels.map(l => (
                                            <option key={l} value={l}>{l}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <GraduationCap className="w-5 h-5" />
                                </span>
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    disabled={!formData.faculty}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all disabled:opacity-50 appearance-none"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {formData.faculty && faculties[formData.faculty]?.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Lock className="w-5 h-5" />
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-10 text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all placeholder-gray-400"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Lock className="w-5 h-5" />
                                    </span>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-10 text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all placeholder-gray-400"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-black/10 active:scale-[0.98]"
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-500 text-sm">
                        By signing up, you agree to our{' '}
                        <a href="#" className="text-black font-semibold hover:underline">Terms of Service</a> and{' '}
                        <a href="#" className="text-black font-semibold hover:underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    )
}
