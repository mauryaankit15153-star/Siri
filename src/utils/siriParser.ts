import {
  AppId,
  Contact,
  DeviceSettings,
  DeviceState,
  SiriExecutionResult,
} from '../types/siri';

export const INITIAL_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Papa', phone: '+91 98200 11223', relation: 'Father', avatarColor: '#3B82F6' },
  { id: 'c2', name: 'Mummy', phone: '+91 98200 44556', relation: 'Mother', avatarColor: '#EC4899' },
  { id: 'c3', name: 'Priya Sharma', phone: '+91 98111 22334', relation: 'Best Friend', avatarColor: '#8B5CF6' },
  { id: 'c4', name: 'Rahul Verma', phone: '+91 99887 76655', relation: 'Colleague', avatarColor: '#10B981' },
  { id: 'c5', name: 'Amit Kumar', phone: '+91 97766 55443', relation: 'Friend', avatarColor: '#F59E0B' },
];

export const INITIAL_SETTINGS: DeviceSettings = {
  wifi: true,
  bluetooth: true,
  flashlight: false,
  cellular: true,
  airplaneMode: false,
  darkMode: true,
  dnd: false,
  lowPowerMode: false,
  volume: 75,
  brightness: 80,
};

export function parseSiriCommand(
  rawInput: string,
  currentState: DeviceState
): { updatedState: DeviceState; result: SiriExecutionResult } {
  const text = rawInput.trim();
  const lower = text.toLowerCase();

  // Clone state to apply immutable updates
  const nextState: DeviceState = {
    ...currentState,
    settings: { ...currentState.settings },
    alarms: [...currentState.alarms],
    timers: [...currentState.timers],
    notes: [...currentState.notes],
    messages: [...currentState.messages],
    currentTrack: { ...currentState.currentTrack },
  };

  // 1. END CALL
  if (
    lower.includes('end call') ||
    lower.includes('cut call') ||
    lower.includes('call kaato') ||
    lower.includes('phone kaato') ||
    lower.includes('call cut') ||
    lower.includes('phone cut') ||
    lower.includes('hang up') ||
    lower.includes('call band karo')
  ) {
    nextState.activeCall = null;
    return {
      updatedState: nextState,
      result: {
        actionType: 'END_CALL',
        speechText: 'Call disconnect kar diya.',
        displayText: 'Call Ended',
        cardType: 'call',
      },
    };
  }

  // 2. CALLING COMMANDS
  const callRegex = /(?:call|phone lagao|phone karo|call karo|dial)\s*(?:to\s*)?([a-zA-Z0-9\s+]+)/i;
  const hindiCallRegex = /([a-zA-Z0-9\s]+)\s*(?:ko\s*)(?:call|phone)\s*(?:lagao|karo)/i;

  let targetName = '';
  if (hindiCallRegex.test(text)) {
    const match = text.match(hindiCallRegex);
    if (match && match[1]) targetName = match[1].trim();
  } else if (callRegex.test(text)) {
    const match = text.match(callRegex);
    if (match && match[1]) targetName = match[1].trim();
  }

  if (targetName) {
    // Find matching contact or construct one
    const matchedContact =
      currentState.contacts.find(
        (c) =>
          c.name.toLowerCase().includes(targetName.toLowerCase()) ||
          targetName.toLowerCase().includes(c.name.toLowerCase())
      ) || {
        id: 'c_custom_' + Date.now(),
        name: targetName.charAt(0).toUpperCase() + targetName.slice(1),
        phone: targetName.match(/\d+/) ? targetName : '+91 98765 43210',
        avatarColor: '#6366F1',
      };

    nextState.activeCall = {
      contact: matchedContact,
      status: 'dialing',
      durationSeconds: 0,
      isMuted: false,
      isSpeaker: false,
    };
    nextState.activeApp = 'phone';

    return {
      updatedState: nextState,
      result: {
        actionType: 'CALL',
        speechText: `${matchedContact.name} ko call laga rahi hoon...`,
        displayText: `Calling ${matchedContact.name}...`,
        cardType: 'call',
        payload: matchedContact,
      },
    };
  }

  // 3. FLASHLIGHT / TORCH
  if (lower.includes('torch') || lower.includes('flashlight')) {
    const turnOn =
      lower.includes('on') ||
      lower.includes('chalu') ||
      lower.includes('jalao') ||
      lower.includes('start') ||
      !lower.includes('off') && !lower.includes('band');

    const turnOff =
      lower.includes('off') ||
      lower.includes('band') ||
      lower.includes('bujhao') ||
      lower.includes('stop');

    const finalVal = turnOff ? false : turnOn ? true : !currentState.settings.flashlight;
    nextState.settings.flashlight = finalVal;

    const speech = finalVal ? 'Flashlight chalu kar di.' : 'Flashlight band kar di.';
    return {
      updatedState: nextState,
      result: {
        actionType: 'TOGGLE_SETTING',
        speechText: speech,
        displayText: `Flashlight ${finalVal ? 'On' : 'Off'}`,
        cardType: 'setting',
        payload: { setting: 'flashlight', value: finalVal },
      },
    };
  }

  // 4. WI-FI
  if (lower.includes('wifi') || lower.includes('wi-fi')) {
    const turnOff = lower.includes('off') || lower.includes('band') || lower.includes('disable');
    const turnOn = lower.includes('on') || lower.includes('chalu') || lower.includes('enable');
    const finalVal = turnOff ? false : turnOn ? true : !currentState.settings.wifi;

    nextState.settings.wifi = finalVal;
    return {
      updatedState: nextState,
      result: {
        actionType: 'TOGGLE_SETTING',
        speechText: finalVal ? 'Wi-Fi on kar diya.' : 'Wi-Fi band kar diya.',
        displayText: `Wi-Fi ${finalVal ? 'On' : 'Off'}`,
        cardType: 'setting',
        payload: { setting: 'wifi', value: finalVal },
      },
    };
  }

  // 5. BLUETOOTH
  if (lower.includes('bluetooth')) {
    const turnOff = lower.includes('off') || lower.includes('band') || lower.includes('disable');
    const turnOn = lower.includes('on') || lower.includes('chalu') || lower.includes('enable');
    const finalVal = turnOff ? false : turnOn ? true : !currentState.settings.bluetooth;

    nextState.settings.bluetooth = finalVal;
    return {
      updatedState: nextState,
      result: {
        actionType: 'TOGGLE_SETTING',
        speechText: finalVal ? 'Bluetooth chalu kar diya.' : 'Bluetooth band kar diya.',
        displayText: `Bluetooth ${finalVal ? 'On' : 'Off'}`,
        cardType: 'setting',
        payload: { setting: 'bluetooth', value: finalVal },
      },
    };
  }

  // 6. DARK MODE / LIGHT MODE
  if (lower.includes('dark mode') || lower.includes('light mode')) {
    const isDark = lower.includes('dark mode') && !lower.includes('off') && !lower.includes('band');
    nextState.settings.darkMode = isDark;
    return {
      updatedState: nextState,
      result: {
        actionType: 'TOGGLE_SETTING',
        speechText: isDark ? 'Dark mode activate kar diya.' : 'Light mode on kar diya.',
        displayText: isDark ? 'Dark Mode On' : 'Light Mode On',
        cardType: 'setting',
        payload: { setting: 'darkMode', value: isDark },
      },
    };
  }

  // 7. AIRPLANE MODE / FLIGHT MODE
  if (lower.includes('airplane') || lower.includes('aeroplane') || lower.includes('flight mode')) {
    const turnOff = lower.includes('off') || lower.includes('band');
    const turnOn = lower.includes('on') || lower.includes('chalu') || lower.includes('lagao');
    const finalVal = turnOff ? false : turnOn ? true : !currentState.settings.airplaneMode;

    nextState.settings.airplaneMode = finalVal;
    return {
      updatedState: nextState,
      result: {
        actionType: 'TOGGLE_SETTING',
        speechText: finalVal ? 'Airplane mode chalu kar diya.' : 'Airplane mode band kar diya.',
        displayText: `Airplane Mode ${finalVal ? 'On' : 'Off'}`,
        cardType: 'setting',
        payload: { setting: 'airplaneMode', value: finalVal },
      },
    };
  }

  // 8. DO NOT DISTURB / SILENT MODE
  if (lower.includes('do not disturb') || lower.includes('dnd') || lower.includes('silent mode')) {
    const turnOff = lower.includes('off') || lower.includes('hatao') || lower.includes('band');
    const turnOn = lower.includes('on') || lower.includes('lagao') || lower.includes('chalu');
    const finalVal = turnOff ? false : turnOn ? true : !currentState.settings.dnd;

    nextState.settings.dnd = finalVal;
    return {
      updatedState: nextState,
      result: {
        actionType: 'TOGGLE_SETTING',
        speechText: finalVal ? 'Do Not Disturb on kar diya.' : 'Do Not Disturb band kar diya.',
        displayText: `Focus DND ${finalVal ? 'On' : 'Off'}`,
        cardType: 'setting',
        payload: { setting: 'dnd', value: finalVal },
      },
    };
  }

  // 9. LOW POWER MODE / BATTERY SAVER
  if (lower.includes('battery saver') || lower.includes('low power mode') || lower.includes('power saving')) {
    const turnOff = lower.includes('off') || lower.includes('band');
    const turnOn = lower.includes('on') || lower.includes('chalu') || lower.includes('lagao');
    const finalVal = turnOff ? false : turnOn ? true : !currentState.settings.lowPowerMode;

    nextState.settings.lowPowerMode = finalVal;
    return {
      updatedState: nextState,
      result: {
        actionType: 'TOGGLE_SETTING',
        speechText: finalVal ? 'Low Power Mode on kar diya.' : 'Low Power Mode band kar diya.',
        displayText: `Low Power Mode ${finalVal ? 'On' : 'Off'}`,
        cardType: 'setting',
        payload: { setting: 'lowPowerMode', value: finalVal },
      },
    };
  }

  // 10. BRIGHTNESS
  if (lower.includes('brightness')) {
    const numMatch = lower.match(/(\d+)\s*%?/);
    let level = currentState.settings.brightness;
    if (numMatch) {
      level = Math.min(100, Math.max(10, parseInt(numMatch[1], 10)));
    } else if (lower.includes('full') || lower.includes('badhao') || lower.includes('zyada') || lower.includes('up') || lower.includes('high')) {
      level = Math.min(100, currentState.settings.brightness + 25);
    } else if (lower.includes('kam') || lower.includes('low') || lower.includes('down') || lower.includes('dim')) {
      level = Math.max(15, currentState.settings.brightness - 25);
    }
    nextState.settings.brightness = level;
    return {
      updatedState: nextState,
      result: {
        actionType: 'SET_BRIGHTNESS',
        speechText: `Brightness ${level}% par set kar di hai.`,
        displayText: `Brightness: ${level}%`,
        cardType: 'setting',
        payload: { setting: 'brightness', value: level },
      },
    };
  }

  // 11. VOLUME
  if (lower.includes('volume') || lower.includes('awaaz') || lower.includes('mute') || lower.includes('sound')) {
    if (lower.includes('mute')) {
      nextState.settings.volume = 0;
      return {
        updatedState: nextState,
        result: {
          actionType: 'SET_VOLUME',
          speechText: 'Volume mute kar diya.',
          displayText: 'Volume: Muted',
          cardType: 'setting',
          payload: { setting: 'volume', value: 0 },
        },
      };
    }
    const numMatch = lower.match(/(\d+)\s*%?/);
    let vol = currentState.settings.volume;
    if (numMatch) {
      vol = Math.min(100, Math.max(0, parseInt(numMatch[1], 10)));
    } else if (lower.includes('full') || lower.includes('badhao') || lower.includes('zyada') || lower.includes('up') || lower.includes('tez')) {
      vol = Math.min(100, currentState.settings.volume + 25);
    } else if (lower.includes('kam') || lower.includes('low') || lower.includes('down')) {
      vol = Math.max(0, currentState.settings.volume - 25);
    }
    nextState.settings.volume = vol;
    return {
      updatedState: nextState,
      result: {
        actionType: 'SET_VOLUME',
        speechText: `Volume ${vol}% par set kar diya.`,
        displayText: `Volume: ${vol}%`,
        cardType: 'setting',
        payload: { setting: 'volume', value: vol },
      },
    };
  }

  // 12. ALARMS
  if (lower.includes('alarm')) {
    if (lower.includes('off') || lower.includes('band') || lower.includes('cancel') || lower.includes('hatao')) {
      nextState.alarms = nextState.alarms.map((a) => ({ ...a, enabled: false }));
      return {
        updatedState: nextState,
        result: {
          actionType: 'TOGGLE_ALARM',
          speechText: 'Sabhi alarms band kar diye hain.',
          displayText: 'Alarms Disabled',
          cardType: 'alarm',
        },
      };
    }

    // Parse time: "7 am", "7:30 am", "subah 7 baje", "6 baje", "8:15"
    let hour = 7;
    let minute = 0;
    let period: 'AM' | 'PM' = 'AM';

    const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|baje)?/i);
    if (timeMatch) {
      hour = parseInt(timeMatch[1], 10);
      if (timeMatch[2]) minute = parseInt(timeMatch[2], 10);
      if (timeMatch[3]) {
        const p = timeMatch[3].toLowerCase();
        if (p === 'pm') period = 'PM';
        else if (p === 'am') period = 'AM';
        else if (lower.includes('sham') || lower.includes('raat')) period = 'PM';
      }
    }

    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const newAlarm = {
      id: 'alarm_' + Date.now(),
      time: timeStr,
      period,
      label: 'Alarm',
      enabled: true,
    };
    nextState.alarms = [newAlarm, ...nextState.alarms.filter((a) => a.time !== timeStr || a.period !== period)];

    return {
      updatedState: nextState,
      result: {
        actionType: 'SET_ALARM',
        speechText: `${timeStr} ${period} ka alarm set kar diya hai.`,
        displayText: `Alarm set for ${timeStr} ${period}`,
        cardType: 'alarm',
        payload: newAlarm,
      },
    };
  }

  // 13. TIMERS
  if (lower.includes('timer')) {
    if (lower.includes('stop') || lower.includes('band') || lower.includes('cancel') || lower.includes('pause')) {
      nextState.timers = nextState.timers.map((t) => ({ ...t, isRunning: false }));
      return {
        updatedState: nextState,
        result: {
          actionType: 'STOP_TIMER',
          speechText: 'Timer rok diya hai.',
          displayText: 'Timer Stopped',
          cardType: 'timer',
        },
      };
    }

    // Extract duration
    let seconds = 300; // default 5 min
    const secMatch = lower.match(/(\d+)\s*(?:sec|second)/i);
    const minMatch = lower.match(/(\d+)\s*(?:min|minute)/i);
    const hrMatch = lower.match(/(\d+)\s*(?:hour|ghanta)/i);

    if (secMatch) {
      seconds = parseInt(secMatch[1], 10);
    } else if (minMatch) {
      seconds = parseInt(minMatch[1], 10) * 60;
    } else if (hrMatch) {
      seconds = parseInt(hrMatch[1], 10) * 3600;
    }

    const label = `${Math.floor(seconds / 60)} min timer`;
    const newTimer = {
      id: 'timer_' + Date.now(),
      durationSeconds: seconds,
      remainingSeconds: seconds,
      isRunning: true,
      label,
    };
    nextState.timers = [newTimer];

    const displayUnit = seconds < 60 ? `${seconds} second` : `${Math.round(seconds / 60)} minute`;
    return {
      updatedState: nextState,
      result: {
        actionType: 'SET_TIMER',
        speechText: `${displayUnit} ka timer shuru kar diya hai.`,
        displayText: `Timer: ${displayUnit}`,
        cardType: 'timer',
        payload: newTimer,
      },
    };
  }

  // 14. MUSIC PLAYBACK
  if (lower.includes('music') || lower.includes('gaana') || lower.includes('song') || lower.includes('play')) {
    if (lower.includes('pause') || lower.includes('stop') || lower.includes('band') || lower.includes('roko')) {
      nextState.currentTrack.isPlaying = false;
      return {
        updatedState: nextState,
        result: {
          actionType: 'PAUSE_MUSIC',
          speechText: 'Music pause kar diya.',
          displayText: 'Music Paused',
          cardType: 'music',
          payload: nextState.currentTrack,
        },
      };
    }

    // Check specific song title request e.g. "play tum hi ho"
    const songMatch = lower.match(/play\s+(?:the\s+song\s+)?(.+)/i);
    if (songMatch && !['music', 'song', 'gaana'].includes(songMatch[1].trim())) {
      const title = songMatch[1].trim();
      nextState.currentTrack = {
        ...nextState.currentTrack,
        title: title.charAt(0).toUpperCase() + title.slice(1),
        isPlaying: true,
      };
    } else {
      nextState.currentTrack.isPlaying = true;
    }

    return {
      updatedState: nextState,
      result: {
        actionType: 'PLAY_MUSIC',
        speechText: `Gaana chala rahi hoon: "${nextState.currentTrack.title}".`,
        displayText: `Now Playing: ${nextState.currentTrack.title}`,
        cardType: 'music',
        payload: nextState.currentTrack,
      },
    };
  }

  // 15. OPEN APP
  const appMapping: Record<string, AppId> = {
    whatsapp: 'whatsapp',
    camera: 'camera',
    settings: 'settings',
    setting: 'settings',
    notes: 'notes',
    note: 'notes',
    calculator: 'calculator',
    hisaab: 'calculator',
    clock: 'clock',
    ghadi: 'clock',
    weather: 'weather',
    mausam: 'weather',
    music: 'music',
    gaana: 'music',
    photos: 'photos',
    gallery: 'photos',
    photo: 'photos',
    messages: 'messages',
    message: 'messages',
    sms: 'messages',
    phone: 'phone',
    dialer: 'phone',
  };

  const appKeys = Object.keys(appMapping);
  for (const key of appKeys) {
    if (
      lower.includes(`open ${key}`) ||
      lower.includes(`${key} kholo`) ||
      lower.includes(`${key} open karo`) ||
      lower.includes(`launch ${key}`) ||
      lower.includes(`${key} chalu karo`)
    ) {
      const targetApp = appMapping[key];
      nextState.activeApp = targetApp;
      const appNameCapital = targetApp.charAt(0).toUpperCase() + targetApp.slice(1);
      return {
        updatedState: nextState,
        result: {
          actionType: 'OPEN_APP',
          speechText: `${appNameCapital} khol rahi hoon.`,
          displayText: `Opening ${appNameCapital}`,
          cardType: 'app',
          payload: { appId: targetApp, appName: appNameCapital },
        },
      };
    }
  }

  // Home Screen / Close App
  if (lower.includes('home screen') || lower.includes('home jao') || lower.includes('close app') || lower.includes('app band karo')) {
    nextState.activeApp = 'home';
    return {
      updatedState: nextState,
      result: {
        actionType: 'CLOSE_APP',
        speechText: 'Home screen par aa gaye hain.',
        displayText: 'Home Screen',
        cardType: 'app',
      },
    };
  }

  // 16. NOTES
  if (lower.includes('note') || lower.includes('likho') || lower.includes('yaad rakhna')) {
    let noteContent = text
      .replace(/(?:take a note|note likho|add note|note karo|write note|save note)\s*:?/i, '')
      .trim();
    if (!noteContent) noteContent = 'Meeting agenda review';

    const newNote = {
      id: 'note_' + Date.now(),
      title: noteContent.slice(0, 30),
      body: noteContent,
      createdAt: 'Just now',
    };
    nextState.notes = [newNote, ...nextState.notes];
    nextState.activeApp = 'notes';

    return {
      updatedState: nextState,
      result: {
        actionType: 'ADD_NOTE',
        speechText: 'Note save kar liya hai.',
        displayText: `Note: "${noteContent}"`,
        cardType: 'note',
        payload: newNote,
      },
    };
  }

  // 17. SEND MESSAGE / WHATSAPP MESSAGE
  if (lower.includes('message') || lower.includes('msg') || lower.includes('sandesh')) {
    const msgRegex = /(?:message|msg|text)\s*(?:bhejo|to|send to)?\s*([a-zA-Z0-9]+)?(?:\s*:\s*|\s+bol do\s+|\s+ki\s+)?(.*)/i;
    const match = text.match(msgRegex);
    const recipient = match && match[1] ? match[1].trim() : 'Amit';
    const msgBody = match && match[2] ? match[2].trim() : 'Thik hai, main abhi aa raha hoon.';

    const newMsg = {
      id: 'msg_' + Date.now(),
      sender: 'You',
      text: msgBody,
      time: 'Now',
      isMe: true,
    };
    nextState.messages = [...nextState.messages, newMsg];
    nextState.activeApp = 'messages';

    return {
      updatedState: nextState,
      result: {
        actionType: 'SEND_MESSAGE',
        speechText: `${recipient} ko message bhej diya: "${msgBody}".`,
        displayText: `Message sent to ${recipient}`,
        cardType: 'message',
        payload: { recipient, message: msgBody },
      },
    };
  }

  // 18. WEATHER
  if (lower.includes('weather') || lower.includes('mausam') || lower.includes('temperature') || lower.includes('barish')) {
    nextState.activeApp = 'weather';
    return {
      updatedState: nextState,
      result: {
        actionType: 'WEATHER',
        speechText: 'Aaj mausam saaf hai, temperature 28°C hai aur dhoop nikli hai.',
        displayText: 'Sunny 28°C • Mumbai/Delhi',
        cardType: 'weather',
      },
    };
  }

  // 19. TIME / DATE
  if (lower.includes('time') || lower.includes('samay') || lower.includes('kitne baje') || lower.includes('date') || lower.includes('tareekh')) {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      updatedState: nextState,
      result: {
        actionType: 'TIME',
        speechText: `Abhi time ${timeFormatted} ho raha hai.`,
        displayText: timeFormatted,
        cardType: 'time',
      },
    };
  }

  // 20. BATTERY
  if (lower.includes('battery') || lower.includes('charge')) {
    return {
      updatedState: nextState,
      result: {
        actionType: 'BATTERY',
        speechText: `Battery abhi ${nextState.batteryLevel}% hai.`,
        displayText: `Battery: ${nextState.batteryLevel}%`,
        cardType: 'battery',
      },
    };
  }

  // DEFAULT / GENERAL ASSISTANT:
  // Fulfill user's exact persona prompt: "Thik hai, main aapke liye ye sab abhi kar deti hoon."
  return {
    updatedState: nextState,
    result: {
      actionType: 'GENERAL',
      speechText: 'Thik hai, main aapke liye ye sab abhi kar deti hoon.',
      displayText: 'Thik hai, main aapke liye ye sab abhi kar deti hoon.',
      cardType: 'info',
    },
  };
}
