import React from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Monitor, Maximize2, Settings, Subtitles, HelpCircle, X } from 'lucide-react';
import { Movie, LanguageMode } from '../types';

interface CinemaPlayerProps {
  movie: Movie;
  language: LanguageMode;
  onClose: () => void;
}

export default function CinemaPlayer({ movie, language, onClose }: CinemaPlayerProps) {
  const isEn = language === 'en';
  
  // Player state variables
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(180); // 3 minutes total for mock preview loop
  const [volume, setVolume] = React.useState(75);
  const [isMuted, setIsMuted] = React.useState(false);
  const [resolution, setResolution] = React.useState('1080p');
  const [isCinemaMode, setIsCinemaMode] = React.useState(false);
  const [subtitleMode, setSubtitleMode] = React.useState<'en' | 'bn' | 'off'>(language);
  const [audioTrack, setAudioTrack] = React.useState<'original' | 'dubbed'>('original');
  const [isBuffering, setIsBuffering] = React.useState(false);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Subtitle cue list based on current play percentage
  const subtitleCues = [
    { start: 0, end: 10, bn: '[আবহ সঙ্গীত বাজছে]', en: '[Ambient opening score playing]' },
    { start: 10, end: 25, bn: `বর্ণনাকারী: প্রতিটি কাহিনীর পেছনে লুকিয়ে থাকে এক গোপন সত্য...`, en: `Narrator: Behind every great story lies a hidden truth...` },
    { start: 25, end: 45, bn: `রানু: তুমি কি কখনো শেষ প্রান্তে দাঁড়িয়ে অসীম শূন্যতা দেখেছ?`, en: `Ranu: Have you ever stood at the edge and looked into the infinite?` },
    { start: 45, end: 65, bn: `সোনাই: গভীর সাগরের হাওয়া আমাদের নিয়তি বদলে দেবে।`, en: `Sonai: The wind of the deep sea will change our destiny forever.` },
    { start: 65, end: 85, bn: `আয়না: আমি যা নই, আমাকে সেই রূপ ধারণ করতে বাধ্য করা হয়েছে।`, en: `Ayna: I have been forced to play roles that aren't mine.` },
    { start: 85, end: 105, bn: `র‌্যাঞ্চো: জীবনের পেছনে ছুটো না, চমৎকার কাজের দক্ষতা অর্জন করো!`, en: `Rancho: Don't run behind success, achieve excellence and success will follow.` },
    { start: 105, end: 130, bn: `পল: আমি এই মরুভূমির সুরকে নিজের মাঝে অনুভব করতে পারছি।`, en: `Paul: I can feel the voice of the desert humming in my soul.` },
    { start: 130, end: 155, bn: `জোকার: পৃথিবীটা এত জটিল কেন? চলো মুখে একটু হাসি ফুটিয়ে তুলি!`, en: `Joker: Why so serious? Let's put a smile on that face!` },
    { start: 155, end: 180, bn: '[মনোরম সমাপ্তি ব্যাকগ্রাউন্ড স্কোর খেলছে]', en: '[Cinematic ending crescendo playing]' },
  ];

  // Sync state when HTML5 video updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 180);
    }
  };

  // Toggle play states
  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Skip/Rewind handler
  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  // Progress Seek Scrubber
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Adjust volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v / 100;
      videoRef.current.muted = v === 0;
    }
    setIsMuted(v === 0);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (videoRef.current) {
      const targetMute = !isMuted;
      setIsMuted(targetMute);
      videoRef.current.muted = targetMute;
    }
  };

  // Watch for play triggers
  React.useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Auto-play might be blocked, fall back gracefully
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Simulate temporary buffering quality resolution swap
  const changeResolution = (res: string) => {
    setIsBuffering(true);
    setResolution(res);
    setTimeout(() => {
      setIsBuffering(false);
    }, 900);
  };

  // Format Time representation
  const formatTimeMinutes = (timeS: number) => {
    const mins = Math.floor(timeS / 60);
    const secs = Math.floor(timeS % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Retrieve current active subtitle line
  const activeSub = subtitleCues.find(cue => currentTime >= cue.start && currentTime <= cue.end);

  return (
    <div
      id="cinema-theater-frame"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 p-4 transition-all duration-300 ${
        isCinemaMode ? 'bg-black' : 'bg-zinc-950/98'
      }`}
    >
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        {/* Help label */}
        <span className="hidden text-xs text-zinc-500 md:block">
          {isEn ? 'Press ESC or Click X to exit Theater' : 'থিয়েটার থেকে বের হতে X চাপুন'}
        </span>
        
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white"
          title={isEn ? 'Exit Theater' : 'বন্ধ করুন'}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="w-full max-w-5xl space-y-4">
        {/* Cinematic Title Banner */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
              {isEn ? 'Auditorium Stream Beta' : 'লাইভ অডিটোরিয়াম স্ট্রিমিং'}
            </span>
            <h2 className="text-lg font-extrabold text-white sm:text-xl">
              {isEn ? movie.title : movie.titleBn}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-medium text-zinc-400 uppercase">
              {resolution} • {audioTrack === 'original' ? (isEn ? 'Original' : 'অরিজিনাল') : (isEn ? 'Dual Audio' : 'ডাবড')}
            </span>
          </div>
        </div>

        {/* Ambient projection glow and core movie stage panel */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl shadow-red-950/10">
          
          {/* Main Video Stream */}
          <video
            ref={videoRef}
            src={movie.videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            loop
            muted={isMuted}
            className="h-full w-full object-cover"
            playsInline
          />

          {/* Buffering Screen Overlay */}
          {isBuffering && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xs">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600/20 border-t-red-600" />
              <span className="mt-3 text-xs font-semibold text-zinc-400">
                {isEn ? 'Adjusting streaming bandwidth...' : 'ব্যান্ডউইথ লোড করা হচ্ছে...'}
              </span>
            </div>
          )}

          {/* Dim Ambient Theater Indicator when not overlaying */}
          {!isPlaying && !isBuffering && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-3xs transition-all">
              <button
                onClick={handleTogglePlay}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 font-bold text-white shadow-xl shadow-red-600/30 transition-all hover:scale-105 hover:bg-red-500 active:scale-95"
              >
                <Play className="h-8 w-8 fill-white translate-x-0.5" />
              </button>
              <span className="mt-4 text-sm font-semibold text-zinc-300">
                {isEn ? 'Click to Resume Cinema' : 'সিনেমা চালু করতে ক্লিক করুন'}
              </span>
            </div>
          )}

          {/* Subtitle Cue Overlay panel */}
          {subtitleMode !== 'off' && activeSub && (
            <div className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2 text-center pointer-events-none w-11/12 max-w-xl">
              <span className="rounded-md bg-black/80 px-4 py-1.5 text-xs font-medium text-white shadow-md border border-zinc-800/50 md:text-sm">
                {subtitleMode === 'en' ? activeSub.en : activeSub.bn}
              </span>
            </div>
          )}

        </div>

        {/* Cinematic Dashboard Custom Controller Panel */}
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/60 p-4 backdrop-blur-md">
          
          {/* Playback timeline slider scrubber */}
          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400">
              {formatTimeMinutes(currentTime)}
            </span>
            <input
              id="progress-scrubber"
              type="range"
              min={0}
              max={duration || 180}
              step={0.1}
              value={currentTime}
              onChange={handleProgressChange}
              className="h-1 flex-1 cursor-pointer appearance-none rounded bg-zinc-800 accent-red-600 outline-none transition-all focus:accent-red-500 focus:outline-none"
            />
            <span className="text-xs font-mono text-zinc-400">
              {formatTimeMinutes(duration)}
            </span>
          </div>

          {/* Operational button triggers */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              {/* Play Pause button */}
              <button
                onClick={handleTogglePlay}
                className="text-white hover:text-red-500 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white" />}
              </button>

              {/* Rewind */}
              <button
                onClick={handleRewind}
                className="text-zinc-400 hover:text-white transition-colors"
                title={isEn ? "Rewind 10s" : "১০ সেকেন্ড পিছিয়ে নিন"}
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Volume sliders */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMute}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <input
                  id="volume-scrubber"
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 appearance-none bg-zinc-800 rounded accent-red-600 outline-none sm:w-20"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              
              {/* Language Audio Track Selector */}
              <select
                id="audio-track-selector"
                value={audioTrack}
                onChange={(e) => setAudioTrack(e.target.value as 'original' | 'dubbed')}
                className="rounded border border-zinc-800 bg-zinc-950 px-2 py-1 text-[11px] font-medium text-zinc-300 focus:border-red-500 focus:outline-none cursor-pointer"
                title={isEn ? "Select Audio Language" : "অডিও ট্র্যাক নির্বাচন"}
              >
                <option value="original">
                  {isEn ? "Original Audio Track" : "মূল অডিও চ্যানেল"}
                </option>
                <option value="dubbed">
                  {movie.language === 'english' 
                    ? (isEn ? "Bangla Dub (Stereo)" : "বাংলা ডাবিং (Dual Stereo)")
                    : (isEn ? "English Subs Track" : "ইংরেজি সাব-ট্র্যাক")
                  }
                </option>
              </select>

              {/* Subtitles Overlay state selector */}
              <button
                onClick={() => setSubtitleMode(subtitleMode === 'en' ? 'bn' : subtitleMode === 'bn' ? 'off' : 'en')}
                className={`flex items-center gap-1.5 rounded border px-2.5 py-1 text-[11px] font-medium transition-all ${
                  subtitleMode !== 'off'
                    ? 'border-red-500/40 bg-red-500/10 text-red-400'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900'
                }`}
                title={isEn ? "Subtitle Options" : "সাবটাইটেল পরিবর্তন"}
              >
                <Subtitles className="h-3.5 w-3.5" />
                <span className="uppercase">{subtitleMode === 'off' ? 'Off' : subtitleMode}</span>
              </button>

              {/* Streaming Resolution bandwidth adjustments */}
              <div className="flex items-center gap-1.5">
                {['720p', '1080p', '4K'].map((res) => (
                  <button
                    key={res}
                    onClick={() => changeResolution(res)}
                    className={`rounded px-2 py-1 text-[10px] font-bold tracking-tight uppercase transition-all ${
                      resolution === res
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>

              {/* Dim Theatre Canvas Ambience controls */}
              <button
                onClick={() => setIsCinemaMode(!isCinemaMode)}
                className={`flex h-7 w-7 items-center justify-center rounded border transition-all ${
                  isCinemaMode
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900'
                }`}
                title={isCinemaMode ? (isEn ? 'Cinema Lights ON' : 'লাইট অন করুন') : (isEn ? 'Cinema Lights OFF (Ambiance)' : 'লাইট অফ করুন')}
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
