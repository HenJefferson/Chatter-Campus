import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import MessageBubble from '../components/MessageBubble'
import MessageInput from '../components/MessageInput'

export default function DirectMessages() {
    const { userId } = useParams()
    const { user: currentUser } = useAuth()
    const [contacts, setContacts] = useState([])
    const [messages, setMessages] = useState([])
    const [selectedContact, setSelectedContact] = useState(null)
    const [loading, setLoading] = useState(true)
    const messagesEndRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchContacts()
    }, [])

    useEffect(() => {
        if (userId) {
            fetchMessages(userId)
            fetchContactInfo(userId)
        } else {
            setMessages([])
            setSelectedContact(null)
        }
    }, [userId])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const fetchContacts = async () => {
        try {
            const response = await api.get('/direct-messages')
            setContacts(response.data)
        } catch (error) {
            console.error('Failed to fetch contacts:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchMessages = async (id) => {
        try {
            const response = await api.get(`/direct-messages/${id}`)
            setMessages(response.data)
        } catch (error) {
            console.error('Failed to fetch messages:', error)
        }
    }

    const fetchContactInfo = async (id) => {
        try {
            const response = await api.get(`/users/${id}`)
            setSelectedContact(response.data)
        } catch (error) {
            console.error('Failed to fetch contact info:', error)
        }
    }

    const handleSendMessage = async (content) => {
        if (!userId) return
        try {
            const isFormData = content instanceof FormData
            const payload = isFormData ? content : { receiver_id: userId, content }
            if (isFormData) payload.append('receiver_id', userId)

            const response = await api.post('/direct-messages', payload, {
                headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
            })
            setMessages([...messages, response.data])
            // If this is a new contact, refresh contacts list
            if (!contacts.find(c => c.id === parseInt(userId))) {
                fetchContacts()
            }
        } catch (error) {
            console.error('Failed to send message:', error)
        }
    }

    return (
        <div className="flex h-full">
            {/* Contacts Sidebar */}
            <div className="w-80 border-r border-gray-800 flex flex-col bg-[#1a1a1a]">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contacts.length === 0 && !loading && (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No conversations yet. Start one by clicking on a user's name in any space.
                        </div>
                    )}
                    {contacts.map(contact => (
                        <button
                            key={contact.id}
                            onClick={() => navigate(`/direct-messages/${contact.id}`)}
                            className={`w-full p-4 flex items-center gap-3 hover:bg-[#2a2a2a] transition-colors border-b border-gray-800/50 ${parseInt(userId) === contact.id ? 'bg-[#2a2a2a]' : ''
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${contact.role === 'admin' ? 'from-blue-600 to-blue-400' : 'from-gray-600 to-gray-400'} flex items-center justify-center text-white font-bold shrink-0 shadow-sm`}>
                                {contact.name[0].toUpperCase()}
                            </div>
                            <div className="text-left min-w-0">
                                <p className="text-sm font-medium text-white truncate">{contact.name}</p>
                                <p className="text-xs text-gray-500 truncate">{contact.faculty}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-[#242424]">
                {selectedContact ? (
                    <>
                        <div className="h-16 border-b border-gray-800 flex items-center px-6 bg-[#1a1a1a]">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedContact.role === 'admin' ? 'from-blue-600 to-blue-400' : 'from-gray-600 to-gray-400'} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                                    {selectedContact.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">{selectedContact.name}</h3>
                                    <p className="text-[10px] text-green-500">Online</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {messages.map(msg => (
                                <MessageBubble
                                    key={msg.id}
                                    message={{
                                        ...msg,
                                        user: msg.sender_id === currentUser.id ? currentUser : selectedContact
                                    }}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-[#1a1a1a] border-t border-gray-800">
                            <MessageInput onSendMessage={handleSendMessage} placeholder={`Message ${selectedContact.name}...`} />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 text-2xl">
                            💬
                        </div>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    )
}
