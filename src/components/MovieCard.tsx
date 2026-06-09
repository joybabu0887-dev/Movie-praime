import React from 'react';
import { Play, Star, Plus, Check } from 'lucide-react';
import { Movie, LanguageMode } from '../types';

interface MovieCardProps {
  key?: string;
  movie: Movie;
  language: LanguageMode;
  isWatchlisted: boolean;
  onToggleWatchlist: (e: React.MouseEvent) => void;
  onWatchNow: () => void;
  onSelect: () => void;
}

export default function MovieCard({
  movie,
  language,
  isWatchlisted,
  onToggleWatchlist,
  onWatchNow,
  onSelect,
}: MovieCardProps) {
  const isEn = language === 'en';

  // Format details for appropriate languages
  const displayTitle = isEn ? movie.title : movie.titleBn;
  const displayGenres = isEn ? movie.genres : movie.genresBn;
  const displayDirector = isEn ? movie.director : movie.directorBn;

  // Language badge name styling
  const langLabels = {
    bangla: isEn ? 'Bangla' : 'বাংলা',
    english: isEn ? 'English' : 'ইংরেজি',
    indian: isEn ? 'Indian' : 'ভারতীয়',
  };

  const tagColors = {
    bangla: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    english: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    indian: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div
      id={`movie-card-${movie.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-zinc-900 bg-[#0c0c0c]/90 transition-all duration-300 hover:border-zinc-800 hover:bg-[#0f0f0f] hover:shadow-2xl hover:shadow-red-950/20"
    >
      {/* Movie Banner Container (aspectRatio 16:9 for movie banners in landscape or visual cards as requested) */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#080808]">
        <img
          src={movie.bannerUrl}
          alt={displayTitle}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-102"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/10 to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase ${tagColors[movie.language]}`}>
            {langLabels[movie.language]}
          </span>
          <span className="rounded bg-[#080808]/80 px-1.5 py-0.5 text-[9px] font-mono text-zinc-400">
            {movie.year}
          </span>
        </div>

        {/* Watchlist Quick Button */}
        <button
          onClick={onToggleWatchlist}
          className="absolute top-2 right-2 flex h-6.5 w-6.5 items-center justify-center rounded bg-[#080808]/80 text-white backdrop-blur-sm transition-all hover:bg-red-600 hover:text-white active:scale-90"
          title={isWatchlisted ? (isEn ? 'Remove from Watchlist' : 'ওয়াচলিস্ট থেকে বাদ দিন') : (isEn ? 'Add to Watchlist' : 'ওয়াচলিস্টে যোগ করুন')}
        >
          {isWatchlisted ? (
            <Check className="h-3.5 w-3.5 text-emerald-400 group-hover:text-white" />
          ) : (
            <Plus className="h-3.5 w-3.5 text-zinc-300 hover:text-white" />
          )}
        </button>

        {/* Hover quick play action */}
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Card Metadata Details */}
      <div className="flex flex-1 flex-col p-3.5">
        
        {/* Title and Rating Row */}
        <div className="mb-1.5 flex items-start justify-between gap-1">
          <button 
            onClick={onSelect}
            className="text-left font-sans text-xs sm:text-[13px] font-black tracking-tight text-[#f4f4f5] transition-colors hover:text-red-500 line-clamp-1 uppercase"
          >
            {displayTitle}
          </button>
          
          <div className="flex items-center gap-0.5 rounded bg-[#080808] px-1 py-0.5 text-[10px] text-amber-400 font-mono">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            <span className="font-bold">{movie.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Director and Info */}
        <p className="text-[10px] text-zinc-500 line-clamp-1 mb-2">
          {isEn ? `BY ${displayDirector}` : `পরিচালনায়: ${displayDirector}`}
        </p>

        {/* Genres tag pill container */}
        <div className="mb-3.5 flex flex-wrap items-center gap-1">
          {displayGenres.slice(0, 2).map((g, idx) => (
            <span key={idx} className="rounded bg-zinc-900 px-1.5 py-0.5 text-[8px] font-bold text-zinc-400 uppercase tracking-tight">
              {g}
            </span>
          ))}
          <span className="ml-auto text-[9px] text-zinc-500 font-mono">
            {movie.duration}
          </span>
        </div>

        {/* Interactive primary Button: WATCH NOW */}
        <div className="mt-auto grid grid-cols-2 gap-1.5">
          {/* Info select button */}
          <button
            onClick={onSelect}
            className="rounded border border-zinc-800/60 bg-zinc-900/40 px-2 py-1.5 text-[10px] font-black uppercase text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white active:scale-95"
          >
            {isEn ? 'MORE INFO' : 'বিস্তারিত'}
          </button>

          {/* Quick watch button */}
          <button
            onClick={onWatchNow}
            className="flex items-center justify-center gap-1 rounded bg-red-600 px-2 py-1.5 text-[10px] font-black uppercase text-white transition-all hover:bg-red-700 active:scale-95"
          >
            <Play className="h-2.5 w-2.5 fill-white text-white" />
            <span>{isEn ? 'WATCH NOW' : 'দেখুন'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
