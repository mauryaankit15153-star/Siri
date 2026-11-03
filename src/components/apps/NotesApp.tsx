import React, { useState } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { NoteItem } from '../../types/siri';
import { soundFX } from '../../utils/soundEffects';

interface NotesAppProps {
  notes: NoteItem[];
  onAddNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesApp: React.FC<NotesAppProps> = ({ notes, onAddNote, onDeleteNote }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    soundFX.playToggleClick();
    onAddNote({
      id: 'note_' + Date.now(),
      title: newTitle.trim(),
      body: newBody.trim() || newTitle.trim(),
      createdAt: 'Just now',
    });
    setNewTitle('');
    setNewBody('');
    setShowAdd(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white pb-14">
      {/* Header */}
      <div className="px-5 pt-8 pb-3 border-b border-zinc-800 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-amber-400">Notes</h1>
        <button
          type="button"
          aria-label="New Note"
          onClick={() => setShowAdd(!showAdd)}
          className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {showAdd && (
          <form
            onSubmit={handleCreate}
            className="p-4 rounded-2xl bg-zinc-900 border border-amber-500/40 space-y-2.5 mb-4"
          >
            <div className="text-xs font-bold text-amber-400 uppercase">New Note</div>
            <input
              type="text"
              placeholder="Title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-zinc-800 text-white text-sm px-3 py-1.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-amber-400"
            />
            <textarea
              placeholder="Write note details..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              rows={3}
              className="w-full bg-zinc-800 text-white text-xs px-3 py-1.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-amber-400"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-3 py-1 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded-lg bg-amber-400 text-black text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 text-xs text-center">
            <Edit3 className="w-8 h-8 mb-2 opacity-30 text-amber-400" />
            <span>Koi notes nahi hain.</span>
            <span className="text-[11px] text-zinc-600 mt-1">Siri se bole: "Note likho milk lana hai"</span>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 hover:border-amber-500/30 transition-colors flex justify-between items-start"
            >
              <div className="space-y-1 pr-2 flex-1">
                <div className="font-semibold text-sm text-zinc-100">{note.title}</div>
                <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{note.body}</div>
                <div className="text-[10px] text-zinc-500 font-mono pt-1">{note.createdAt}</div>
              </div>
              <button
                type="button"
                aria-label={`Delete note ${note.title}`}
                onClick={() => onDeleteNote(note.id)}
                className="text-zinc-600 hover:text-red-400 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
