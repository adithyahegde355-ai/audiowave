import React from 'react';
import { Track } from '../types/music';
import { useAudio } from '../context/AudioContext';
import { formatTime } from '../utils/formatTime';
import { ArtworkImage } from './ArtworkImage';
import { Play, Pause, Heart, ListPlus, Radio, MoreHorizontal, ExternalLink } from 'lucide-react';

interface TrackRowProps {
  track: Track;
  index?: number;
  playlistContext?: Track[];
  onOpenPlaylistModal?: (track: Track) => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  playlistContext,
  onOpenPlaylistModal
}) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    addToQueue,
    playNextInQueue,
    toggleLike,
    isLiked
  } = useAudio();

  const isCurrent = currentTrack?.id === track.id;
  const isCurrentPlaying = isCurrent && isPlaying;
  const liked = isLiked(track.id);

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(track, playlistContext);
    }
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group relative flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
        isCurrent
          ? 'bg-indigo-950/40 border border-indigo-500/30'
          : 'hover:bg-white/5 border border-transparent'
      }`}
    >
      {/* Left: Index / Play Icon / Artwork / Track details */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Index or Equalizer or Play button */}
        <div className="w-6 flex items-center justify-center shrink-0 text-xs font-mono text-slate-500">
          {isCurrentPlaying ? (
            <div className="flex items-end gap-0.5 h-3.5">
              <span className="w-0.5 h-full bg-indigo-400 animate-[bounce_0.8s_infinite]" />
              <span className="w-0.5 h-2 bg-indigo-400 animate-[bounce_0.6s_infinite_0.2s]" />
              <span className="w-0.5 h-3 bg-indigo-400 animate-[bounce_0.9s_infinite_0.4s]" />
            </div>
          ) : (
            <>
              <span className="group-hover:hidden">{index !== undefined ? index + 1 : ''}</span>
              <Play className="w-3.5 h-3.5 text-white fill-current hidden group-hover:block" />
            </>
          )}
        </div>

        {/* Thumbnail Artwork */}
        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-white/5 shadow-sm">
          <ArtworkImage
            src={track.artworkSmall || track.artwork}
            alt={track.title}
            genre={track.genre}
            className="w-full h-full object-cover"
          />
          {isCurrentPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Pause className="w-4 h-4 text-white fill-current" />
            </div>
          )}
        </div>

        {/* Title, Artist, Album */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h5
              className={`text-sm font-semibold truncate ${
                isCurrent ? 'text-indigo-400' : 'text-slate-100 group-hover:text-white'
              }`}
            >
              {track.title}
            </h5>
            {track.isExplicit && (
              <span className="text-[9px] font-bold text-slate-400 bg-white/10 px-1 py-0.2 rounded shrink-0">
                E
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
            <span className="truncate hover:underline">{track.artist}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate text-slate-500">{track.album}</span>
          </div>
        </div>
      </div>

      {/* Middle: Genre & duration badge (desktop only) */}
      <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 w-44 shrink-0 truncate">
        <span className="truncate">{track.genre}</span>
        <span aria-hidden="true">·</span>
        {track.isFullLength ? (
          <span className="text-[10px] font-bold text-sky-400 bg-sky-950/70 border border-sky-500/30 px-1.5 py-0.5 rounded">
            Full Song
          </span>
        ) : (
          <span className="text-indigo-400/80 font-mono text-[11px]">30s Preview</span>
        )}
      </div>

      {/* Right: Quick actions (Like, Add to Queue, Play Next, Time) */}
      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => toggleLike(track)}
          title={liked ? 'Unlike' : 'Like'}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              liked ? 'fill-indigo-500 text-indigo-500' : ''
            }`}
          />
        </button>

        <button
          onClick={() => playNextInQueue(track)}
          title="Play Next"
          className="p-2 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-white/5"
        >
          <Radio className="w-4 h-4" />
        </button>

        <button
          onClick={() => addToQueue(track)}
          title="Add to Queue"
          className="p-2 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-white/5"
        >
          <ListPlus className="w-4 h-4" />
        </button>

        {onOpenPlaylistModal && (
          <button
            onClick={() => onOpenPlaylistModal(track)}
            title="Add to Playlist"
            className="p-2 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-white/5"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        )}

        <a
          href={track.trackViewUrl || `https://open.spotify.com/search/${encodeURIComponent(track.title + ' ' + track.artist)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Stream Full Song (3-5 min) on Apple Music / Spotify"
          className="p-2 text-slate-400 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-white/5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Duration */}
        <span className="text-xs font-mono tabular-nums text-slate-400 w-11 text-right ml-1">
          {formatTime(track.duration || 30)}
        </span>
      </div>
    </div>
  );
};
