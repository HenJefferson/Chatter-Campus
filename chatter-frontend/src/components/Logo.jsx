import React from 'react';

const Logo = ({ className = "h-12", textColor = "text-white", iconColor = "text-white" }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className={`relative ${iconColor}`}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-10 h-10"
                >
                    {/* Mortarboard Top */}
                    <path d="M22 10L12 5L2 10L12 15L22 10Z" fill="currentColor" fillOpacity="0.1" />
                    <path d="M22 10L12 5L2 10L12 15L22 10Z" />

                    {/* Mortarboard Bottom / Speech Bubble Body */}
                    <path d="M6 12V17C6 17 8 19 12 19C16 19 18 17 18 17V12" />

                    {/* Speech Bubble Tail */}
                    <path d="M10 19L8 22L8 18.5" fill="currentColor" />

                    {/* Tassel */}
                    <path d="M22 10V15" />
                    <circle cx="22" cy="15.5" r="0.5" fill="currentColor" />
                </svg>

                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 bg-current opacity-20 blur-xl rounded-full"></div>
            </div>

            <div className={`flex flex-col leading-none ${textColor}`}>
                <span className="text-2xl font-black tracking-tighter">CHATTER</span>
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">Campus</span>
            </div>
        </div>
    );
};

export default Logo;
