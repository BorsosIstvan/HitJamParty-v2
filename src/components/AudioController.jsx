import { useState, useEffect } from 'react';

/**
 * AudioController - HitJam Party 100% vonalas lejátszó.
 * Teljesen emoji-mentes formák, tiszta Tailwind/CSS-ből rajzolva.
 */
function AudioController({ audioRef, isReallyPlaying }) {
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const updateProgress = () => {
      const pct = (audio.currentTime / audio.duration) * 100;
      setProgress(pct || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, [audioRef, isReallyPlaying]);

  const handleMuteToggle = () => {
    if (audioRef?.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handlePlayPauseToggle = () => {
    if (audioRef?.current) {
      if (isReallyPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error(err));
      }
    }
  };

  return (
    <div className="w-full flex items-center justify-between gap-5 py-3 px-2 mb-5 animate-fade-in select-none bg-slate-900/40 rounded-xl border border-slate-800/60">
      
      {/* 1. BAL SZÉL: PLAY / PAUSE FORMÁK (Tiszta vonalas rajz) */}
      <button
        onClick={handlePlayPauseToggle}
        className="w-8 h-8 flex items-center justify-center transition cursor-pointer select-none outline-none border-none bg-transparent group"
      >
        {isReallyPlaying ? (
          /* PAUSE: Két vékony narancs téglalap vonal egymás mellett */
          <div className="flex gap-1.5 justify-center items-center h-5 w-5 group-active:scale-90 transition">
            <div className="w-1.5 h-5 bg-orange-500 rounded-full"></div>
            <div className="w-1.5 h-5 bg-orange-500 rounded-full"></div>
          </div>
        ) : (
          /* PLAY: Szuper letisztult, vékony narancs háromszög vonal */
          <div 
            className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-orange-500 ml-1 group-active:scale-90 transition"
          ></div>
        )}
      </button>

      {/* 2. KÖZÉP: HAJSZÁLVÉKONY LÁNGOLÓ PROGRESSBAR */}
      <div className="flex-1 h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800/40 relative">
        <div
          className="h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-100 ease-linear rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* 3. JOBB SZÉL: VONALAS HANGSZÓRÓ (25%-kal felnagyítva a tökéletes egyensúlyért) */}
      <button
        onClick={handleMuteToggle}
        className="w-8 h-8 flex items-center justify-center transition cursor-pointer select-none outline-none border-none bg-transparent group"
      >
        {/* FIX: scale-125 -> Ez nagyítja fel a teljes ikont egységesen! */}
        <div className="relative flex items-center justify-center h-5 w-6 group-active:scale-90 transition transform scale-125">
          {/* A hangszóró tölcsér alapja */}
          <div className={`w-1.5 h-2 rounded-xs ${isMuted ? 'bg-rose-500' : 'bg-orange-500'}`}></div>
          {/* A hangszóró kiszélesedő része */}
          <div 
            className={`w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent -ml-0.5 ${
              isMuted 
                ? 'border-r-[8px] border-r-rose-500' 
                : 'border-r-[8px] border-r-orange-500'
            }`}
          ></div>
          
          {/* HANGHULLÁMOK / NÉMÍTÁS JELZÉS */}
          {isMuted ? (
            <div className="text-rose-500 font-black text-xs ml-1 select-none opacity-80">×</div>
          ) : (
            <div className="flex items-center ml-0.5 gap-0.5">
              <div className="w-1 h-2.5 border-r-2 border-orange-500 rounded-full opacity-70"></div>
              <div className="w-1 h-4 border-r-2 border-orange-500 rounded-full opacity-90"></div>
            </div>
          )}
        </div>
      </button>
      
    </div>
  );
}

export default AudioController;
