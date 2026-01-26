import { useState, useRef, useEffect } from 'react'
import api from '../api'

export default function MessageInput({ spaceId, onMessageSent, onSendMessage, placeholder = "Type a message..." }) {
    const [message, setMessage] = useState('')
    const [file, setFile] = useState(null)
    const [sending, setSending] = useState(false)
    const typingTimeoutRef = useRef(null)
    const fileInputRef = useRef(null)

    const handleTyping = async () => {
        if (!spaceId) return // Only support typing indicators for spaces for now

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        // Send typing event
        try {
            await api.post('/typing', {
                space_id: spaceId,
                typing: true
            })
        } catch (error) {
            console.error('Failed to send typing status', error)
        }

        // Set timeout to stop typing
        typingTimeoutRef.current = setTimeout(async () => {
            try {
                await api.post('/typing', {
                    space_id: spaceId,
                    typing: false
                })
            } catch (error) {
                console.error('Failed to clear typing status', error)
            }
        }, 2000)
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if ((!message.trim() && !file) || sending) return

        setSending(true)
        try {
            const formData = new FormData()
            if (message.trim()) formData.append('content', message)
            if (file) formData.append('file', file)

            if (onSendMessage) {
                // Use custom send handler (e.g. for DMs)
                await onSendMessage(formData)
            } else if (spaceId) {
                // Default space-based message sending
                const response = await api.post(`/spaces/${spaceId}/messages`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                if (onMessageSent) onMessageSent(response.data)
            }

            setMessage('')
            setFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''

            // Clear typing status immediately upon sending
            if (spaceId && typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
                await api.post('/typing', {
                    space_id: spaceId,
                    typing: false
                })
            }
        } catch (error) {
            console.error('Failed to send message:', error)
            alert('Failed to send message. Please try again.')
        } finally {
            setSending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-[#121212]/80 backdrop-blur-md">
            {file && (
                <div className="mb-3 flex items-center gap-3 bg-[#1a1a1a] p-3 rounded-xl border border-white/5 animate-in slide-in-from-bottom-2">
                    <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-500 text-xl shadow-inner">
                        {file.type.startsWith('image/') ? '🖼️' : '📄'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-200 truncate">{file.name}</p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
            <div className="flex gap-3 items-center">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all flex-shrink-0"
                    title="Attach file"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value)
                            handleTyping()
                        }}
                        placeholder={placeholder}
                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-[15px] text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                        disabled={sending}
                    />
                </div>
                <button
                    type="submit"
                    disabled={(!message.trim() && !file) || sending}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 active:scale-95 flex-shrink-0"
                >
                    {sending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Send'
                    )}
                </button>
            </div>
        </form>
    )
}
