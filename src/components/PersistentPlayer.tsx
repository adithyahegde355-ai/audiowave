import React, { useState, useRef } from 'react';
import { useAudio } from '../context/AudioContext';
import { formatTime } from '../utils/formatTime';
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
  Maximize2,
  ListMusic,
  Heart,
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface PersistentPlayerProps {
  onOpenFullPlayer: () => void;
  onOpenQueue: () => void;
}

export const PersistentPlayer: React.FC<PersistentPlayerProps> = ({
  onOpenFullPlayer,
  onOpenQueue
}) => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeatMode,
    error,
    queue,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    toggleLike,
    isLiked
  } = useAudio();

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekHoverTime, setSeekHoverTime] = useState<number | null>(null);
  const [seekHoverX, setSeekHoverX] = useState<number>(0);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  if (!currentTrack) {
    return null;
  }

  const liked = isLiked(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seek(ratio * duration);
  };

  const handleSeekMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, hoverX / rect.width));
    setSeekHoverTime(ratio * duration);
    setSeekHoverX(hoverX);
  };

  const handleSeekMouseLeave = () => {
    setSeekHoverTime(null);
  };

  return (
    <aside
      aria-label="Audio playback controls"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0f17]/95 backdrop-blur-xl border-t border-white/10 select-none"
    >
      {/* Top Seek Progress Bar (Larger & more responsive) */}
      <div
        ref={progressBarRef}
        onClick={handleSeekClick}
        onMouseMove={handleSeekMouseMove}
        onMouseLeave={handleSeekMouseLeave}
        className="relative group h-2 hover:h-3.5 w-full bg-white/10 cursor-pointer transition-all duration-150"
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 relative transition-[width] duration-75"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
        </div>

        {/* Hover time tooltip */}
        {seekHoverTime !== null && (
          <div
            className="absolute -top-7 -translate-x-1/2 px-2.5 py-0.5 text-xs font-mono tabular-nums bg-slate-900 text-white rounded-md border border-white/10 shadow-lg pointer-events-none"
            style={{ left: `${seekHoverX}px` }}
          >
            {formatTime(seekHoverTime)}
          </div>
        )}
      </div>

      {/* Error alert banner if playback fails */}
      {error && (
        <div className="flex items-center justify-between px-6 py-2 bg-red-950/70 border-b border-red-500/20 text-xs text-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={playNext}
            className="font-medium text-red-300 hover:text-white underline ml-4 whitespace-nowrap"
          >
            Skip to next track
          </button>
        </div>
      )}

      {/* Main Mini-Player Controls Bar (Increased height & comfortable touch targets) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-22 sm:h-24 flex items-center justify-between gap-4">
        {/* Track Info (Left Zone) */}
        <div className="flex items-center gap-3.5 min-w-0 w-1/4">
          <div
            onClick={onOpenFullPlayer}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0 cursor-pointer group shadow-lg border border-white/10"
          >
            <img
              src={currentTrack.artworkSmall || currentTrack.artwork}
              alt={`${currentTrack.title} by ${currentTrack.artist}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Maximize2 className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4
                onClick={onOpenFullPlayer}
                className="text-sm sm:text-base font-bold text-white truncate cursor-pointer hover:underline"
              >
                {currentTrack.title}
              </h4>
              {currentTrack.isExplicit && (
                <span className="text-[10px] font-semibold text-slate-400 bg-white/10 px-1 py-0.2 rounded shrink-0">
                  E
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 truncate mt-0.5">
              <span className="truncate hover:text-white font-medium">{currentTrack.artist}</span>
              <span aria-hidden="true">·</span>
              {currentTrack.isFullLength ? (
                <span className="text-[10px] text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-500/30 font-bold shrink-0">
                  Full Song
                </span>
              ) : (
                <span className="text-[11px] text-indigo-400 shrink-0 font-medium">30s Preview</span>
              )}
            </div>
          </div>

          <button
            onClick={() => toggleLike(currentTrack)}
            title={liked ? 'Remove from Liked' : 'Save to Liked'}
            className="p-2 text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <Heart
              className={`w-5 h-5 transition-transform active:scale-125 ${
                liked ? 'fill-indigo-500 text-indigo-500' : ''
              }`}
            />
          </button>
        </div>

        {/* Central Playback Controls (Middle Zone - Increased size) */}
        <div className="flex flex-col items-center gap-1.5 max-w-md w-2/4">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              title={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
              className={`p-2 transition-colors rounded-full hover:bg-white/5 ${
                shuffle ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Previous */}
            <button
              onClick={playPrevious}
              title="Previous track (or restart)"
              className="p-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors active:scale-95"
            >
              <SkipBack className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            </button>

            {/* Play / Pause Primary Button (Large & prominent) */}
            <button
              onClick={togglePlayPause}
              disabled={isLoading && !isPlaying}
              title={isPlaying ? 'Pause' : 'Play'}
              className="p-3.5 sm:p-4 bg-white text-slate-950 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/20 flex items-center justify-center focus:outline-none"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={playNext}
              title="Next track"
              className="p-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors active:scale-95"
            >
              <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={cycleRepeatMode}
              title={`Repeat: ${repeatMode}`}
              className={`p-2 transition-colors rounded-full hover:bg-white/5 relative ${
                repeatMode !== 'off' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>

          {/* Time Progress */}
          <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span className="text-slate-600">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Utility Actions (Right Zone) */}
        <div className="flex items-center justify-end gap-3 w-1/4">
          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
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
              className="w-20 h-1 bg-white/20 rounded-lg cursor-pointer"
            />
          </div>

          {/* Up Next Queue Toggle */}
          <button
            onClick={onOpenQueue}
            title="Queue"
            className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <ListMusic className="w-4 h-4" />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-semibold bg-indigo-600 text-white rounded-full">
                {queue.length}
              </span>
            )}
          </button>

          {/* Stream Full Song Link */}
          {currentTrack && (
            <a
              href={currentTrack.trackViewUrl || `https://open.spotify.com/search/${encodeURIComponent(currentTrack.title + ' ' + currentTrack.artist)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Stream full song (3-5 min) on Apple Music / Spotify"
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-600 rounded-lg transition-colors border border-indigo-500/30 whitespace-nowrap"
            >
              <span>Full Song</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Full Screen Expand */}
          <button
            onClick={onOpenFullPlayer}
            title="Full player"
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
