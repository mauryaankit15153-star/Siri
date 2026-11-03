import React, { useState } from 'react';
import { Camera, RefreshCw, Zap, Circle } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

interface CameraAppProps {
  flashlight: boolean;
}

export const CameraApp: React.FC<CameraAppProps> = ({ flashlight }) => {
  const [zoom, setZoom] = useState<'0.5x' | '1x' | '2x'>('1x');
  const [snapped, setSnapped] = useState(false);
  const [photoCount, setPhotoCount] = useState(42);

  const handleSnap = () => {
    soundFX.playCameraShutter();
    setSnapped(true);
    setPhotoCount((c) => c + 1);
    setTimeout(() => setSnapped(false), 200);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white pb-14 justify-between relative overflow-hidden select-none">
      {/* Top Options Bar */}
      <div className="px-5 pt-8 pb-3 flex items-center justify-between text-xs z-10">
        <button
          type="button"
          aria-label="Flash"
          className={`flex items-center gap-1 px-2 py-1 rounded-full ${
            flashlight ? 'bg-yellow-400 text-black font-semibold' : 'text-zinc-400'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{flashlight ? 'ON' : 'OFF'}</span>
        </button>
        <span className="text-zinc-500 font-mono text-[11px]">4K • 60</span>
        <button type="button" aria-label="Live Photo" className="text-amber-400 font-bold text-xs">
          LIVE
        </button>
      </div>

      {/* Viewfinder Canvas */}
      <div className="relative flex-1 mx-3 rounded-3xl overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center shadow-inner">
        {/* Flash snap visual */}
        {snapped && <div className="absolute inset-0 bg-white z-30 transition-opacity duration-150" />}

        {/* Viewfinder Grid */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-white" />
          <div className="border-r border-white" />
          <div />
        </div>

        {/* Realistic Viewfinder Scenery */}
        <div className="text-center p-6 space-y-2">
          <div className="w-20 h-20 mx-auto rounded-full border-2 border-yellow-400/80 border-dashed animate-spin-slow flex items-center justify-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
          </div>
          <div className="text-xs text-zinc-300 font-medium">Focus Locked [Subject]</div>
          <div className="text-[10px] text-zinc-500 font-mono">f/1.78 • 24mm • ISO 125</div>
        </div>

        {/* Zoom Selector */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3 z-10">
          {(['0.5x', '1x', '2x'] as const).map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => {
                soundFX.playToggleClick();
                setZoom(z);
              }}
              className={`w-8 h-8 rounded-full text-[11px] font-bold flex items-center justify-center transition-all ${
                zoom === z
                  ? 'bg-yellow-400 text-black scale-110 shadow-md'
                  : 'bg-black/60 text-white/90 backdrop-blur'
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* Shutter Bar */}
      <div className="px-8 py-4 flex items-center justify-between z-10">
        {/* Gallery thumbnail */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 border-2 border-white/40 flex items-center justify-center text-xs font-bold text-white shadow">
          {photoCount}
        </div>

        {/* Shutter Button */}
        <button
          type="button"
          aria-label="Take photo"
          onClick={handleSnap}
          className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-transform"
        >
          <div className="w-14 h-14 rounded-full bg-white" />
        </button>

        {/* Flip Camera */}
        <button
          type="button"
          aria-label="Flip camera"
          onClick={() => soundFX.playToggleClick()}
          className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
