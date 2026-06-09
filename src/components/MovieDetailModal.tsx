import React from 'react';
import { X, Play, Star, Clock, User, Award, Flame, MessageSquare, Plus, Check } from 'lucide-react';
import { Movie, Review, LanguageMode } from '../types';

interface MovieDetailModalProps {
  movie: Movie;
  language: LanguageMode;
  onClose: () => void;
  onWatchNow: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
  reviews: Review[];
  onAddReview: (reviewerName: string, rating: number, comment: string) => void;
  allMovies: Movie[];
  onSelectRelatedMovie: (movie: Movie) => void;
}

export default function MovieDetailModal({
  movie,
  language,
  onClose,
  onWatchNow,
  isWatchlisted,
  onToggleWatchlist,
  reviews,
  onAddReview,
  allMovies,
  onSelectRelatedMovie,
}: MovieDetailModalProps) {
  const isEn = language === 'en';
  
  // Local state for adding reviews
  const [revName, setRevName] = React.useState('');
  const [revRating, setRevRating] = React.useState(5);
  const [revComment, setRevComment] = React.useState('');
  const [formMsg, setFormMsg] = React.useState('');

  const displayTitle = isEn ? movie.title : movie.titleBn;
  const displayGenres = isEn ? movie.genres : movie.genresBn;
  const displayDirector = isEn ? movie.director : movie.directorBn;
  const displayDesc = isEn ? movie.description : movie.descriptionBn;

  // Filter out current movie to search similar movies
  const relatedMovies = allMovies
    .filter((m) => m.id !== movie.id && (m.language === movie.language || m.genres.some(g => movie.genres.includes(g))))
    .slice(0, 3);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) {
      setFormMsg(isEn ? 'Please fill out all fields.' : 'দয়া করে সবগুলো ফিল্ড পূরণ করুন।');
      return;
    }
    onAddReview(revName, revRating, revComment);
    setRevName('');
    setRevComment('');
    setFormMsg(isEn ? 'Review added securely!' : 'মতামতটি সফলভাবে যুক্ত হয়েছে!');
    setTimeout(() => setFormMsg(''), 3000);
  };

  return (
    <div
      id="movie-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4 overflow-y-auto backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        id="movie-detail-modal"
        className="relative my-8 w-full max-w-4xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 text-white shadow-2xl focus:outline-none"
      >
        {/* Absolute header buttons */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950/80 border border-zinc-800 text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Backdrop Banner Header Image */}
        <div className="relative aspect-[21/9] w-full bg-zinc-950 overflow-hidden sm:aspect-[24/10]">
          <img
            src={movie.bannerUrl}
            alt={displayTitle}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 flex flex-col justify-end gap-1 sm:bottom-6 sm:left-8 sm:right-8">
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase">
              <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] text-white">
                {movie.language.toUpperCase()}
              </span>
              {displayGenres.map((g, idx) => (
                <span key={idx} className="rounded bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-300 backdrop-blur-xs border border-zinc-700/30">
                  {g}
                </span>
              ))}
            </div>
            
            <h2 className="font-heading text-xl font-extrabold tracking-tight md:text-3xl lg:text-4xl">
              {displayTitle}
            </h2>
            
            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="text-xs italic text-zinc-400 sm:text-sm">
                (Original: {movie.originalTitle})
              </p>
            )}
          </div>
        </div>

        {/* Modal Columns Grid */}
        <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 md:grid-cols-3">
          
          {/* Column 1 & 2: Main Info & Interactive Reviews */}
          <div className="space-y-6 md:col-span-2">
            
            {/* Action buttons and meta tag specs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-400">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-white">{movie.rating.toFixed(1)}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span>{movie.duration}</span>
                </div>
                <span>{movie.year}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Watchlist toggle */}
                <button
                  onClick={onToggleWatchlist}
                  className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-all active:scale-95 ${
                    isWatchlisted
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800'
                  }`}
                >
                  {isWatchlisted ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{isEn ? 'Watchlisted' : 'ওয়াচলিস্টেড'}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>{isEn ? 'Add Watchlist' : 'ওয়াচলিস্টে রাখুন'}</span>
                    </>
                  )}
                </button>

                {/* Main Watch Now */}
                <button
                  onClick={onWatchNow}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 active:scale-95"
                >
                  <Play className="h-4 w-4 fill-white text-white" />
                  <span>{isEn ? 'Watch Now' : 'এখন দেখুন'}</span>
                </button>
              </div>
            </div>

            {/* Synopsis Section */}
            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-red-500" />
                <span>{isEn ? 'Synopsis' : 'কাহিনী সংক্ষেপ'}</span>
              </h3>
              <p className="text-sm leading-relaxed text-zinc-300">
                {displayDesc}
              </p>
            </div>

            {/* Specs & Features tags */}
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/30 p-4">
              <h4 className="mb-2.5 text-xs font-semibold tracking-wide uppercase text-zinc-400">
                {isEn ? 'Audio & Video Capabilities' : 'অডিও এবং ভিডিও ফিচারসমূহ'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {movie.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs font-mono font-medium text-zinc-300"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* PERSISTENT REVIEW LISTING */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <MessageSquare className="h-4.5 w-4.5 text-red-500" />
                <span>{isEn ? `Member Reviews (${reviews.length})` : `দর্শকদের মতামত (${reviews.length})`}</span>
              </h3>

              {/* Add Custom User Review Form */}
              <form onSubmit={handleSubmitReview} className="rounded-2xl border border-zinc-800/80 bg-zinc-950/20 p-4 space-y-3">
                <h4 className="text-xs font-bold text-zinc-300">
                  {isEn ? 'Share Your Verdict' : 'আপনার মতামত দিন'}
                </h4>
                
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-medium mb-1">
                      {isEn ? 'Your Name' : 'আপনার নাম'}
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder={isEn ? "E.g. Joy" : "যেমন: জয়"}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-medium mb-1">
                      {isEn ? 'Rating (Stars)' : 'রেটিং (তারকা)'}
                    </label>
                    <select
                      value={revRating}
                      onChange={(e) => setRevRating(Number(e.target.value))}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-2 py-1.5 text-xs text-white focus:border-red-500 outline-none"
                    >
                      {[5,4,3,2,1].map((r) => (
                        <option key={r} value={r}>
                          {'★'.repeat(r) + '☆'.repeat(5-r)} ({r})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-medium mb-1">
                    {isEn ? 'Review Comment' : 'মন্তব্য'}
                  </label>
                  <textarea
                    rows={2}
                    maxLength={150}
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder={isEn ? "Write your comment here..." : "এখানে আপনার মন্তব্য লিখুন..."}
                    className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {formMsg && (
                    <span className="text-xs font-semibold text-emerald-400">
                      {formMsg}
                    </span>
                  )}
                  <button
                    type="submit"
                    className="ml-auto rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:bg-red-500"
                  >
                    {isEn ? 'Submit Review' : 'রিভিউ সাবমিট করুন'}
                  </button>
                </div>
              </form>

              {/* Feed of Reviews */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {reviews.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">
                    {isEn ? 'No reviews yet. Be the first!' : 'এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম মন্তব্যটি আপনি করুন!'}
                  </p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{r.reviewerName}</span>
                        <div className="flex items-center text-amber-400">
                          {'★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{r.comment}</p>
                      <span className="mt-1 block text-[9px] text-zinc-500">
                        {r.createdAt}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Column 3: Director, Cast, & Related Recommendations */}
          <div className="space-y-6 md:border-l md:border-zinc-800 md:pl-6">
            
            {/* Director Details */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1">
                <Award className="h-4 w-4 text-red-500" />
                <span>{isEn ? 'Director' : 'পরিচালক'}</span>
              </h3>
              <p className="text-sm font-semibold text-white">
                {displayDirector}
              </p>
            </div>

            {/* Cast list */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1">
                <User className="h-4 w-4 text-red-500" />
                <span>{isEn ? 'Star Cast' : 'অভিনয়শিল্পীবৃন্দ'}</span>
              </h3>
              <div className="grid grid-cols-1 gap-1.5 font-sans">
                {movie.cast.map((actor, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-zinc-300">
                    <span className="h-1 w-1 rounded-full bg-red-600" />
                    <span>{actor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RELATED MOVIES LISTING */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <h3 className="text-xs font-semibold tracking-wide uppercase text-zinc-400">
                {isEn ? 'You May Also Like' : 'অনুরূপ পছন্দসমূহ'}
              </h3>
              <div className="space-y-3">
                {relatedMovies.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelatedMovie(rel)}
                    className="group flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800/30 bg-zinc-950/30 p-2 transition-all hover:bg-zinc-800/50"
                  >
                    <img
                      src={rel.posterUrl}
                      alt={isEn ? rel.title : rel.titleBn}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-xs font-bold text-white group-hover:text-red-500">
                        {isEn ? rel.title : rel.titleBn}
                      </h4>
                      <p className="text-[10px] text-zinc-500">
                        {rel.year} • {rel.rating.toFixed(1)} ★
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
