import { useState, useEffect } from 'react'
import api from '../api'

export default function AdminPanel() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        faculty: '',
        department: '',
        level: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const [faculties, setFaculties] = useState({})
    const [levels, setLevels] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [facultiesRes, levelsRes] = await Promise.all([
                    api.get('/reference/faculties'),
                    api.get('/reference/levels')
                ])
                setFaculties(facultiesRes.data)
                setLevels(levelsRes.data)
            } catch (error) {
                console.error('Failed to fetch reference data:', error)
            }
        }
        fetchData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            await api.post('/spaces', {
                ...formData,
                faculty: formData.faculty || null,
                department: formData.department || null,
                level: formData.level || null
            })
            setMessage('Space created successfully!')
            setFormData({
                name: '',
                description: '',
                faculty: '',
                department: '',
                level: ''
            })
        } catch (error) {
            console.error('Failed to create space:', error)
            setMessage('Failed to create space. ' + (error.response?.data?.message || ''))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-[#242424]">
            <h1 className="text-2xl font-bold text-white mb-6">Admin Panel</h1>

            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Create New Space</h2>

                {message && (
                    <div className={`p-4 rounded mb-4 ${message.includes('success') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Space Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                            placeholder="e.g. CS 100 Level"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 focus:outline-none h-24"
                            placeholder="What is this space for?"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Restricted to Faculty</label>
                            <select
                                value={formData.faculty}
                                onChange={(e) => setFormData({ ...formData, faculty: e.target.value, department: '' })}
                                className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">All Faculties</option>
                                {Object.keys(faculties).map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Restricted to Department</label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                disabled={!formData.faculty}
                                className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                            >
                                <option value="">All Departments</option>
                                {formData.faculty && faculties[formData.faculty]?.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Restricted to Level</label>
                            <select
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">All Levels</option>
                                {levels.map(l => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Space'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Student Management Section */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 max-w-4xl mt-8">
                <h2 className="text-xl font-bold text-white mb-4">Manage Students</h2>
                <StudentList />
            </div>
        </div>
    )
}

function StudentList() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})

    // Reference data
    const [faculties, setFaculties] = useState({})
    const [levels, setLevels] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [usersRes, facultiesRes, levelsRes] = await Promise.all([
                api.get('/users'),
                api.get('/reference/faculties'),
                api.get('/reference/levels')
            ])
            setStudents(usersRes.data.filter(u => u.role === 'student'))
            setFaculties(facultiesRes.data)
            setLevels(levelsRes.data)
        } catch (error) {
            console.error('Failed to fetch data:', error)
        } finally {
            setLoading(false)
        }
    }

    const startEdit = (student) => {
        setEditingId(student.id)
        setEditForm({
            faculty: student.faculty || '',
            department: student.department || '',
            level: student.level || ''
        })
    }

    const saveEdit = async (id) => {
        try {
            await api.patch(`/users/${id}`, editForm)
            setStudents(prev => prev.map(s => s.id === id ? { ...s, ...editForm } : s))
            setEditingId(null)
        } catch (error) {
            alert('Failed to update student')
            console.error(error)
        }
    }

    if (loading) return <div className="text-gray-400">Loading students...</div>

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#2a2a2a] text-gray-200 uppercase">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Faculty</th>
                        <th className="px-4 py-3">Department</th>
                        <th className="px-4 py-3">Level</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {students.map(student => (
                        <tr key={student.id} className="hover:bg-[#242424]">
                            <td className="px-4 py-3 font-medium text-white">{student.name}</td>
                            <td className="px-4 py-3">{student.email}</td>

                            {editingId === student.id ? (
                                <>
                                    <td className="px-4 py-3">
                                        <select
                                            value={editForm.faculty}
                                            onChange={e => setEditForm({ ...editForm, faculty: e.target.value, department: '' })}
                                            className="bg-[#333] text-white rounded p-1 w-full"
                                        >
                                            <option value="">Select</option>
                                            {Object.keys(faculties).map(f => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={editForm.department}
                                            onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                                            className="bg-[#333] text-white rounded p-1 w-full"
                                        >
                                            <option value="">Select</option>
                                            {editForm.faculty && faculties[editForm.faculty]?.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={editForm.level}
                                            onChange={e => setEditForm({ ...editForm, level: e.target.value })}
                                            className="bg-[#333] text-white rounded p-1 w-full"
                                        >
                                            <option value="">Select</option>
                                            {levels.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button onClick={() => saveEdit(student.id)} className="text-green-400 hover:text-green-300">Save</button>
                                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-300">Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="px-4 py-3">{student.faculty || '-'}</td>
                                    <td className="px-4 py-3">{student.department || '-'}</td>
                                    <td className="px-4 py-3">{student.level || '-'}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => startEdit(student)} className="text-blue-400 hover:text-blue-300">Edit</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
