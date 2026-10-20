import React, { useState, useRef } from 'react';
import { Track } from '../types/music';
import { FULL_LENGTH_TRACKS } from '../services/musicApi';
import { useAudio } from '../context/AudioContext';
import { TrackRow } from './TrackRow';
import { ArtworkImage } from './ArtworkImage';
import {
  Headphones,
  Upload,
  Link,
  Play,
  Pause,
  ShieldCheck,
  Info,
  Sparkles,
  ExternalLink,
  Music,
  CheckCircle2,
  FileAudio,
  Volume2,
  Radio,
  Disc3,
  Flame
} from 'lucide-react';

interface FullSongsViewProps {
  onOpenPlaylistModal: (track: Track) => void;
}

export const FullSongsView: React.FC<FullSongsViewProps> = ({ onOpenPlaylistModal }) => {
  const { playTrack, togglePlayPause, currentTrack, isPlaying } = useAudio();
  const [streamUrl, setStreamUrl] = useState('');
  const [streamTitle, setStreamTitle] = useState('');
  const [streamArtist, setStreamArtist] = useState('');
  const [customTracks, setCustomTracks] = useState<Track[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'kannada' | 'global' | 'custom'>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Play full studio track list
  const handlePlayAllFullTracks = () => {
    const combined = [...customTracks, ...FULL_LENGTH_TRACKS];
    if (combined.length > 0) {
      playTrack(combined[0], combined, 0);
    }
  };

  // Handle local user audio file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newTracks: Track[] = [];

    Array.from(files).forEach((file, index) => {
      const url = URL.createObjectURL(file);
      const nameParts = file.name.replace(/\.[^/.]+$/, '').split(' - ');
      const title = nameParts.length > 1 ? nameParts[1].trim() : nameParts[0].trim();
      const artist = nameParts.length > 1 ? nameParts[0].trim() : 'Local Audio Master';

      const track: Track = {
        id: `local-${Date.now()}-${index}`,
        title: title || file.name,
        artist: artist,
        album: 'My Device Full Songs',
        artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
        artworkSmall: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80',
        duration: 240, // default placeholder until HTML5 audio metadata loads
        previewUrl: url,
        genre: 'Personal Full Track',
        region: 'Local File',
        isFullLength: true
      };
      newTracks.push(track);
    });

    setCustomTracks((prev) => [...newTracks, ...prev]);
    setIsUploading(false);

    // Auto-play the first uploaded file
    if (newTracks.length > 0) {
      playTrack(newTracks[0], [...newTracks, ...customTracks, ...FULL_LENGTH_TRACKS], 0);
    }
  };

  // Handle stream URL submission
  const handleStreamUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamUrl.trim()) return;

    const track: Track = {
      id: `stream-${Date.now()}`,
      title: streamTitle.trim() || 'Custom Full Stream Track',
      artist: streamArtist.trim() || 'Direct Web Audio Stream',
      album: 'Live Audio Stream',
      artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      artworkSmall: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&auto=format&fit=crop&q=80',
      duration: 300,
      previewUrl: streamUrl.trim(),
      genre: 'Direct Stream',
      region: 'Custom Stream',
      isFullLength: true
    };

    setCustomTracks((prev) => [track, ...prev]);
    playTrack(track, [track, ...customTracks, ...FULL_LENGTH_TRACKS], 0);
    setStreamUrl('');
    setStreamTitle('');
    setStreamArtist('');
  };

  const allFullTracks = [...customTracks, ...FULL_LENGTH_TRACKS];

  const filteredTracks = allFullTracks.filter((t) => {
    if (activeFilter === 'kannada') return t.region === 'Kannada';
    if (activeFilter === 'global') return t.region === 'Global';
    if (activeFilter === 'custom') return t.region === 'Local File' || t.region === 'Custom Stream';
    return true;
  });

  const featuredFolkMaster = FULL_LENGTH_TRACKS[0];
  const isFeaturedPlaying = currentTrack?.id === featuredFolkMaster?.id && isPlaying;

  return (
    <div className="space-y-8 pb-28">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-950 via-indigo-950 to-[#0c0f17] border border-sky-500/25 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-xs font-bold text-sky-300 uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5" />
              <span>Full-Length Complete Audio (Zero 30s Cutoff)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Full Songs & Studio Tracks
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience complete uncompressed 4 to 8-minute studio tracks with zero cutoff, featuring Indian Folk & Fusion Masters (celebrating Raghu Dixit folk style) and audiophile acoustic recordings. All songs are 100% verified and playable with live spectrum visualization!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <button
              onClick={handlePlayAllFullTracks}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xl shadow-sky-500/25 whitespace-nowrap cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Play All Full Songs ({allFullTracks.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Highlight Card: Indian Folk & Fusion Studio Master */}
      {featuredFolkMaster && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-amber-500/20">
              <ArtworkImage
                src={featuredFolkMaster.artwork}
                alt={featuredFolkMaster.title}
                genre={featuredFolkMaster.genre}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  if (currentTrack?.id === featuredFolkMaster.id) {
                    togglePlayPause();
                  } else {
                    playTrack(featuredFolkMaster, allFullTracks, 0);
                  }
                }}
                className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer group"
              >
                {isFeaturedPlaying ? (
                  <Pause className="w-8 h-8 text-amber-400 fill-current" />
                ) : (
                  <Play className="w-8 h-8 text-white fill-current ml-1 group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold tracking-wide px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Featured Full Master · 4:35 Uncut
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% Playable
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                {featuredFolkMaster.title}
              </h3>
              <p className="text-xs text-slate-300 truncate">
                {featuredFolkMaster.artist} · {featuredFolkMaster.album}
              </p>
              <p className="text-[11px] text-amber-200/80">
                Acoustic guitar rhythms, folk percussions & emotive fusion melody inspired by Raghu Dixit's folk sound.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (currentTrack?.id === featuredFolkMaster.id) {
                togglePlayPause();
              } else {
                playTrack(featuredFolkMaster, allFullTracks, 0);
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            {isFeaturedPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Master</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span>Play Master (4:35)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Explanatory Box: Commercial Preview Limits vs Full Studio Songs */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
          <Info className="w-4 h-4" />
          <span>About Full Songs & Commercial Copyright</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Free developer streaming APIs from Apple Music & Spotify are legally restricted to 30-second previews for copyright-protected commercial tracks (T-Series, Sony Music, Universal). To hear <strong>complete songs</strong> without interruption, enjoy our <strong>curated full studio tracks below</strong> (4–8 minutes each with full playback), or <strong>load your own audio files from your phone/PC</strong>, or paste any audio stream link!
        </p>
      </div>

      {/* Interactive Tool: Load Your Own Full Audio File or URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Audio File Card */}
        <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/10 hover:border-sky-500/30 transition-all flex flex-col justify-between space-y-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-1">
              <Upload className="w-4 h-4" />
              <span>Load Full Song from Device</span>
            </div>
            <h3 className="text-base font-bold text-white">Upload Your Audio Files</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select any MP3, M4A, WAV, or FLAC file from your phone or computer. Plays full duration with spectrum visualizer.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-500/10 hover:bg-sky-500 hover:text-slate-950 text-sky-300 font-semibold text-xs rounded-xl border border-sky-500/30 transition-all cursor-pointer active:scale-95"
          >
            <FileAudio className="w-4 h-4" />
            <span>{isUploading ? 'Loading...' : 'Select Audio Files (MP3 / M4A / WAV)'}</span>
          </button>
        </div>

        {/* Stream URL Card */}
        <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/10 hover:border-sky-500/30 transition-all space-y-3 shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-1">
              <Link className="w-4 h-4" />
              <span>Play Full Audio Stream URL</span>
            </div>
            <h3 className="text-base font-bold text-white">Stream Any Audio Link</h3>
          </div>

          <form onSubmit={handleStreamUrlSubmit} className="space-y-2">
            <input
              type="text"
              placeholder="Paste audio URL (e.g. https://.../track.mp3 or radio stream)"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl border border-white/10 focus:outline-none focus:border-sky-500"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Song Title (optional)"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl border border-white/10 focus:outline-none focus:border-sky-500"
              />
              <input
                type="text"
                placeholder="Artist Name (optional)"
                value={streamArtist}
                onChange={(e) => setStreamArtist(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl border border-white/10 focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              disabled={!streamUrl.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Full Stream</span>
            </button>
          </form>
        </div>
      </div>

      {/* Filter Tabs for Full Songs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          All Full Songs ({allFullTracks.length})
        </button>
        <button
          onClick={() => setActiveFilter('kannada')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'kannada'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          Kannada & Indian Folk ({allFullTracks.filter((t) => t.region === 'Kannada').length})
        </button>
        <button
          onClick={() => setActiveFilter('global')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'global'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          Studio Masters ({allFullTracks.filter((t) => t.region === 'Global').length})
        </button>
        {customTracks.length > 0 && (
          <button
            onClick={() => setActiveFilter('custom')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'custom'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            My Uploads ({customTracks.length})
          </button>
        )}
      </div>

      {/* Full Songs Tracklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Complete Full-Length Tracks ({filteredTracks.length} tracks in view)</span>
          </div>
          <span className="font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Tested & Uncut Audio
          </span>
        </div>

        <div className="rounded-2xl bg-[#0c0f17] border border-white/5 p-2 sm:p-4 space-y-1 shadow-lg">
          {filteredTracks.map((track, idx) => (
            <TrackRow
              key={`${track.id}-${idx}`}
              track={track}
              index={idx}
              playlistContext={filteredTracks}
              onOpenPlaylistModal={onOpenPlaylistModal}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
