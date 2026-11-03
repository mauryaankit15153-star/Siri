import React, { useState } from 'react';
import {
  X,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Phone,
  Bell,
  Timer as TimerIcon,
  Wifi,
  Flame,
  Music,
  CheckCircle2,
} from 'lucide-react';
import { SiriExecutionResult, DeviceState } from '../types/siri';
import { SiriOrb } from './SiriOrb';

interface SiriOverlayProps {
  isOpen: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  lastResult: SiriExecutionResult | null;
  deviceState: DeviceState;
  onClose: () => void;
  onToggleListening: () => void;
  onExecuteCommand: (command: string) => void;
}

export const SiriOverlay: React.FC<SiriOverlayProps> = ({
  isOpen,
  isListening,
  isSpeaking,
  transcript,
  lastResult,
  deviceState,
  onClose,
  onToggleListening,
  onExecuteCommand,
}) => {
  const [typedInput, setTypedInput] = useState('');

  if (!isOpen) return null;

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    onExecuteCommand(typedInput.trim());
    setTypedInput('');
  };

  const samplePrompts = [
    'Papa ko call karo',
    'Wi-Fi band karo',
    'Subah 7 baje ka alarm lagao',
    'Flashlight on karo',
    '5 minute ka timer lagao',
    'WhatsApp kholo',
    'Dark mode lagao',
    'Gaana bajao',
    'Mausam kaisa hai',
  ];

  return (
    <div className="absolute inset-0 z-50 pointer-events-auto flex flex-col justify-end select-none">
      {/* Apple Intelligence Edge Glow Screen Border (iOS 18 effect) */}
      <div className="absolute inset-0 pointer-events-none rounded-[48px] border-[3px] border-transparent [border-image:linear-gradient(to_bottom_right,#38bdf8,#ec4899,#8b5cf6,#f59e0b)_1] shadow-[0_0_35px_rgba(139,92,246,0.35)_inset] animate-pulse" />

      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[6px] transition-opacity"
      />

      {/* Main Siri Content Sheet */}
      <div className="relative z-10 w-full max-h-[85%] overflow-y-auto scrollbar-none bg-zinc-950/90 backdrop-blur-2xl border-t border-white/15 rounded-t-[36px] shadow-2xl flex flex-col items-center p-5 pt-3.5 pb-6 space-y-3.5">
        {/* Dismiss Pill handle & Close */}
        <div className="w-full flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              Apple Intelligence • Siri
            </span>
          </div>
          <button
            type="button"
            aria-label="Dismiss Siri"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Query & Speech Response Card */}
        <div className="w-full space-y-2.5">
          {/* Transcript / Spoken prompt */}
          {transcript ? (
            <div className="text-sm font-medium text-zinc-300 px-2 flex items-center gap-2">
              <span className="text-zinc-500 font-mono text-xs">You:</span>
              <span className="text-white italic">"{transcript}"</span>
            </div>
          ) : (
            <div className="text-xs text-zinc-400 px-2 font-medium">
              {isListening ? 'Sun rahi hoon... boliye.' : 'Kaise madad kar sakti hoon?'}
            </div>
          )}

          {/* Siri Response Card */}
          {lastResult && (
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-lg space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="text-sm font-medium text-zinc-100 leading-snug">
                  {lastResult.speechText}
                </div>
              </div>

              {/* Action Preview Card */}
              {lastResult.actionType === 'CALL' && lastResult.payload && (
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: lastResult.payload.avatarColor }}
                    >
                      {lastResult.payload.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{lastResult.payload.name}</div>
                      <div className="text-[10px] text-emerald-400">Calling via Cellular...</div>
                    </div>
                  </div>
                  <Phone className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
              )}

              {lastResult.actionType === 'SET_ALARM' && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono text-white font-medium">{lastResult.displayText}</span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              )}

              {lastResult.actionType === 'SET_TIMER' && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TimerIcon className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono text-white font-medium">{lastResult.displayText}</span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full">
                    Running
                  </span>
                </div>
              )}

              {lastResult.actionType === 'TOGGLE_SETTING' && (
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {lastResult.payload?.setting === 'wifi' && <Wifi className="w-4 h-4 text-blue-400" />}
                    {lastResult.payload?.setting === 'flashlight' && <Flame className="w-4 h-4 text-yellow-400" />}
                    <span className="text-xs font-medium text-white">{lastResult.displayText}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              )}

              {lastResult.actionType === 'PLAY_MUSIC' && (
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-medium text-white">{lastResult.displayText}</span>
                  </div>
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-red-400 rounded-full animate-bounce h-2" />
                    <span className="w-0.5 bg-red-400 rounded-full animate-bounce h-3 delay-100" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Suggestion Chips in Natural Hinglish */}
        <div className="w-full">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-1">
            Quick Commands
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onExecuteCommand(p)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Type to Siri Bar */}
        <form onSubmit={handleTextSubmit} className="w-full flex items-center gap-2">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder="Type to Siri in Hinglish..."
            className="flex-1 bg-zinc-900/90 text-white text-xs px-3.5 py-2.5 rounded-full border border-zinc-700 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            aria-label="Submit command to Siri"
            className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center transition-transform active:scale-95 shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Siri Glowing Orb & Mic Toggle */}
        <div className="flex items-center justify-center gap-6 pt-1">
          <button
            type="button"
            aria-label={isListening ? 'Stop listening' : 'Start voice recognition'}
            onClick={onToggleListening}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
          </button>

          <SiriOrb
            isListening={isListening}
            isSpeaking={isSpeaking}
            size="md"
            onClick={onToggleListening}
          />
        </div>
      </div>
    </div>
  );
};
