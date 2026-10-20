import React, { useState, useMemo } from 'react';
import { Track } from '../types/music';
import { ALL_TRACKS, REGIONAL_FILTERS } from '../services/musicApi';
import { useAudio } from '../context/AudioContext';
import { TrackRow } from './TrackRow';
import { Play, TrendingUp, Search, Music, Sparkles } from 'lucide-react';

interface SongsViewProps {
  onOpenPlaylistModal: (track: Track) => void;
}

export const SongsView: React.FC<SongsViewProps> = ({ onOpenPlaylistModal }) => {
  const { playTrack } = useAudio();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Filter songs by region and search term
  const filteredTracks = useMemo(() => {
    let result = ALL_TRACKS;

    if (selectedRegion === 'full') {
      result = result.filter((t) => t.isFullLength);
    } else if (selectedRegion !== 'all') {
      result = result.filter((t) => t.region === selectedRegion);
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.album.toLowerCase().includes(q) ||
          t.genre.toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedRegion, searchFilter]);

  const handlePlayAll = () => {
    if (filteredTracks.length > 0) {
      playTrack(filteredTracks[0], filteredTracks, 0);
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-[#0c0f17] border border-white/10 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>Official Catalogue · {ALL_TRACKS.length}+ Verified Audio Previews</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Indian Regional & Global Songs
          </h1>
          <p className="text-xs text-slate-400 max-w-lg">
            Stream official 30-second audio previews across Kannada, Hindi, Tamil, Telugu, Punjabi, Malayalam, and Global hits.
          </p>
        </div>

        <button
          onClick={handlePlayAll}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/30 whitespace-nowrap self-start sm:self-auto"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Play All ({filteredTracks.length} Songs)</span>
        </button>
      </div>

      {/* Regional Filter Tabs (Zero-pill button controls) */}
      <div className="space-y-2">
        <span className="text-xs text-slate-400 font-medium">Select Language / Region:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
          {REGIONAL_FILTERS.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                selectedRegion === reg.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <span>{reg.name}</span>
              <span className="ml-1.5 text-[10px] opacity-75 font-mono">({reg.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* In-view Search Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder={`Filter through ${filteredTracks.length} songs by title, artist, or album...`}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0c0f17] text-white placeholder-slate-500 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Tracks Chart List */}
      <div className="rounded-2xl bg-[#0c0f17] border border-white/5 p-2 sm:p-4 shadow-lg space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-400 px-3 py-1.5 border-b border-white/5">
          <span>Displaying {filteredTracks.length} tracks</span>
          <span className="font-mono text-indigo-400">30s Official Previews</span>
        </div>

        {filteredTracks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Music className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-sm">No songs match your filter.</p>
            <button
              onClick={() => {
                setSearchFilter('');
                setSelectedRegion('all');
              }}
              className="text-xs text-indigo-400 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredTracks.map((track, idx) => (
            <TrackRow
              key={`${track.id}-${idx}`}
              track={track}
              index={idx}
              playlistContext={filteredTracks}
              onOpenPlaylistModal={onOpenPlaylistModal}
            />
          ))
        )}
      </div>
    </div>
  );
};
