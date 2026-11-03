import React from 'react';
import {
  Wifi,
  Bluetooth,
  Plane,
  Signal,
  Flame,
  Moon,
  Battery,
  Sun,
  Volume2,
  Music,
  Play,
  Pause,
  X,
} from 'lucide-react';
import { DeviceSettings, MusicTrack } from '../types/siri';
import { soundFX } from '../utils/soundEffects';

interface ControlCenterProps {
  settings: DeviceSettings;
  currentTrack: MusicTrack;
  onUpdateSetting: <K extends keyof DeviceSettings>(key: K, value: DeviceSettings[K]) => void;
  onToggleMusic: () => void;
  onClose: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  settings,
  currentTrack,
  onUpdateSetting,
  onToggleMusic,
  onClose,
}) => {
  const toggle = (key: keyof DeviceSettings) => {
    soundFX.playToggleClick();
    onUpdateSetting(key, !settings[key]);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xl p-5 pt-12 flex flex-col justify-between select-none animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-white/70 mb-2">
        <span className="font-semibold tracking-wider text-white">CONTROL CENTER</span>
        <button
          type="button"
          aria-label="Close Control Center"
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3.5 my-auto">
        {/* Top 2x2 platter row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Connectivity 2x2 Grid */}
          <div className="bg-zinc-800/80 rounded-3xl p-3 grid grid-cols-2 gap-2 border border-white/10 shadow-lg">
            <button
              type="button"
              aria-label="Toggle Airplane Mode"
              onClick={() => toggle('airplaneMode')}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors mx-auto ${
                settings.airplaneMode ? 'bg-amber-500 text-white' : 'bg-zinc-700/80 text-white/80'
              }`}
            >
              <Plane className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Toggle Cellular"
              onClick={() => toggle('cellular')}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors mx-auto ${
                settings.cellular ? 'bg-emerald-500 text-white' : 'bg-zinc-700/80 text-white/80'
              }`}
            >
              <Signal className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Toggle Wi-Fi"
              onClick={() => toggle('wifi')}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors mx-auto ${
                settings.wifi ? 'bg-blue-500 text-white' : 'bg-zinc-700/80 text-white/80'
              }`}
            >
              <Wifi className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Toggle Bluetooth"
              onClick={() => toggle('bluetooth')}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors mx-auto ${
                settings.bluetooth ? 'bg-blue-600 text-white' : 'bg-zinc-700/80 text-white/80'
              }`}
            >
              <Bluetooth className="w-5 h-5" />
            </button>
          </div>

          {/* Now Playing Mini Platter */}
          <div className="bg-zinc-800/80 rounded-3xl p-3.5 flex flex-col justify-between border border-white/10 shadow-lg">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${currentTrack.coverGradient} flex items-center justify-center text-white shadow`}>
                <Music className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{currentTrack.title}</div>
                <div className="text-[10px] text-zinc-400 truncate">{currentTrack.artist}</div>
              </div>
            </div>
            <div className="flex items-center justify-center mt-2">
              <button
                type="button"
                aria-label={currentTrack.isPlaying ? 'Pause music' : 'Play music'}
                onClick={onToggleMusic}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                {currentTrack.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sliders and Quick Toggles */}
        <div className="grid grid-cols-4 gap-3">
          {/* Flashlight */}
          <button
            type="button"
            aria-label="Toggle Flashlight"
            onClick={() => toggle('flashlight')}
            className={`h-24 rounded-3xl flex flex-col items-center justify-center gap-1 border border-white/10 transition-colors shadow-lg ${
              settings.flashlight ? 'bg-yellow-400 text-black' : 'bg-zinc-800/80 text-white'
            }`}
          >
            <Flame className="w-6 h-6" />
            <span className="text-[10px] font-medium">Torch</span>
          </button>

          {/* Focus DND */}
          <button
            type="button"
            aria-label="Toggle Focus DND"
            onClick={() => toggle('dnd')}
            className={`h-24 rounded-3xl flex flex-col items-center justify-center gap-1 border border-white/10 transition-colors shadow-lg ${
              settings.dnd ? 'bg-purple-600 text-white' : 'bg-zinc-800/80 text-white'
            }`}
          >
            <Moon className="w-6 h-6" />
            <span className="text-[10px] font-medium">Focus</span>
          </button>

          {/* Brightness Slider */}
          <div className="h-24 rounded-3xl bg-zinc-800/80 p-2 flex flex-col items-center justify-between border border-white/10 shadow-lg relative overflow-hidden group">
            <div
              className="absolute bottom-0 inset-x-0 bg-white/90 transition-all rounded-b-3xl pointer-events-none"
              style={{ height: `${settings.brightness}%` }}
            />
            <span className="text-[10px] font-mono text-zinc-300 z-10 font-bold mix-blend-difference">
              {settings.brightness}%
            </span>
            <Sun className="w-5 h-5 z-10 mix-blend-difference text-white" />
            <input
              type="range"
              min="10"
              max="100"
              value={settings.brightness}
              aria-label="Control Center Brightness"
              onChange={(e) => onUpdateSetting('brightness', parseInt(e.target.value, 10))}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* Volume Slider */}
          <div className="h-24 rounded-3xl bg-zinc-800/80 p-2 flex flex-col items-center justify-between border border-white/10 shadow-lg relative overflow-hidden group">
            <div
              className="absolute bottom-0 inset-x-0 bg-white/90 transition-all rounded-b-3xl pointer-events-none"
              style={{ height: `${settings.volume}%` }}
            />
            <span className="text-[10px] font-mono text-zinc-300 z-10 font-bold mix-blend-difference">
              {settings.volume}%
            </span>
            <Volume2 className="w-5 h-5 z-10 mix-blend-difference text-white" />
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              aria-label="Control Center Volume"
              onChange={(e) => onUpdateSetting('volume', parseInt(e.target.value, 10))}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Dark Mode & Battery Saver Quick Toggles */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            aria-label="Toggle Dark Mode"
            onClick={() => toggle('darkMode')}
            className={`p-3 rounded-2xl flex items-center justify-center gap-2 border border-white/10 text-xs font-semibold shadow-lg transition-colors ${
              settings.darkMode ? 'bg-indigo-600 text-white' : 'bg-zinc-800/80 text-zinc-300'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Dark Mode: {settings.darkMode ? 'On' : 'Off'}</span>
          </button>

          <button
            type="button"
            aria-label="Toggle Low Power Mode"
            onClick={() => toggle('lowPowerMode')}
            className={`p-3 rounded-2xl flex items-center justify-center gap-2 border border-white/10 text-xs font-semibold shadow-lg transition-colors ${
              settings.lowPowerMode ? 'bg-amber-500 text-black' : 'bg-zinc-800/80 text-zinc-300'
            }`}
          >
            <Battery className="w-4 h-4" />
            <span>Low Power: {settings.lowPowerMode ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      <div className="text-center text-[11px] text-zinc-400">
        Tap outside or close to return
      </div>
    </div>
  );
};
