import React from 'react';
import { ActiveTab } from '../types/music';
import { Sparkles, Music2, Users, Disc, Search, Heart, Headphones, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenQuickSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenQuickSearch
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-6 sm:gap-8 px-4 sm:px-6 py-3.5 bg-[#090b10]/95 backdrop-blur-md border-b border-white/10">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onTabChange('discover')}
        className="text-xl font-extrabold tracking-tight text-white hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 text-left focus:outline-none flex items-center gap-2"
      >
        <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 text-sm">
          VW
        </span>
        <span>VibeWave</span>
      </button>

      {/* Zone 2: Single-line text navigation links with attractive icons */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => onTabChange('discover')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 focus:outline-none ${
            activeTab === 'discover'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Discover</span>
        </button>

        <button
          onClick={() => onTabChange('search')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 focus:outline-none ${
            activeTab === 'search'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Search className="w-4 h-4 text-cyan-400" />
          <span>Search</span>
        </button>

        <button
          onClick={() => onTabChange('artists')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 focus:outline-none ${
            activeTab === 'artists'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Artists</span>
        </button>

        <button
          onClick={() => onTabChange('collections')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 focus:outline-none ${
            activeTab === 'collections'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Disc className="w-4 h-4 text-emerald-400" />
          <span>Collections</span>
        </button>

        <button
          onClick={() => onTabChange('songs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 focus:outline-none ${
            activeTab === 'songs'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Music2 className="w-4 h-4 text-violet-400" />
          <span>Songs</span>
        </button>

        <button
          onClick={() => onTabChange('fullsongs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 focus:outline-none ${
            activeTab === 'fullsongs'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Headphones className="w-4 h-4 text-sky-400" />
          <span>Full Songs</span>
        </button>

        <button
          onClick={() => onTabChange('library')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 focus:outline-none ${
            activeTab === 'library'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Library</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href="/api/download-zip?type=source"
          download="vibewave-source.zip"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all whitespace-nowrap shrink-0"
          title="Download Complete Source Code ZIP"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Download ZIP</span>
        </a>

        <button
          onClick={onOpenQuickSearch}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-md shadow-indigo-600/30 active:scale-95"
          title="Search all tracks, artists, and albums"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </header>
  );
};
