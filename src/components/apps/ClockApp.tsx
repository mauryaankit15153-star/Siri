import React, { useState } from 'react';
import { Plus, Bell, Timer as TimerIcon, Trash2, Play, Pause, RotateCcw } from 'lucide-react';
import { Alarm, Timer } from '../../types/siri';
import { soundFX } from '../../utils/soundEffects';

interface ClockAppProps {
  alarms: Alarm[];
  timers: Timer[];
  onToggleAlarm: (id: string) => void;
  onAddAlarm: (alarm: Alarm) => void;
  onDeleteAlarm: (id: string) => void;
  onStartTimer: (durationSeconds: number, label: string) => void;
  onStopTimer: (id: string) => void;
  onResetTimer: (id: string) => void;
}

export const ClockApp: React.FC<ClockAppProps> = ({
  alarms,
  timers,
  onToggleAlarm,
  onAddAlarm,
  onDeleteAlarm,
  onStartTimer,
  onStopTimer,
  onResetTimer,
}) => {
  const [tab, setTab] = useState<'alarms' | 'timer'>('alarms');
  const [showAddAlarm, setShowAddAlarm] = useState(false);
  const [newTime, setNewTime] = useState('07:00');
  const [newPeriod, setNewPeriod] = useState<'AM' | 'PM'>('AM');
  const [newLabel, setNewLabel] = useState('Alarm');

  const activeTimer = timers.find((t) => t.isRunning) || timers[0];

  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playToggleClick();
    const created: Alarm = {
      id: 'alarm_' + Date.now(),
      time: newTime,
      period: newPeriod,
      label: newLabel || 'Alarm',
      enabled: true,
    };
    onAddAlarm(created);
    setShowAddAlarm(false);
    setNewLabel('Alarm');
  };

  const formatTimerDigits = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-black text-white pb-14">
      {/* Header */}
      <div className="px-5 pt-8 pb-3 border-b border-zinc-800 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">{tab === 'alarms' ? 'Alarms' : 'Timer'}</h1>
        <div className="flex bg-zinc-800 rounded-lg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setTab('alarms')}
            className={`px-3 py-1 rounded-md transition-colors ${
              tab === 'alarms' ? 'bg-zinc-700 text-white font-medium' : 'text-zinc-400'
            }`}
          >
            Alarms
          </button>
          <button
            type="button"
            onClick={() => setTab('timer')}
            className={`px-3 py-1 rounded-md transition-colors ${
              tab === 'timer' ? 'bg-zinc-700 text-white font-medium' : 'text-zinc-400'
            }`}
          >
            Timer
          </button>
        </div>
      </div>

      {/* Alarms Tab */}
      {tab === 'alarms' && (
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Other</span>
            <button
              type="button"
              aria-label="Add new alarm"
              onClick={() => setShowAddAlarm(true)}
              className="text-amber-500 hover:text-amber-400 flex items-center gap-1 text-xs font-semibold"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {showAddAlarm && (
            <form
              onSubmit={handleCreateAlarm}
              className="mb-4 p-4 rounded-2xl bg-zinc-900 border border-amber-500/30 space-y-3"
            >
              <div className="text-xs font-bold text-amber-400 uppercase">Set New Alarm</div>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="bg-zinc-800 text-white text-base font-mono px-3 py-2 rounded-lg border border-zinc-700 flex-1 focus:outline-none focus:border-amber-500"
                />
                <select
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value as 'AM' | 'PM')}
                  className="bg-zinc-800 text-white text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:border-amber-500"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Label (e.g. Work, Workout)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full bg-zinc-800 text-white text-xs px-3 py-2 rounded-lg border border-zinc-700 focus:outline-none"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddAlarm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {alarms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-500 text-xs text-center">
              <Bell className="w-8 h-8 mb-2 opacity-40 text-amber-400" />
              <span>Koi alarm set nahi hai.</span>
              <span className="text-[11px] text-zinc-600 mt-1">Siri se bole: "Subah 7 baje ka alarm lagao"</span>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/80">
              {alarms.map((alarm) => (
                <div key={alarm.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-3xl font-light tracking-tight ${alarm.enabled ? 'text-white' : 'text-zinc-500'}`}>
                        {alarm.time}
                      </span>
                      <span className={`text-base font-light ${alarm.enabled ? 'text-white' : 'text-zinc-500'}`}>
                        {alarm.period}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">{alarm.label}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* iOS Switch */}
                    <button
                      type="button"
                      aria-label={`Toggle alarm for ${alarm.time}`}
                      onClick={() => {
                        soundFX.playToggleClick();
                        onToggleAlarm(alarm.id);
                      }}
                      className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                        alarm.enabled ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                          alarm.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete alarm ${alarm.time}`}
                      onClick={() => onDeleteAlarm(alarm.id)}
                      className="text-zinc-600 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Timer Tab */}
      {tab === 'timer' && (
        <div className="flex-1 flex flex-col items-center justify-between px-6 py-6">
          {/* Circular Countdown Progress */}
          <div className="relative w-56 h-56 flex items-center justify-center my-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="#27272a" strokeWidth="4" fill="none" />
              {activeTimer && (
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="#F59E0B"
                  strokeWidth="4"
                  strokeDasharray="276.46"
                  strokeDashoffset={
                    276.46 * (1 - (activeTimer.remainingSeconds / (activeTimer.durationSeconds || 1)))
                  }
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-linear"
                />
              )}
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-mono font-light tracking-wider">
                {activeTimer ? formatTimerDigits(activeTimer.remainingSeconds) : '05:00'}
              </span>
              <span className="text-xs text-amber-400 mt-1">
                {activeTimer ? activeTimer.label : 'Timer Ready'}
              </span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex gap-2 w-full justify-center mb-6">
            {[
              { sec: 60, label: '1m' },
              { sec: 300, label: '5m' },
              { sec: 600, label: '10m' },
              { sec: 900, label: '15m' },
            ].map((preset) => (
              <button
                key={preset.sec}
                type="button"
                onClick={() => onStartTimer(preset.sec, `${preset.label} timer`)}
                className="px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Controls: Play/Pause/Cancel */}
          <div className="flex items-center justify-between w-full max-w-xs px-6">
            <button
              type="button"
              aria-label="Cancel timer"
              onClick={() => {
                if (activeTimer) onResetTimer(activeTimer.id);
              }}
              className="w-14 h-14 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {activeTimer && activeTimer.isRunning ? (
              <button
                type="button"
                aria-label="Pause timer"
                onClick={() => onStopTimer(activeTimer.id)}
                className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg"
              >
                <Pause className="w-7 h-7" />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Start timer"
                onClick={() => onStartTimer(300, '5 min timer')}
                className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-lg"
              >
                <Play className="w-7 h-7 fill-current ml-1" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
