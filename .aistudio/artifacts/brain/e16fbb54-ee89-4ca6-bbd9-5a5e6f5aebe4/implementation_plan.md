# VibeWave: Custom Playlists, Favorites, Queue Management & AI Smart Playlist Generator

Comprehensive implementation plan to elevate VibeWave into a complete personal music workspace with custom playlist creation, quick-action favorites, reorderable queue management, zero-friction browser LocalStorage persistence, and an AI-powered smart playlist generator powered by Gemini 3.8 Flash.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Summary of Confirmed Choices**:
> - **Core Feature Scope**: Custom playlist creation, favorites (liked songs), and queue management.
> - **Persistence Strategy**: Browser LocalStorage for instant, private offline access without requiring user sign-in or account registration, supplemented by a 1-click JSON playlist export/import feature for backups.
> - **AI Feature**: Smart Playlist Generator based on mood, tempo, and genre, matching tracks intelligently and providing personalized curation via Gemini 3.8 Flash.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms VibeWave from an audio discovery player into a fully featured personal music library. Users can organize custom playlists, heart favorite tracks with instant tactile feedback, manipulate an active playback queue (reorder, play next, remove, save queue to playlist), and summon an AI DJ to generate tailored mixes for specific moods, activities, and genres.
- **Target Audience**: Music listeners, audiophiles, and creators looking for a fast, responsive streaming player with fluid local organization and intelligent mood curation.
- **Key Value**: Zero-latency library management with complete offline persistence and instant playback; no account walls or slow cloud database roundtrips for personal curation.

---

## 2. User Experience & Visual Design

Following the **Universal Frontend Design Constitution** and **SaaS & Music Dashboard Guidelines** (`references/3_saas_dashboard.md`):

### Key User Flows
1. **Playlist Management Flow**:
   - In the **Library** view, a dedicated "New Playlist" button opens a modal allowing users to enter a title, custom description, and select a distinctive cover gradient or uploaded artwork.
   - Inside any playlist view, users can edit title/description, reorder tracks, remove songs, delete the playlist, or launch playback with "Play All" or "Shuffle Play".
   - Context menus ("..." and "+" on TrackRow and Full Player) allow adding any track to an existing or new playlist with 1 click.
2. **Favorites (Liked Songs) Flow**:
   - Heart icons on all track rows, the persistent bottom player, and the full player modal toggle favorite status with an animated micro-interaction.
   - The Library view features a dedicated "Liked Songs" tab with total track count, total playback duration, and a prominent "Play All" action.
3. **Queue Reordering & Manipulation Flow**:
   - The Queue drawer (`QueueDrawer`) displays the "Now Playing" track with live equalizer wave indicators followed by the "Up Next" queue.
   - Users can drag or use up/down actions to reorder items, click to immediately skip to any track in the queue, remove individual tracks, clear the entire queue, or click "Save Queue as Playlist".
4. **AI Smart Playlist Generator Flow**:
   - A dedicated "AI Smart Mix" launcher in Library and Discover views opens an intuitive curation panel.
   - Users pick from curated mood tags (e.g. *Focus & Deep Work*, *Late Night Chill*, *Energetic Workout*, *Rainy Day Melancholy*, *Acoustic Sunset*) or enter a custom prompt (e.g., "Uplifting Indian fusion and acoustic guitar for morning coffee").
   - Users select genre filters and desired track count (5–15 songs).
   - Gemini 3.8 Flash generates an evocative playlist title, description, color vibe, and curated track sequence that seamlessly creates a new custom playlist with instant playback.

### Visual Identity & Palette (60-30-10 Rule)
- **Dominant Neutral Canvas (60%)**: Deep obsidian black (`#090b10`) with slate backing surfaces (`#0c0f18` and `#111622`).
- **Structural Surfaces (30%)**: Hairline borders (`border-white/5` to `border-white/10`), subtle card elevation without nested boxes, and unboxed metadata with `·` separators.
- **Accent Budget (10%)**: Electric indigo (`#6366f1`) and violet (`#8b5cf6`) for active playback indicators, primary buttons, and seek progress bars; emerald (`#10b981`) for confirmed actions and success toasts.
- **Typography**: Clean display hierarchy with `Plus Jakarta Sans` for titles and labels, paired with tabular figures (`font-mono tabular-nums`) for track durations, time stamps, and queue position counters.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Browser LocalStorage vs. Remote Database
- **Chosen Approach**: High-reliability `localStorage` wrapper with JSON schema validation, automatic migration, and manual JSON export/import.
- **Why**: Zero authentication friction, instantaneous writes (no network lag), works completely offline, and keeps user listening data private.
- **Trade-Off**: Playlists stay on the user's current device unless exported via JSON; mitigated by offering an intuitive "Backup & Restore Playlists (JSON)" dialog.

### Decision 2: Server-Side Gemini API via Express (`server.ts`)
- **Chosen Approach**: Mount Express server (`server.ts`) hosting an API route `/api/smart-playlist/generate` that uses the official `@google/genai` TypeScript SDK with model `gemini-3.8-flash`.
- **Why**: Strict adherence to security standards (never expose `process.env.GEMINI_API_KEY` to client browser code) and ensures structured JSON output validation via `responseSchema`.
- **Trade-Off**: Requires switching dev script to `"dev": "tsx server.ts"` running Vite in middleware mode, standard for full-stack AI Studio apps.

---

## 4. Technical Architecture & Data Strategy

### System Component Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Frontend React Client                         │
│                                                                        │
│   ┌───────────────────────────┐    ┌───────────────────────────────┐   │
│   │     LibraryView.tsx       │    │       QueueDrawer.tsx         │   │
│   │  - Liked Songs Tab        │    │  - Up Next List               │   │
│   │  - Custom Playlists Tab   │    │  - Reorder / Remove           │   │
│   │  - History Tab            │    │  - Save Queue as Playlist     │   │
│   │  - Export / Import JSON   │    └───────────────┬───────────────┘   │
│   └─────────────┬─────────────┘                    │                   │
│                 │                                  │                   │
│   ┌─────────────▼──────────────────────────────────▼───────────────┐   │
│   │              AudioContext & Library State Provider             │   │
│   │  - likedTracks: Track[]     - queue: Track[]                    │   │
│   │  - playlists: Playlist[]    - history: Track[]                 │   │
│   │  - create/edit/delete       - sync with localStorage           │   │
│   └─────────────┬──────────────────────────────────┬───────────────┘   │
│                 │                                  │                   │
│   ┌─────────────▼─────────────┐    ┌───────────────▼───────────────┐   │
│   │   SmartPlaylistModal.tsx  │    │      localStorage Layer       │   │
│   │  - Mood / Genre Select    │    │  - vibewave_playlists         │   │
│   │  - Prompt Input           │    │  - vibewave_liked_tracks      │   │
│   │  - POST /api/smart-playlist│   │  - vibewave_history           │   │
│   └─────────────┬─────────────┘    └───────────────────────────────┘   │
└─────────────────┼──────────────────────────────────────────────────────┘
                  │ HTTP POST
┌─────────────────▼──────────────────────────────────────────────────────┐
│                    Full-Stack Express Server (server.ts)                │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │   POST /api/smart-playlist/generate                            │   │
│   │   - Reads mood, genre, trackCount from client body             │   │
│   │   - Calls GoogleGenAI({ apiKey }) with 'gemini-3.8-flash'      │   │
│   │   - Enforces Type.OBJECT responseSchema                        │   │
│   │   - Matches curated catalog & full master tracks               │   │
│   │   - Returns structured playlist definition                     │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │   Vite Middleware / Static File Handler (Port 3000)            │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models & Schemas

```typescript
export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  themeColor?: string; // e.g. 'indigo', 'rose', 'emerald', 'amber', 'purple'
  tracks: Track[];
  createdAt: number;
  updatedAt: number;
  isCustom?: boolean;
}

export interface SmartPlaylistRequest {
  mood: string;
  genres: string[];
  trackCount: number;
  vibePrompt?: string;
}

export interface SmartPlaylistResponse {
  name: string;
  description: string;
  themeColor: string;
  selectedTrackIds: (string | number)[];
  recommendedAttributes: {
    tempo: string;
    energy: string;
    moodTags: string[];
  };
}
```

---

## 5. Execution Stages & Verification Plan

### Stage 1: Full-Stack Server & Gemini API Integration
- Create `server.ts` with Express and Vite middleware on port 3000.
- Implement `/api/smart-playlist/generate` using `GoogleGenAI` and `gemini-3.8-flash` with structured JSON schema.
- Update `package.json` dev script: `"dev": "tsx server.ts"`.

### Stage 2: AudioContext & LocalStorage Persistence Enhancement
- Ensure all playlist mutations (create, rename, update description, delete, add track, remove track, reorder tracks in playlist) immediately persist to `localStorage`.
- Implement `saveQueueAsPlaylist(name, description)`.
- Implement JSON export (`downloadBackup()`) and import (`importBackup(file)`) utilities.

### Stage 3: UI Upgrades (Library, Queue & Smart Playlist Modal)
- Create `SmartPlaylistModal.tsx` with curated mood presets, genre chips, prompt input, and live AI generation feedback.
- Enhance `LibraryView.tsx` with playlist search/filter, playlist track count/duration metrics, and Backup/Restore trigger.
- Add "Save as Playlist" and "Play Next" actions in `QueueDrawer.tsx`.
- Enhance `TrackRow.tsx` and player modals with 1-click heart toggle and "Add to Playlist" menus.

### Stage 4: Verification & Compilation
- Run `compile_applet` and `lint_applet` to confirm clean compilation and zero TypeScript errors.
- Test playlist creation, hearting/unhearting, queue reordering, and smart playlist generation end-to-end.
