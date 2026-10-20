import React, { useState, useEffect } from 'react';
import { Music2, User } from 'lucide-react';

interface ArtworkImageProps {
  src?: string;
  alt: string;
  className?: string;
  genre?: string;
  roundedClass?: string;
  isArtist?: boolean;
}

export const ArtworkImage: React.FC<ArtworkImageProps> = ({
  src,
  alt,
  className = '',
  genre = 'Music',
  roundedClass = 'rounded-xl',
  isArtist = false
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset state if src changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Compute initials for artist fallback
  const getInitials = (name: string) => {
    if (!name) return 'VW';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (!src || hasError) {
    if (isArtist) {
      return (
        <div
          className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-tr from-indigo-900 via-slate-800 to-amber-700/80 p-3 text-center select-none shadow-inner ${roundedClass} ${className}`}
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
          <span className="text-xl sm:text-2xl font-black tracking-widest text-white drop-shadow-md">
            {getInitials(alt)}
          </span>
          <span className="text-[10px] font-semibold text-amber-200/90 truncate max-w-full mt-1">
            {alt}
          </span>
        </div>
      );
    }

    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-2 text-center select-none ${roundedClass} ${className}`}
      >
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <Music2 className="w-6 h-6 text-indigo-400 mb-1 opacity-80" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 truncate max-w-full">
          {genre}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${roundedClass} ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800/80 animate-pulse flex items-center justify-center">
          {isArtist ? (
            <User className="w-6 h-6 text-slate-600 animate-pulse" />
          ) : (
            <Music2 className="w-6 h-6 text-slate-600 animate-pulse" />
          )}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Subtle glossy glass reflex overlay for premium physical feel */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
    </div>
  );
};
