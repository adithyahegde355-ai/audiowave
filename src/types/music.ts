export interface Track {
  id: string | number;
  title: string;
  artist: string;
  album: string;
  artwork: string; // High-res artwork URL (600x600)
  artworkSmall: string; // Thumbnail URL (100x100)
  duration: number; // Duration in seconds (previews are ~30s)
  previewUrl: string; // Valid audio stream URL (.m4a/.mp3)
  genre: string;
  releaseDate?: string;
  trackViewUrl?: string; // Link to official track on Apple Music/iTunes
  isExplicit?: boolean;
  region?: string;
  isFullLength?: boolean;
  fullStreamingUrls?: {
    appleMusic?: string;
    spotify?: string;
    youtube?: string;
  };
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  genre: string;
  monthlyListeners: string;
  bio: string;
  verified: boolean;
  popularTracks?: Track[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  releaseYear: string | number;
  genre: string;
  trackCount: number;
  tracks: Track[];
  label?: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlaybackState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 1
  isMuted: boolean;
  playbackRate: number; // 0.75, 1, 1.25, 1.5
  shuffle: boolean;
  repeatMode: RepeatMode;
  error: string | null;
  queue: Track[];
  currentIndex: number;
  history: Track[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  themeColor?: string; // Tailwind color token or hex e.g. 'indigo', 'violet', 'rose', 'emerald', 'amber', 'cyan'
  tracks: Track[];
  createdAt: number;
  updatedAt?: number;
  isCustom?: boolean;
}

export interface SmartPlaylistRequest {
  mood: string;
  genres: string[];
  trackCount: number;
  vibePrompt?: string;
  availableTracks?: {
    id: string | number;
    title: string;
    artist: string;
    genre: string;
  }[];
}

export interface SmartPlaylistResponse {
  name: string;
  description: string;
  themeColor: string;
  selectedTrackIds: (string | number)[];
  moodTags: string[];
  curatorNote: string;
}

export type ActiveTab = 'discover' | 'songs' | 'artists' | 'collections' | 'fullsongs' | 'search' | 'library' | 'queue';
