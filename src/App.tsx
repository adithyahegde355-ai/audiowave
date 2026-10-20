import React, { useState } from 'react';
import { ActiveTab, Track, Artist, Album } from './types/music';
import { AudioProvider, useAudio } from './context/AudioContext';
import { Header } from './components/Header';
import { DiscoverView } from './components/DiscoverView';
import { SongsView } from './components/SongsView';
import { ArtistsView } from './components/ArtistsView';
import { CollectionsView } from './components/CollectionsView';
import { SearchView } from './components/SearchView';
import { FullSongsView } from './components/FullSongsView';
import { LibraryView } from './components/LibraryView';
import { PersistentPlayer } from './components/PersistentPlayer';
import { FullPlayerModal } from './components/FullPlayerModal';
import { QueueDrawer } from './components/QueueDrawer';
import { PlaylistModal } from './components/PlaylistModal';
import { SmartPlaylistModal } from './components/SmartPlaylistModal';
import { ArtistModal } from './components/ArtistModal';
import { AlbumModal } from './components/AlbumModal';
import { ModuleBar } from './components/ModuleBar';
import { Toast } from './components/Toast';
import { ShieldCheck, Music2 } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isSmartPlaylistOpen, setIsSmartPlaylistOpen] = useState(false);
  const [playlistTargetTrack, setPlaylistTargetTrack] = useState<Track | null>(null);

  // Artist & Album Modals
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const { currentTrack } = useAudio();

  const handleOpenPlaylistModal = (track?: Track) => {
    setPlaylistTargetTrack(track || null);
    setIsPlaylistModalOpen(true);
  };

  const handleOpenSearch = () => {
    setActiveTab('search');
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 3-Zone Header complying with Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'queue') {
            setIsQueueOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenQuickSearch={handleOpenSearch}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-28">
        {/* Large, Attractive Module Icons Bar (Discover, Search, Artists, Collections, Songs, Library) */}
        <ModuleBar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

        {activeTab === 'discover' && (
          <DiscoverView
            onOpenPlaylistModal={handleOpenPlaylistModal}
            onNavigateTab={(tab) => setActiveTab(tab as ActiveTab)}
            onSelectArtist={(artist) => setSelectedArtist(artist)}
            onSelectAlbum={(album) => setSelectedAlbum(album)}
          />
        )}

        {activeTab === 'songs' && (
          <SongsView onOpenPlaylistModal={handleOpenPlaylistModal} />
        )}

        {activeTab === 'artists' && (
          <ArtistsView
            onSelectArtist={(artist) => setSelectedArtist(artist)}
            onOpenPlaylistModal={handleOpenPlaylistModal}
          />
        )}

        {activeTab === 'collections' && (
          <CollectionsView
            onSelectAlbum={(album) => setSelectedAlbum(album)}
            onOpenPlaylistModal={handleOpenPlaylistModal}
          />
        )}

        {activeTab === 'fullsongs' && (
          <FullSongsView onOpenPlaylistModal={handleOpenPlaylistModal} />
        )}

        {activeTab === 'search' && (
          <SearchView
            onOpenPlaylistModal={handleOpenPlaylistModal}
            onSelectArtist={(artist) => setSelectedArtist(artist)}
          />
        )}

        {activeTab === 'library' && (
          <LibraryView
            onOpenPlaylistModal={handleOpenPlaylistModal}
            onCreateNewPlaylist={() => handleOpenPlaylistModal()}
            onOpenSmartPlaylist={() => setIsSmartPlaylistOpen(true)}
          />
        )}

        {/* Quiet Authentic Footnote for Audio Previews */}
        <footer className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400/80" />
            <span>Authorized 30-Second Previews · 450+ Indian Regional & Global Songs</span>
          </div>
          <div className="flex items-center gap-2">
            <Music2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>VibeWave High-Fidelity Audio Engine</span>
          </div>
        </footer>
      </main>

      {/* Persistent Mini-Player Bar */}
      <PersistentPlayer
        onOpenFullPlayer={() => setIsFullPlayerOpen(true)}
        onOpenQueue={() => setIsQueueOpen((prev) => !prev)}
      />

      {/* Full-Screen Expanded Player Modal */}
      <FullPlayerModal
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
        onOpenAddToPlaylist={() => {
          if (currentTrack) {
            handleOpenPlaylistModal(currentTrack);
          }
        }}
      />

      {/* Slide-over Queue Drawer */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
      />

      {/* Add to Playlist / Create Playlist Modal */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => {
          setIsPlaylistModalOpen(false);
          setPlaylistTargetTrack(null);
        }}
        targetTrack={playlistTargetTrack}
      />

      {/* AI Smart Playlist Generator Modal */}
      <SmartPlaylistModal
        isOpen={isSmartPlaylistOpen}
        onClose={() => setIsSmartPlaylistOpen(false)}
      />

      {/* Artist Profile & Discography Modal */}
      <ArtistModal
        artist={selectedArtist}
        isOpen={selectedArtist !== null}
        onClose={() => setSelectedArtist(null)}
        onOpenPlaylistModal={handleOpenPlaylistModal}
      />

      {/* Album Collection & Vinyl Showcase Modal */}
      <AlbumModal
        album={selectedAlbum}
        isOpen={selectedAlbum !== null}
        onClose={() => setSelectedAlbum(null)}
        onOpenPlaylistModal={handleOpenPlaylistModal}
      />

      {/* Global floating toast feedback */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <MainApp />
    </AudioProvider>
  );
}
