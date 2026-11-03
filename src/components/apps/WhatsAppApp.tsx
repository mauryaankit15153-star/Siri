import React, { useState } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { ChatMessage, Contact } from '../../types/siri';
import { soundFX } from '../../utils/soundEffects';

interface WhatsAppAppProps {
  messages: ChatMessage[];
  contacts: Contact[];
  onSendMessage: (text: string) => void;
  onStartCall: (contact: Contact) => void;
  onBack: () => void;
}

export const WhatsAppApp: React.FC<WhatsAppAppProps> = ({
  messages,
  contacts,
  onSendMessage,
  onStartCall,
  onBack,
}) => {
  const [inputText, setInputText] = useState('');
  const activeChatContact = contacts[0] || {
    id: 'c1',
    name: 'Papa',
    phone: '+91 98200 11223',
    avatarColor: '#3B82F6',
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    soundFX.playToggleClick();
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0b141a] text-zinc-100 pb-12 select-none">
      {/* WhatsApp Header */}
      <div className="bg-[#202c33] px-3 pt-8 pb-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="text-zinc-300 hover:text-white p-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow"
            style={{ backgroundColor: activeChatContact.avatarColor }}
          >
            {activeChatContact.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-sm leading-tight">{activeChatContact.name}</div>
            <div className="text-[11px] text-emerald-400">online</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-zinc-300">
          <button
            type="button"
            aria-label={`Call ${activeChatContact.name}`}
            onClick={() => onStartCall(activeChatContact)}
            className="hover:text-white"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button type="button" aria-label="Video Call" className="hover:text-white">
            <Video className="w-4 h-4" />
          </button>
          <MoreVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="text-center my-2">
          <span className="text-[10px] bg-[#182229] text-zinc-400 px-3 py-1 rounded-full uppercase tracking-wider">
            Today
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[80%] rounded-2xl px-3.5 py-2 text-xs shadow-sm ${
              msg.isMe
                ? 'ml-auto bg-[#005c4b] text-white rounded-tr-none'
                : 'mr-auto bg-[#202c33] text-zinc-200 rounded-tl-none'
            }`}
          >
            <span>{msg.text}</span>
            <span className="text-[9px] text-zinc-300/70 self-end mt-1 font-mono">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="bg-[#202c33] p-2 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-[#2a3942] text-white text-xs px-3.5 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="w-8 h-8 rounded-full bg-[#00a884] hover:bg-[#008f70] flex items-center justify-center text-white shadow"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
};
