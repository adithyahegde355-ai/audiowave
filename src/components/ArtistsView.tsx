import React, { useState } from 'react';
import { Artist, Track } from '../types/music';
import { CURATED_ARTISTS } from '../services/musicApi';
import { useAudio } from '../context/AudioContext';
import { Play, CheckCircle2, Users, Sparkles, Search } from 'lucide-react';
import { ArtworkImage } from './ArtworkImage';

interface ArtistsViewProps {
  onSelectArtist: (artist: Artist) => void;
  onOpenPlaylistModal: (track: Track) => void;
}

export const ArtistsView: React.FC<ArtistsViewProps> = ({ onSelectArtist }) => {
  const { currentTrack, isPlaying, playTrack } = useAudio();
  const [filterText, setFilterText] = useState('');

  const filteredArtists = CURATED_ARTISTS.filter(
    (a) =>
      a.name.toLowerCase().includes(filterText.toLowerCase()) ||
      a.genre.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-28">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-[#0c0f17] border border-white/10 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Featured Artist Roster</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Legendary Artists
          </h1>
          <p className="text-xs text-slate-400 max-w-lg">
            Explore world-renowned artists, electronic pioneers, and chart-topping creators with high-fidelity audio previews.
          </p>
        </div>

        {/* Quick filter input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter artists or genres..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 text-white placeholder-slate-500 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArtists.map((artist) => {
          const isArtistActive =
            isPlaying &&
            currentTrack &&
            currentTrack.artist.toLowerCase().includes(artist.name.toLowerCase());

          return (
            <div
              key={artist.id}
              onClick={() => onSelectArtist(artist)}
              className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-[#0c0f17] hover:bg-slate-900/90 border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all duration-300 shadow-md hover:-translate-y-1"
            >
              {/* Circular Artist Avatar with Ambient Ring */}
              <div className="relative w-36 h-36 rounded-full overflow-hidden mb-4 shadow-xl border-2 border-white/10 group-hover:border-indigo-500 transition-colors bg-slate-800">
                <ArtworkImage
                  src={artist.avatar}
                  alt={artist.name}
                  genre={artist.genre}
                  roundedClass="rounded-full"
                  isArtist={true}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {isArtistActive && (
                  <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                    <span className="w-3 h-3 bg-indigo-400 rounded-full animate-ping" />
                  </div>
                )}
                {/* Hover Play Button Overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (artist.popularTracks && artist.popularTracks.length > 0) {
                      playTrack(artist.popularTracks[0], artist.popularTracks, 0);
                    } else {
                      onSelectArtist(artist);
                    }
                  }}
                  title={`Play ${artist.name}`}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </button>
              </div>

              {/* Artist Name & Verified Marker */}
              <div className="flex items-center gap-1.5 justify-center mb-1">
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {artist.name}
                </h3>
                {artist.verified && (
                  <span title="Verified Artist" className="inline-flex">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  </span>
                )}
              </div>

              <span className="text-xs text-slate-400 font-medium mb-2">{artist.genre}</span>

              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Users className="w-3 h-3 text-slate-400" />
                <span>{artist.monthlyListeners} monthly listeners</span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 mt-3 text-center">
                {artist.bio}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectArtist(artist);
                }}
                className="mt-4 px-4 py-1.5 text-xs font-semibold text-indigo-400 hover:text-white bg-indigo-950/40 hover:bg-indigo-600 rounded-lg transition-colors border border-indigo-500/20"
              >
                View Profile & Songs
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
