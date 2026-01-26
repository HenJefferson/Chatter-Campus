import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

export default function ChatView() {
    const { spaceId } = useParams()
    const [messages, setMessages] = useState([])
    const [space, setSpace] = useState(null)
    const [loading, setLoading] = useState(true)
    const [typingUsers, setTypingUsers] = useState(new Set())
    const [isMember, setIsMember] = useState(true)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        fetchSpaceAndMessages()
    }, [spaceId])

    useEffect(() => {
        if (!spaceId || !isMember) return

        // Listen for new messages
        const channel = window.Echo.private(`space.${spaceId}`)

        channel
            .listen('.MessageSent', (e) => {
                setMessages((prev) => [...prev, e.message])
                scrollToBottom()
            })
            .listen('.UserTyping', (e) => {
                if (e.typing) {
                    setTypingUsers((prev) => {
                        const newSet = new Set(prev)
                        newSet.add(e.userName)
                        return newSet
                    })
                } else {
                    setTypingUsers((prev) => {
                        const newSet = new Set(prev)
                        newSet.delete(e.userName)
                        return newSet
                    })
                }
            })

        return () => {
            window.Echo.leave(`space.${spaceId}`)
        }
    }, [spaceId, isMember])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const fetchSpaceAndMessages = async () => {
        setLoading(true)
        try {
            // Fetch space details
            const spaceRes = await api.get(`/spaces/${spaceId}`)
            setSpace(spaceRes.data)

            // Fetch messages
            try {
                const messagesRes = await api.get(`/spaces/${spaceId}/messages`)
                setMessages(messagesRes.data.data || messagesRes.data)
                setIsMember(true)
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    setIsMember(false)
                } else {
                    console.error('Failed to load messages:', error)
                }
            }

        } catch (error) {
            console.error('Failed to load chat:', error)
        } finally {
            setLoading(false)
            setTimeout(scrollToBottom, 100)
        }
    }

    const handleJoinSpace = async () => {
        try {
            await api.post(`/spaces/${spaceId}/join`)
            setIsMember(true)
            // Refresh messages after joining
            const messagesRes = await api.get(`/spaces/${spaceId}/messages`)
            setMessages(messagesRes.data.data || messagesRes.data)
        } catch (error) {
            console.error('Failed to join space:', error)
            alert(`Failed to join space: ${error.response?.data?.message || error.message}`)
        }
    }

    const handleMessageSent = (newMessage) => {
        setMessages((prev) => {
            if (prev.some(m => m.id === newMessage.id)) return prev
            return [...prev, newMessage]
        })
        scrollToBottom()
    }

    const handleDeleteMessage = async (messageId) => {
        if (!confirm('Are you sure you want to delete this message?')) return

        try {
            await api.delete(`/messages/${messageId}`)
            setMessages((prev) => prev.filter(m => m.id !== messageId))
        } catch (error) {
            console.error('Failed to delete message:', error)
            alert('Failed to delete message')
        }
    }

    if (loading) return <div className="p-8">Loading chat...</div>
    if (!space) return <div className="p-8">Space not found</div>

    if (!isMember) {
        return (
            <div className="flex flex-col h-full bg-[#242424] items-center justify-center p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2"># {space.name}</h2>
                <p className="text-gray-400 mb-6">{space.description}</p>
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 max-w-md">
                    <p className="text-gray-300 mb-4">You are not a member of this space.</p>
                    <button
                        onClick={handleJoinSpace}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Join Space
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-[#121212] bg-texture">
            {/* Header */}
            <div className="p-3 md:p-4 border-b border-white/5 bg-[#121212]/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-20">
                <div className="min-w-0 flex-1">
                    <h2 className="text-base md:text-lg font-bold text-white truncate"># {space.name}</h2>
                    <p className="text-[10px] md:text-xs text-gray-400 truncate">{space.description}</p>
                </div>
                <div className="text-[10px] md:text-xs text-gray-500 ml-2 flex-shrink-0">
                    {typingUsers.size > 0 && (
                        <span className="animate-pulse text-blue-400">
                            {Array.from(typingUsers)[0]} {typingUsers.size > 1 ? `+${typingUsers.size - 1}` : ''} typing...
                        </span>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        onDelete={handleDeleteMessage}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <MessageInput spaceId={spaceId} onMessageSent={handleMessageSent} />
        </div>
    )
}
