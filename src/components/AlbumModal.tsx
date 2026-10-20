import React, { useState, useEffect } from 'react';
import { Album, Track } from '../types/music';
import { useAudio } from '../context/AudioContext';
import { getAlbumTracks } from '../services/musicApi';
import { TrackRow } from './TrackRow';
import { VinylArtwork } from './VinylArtwork';
import { X, Play, Disc, Calendar, Music, Loader2 } from 'lucide-react';

interface AlbumModalProps {
  album: Album | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPlaylistModal: (track: Track) => void;
}

export const AlbumModal: React.FC<AlbumModalProps> = ({
  album,
  isOpen,
  onClose,
  onOpenPlaylistModal
}) => {
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!album || !isOpen) return;

    if (album.tracks && album.tracks.length >= 2) {
      setTracks(album.tracks);
    }

    setIsLoading(true);
    getAlbumTracks(album.title, album.artist, 15)
      .then((res) => {
        if (res.length > 0) {
          setTracks(res);
        }
      })
      .catch((err) => console.warn('Could not fetch album tracks', err))
      .finally(() => setIsLoading(false));
  }, [album, isOpen]);

  if (!isOpen || !album) return null;

  const isAlbumPlaying = Boolean(
    isPlaying && currentTrack && tracks.some((t) => t.id === currentTrack.id)
  );

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

        {/* Album Showcase Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-b from-indigo-950/80 via-slate-900 to-[#0e121d] border-b border-white/5 flex flex-col sm:flex-row items-center gap-6">
          {/* Vinyl Artwork with spinning disc if playing */}
          <VinylArtwork
            artworkUrl={album.artwork}
            title={album.title}
            artist={album.artist}
            genre={album.genre}
            isPlaying={isAlbumPlaying}
            size="lg"
            peekOut={true}
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
              Album Collection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {album.title}
            </h2>
            <p className="text-sm font-semibold text-slate-200">{album.artist}</p>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{album.releaseYear}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{album.genre}</span>
              {album.label && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">{album.label}</span>
                </>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/30"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Album ({tracks.length} Previews)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Album Tracklist</span>
            {isLoading && (
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Fetching album tracks...</span>
              </div>
            )}
          </div>

          {tracks.length === 0 && !isLoading ? (
            <div className="p-8 text-center text-slate-500">
              <Music className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">No tracks found for this album.</p>
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
