import React from 'react';

interface SiriOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const SiriOrb: React.FC<SiriOrbProps> = ({
  isListening,
  isSpeaking,
  size = 'md',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isListening ? 'Siri is listening' : 'Activate Siri'}
      className={`relative rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 select-none focus:outline-none ${sizeClasses}`}
    >
      {/* Outer Glow Halo */}
      <div
        className={`absolute inset-[-6px] rounded-full filter blur-md transition-opacity duration-500 ${
          isListening
            ? 'opacity-90 animate-pulse bg-gradient-to-r from-cyan-400 via-pink-500 to-indigo-500'
            : isSpeaking
            ? 'opacity-80 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-400 animate-spin-slow'
            : 'opacity-50 bg-gradient-to-r from-cyan-500/60 via-purple-500/60 to-pink-500/60'
        }`}
      />

      {/* Iridescent Layer 1 */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-600 to-fuchsia-500 opacity-80 mix-blend-screen ${
          isListening ? 'animate-spin' : isSpeaking ? 'animate-pulse' : ''
        }`}
        style={{ animationDuration: isListening ? '3s' : '7s' }}
      />

      {/* Iridescent Layer 2 */}
      <div
        className={`absolute inset-1 rounded-full bg-gradient-to-bl from-pink-500 via-indigo-600 to-amber-400 opacity-75 mix-blend-overlay ${
          isListening ? 'animate-ping-slow' : ''
        }`}
      />

      {/* Inner Fluid Orb Core */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-cyan-300 via-purple-400 to-rose-400 filter blur-[1px] shadow-inner" />

      {/* Central Highlight Specular */}
      <div className="absolute top-2 left-2.5 w-3 h-2 rounded-full bg-white/60 filter blur-[0.5px] transform -rotate-45" />

      {/* Mic or Wave icon representation */}
      <div className="relative z-10 flex items-center justify-center text-white/90 drop-shadow-md">
        {isListening ? (
          <div className="flex gap-0.5 items-center h-4">
            <span className="w-1 bg-white rounded-full animate-bounce h-3" style={{ animationDelay: '0ms' }} />
            <span className="w-1 bg-white rounded-full animate-bounce h-5" style={{ animationDelay: '150ms' }} />
            <span className="w-1 bg-white rounded-full animate-bounce h-4" style={{ animationDelay: '300ms' }} />
            <span className="w-1 bg-white rounded-full animate-bounce h-2" style={{ animationDelay: '450ms' }} />
          </div>
        ) : isSpeaking ? (
          <div className="flex gap-0.5 items-center h-4">
            <span className="w-0.5 bg-white/90 rounded-full animate-pulse h-2" style={{ animationDelay: '100ms' }} />
            <span className="w-0.5 bg-white/90 rounded-full animate-pulse h-4" style={{ animationDelay: '200ms' }} />
            <span className="w-0.5 bg-white/90 rounded-full animate-pulse h-3" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-white/80 shadow-sm" />
        )}
      </div>
    </button>
  );
};
