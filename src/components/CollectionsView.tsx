import React, { useState } from 'react';
import { Album, Track } from '../types/music';
import { CURATED_ALBUMS } from '../services/musicApi';
import { useAudio } from '../context/AudioContext';
import { VinylArtwork } from './VinylArtwork';
import { Disc, Play, Sparkles, Search } from 'lucide-react';

interface CollectionsViewProps {
  onSelectAlbum: (album: Album) => void;
  onOpenPlaylistModal: (track: Track) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({ onSelectAlbum }) => {
  const { currentTrack, isPlaying, playTrack } = useAudio();
  const [filterText, setFilterText] = useState('');

  const filteredAlbums = CURATED_ALBUMS.filter(
    (a) =>
      a.title.toLowerCase().includes(filterText.toLowerCase()) ||
      a.artist.toLowerCase().includes(filterText.toLowerCase()) ||
      a.genre.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-28">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-[#0c0f17] border border-white/10 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
            <Disc className="w-4 h-4" />
            <span>Iconic Discography & Vinyl Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Album Collections
          </h1>
          <p className="text-xs text-slate-400 max-w-lg">
            Immerse yourself in legendary vinyl albums and master recordings with authentic record sleeve art and audio previews.
          </p>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search albums or artists..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 text-white placeholder-slate-500 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Album Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.map((album) => {
          const isAlbumPlaying = Boolean(
            isPlaying &&
            currentTrack &&
            album.tracks.some((t) => t.id === currentTrack.id)
          );

          return (
            <div
              key={album.id}
              onClick={() => onSelectAlbum(album)}
              className="group relative flex flex-col p-5 rounded-2xl bg-[#0c0f17] hover:bg-slate-900 border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all duration-300 shadow-md hover:-translate-y-1"
            >
              {/* Vinyl Record & Jacket Sleeve Showcase */}
              <div className="flex justify-center my-2">
                <VinylArtwork
                  artworkUrl={album.artwork}
                  title={album.title}
                  artist={album.artist}
                  genre={album.genre}
                  isPlaying={isAlbumPlaying}
                  size="md"
                  peekOut={true}
                />
              </div>

              {/* Album Metadata */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                    {album.title}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 shrink-0">
                    {album.releaseYear}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-300 truncate">{album.artist}</p>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                  <span>{album.genre}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-indigo-400 font-mono">Vinyl Edition</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (album.tracks.length > 0) {
                      playTrack(album.tracks[0], album.tracks, 0);
                    } else {
                      onSelectAlbum(album);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play Album</span>
                </button>

                <span className="text-xs text-slate-400 font-medium hover:text-white">
                  Inspect Tracklist →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
