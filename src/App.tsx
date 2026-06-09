/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, StrictMode } from 'react';
import Header from './components/Header';
import MovieCard from './components/MovieCard';
import MovieDetailModal from './components/MovieDetailModal';
import CinemaPlayer from './components/CinemaPlayer';
import WatchlistPanel from './components/WatchlistPanel';
import { MOVIES, GENRES_EN, GENRES_BN } from './data';
import { Movie, Review, LanguageMode } from './types';
import { Play, Info, Heart, Award, ArrowUp, Zap } from 'lucide-react';

export default function App() {
  // 1. Language States
  const [language, setLanguage] = useState<LanguageMode>('bn'); // Default to Bengali as requested helper!

  // 2. Search & Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLanguageFilter, setActiveLanguageFilter] = useState<'all' | 'bangla' | 'english' | 'indian'>('all');
  const [activeGenre, setActiveGenre] = useState('All'); // Matches English genre string or 'সবগুলো' for translation maps

  // 3. Drawer & Modal active values
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeStreamingMovie, setActiveStreamingMovie] = useState<Movie | null>(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 4. Persistent states (LocalStorage)
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cineflix_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [allReviews, setAllReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('cineflix_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('cineflix_watchlist', JSON.stringify(watchlistIds));
  }, [watchlistIds]);

  // Sync reviews to localStorage
  useEffect(() => {
    localStorage.setItem('cineflix_reviews', JSON.stringify(allReviews));
  }, [allReviews]);

  // Monitor scroll for back to top floating arrow
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isEn = language === 'en';

  // Toggle dynamic Watchlist items
  const handleToggleWatchlist = (movieId: string) => {
    setWatchlistIds((prev) => {
      if (prev.includes(movieId)) {
        return prev.filter((id) => id !== movieId);
      } else {
        return [...prev, movieId];
      }
    });
  };

  // Centralized Watch Now function which redirects to CPM Network link and plays preview
  const handleWatchNow = (movie: Movie) => {
    const watchUrl = 'https://www.effectivecpmnetwork.com/jztmppn3?key=dc0983dff4132d55f005d46182214a15';
    try {
      window.open(watchUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Failed to open external link, attempting standard redirect:', e);
      window.location.href = watchUrl;
    }
    setActiveStreamingMovie(movie);
  };

  // Append customized reviews securely
  const handleAddNewReview = (movieId: string, name: string, stars: number, txt: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      movieId,
      reviewerName: name,
      rating: stars,
      comment: txt,
      createdAt: new Date().toLocaleDateString(isEn ? 'en-US' : 'bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };
    setAllReviews((prev) => [newRev, ...prev]);
  };

  // Convert watchlistIds to real Movie objects
  const watchlistMovies = useMemo(() => {
    return MOVIES.filter((m) => watchlistIds.includes(m.id));
  }, [watchlistIds]);

  // Filter movies lists based on Search parameters, language criteria and genre tags
  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => {
      // Language filter constraints
      if (activeLanguageFilter !== 'all' && movie.language !== activeLanguageFilter) {
        return false;
      }

      // Genre filter check
      if (activeGenre !== 'All' && activeGenre !== 'সবগুলো') {
        const matchingGenreIndex = GENRES_EN.indexOf(activeGenre);
        if (matchingGenreIndex !== -1) {
          const correspondingBn = GENRES_BN[matchingGenreIndex];
          const hasEnglishGenre = movie.genres.includes(activeGenre);
          const hasBanglaGenre = movie.genresBn.includes(correspondingBn);
          if (!hasEnglishGenre && !hasBanglaGenre) {
            return false;
          }
        }
      }

      // Search parameters matches
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitleEn = movie.title.toLowerCase().includes(query);
        const matchesTitleBn = movie.titleBn.toLowerCase().includes(query);
        const matchesCast = movie.cast.some((actor) => actor.toLowerCase().includes(query));
        const matchesDirectorEn = movie.director.toLowerCase().includes(query);
        const matchesDirectorBn = movie.directorBn.toLowerCase().includes(query);
        
        return matchesTitleEn || matchesTitleBn || matchesCast || matchesDirectorEn || matchesDirectorBn;
      }

      return true;
    });
  }, [activeLanguageFilter, activeGenre, searchQuery]);

  // Choose the absolute top rated movie matching filters as the gorgeous Hero Spotlight banner
  const spotlightMovie = useMemo(() => {
    // If we have filtered results, highlight the highest rated movie
    if (filteredMovies.length > 0) {
      return [...filteredMovies].sort((a, b) => b.rating - a.rating)[0];
    }
    return MOVIES[0]; // fallback to first movie if empty
  }, [filteredMovies]);

  // Setup genres listing based on current language
  const genresList = isEn ? GENRES_EN : GENRES_BN;

  const handleSelectGenre = (genreStr: string) => {
    // Correctly translate or set values of matching index
    const index = genresList.indexOf(genreStr);
    if (index !== -1) {
      setActiveGenre(GENRES_EN[index]);
    } else {
      setActiveGenre('All');
    }
  };

  const getLanguageLabel = (key: 'all' | 'bangla' | 'english' | 'indian') => {
    if (isEn) {
      switch (key) {
        case 'all': return 'All Languages';
        case 'bangla': return 'Bangla Cinema';
        case 'english': return 'English Movies';
        case 'indian': return 'Indian Cinema';
      }
    } else {
      switch (key) {
        case 'all': return 'সব ভাষা';
        case 'bangla': return 'বাংলা সিনেমা';
        case 'english': return 'ইংরেজি সিনেমা';
        case 'indian': return 'ভারতীয় সিনেমা';
      }
    }
  };

  return (
    <div id="movie-catalog-app" className="min-h-screen bg-[#080808] text-white font-sans antialiased selection:bg-red-600 selection:text-white">
      
      {/* Header component */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        language={language}
        setLanguage={setLanguage}
        watchlistCount={watchlistIds.length}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
      />

      <main className="pb-16">
        
        {/* HERO SPOTLIGHT BANNER PANEL - Aspect Ratio 16:9 style for desktop showcase */}
        {spotlightMovie && (
          <section id="hero-spotlight-section" className="relative w-full bg-[#080808] border-b border-zinc-900/40">
            <div className="absolute inset-0 aspect-[16/6] md:aspect-[21/8] lg:aspect-[24/9] w-full overflow-hidden bg-black">
              <img
                src={spotlightMovie.bannerUrl}
                alt={isEn ? spotlightMovie.title : spotlightMovie.titleBn}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover opacity-35 object-[center_30%] blur-[1px]"
              />
              {/* Grand cinematic ambient shadows */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950/20" />
            </div>

            {/* Banner details container */}
            <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 sm:pt-28 md:pt-36 lg:px-8">
              <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-full bg-red-600/10 border border-red-500/20 px-3 py-1 text-xs text-red-400 font-bold uppercase tracking-wider">
                    <Zap className="h-3 w-3 animate-bounce text-red-500" />
                    <span>{isEn ? 'Featured Spotlight' : 'আজকের বিশেষ আকর্ষণ'}</span>
                  </div>
                  <span className="text-xs text-zinc-400 font-bold">• {spotlightMovie.year}</span>
                </div>

                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl text-shadow">
                  {isEn ? spotlightMovie.title : spotlightMovie.titleBn}
                </h1>

                <p className="text-sm text-zinc-300 leading-relaxed max-w-xl sm:text-base line-clamp-3">
                  {isEn ? spotlightMovie.description : spotlightMovie.descriptionBn}
                </p>

                {/* Info and watch button controls */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleWatchNow(spotlightMovie)}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-extrabold text-white shadow-xl shadow-red-600/30 transition-all hover:bg-red-500 active:scale-95"
                  >
                    <Play className="h-4.5 w-4.5 fill-white text-white" />
                    <span>{isEn ? 'Watch Now' : 'এখন দেখুন'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedMovie(spotlightMovie)}
                    className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/30 px-6 py-3 text-sm font-bold text-zinc-200 transition-all hover:bg-zinc-800 hover:text-white"
                  >
                    <Info className="h-4.5 w-4.5" />
                    <span>{isEn ? 'More Info' : 'বিস্তারিত'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleWatchlist(spotlightMovie.id)}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                      watchlistIds.includes(spotlightMovie.id)
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                    }`}
                    title={isEn ? 'Add to Watchlist' : 'ওয়াচলিস্টে যোগ করুন'}
                  >
                    <Heart className={`h-5 w-5 ${watchlistIds.includes(spotlightMovie.id) ? 'fill-emerald-400' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CONTROLS BAR: CATEGORY TABS & GENRE CAPSULES */}
        <section id="movie-filter-controls" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-zinc-900 pb-6">
            
            {/* 1. Language category filter tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-zinc-900/40 p-1.5 rounded-2xl border border-zinc-900 w-fit">
              {(['all', 'bangla', 'english', 'indian'] as const).map((langFilter) => (
                <button
                  key={langFilter}
                  onClick={() => {
                    setActiveLanguageFilter(langFilter);
                    // Reset genre when switching major tabs to prevent blank states
                    setActiveGenre('All');
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all uppercase whitespace-nowrap active:scale-95 ${
                    activeLanguageFilter === langFilter
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  {getLanguageLabel(langFilter)}
                </button>
              ))}
            </div>

            {/* Total search outcome summary */}
            <p className="text-xs text-zinc-500 font-mono">
              {isEn ? 'Showing' : 'প্রদর্শিত হচ্ছে'}: <span className="font-bold text-red-500">{filteredMovies.length}</span> {isEn ? 'movies matching criteria' : 'টি চলচ্চিত্র'}
            </p>
          </div>

          {/* 2. Horizontal Genre Capsules scroll */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
            {genresList.map((genre) => {
              // Get standard English index of matching translated genre
              const mappingIndex = genresList.indexOf(genre);
              const enEquiv = GENRES_EN[mappingIndex];
              const isSelected = activeGenre === enEquiv || (activeGenre === 'All' && enEquiv === 'All');

              return (
                <button
                  key={genre}
                  onClick={() => handleSelectGenre(genre)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all border active:scale-95 ${
                    isSelected
                      ? 'bg-white text-zinc-950 border-white font-bold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>

        </section>

        {/* PRIMARY MOVE GRID DISPLAY CARD SECTION */}
        <section id="movie-grid-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-sm font-bold border-l-4 border-red-600 pl-3 uppercase tracking-widest text-[#f4f4f5] sm:text-base">
              {isEn ? 'Selected Blockbusters' : 'নির্বাচিত গ্লোবাল ব্লকবাস্টারস'}
            </h2>
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveLanguageFilter('all');
                setActiveGenre('All');
              }}
              className="text-[11px] text-red-500 font-black tracking-widest hover:underline uppercase"
            >
              {isEn ? 'VIEW ALL' : 'সবগুলো দেখুন'}
            </button>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6 space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500">
                <Award className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">
                  {isEn ? 'No Movies Detected' : 'কোনো চলচ্চিত্র পাওয়া যায়নি'}
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm">
                  {isEn 
                    ? `No matching movies found for "${searchQuery}" under criteria. Try resetting filters.` 
                    : `আপনার ফিল্টারিংয়ের সাথে মিল রয়েছে এমন কোনো মুভি খুঁজে পাওয়া যায়নি। দয়া করে ভিন্ন শব্দ ব্যবহার করুন।`}
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveLanguageFilter('all');
                  setActiveGenre('All');
                }}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-red-500 hover:bg-zinc-800"
              >
                {isEn ? 'Reset All Filters' : 'সকল ফিল্টার রিসেট করুন'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  language={language}
                  isWatchlisted={watchlistIds.includes(movie.id)}
                  onToggleWatchlist={(e) => {
                    e.stopPropagation();
                    handleToggleWatchlist(movie.id);
                  }}
                  onWatchNow={() => handleWatchNow(movie)}
                  onSelect={() => setSelectedMovie(movie)}
                />
              ))}
            </div>
          )}

        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer id="app-footer" className="border-t border-zinc-900 bg-[#0c0c0c] py-8 text-zinc-400">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-red-500 font-extrabold tracking-widest text-sm uppercase">CINE<span className="text-white">FLIX</span></span>
            <span className="text-xs text-zinc-700">|</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
              {isEn ? 'PREMIUM CINEMA EXPERIENCE' : 'সিনেম্যাটিক প্রিমিয়াম অভিজ্ঞতা'}
            </span>
          </div>

          <p className="text-[10px] text-zinc-500 leading-relaxed max-w-md mx-auto">
            {isEn 
              ? 'All streaming playback loops are simulation assets powered by licensing partners. No video or cookies are shared externally.' 
              : 'সকল ভিডিও অ্যাম্প্লিটিউড এবং প্লেব্যাক কার্যক্রম সিম্যুলেশন কোড দ্বারা পরিচালিত। কোনো ব্যক্তিগত তথ্য আদানপ্রদান করা হয় নি।'}
          </p>

          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            © {new Date().getFullYear()} CINEFLIX GLOBAL. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* FLOAT ACTION BUTTON: SCROLL BACK TO TOP */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 shadow-xl transition-all hover:bg-zinc-800 active:scale-90"
          title={isEn ? 'Scroll to Top' : 'উপরে যান'}
        >
          <ArrowUp className="h-5 w-5 text-red-500" />
        </button>
      )}

      {/* CONDITIONAL COMPONENT FLOATS */}

      {/* 1. Full Specs Movie Details Modal Drawer */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          language={language}
          onClose={() => setSelectedMovie(null)}
          onWatchNow={() => {
            handleWatchNow(selectedMovie);
            setSelectedMovie(null);
          }}
          isWatchlisted={watchlistIds.includes(selectedMovie.id)}
          onToggleWatchlist={() => handleToggleWatchlist(selectedMovie.id)}
          reviews={allReviews.filter((r) => r.movieId === selectedMovie.id)}
          onAddReview={(name, stars, comment) => handleAddNewReview(selectedMovie.id, name, stars, comment)}
          allMovies={MOVIES}
          onSelectRelatedMovie={(rel) => setSelectedMovie(rel)}
        />
      )}

      {/* 2. Custom Immersive Cinematic Theater Player Screen */}
      {activeStreamingMovie && (
        <CinemaPlayer
          movie={activeStreamingMovie}
          language={language}
          onClose={() => setActiveStreamingMovie(null)}
        />
      )}

      {/* 3. My Watchlist sliding panel side drawer */}
      {isWatchlistOpen && (
        <WatchlistPanel
          watchlist={watchlistMovies}
          language={language}
          onClose={() => setIsWatchlistOpen(false)}
          onRemove={(id) => handleToggleWatchlist(id)}
          onWatchNow={(mov) => {
            handleWatchNow(mov);
            setIsWatchlistOpen(false);
          }}
          onSelectMovie={(mov) => {
            setSelectedMovie(mov);
            setIsWatchlistOpen(false);
          }}
        />
      )}

    </div>
  );
}
