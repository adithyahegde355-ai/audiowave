import React, { useState, useEffect, useRef } from 'react';
import { Track, Artist } from '../types/music';
import { searchTracks, CURATED_ARTISTS } from '../services/musicApi';
import { TrackRow } from './TrackRow';
import { ArtworkImage } from './ArtworkImage';
import { useAudio } from '../context/AudioContext';
import { Search, X, Loader2, Music, TrendingUp, Sparkles, Filter, Play, CheckCircle2, Headphones } from 'lucide-react';

interface SearchViewProps {
  onOpenPlaylistModal: (track: Track) => void;
  onSelectArtist?: (artist: Artist) => void;
  initialQuery?: string;
}

const POPULAR_SEARCHES = [
  'Raghu Dixit',
  'Lokada Kaalaji',
  'Kantara',
  'Sapta Sagaradaache Ello',
  'Charan Raj',
  'Vasuki Vaibhav',
  'Arijit Singh',
  'KGF Ravi Basrur',
  'Sanjith Hegde',
  'Vijay Prakash',
  'Full Studio Mix',
  'Diljit Dosanjh',
  'Sid Sriram',
  'A.R. Rahman',
  'Daft Punk',
  'Coldplay'
];

export const SearchView: React.FC<SearchViewProps> = ({
  onOpenPlaylistModal,
  onSelectArtist,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<Track[]>([]);
  const [matchedArtists, setMatchedArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'full' | 'kannada' | 'hindi' | 'artists'>('all');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { playTrack } = useAudio();

  // Core search runner
  const runSearch = async (searchTerm: string, filterMode = activeFilter) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setResults([]);
      setMatchedArtists([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Check for artist matches
      const lower = trimmed.toLowerCase();
      const artists = CURATED_ARTISTS.filter(
        (a) => a.name.toLowerCase().includes(lower) || a.genre.toLowerCase().includes(lower)
      );
      setMatchedArtists(artists);

      // Perform track search
      let tracks = await searchTracks(trimmed, 50);

      // Apply in-search category filter if selected
      if (filterMode === 'full') {
        tracks = tracks.filter((t) => t.isFullLength || t.duration > 60);
      } else if (filterMode === 'kannada') {
        tracks = tracks.filter((t) => t.region === 'Kannada' || t.genre.toLowerCase().includes('kannada'));
      } else if (filterMode === 'hindi') {
        tracks = tracks.filter((t) => t.region === 'Hindi' || t.genre.toLowerCase().includes('hindi'));
      }

      setResults(tracks);
    } catch (err) {
      console.error('Search error', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Live debounced search as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setMatchedArtists([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      runSearch(query);
    }, 280);

    return () => clearTimeout(timer);
  }, [query, activeFilter]);

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  // Suggestion click
  const handleSuggestionClick = (tag: string) => {
    setQuery(tag);
    runSearch(tag);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setMatchedArtists([]);
    setHasSearched(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Focus on mount and execute initialQuery if present
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (initialQuery.trim()) {
      setQuery(initialQuery);
      runSearch(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="space-y-6 pb-28">
      {/* Primary Search Input with Working Search Button */}
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by song, artist (e.g. Raghu Dixit), album, or genre..."
            className="w-full pl-12 pr-10 py-3.5 bg-[#0c0f17] text-white placeholder-slate-500 rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm transition-all shadow-lg"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Working Search Button */}
        <button
          type="submit"
          onClick={() => runSearch(query)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>Search</span>
        </button>
      </form>

      {/* Segmented Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-500 flex items-center gap-1 font-medium mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </span>
        {[
          { id: 'all', label: 'All Results' },
          { id: 'kannada', label: 'Kannada Hits' },
          { id: 'hindi', label: 'Hindi / Bollywood' },
          { id: 'full', label: 'Full Songs Only' },
          { id: 'artists', label: 'Artists Only' }
        ].map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => {
              setActiveFilter(filter.id as any);
              if (query.trim()) {
                runSearch(query, filter.id as any);
              }
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
              activeFilter === filter.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Suggested Popular Searches */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          <span>Quick Suggestions (Instant Search):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {POPULAR_SEARCHES.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleSuggestionClick(tag)}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-indigo-600 hover:text-white text-slate-300 transition-all border border-white/5 whitespace-nowrap active:scale-95 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-400 rounded-2xl bg-[#0c0f17] border border-white/5">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm font-medium">Searching catalogue and library for "{query}"...</p>
        </div>
      )}

      {/* Featured Artist Match Card */}
      {!isLoading && matchedArtists.length > 0 && activeFilter !== 'full' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Artist Match</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedArtists.slice(0, 2).map((artist) => (
              <div
                key={artist.id}
                onClick={() => onSelectArtist && onSelectArtist(artist)}
                className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-[#0c0f17] border border-amber-500/20 hover:border-amber-500/40 cursor-pointer transition-all shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-amber-500/40 shadow-md">
                    <ArtworkImage
                      src={artist.avatar}
                      alt={artist.name}
                      genre={artist.genre}
                      roundedClass="rounded-full"
                      isArtist={true}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                        {artist.name}
                      </h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-400 truncate">{artist.genre}</p>
                    <p className="text-[11px] text-amber-300/80 font-mono mt-0.5">
                      {artist.monthlyListeners} monthly listeners
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (artist.popularTracks && artist.popularTracks.length > 0) {
                      playTrack(artist.popularTracks[0], artist.popularTracks, 0);
                    } else if (onSelectArtist) {
                      onSelectArtist(artist);
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:scale-105 active:scale-95 ml-2"
                  title={`Play ${artist.name}`}
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Track List */}
      {!isLoading && hasSearched && results.length === 0 && matchedArtists.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 gap-3 text-slate-500 rounded-2xl bg-[#0c0f17] border border-white/5">
          <Music className="w-10 h-10 text-slate-600" />
          <h4 className="text-base font-semibold text-slate-300">No tracks found</h4>
          <p className="text-xs text-slate-400 text-center max-w-sm">
            We couldn't find matches for "{query}". Try searching for an artist like <strong>Raghu Dixit</strong>, <strong>Arijit Singh</strong>, or <strong>Kantara</strong>.
          </p>
        </div>
      ) : !isLoading && results.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Found <strong className="text-white">{results.length} tracks</strong> for "{query}"
            </span>
            <span className="font-mono text-indigo-400">High-Fidelity Audio</span>
          </div>
          <div className="rounded-2xl bg-[#0c0f17] border border-white/5 p-2 sm:p-4 space-y-1 shadow-lg">
            {results.map((track, idx) => (
              <TrackRow
                key={`${track.id}-${idx}`}
                track={track}
                index={idx}
                playlistContext={results}
                onOpenPlaylistModal={onOpenPlaylistModal}
              />
            ))}
          </div>
        </div>
      ) : !isLoading && !hasSearched ? (
        <div className="p-12 text-center text-slate-500 rounded-2xl bg-[#0c0f17] border border-white/5 space-y-3">
          <Music className="w-10 h-10 mx-auto text-slate-600" />
          <h4 className="text-sm font-semibold text-slate-300">Search 520+ Songs, Artists & Full Tracks</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Type any song name, artist like <span className="text-amber-400 font-semibold">Raghu Dixit</span>, movie soundtrack, or genre above to start listening instantly.
          </p>
        </div>
      ) : null}
    </div>
  );
};
