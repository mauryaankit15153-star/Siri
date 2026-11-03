import React from 'react';
import {
  Phone,
  MessageSquare,
  Camera,
  Settings,
  Music,
  Image,
  Clock,
  FileText,
  CloudSun,
  Calculator,
  Sliders,
  Battery,
  Flame,
} from 'lucide-react';
import { AppId, DeviceSettings } from '../types/siri';

interface HomeScreenProps {
  settings: DeviceSettings;
  batteryLevel: number;
  onOpenApp: (app: AppId) => void;
  onOpenControlCenter: () => void;
  onActivateSiri: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  settings,
  batteryLevel,
  onOpenApp,
  onOpenControlCenter,
  onActivateSiri,
}) => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  const gridApps = [
    { id: 'phone' as AppId, name: 'Phone', icon: Phone, bg: 'bg-emerald-500' },
    { id: 'messages' as AppId, name: 'Messages', icon: MessageSquare, bg: 'bg-green-500' },
    { id: 'whatsapp' as AppId, name: 'WhatsApp', icon: MessageSquare, bg: 'bg-[#25D366]' },
    { id: 'camera' as AppId, name: 'Camera', icon: Camera, bg: 'bg-zinc-700' },
    { id: 'settings' as AppId, name: 'Settings', icon: Settings, bg: 'bg-zinc-500' },
    { id: 'music' as AppId, name: 'Music', icon: Music, bg: 'bg-red-500' },
    { id: 'clock' as AppId, name: 'Clock', icon: Clock, bg: 'bg-black border border-white/20' },
    { id: 'notes' as AppId, name: 'Notes', icon: FileText, bg: 'bg-amber-400 text-black' },
    { id: 'weather' as AppId, name: 'Weather', icon: CloudSun, bg: 'bg-sky-500' },
    { id: 'calculator' as AppId, name: 'Calculator', icon: Calculator, bg: 'bg-orange-500' },
    { id: 'photos' as AppId, name: 'Photos', icon: Image, bg: 'bg-gradient-to-tr from-pink-500 via-amber-400 to-sky-400' },
  ];

  const dockApps = [
    { id: 'phone' as AppId, name: 'Phone', icon: Phone, bg: 'bg-emerald-500' },
    { id: 'whatsapp' as AppId, name: 'WhatsApp', icon: MessageSquare, bg: 'bg-[#25D366]' },
    { id: 'messages' as AppId, name: 'Messages', icon: MessageSquare, bg: 'bg-green-500' },
    { id: 'music' as AppId, name: 'Music', icon: Music, bg: 'bg-red-500' },
  ];

  return (
    <div className="flex flex-col h-full justify-between p-4 pt-10 pb-4 select-none relative overflow-hidden">
      {/* Flashlight Screen Beam Indicator */}
      {settings.flashlight && (
        <div className="absolute top-0 right-4 z-20 flex items-center gap-1 bg-yellow-400/90 text-black font-semibold text-[10px] px-2 py-0.5 rounded-full shadow-lg animate-pulse">
          <Flame className="w-3 h-3 fill-current" /> Torch On
        </div>
      )}

      {/* Top Widgets Row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Date & Time Widget */}
        <div className="p-3.5 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 flex flex-col justify-between shadow-lg">
          <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">{dateStr}</div>
          <div className="text-3xl font-light tracking-tight text-white font-mono mt-1">{timeStr}</div>
          <div className="text-[11px] text-zinc-400 flex items-center justify-between mt-2">
            <span>New Delhi / Mumbai</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Battery & Status Widget */}
        <div className="p-3.5 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Device</span>
            <button
              type="button"
              aria-label="Control Center"
              onClick={onOpenControlCenter}
              className="text-zinc-400 hover:text-white"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Battery className={`w-6 h-6 ${settings.lowPowerMode ? 'text-amber-400' : 'text-emerald-400'}`} />
            <div>
              <div className="text-xl font-bold font-mono leading-none">{batteryLevel}%</div>
              <div className="text-[10px] text-zinc-400">
                {settings.lowPowerMode ? 'Low Power Mode' : 'Normal Power'}
              </div>
            </div>
          </div>
          <div className="text-[10px] text-zinc-400 truncate mt-1">
            {settings.wifi ? 'Wi-Fi: Connected' : 'Wi-Fi: Off'} • {settings.bluetooth ? 'BT: On' : 'BT: Off'}
          </div>
        </div>
      </div>

      {/* Main Apps Grid */}
      <div className="grid grid-cols-4 gap-y-4 gap-x-2 px-2 my-auto">
        {gridApps.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              type="button"
              aria-label={`Open ${app.name}`}
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-200 group-hover:scale-105 group-active:scale-95 ${app.bg}`}
              >
                <Icon className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-medium text-white drop-shadow-md tracking-tight group-hover:text-zinc-200">
                {app.name}
              </span>
            </button>
          );
        })}

        {/* Control Center Shortcut */}
        <button
          type="button"
          aria-label="Open Control Center"
          onClick={onOpenControlCenter}
          className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-14 h-14 rounded-2xl bg-zinc-800/90 border border-white/20 flex items-center justify-center text-white shadow-lg transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
            <Sliders className="w-7 h-7 text-cyan-400" />
          </div>
          <span className="text-[11px] font-medium text-white drop-shadow-md tracking-tight">
            Controls
          </span>
        </button>
      </div>

      {/* Siri Quick Prompt Bar with embedded Glowing Orb */}
      <div className="my-2.5 flex justify-center">
        <button
          type="button"
          onClick={onActivateSiri}
          aria-label="Ask Siri"
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-xs font-medium text-zinc-200 hover:text-white hover:border-cyan-400/50 transition-all shadow-xl group cursor-pointer active:scale-95"
        >
          <div className="relative w-5 h-5 rounded-full flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-pink-500 to-indigo-500 blur-sm opacity-80 group-hover:opacity-100 animate-pulse" />
            <div className="relative w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-300 via-purple-400 to-pink-400 shadow-sm" />
          </div>
          <span className="bg-gradient-to-r from-cyan-200 via-pink-200 to-amber-100 bg-clip-text text-transparent font-semibold">
            Tap to talk to Siri (Hinglish)
          </span>
        </button>
      </div>

      {/* Dock */}
      <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] p-2 px-4 flex justify-around items-center shadow-2xl border border-white/15 mb-1">
        {dockApps.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={'dock_' + app.id}
              type="button"
              aria-label={`Dock ${app.name}`}
              onClick={() => onOpenApp(app.id)}
              className="w-13 h-13 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              style={{ backgroundColor: app.id === 'whatsapp' ? '#25D366' : app.id === 'phone' ? '#10B981' : app.id === 'music' ? '#EF4444' : '#22C55E' }}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
