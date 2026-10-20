import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Track, PlaybackState, RepeatMode, Playlist } from '../types/music';
import { FEATURED_TRACKS, INITIAL_PLAYLISTS, validateAudioUrl } from '../services/musicApi';

interface AudioContextType extends PlaybackState {
  // Core Playback Controls
  togglePlayPause: () => void;
  playTrack: (track: Track, newQueue?: Track[], startIndex?: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (time: number) => void;
  setVolumeLevel: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  changePlaybackRate: (rate: number) => void;

  // Queue Operations
  addToQueue: (track: Track) => void;
  playNextInQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;

  // Library & Playlists
  likedTracks: Track[];
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string | number) => boolean;
  playlists: Playlist[];
  createPlaylist: (name: string, description?: string, themeColor?: string) => Playlist;
  editPlaylist: (playlistId: string, name: string, description?: string, coverImage?: string, themeColor?: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string | number) => void;
  reorderPlaylistTracks: (playlistId: string, fromIndex: number, toIndex: number) => void;
  deletePlaylist: (playlistId: string) => void;
  playPlaylist: (playlist: Playlist) => void;
  saveQueueAsPlaylist: (name: string, description?: string) => Playlist;
  saveSmartPlaylist: (name: string, description: string, tracks: Track[], themeColor?: string) => Playlist;
  exportPlaylistsJson: () => string;
  importPlaylistsJson: (jsonString: string) => { success: boolean; count: number; error?: string };

  // Audio Analyser for Visualizer
  getAudioFrequencyData: () => Uint8Array | null;
  toastMessage: string | null;
  clearToast: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const LOCAL_STORAGE_LIKES_KEY = 'vibewave_liked_tracks';
const LOCAL_STORAGE_PLAYLISTS_KEY = 'vibewave_custom_playlists';

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Playback state
  const [currentTrack, setCurrentTrack] = useState<Track | null>(FEATURED_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [lastVolume, setLastVolume] = useState<number>(0.85);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [error, setError] = useState<string | null>(null);
  const [queue, setQueue] = useState<Track[]>(FEATURED_TRACKS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [history, setHistory] = useState<Track[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Liked songs state initialized from localStorage
  const [likedTracks, setLikedTracks] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LIKES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read liked tracks from storage', e);
    }
    return [FEATURED_TRACKS[0], FEATURED_TRACKS[1]];
  });

  // Playlists state initialized from localStorage
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PLAYLISTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read playlists from storage', e);
    }
    return INITIAL_PLAYLISTS;
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Save liked tracks
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_LIKES_KEY, JSON.stringify(likedTracks));
    } catch (e) {
      console.warn('Could not save liked tracks', e);
    }
  }, [likedTracks]);

  // Save playlists
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PLAYLISTS_KEY, JSON.stringify(playlists));
    } catch (e) {
      console.warn('Could not save playlists', e);
    }
  }, [playlists]);

  // Initialize Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    // Do not set crossOrigin by default; set dynamically based on URL to prevent CORS blockage
    audio.volume = volume;
    audioRef.current = audio;

    // Attach listeners
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };

    const handleError = () => {
      // If error occurred with crossOrigin set, retry once without crossOrigin
      if (audio.crossOrigin) {
        console.warn('CORS restriction on audio element, retrying without crossOrigin attribute...');
        audio.removeAttribute('crossorigin');
        audio.load();
        audio.play().catch((e) => {
          console.warn('Retry without crossOrigin failed:', e);
        });
        return;
      }

      setIsLoading(false);
      setIsPlaying(false);
      const mediaErr = audio.error;
      let msg = 'Playback error: Unable to load audio stream.';
      if (mediaErr) {
        if (mediaErr.code === 4) {
          msg = 'Audio format not supported or stream is temporarily unavailable.';
        } else if (mediaErr.code === 2) {
          msg = 'Network error while fetching audio stream.';
        }
      }
      setError(msg);
      showToast(msg);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.src = '';
    };
  }, [showToast]);

  // Lazy initialize Web Audio API Analyser on user interaction
  const initWebAudio = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      const ctx = new AudioCtxClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Low-latency, crisp frequency bars
      analyser.smoothingTimeConstant = 0.8;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch (err) {
      // AudioContext creation might fail due to autoplay or CORS in some environments;
      // non-fatal, visualizer falls back smoothly.
      console.warn('Web Audio Analyser initialization skipped or restricted:', err);
    }
  }, []);

  // Update MediaSession API for OS lock screen / background playback controls
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album,
        artwork: [
          { src: currentTrack.artworkSmall || currentTrack.artwork, sizes: '96x96', type: 'image/jpeg' },
          { src: currentTrack.artwork, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    } catch (err) {
      console.warn('MediaSession metadata error', err);
    }
  }, [currentTrack, isPlaying]);

  // Load and play track implementation
  const playTrack = useCallback(
    async (track: Track, newQueue?: Track[], startIndex?: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Ensure Web Audio context is resumed/initialized
      initWebAudio();
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }

      // Check previewUrl validity
      const isValid = await validateAudioUrl(track.previewUrl);
      if (!isValid) {
        setError(`No playable audio preview available for "${track.title}"`);
        showToast(`Preview unavailable for "${track.title}"`);
        return;
      }

      setError(null);
      setIsLoading(true);
      setCurrentTrack(track);

      // Handle queue updates
      if (newQueue && newQueue.length > 0) {
        setQueue(newQueue);
        const idx = startIndex !== undefined ? startIndex : newQueue.findIndex((t) => t.id === track.id);
        setCurrentIndex(idx !== -1 ? idx : 0);
      } else {
        // If track is not already in queue, insert it
        setQueue((prevQueue) => {
          const idx = prevQueue.findIndex((t) => t.id === track.id);
          if (idx === -1) {
            const nextQueue = [...prevQueue, track];
            setCurrentIndex(nextQueue.length - 1);
            return nextQueue;
          } else {
            setCurrentIndex(idx);
            return prevQueue;
          }
        });
      }

      // Add to history
      setHistory((prev) => [track, ...prev.filter((t) => t.id !== track.id)].slice(0, 50));

      // Load and start playback
      try {
        const isCorsSafe =
          track.previewUrl.startsWith('/') ||
          track.previewUrl.startsWith('blob:') ||
          track.previewUrl.startsWith('data:') ||
          track.previewUrl.includes('itunes.apple.com') ||
          track.previewUrl.includes('mzstatic.com');

        if (isCorsSafe) {
          audio.crossOrigin = 'anonymous';
        } else {
          audio.removeAttribute('crossorigin');
        }

        audio.src = track.previewUrl;
        audio.playbackRate = playbackRate;
        audio.currentTime = 0;
        setCurrentTime(0);

        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (err: any) {
        console.warn('Playback initiation error:', err);
        // User didn't interact with DOM yet or audio fetch failed
        setIsPlaying(false);
        setIsLoading(false);
        if (err.name === 'NotAllowedError') {
          showToast('Tap play to start audio playback');
        } else {
          setError('Unable to play audio preview. Try another track.');
        }
      }
    },
    [initWebAudio, playbackRate, showToast]
  );

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    initWebAudio();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!currentTrack && queue.length > 0) {
        playTrack(queue[0]);
        return;
      }
      if (!audio.src && currentTrack) {
        playTrack(currentTrack);
        return;
      }

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setError(null);
        })
        .catch((err) => {
          console.warn('Play failed', err);
          if (currentTrack) {
            playTrack(currentTrack);
          }
        });
    }
  }, [currentTrack, initWebAudio, isPlaying, playTrack, queue]);

  // Core Play Next functionality
  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    if (shuffle) {
      // Pick random index different from currentIndex if queue > 1
      if (queue.length > 1) {
        let nextRandom = Math.floor(Math.random() * queue.length);
        while (nextRandom === currentIndex) {
          nextRandom = Math.floor(Math.random() * queue.length);
        }
        playTrack(queue[nextRandom]);
      } else {
        playTrack(queue[0]);
      }
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      playTrack(queue[nextIndex]);
    } else {
      // Reached end of queue
      if (repeatMode === 'all') {
        playTrack(queue[0]);
      } else {
        // Stop at end of queue
        setIsPlaying(false);
        setCurrentTime(0);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    }
  }, [currentIndex, queue, repeatMode, shuffle, playTrack]);

  // Core Play Previous functionality
  const playPrevious = useCallback(() => {
    const audio = audioRef.current;
    // Standard audio UX: If song has played for more than 3 seconds, replay from start
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      return;
    }

    if (queue.length === 0) return;

    if (shuffle) {
      const prevRandom = Math.floor(Math.random() * queue.length);
      playTrack(queue[prevRandom]);
      return;
    }

    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      playTrack(queue[prevIndex]);
    } else {
      // Loop to end if repeat all is active
      if (repeatMode === 'all') {
        playTrack(queue[queue.length - 1]);
      } else {
        // Otherwise just replay current first song
        playTrack(queue[0]);
      }
    }
  }, [currentIndex, isPlaying, queue, repeatMode, shuffle, playTrack]);

  // Handle Track Completion (`onended`)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 'one') {
        // Repeat current track
        audio.currentTime = 0;
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        playNext();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playNext, repeatMode]);

  // Register MediaSession action handlers
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.setActionHandler('play', () => {
        togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        playPrevious();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        playNext();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && details.seekTime !== null) {
          seek(details.seekTime);
        }
      });
    } catch (e) {
      console.warn('Could not bind mediaSession actions', e);
    }
  }, [playNext, playPrevious, togglePlayPause]);

  // Scrub / Seek
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(time, duration));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, [duration]);

  // Volume
  const setVolumeLevel = useCallback((vol: number) => {
    const audio = audioRef.current;
    const clamped = Math.max(0, Math.min(vol, 1));
    setVolume(clamped);
    if (audio) {
      audio.volume = clamped;
    }
    if (clamped > 0) {
      setIsMuted(false);
      setLastVolume(clamped);
    } else {
      setIsMuted(true);
    }
  }, []);

  // Mute toggle
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      const restored = lastVolume > 0 ? lastVolume : 0.85;
      audio.volume = restored;
      setVolume(restored);
      setIsMuted(false);
    } else {
      setLastVolume(volume);
      audio.volume = 0;
      setVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, lastVolume, volume]);

  // Shuffle toggle
  const toggleShuffle = useCallback(() => {
    setShuffle((prev) => {
      const next = !prev;
      showToast(next ? 'Shuffle enabled' : 'Shuffle disabled');
      return next;
    });
  }, [showToast]);

  // Repeat mode cycle: off -> all -> one -> off
  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      let next: RepeatMode = 'off';
      if (prev === 'off') {
        next = 'all';
        showToast('Repeat all tracks');
      } else if (prev === 'all') {
        next = 'one';
        showToast('Repeat current track');
      } else {
        next = 'off';
        showToast('Repeat off');
      }
      return next;
    });
  }, [showToast]);

  // Playback rate
  const changePlaybackRate = useCallback((rate: number) => {
    const audio = audioRef.current;
    setPlaybackRate(rate);
    if (audio) {
      audio.playbackRate = rate;
    }
  }, []);

  // Queue Operations
  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track]);
    showToast(`Added "${track.title}" to queue`);
  }, [showToast]);

  const playNextInQueue = useCallback((track: Track) => {
    setQueue((prev) => {
      const insertAt = currentIndex + 1;
      const copy = [...prev];
      copy.splice(insertAt, 0, track);
      return copy;
    });
    showToast(`"${track.title}" will play next`);
  }, [currentIndex, showToast]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const copy = [...prev];
      const removed = copy.splice(index, 1)[0];
      if (index < currentIndex) {
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (index === currentIndex) {
        // If current playing track was removed, play next
        if (copy.length > 0) {
          const nextIdx = index < copy.length ? index : 0;
          setCurrentIndex(nextIdx);
          playTrack(copy[nextIdx]);
        }
      }
      showToast(`Removed "${removed.title}" from queue`);
      return copy;
    });
  }, [currentIndex, playTrack, showToast]);

  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
    setQueue((prev) => {
      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= prev.length || toIndex >= prev.length) {
        return prev;
      }
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);

      // Adjust currentIndex if necessary
      if (fromIndex === currentIndex) {
        setCurrentIndex(toIndex);
      } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
        setCurrentIndex((i) => i - 1);
      } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
        setCurrentIndex((i) => i + 1);
      }

      return copy;
    });
  }, [currentIndex]);

  const clearQueue = useCallback(() => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setCurrentIndex(0);
    } else {
      setQueue([]);
      setCurrentIndex(0);
    }
    showToast('Queue cleared');
  }, [currentTrack, showToast]);

  // Likes
  const toggleLike = useCallback((track: Track) => {
    setLikedTracks((prev) => {
      const exists = prev.some((t) => t.id === track.id);
      if (exists) {
        showToast(`Removed "${track.title}" from Liked Songs`);
        return prev.filter((t) => t.id !== track.id);
      } else {
        showToast(`Added "${track.title}" to Liked Songs`);
        return [track, ...prev];
      }
    });
  }, [showToast]);

  const isLiked = useCallback(
    (trackId: string | number) => {
      return likedTracks.some((t) => t.id === trackId);
    },
    [likedTracks]
  );

  // Playlists
  const createPlaylist = useCallback((name: string, description?: string, themeColor?: string) => {
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      name: name.trim() || 'My Playlist',
      description: description || 'Curated music playlist',
      themeColor: themeColor || 'indigo',
      tracks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isCustom: true
    };
    setPlaylists((prev) => [newPl, ...prev]);
    showToast(`Created playlist "${newPl.name}"`);
    return newPl;
  }, [showToast]);

  const editPlaylist = useCallback((playlistId: string, name: string, description?: string, coverImage?: string, themeColor?: string) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        return {
          ...pl,
          name: name.trim() || pl.name,
          description: description !== undefined ? description : pl.description,
          coverImage: coverImage !== undefined ? coverImage : pl.coverImage,
          themeColor: themeColor !== undefined ? themeColor : pl.themeColor,
          updatedAt: Date.now()
        };
      })
    );
    showToast('Playlist updated');
  }, [showToast]);

  const reorderPlaylistTracks = useCallback((playlistId: string, fromIndex: number, toIndex: number) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        if (fromIndex < 0 || toIndex < 0 || fromIndex >= pl.tracks.length || toIndex >= pl.tracks.length) return pl;
        const tracksCopy = [...pl.tracks];
        const [moved] = tracksCopy.splice(fromIndex, 1);
        tracksCopy.splice(toIndex, 0, moved);
        return {
          ...pl,
          tracks: tracksCopy,
          updatedAt: Date.now()
        };
      })
    );
  }, []);

  const addTrackToPlaylist = useCallback((playlistId: string, track: Track) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        if (pl.tracks.some((t) => t.id === track.id)) {
          showToast(`Track is already in "${pl.name}"`);
          return pl;
        }
        showToast(`Added "${track.title}" to "${pl.name}"`);
        return {
          ...pl,
          tracks: [...pl.tracks, track],
          updatedAt: Date.now()
        };
      })
    );
  }, [showToast]);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string | number) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        return {
          ...pl,
          tracks: pl.tracks.filter((t) => t.id !== trackId),
          updatedAt: Date.now()
        };
      })
    );
  }, []);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
    showToast('Playlist deleted');
  }, [showToast]);

  const playPlaylist = useCallback((playlist: Playlist) => {
    if (playlist.tracks.length === 0) {
      showToast('Playlist is empty');
      return;
    }
    playTrack(playlist.tracks[0], playlist.tracks, 0);
  }, [playTrack, showToast]);

  const saveQueueAsPlaylist = useCallback((name: string, description?: string) => {
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      name: name.trim() || 'Saved Queue',
      description: description || `Saved queue of ${queue.length} tracks`,
      themeColor: 'indigo',
      tracks: [...queue],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isCustom: true
    };
    setPlaylists((prev) => [newPl, ...prev]);
    showToast(`Saved queue as "${newPl.name}"`);
    return newPl;
  }, [queue, showToast]);

  const saveSmartPlaylist = useCallback((name: string, description: string, tracks: Track[], themeColor?: string) => {
    const newPl: Playlist = {
      id: `ai-pl-${Date.now()}`,
      name: name.trim() || 'AI Smart Mix',
      description: description || 'Curated smart mix',
      themeColor: themeColor || 'indigo',
      tracks: tracks,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isCustom: true
    };
    setPlaylists((prev) => [newPl, ...prev]);
    showToast(`Smart playlist "${newPl.name}" ready`);
    return newPl;
  }, [showToast]);

  const exportPlaylistsJson = useCallback((): string => {
    const exportData = {
      app: 'VibeWave',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      playlists: playlists.filter((pl) => pl.isCustom),
      likedTracks: likedTracks
    };
    return JSON.stringify(exportData, null, 2);
  }, [playlists, likedTracks]);

  const importPlaylistsJson = useCallback((jsonString: string): { success: boolean; count: number; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      let incomingPlaylists: Playlist[] = [];
      if (Array.isArray(data)) {
        incomingPlaylists = data;
      } else if (Array.isArray(data.playlists)) {
        incomingPlaylists = data.playlists;
      } else {
        return { success: false, count: 0, error: 'Invalid file format: missing playlists array' };
      }

      if (incomingPlaylists.length === 0) {
        return { success: false, count: 0, error: 'No playlists found in the file' };
      }

      const sanitized: Playlist[] = incomingPlaylists.map((pl, idx) => ({
        id: pl.id ? `imported-${pl.id}-${Date.now()}-${idx}` : `pl-${Date.now()}-${idx}`,
        name: pl.name || `Imported Playlist ${idx + 1}`,
        description: pl.description || 'Imported playlist',
        themeColor: pl.themeColor || 'indigo',
        coverImage: pl.coverImage,
        tracks: Array.isArray(pl.tracks) ? pl.tracks : [],
        createdAt: pl.createdAt || Date.now(),
        updatedAt: Date.now(),
        isCustom: true
      }));

      // Also merge liked tracks if present
      if (data.likedTracks && Array.isArray(data.likedTracks)) {
        setLikedTracks((prev) => {
          const map = new Map<string | number, Track>();
          prev.forEach((t) => map.set(t.id, t));
          data.likedTracks.forEach((t: Track) => {
            if (t && t.id) map.set(t.id, t);
          });
          return Array.from(map.values());
        });
      }

      setPlaylists((prev) => [...sanitized, ...prev]);
      showToast(`Imported ${sanitized.length} playlists`);
      return { success: true, count: sanitized.length };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message || 'Failed to parse JSON file' };
    }
  }, [showToast]);

  // Audio Analyser Frequency Data for dynamic visualizers
  const getAudioFrequencyData = useCallback((): Uint8Array | null => {
    if (!isPlaying) return null;
    const bufferLength = analyserRef.current ? analyserRef.current.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    if (analyserRef.current) {
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      if (sum > 0) {
        return dataArray;
      }
    }

    // Responsive dynamic waveform fallback when Web Audio is restricted by CORS or loading
    const time = Date.now() / 180;
    for (let i = 0; i < bufferLength; i++) {
      const wave = Math.sin(time + i * 0.45) * 0.5 + 0.5;
      const beat = Math.sin(time * 2.2) > 0.2 ? 1 : 0.65;
      dataArray[i] = Math.floor(wave * 190 * beat * (isMuted ? 0 : volume));
    }
    return dataArray;
  }, [isPlaying, isMuted, volume]);

  return (
    <AudioContext.Provider
      value={{
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
        error,
        queue,
        currentIndex,
        history,

        togglePlayPause,
        playTrack,
        playNext,
        playPrevious,
        seek,
        setVolumeLevel,
        toggleMute,
        toggleShuffle,
        cycleRepeatMode,
        changePlaybackRate,

        addToQueue,
        playNextInQueue,
        removeFromQueue,
        reorderQueue,
        clearQueue,

        likedTracks,
        toggleLike,
        isLiked,
        playlists,
        createPlaylist,
        editPlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        reorderPlaylistTracks,
        deletePlaylist,
        playPlaylist,
        saveQueueAsPlaylist,
        saveSmartPlaylist,
        exportPlaylistsJson,
        importPlaylistsJson,

        getAudioFrequencyData,
        toastMessage,
        clearToast
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
