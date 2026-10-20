import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { formatTime } from '../utils/formatTime';
import { X, Trash2, ArrowUp, ArrowDown, Play, Music, Radio, BookmarkPlus, Check } from 'lucide-react';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const {
    currentTrack,
    queue,
    currentIndex,
    isPlaying,
    playTrack,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    saveQueueAsPlaylist
  } = useAudio();

  const [isSavingQueue, setIsSavingQueue] = useState<boolean>(false);
  const [queuePlaylistName, setQueuePlaylistName] = useState<string>('');

  if (!isOpen) return null;

  const totalQueueDuration = queue.reduce((acc, t) => acc + (t.duration || 30), 0);

  const handleSaveQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queuePlaylistName.trim()) return;
    saveQueueAsPlaylist(queuePlaylistName.trim());
    setQueuePlaylistName('');
    setIsSavingQueue(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0c0f18] border-l border-white/10 shadow-2xl flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Playback Queue</h3>
          <span className="text-xs font-mono text-slate-400">({queue.length})</span>
        </div>

        <div className="flex items-center gap-1">
          {queue.length > 0 && (
            <button
              onClick={() => setIsSavingQueue((prev) => !prev)}
              className="px-2.5 py-1 text-xs text-slate-300 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1"
              title="Save queue as playlist"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          )}

          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1"
              title="Clear upcoming tracks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Save Queue Form Drawer */}
      {isSavingQueue && (
        <form
          onSubmit={handleSaveQueue}
          className="p-4 bg-[#111622] border-b border-indigo-500/20 space-y-2.5 animate-in slide-in-from-top duration-150"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Save Queue as Custom Playlist</span>
            <button
              type="button"
              onClick={() => setIsSavingQueue(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={queuePlaylistName}
              onChange={(e) => setQueuePlaylistName(e.target.value)}
              placeholder="e.g. My Evening Queue"
              className="flex-1 px-3 py-1.5 bg-slate-900 text-white rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none text-xs"
              autoFocus
              required
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-sm shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </form>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Now Playing Section */}
        {currentTrack && (
          <div className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Now Playing
            </span>
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentTrack.artworkSmall || currentTrack.artwork}
                  alt={currentTrack.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{currentTrack.title}</h4>
                  <p className="text-xs text-slate-300 truncate">{currentTrack.artist}</p>
                  <span className="text-[10px] text-indigo-400 font-mono">
                    {currentTrack.isFullLength ? 'Full Length Master' : 'Official Preview'}
                  </span>
                </div>
              </div>
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-4 shrink-0 pr-2">
                  <span className="w-0.5 h-full bg-indigo-400 animate-[bounce_0.8s_infinite]" />
                  <span className="w-0.5 h-2 bg-indigo-400 animate-[bounce_0.6s_infinite_0.2s]" />
                  <span className="w-0.5 h-3 bg-indigo-400 animate-[bounce_0.9s_infinite_0.4s]" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Up Next List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Up Next
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>{queue.length} tracks</span>
              <span aria-hidden="true">·</span>
              <span>{formatTime(totalQueueDuration)}</span>
            </div>
          </div>

          {queue.length === 0 ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
              <Music className="w-8 h-8 text-slate-600" />
              <p className="text-sm">Your queue is empty</p>
              <p className="text-xs">Add tracks from Discover, Search, or Library to build your queue.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {queue.map((track, idx) => {
                const isItemCurrent = idx === currentIndex;
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    className={`group flex items-center justify-between gap-3 p-2.5 rounded-lg transition-colors ${
                      isItemCurrent
                        ? 'bg-white/5 border border-indigo-500/20'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div
                      onClick={() => playTrack(track, queue, idx)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="w-5 text-xs font-mono text-slate-500 shrink-0 text-center">
                        {idx + 1}
                      </span>
                      <img
                        src={track.artworkSmall || track.artwork}
                        alt={track.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded object-cover bg-slate-800 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                          {track.title}
                        </h5>
                        <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                      </div>
                    </div>

                    {/* Actions: Reorder & Remove */}
                    <div className="flex items-center gap-1 shrink-0">
                      {idx > 0 && (
                        <button
                          onClick={() => reorderQueue(idx, idx - 1)}
                          title="Move up"
                          className="p-1 text-slate-500 hover:text-white transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {idx < queue.length - 1 && (
                        <button
                          onClick={() => reorderQueue(idx, idx + 1)}
                          title="Move down"
                          className="p-1 text-slate-500 hover:text-white transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => removeFromQueue(idx)}
                        title="Remove from queue"
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
