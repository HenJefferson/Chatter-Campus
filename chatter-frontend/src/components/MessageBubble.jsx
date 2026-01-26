import { format } from 'date-fns'
import { useAuth } from '../context/AuthContext'

export default function MessageBubble({ message, onDelete }) {
    const { user } = useAuth()
    const isOwnMessage = (message.user_id || message.sender_id) === user?.id
    const isAdmin = user?.role === 'admin'
    const isDeleted = !!message.deleted_at

    if (isDeleted && !isAdmin) return null

    const getInitials = (name) => {
        if (!name) return '?'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    }

    return (
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} mb-6 group w-full`}>
            <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                {!isOwnMessage && (
                    <div
                        onClick={() => message.user && window.dispatchEvent(new CustomEvent('open-profile', { detail: message.user.id }))}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${message.user?.role === 'admin' ? 'from-blue-600 to-blue-400' : 'from-gray-600 to-gray-400'} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity shadow-sm`}
                    >
                        {getInitials(message.user?.name)}
                    </div>
                )}

                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    {/* Bubble */}
                    <div
                        className={`px-4 py-2.5 rounded-2xl relative shadow-sm transition-all duration-200 ${isOwnMessage
                            ? 'bg-blue-600 text-white rounded-br-none hover:bg-blue-500'
                            : 'bg-[#2a2a2a] text-gray-100 rounded-bl-none border border-gray-700/50 hover:bg-[#323232]'
                            } ${isDeleted ? 'opacity-50 border border-red-500/50' : ''}`}
                    >
                        {isDeleted ? (
                            <p className="italic text-sm">This message was deleted</p>
                        ) : (
                            <>
                                {message.file_url && (
                                    <div className="mb-2 -mx-1 -mt-1">
                                        {message.file_type?.startsWith('image/') ? (
                                            <div className="relative rounded-xl overflow-hidden border border-white/5">
                                                <img
                                                    src={message.file_url}
                                                    alt="Attachment"
                                                    className="max-w-full h-auto cursor-pointer hover:opacity-95 transition-opacity"
                                                    onClick={() => window.open(message.file_url, '_blank')}
                                                />
                                            </div>
                                        ) : (
                                            <a
                                                href={message.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-xs ${isOwnMessage ? 'bg-white/10 hover:bg-white/20' : 'bg-black/20 hover:bg-black/30'
                                                    }`}
                                            >
                                                <span className="text-2xl">📄</span>
                                                <div className="min-w-0">
                                                    <p className={`font-bold truncate ${isOwnMessage ? 'text-white' : 'text-gray-100'}`}>
                                                        {message.file_name || 'Download Attachment'}
                                                    </p>
                                                    <p className={`text-[10px] opacity-60 truncate ${isOwnMessage ? 'text-blue-100' : 'text-gray-400'}`}>
                                                        {message.file_type}
                                                    </p>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                )}
                                <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                            </>
                        )}

                        {/* Delete Action */}
                        {!isDeleted && (isOwnMessage || isAdmin) && (
                            <button
                                onClick={() => onDelete(message.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs shadow-lg z-10"
                                title="Delete message"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {/* Metadata (Time + Status) */}
                    <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-[10px] font-medium text-gray-500">
                            {format(new Date(message.created_at), 'h:mm a')}
                        </span>
                        {isOwnMessage && (
                            <div className="flex text-blue-500">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <svg className="w-3.5 h-3.5 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
