import React from 'react';
import { ActiveTab } from '../types/music';
import { Sparkles, Search, Users, Disc, Music2, Heart, Headphones, Flame } from 'lucide-react';

interface ModuleBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const ModuleBar: React.FC<ModuleBarProps> = ({ activeTab, onTabChange }) => {
  const modules = [
    {
      id: 'discover' as ActiveTab,
      label: 'Discover',
      caption: 'Trending & Spotlight',
      badge: 'Hot',
      icon: Sparkles,
      gradient: 'from-indigo-600 via-indigo-500 to-purple-600',
      activeRing: 'border-indigo-500 shadow-indigo-500/30',
      glowColor: 'bg-indigo-500/20',
      iconColor: 'text-indigo-300'
    },
    {
      id: 'search' as ActiveTab,
      label: 'Search',
      caption: 'Instant Live Finder',
      badge: 'Fast',
      icon: Search,
      gradient: 'from-cyan-600 via-sky-500 to-blue-600',
      activeRing: 'border-cyan-400 shadow-cyan-500/30',
      glowColor: 'bg-cyan-500/20',
      iconColor: 'text-cyan-300'
    },
    {
      id: 'artists' as ActiveTab,
      label: 'Artists',
      caption: 'Raghu Dixit & 18 Roster',
      badge: '19 Stars',
      icon: Users,
      gradient: 'from-amber-600 via-orange-500 to-yellow-600',
      activeRing: 'border-amber-400 shadow-amber-500/30',
      glowColor: 'bg-amber-500/20',
      iconColor: 'text-amber-300'
    },
    {
      id: 'collections' as ActiveTab,
      label: 'Collections',
      caption: 'Vinyl Vault & Classic LPs',
      badge: 'Vinyl',
      icon: Disc,
      gradient: 'from-emerald-600 via-teal-500 to-green-600',
      activeRing: 'border-emerald-400 shadow-emerald-500/30',
      glowColor: 'bg-emerald-500/20',
      iconColor: 'text-emerald-300'
    },
    {
      id: 'songs' as ActiveTab,
      label: 'Songs',
      caption: 'Kannada, Hindi & Global',
      badge: '520+ Tracks',
      icon: Music2,
      gradient: 'from-violet-600 via-fuchsia-500 to-pink-600',
      activeRing: 'border-violet-400 shadow-violet-500/30',
      glowColor: 'bg-violet-500/20',
      iconColor: 'text-violet-300'
    },
    {
      id: 'fullsongs' as ActiveTab,
      label: 'Full Songs',
      caption: 'Uncut 3-8 Min & Player',
      badge: 'Full Audio',
      icon: Headphones,
      gradient: 'from-blue-600 via-indigo-600 to-sky-500',
      activeRing: 'border-blue-400 shadow-blue-500/30',
      glowColor: 'bg-blue-500/20',
      iconColor: 'text-blue-300'
    },
    {
      id: 'library' as ActiveTab,
      label: 'Library',
      caption: 'Liked & Custom Mixes',
      badge: 'Saved',
      icon: Heart,
      gradient: 'from-rose-600 via-pink-500 to-red-600',
      activeRing: 'border-rose-400 shadow-rose-500/30',
      glowColor: 'bg-rose-500/20',
      iconColor: 'text-rose-300'
    }
  ];

  return (
    <div className="w-full mb-8 select-none">
      {/* Large, Attractive Module Icons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5">
        {modules.map((mod) => {
          const isActive = activeTab === mod.id;
          const Icon = mod.icon;

          return (
            <button
              key={mod.id}
              onClick={() => onTabChange(mod.id)}
              className={`group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer text-center overflow-hidden active:scale-95 ${
                isActive
                  ? `bg-slate-900/95 border-2 ${mod.activeRing} shadow-xl shadow-black/40 -translate-y-1`
                  : 'bg-[#0d1017] hover:bg-slate-900/90 border border-white/10 hover:border-white/25 hover:-translate-y-0.5 shadow-md'
              }`}
            >
              {/* Top Mini Badge */}
              <div className="w-full flex items-center justify-between gap-1 mb-2">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-slate-400 group-hover:text-slate-300'
                  }`}
                >
                  {mod.badge}
                </span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>

              {/* Large Attractive Icon Container */}
              <div
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center my-1.5 transition-all duration-300 shadow-lg ${
                  isActive
                    ? `bg-gradient-to-tr ${mod.gradient} text-white shadow-xl scale-105`
                    : 'bg-slate-800/80 group-hover:bg-slate-800 border border-white/5 text-slate-300 group-hover:scale-105'
                }`}
              >
                {/* Ambient glow backdrop */}
                {isActive && (
                  <div
                    className={`absolute -inset-1 rounded-2xl bg-gradient-to-tr ${mod.gradient} opacity-50 blur-sm -z-10`}
                  />
                )}
                <Icon
                  className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-white drop-shadow' : mod.iconColor
                  }`}
                />
              </div>

              {/* Title & Caption */}
              <div className="w-full mt-2">
                <span
                  className={`block text-xs sm:text-sm font-extrabold tracking-tight transition-colors ${
                    isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                  }`}
                >
                  {mod.label}
                </span>
                <span className="block text-[10px] text-slate-400 group-hover:text-slate-300 line-clamp-1 mt-0.5 font-medium">
                  {mod.caption}
                </span>
              </div>

              {/* Active Indicator Bar at bottom of card */}
              {isActive && (
                <div
                  className={`absolute bottom-0 inset-x-3 h-1 bg-gradient-to-r ${mod.gradient} rounded-t-full`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
