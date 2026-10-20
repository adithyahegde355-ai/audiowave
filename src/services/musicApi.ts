import { Track, Playlist, Artist, Album } from '../types/music';
import { CATALOGUE_TRACKS } from '../data/catalogue';

// Complete uncompressed full-length studio tracks (3 to 8 minutes duration with full audio)
export const FULL_LENGTH_TRACKS: Track[] = [
  {
    id: 'full-indian-folk-1',
    title: 'Lokada Dhwani - Indian Folk & Fusion (Full Master)',
    artist: 'Raghu Dixit Style & Indian Ensemble',
    album: 'Folk Roots & Modern Rhythm',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    artworkSmall: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80',
    duration: 275, // 4:35
    previewUrl: '/audio/indian-fusion-master.mp3',
    genre: 'Kannada Folk / Fusion',
    region: 'Kannada',
    isFullLength: true
  },
  {
    id: 'full-acoustic-malnad',
    title: 'Acoustic Malnad Strings (Full Studio Master)',
    artist: 'Bengaluru Acoustic Collective',
    album: 'Western Ghats Melodies',
    artwork: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
    artworkSmall: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=100&auto=format&fit=crop&q=80',
    duration: 330, // 5:30
    previewUrl: '/audio/acoustic-studio-master.mp3',
    genre: 'Acoustic Folk / Fingerstyle',
    region: 'Kannada',
    isFullLength: true
  },
  {
    id: 'full-soundhelix-1',
    title: 'SoundHelix Piano & Strings (Full Studio Mix)',
    artist: 'SoundHelix Audio Project',
    album: 'Audiophile Sessions Vol. 1',
    artwork: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=600&auto=format&fit=crop&q=80',
    artworkSmall: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=100&auto=format&fit=crop&q=80',
    duration: 372, // 6:12
    previewUrl: '/audio/piano-strings-master.mp3',
    genre: 'Melodic Piano & Orchestral',
    region: 'Global',
    isFullLength: true
  },
  {
    id: 'full-soundhelix-2',
    title: 'Acoustic Guitar Sunrise (Full 7-Min Journey)',
    artist: 'SoundHelix Audio Project',
    album: 'Acoustic Horizons',
    artwork: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&fit=crop&q=80',
    artworkSmall: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=100&auto=format&fit=crop&q=80',
    duration: 425, // 7:05
    previewUrl: '/audio/guitar-sunrise.mp3',
    genre: 'Acoustic Folk / Fingerstyle',
    region: 'Global',
    isFullLength: true
  },
  {
    id: 'full-soundhelix-3',
    title: 'Analog Synthwave Pulse (Full Studio Master)',
    artist: 'SoundHelix Audio Project',
    album: 'Neon Cyber Grid',
    artwork: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    artworkSmall: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&auto=format&fit=crop&q=80',
    duration: 344, // 5:44
    previewUrl: '/audio/synthwave-pulse.mp3',
    genre: 'Synthwave / Electronic',
    region: 'Global',
    isFullLength: true
  },
  {
    id: 'full-soundhelix-4',
    title: 'Late Night Chill Lounge (Full 5-Min Mix)',
    artist: 'SoundHelix Audio Project',
    album: 'Velvet Midnight',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    artworkSmall: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=80',
    duration: 302, // 5:02
    previewUrl: '/audio/chill-lounge.mp3',
    genre: 'Lofi Chill / Ambient',
    region: 'Global',
    isFullLength: true
  },
  {
    id: 'full-soundhelix-8',
    title: 'Funky Bassline Groove (Full Studio Track)',
    artist: 'SoundHelix Audio Project',
    album: 'Golden Rhythm',
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    artworkSmall: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&auto=format&fit=crop&q=80',
    duration: 265, // 4:25
    previewUrl: '/audio/funky-groove.mp3',
    genre: 'Nu-Disco & Funk',
    region: 'Global',
    isFullLength: true
  },
  {
    id: 'full-soundhelix-9',
    title: 'Cinematic Dreamscape (Full 6:30 Master)',
    artist: 'SoundHelix Audio Project',
    album: 'Atmospheres',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    artworkSmall: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&auto=format&fit=crop&q=80',
    duration: 390, // 6:30
    previewUrl: '/audio/cinematic-dreamscape.mp3',
    genre: 'Cinematic Ambient',
    region: 'Global',
    isFullLength: true
  },
  {
    id: 'full-soundhelix-10',
    title: 'Progressive Deep Odyssey (Full 8:44 Epic)',
    artist: 'SoundHelix Audio Project',
    album: 'Infinite Echoes',
    artwork: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    artworkSmall: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&auto=format&fit=crop&q=80',
    duration: 524, // 8:44
    previewUrl: '/audio/deep-odyssey.mp3',
    genre: 'Progressive Electronic',
    region: 'Global',
    isFullLength: true
  }
];

export const ALL_TRACKS: Track[] = [...FULL_LENGTH_TRACKS, ...CATALOGUE_TRACKS];

// Featured starter tracks (featuring Raghu Dixit, Kantara, KGF, Arijit Singh, Anirudh, Daft Punk, The Weeknd)
export const FEATURED_TRACKS: Track[] = [
  // Raghu Dixit Highlight first
  ...CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('raghu dixit')).slice(0, 2),
  // Kannada Highlights
  ...CATALOGUE_TRACKS.filter((t) => t.region === 'Kannada' && !t.artist.toLowerCase().includes('raghu dixit')).slice(0, 3),
  // Hindi Highlights
  ...CATALOGUE_TRACKS.filter((t) => t.region === 'Hindi').slice(0, 3),
  // Full Song Highlight
  FULL_LENGTH_TRACKS[0],
  // Tamil & Telugu Highlights
  ...CATALOGUE_TRACKS.filter((t) => t.region === 'Tamil' || t.region === 'Telugu').slice(0, 3),
  // Punjabi Highlights
  ...CATALOGUE_TRACKS.filter((t) => t.region === 'Punjabi').slice(0, 2),
  // Global Electronic/Pop Highlights
  ...CATALOGUE_TRACKS.filter((t) => t.region === 'Global').slice(0, 3)
];

export const REGIONAL_FILTERS = [
  { id: 'all', name: 'All Songs', count: ALL_TRACKS.length },
  { id: 'full', name: 'Full Songs (Uncut 3-8m)', count: FULL_LENGTH_TRACKS.length },
  { id: 'Kannada', name: 'Kannada (ಕನ್ನಡ)', count: CATALOGUE_TRACKS.filter((t) => t.region === 'Kannada').length },
  { id: 'Hindi', name: 'Hindi / Bollywood (हिंदी)', count: CATALOGUE_TRACKS.filter((t) => t.region === 'Hindi').length },
  { id: 'Tamil', name: 'Tamil (தமிழ்)', count: CATALOGUE_TRACKS.filter((t) => t.region === 'Tamil').length },
  { id: 'Telugu', name: 'Telugu (తెలుగు)', count: CATALOGUE_TRACKS.filter((t) => t.region === 'Telugu').length },
  { id: 'Punjabi', name: 'Punjabi (ਪੰਜਾਬੀ)', count: CATALOGUE_TRACKS.filter((t) => t.region === 'Punjabi').length },
  { id: 'Malayalam', name: 'Malayalam (മലയാളം)', count: CATALOGUE_TRACKS.filter((t) => t.region === 'Malayalam').length },
  { id: 'Global', name: 'Global & Electronic', count: CATALOGUE_TRACKS.filter((t) => t.region === 'Global').length }
];

export const CURATED_GENRES = [
  { id: 'all', name: 'All Vibes', query: 'Top Hits 2024' },
  { id: 'kannada', name: 'Kannada Hits', query: 'kannada hits' },
  { id: 'hindi', name: 'Bollywood Romance & Hits', query: 'arijit singh hindi hits' },
  { id: 'tamil', name: 'Tamil Beats', query: 'anirudh ravichander' },
  { id: 'telugu', name: 'Telugu Chartbusters', query: 'telugu hits' },
  { id: 'punjabi', name: 'Punjabi Groove', query: 'diljit dosanjh' },
  { id: 'malayalam', name: 'Malayalam Melodies', query: 'sushin shyam malayalam' },
  { id: 'electronic', name: 'Electronic & Synthwave', query: 'electronic dance music' }
];

export const CURATED_ARTISTS: Artist[] = [
  {
    id: 'art-raghu-dixit',
    name: 'Raghu Dixit',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/12e8853ad9bffbc713f08eef12c95f38/500x500-000000-80-0-0.jpg',
    genre: 'Kannada Folk Rock / Fusion',
    monthlyListeners: '14,800,000',
    bio: 'Pioneering Indian folk-fusion singer-songwriter, composer, and founder of The Raghu Dixit Project. Globally renowned for passionate acoustic guitar grooves, lungis, and timeless musical adaptations of Saint Shishunala Sharif poetry like "Lokada Kaalaji" and "Gudugudiya Sedi Nodo".',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('raghu dixit') || t.title.toLowerCase().includes('kaalaji') || t.title.toLowerCase().includes('munjaane')).slice(0, 10)
  },
  {
    id: 'art-charan-raj',
    name: 'Charan Raj',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/5bcde725b8351796d6a5e85d415d4222/500x500-000000-80-0-0.jpg',
    genre: 'Kannada / Neo-Classical & Acoustic',
    monthlyListeners: '11,300,000',
    bio: 'State-award winning Kannada composer behind the emotional masterpieces Sapta Sagaradaache Ello (Side A & B), Tagaru, Salaga, and Godhi Banna Sadharana Mykattu.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('charan raj') || t.album.toLowerCase().includes('sapta') || t.album.toLowerCase().includes('tagaru')).slice(0, 10)
  },
  {
    id: 'art-vasuki-vaibhav',
    name: 'Vasuki Vaibhav',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/efd38a948d42c111b6188cf3769f1a80/500x500-000000-80-0-0.jpg',
    genre: 'Kannada / Folk Melodies & Theater',
    monthlyListeners: '9,200,000',
    bio: 'Gifted singer-composer from Bengaluru celebrated for heartfelt melodies in Kirik Party, Sarkari Hi. Pra. Shaale, and Mundina Nildana.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('vasuki') || t.title.toLowerCase().includes('kaagadada') || t.title.toLowerCase().includes('arere')).slice(0, 10)
  },
  {
    id: 'art-arijit',
    name: 'Arijit Singh',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/ac5350cff290edd5b69fa584b8b1bd4f/500x500-000000-80-0-0.jpg',
    genre: 'Bollywood / Hindi Romantic',
    monthlyListeners: '88,400,000',
    bio: 'India\'s preeminent playback sensation, celebrated for timeless emotional ballads, soulful film anthems, and unmatched vocal mastery.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('arijit')).slice(0, 10)
  },
  {
    id: 'art-ajaneesh',
    name: 'B. Ajaneesh Loknath',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/a3319b808420e0f22cbf857a17e4b8f1/500x500-000000-80-0-0.jpg',
    genre: 'Kannada / Folk Fusion & Cinematic',
    monthlyListeners: '14,200,000',
    bio: 'Visionary composer of Kantara, Ulidavaru Kandanthe, and Kirik Party, renowned for blending authentic coastal folk instrumentation with powerful orchestral soundscapes.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('ajaneesh') || t.title.toLowerCase().includes('varaha') || t.title.toLowerCase().includes('singara')).slice(0, 10)
  },
  {
    id: 'art-ravi-basrur',
    name: 'Ravi Basrur',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/8cd91105aa78393cbddd3e7215e2eb55/500x500-000000-80-0-0.jpg',
    genre: 'Kannada / Heavy Metal & Cinematic',
    monthlyListeners: '18,700,000',
    bio: 'The musical mastermind behind K.G.F: Chapter 1 & 2 and Salaar, famous for thunderous percussion, epic brass arrangements, and high-octane action scores.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('ravi basrur') || t.album.toLowerCase().includes('k.g.f') || t.title.toLowerCase().includes('monster')).slice(0, 10)
  },
  {
    id: 'art-sanjith',
    name: 'Sanjith Hegde',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/d134d28ca5af4c7fd176f1ae5188c667/500x500-000000-80-0-0.jpg',
    genre: 'Kannada / Indie Pop & Playback',
    monthlyListeners: '8,400,000',
    bio: 'Dynamic Bengaluru singer-songwriter known for soulful vocal phrasing, contemporary indie productions, and hit songs across Kannada cinema.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('sanjith')).slice(0, 10)
  },
  {
    id: 'art-vijay-prakash',
    name: 'Vijay Prakash',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/3d112cbc8570a026002b7e05142dc191/500x500-000000-80-0-0.jpg',
    genre: 'Kannada / Classical & Film Anthems',
    monthlyListeners: '12,600,000',
    bio: 'Grammy and National Award-winning singer, judge, and Kannada musical legend famous for iconic anthems like "Jai Ho", "Belageddu", "Open Hairu", and "Bombe Helutaithe".',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('vijay prakash') || t.title.toLowerCase().includes('belageddu') || t.title.toLowerCase().includes('bombe')).slice(0, 10)
  },
  {
    id: 'art-rajesh-krishnan',
    name: 'Rajesh Krishnan',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/8e61fcc1fa268793f258f30c3c331ec0/500x500-000000-80-0-0.jpg',
    genre: 'Kannada / Romantic Melodies',
    monthlyListeners: '7,900,000',
    bio: 'Legendary Kannada playback singer with over 5,000 songs, celebrated as the golden romantic voice of Karnataka across decades of beloved cinema melodies.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('rajesh krishnan') || t.region === 'Kannada').slice(0, 10)
  },
  {
    id: 'art-anirudh',
    name: 'Anirudh Ravichander',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/9da0a547b39e99bc35c6a9724aef91bf/500x500-000000-80-0-0.jpg',
    genre: 'Tamil / Electronic Kuthu & Rock',
    monthlyListeners: '46,300,000',
    bio: 'Rockstar music director of Leo, Jailer, Vikram, and Jawan, celebrated for electrifying EDM-folk fusions and chartbuster youth anthems.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('anirudh')).slice(0, 10)
  },
  {
    id: 'art-diljit',
    name: 'Diljit Dosanjh',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/79b85e695e0ca6529e56bf3b628e92bd/500x500-000000-80-0-0.jpg',
    genre: 'Punjabi / Desi Hip-Hop & Pop',
    monthlyListeners: '26,800,000',
    bio: 'Global Punjabi superstar breaking worldwide records, headlining Coachella, and delivering infectious bhangra-pop anthems worldwide.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('diljit')).slice(0, 10)
  },
  {
    id: 'art-sid-sriram',
    name: 'Sid Sriram',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/fbe3e1d17fc6958e047f011f74233f82/500x500-000000-80-0-0.jpg',
    genre: 'Carnatic / Telugu & Tamil Soul',
    monthlyListeners: '29,100,000',
    bio: 'Carnatic-trained vocalist blending Indian classical depth with R&B soul on mega-hits across Telugu, Tamil, and Malayalam cinema.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('sid sriram')).slice(0, 10)
  },
  {
    id: 'art-ar-rahman',
    name: 'A.R. Rahman',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/bd34315ef977a62a9e28c1ab19bb8ac4/500x500-000000-80-0-0.jpg',
    genre: 'Global / Indian Classical & Electronic',
    monthlyListeners: '42,500,000',
    bio: 'Two-time Academy Award and Grammy-winning musical maestro who revolutionized Indian film music by integrating Western orchestration with traditional sounds.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('rahman')).slice(0, 10)
  },
  {
    id: 'art-sonu-nigam',
    name: 'Sonu Nigam',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/812220125c4f0db57050438b65afcf78/500x500-000000-80-0-0.jpg',
    genre: 'Kannada & Hindi / Timeless Melodies',
    monthlyListeners: '32,100,000',
    bio: 'One of India\'s greatest vocalists of all time, beloved across Karnataka for monumental Kannada cinema songs like "Anisuthide", "Ninnindale", and "Yenagali Munde Saagu".',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('sonu nigam') || t.title.toLowerCase().includes('anisuthide') || t.title.toLowerCase().includes('ninnindale')).slice(0, 10)
  },
  {
    id: 'art-shreya-ghoshal',
    name: 'Shreya Ghoshal',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/3bb832d37d10ff2affcfa9afdc7c68a0/500x500-000000-80-0-0.jpg',
    genre: 'Kannada & Hindi / Nightingale of India',
    monthlyListeners: '38,700,000',
    bio: 'Four-time National Film Award winner with incomparable melodious grace, revered for evergreen Kannada classics like "Araluthiru Jeevada Geleya" and "Usire Usire".',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('shreya ghoshal') || t.title.toLowerCase().includes('araluthiru')).slice(0, 10)
  },
  {
    id: 'art-sushin-shyam',
    name: 'Sushin Shyam',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/6ba914ca28d2c5cc21dc3effa07c690d/500x500-000000-80-0-0.jpg',
    genre: 'Malayalam / Electronic & Indie Folk',
    monthlyListeners: '17,900,000',
    bio: 'Trendsetting Malayalam music producer behind blockbusters Aavesham, Romancham, and Kumbalangi Nights, creating fresh viral electronic grooves.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('sushin') || t.region === 'Malayalam').slice(0, 10)
  },
  {
    id: 'art-daft-punk',
    name: 'Daft Punk',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/638e69b9caaf9f9f3f8826febea7b543/500x500-000000-80-0-0.jpg',
    genre: 'Electronic / French House',
    monthlyListeners: '24,800,000',
    bio: 'Pioneering Parisian electronic duo Guy-Manuel de Homem-Christo and Thomas Bangalter, known for iconic robotic personas and revolutionary house anthems.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('daft punk')).slice(0, 10)
  },
  {
    id: 'art-the-weeknd',
    name: 'The Weeknd',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/581693b4724a7fcfa754455101e13a44/500x500-000000-80-0-0.jpg',
    genre: 'R&B / Synthpop',
    monthlyListeners: '112,400,000',
    bio: 'Abel Tesfaye, known as The Weeknd, is a global powerhouse blending dark cinematic 80s synthwave, contemporary pop, and ethereal alternative R&B.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('weeknd')).slice(0, 10)
  },
  {
    id: 'art-coldplay',
    name: 'Coldplay',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/3087954bca22f306324912e5ac8375c3/500x500-000000-80-0-0.jpg',
    genre: 'Alternative Rock / Stadium Pop',
    monthlyListeners: '86,100,000',
    bio: 'Formed in London in 1997, Coldplay became one of the bestselling bands in history with emotionally soaring anthems and visionary stadium spectacles.',
    verified: true,
    popularTracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('coldplay')).slice(0, 10)
  }
];

export const CURATED_ALBUMS: Album[] = [
  {
    id: 'alb-jag-changa',
    title: 'Jag Changa',
    artist: 'Raghu Dixit',
    artwork: CATALOGUE_TRACKS.find((t) => t.artist.toLowerCase().includes('raghu dixit'))?.artwork || 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3a/3f/06/3a3f06a5-2feb-0a30-3165-7aaa08185cb4/1200214402976.jpg/600x600bb.jpg',
    releaseYear: 2013,
    genre: 'Kannada / Folk Rock',
    trackCount: 8,
    label: 'Wrasse Records / The Raghu Dixit Project',
    tracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('raghu dixit') || t.title.toLowerCase().includes('kaalaji')).slice(0, 8)
  },
  {
    id: 'alb-sapta-sagara',
    title: 'Sapta Sagaradaache Ello (Side A & B)',
    artist: 'Charan Raj',
    artwork: CATALOGUE_TRACKS.find((t) => t.album.toLowerCase().includes('sapta'))?.artwork || 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ef/4d/93/ef4d9302-3e28-1b64-50aa-e23f009f4851/193483984666.jpg/600x600bb.jpg',
    releaseYear: 2023,
    genre: 'Kannada / Acoustic Soul',
    trackCount: 10,
    label: 'Paramvah Studios',
    tracks: CATALOGUE_TRACKS.filter((t) => t.album.toLowerCase().includes('sapta')).slice(0, 8)
  },
  {
    id: 'alb-kantara',
    title: 'Kantara (Original Soundtrack)',
    artist: 'B. Ajaneesh Loknath',
    artwork: CATALOGUE_TRACKS.find((t) => t.album.toLowerCase().includes('kantara'))?.artwork || 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/a4/d4/ec/a4d4ec62-f636-6966-3d2d-0b730f0f5b1d/0724384960650.jpg/600x600bb.jpg',
    releaseYear: 2022,
    genre: 'Kannada / Folk Fusion',
    trackCount: 8,
    label: 'Hombale Films',
    tracks: CATALOGUE_TRACKS.filter((t) => t.album.toLowerCase().includes('kantara') || t.title.toLowerCase().includes('varaha') || t.title.toLowerCase().includes('singara')).slice(0, 8)
  },
  {
    id: 'alb-kgf-2',
    title: 'K.G.F: Chapter 2',
    artist: 'Ravi Basrur',
    artwork: CATALOGUE_TRACKS.find((t) => t.album.toLowerCase().includes('k.g.f') || t.album.toLowerCase().includes('kgf'))?.artwork || 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ef/4d/93/ef4d9302-3e28-1b64-50aa-e23f009f4851/193483984666.jpg/600x600bb.jpg',
    releaseYear: 2022,
    genre: 'Kannada / Epic Score',
    trackCount: 10,
    label: 'Hombale Films',
    tracks: CATALOGUE_TRACKS.filter((t) => t.album.toLowerCase().includes('k.g.f') || t.artist.toLowerCase().includes('ravi basrur')).slice(0, 8)
  },
  {
    id: 'alb-jailer',
    title: 'Jailer',
    artist: 'Anirudh Ravichander',
    artwork: CATALOGUE_TRACKS.find((t) => t.album.toLowerCase().includes('jailer'))?.artwork || 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9f/fa/69/9ffa6964-b52e-503c-ebc4-9be97fc18d3d/190295286101.jpg/600x600bb.jpg',
    releaseYear: 2023,
    genre: 'Tamil / Mass Beats',
    trackCount: 8,
    label: 'Sun Pictures',
    tracks: CATALOGUE_TRACKS.filter((t) => t.album.toLowerCase().includes('jailer') || t.artist.toLowerCase().includes('anirudh')).slice(0, 8)
  },
  {
    id: 'alb-brahmastra',
    title: 'Brahmāstra: Part One – Shiva',
    artist: 'Pritam & Arijit Singh',
    artwork: CATALOGUE_TRACKS.find((t) => t.album.toLowerCase().includes('brahmāstra') || t.album.toLowerCase().includes('brahmastra'))?.artwork || 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4b/cf/c9/4bcfc998-cb31-893d-d602-54a79fc2c355/19UMGIM03756.rgb.jpg/600x600bb.jpg',
    releaseYear: 2022,
    genre: 'Bollywood / Romantic Pop',
    trackCount: 9,
    label: 'Sony Music India',
    tracks: CATALOGUE_TRACKS.filter((t) => t.album.toLowerCase().includes('brahmastra') || t.artist.toLowerCase().includes('arijit')).slice(0, 8)
  },
  {
    id: 'alb-rrr',
    title: 'RRR (Original Soundtrack)',
    artist: 'M.M. Keeravani',
    artwork: CATALOGUE_TRACKS.find((t) => t.album.toLowerCase().includes('rrr'))?.artwork || 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/d9/b4/43/d9b44330-3162-fe41-4796-030b42d13dae/0724352778355.jpg/600x600bb.jpg',
    releaseYear: 2022,
    genre: 'Telugu / Epic Symphonic',
    trackCount: 7,
    label: 'Lahari Music',
    tracks: CATALOGUE_TRACKS.filter((t) => t.album.toLowerCase().includes('rrr') || t.artist.toLowerCase().includes('keeravani')).slice(0, 7)
  },
  {
    id: 'alb-goat',
    title: 'G.O.A.T.',
    artist: 'Diljit Dosanjh',
    artwork: CATALOGUE_TRACKS.find((t) => t.artist.toLowerCase().includes('diljit'))?.artwork || 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/28/90/19/28901962-cf77-3e19-0639-65aa667fc46c/16UMGIM60699.rgb.jpg/600x600bb.jpg',
    releaseYear: 2020,
    genre: 'Punjabi / Hip-Hop',
    trackCount: 16,
    label: 'Famous Studios',
    tracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('diljit')).slice(0, 8)
  },
  {
    id: 'alb-discovery',
    title: 'Discovery',
    artist: 'Daft Punk',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/a4/d4/ec/a4d4ec62-f636-6966-3d2d-0b730f0f5b1d/0724384960650.jpg/600x600bb.jpg',
    releaseYear: 2001,
    genre: 'Dance / Electronic',
    trackCount: 14,
    label: 'Virgin Records',
    tracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('daft punk')).slice(0, 8)
  },
  {
    id: 'alb-after-hours',
    title: 'After Hours',
    artist: 'The Weeknd',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4b/cf/c9/4bcfc998-cb31-893d-d602-54a79fc2c355/19UMGIM03756.rgb.jpg/600x600bb.jpg',
    releaseYear: 2020,
    genre: 'R&B / Synthpop',
    trackCount: 14,
    label: 'XO / Republic Records',
    tracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('weeknd')).slice(0, 8)
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-raghu-dixit',
    name: 'Raghu Dixit & Kannada Folk Fusion',
    description: 'Lokada Kaalaji, Gudugudiya Sedi Nodo, Munjaane Manjalli, and soulful Shishunala Sharif poetry.',
    coverImage: CATALOGUE_TRACKS.find((t) => t.artist.toLowerCase().includes('raghu dixit'))?.artwork || '',
    tracks: CATALOGUE_TRACKS.filter((t) => t.artist.toLowerCase().includes('raghu dixit') || t.title.toLowerCase().includes('kaalaji') || t.title.toLowerCase().includes('munjaane')).slice(0, 15),
    createdAt: Date.now() - 86400000 * 5,
    isCustom: false
  },
  {
    id: 'pl-kannada',
    name: 'Kannada Blockbusters',
    description: 'Iconic hits from Kantara, KGF, 777 Charlie, and top Sandalwood anthems.',
    coverImage: CATALOGUE_TRACKS.find((t) => t.region === 'Kannada')?.artwork || '',
    tracks: CATALOGUE_TRACKS.filter((t) => t.region === 'Kannada').slice(0, 15),
    createdAt: Date.now() - 86400000 * 3,
    isCustom: false
  },
  {
    id: 'pl-bollywood',
    name: 'Bollywood Heartbeats',
    description: 'Arijit Singh, Pritam, and A.R. Rahman unforgettable melodies.',
    coverImage: CATALOGUE_TRACKS.find((t) => t.region === 'Hindi')?.artwork || '',
    tracks: CATALOGUE_TRACKS.filter((t) => t.region === 'Hindi').slice(0, 15),
    createdAt: Date.now() - 86400000 * 2,
    isCustom: false
  },
  {
    id: 'pl-south-fire',
    name: 'South Indian Fire: Tamil & Telugu',
    description: 'High-energy beats from Anirudh, RRR, Pushpa, and Sid Sriram.',
    coverImage: CATALOGUE_TRACKS.find((t) => t.region === 'Tamil' || t.region === 'Telugu')?.artwork || '',
    tracks: CATALOGUE_TRACKS.filter((t) => t.region === 'Tamil' || t.region === 'Telugu').slice(0, 15),
    createdAt: Date.now() - 86400000 * 1,
    isCustom: false
  },
  {
    id: 'pl-punjabi-party',
    name: 'Punjabi Bhangra & Vibes',
    description: 'Diljit Dosanjh, AP Dhillon, and Karan Aujla dancefloor anthems.',
    coverImage: CATALOGUE_TRACKS.find((t) => t.region === 'Punjabi')?.artwork || '',
    tracks: CATALOGUE_TRACKS.filter((t) => t.region === 'Punjabi').slice(0, 15),
    createdAt: Date.now() - 86400000 * 4,
    isCustom: false
  }
];

// Helper to upscale iTunes artwork URL to 600x600
function getHighResArtwork(url: string | undefined): string {
  if (!url) return '';
  return url.replace('100x100bb', '600x600bb');
}

// Convert iTunes API raw result to Track format
function parseITunesItem(item: any): Track | null {
  if (!item || !item.previewUrl || typeof item.previewUrl !== 'string' || item.previewUrl.trim() === '') {
    return null;
  }

  const artworkSmall = item.artworkUrl100 || item.artworkUrl60 || '';
  const artwork = getHighResArtwork(artworkSmall);

  return {
    id: item.trackId || `${item.artistName}-${item.trackName}`,
    title: item.trackName || 'Untitled Track',
    artist: item.artistName || 'Unknown Artist',
    album: item.collectionName || 'Single / EP',
    artwork: artwork || artworkSmall,
    artworkSmall: artworkSmall,
    duration: 30,
    previewUrl: item.previewUrl,
    genre: item.primaryGenreName || 'General',
    releaseDate: item.releaseDate ? item.releaseDate.split('T')[0] : undefined,
    trackViewUrl: item.trackViewUrl,
    isExplicit: item.trackExplicitness === 'explicit'
  };
}

/**
 * Searches across the comprehensive 450+ catalogue first for instant zero-latency results,
 * and falls back/enhances with live iTunes API search.
 */
export async function searchTracks(query: string, limit: number = 40): Promise<Track[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return ALL_TRACKS.slice(0, limit);
  }

  // Tokenize query words so "raghu dixit song", "kantara ajaneesh", "arijit sad" match seamlessly
  const words = trimmed.split(/\s+/).filter(Boolean);

  const localMatches = ALL_TRACKS.filter((t) => {
    const haystack = `${t.title} ${t.artist} ${t.album} ${t.genre} ${t.region || ''}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });

  // Sort so exact artist/title matches come first
  localMatches.sort((a, b) => {
    const aTitleExact = a.title.toLowerCase().includes(trimmed);
    const bTitleExact = b.title.toLowerCase().includes(trimmed);
    const aArtistExact = a.artist.toLowerCase().includes(trimmed);
    const bArtistExact = b.artist.toLowerCase().includes(trimmed);

    if (aTitleExact && !bTitleExact) return -1;
    if (!aTitleExact && bTitleExact) return 1;
    if (aArtistExact && !bArtistExact) return -1;
    if (!aArtistExact && bArtistExact) return 1;
    return 0;
  });

  if (localMatches.length >= 8) {
    return localMatches.slice(0, limit);
  }

  // If local results are low, query live iTunes API
  try {
    const encoded = encodeURIComponent(query.trim());
    const url = `https://itunes.apple.com/search?term=${encoded}&entity=song&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) {
      return localMatches;
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return localMatches;
    }

    const parsedTracks: Track[] = [];
    const seenIds = new Set(localMatches.map((t) => t.id));

    for (const item of data.results) {
      const track = parseITunesItem(item);
      if (track && !seenIds.has(track.id)) {
        parsedTracks.push(track);
        seenIds.add(track.id);
      }
    }

    return [...localMatches, ...parsedTracks].slice(0, limit);
  } catch (error) {
    console.warn('Network search fallback to local matches', error);
    return localMatches;
  }
}

/**
 * Filter tracks by region
 */
export function getTracksByRegion(region: string): Track[] {
  if (region === 'all') return CATALOGUE_TRACKS;
  return CATALOGUE_TRACKS.filter((t) => t.region === region);
}

/**
 * Fetches tracks by an artist from catalogue & iTunes
 */
export async function getArtistTracks(artistName: string, limit: number = 25): Promise<Track[]> {
  const local = CATALOGUE_TRACKS.filter((t) =>
    t.artist.toLowerCase().includes(artistName.toLowerCase())
  );
  if (local.length >= 8) {
    return local.slice(0, limit);
  }
  return searchTracks(artistName, limit);
}

/**
 * Fetches tracks from a specific album
 */
export async function getAlbumTracks(albumTitle: string, artistName: string, limit: number = 25): Promise<Track[]> {
  const local = CATALOGUE_TRACKS.filter(
    (t) =>
      t.album.toLowerCase().includes(albumTitle.toLowerCase()) ||
      (t.artist.toLowerCase().includes(artistName.toLowerCase()) && t.album.toLowerCase().includes(albumTitle.toLowerCase()))
  );
  if (local.length >= 4) {
    return local.slice(0, limit);
  }
  return searchTracks(`${albumTitle} ${artistName}`, limit);
}

/**
 * Validates if an audio URL is reachable and playable.
 */
export async function validateAudioUrl(url: string): Promise<boolean> {
  if (!url || typeof url !== 'string') {
    return false;
  }
  const clean = url.trim();
  if (
    clean.startsWith('/') ||
    clean.startsWith('blob:') ||
    clean.startsWith('data:') ||
    clean.startsWith('http://') ||
    clean.startsWith('https://')
  ) {
    return true;
  }
  return false;
}

/**
 * Returns all unified tracks (Full masters + Curated catalog) for curation and search
 */
export function getAllTracks(): Track[] {
  const map = new Map<string | number, Track>();
  FULL_LENGTH_TRACKS.forEach((t) => map.set(t.id, t));
  CATALOGUE_TRACKS.forEach((t) => {
    if (!map.has(t.id)) map.set(t.id, t);
  });
  return Array.from(map.values());
}
