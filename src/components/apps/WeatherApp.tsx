import React from 'react';
import { Sun, CloudRain, Wind, Droplets, Eye, Sunset } from 'lucide-react';

export const WeatherApp: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-sky-600 via-sky-800 to-indigo-950 text-white p-5 pt-8 pb-14 overflow-y-auto select-none">
      {/* City & Temperature */}
      <div className="text-center my-4">
        <h1 className="text-2xl font-bold tracking-tight">Mumbai / Delhi</h1>
        <div className="text-6xl font-extralight tracking-tighter my-1">28°</div>
        <div className="text-sm font-medium text-sky-200">Mostly Sunny</div>
        <div className="text-xs text-sky-300 font-mono mt-1">H: 32° • L: 21°</div>
      </div>

      {/* Hourly Forecast */}
      <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10 mt-3">
        <div className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider mb-2">
          Hourly Forecast
        </div>
        <div className="flex justify-between items-center text-center">
          {[
            { time: 'Now', temp: '28°', icon: Sun },
            { time: '1 PM', temp: '30°', icon: Sun },
            { time: '2 PM', temp: '32°', icon: Sun },
            { time: '3 PM', temp: '31°', icon: Sun },
            { time: '4 PM', temp: '29°', icon: Sun },
            { time: '5 PM', temp: '26°', icon: Sunset },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-sky-200 font-medium">{item.time}</span>
                <Icon className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-semibold font-mono">{item.temp}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 mt-3">
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] text-sky-300">
            <Wind className="w-3.5 h-3.5" /> Wind
          </div>
          <div className="text-lg font-bold font-mono mt-1">14 km/h</div>
          <div className="text-[10px] text-sky-200">Gentle breeze from NW</div>
        </div>

        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] text-sky-300">
            <Droplets className="w-3.5 h-3.5" /> Humidity
          </div>
          <div className="text-lg font-bold font-mono mt-1">54%</div>
          <div className="text-[10px] text-sky-200">The dew point is 18°</div>
        </div>

        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] text-sky-300">
            <Eye className="w-3.5 h-3.5" /> Visibility
          </div>
          <div className="text-lg font-bold font-mono mt-1">10 km</div>
          <div className="text-[10px] text-sky-200">Clear conditions</div>
        </div>

        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] text-sky-300">
            <CloudRain className="w-3.5 h-3.5" /> Rain Chance
          </div>
          <div className="text-lg font-bold font-mono mt-1">0%</div>
          <div className="text-[10px] text-sky-200">No rain expected</div>
        </div>
      </div>
    </div>
  );
};
