import React, { useState, useEffect } from 'react';
import { Track, Playlist, Artist, Album } from '../types/music';
import { CURATED_GENRES, FEATURED_TRACKS, CURATED_ARTISTS, CURATED_ALBUMS, searchTracks } from '../services/musicApi';
import { useAudio } from '../context/AudioContext';
import { TrackRow } from './TrackRow';
import { VinylArtwork } from './VinylArtwork';
import { ArtworkImage } from './ArtworkImage';
import { Play, Pause, Sparkles, Loader2, ListPlus, Users, Disc, ChevronRight } from 'lucide-react';

interface DiscoverViewProps {
  onOpenPlaylistModal: (track: Track) => void;
  onNavigateTab: (tab: 'discover' | 'songs' | 'artists' | 'collections' | 'search' | 'library') => void;
  onSelectArtist: (artist: Artist) => void;
  onSelectAlbum: (album: Album) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  onOpenPlaylistModal,
  onNavigateTab,
  onSelectArtist,
  onSelectAlbum
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, playlists, playPlaylist, addToQueue } = useAudio();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [genreTracks, setGenreTracks] = useState<Track[]>(FEATURED_TRACKS);
  const [isLoadingGenre, setIsLoadingGenre] = useState<boolean>(false);

  const heroTrack = FEATURED_TRACKS[0];
  const isHeroPlaying = currentTrack?.id === heroTrack.id && isPlaying;

  // Load tracks when genre changes
  useEffect(() => {
    let isCancelled = false;
    const genre = CURATED_GENRES.find((g) => g.id === selectedGenre);
    if (!genre || selectedGenre === 'all') {
      setGenreTracks(FEATURED_TRACKS);
      return;
    }

    setIsLoadingGenre(true);
    searchTracks(genre.query, 16).then((results) => {
      if (!isCancelled) {
        setGenreTracks(results.length > 0 ? results : FEATURED_TRACKS);
        setIsLoadingGenre(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedGenre]);

  return (
    <div className="space-y-10 pb-28">
      {/* Hero Featured Spotlight with Vinyl Record & Jacket */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-[#0e121d] border border-white/10 p-6 sm:p-8 shadow-2xl">
        {/* Ambient background blur */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-8">
          {/* Hero Tactile Vinyl Artwork */}
          <div className="flex justify-center shrink-0">
            <VinylArtwork
              artworkUrl={heroTrack.artwork}
              title={heroTrack.title}
              artist={heroTrack.artist}
              genre={heroTrack.genre}
              isPlaying={isHeroPlaying}
              size="hero"
              peekOut={true}
              onClick={() => {
                if (currentTrack?.id === heroTrack.id) {
                  togglePlayPause();
                } else {
                  playTrack(heroTrack, FEATURED_TRACKS, 0);
                }
              }}
            />
          </div>

          {/* Hero Details */}
          <div className="flex flex-col justify-between flex-1 text-center md:text-left">
            <div className="space-y-2.5">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-indigo-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Featured Spotlight · Official 30s High-Fidelity Audio Preview</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {heroTrack.title}
              </h1>

              <p className="text-lg text-slate-200 font-medium">{heroTrack.artist}</p>

              <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-400">
                <span>Album: {heroTrack.album}</span>
                <span aria-hidden="true">·</span>
                <span>Genre: {heroTrack.genre}</span>
                <span aria-hidden="true">·</span>
                <span className="text-indigo-400 font-mono">Vinyl Edition</span>
              </div>
            </div>

            {/* Play Actions */}
            <div className="flex items-center justify-center md:justify-start gap-3 mt-6">
              <button
                onClick={() => {
                  if (currentTrack?.id === heroTrack.id) {
                    togglePlayPause();
                  } else {
                    playTrack(heroTrack, FEATURED_TRACKS, 0);
                  }
                }}
                className="flex items-center gap-2.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30"
              >
                {isHeroPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Preview</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Preview</span>
                  </>
                )}
              </button>

              <button
                onClick={() => addToQueue(heroTrack)}
                className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 active:scale-95 text-slate-200 font-medium rounded-xl border border-white/10 transition-colors"
              >
                <ListPlus className="w-4 h-4" />
                <span>Add to Queue</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists Showcase Row */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Featured Artists</h2>
          </div>
          <button
            onClick={() => onNavigateTab('artists')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>View All Artists</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {CURATED_ARTISTS.slice(0, 6).map((artist) => {
            const isArtistActive =
              isPlaying &&
              currentTrack &&
              currentTrack.artist.toLowerCase().includes(artist.name.toLowerCase());

            return (
              <div
                key={artist.id}
                onClick={() => onSelectArtist(artist)}
                className="group flex flex-col items-center text-center p-3.5 rounded-2xl bg-[#0c0f17] hover:bg-slate-900 border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all duration-200 shadow-md"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2.5 shadow-lg border border-white/10 group-hover:border-indigo-500 transition-colors bg-slate-800">
                  <ArtworkImage
                    src={artist.avatar}
                    alt={artist.name}
                    genre={artist.genre}
                    roundedClass="rounded-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {isArtistActive && (
                    <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                      <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-ping" />
                    </div>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate max-w-full">
                  {artist.name}
                </h4>
                <span className="text-[10px] text-slate-400 truncate max-w-full mt-0.5">
                  {artist.genre.split('/')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Albums & Vinyl Collections Row */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Disc className="w-4 h-4 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Iconic Albums & Collections</h2>
          </div>
          <button
            onClick={() => onNavigateTab('collections')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>Explore Collections</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURATED_ALBUMS.slice(0, 3).map((album) => {
            const isAlbumPlaying = Boolean(
              isPlaying &&
              currentTrack &&
              album.tracks.some((t) => t.id === currentTrack.id)
            );

            return (
              <div
                key={album.id}
                onClick={() => onSelectAlbum(album)}
                className="group flex flex-col p-4 rounded-2xl bg-[#0c0f17] hover:bg-slate-900 border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all duration-200 shadow-md"
              >
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
                <div className="mt-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                    {album.title}
                  </h4>
                  <p className="text-xs text-slate-300 truncate">{album.artist}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>{album.releaseYear}</span>
                    <span aria-hidden="true">·</span>
                    <span>{album.genre}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Genre & Vibe Filter Tabs (Clean functional segmented control) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">Explore by Vibe</h2>
          {isLoadingGenre && (
            <div className="flex items-center gap-1.5 text-xs text-indigo-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Fetching live catalog...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
          {CURATED_GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                selectedGenre === genre.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Tracks List */}
        <div className="rounded-2xl bg-[#0c0f17] border border-white/5 p-2 sm:p-4 space-y-1">
          {genreTracks.map((track, idx) => (
            <TrackRow
              key={`${track.id}-${idx}`}
              track={track}
              index={idx}
              playlistContext={genreTracks}
              onOpenPlaylistModal={onOpenPlaylistModal}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
