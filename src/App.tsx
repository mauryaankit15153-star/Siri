import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  WifiOff,
  Signal,
  Battery,
  Volume2,
  VolumeX,
  Sparkles,
  PhoneCall,
  Sliders,
  Maximize2,
  RotateCcw,
  HelpCircle,
  Flame,
} from 'lucide-react';
import {
  AppId,
  Contact,
  DeviceSettings,
  DeviceState,
  MusicTrack,
  NoteItem,
  ChatMessage,
  SiriExecutionResult,
} from './types/siri';
import {
  INITIAL_CONTACTS,
  INITIAL_SETTINGS,
  parseSiriCommand,
} from './utils/siriParser';
import { soundFX } from './utils/soundEffects';
import { speakSiri, stopSpeaking, createSpeechRecognizer, isSpeechRecognitionSupported } from './utils/speech';
import { DynamicIsland } from './components/DynamicIsland';
import { HomeScreen } from './components/HomeScreen';
import { ControlCenter } from './components/ControlCenter';
import { SiriOverlay } from './components/SiriOverlay';
import { SiriOrb } from './components/SiriOrb';
import { PhoneApp } from './components/apps/PhoneApp';
import { ClockApp } from './components/apps/ClockApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { MusicApp } from './components/apps/MusicApp';
import { WhatsAppApp } from './components/apps/WhatsAppApp';
import { CameraApp } from './components/apps/CameraApp';
import { NotesApp } from './components/apps/NotesApp';
import { CalculatorApp } from './components/apps/CalculatorApp';
import { WeatherApp } from './components/apps/WeatherApp';

const INITIAL_TRACK: MusicTrack = {
  id: 't1',
  title: 'Kesariya',
  artist: 'Arijit Singh, Pritam',
  album: 'Brahmastra',
  duration: 268,
  progress: 64,
  coverGradient: 'from-amber-500 via-rose-600 to-indigo-900',
  isPlaying: false,
};

const INITIAL_NOTES: NoteItem[] = [
  { id: 'n1', title: 'Groceries List', body: 'Milk, Bread, Eggs, Fresh Apples', createdAt: 'Yesterday' },
  { id: 'n2', title: 'Meeting Prep', body: 'Review quarterly architecture roadmap', createdAt: '2 days ago' },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 'm1', sender: 'Papa', text: 'Beta ghar kab tak aaoge?', time: '10:30 AM', isMe: false },
  { id: 'm2', sender: 'You', text: 'Papa bas 15 minute me nikal raha hoon.', time: '10:32 AM', isMe: true },
];

export default function App() {
  const [deviceState, setDeviceState] = useState<DeviceState>({
    settings: { ...INITIAL_SETTINGS },
    activeApp: 'home',
    activeCall: null,
    alarms: [
      { id: 'a1', time: '06:30', period: 'AM', label: 'Morning Workout', enabled: true },
      { id: 'a2', time: '08:00', period: 'AM', label: 'Office Standup', enabled: false },
    ],
    timers: [
      { id: 't1', durationSeconds: 300, remainingSeconds: 300, isRunning: false, label: '5 min timer' },
    ],
    contacts: [...INITIAL_CONTACTS],
    currentTrack: { ...INITIAL_TRACK },
    notes: [...INITIAL_NOTES],
    messages: [...INITIAL_MESSAGES],
    batteryLevel: 88,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isSiriOpen, setIsSiriOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResult, setLastResult] = useState<SiriExecutionResult | null>({
    actionType: 'GENERAL',
    speechText: 'Thik hai, main aapke liye ye sab abhi kar deti hoon.',
    displayText: 'Siri is ready for commands',
    cardType: 'info',
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognizerRef = useRef<any>(null);

  // Live Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer Tick
  useEffect(() => {
    const interval = setInterval(() => {
      setDeviceState((prev) => {
        let changed = false;
        const updatedTimers = prev.timers.map((t) => {
          if (t.isRunning && t.remainingSeconds > 0) {
            changed = true;
            const rem = t.remainingSeconds - 1;
            if (rem === 0 && soundEnabled) {
              soundFX.playAlarmChime();
            }
            return { ...t, remainingSeconds: rem, isRunning: rem > 0 };
          }
          return t;
        });

        // Call duration tick
        let updatedCall = prev.activeCall;
        if (updatedCall && updatedCall.status === 'connected') {
          changed = true;
          updatedCall = {
            ...updatedCall,
            durationSeconds: updatedCall.durationSeconds + 1,
          };
        }

        return changed ? { ...prev, timers: updatedTimers, activeCall: updatedCall } : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Handle Call Connection Simulation
  useEffect(() => {
    if (deviceState.activeCall && deviceState.activeCall.status === 'dialing') {
      if (soundEnabled) soundFX.playPhoneRing();
      const timer = setTimeout(() => {
        setDeviceState((prev) =>
          prev.activeCall
            ? { ...prev, activeCall: { ...prev.activeCall, status: 'connected' } }
            : prev
        );
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [deviceState.activeCall?.status, soundEnabled]);

  // Execute Siri Command
  const handleExecuteSiri = (commandText: string) => {
    if (soundEnabled) soundFX.playSiriStart();
    setTranscript(commandText);
    setIsListening(false);

    const { updatedState, result } = parseSiriCommand(commandText, deviceState);
    setDeviceState(updatedState);
    setLastResult(result);
    setIsSiriOpen(true);
    setIsSpeaking(true);

    if (soundEnabled) {
      if (result.actionType === 'SET_ALARM') soundFX.playAlarmChime();
      else if (result.actionType === 'TOGGLE_SETTING') soundFX.playToggleClick();
    }

    speakSiri(result.speechText, () => {
      setIsSpeaking(false);
      if (soundEnabled) soundFX.playSiriComplete();
    });
  };

  // Toggle Voice Recognition
  const handleToggleListening = () => {
    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      // If browser doesn't support Web Speech API, open Siri with input prompt
      setIsSiriOpen(true);
      return;
    }

    setIsSiriOpen(true);
    if (soundEnabled) soundFX.playSiriStart();

    const recognizer = createSpeechRecognizer(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          handleExecuteSiri(text);
        }
      },
      () => setIsListening(true),
      () => setIsListening(false),
      () => setIsListening(false)
    );

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  // Setting Updater
  const updateSetting = <K extends keyof DeviceSettings>(key: K, value: DeviceSettings[K]) => {
    if (soundEnabled) soundFX.playToggleClick();
    setDeviceState((prev) => ({
      ...prev,
      settings: { ...prev.settings, [key]: value },
    }));
  };

  // Call Handlers
  const startCall = (contact: Contact) => {
    setDeviceState((prev) => ({
      ...prev,
      activeApp: 'phone',
      activeCall: {
        contact,
        status: 'dialing',
        durationSeconds: 0,
        isMuted: false,
        isSpeaker: false,
      },
    }));
  };

  const endCall = () => {
    if (soundEnabled) soundFX.playToggleClick();
    setDeviceState((prev) => ({ ...prev, activeCall: null }));
  };

  const toggleMute = () => {
    setDeviceState((prev) =>
      prev.activeCall
        ? { ...prev, activeCall: { ...prev.activeCall, isMuted: !prev.activeCall.isMuted } }
        : prev
    );
  };

  const toggleSpeaker = () => {
    setDeviceState((prev) =>
      prev.activeCall
        ? { ...prev, activeCall: { ...prev.activeCall, isSpeaker: !prev.activeCall.isSpeaker } }
        : prev
    );
  };

  // Music Handlers
  const toggleMusic = () => {
    setDeviceState((prev) => ({
      ...prev,
      currentTrack: { ...prev.currentTrack, isPlaying: !prev.currentTrack.isPlaying },
    }));
  };

  // Time format
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');

  // Flashlight full screen beam effect on phone display
  const isFlashlightOn = deviceState.settings.flashlight;

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 transition-colors duration-500 ${
        deviceState.settings.darkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-200 text-zinc-900'
      }`}
    >
      {/* Top Controls Bar */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 px-4 py-2 mb-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 via-pink-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-sm">Siri Voice Assistant</span>
            <span className="text-[11px] text-zinc-400 ml-2 hidden sm:inline">Hinglish Natural Voice Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle cheat sheet"
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Voice Commands</span>
          </button>

          <button
            type="button"
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-full transition-colors ${
              soundEnabled ? 'bg-zinc-800 text-emerald-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            aria-label="Toggle Full Screen view"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-full bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Commands Cheat Sheet Drawer */}
      {showCheatSheet && (
        <div className="w-full max-w-5xl bg-zinc-900 border border-zinc-700/80 rounded-2xl p-4 mb-3 text-xs shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
              Available Hinglish Commands (Tap any to execute immediately)
            </span>
            <button
              type="button"
              onClick={() => setShowCheatSheet(false)}
              className="text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: '📞 Call Papa', cmd: 'Call Papa' },
              { label: '📞 Mummy ko phone lagao', cmd: 'Mummy ko phone lagao' },
              { label: '📶 Wi-Fi band karo', cmd: 'Wi-Fi band karo' },
              { label: '📶 Turn on Wi-Fi', cmd: 'Turn on Wi-Fi' },
              { label: '🔦 Flashlight chalu karo', cmd: 'Flashlight chalu karo' },
              { label: '🔦 Torch band karo', cmd: 'Torch band karo' },
              { label: '⏰ Subah 7 baje ka alarm lagao', cmd: 'Subah 7 baje ka alarm lagao' },
              { label: '⏱️ 5 minute ka timer lagao', cmd: '5 minute ka timer lagao' },
              { label: '💬 WhatsApp kholo', cmd: 'WhatsApp kholo' },
              { label: '📷 Camera chalu karo', cmd: 'Camera chalu karo' },
              { label: '🌙 Dark mode lagao', cmd: 'Dark mode lagao' },
              { label: '☀️ Light mode karo', cmd: 'Light mode karo' },
              { label: '✈️ Airplane mode on karo', cmd: 'Airplane mode on karo' },
              { label: '🎵 Gaana bajao', cmd: 'Gaana bajao' },
              { label: '📝 Note likho milk lana hai', cmd: 'Note likho milk lana hai' },
              { label: '🌦️ Mausam kaisa hai', cmd: 'Mausam kaisa hai' },
              { label: '🔊 Volume 80% karo', cmd: 'Volume 80% karo' },
              { label: '🔋 Battery kitni hai', cmd: 'Battery kitni hai' },
              { label: '📴 Call kaato', cmd: 'Call kaato' },
              { label: '❓ Custom prompt', cmd: 'Thik hai, mere liye sab abhi kar do' },
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  handleExecuteSiri(item.cmd);
                  setShowCheatSheet(false);
                }}
                className="text-left p-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 transition-colors border border-zinc-700/50 truncate"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main iPhone Device Wrapper */}
      <div
        className={`relative transition-all duration-300 flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] ${
          isFullScreen
            ? 'w-full max-w-4xl h-[92vh] rounded-[36px]'
            : 'w-full max-w-[400px] h-[830px] rounded-[52px]'
        } bg-black p-3.5 ring-[10px] ring-zinc-700/80 shadow-2xl border-4 border-zinc-600/40 select-none overflow-hidden`}
      >
        {/* Physical hardware volume rocker buttons simulation */}
        <div className="absolute -left-4.5 top-28 w-1 h-12 bg-zinc-600 rounded-l-md hidden sm:block" />
        <div className="absolute -left-4.5 top-44 w-1 h-12 bg-zinc-600 rounded-l-md hidden sm:block" />
        <div className="absolute -right-4.5 top-36 w-1 h-16 bg-zinc-600 rounded-r-md hidden sm:block" />

        {/* Inner Phone Screen */}
        <div
          className={`relative w-full h-full rounded-[42px] overflow-hidden flex flex-col justify-between transition-all duration-300 ${
            deviceState.settings.darkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-900'
          }`}
          style={{
            filter: `brightness(${deviceState.settings.brightness / 100})`,
          }}
        >
          {/* Wallpaper background gradient */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              deviceState.settings.darkMode
                ? 'bg-gradient-to-br from-indigo-950/80 via-black to-zinc-950'
                : 'bg-gradient-to-br from-sky-200/60 via-indigo-100/40 to-amber-100/40'
            }`}
          />

          {/* Flashlight Screen Beam */}
          {isFlashlightOn && (
            <div className="absolute top-0 right-10 w-24 h-48 bg-yellow-300/30 blur-2xl pointer-events-none animate-pulse" />
          )}

          {/* iOS Status Bar */}
          <header className="relative z-30 px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold select-none">
            {/* Clock */}
            <span className="font-mono text-xs tracking-tight">{hours}:{minutes}</span>

            {/* Dynamic Island Component */}
            <div className="flex-1 px-2">
              <DynamicIsland
                activeCall={deviceState.activeCall}
                timers={deviceState.timers}
                currentTrack={deviceState.currentTrack}
                settings={deviceState.settings}
                onEndCall={endCall}
                onToggleTimer={(id) => {
                  setDeviceState((prev) => ({
                    ...prev,
                    timers: prev.timers.map((t) => (t.id === id ? { ...t, isRunning: !t.isRunning } : t)),
                  }));
                }}
                onToggleMusic={toggleMusic}
              />
            </div>

            {/* Status Icons: Wi-Fi, 5G, Battery */}
            <div className="flex items-center gap-1.5 text-xs">
              <Signal className="w-3.5 h-3.5" />
              {deviceState.settings.wifi ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 opacity-40" />}
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono">{deviceState.batteryLevel}%</span>
                <Battery
                  className={`w-4 h-4 ${
                    deviceState.settings.lowPowerMode ? 'text-amber-400 fill-amber-400' : 'text-current'
                  }`}
                />
              </div>
            </div>
          </header>

          {/* Screen Body: Active App or Home Screen */}
          <main className="relative flex-1 overflow-hidden z-10 flex flex-col">
            {deviceState.activeApp === 'home' && (
              <HomeScreen
                settings={deviceState.settings}
                batteryLevel={deviceState.batteryLevel}
                onOpenApp={(appId) => {
                  if (soundEnabled) soundFX.playToggleClick();
                  setDeviceState((prev) => ({ ...prev, activeApp: appId }));
                }}
                onOpenControlCenter={() => setIsControlCenterOpen(true)}
                onActivateSiri={() => setIsSiriOpen(true)}
              />
            )}

            {deviceState.activeApp === 'phone' && (
              <PhoneApp
                contacts={deviceState.contacts}
                activeCall={deviceState.activeCall}
                onStartCall={startCall}
                onEndCall={endCall}
                onToggleMute={toggleMute}
                onToggleSpeaker={toggleSpeaker}
              />
            )}

            {deviceState.activeApp === 'clock' && (
              <ClockApp
                alarms={deviceState.alarms}
                timers={deviceState.timers}
                onToggleAlarm={(id) => {
                  setDeviceState((prev) => ({
                    ...prev,
                    alarms: prev.alarms.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
                  }));
                }}
                onAddAlarm={(newAlarm) => {
                  setDeviceState((prev) => ({ ...prev, alarms: [newAlarm, ...prev.alarms] }));
                }}
                onDeleteAlarm={(id) => {
                  setDeviceState((prev) => ({
                    ...prev,
                    alarms: prev.alarms.filter((a) => a.id !== id),
                  }));
                }}
                onStartTimer={(sec, label) => {
                  setDeviceState((prev) => ({
                    ...prev,
                    timers: [
                      {
                        id: 'timer_' + Date.now(),
                        durationSeconds: sec,
                        remainingSeconds: sec,
                        isRunning: true,
                        label,
                      },
                    ],
                  }));
                }}
                onStopTimer={(id) => {
                  setDeviceState((prev) => ({
                    ...prev,
                    timers: prev.timers.map((t) => (t.id === id ? { ...t, isRunning: false } : t)),
                  }));
                }}
                onResetTimer={(id) => {
                  setDeviceState((prev) => ({
                    ...prev,
                    timers: prev.timers.map((t) =>
                      t.id === id ? { ...t, remainingSeconds: t.durationSeconds, isRunning: false } : t
                    ),
                  }));
                }}
              />
            )}

            {deviceState.activeApp === 'settings' && (
              <SettingsApp
                settings={deviceState.settings}
                batteryLevel={deviceState.batteryLevel}
                onUpdateSetting={updateSetting}
              />
            )}

            {deviceState.activeApp === 'music' && (
              <MusicApp
                currentTrack={deviceState.currentTrack}
                volume={deviceState.settings.volume}
                onTogglePlay={toggleMusic}
                onNextTrack={() => {
                  setDeviceState((prev) => ({
                    ...prev,
                    currentTrack: {
                      ...prev.currentTrack,
                      title: 'Channa Mereya',
                      artist: 'Arijit Singh',
                      coverGradient: 'from-blue-600 to-purple-800',
                      progress: 0,
                    },
                  }));
                }}
                onPrevTrack={() => {
                  setDeviceState((prev) => ({
                    ...prev,
                    currentTrack: {
                      ...prev.currentTrack,
                      title: 'Apna Bana Le',
                      artist: 'Arijit Singh, Sachin-Jigar',
                      coverGradient: 'from-emerald-500 to-cyan-700',
                      progress: 0,
                    },
                  }));
                }}
              />
            )}

            {deviceState.activeApp === 'whatsapp' && (
              <WhatsAppApp
                messages={deviceState.messages}
                contacts={deviceState.contacts}
                onSendMessage={(msg) => {
                  setDeviceState((prev) => ({
                    ...prev,
                    messages: [
                      ...prev.messages,
                      { id: 'm_' + Date.now(), sender: 'You', text: msg, time: 'Now', isMe: true },
                    ],
                  }));
                }}
                onStartCall={startCall}
                onBack={() => setDeviceState((prev) => ({ ...prev, activeApp: 'home' }))}
              />
            )}

            {deviceState.activeApp === 'camera' && (
              <CameraApp flashlight={deviceState.settings.flashlight} />
            )}

            {deviceState.activeApp === 'notes' && (
              <NotesApp
                notes={deviceState.notes}
                onAddNote={(note) => setDeviceState((prev) => ({ ...prev, notes: [note, ...prev.notes] }))}
                onDeleteNote={(id) =>
                  setDeviceState((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== id) }))
                }
              />
            )}

            {deviceState.activeApp === 'calculator' && <CalculatorApp />}

            {deviceState.activeApp === 'weather' && <WeatherApp />}

            {deviceState.activeApp === 'photos' && (
              <div className="flex flex-col h-full bg-black text-white p-4 pt-10 pb-16 overflow-y-auto">
                <h1 className="text-xl font-bold mb-3">Photos</h1>
                <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg bg-gradient-to-tr from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center text-[10px] text-white/50"
                    >
                      Photo {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {deviceState.activeApp === 'messages' && (
              <div className="flex flex-col h-full bg-zinc-950 text-white p-4 pt-8 pb-14">
                <h1 className="text-xl font-bold mb-3">Messages</h1>
                <div className="space-y-2">
                  {deviceState.messages.map((m) => (
                    <div key={m.id} className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span className="font-semibold text-white">{m.sender}</span>
                        <span>{m.time}</span>
                      </div>
                      <div className="text-sm mt-1">{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Control Center Drawer */}
          {isControlCenterOpen && (
            <ControlCenter
              settings={deviceState.settings}
              currentTrack={deviceState.currentTrack}
              onUpdateSetting={updateSetting}
              onToggleMusic={toggleMusic}
              onClose={() => setIsControlCenterOpen(false)}
            />
          )}

          {/* Siri Full Overlay */}
          <SiriOverlay
            isOpen={isSiriOpen}
            isListening={isListening}
            isSpeaking={isSpeaking}
            transcript={transcript}
            lastResult={lastResult}
            deviceState={deviceState}
            onClose={() => {
              setIsSiriOpen(false);
              stopSpeaking();
            }}
            onToggleListening={handleToggleListening}
            onExecuteCommand={handleExecuteSiri}
          />

          {/* Ambient Siri Floating Button when inside apps */}
          {deviceState.activeApp !== 'home' && !isSiriOpen && (
            <div className="absolute bottom-5 right-5 z-40">
              <SiriOrb
                isListening={isListening}
                isSpeaking={isSpeaking}
                size="sm"
                onClick={() => setIsSiriOpen(true)}
              />
            </div>
          )}

          {/* iOS Bottom Navigation & Home Indicator */}
          <footer className="relative z-30 flex flex-col items-center justify-center pb-2.5 pt-1.5">
            {/* iOS Home Indicator Bar (Click to go Home) */}
            <button
              type="button"
              aria-label="Return to Home screen"
              onClick={() => {
                if (soundEnabled) soundFX.playToggleClick();
                setDeviceState((prev) => ({ ...prev, activeApp: 'home' }));
                setIsControlCenterOpen(false);
                setIsSiriOpen(false);
              }}
              className="w-32 h-1 bg-white/70 hover:bg-white active:bg-cyan-400 rounded-full transition-all cursor-pointer focus:outline-none"
            />
          </footer>
        </div>
      </div>
    </div>
  );
}
