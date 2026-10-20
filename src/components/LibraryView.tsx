import React, { useState, useRef } from 'react';
import { Track, Playlist } from '../types/music';
import { useAudio } from '../context/AudioContext';
import { TrackRow } from './TrackRow';
import {
  Heart,
  ListMusic,
  History,
  Play,
  Shuffle,
  Plus,
  Trash2,
  Music,
  Sparkles,
  Download,
  Upload,
  Edit2,
  Check,
  ArrowUp,
  ArrowDown,
  X,
  Clock,
  Search
} from 'lucide-react';
import { formatTime } from '../utils/formatTime';

interface LibraryViewProps {
  onOpenPlaylistModal: (track?: Track) => void;
  onCreateNewPlaylist: () => void;
  onOpenSmartPlaylist?: () => void;
}

const THEME_ACCENTS: Record<string, { bg: string; border: string; text: string }> = {
  indigo: { bg: 'bg-indigo-600/20', border: 'border-indigo-500/30', text: 'text-indigo-400' },
  violet: { bg: 'bg-violet-600/20', border: 'border-violet-500/30', text: 'text-violet-400' },
  rose: { bg: 'bg-rose-600/20', border: 'border-rose-500/30', text: 'text-rose-400' },
  emerald: { bg: 'bg-emerald-600/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  amber: { bg: 'bg-amber-600/20', border: 'border-amber-500/30', text: 'text-amber-400' },
  cyan: { bg: 'bg-cyan-600/20', border: 'border-cyan-500/30', text: 'text-cyan-400' },
};

export const LibraryView: React.FC<LibraryViewProps> = ({
  onOpenPlaylistModal,
  onCreateNewPlaylist,
  onOpenSmartPlaylist
}) => {
  const {
    likedTracks,
    playlists,
    history,
    playTrack,
    playPlaylist,
    deletePlaylist,
    editPlaylist,
    reorderPlaylistTracks,
    removeTrackFromPlaylist,
    exportPlaylistsJson,
    importPlaylistsJson
  } = useAudio();

  const [subTab, setSubTab] = useState<'liked' | 'playlists' | 'history'>('liked');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editing state for playlist
  const [isEditingPlaylist, setIsEditingPlaylist] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editDesc, setEditDesc] = useState<string>('');
  const [editTheme, setEditTheme] = useState<string>('indigo');

  // JSON Import ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Total durations
  const totalLikedDuration = likedTracks.reduce((acc, t) => acc + (t.duration || 30), 0);
  const selectedPlaylistDuration = selectedPlaylist
    ? selectedPlaylist.tracks.reduce((acc, t) => acc + (t.duration || 30), 0)
    : 0;

  // Filtered liked tracks
  const filteredLikedTracks = likedTracks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.album.toLowerCase().includes(q)
    );
  });

  const handleStartEditing = (playlist: Playlist) => {
    setEditName(playlist.name);
    setEditDesc(playlist.description);
    setEditTheme(playlist.themeColor || 'indigo');
    setIsEditingPlaylist(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlaylist) return;
    editPlaylist(selectedPlaylist.id, editName, editDesc, selectedPlaylist.coverImage, editTheme);
    setSelectedPlaylist({
      ...selectedPlaylist,
      name: editName.trim() || selectedPlaylist.name,
      description: editDesc,
      themeColor: editTheme,
      updatedAt: Date.now()
    });
    setIsEditingPlaylist(false);
  };

  const handleExportBackup = () => {
    const jsonStr = exportPlaylistsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibewave-playlists-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importPlaylistsJson(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleShufflePlayLiked = () => {
    if (likedTracks.length === 0) return;
    const shuffled = [...likedTracks].sort(() => 0.5 - Math.random());
    playTrack(shuffled[0], shuffled, 0);
  };

  const handleShufflePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length === 0) return;
    const shuffled = [...playlist.tracks].sort(() => 0.5 - Math.random());
    playTrack(shuffled[0], shuffled, 0);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Sub navigation segmented controls & Top Utility Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1.5 bg-[#0c0f17] rounded-xl border border-white/5 w-fit">
          <button
            onClick={() => {
              setSubTab('liked');
              setSelectedPlaylist(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'liked'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Liked Songs ({likedTracks.length})</span>
          </button>

          <button
            onClick={() => {
              setSubTab('playlists');
              setSelectedPlaylist(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'playlists'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>Playlists ({playlists.length})</span>
          </button>

          <button
            onClick={() => {
              setSubTab('history');
              setSelectedPlaylist(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({history.length})</span>
          </button>
        </div>

        {/* Global Library Actions: AI Smart Mix + JSON Backup */}
        <div className="flex items-center gap-2">
          {onOpenSmartPlaylist && (
            <button
              onClick={onOpenSmartPlaylist}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/25 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Smart Mix</span>
            </button>
          )}

          <button
            onClick={handleExportBackup}
            title="Download JSON backup of your playlists"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 text-xs font-medium rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Export Backup</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import playlists from a JSON file"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 text-xs font-medium rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Import JSON</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. Liked Songs Tab */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subTab === 'liked' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Liked Songs</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{likedTracks.length} tracks</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{formatTime(totalLikedDuration)} duration</span>
                <span aria-hidden="true">·</span>
                <span>Saved locally</span>
              </div>
            </div>

            {likedTracks.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShufflePlayLiked}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium rounded-xl transition-colors border border-white/5"
                >
                  <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Shuffle</span>
                </button>
                <button
                  onClick={() => playTrack(likedTracks[0], likedTracks, 0)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/30"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play All</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick search input */}
          {likedTracks.length > 4 && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in liked tracks..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 text-white rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none text-xs"
              />
            </div>
          )}

          {likedTracks.length === 0 ? (
            <div className="p-16 text-center text-slate-500 rounded-2xl bg-[#0c0f17] border border-white/5 space-y-3">
              <Heart className="w-12 h-12 mx-auto text-slate-600" />
              <div>
                <h4 className="text-base font-semibold text-slate-300">No liked songs yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Click the heart icon on any track row or player bar to save songs for instant offline playback.
                </p>
              </div>
            </div>
          ) : filteredLikedTracks.length === 0 ? (
            <div className="p-12 text-center text-slate-500 rounded-2xl bg-[#0c0f17] border border-white/5">
              <p className="text-xs text-slate-400">No tracks matched "{searchQuery}"</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#0c0f17] border border-white/5 p-2 sm:p-4 space-y-1 shadow-lg">
              {filteredLikedTracks.map((track, idx) => (
                <TrackRow
                  key={`${track.id}-${idx}`}
                  track={track}
                  index={idx}
                  playlistContext={filteredLikedTracks}
                  onOpenPlaylistModal={onOpenPlaylistModal}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. Playlists Tab */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subTab === 'playlists' && (
        <div className="space-y-6">
          {selectedPlaylist ? (
            /* Inspecting a specific playlist */
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedPlaylist(null);
                    setIsEditingPlaylist(false);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  <span>← Back to Playlists</span>
                </button>

                <div className="flex items-center gap-2">
                  {selectedPlaylist.isCustom && (
                    <>
                      <button
                        onClick={() => handleStartEditing(selectedPlaylist)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white rounded-lg border border-white/5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Details</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete playlist "${selectedPlaylist.name}"?`)) {
                            deletePlaylist(selectedPlaylist.id);
                            setSelectedPlaylist(null);
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-xs text-red-400 rounded-lg border border-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Edit Modal / Banner */}
              {isEditingPlaylist && (
                <form
                  onSubmit={handleSaveEdit}
                  className="p-5 rounded-2xl bg-[#111622] border border-indigo-500/30 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Edit Playlist Information</h4>
                    <button
                      type="button"
                      onClick={() => setIsEditingPlaylist(false)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Playlist Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-900 text-white rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-900 text-white rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingPlaylist(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Playlist Banner Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 rounded-2xl bg-[#0c0f17] border border-white/5 shadow-md">
                <img
                  src={
                    selectedPlaylist.coverImage ||
                    selectedPlaylist.tracks[0]?.artwork ||
                    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={selectedPlaylist.name}
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 rounded-xl object-cover bg-slate-800 shrink-0 shadow-lg"
                />

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      {selectedPlaylist.isCustom ? 'Custom Playlist' : 'Curated Mix'}
                    </span>
                    {selectedPlaylist.themeColor && (
                      <span className="text-[10px] text-slate-500">#{selectedPlaylist.themeColor}</span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white tracking-tight">{selectedPlaylist.name}</h3>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    {selectedPlaylist.description || 'Personal music collection'}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 pt-1 font-mono">
                    <span>{selectedPlaylist.tracks.length} tracks</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatTime(selectedPlaylistDuration)} duration</span>
                  </div>

                  {selectedPlaylist.tracks.length > 0 && (
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-3">
                      <button
                        onClick={() => playPlaylist(selectedPlaylist)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/30"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play Playlist</span>
                      </button>
                      <button
                        onClick={() => handleShufflePlayPlaylist(selectedPlaylist)}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium rounded-xl transition-colors border border-white/5"
                      >
                        <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Shuffle</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tracks in playlist with Reordering controls */}
              {selectedPlaylist.tracks.length === 0 ? (
                <div className="p-16 text-center text-slate-500 rounded-2xl bg-[#0c0f17] border border-white/5 space-y-2">
                  <Music className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-sm text-slate-300">This playlist has no songs yet.</p>
                  <p className="text-xs text-slate-400">
                    Browse songs in Discover, Search, or Full Songs and click "+" to add them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-1 rounded-2xl bg-[#0c0f17] border border-white/5 p-2 sm:p-4">
                  <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-500 border-b border-white/5 mb-1">
                    <span># Title & Artist</span>
                    <span>Reorder / Remove</span>
                  </div>

                  {selectedPlaylist.tracks.map((track, idx) => (
                    <div
                      key={`${track.id}-${idx}`}
                      className="group flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="w-5 text-center text-xs font-mono text-slate-500 shrink-0">
                          {idx + 1}
                        </span>
                        <img
                          src={track.artworkSmall || track.artwork}
                          alt={track.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                        />
                        <div
                          className="min-w-0 flex-1 cursor-pointer"
                          onClick={() => playTrack(track, selectedPlaylist.tracks, idx)}
                        >
                          <h5 className="text-xs font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
                            {track.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                        </div>
                      </div>

                      {/* Reorder and remove buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        {idx > 0 && (
                          <button
                            onClick={() => reorderPlaylistTracks(selectedPlaylist.id, idx, idx - 1)}
                            title="Move track up"
                            className="p-1.5 text-slate-500 hover:text-white rounded hover:bg-white/5 transition-colors"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {idx < selectedPlaylist.tracks.length - 1 && (
                          <button
                            onClick={() => reorderPlaylistTracks(selectedPlaylist.id, idx, idx + 1)}
                            title="Move track down"
                            className="p-1.5 text-slate-500 hover:text-white rounded hover:bg-white/5 transition-colors"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            removeTrackFromPlaylist(selectedPlaylist.id, track.id);
                            setSelectedPlaylist({
                              ...selectedPlaylist,
                              tracks: selectedPlaylist.tracks.filter((t) => t.id !== track.id)
                            });
                          }}
                          title="Remove from playlist"
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-white/5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Playlists Grid */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Your Playlists</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {playlists.length} playlists stored in browser LocalStorage
                  </p>
                </div>

                <button
                  onClick={onCreateNewPlaylist}
                  className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Playlist</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {playlists.map((playlist) => {
                  const theme = THEME_ACCENTS[playlist.themeColor || 'indigo'] || THEME_ACCENTS.indigo;
                  return (
                    <div
                      key={playlist.id}
                      onClick={() => setSelectedPlaylist(playlist)}
                      className="group flex flex-col p-4 rounded-2xl bg-[#0c0f17] hover:bg-slate-900 border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all duration-200 shadow-md"
                    >
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-800 mb-3">
                        <img
                          src={
                            playlist.coverImage ||
                            playlist.tracks[0]?.artwork ||
                            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
                          }
                          alt={playlist.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playPlaylist(playlist);
                          }}
                          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-indigo-600/40"
                          title="Play Playlist"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors truncate">
                          {playlist.name}
                        </h4>
                        {playlist.themeColor && (
                          <span className={`w-2 h-2 rounded-full ${theme.bg} shrink-0`} />
                        )}
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {playlist.description || 'Custom mix'}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                        <span>{playlist.tracks.length} tracks</span>
                        {playlist.isCustom && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Custom Mix</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. History Tab */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Listening History</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {history.length} recently played tracks from your sessions
              </p>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="p-16 text-center text-slate-500 rounded-2xl bg-[#0c0f17] border border-white/5 space-y-2">
              <History className="w-10 h-10 mx-auto text-slate-600" />
              <h4 className="text-base font-semibold text-slate-300">No listening history yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Play any track to record your recent history here.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#0c0f17] border border-white/5 p-2 sm:p-4 space-y-1 shadow-lg">
              {history.map((track, idx) => (
                <TrackRow
                  key={`${track.id}-${idx}`}
                  track={track}
                  index={idx}
                  playlistContext={history}
                  onOpenPlaylistModal={onOpenPlaylistModal}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
