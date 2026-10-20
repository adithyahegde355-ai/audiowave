import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { formatTime } from '../utils/formatTime';
import { AudioVisualizer } from './AudioVisualizer';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ChevronDown,
  Heart,
  ExternalLink,
  Plus,
  Loader2,
  Music2
} from 'lucide-react';

interface FullPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddToPlaylist: () => void;
}

export const FullPlayerModal: React.FC<FullPlayerModalProps> = ({
  isOpen,
  onClose,
  onOpenAddToPlaylist
}) => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    shuffle,
    repeatMode,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    changePlaybackRate,
    toggleLike,
    isLiked
  } = useAudio();

  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);

  if (!isOpen || !currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    seek(targetTime);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200"
    >
      {/* Background ambient album art glow */}
      <div
        className="absolute inset-0 opacity-20 filter blur-3xl pointer-events-none scale-125"
        style={{
          backgroundImage: `url(${currentTrack.artwork})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />

      <div className="relative w-full max-w-lg bg-[#0e121d] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Top bar inside modal */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Minimize"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          <div className="text-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Now Playing</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleLike(currentTrack)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              title={liked ? 'Unlike' : 'Like'}
            >
              <Heart
                className={`w-5 h-5 transition-transform active:scale-125 ${
                  liked ? 'fill-indigo-500 text-indigo-500' : ''
                }`}
              />
            </button>
            <button
              onClick={onOpenAddToPlaylist}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              title="Add to Playlist"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Big Album Artwork with subtle reactive shadow */}
        <div className="relative mx-auto w-64 h-64 sm:w-76 sm:h-76 rounded-2xl overflow-hidden shadow-2xl bg-slate-800 border border-white/10 shrink-0">
          <img
            src={currentTrack.artwork || currentTrack.artworkSmall}
            alt={currentTrack.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none animate-pulse" />
          )}
        </div>

        {/* Real-time Spectrum Audio Visualizer */}
        <div className="w-full px-2">
          <AudioVisualizer barCount={36} height={42} className="rounded-lg bg-black/20 py-1" />
        </div>

        {/* Track Metadata */}
        <div className="flex flex-col gap-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate max-w-sm">
              {currentTrack.title}
            </h2>
            {currentTrack.isExplicit && (
              <span className="text-[10px] font-semibold text-slate-300 bg-white/10 px-1.5 py-0.5 rounded shrink-0">
                EXPLICIT
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-300">{currentTrack.artist}</p>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-0.5">
            <span>{currentTrack.album}</span>
            <span aria-hidden="true">·</span>
            <span>{currentTrack.genre}</span>
            {currentTrack.releaseDate && (
              <>
                <span aria-hidden="true">·</span>
                <span>{currentTrack.releaseDate.split('-')[0]}</span>
              </>
            )}
          </div>
        </div>

        {/* Full Song Streaming Hub */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Music2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full Song Audio</span>
            </span>
            {currentTrack.isFullLength ? (
              <span className="text-[11px] font-bold text-sky-400 bg-sky-950/70 border border-sky-500/30 px-2 py-0.5 rounded">
                Complete Full Duration Audio Active
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">Stream Complete Master (3-5 min)</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-0.5">
            <a
              href={currentTrack.trackViewUrl || `https://music.apple.com/search?term=${encodeURIComponent(currentTrack.title + ' ' + currentTrack.artist)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white/5 hover:bg-white/15 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-white/5"
            >
              <span>Apple Music</span>
              <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>
            <a
              href={`https://open.spotify.com/search/${encodeURIComponent(currentTrack.title + ' ' + currentTrack.artist)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-medium rounded-lg transition-colors border border-emerald-500/20"
            >
              <span>Spotify</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </a>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentTrack.title + ' ' + currentTrack.artist + ' audio')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-medium rounded-lg transition-colors border border-red-500/20"
            >
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3 text-red-400" />
            </a>
          </div>
        </div>

        {/* Scrub Bar & Timestamp */}
        <div className="flex flex-col gap-1.5">
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 30}
              step="0.1"
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-xs font-mono tabular-nums text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between px-4">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            title={shuffle ? 'Shuffle on' : 'Shuffle off'}
            className={`p-2 rounded-full hover:bg-white/5 transition-colors ${
              shuffle ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          {/* Previous */}
          <button
            onClick={playPrevious}
            title="Previous track"
            className="p-3 text-slate-200 hover:text-white hover:bg-white/5 rounded-full transition-colors active:scale-95"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          {/* Play / Pause Hero Button */}
          <button
            onClick={togglePlayPause}
            disabled={isLoading && !isPlaying}
            title={isPlaying ? 'Pause' : 'Play'}
            className="p-4 bg-white text-slate-950 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center justify-center focus:outline-none"
          >
            {isLoading ? (
              <Loader2 className="w-7 h-7 animate-spin text-slate-900" />
            ) : isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={playNext}
            title="Next track"
            className="p-3 text-slate-200 hover:text-white hover:bg-white/5 rounded-full transition-colors active:scale-95"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>

          {/* Repeat */}
          <button
            onClick={cycleRepeatMode}
            title={`Repeat mode: ${repeatMode}`}
            className={`p-2 rounded-full hover:bg-white/5 transition-colors ${
              repeatMode !== 'off' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Volume & Playback Speed Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-4">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 mr-1">Speed:</span>
            {[0.75, 1, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => changePlaybackRate(rate)}
                className={`px-2 py-1 rounded text-xs font-mono ${
                  playbackRate === rate
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
              className="w-24 h-1 bg-white/20 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
