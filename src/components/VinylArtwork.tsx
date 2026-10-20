import React from 'react';
import { ArtworkImage } from './ArtworkImage';

interface VinylArtworkProps {
  artworkUrl: string;
  title: string;
  artist: string;
  genre?: string;
  isPlaying?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  peekOut?: boolean;
  className?: string;
  onClick?: () => void;
}

export const VinylArtwork: React.FC<VinylArtworkProps> = ({
  artworkUrl,
  title,
  artist,
  genre,
  isPlaying = false,
  size = 'md',
  peekOut = true,
  className = '',
  onClick
}) => {
  // Dimensions
  const sizeMap = {
    sm: {
      container: 'w-24 h-24',
      jacket: 'w-20 h-20',
      disc: 'w-18 h-18 -right-2',
      centerHole: 'w-4 h-4',
      label: 'w-7 h-7'
    },
    md: {
      container: 'w-44 h-36',
      jacket: 'w-36 h-36',
      disc: 'w-32 h-32 -right-4',
      centerHole: 'w-6 h-6',
      label: 'w-12 h-12'
    },
    lg: {
      container: 'w-56 h-48',
      jacket: 'w-48 h-48',
      disc: 'w-44 h-44 -right-6',
      centerHole: 'w-8 h-8',
      label: 'w-16 h-16'
    },
    hero: {
      container: 'w-64 h-56 sm:w-80 sm:h-72',
      jacket: 'w-56 h-56 sm:w-68 sm:h-68',
      disc: 'w-52 h-52 sm:w-64 sm:h-64 -right-6 sm:-right-8',
      centerHole: 'w-10 h-10',
      label: 'w-20 h-20'
    }
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`relative group flex items-center select-none ${currentSize.container} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Vinyl Disc peeking out from the sleeve */}
      {peekOut && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${currentSize.disc} ${currentSize.disc.split(' ')[0]} ${currentSize.disc.split(' ')[1]} rounded-full bg-[#111317] border border-white/10 shadow-2xl transition-transform duration-500 ease-out flex items-center justify-center overflow-hidden z-0 ${
            isPlaying
              ? 'translate-x-3 rotate-180 animate-[spin_8s_linear_infinite]'
              : 'group-hover:translate-x-3 group-hover:rotate-45'
          }`}
          style={{
            backgroundImage: `repeating-radial-gradient(circle at center, #0f1115 0px, #1a1d24 2px, #0b0d11 4px, #171a21 6px)`,
            boxShadow: '0 12px 30px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,0,0,0.9)'
          }}
        >
          {/* Vinyl Reflection sheen lines */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/10 pointer-events-none opacity-40" />

          {/* Center Vinyl Label Sticker */}
          <div
            className={`relative rounded-full overflow-hidden border-2 border-white/20 shadow-md flex items-center justify-center ${currentSize.label}`}
          >
            <img
              src={artworkUrl}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Center Spindle Hole */}
            <div
              className={`absolute rounded-full bg-[#090b10] border border-white/40 shadow-inner ${currentSize.centerHole}`}
            />
          </div>
        </div>
      )}

      {/* Album Cardboard Jacket Sleeve */}
      <div
        className={`relative z-10 ${currentSize.jacket} rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900 transition-all duration-300 group-hover:shadow-indigo-500/20 group-hover:-translate-y-1`}
      >
        {/* Cardboard Spine Accent */}
        <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-r from-white/30 to-transparent z-20 pointer-events-none" />

        {/* Artwork Image */}
        <ArtworkImage
          src={artworkUrl}
          alt={`${title} by ${artist}`}
          genre={genre}
          roundedClass="rounded-xl"
          className="w-full h-full"
        />

        {/* Cardboard Texture & Gloss Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none z-10" />
      </div>
    </div>
  );
};
