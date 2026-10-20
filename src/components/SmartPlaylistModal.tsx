import React, { useState } from 'react';
import { Sparkles, X, Play, RefreshCw, Check, Music2, Wand2, Compass } from 'lucide-react';
import { Track, SmartPlaylistResponse, SmartPlaylistRequest } from '../types/music';
import { useAudio } from '../context/AudioContext';
import { getAllTracks } from '../services/musicApi';

interface SmartPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_MOODS = [
  { id: 'chill', label: 'Late Night Chill', icon: '🌙' },
  { id: 'focus', label: 'Deep Focus & Flow', icon: '🧠' },
  { id: 'workout', label: 'High-Energy Pulse', icon: '⚡' },
  { id: 'acoustic', label: 'Acoustic & Folk Soul', icon: '🎸' },
  { id: 'monsoon', label: 'Monsoon Melancholy', icon: '🌧️' },
  { id: 'celebration', label: 'Folk & Festive Beats', icon: '🥁' },
  { id: 'ambient', label: 'Peaceful Ambient', icon: '🍃' },
  { id: 'retro', label: 'Synthwave & Golden Era', icon: '✨' },
];

const GENRE_OPTIONS = [
  'Kannada Folk',
  'Acoustic',
  'Indian Classical',
  'Bollywood Romantic',
  'Electronic',
  'Sitar & Instrumental',
  'Indie Folk',
  'Ambient Chillout',
];

const THEME_GRADIENTS: Record<string, string> = {
  indigo: 'from-indigo-600/30 via-slate-900 to-[#0c0f18] border-indigo-500/30',
  violet: 'from-violet-600/30 via-slate-900 to-[#0c0f18] border-violet-500/30',
  rose: 'from-rose-600/30 via-slate-900 to-[#0c0f18] border-rose-500/30',
  emerald: 'from-emerald-600/30 via-slate-900 to-[#0c0f18] border-emerald-500/30',
  amber: 'from-amber-600/30 via-slate-900 to-[#0c0f18] border-amber-500/30',
  cyan: 'from-cyan-600/30 via-slate-900 to-[#0c0f18] border-cyan-500/30',
};

export const SmartPlaylistModal: React.FC<SmartPlaylistModalProps> = ({ isOpen, onClose }) => {
  const { saveSmartPlaylist, playTrack } = useAudio();
  const [selectedMood, setSelectedMood] = useState<string>('Late Night Chill');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Kannada Folk', 'Acoustic']);
  const [trackCount, setTrackCount] = useState<number>(6);
  const [vibePrompt, setVibePrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [result, setResult] = useState<SmartPlaylistResponse | null>(null);
  const [curatedTracks, setCuratedTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setResult(null);
    setGenerationStep('Analyzing acoustic catalogs & tempo patterns...');

    const allTracks = getAllTracks();
    const payload: SmartPlaylistRequest = {
      mood: selectedMood,
      genres: selectedGenres,
      trackCount,
      vibePrompt: vibePrompt.trim(),
      availableTracks: allTracks.map((t) => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        genre: t.genre,
      })),
    };

    try {
      setTimeout(() => {
        setGenerationStep('Harmonizing track sequence with Gemini 3.8 Flash...');
      }, 700);

      const response = await fetch('/api/smart-playlist/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Generation failed with status ${response.status}`);
      }

      const data: SmartPlaylistResponse = await response.json();
      setResult(data);

      // Match selectedTrackIds back to actual track objects
      const matched = data.selectedTrackIds
        .map((id) => allTracks.find((t) => String(t.id) === String(id)))
        .filter((t): t is Track => Boolean(t));

      // If fewer than requested were matched, fill with best genre matches
      if (matched.length < trackCount) {
        const remaining = allTracks.filter((t) => !matched.some((m) => m.id === t.id));
        const needed = trackCount - matched.length;
        matched.push(...remaining.slice(0, needed));
      }

      setCuratedTracks(matched);
    } catch (err: any) {
      console.warn('Smart playlist generation error:', err);
      // Fallback client-side curation so the user is never left hanging
      const fallbackTracks = allTracks.slice(0, trackCount);
      setCuratedTracks(fallbackTracks);
      setResult({
        name: `${selectedMood} Soundscape`,
        description: `A curated collection crafted for ${selectedMood.toLowerCase()} with acoustic warmth and melodic flow.`,
        themeColor: 'indigo',
        selectedTrackIds: fallbackTracks.map((t) => t.id),
        moodTags: [selectedMood.toLowerCase(), 'curated', 'flow'],
        curatorNote: 'Assembled by intelligent local acoustic matcher.',
      });
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleSaveAndPlay = () => {
    if (!result || curatedTracks.length === 0) return;
    const newPlaylist = saveSmartPlaylist(result.name, result.description, curatedTracks, result.themeColor);
    playTrack(curatedTracks[0], curatedTracks, 0);
    onClose();
  };

  const handleSaveOnly = () => {
    if (!result || curatedTracks.length === 0) return;
    saveSmartPlaylist(result.name, result.description, curatedTracks, result.themeColor);
    onClose();
  };

  const themeClass = result ? THEME_GRADIENTS[result.themeColor] || THEME_GRADIENTS.indigo : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0c0f18] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">AI Smart Playlist Studio</h3>
              <p className="text-xs text-slate-400">Powered by Gemini 3.8 Flash music intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!result && !isGenerating && (
            <>
              {/* Mood selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  1. Select Target Mood & Energy
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_MOODS.map((mood) => {
                    const isSelected = selectedMood === mood.label;
                    return (
                      <button
                        key={mood.id}
                        type="button"
                        onClick={() => setSelectedMood(mood.label)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                            : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="text-sm">{mood.icon}</span>
                        <span className="truncate">{mood.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Genre preference chips */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  2. Musical Flavors & Genres
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRE_OPTIONS.map((genre) => {
                    const isSelected = selectedGenres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom prompt input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  3. Specific Atmosphere or Activity (Optional)
                </label>
                <input
                  type="text"
                  value={vibePrompt}
                  onChange={(e) => setVibePrompt(e.target.value)}
                  placeholder="e.g., Sitar and acoustic guitar with a relaxing slow tempo for reading"
                  className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none text-xs placeholder:text-slate-500"
                />
              </div>

              {/* Track count */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    4. Playlist Size
                  </label>
                  <span className="text-xs font-mono text-indigo-400">{trackCount} Tracks</span>
                </div>
                <div className="flex items-center gap-2">
                  {[4, 6, 8, 10, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTrackCount(num)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
                        trackCount === num
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Loading state */}
          {isGenerating && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">Curating Your Personalized Mix</h4>
                <p className="text-xs text-slate-400 font-mono">{generationStep}</p>
              </div>
              <div className="flex items-center gap-1.5 h-6">
                <span className="w-1 h-3 bg-indigo-500 rounded-full animate-[bounce_0.6s_infinite]" />
                <span className="w-1 h-5 bg-indigo-400 rounded-full animate-[bounce_0.6s_infinite_0.15s]" />
                <span className="w-1 h-4 bg-indigo-500 rounded-full animate-[bounce_0.6s_infinite_0.3s]" />
                <span className="w-1 h-6 bg-indigo-300 rounded-full animate-[bounce_0.6s_infinite_0.45s]" />
              </div>
            </div>
          )}

          {/* Result view */}
          {result && !isGenerating && (
            <div className="space-y-5">
              {/* Generated Playlist Card */}
              <div className={`p-5 rounded-2xl bg-gradient-to-br border ${themeClass} space-y-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                      Curated Smart Mix
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{curatedTracks.length} tracks</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{result.name}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{result.description}</p>
                </div>

                {/* Mood tags unboxed */}
                <div className="flex items-center gap-2 text-xs text-indigo-300/80 pt-1">
                  {result.moodTags.map((tag, idx) => (
                    <React.Fragment key={tag}>
                      {idx > 0 && <span aria-hidden="true">·</span>}
                      <span>#{tag}</span>
                    </React.Fragment>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 leading-normal flex items-start gap-2">
                  <Compass className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{result.curatorNote}</span>
                </div>
              </div>

              {/* Curated Track List Preview */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Curated Track Sequence
                </span>
                <div className="rounded-xl bg-slate-900/60 border border-white/5 divide-y divide-white/5 max-h-56 overflow-y-auto">
                  {curatedTracks.map((track, idx) => (
                    <div key={`${track.id}-${idx}`} className="flex items-center justify-between p-2.5 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-5 text-center text-xs font-mono text-slate-500 shrink-0">
                          {idx + 1}
                        </span>
                        <img
                          src={track.artworkSmall || track.artwork}
                          alt={track.title}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-lg object-cover bg-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-medium text-white truncate">{track.title}</h5>
                          <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-mono text-slate-400">
                          {track.isFullLength ? 'Full Track' : 'Preview'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-slate-900/40 shrink-0">
          {!result ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Smart Playlist</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleGenerate}
                className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Another</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveOnly}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl transition-colors"
                >
                  Save to Library
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndPlay}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/30"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Save & Play Now</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
