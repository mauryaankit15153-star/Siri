import React, { useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Grid } from 'lucide-react';
import { ActiveCall, Contact } from '../../types/siri';
import { soundFX } from '../../utils/soundEffects';

interface PhoneAppProps {
  contacts: Contact[];
  activeCall: ActiveCall | null;
  onStartCall: (contact: Contact) => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({
  contacts,
  activeCall,
  onStartCall,
  onEndCall,
  onToggleMute,
  onToggleSpeaker,
}) => {
  const [dialNumber, setDialNumber] = useState('');
  const [activeTab, setActiveTab] = useState<'favorites' | 'keypad'>('favorites');

  const handleKeyPress = (num: string) => {
    soundFX.playToggleClick();
    setDialNumber((prev) => prev + num);
  };

  const handleCallCustomNumber = () => {
    if (!dialNumber) return;
    const tempContact: Contact = {
      id: 'custom_' + Date.now(),
      name: dialNumber,
      phone: dialNumber,
      avatarColor: '#10B981',
    };
    onStartCall(tempContact);
    setDialNumber('');
  };

  // If in active call, show In-Call Screen
  if (activeCall) {
    const mins = Math.floor(activeCall.durationSeconds / 60);
    const secs = activeCall.durationSeconds % 60;
    const timeDisplay = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    return (
      <div className="flex flex-col items-center justify-between h-full bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white p-6 pt-12">
        {/* Caller Info */}
        <div className="flex flex-col items-center mt-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-xl ring-4 ring-white/10"
            style={{ backgroundColor: activeCall.contact.avatarColor }}
          >
            {activeCall.contact.name.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{activeCall.contact.name}</h2>
          <div className="text-sm text-zinc-400 mt-1">{activeCall.contact.phone}</div>
          <div className="text-emerald-400 font-mono text-sm mt-3 font-medium bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20">
            {activeCall.status === 'dialing' ? 'Calling...' : timeDisplay}
          </div>
        </div>

        {/* In-Call Controls */}
        <div className="w-full max-w-xs grid grid-cols-3 gap-6 mb-8 text-center text-xs">
          <button
            type="button"
            aria-label="Toggle mute"
            onClick={onToggleMute}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-full transition-colors ${
              activeCall.isMuted ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {activeCall.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            <span className="text-[11px] font-medium">{activeCall.isMuted ? 'Muted' : 'Mute'}</span>
          </button>

          <button
            type="button"
            aria-label="Toggle speaker"
            onClick={onToggleSpeaker}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-full transition-colors ${
              activeCall.isSpeaker ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Volume2 className="w-6 h-6" />
            <span className="text-[11px] font-medium">{activeCall.isSpeaker ? 'Speaker On' : 'Speaker'}</span>
          </button>

          <button
            type="button"
            aria-label="Keypad"
            onClick={() => setActiveTab('keypad')}
            className="flex flex-col items-center gap-1.5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <Grid className="w-6 h-6" />
            <span className="text-[11px] font-medium">Keypad</span>
          </button>
        </div>

        {/* End Call Button */}
        <div className="mb-4">
          <button
            type="button"
            aria-label="End call"
            onClick={onEndCall}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-xl transform active:scale-95 transition-all"
          >
            <PhoneOff className="w-8 h-8" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white pb-14">
      {/* Header */}
      <div className="px-5 pt-8 pb-3 border-b border-zinc-800/80 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Phone</h1>
        <div className="flex bg-zinc-800 rounded-lg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'favorites' ? 'bg-zinc-700 text-white font-medium' : 'text-zinc-400'
            }`}
          >
            Favorites
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('keypad')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'keypad' ? 'bg-zinc-700 text-white font-medium' : 'text-zinc-400'
            }`}
          >
            Keypad
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {activeTab === 'favorites' ? (
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-1">
              Frequent Contacts
            </div>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/60 hover:bg-zinc-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow"
                      style={{ backgroundColor: contact.avatarColor }}
                    >
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">{contact.name}</div>
                      <div className="text-xs text-zinc-400">
                        {contact.relation ? `${contact.relation} • ` : ''}
                        {contact.phone}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Call ${contact.name}`}
                    onClick={() => onStartCall(contact)}
                    className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white transition-transform active:scale-90"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-between h-full pt-2">
            {/* Number display */}
            <div className="h-12 flex items-center justify-center text-2xl font-light tracking-widest text-white">
              {dialNumber || <span className="text-zinc-600">Enter Number</span>}
            </div>

            {/* Dialpad Grid */}
            <div className="grid grid-cols-3 gap-3 w-64 max-w-full my-auto">
              {[
                { n: '1', sub: '' },
                { n: '2', sub: 'ABC' },
                { n: '3', sub: 'DEF' },
                { n: '4', sub: 'GHI' },
                { n: '5', sub: 'JKL' },
                { n: '6', sub: 'MNO' },
                { n: '7', sub: 'PQRS' },
                { n: '8', sub: 'TUV' },
                { n: '9', sub: 'WXYZ' },
                { n: '*', sub: '' },
                { n: '0', sub: '+' },
                { n: '#', sub: '' },
              ].map((item) => (
                <button
                  key={item.n}
                  type="button"
                  aria-label={`Digit ${item.n}`}
                  onClick={() => handleKeyPress(item.n)}
                  className="w-16 h-16 rounded-full bg-zinc-800/90 hover:bg-zinc-700/80 active:bg-zinc-600 flex flex-col items-center justify-center transition-colors shadow-sm"
                >
                  <span className="text-2xl font-normal leading-none">{item.n}</span>
                  {item.sub && <span className="text-[9px] text-zinc-400 tracking-widest leading-none mt-1">{item.sub}</span>}
                </button>
              ))}
            </div>

            {/* Dial and Backspace */}
            <div className="flex items-center justify-center gap-8 w-full mt-3">
              <div className="w-10" />
              <button
                type="button"
                aria-label="Call dialed number"
                onClick={handleCallCustomNumber}
                disabled={!dialNumber}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
              >
                <Phone className="w-7 h-7" />
              </button>
              {dialNumber ? (
                <button
                  type="button"
                  aria-label="Delete last digit"
                  onClick={() => setDialNumber((prev) => prev.slice(0, -1))}
                  className="w-10 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Delete
                </button>
              ) : (
                <div className="w-10" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
