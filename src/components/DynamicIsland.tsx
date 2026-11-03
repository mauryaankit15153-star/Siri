import React, { useState } from 'react';
import { Phone, PhoneOff, Timer as TimerIcon, Music, Flame, Moon, VolumeX } from 'lucide-react';
import { ActiveCall, Timer, MusicTrack, DeviceSettings } from '../types/siri';

interface DynamicIslandProps {
  activeCall: ActiveCall | null;
  timers: Timer[];
  currentTrack: MusicTrack;
  settings: DeviceSettings;
  onEndCall: () => void;
  onToggleTimer: (id: string) => void;
  onToggleMusic: () => void;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  activeCall,
  timers,
  currentTrack,
  settings,
  onEndCall,
  onToggleMusic,
}) => {
  const [expanded, setExpanded] = useState(false);
  const activeTimer = timers.find((t) => t.isRunning);

  // Format timer seconds
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Format call duration
  const formatCallDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const hasActivity = activeCall || activeTimer || currentTrack.isPlaying || settings.flashlight || settings.dnd;

  return (
    <div className="flex justify-center w-full z-40 relative">
      <div
        role="region"
        aria-label="Dynamic Island"
        onClick={() => setExpanded(!expanded)}
        className={`bg-black text-white rounded-full transition-all duration-300 ease-out cursor-pointer shadow-lg border border-white/10 flex items-center justify-between px-3 select-none ${
          expanded
            ? 'w-[90%] max-w-[340px] h-20 rounded-3xl py-2 px-4'
            : hasActivity
            ? 'w-52 h-8.5'
            : 'w-28 h-7.5'
        }`}
      >
        {/* Expanded View */}
        {expanded ? (
          <div className="w-full flex items-center justify-between">
            {activeCall ? (
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow"
                    style={{ backgroundColor: activeCall.contact.avatarColor }}
                  >
                    {activeCall.contact.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-white">{activeCall.contact.name}</div>
                    <div className="text-[11px] text-green-400 font-mono">
                      {formatCallDuration(activeCall.durationSeconds)}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="End active call"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEndCall();
                    setExpanded(false);
                  }}
                  className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
                >
                  <PhoneOff className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : activeTimer ? (
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <TimerIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-300">{activeTimer.label}</div>
                    <div className="text-base font-bold text-amber-400 font-mono">
                      {formatTimer(activeTimer.remainingSeconds)}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-400">Tap to collapse</div>
              </div>
            ) : currentTrack.isPlaying ? (
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${currentTrack.coverGradient} flex items-center justify-center shadow`}>
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <div className="max-w-[170px] truncate">
                    <div className="text-xs font-medium text-white truncate">{currentTrack.title}</div>
                    <div className="text-[11px] text-zinc-400 truncate">{currentTrack.artist}</div>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Toggle music playback"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMusic();
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <Music className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <div className="w-full flex items-center justify-between text-xs text-zinc-400 px-2">
                <span>iPhone 16 Pro</span>
                <span>Dynamic Island</span>
              </div>
            )}
          </div>
        ) : (
          /* Compact View */
          <>
            {/* Left element */}
            <div className="flex items-center gap-1.5 overflow-hidden">
              {activeCall ? (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] font-mono text-green-400 font-medium">
                    {formatCallDuration(activeCall.durationSeconds)}
                  </span>
                </>
              ) : activeTimer ? (
                <>
                  <TimerIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-mono text-amber-400 font-medium">
                    {formatTimer(activeTimer.remainingSeconds)}
                  </span>
                </>
              ) : currentTrack.isPlaying ? (
                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-sm bg-gradient-to-tr ${currentTrack.coverGradient}`} />
                  <span className="text-[11px] text-white/90 truncate max-w-[80px]">
                    {currentTrack.title}
                  </span>
                </div>
              ) : settings.flashlight ? (
                <Flame className="w-3.5 h-3.5 text-yellow-400" />
              ) : settings.dnd ? (
                <Moon className="w-3.5 h-3.5 text-purple-400" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              )}
            </div>

            {/* Right element */}
            <div className="flex items-center gap-1.5">
              {activeCall ? (
                <div className="flex items-center gap-0.5">
                  <span className="w-0.5 h-2 bg-green-400 animate-pulse" />
                  <span className="w-0.5 h-3 bg-green-400 animate-pulse delay-75" />
                  <span className="w-0.5 h-2 bg-green-400 animate-pulse delay-150" />
                  <Phone className="w-3 h-3 text-green-400 ml-1" />
                </div>
              ) : activeTimer ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              ) : currentTrack.isPlaying ? (
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-red-400 rounded-full animate-bounce h-2" />
                  <span className="w-0.5 bg-red-400 rounded-full animate-bounce h-3 delay-100" />
                  <span className="w-0.5 bg-red-400 rounded-full animate-bounce h-1.5 delay-200" />
                </div>
              ) : settings.volume === 0 ? (
                <VolumeX className="w-3 h-3 text-red-400" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
