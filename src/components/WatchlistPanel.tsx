import { X, Play, Trash2, Heart } from 'lucide-react';
import { Movie, LanguageMode } from '../types';

interface WatchlistPanelProps {
  watchlist: Movie[];
  language: LanguageMode;
  onClose: () => void;
  onRemove: (id: string) => void;
  onWatchNow: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
}

export default function WatchlistPanel({
  watchlist,
  language,
  onClose,
  onRemove,
  onWatchNow,
  onSelectMovie,
}: WatchlistPanelProps) {
  const isEn = language === 'en';

  return (
    <div
      id="watchlist-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-zinc-950/80 backdrop-blur-xs transition-opacity duration-300"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Drawer content */}
      <div
        id="watchlist-drawer"
        className="relative flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl focus:outline-none"
      >
        {/* Drawer Header */}
        <div className="mb-6 flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <h3 className="text-base font-extrabold text-white sm:text-lg">
              {isEn ? 'My Saved Queue' : 'আমার ওয়াচলিস্ট'}
            </h3>
            <span className="rounded-full bg-red-600/10 border border-red-500/20 px-2 py-0.5 text-xs font-bold text-red-400">
              {watchlist.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Watchlist queue list */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
          {watchlist.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
                <Heart className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-400">
                  {isEn ? 'Your Watchlist is empty' : 'ওয়াচলিস্টে এখনো কোনো মুভি নেই'}
                </p>
                <p className="text-xs text-zinc-500 max-w-xs mt-1">
                  {isEn 
                    ? 'Explore movies and tap the plus icon to save your favorite cinema titles for later viewing.' 
                    : 'মুভিগুলো অন্বেষণ করুন এবং আপনার প্রিয় সিনেমা শিরোনামগুলো পরবর্তীতে দেখতে প্লাস আইকনে ট্যাপ করুন।'}
                </p>
              </div>
            </div>
          ) : (
            watchlist.map((movie) => {
              const displayTitle = isEn ? movie.title : movie.titleBn;
              const displayDirector = isEn ? movie.director : movie.directorBn;

              return (
                <div
                  key={movie.id}
                  className="group relative flex items-center gap-4 rounded-xl border border-zinc-900 bg-zinc-900/40 p-3 transition-all hover:border-zinc-800 hover:bg-zinc-900/80"
                >
                  {/* Aspect poster */}
                  <div 
                    onClick={() => onSelectMovie(movie)}
                    className="relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded bg-zinc-950 border border-zinc-800/60"
                  >
                    <img
                      src={movie.posterUrl}
                      alt={displayTitle}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-4 w-4 fill-white text-white" />
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="min-w-0 flex-1">
                    <h4 
                      onClick={() => onSelectMovie(movie)}
                      className="cursor-pointer truncate text-xs font-bold text-white hover:text-red-500 transition-colors sm:text-sm"
                    >
                      {displayTitle}
                    </h4>
                    <p className="truncate text-[10px] text-zinc-500">
                      {isEn ? `Dir: ${displayDirector}` : `পরিচালক: ${displayDirector}`}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-zinc-400 font-medium">
                        {movie.language}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {movie.year}
                      </span>
                    </div>
                  </div>

                  {/* Operational actions */}
                  <div className="flex flex-col items-center gap-2">
                    {/* Quick remove from watchlist */}
                    <button
                      onClick={() => onRemove(movie.id)}
                      className="rounded p-1 text-zinc-500 hover:bg-red-500/15 hover:text-red-400 transition-colors"
                      title={isEn ? 'Remove' : 'বাদ দিন'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Play Button */}
                    <button
                      onClick={() => onWatchNow(movie)}
                      className="rounded bg-red-600 p-1.5 text-white shadow shadow-red-600/30 hover:bg-red-500 transition-colors"
                      title={isEn ? 'Watch Now' : 'এখন দেখুন'}
                    >
                      <Play className="h-3 w-3 fill-white text-white" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Action footer */}
        {watchlist.length > 0 && (
          <div className="mt-4 border-t border-zinc-900 pt-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span>{isEn ? 'Total Saved:' : 'সর্বমোট সংরক্ষিত:'}</span>
              <span className="font-bold text-white">{watchlist.length} {isEn ? 'movies' : 'টি চলচ্চিত্র'}</span>
            </div>
            
            <p className="text-[10px] text-zinc-500 text-center italic">
              {isEn 
                ? 'Your watchlist values are kept locally in your browser storage.' 
                : 'আপনার ওয়াচলিস্টের তথ্য সুরক্ষিতভাবে ব্রাউজার মেমোরিতে সংরক্ষণ করা আছে।'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
