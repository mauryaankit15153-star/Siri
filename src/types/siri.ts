export interface DeviceSettings {
  wifi: boolean;
  bluetooth: boolean;
  flashlight: boolean;
  cellular: boolean;
  airplaneMode: boolean;
  darkMode: boolean;
  dnd: boolean;
  lowPowerMode: boolean;
  volume: number; // 0 - 100
  brightness: number; // 10 - 100
}

export interface Alarm {
  id: string;
  time: string; // "07:00"
  period: 'AM' | 'PM';
  label: string;
  enabled: boolean;
}

export interface Timer {
  id: string;
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  label: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relation?: string;
  avatarColor: string;
}

export interface ActiveCall {
  contact: Contact;
  status: 'dialing' | 'connected' | 'ended';
  durationSeconds: number;
  isMuted: boolean;
  isSpeaker: boolean;
}

export type AppId =
  | 'home'
  | 'phone'
  | 'whatsapp'
  | 'camera'
  | 'settings'
  | 'music'
  | 'photos'
  | 'notes'
  | 'calculator'
  | 'clock'
  | 'weather'
  | 'messages';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  progress: number; // seconds
  coverGradient: string;
  isPlaying: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

export type SiriActionType =
  | 'CALL'
  | 'END_CALL'
  | 'OPEN_APP'
  | 'CLOSE_APP'
  | 'SET_ALARM'
  | 'TOGGLE_ALARM'
  | 'SET_TIMER'
  | 'STOP_TIMER'
  | 'TOGGLE_SETTING'
  | 'SET_VOLUME'
  | 'SET_BRIGHTNESS'
  | 'PLAY_MUSIC'
  | 'PAUSE_MUSIC'
  | 'SEND_MESSAGE'
  | 'ADD_NOTE'
  | 'WEATHER'
  | 'TIME'
  | 'BATTERY'
  | 'GENERAL';

export interface SiriExecutionResult {
  actionType: SiriActionType;
  speechText: string;
  displayText: string;
  cardType?:
    | 'call'
    | 'app'
    | 'alarm'
    | 'timer'
    | 'setting'
    | 'music'
    | 'message'
    | 'note'
    | 'weather'
    | 'time'
    | 'battery'
    | 'info';
  payload?: any;
}

export interface DeviceState {
  settings: DeviceSettings;
  activeApp: AppId;
  activeCall: ActiveCall | null;
  alarms: Alarm[];
  timers: Timer[];
  contacts: Contact[];
  currentTrack: MusicTrack;
  notes: NoteItem[];
  messages: ChatMessage[];
  batteryLevel: number;
}
