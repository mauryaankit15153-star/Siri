import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseSiriCommand,
  INITIAL_SETTINGS,
  INITIAL_CONTACTS,
} from './siriParser';
import { DeviceState } from '../types/siri';

const mockState: DeviceState = {
  settings: { ...INITIAL_SETTINGS },
  activeApp: 'home',
  activeCall: null,
  alarms: [],
  timers: [],
  contacts: [...INITIAL_CONTACTS],
  currentTrack: {
    id: 't1',
    title: 'Kesariya',
    artist: 'Arijit Singh',
    album: 'Brahmastra',
    duration: 268,
    progress: 45,
    coverGradient: 'from-amber-500 to-red-600',
    isPlaying: false,
  },
  notes: [],
  messages: [],
  batteryLevel: 88,
};

test('Call Papa triggers call action and sets active call', () => {
  const { updatedState, result } = parseSiriCommand('Call Papa', mockState);
  assert.equal(result.actionType, 'CALL');
  assert.equal(updatedState.activeCall?.contact.name, 'Papa');
  assert.equal(updatedState.activeApp, 'phone');
  assert.match(result.speechText, /Papa ko call laga rahi hoon/i);
});

test('Hinglish call: Mummy ko phone lagao', () => {
  const { updatedState, result } = parseSiriCommand('Mummy ko phone lagao', mockState);
  assert.equal(result.actionType, 'CALL');
  assert.equal(updatedState.activeCall?.contact.name, 'Mummy');
  assert.match(result.speechText, /Mummy ko call laga rahi hoon/i);
});

test('Wi-Fi toggle: wifi band karo turns off wifi', () => {
  const { updatedState, result } = parseSiriCommand('wifi band karo', mockState);
  assert.equal(result.actionType, 'TOGGLE_SETTING');
  assert.equal(updatedState.settings.wifi, false);
  assert.match(result.speechText, /Wi-Fi band kar diya/i);
});

test('Wi-Fi toggle: turn on wifi sets wifi to true', () => {
  const stateWithWifiOff = {
    ...mockState,
    settings: { ...mockState.settings, wifi: false },
  };
  const { updatedState, result } = parseSiriCommand('turn on wifi', stateWithWifiOff);
  assert.equal(updatedState.settings.wifi, true);
  assert.match(result.speechText, /Wi-Fi on kar diya/i);
});

test('Flashlight command turns on torch', () => {
  const { updatedState, result } = parseSiriCommand('flashlight chalu karo', mockState);
  assert.equal(result.actionType, 'TOGGLE_SETTING');
  assert.equal(updatedState.settings.flashlight, true);
  assert.match(result.speechText, /Flashlight chalu kar di/i);
});

test('Open WhatsApp opens whatsapp app', () => {
  const { updatedState, result } = parseSiriCommand('whatsapp kholo', mockState);
  assert.equal(result.actionType, 'OPEN_APP');
  assert.equal(updatedState.activeApp, 'whatsapp');
  assert.match(result.speechText, /WhatsApp khol rahi hoon/i);
});

test('Set Alarm: Subah 7 baje ka alarm lagao', () => {
  const { updatedState, result } = parseSiriCommand('Subah 7 baje ka alarm lagao', mockState);
  assert.equal(result.actionType, 'SET_ALARM');
  assert.equal(updatedState.alarms.length, 1);
  assert.equal(updatedState.alarms[0].time, '07:00');
  assert.equal(updatedState.alarms[0].enabled, true);
  assert.match(result.speechText, /alarm set kar diya/i);
});

test('Set Timer: 5 minute ka timer lagao', () => {
  const { updatedState, result } = parseSiriCommand('5 minute ka timer lagao', mockState);
  assert.equal(result.actionType, 'SET_TIMER');
  assert.equal(updatedState.timers[0].durationSeconds, 300);
  assert.equal(updatedState.timers[0].isRunning, true);
  assert.match(result.speechText, /5 minute ka timer shuru kar diya/i);
});

test('Dark Mode toggle sets dark mode', () => {
  const stateLight = {
    ...mockState,
    settings: { ...mockState.settings, darkMode: false },
  };
  const { updatedState, result } = parseSiriCommand('dark mode on karo', stateLight);
  assert.equal(updatedState.settings.darkMode, true);
  assert.match(result.speechText, /Dark mode activate kar diya/i);
});

test('Volume control: Volume 50 karo', () => {
  const { updatedState, result } = parseSiriCommand('Volume 50 karo', mockState);
  assert.equal(updatedState.settings.volume, 50);
  assert.match(result.speechText, /Volume 50% par set kar diya/i);
});

test('Default fallback response fulfills user persona', () => {
  const { result } = parseSiriCommand('Kuch ajeeb sa command bolo', mockState);
  assert.equal(result.speechText, 'Thik hai, main aapke liye ye sab abhi kar deti hoon.');
});
