import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (token) {
            fetchUser()
        } else {
            setLoading(false)
        }
    }, [token])

    const fetchUser = async () => {
        try {
            const response = await api.get('/user')
            setUser(response.data)

            // Update Echo authorization header on refresh
            if (window.Echo && token) {
                if (window.Echo.connector?.pusher?.config?.auth?.headers) {
                    window.Echo.connector.pusher.config.auth.headers.Authorization = `Bearer ${token}`
                }
                window.Echo.connect()
            }
        } catch (error) {
            console.error('Failed to fetch user:', error)
            logout()
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        const response = await api.post('/login', { email, password })
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user)

        // Update Echo authorization header and reconnect
        if (window.Echo) {
            window.Echo.disconnect()
            if (window.Echo.connector?.pusher?.config?.auth?.headers) {
                window.Echo.connector.pusher.config.auth.headers.Authorization = `Bearer ${response.data.token}`
            }
            window.Echo.connect()
        }

        return response.data
    }

    const register = async ({ name, email, password, password_confirmation, faculty, department, level }) => {
        const response = await api.post('/register', {
            name,
            email,
            password,
            password_confirmation,
            faculty,
            department,
            level,
        })
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user)

        // Update Echo authorization header and reconnect
        if (window.Echo) {
            window.Echo.disconnect()
            if (window.Echo.connector?.pusher?.config?.auth?.headers) {
                window.Echo.connector.pusher.config.auth.headers.Authorization = `Bearer ${response.data.token}`
            }
            window.Echo.connect()
        }

        return response.data
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)

        // Disconnect Echo
        if (window.Echo) {
            window.Echo.disconnect()
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
