import React, { useState, useEffect } from 'react';
import { Artist, Track } from '../types/music';
import { useAudio } from '../context/AudioContext';
import { getArtistTracks } from '../services/musicApi';
import { TrackRow } from './TrackRow';
import { X, Play, CheckCircle2, Users, Loader2, Music2 } from 'lucide-react';
import { ArtworkImage } from './ArtworkImage';

interface ArtistModalProps {
  artist: Artist | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPlaylistModal: (track: Track) => void;
}

export const ArtistModal: React.FC<ArtistModalProps> = ({
  artist,
  isOpen,
  onClose,
  onOpenPlaylistModal
}) => {
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!artist || !isOpen) return;

    if (artist.popularTracks && artist.popularTracks.length >= 3) {
      setTracks(artist.popularTracks);
    }

    setIsLoading(true);
    getArtistTracks(artist.name, 15)
      .then((res) => {
        if (res.length > 0) {
          setTracks(res);
        }
      })
      .catch((err) => console.warn('Could not fetch artist tracks', err))
      .finally(() => setIsLoading(false));
  }, [artist, isOpen]);

  if (!isOpen || !artist) return null;

  const isCurrentArtistPlaying =
    isPlaying && currentTrack && tracks.some((t) => t.id === currentTrack.id);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks, 0);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#0e121d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 text-slate-300 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Artist Hero Header with ambient banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-b from-indigo-950/80 via-slate-900 to-[#0e121d] border-b border-white/5 flex flex-col sm:flex-row items-center gap-6">
          {/* Circular Artist Avatar with neon soundwave aura */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-2xl border-2 border-indigo-500/40 shrink-0 bg-slate-800">
            <ArtworkImage
              src={artist.avatar}
              alt={artist.name}
              genre={artist.genre}
              roundedClass="rounded-full"
              isArtist={true}
              className="w-full h-full object-cover"
            />
            {isCurrentArtistPlaying && (
              <div className="absolute inset-0 border-4 border-indigo-400 rounded-full animate-ping opacity-30 pointer-events-none" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-indigo-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Verified Artist</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {artist.name}
            </h2>

            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
              <span>{artist.genre}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Users className="w-3.5 h-3.5" />
                <span>{artist.monthlyListeners} monthly listeners</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 max-w-lg mt-1">{artist.bio}</p>

            <div className="pt-2">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/30"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Artist Songs ({tracks.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Top Songs & Previews</span>
            {isLoading && (
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Loading catalogue...</span>
              </div>
            )}
          </div>

          {tracks.length === 0 && !isLoading ? (
            <div className="p-8 text-center text-slate-500">
              <Music2 className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">No tracks found for this artist.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {tracks.map((track, idx) => (
                <TrackRow
                  key={`${track.id}-${idx}`}
                  track={track}
                  index={idx}
                  playlistContext={tracks}
                  onOpenPlaylistModal={onOpenPlaylistModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
