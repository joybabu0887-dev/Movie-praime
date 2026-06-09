import { Search, Film, Heart, Languages } from 'lucide-react';
import { LanguageMode } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
  watchlistCount: number;
  onOpenWatchlist: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  language,
  setLanguage,
  watchlistCount,
  onOpenWatchlist,
}: HeaderProps) {
  const isEn = language === 'en';

  return (
    <header 
      id="app-header" 
      className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="text-xl font-black tracking-tighter sm:text-2xl text-red-600 uppercase">
            CINE<span className="text-white">FLIX</span>
          </div>
          <div className="hidden h-4 w-[1px] bg-zinc-800 sm:block"></div>
          <div>
            <p className="hidden text-[10px] uppercase font-bold tracking-widest text-zinc-400 sm:block">
              {isEn ? 'WORLD BEST' : 'বিশ্বের সেরা'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mx-4 flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            id="search-input"
            type="text"
            placeholder={isEn ? 'Search movies, cast, directors...' : 'মুভি, অভিনেতা বা পরিচালক খুঁজুন...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 outline-none transition-all focus:border-red-500 focus:bg-zinc-900 focus:ring-1 focus:ring-red-500 sm:text-sm"
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Language Toggle */}
          <button
            id="lang-toggle-btn"
            onClick={() => setLanguage(isEn ? 'bn' : 'en')}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-2.5 py-1.5 text-xs text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800 active:scale-95"
            title={isEn ? 'Switch to Bangla' : 'ইংরেজিতে পরিবর্তন করুন'}
          >
            <Languages className="h-3.5 w-3.5 text-red-500" />
            <span className="font-medium hidden sm:inline">{isEn ? 'বাংলা' : 'English'}</span>
            <span className="font-medium inline sm:hidden uppercase">{isEn ? 'BN' : 'EN'}</span>
          </button>

          {/* Watchlist Handler */}
          <button
            id="watchlist-toggle-btn"
            onClick={onOpenWatchlist}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800 active:scale-95 sm:h-10 sm:w-10"
            title={isEn ? 'My Watchlist' : 'আমার ওয়াচলিস্ট'}
          >
            <Heart className="h-4 w-4 text-red-500" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-lg shadow-red-600/40 animate-pulse">
                {watchlistCount}
              </span>
            )}
          </button>
          
        </div>

      </div>
    </header>
  );
}
