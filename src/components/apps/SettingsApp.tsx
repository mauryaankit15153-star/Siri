import React from 'react';
import {
  Wifi,
  Bluetooth,
  Plane,
  Moon,
  Battery,
  Flame,
  Volume2,
  Sun,
  ShieldAlert,
  ChevronRight,
  User,
} from 'lucide-react';
import { DeviceSettings } from '../../types/siri';
import { soundFX } from '../../utils/soundEffects';

interface SettingsAppProps {
  settings: DeviceSettings;
  batteryLevel: number;
  onUpdateSetting: <K extends keyof DeviceSettings>(key: K, value: DeviceSettings[K]) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  settings,
  batteryLevel,
  onUpdateSetting,
}) => {
  const toggleBoolean = (key: keyof DeviceSettings) => {
    soundFX.playToggleClick();
    onUpdateSetting(key, !settings[key]);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white pb-14 overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-8 pb-3 border-b border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Apple ID Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800/80">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-white truncate">Ankit Maurya</div>
            <div className="text-xs text-zinc-400 truncate">Apple ID, iCloud, Media & Purchases</div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </div>

        {/* Connectivity Group */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800/80 divide-y divide-zinc-800/60 overflow-hidden">
          {/* Airplane Mode */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                <Plane className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Airplane Mode</span>
            </div>
            <button
              type="button"
              aria-label="Toggle Airplane Mode"
              onClick={() => toggleBoolean('airplaneMode')}
              className={`w-11 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                settings.airplaneMode ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white shadow transform transition-transform ${
                  settings.airplaneMode ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Wi-Fi */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-medium">Wi-Fi</span>
                <span className="block text-[11px] text-zinc-400">
                  {settings.wifi ? 'Connected (Airtel_Fiber_5G)' : 'Off'}
                </span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Toggle Wi-Fi"
              onClick={() => toggleBoolean('wifi')}
              className={`w-11 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                settings.wifi ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white shadow transform transition-transform ${
                  settings.wifi ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Bluetooth */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Bluetooth className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-medium">Bluetooth</span>
                <span className="block text-[11px] text-zinc-400">
                  {settings.bluetooth ? 'On (AirPods Pro)' : 'Off'}
                </span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Toggle Bluetooth"
              onClick={() => toggleBoolean('bluetooth')}
              className={`w-11 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                settings.bluetooth ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white shadow transform transition-transform ${
                  settings.bluetooth ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Hardware & Display Controls */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800/80 divide-y divide-zinc-800/60 overflow-hidden">
          {/* Flashlight */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-yellow-500 flex items-center justify-center text-black">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Flashlight / Torch</span>
            </div>
            <button
              type="button"
              aria-label="Toggle Flashlight"
              onClick={() => toggleBoolean('flashlight')}
              className={`w-11 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                settings.flashlight ? 'bg-yellow-400' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white shadow transform transition-transform ${
                  settings.flashlight ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-medium">Dark Mode</span>
                <span className="block text-[11px] text-zinc-400">{settings.darkMode ? 'Appearance: Dark' : 'Appearance: Light'}</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Toggle Dark Mode"
              onClick={() => toggleBoolean('darkMode')}
              className={`w-11 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                settings.darkMode ? 'bg-indigo-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white shadow transform transition-transform ${
                  settings.darkMode ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Focus / DND */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Do Not Disturb</span>
            </div>
            <button
              type="button"
              aria-label="Toggle Do Not Disturb"
              onClick={() => toggleBoolean('dnd')}
              className={`w-11 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                settings.dnd ? 'bg-purple-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white shadow transform transition-transform ${
                  settings.dnd ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Low Power Mode */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center text-white">
                <Battery className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-medium">Low Power Mode</span>
                <span className="block text-[11px] text-zinc-400">Battery Level: {batteryLevel}%</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Toggle Low Power Mode"
              onClick={() => toggleBoolean('lowPowerMode')}
              className={`w-11 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                settings.lowPowerMode ? 'bg-amber-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white shadow transform transition-transform ${
                  settings.lowPowerMode ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Sliders: Brightness & Volume */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800/80 p-3.5 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Brightness
              </span>
              <span className="font-mono text-zinc-400">{settings.brightness}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={settings.brightness}
              aria-label="Display Brightness"
              onChange={(e) => onUpdateSetting('brightness', parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                <Volume2 className="w-3.5 h-3.5 text-blue-400" /> Volume
              </span>
              <span className="font-mono text-zinc-400">{settings.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              aria-label="Device Volume"
              onChange={(e) => onUpdateSetting('volume', parseInt(e.target.value, 10))}
              className="w-full accent-blue-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
