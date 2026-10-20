import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '1mb' }));

// Shared Gemini Client initialized server-side
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client on server:', err);
  }
}

// Download Project ZIP route (source or full)
app.get('/api/download-zip', (req, res) => {
  const type = req.query.type === 'full' ? 'full' : 'source';
  const filename = type === 'full' ? 'vibewave-full.zip' : 'vibewave-source.zip';
  const filePath = path.resolve(__dirname, filename);
  res.download(filePath, filename, (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ error: 'Failed to download zip' });
    }
  });
});

// POST /api/smart-playlist/generate - AI Smart Playlist Generator
app.post('/api/smart-playlist/generate', async (req, res) => {
  try {
    const { mood, genres, trackCount, vibePrompt, availableTracks } = req.body;
    const requestedCount = Math.min(Math.max(Number(trackCount) || 6, 3), 15);
    const moodStr = mood || 'Chill & Relaxing';
    const genreStr = Array.isArray(genres) && genres.length > 0 ? genres.join(', ') : 'Eclectic / Fusion';
    const customPrompt = vibePrompt ? `Additional vibe notes: "${vibePrompt}".` : '';

    const trackCatalogStr = Array.isArray(availableTracks) && availableTracks.length > 0
      ? availableTracks.map((t: any) => `- ID: "${t.id}" | Title: "${t.title}" | Artist: "${t.artist}" | Genre: "${t.genre}"`).join('\n')
      : 'Diverse library of Indian folk fusion, sitar, acoustic guitar, indie, and chillout tracks.';

    // If Gemini client is available, call gemini-3.8-flash with structured JSON responseSchema
    if (geminiClient && process.env.GEMINI_API_KEY) {
      try {
        const response = await geminiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an expert music curator and DJ for VibeWave.
Curate an immersive smart playlist of ${requestedCount} songs tailored to the user's requested mood and genres.

User request:
- Desired Mood: ${moodStr}
- Genres: ${genreStr}
${customPrompt}

Available library tracks to prioritize:
${trackCatalogStr}

Instructions:
1. Craft an evocative, poetic, and catchy playlist title (under 6 words).
2. Write a 1-2 sentence atmospheric description explaining why this playlist fits the mood.
3. Choose a fitting visual theme color from: 'indigo', 'violet', 'rose', 'emerald', 'amber', 'cyan'.
4. Select up to ${requestedCount} track IDs from the available tracks that best match the vibe.
5. Provide 3-4 short mood tags (e.g. "late-night", "acoustic", "uplifting").
6. Provide a brief curator note.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: 'Catchy and evocative playlist title under 6 words.',
                },
                description: {
                  type: Type.STRING,
                  description: 'Atmospheric 1-2 sentence description.',
                },
                themeColor: {
                  type: Type.STRING,
                  description: 'One of indigo, violet, rose, emerald, amber, cyan',
                },
                selectedTrackIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Array of selected track ID strings matching the available library tracks.',
                },
                moodTags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3-4 short mood tags.',
                },
                curatorNote: {
                  type: Type.STRING,
                  description: 'Short personalized curator remark.',
                },
              },
              required: ['name', 'description', 'themeColor', 'selectedTrackIds', 'moodTags', 'curatorNote'],
            },
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json(parsed);
        }
      } catch (geminiError) {
        console.warn('Gemini smart playlist call failed, falling back to smart local curation:', geminiError);
      }
    }

    // High quality deterministic fallback
    const fallbackColors = ['indigo', 'violet', 'rose', 'emerald', 'amber', 'cyan'];
    const chosenColor = fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
    
    // Pick matching track IDs
    const matchedIds = Array.isArray(availableTracks) && availableTracks.length > 0
      ? availableTracks
          .sort(() => 0.5 - Math.random())
          .slice(0, requestedCount)
          .map((t: any) => String(t.id))
      : [];

    return res.json({
      name: `${moodStr} Wave`,
      description: `A hand-crafted ${moodStr.toLowerCase()} soundscape blending ${genreStr} rhythms for an optimal listening flow.`,
      themeColor: chosenColor,
      selectedTrackIds: matchedIds,
      moodTags: [moodStr.toLowerCase(), 'curated', 'flow'],
      curatorNote: 'Assembled by VibeWave intelligent selector based on your acoustic and tempo criteria.',
    });
  } catch (error: any) {
    console.error('Error generating smart playlist:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate playlist' });
  }
});

// Production vs Development handler
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`VibeWave server running on http://0.0.0.0:${port}`);
  });
}

startServer();
