import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Heart } from 'lucide-react';
import { MusicTrack } from '../../types/siri';
import { soundFX } from '../../utils/soundEffects';

interface MusicAppProps {
  currentTrack: MusicTrack;
  volume: number;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
}

export const MusicApp: React.FC<MusicAppProps> = ({
  currentTrack,
  volume,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-red-950/80 via-zinc-950 to-black text-white p-6 pt-10 pb-16 justify-between select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>PLAYING FROM PLAYLIST</span>
        <span className="font-semibold text-white">Top Bollywood Hits</span>
        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
      </div>

      {/* Album Artwork */}
      <div className="my-auto flex flex-col items-center">
        <div
          className={`w-56 h-56 rounded-3xl bg-gradient-to-tr ${currentTrack.coverGradient} shadow-2xl flex items-center justify-center p-6 border border-white/10 transition-transform duration-500 ${
            currentTrack.isPlaying ? 'scale-100' : 'scale-95 opacity-80'
          }`}
        >
          <div className="text-center">
            <div className="text-white font-black text-3xl tracking-tight uppercase drop-shadow-md">
              {currentTrack.title}
            </div>
            <div className="text-white/80 text-sm font-medium mt-1">{currentTrack.artist}</div>
          </div>
        </div>

        {/* Track Title and Artist */}
        <div className="w-full mt-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{currentTrack.title}</h2>
            <p className="text-sm text-zinc-400">{currentTrack.artist} • {currentTrack.album}</p>
          </div>
          {currentTrack.isPlaying && (
            <div className="flex items-end gap-1 h-5">
              <span className="w-1 bg-red-400 rounded-full animate-bounce h-3" />
              <span className="w-1 bg-red-400 rounded-full animate-bounce h-5 delay-100" />
              <span className="w-1 bg-red-400 rounded-full animate-bounce h-2 delay-200" />
              <span className="w-1 bg-red-400 rounded-full animate-bounce h-4 delay-300" />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-4">
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentTrack.progress / currentTrack.duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-zinc-400 mt-1.5">
            <span>{formatTime(currentTrack.progress)}</span>
            <span>-{formatTime(currentTrack.duration - currentTrack.progress)}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between px-4">
          <button type="button" aria-label="Shuffle" className="text-zinc-500 hover:text-white">
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Previous track"
            onClick={onPrevTrack}
            className="text-white hover:text-zinc-300 transform active:scale-90"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>
          <button
            type="button"
            aria-label={currentTrack.isPlaying ? 'Pause music' : 'Play music'}
            onClick={() => {
              soundFX.playToggleClick();
              onTogglePlay();
            }}
            className="w-16 h-16 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center shadow-xl transform active:scale-95 transition-all"
          >
            {currentTrack.isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>
          <button
            type="button"
            aria-label="Next track"
            onClick={onNextTrack}
            className="text-white hover:text-zinc-300 transform active:scale-90"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>
          <button type="button" aria-label="Repeat" className="text-zinc-500 hover:text-white">
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Volume hint */}
        <div className="flex items-center gap-3 px-2 text-zinc-400">
          <Volume2 className="w-3.5 h-3.5" />
          <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-white/70" style={{ width: `${volume}%` }} />
          </div>
          <span className="text-[10px] font-mono">{volume}%</span>
        </div>
      </div>
    </div>
  );
};
