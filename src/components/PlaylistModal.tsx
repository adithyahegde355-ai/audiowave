import React, { useState } from 'react';
import { Track } from '../types/music';
import { useAudio } from '../context/AudioContext';
import { X, Plus, Check, ListMusic } from 'lucide-react';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTrack?: Track | null;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  targetTrack
}) => {
  const { playlists, createPlaylist, addTrackToPlaylist } = useAudio();
  const [isCreating, setIsCreating] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');

  const [themeColor, setThemeColor] = useState<string>('indigo');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim()) return;

    const newPl = createPlaylist(playlistName, playlistDesc, themeColor);
    if (targetTrack) {
      addTrackToPlaylist(newPl.id, targetTrack);
    }
    setPlaylistName('');
    setPlaylistDesc('');
    setThemeColor('indigo');
    setIsCreating(false);
    onClose();
  };

  const handleAddToPlaylist = (playlistId: string) => {
    if (targetTrack) {
      addTrackToPlaylist(playlistId, targetTrack);
    }
    onClose();
  };

  const THEME_OPTIONS = [
    { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-600' },
    { id: 'violet', label: 'Violet', bg: 'bg-violet-600' },
    { id: 'rose', label: 'Rose', bg: 'bg-rose-600' },
    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
    { id: 'amber', label: 'Amber', bg: 'bg-amber-600' },
    { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-600' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-md bg-[#0e121d] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              {targetTrack ? 'Add to Playlist' : 'Create Playlist'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target track preview */}
        {targetTrack && (
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <img
              src={targetTrack.artworkSmall || targetTrack.artwork}
              alt={targetTrack.title}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-lg object-cover bg-slate-800"
            />
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-semibold text-white truncate">{targetTrack.title}</h5>
              <p className="text-[11px] text-slate-400 truncate">{targetTrack.artist}</p>
            </div>
          </div>
        )}

        {isCreating ? (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Playlist Name</label>
              <input
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="e.g. Chill Beats, Late Night Vibe"
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none text-sm"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={playlistDesc}
                onChange={(e) => setPlaylistDesc(e.target.value)}
                placeholder="Describe the mood or genre..."
                rows={2}
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Accent Theme Color
              </label>
              <div className="flex items-center gap-2">
                {THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeColor(theme.id)}
                    className={`w-7 h-7 rounded-full ${theme.bg} transition-transform ${
                      themeColor === theme.id ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={theme.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                Create Playlist
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/20 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-white/5 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Playlist</span>
            </button>

            {targetTrack && (
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Select Existing Playlist
                </span>
                {playlists.map((pl) => {
                  const alreadyHas = pl.tracks.some((t) => t.id === targetTrack.id);
                  return (
                    <button
                      key={pl.id}
                      onClick={() => handleAddToPlaylist(pl.id)}
                      disabled={alreadyHas}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                        alreadyHas
                          ? 'bg-white/5 opacity-50 cursor-not-allowed'
                          : 'hover:bg-white/5 text-white'
                      }`}
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-medium text-slate-200 truncate">{pl.name}</h4>
                        <span className="text-[10px] text-slate-500">{pl.tracks.length} tracks</span>
                      </div>
                      {alreadyHas ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </span>
                      ) : (
                        <span className="text-xs text-indigo-400 font-medium">Add</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
