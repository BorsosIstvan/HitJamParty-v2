import { useState } from 'react';
import { keresniTunes } from './itunesService';
import { SONGS_DATA } from './songsData';
import QuizButtons from './QuizButtons';

function App() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleZeneInditas = async () => {
    setLoading(true);
    setStatus("Új dal sorsolása...");
    setAudioUrl("");
    setCurrentSong(null);
    setIsRevealed(false);

    const veletlenIndex = Math.floor(Math.random() * SONGS_DATA.length);
    const kivalasztottDal = SONGS_DATA[veletlenIndex];

    const eredmeny = await keresniTunes(kivalasztottDal.artist, kivalasztottDal.title);

    setLoading(false);

    if (eredmeny.success) {
      setCurrentSong(kivalasztottDal);
      setStatus("Melyik évben jelent meg?");
      setAudioUrl(eredmeny.previewUrl);
    } else {
      setStatus(`Hiba: ${eredmeny.error}`);
    }
  };

  const handleValaszEllenorzes = (tippeltEv) => {
    if (!currentSong || isRevealed || isGameOver) return;

    setIsRevealed(true);

    if (tippeltEv === currentSong.year) {
      setScore((prevScore) => prevScore + 10);
      setStatus(`🎉 HELYES! (${currentSong.year})`);
    } else {
      const UjEletekSzama = lives - 1;
      setLives(UjEletekSzama);
      
      if (UjEletekSzama <= 0) {
        setIsGameOver(true);
        setStatus(`💀 JÁTÉK VÉGE! (Helyes év: ${currentSong.year})`);
      } else {
        setStatus(`❌ HELYTELEN! (Helyes év: ${currentSong.year})`);
      }
    }
  };

  const handleUjrainditas = () => {
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setCurrentSong(null);
    setAudioUrl("");
    setStatus("");
    setIsRevealed(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 select-none">
      
      {/* CÍMSOR - Picit kisebb, hogy a játékterület nagyobb lehessen */}
      <h1 className="text-3xl font-black text-emerald-400 mb-4 tracking-tight">
        HitJamParty <span className="text-xs font-normal text-slate-500">v2.0</span>
      </h1>

      {/* JÁTÉKOS STATISZTIKA - text-base és vastagabb betűk */}
      <div className="flex justify-between w-full max-w-sm px-2 mb-4 text-base font-bold">
        <div className="bg-slate-800 border border-slate-700 py-2 px-5 rounded-full shadow-md">
          ⭐ <span className="text-emerald-400">{score}</span>
        </div>
        <div className="bg-slate-800 border border-slate-700 py-2 px-5 rounded-full shadow-md">
          <span className="text-rose-500">
            {"❤️".repeat(Math.max(0, lives)) || "💔"}
          </span>
        </div>
      </div>

      {/* JÁTÉK KÁRTYA */}
      <div className="bg-slate-800 p-6 rounded-3xl shadow-2xl w-full max-w-sm border-2 border-slate-700 text-center">
        
        {/* AKTUÁLIS FELADAT - text-2xl és text-3xl az óriási betűkhöz */}
        <div className="mb-6 min-h-[80px] flex flex-col justify-center">
          {isGameOver ? (
            <p className="text-2xl font-black text-rose-400">Játék Vége!</p>
          ) : (
            currentSong ? (
              isRevealed ? (
                <div className="animate-fade-in">
                  <p className="text-xl font-black text-slate-100">{currentSong.artist}</p>
                  <p className="text-base text-slate-400 italic mt-1">"{currentSong.title}"</p>
                </div>
              ) : (
                <p className="text-4xl font-black tracking-widest text-emerald-400">???</p>
              )
            ) : (
              <p className="text-lg font-bold text-slate-400">Készen állsz a játékra?</p>
            )
          )}
        </div>

        {audioUrl && !isGameOver && (
          <audio src={audioUrl} autoPlay controls className="w-full mb-6 rounded-xl bg-slate-700 h-10" />
        )}

        {/* ÁLLAPOT DOBOZ - text-lg (nagyobb visszajelzés) */}
        {status && (
          <p className={`text-lg font-extrabold p-3 rounded-xl mb-6 border-2 shadow-inner ${
            status.includes("🎉") 
              ? "text-emerald-400 bg-emerald-950/40 border-emerald-500/30" 
              : status.includes("❌") || status.includes("💀")
                ? "text-rose-400 bg-rose-950/40 border-rose-500/30"
                : "text-blue-400 bg-blue-950/40 border-blue-500/30"
          }`}>
            {status}
          </p>
        )}

        {/* FŐ AKCIÓ GOMBOK - Vastagabb és nagyobb szöveggel */}
        {isGameOver ? (
          <button
            onClick={handleUjrainditas}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xl py-4 px-6 rounded-2xl transition duration-200 transform active:scale-95 shadow-xl shadow-rose-500/20"
          >
            Új játék indítása 🔄
          </button>
        ) : (
          (!currentSong || isRevealed) && (
            <button
              onClick={handleZeneInditas}
              disabled={loading}
              className="w-full bg-emerald-400 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-black text-xl py-4 px-6 rounded-2xl transition duration-200 transform active:scale-95 shadow-xl shadow-emerald-400/20"
            >
              {loading ? "Betöltés..." : (isRevealed ? "Következő dal! ➡️" : "Zene indítása! 🎵")}
            </button>
          )
        )}

        {/* KVÍZGOMBOK */}
        {currentSong && !isRevealed && !isGameOver && (
          <QuizButtons 
            correctYear={currentSong.year} 
            onAnswerSubmit={handleValaszEllenorzes} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
