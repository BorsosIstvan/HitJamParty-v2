import { useState } from 'react';
import { keresniTunes } from './itunesService';
import { SONGS_DATA } from './songsData';
import QuizButtons from './QuizButtons';

function App() {
  // --- JÁTÉK ÁLLAPOTOK ---
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // --- ÚJ: PONTOK ÉS ÉLETEK ÁLLAPOTA ---
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  // Új dal indítása / Sorsolás
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
      setStatus("Válaszd ki a helyes évszámot!");
      setAudioUrl(eredmeny.previewUrl);
    } else {
      setStatus(`Hiba: ${eredmeny.error} Próbáld újra!`);
    }
  };

  // Tipp ellenőrzése és pontozás
  const handleValaszEllenorzes = (tippeltEv) => {
    if (!currentSong || isRevealed || isGameOver) return;

    setIsRevealed(true);

    if (tippeltEv === currentSong.year) {
      setScore((prevScore) => prevScore + 10); // +10 pont
      setStatus(`🎉 HELYES! A dal valóban ${currentSong.year}-ben jelent meg.`);
    } else {
      const UjEletekSzama = lives - 1;
      setLives(UjEletekSzama); // -1 élet
      
      if (UjEletekSzama <= 0) {
        setIsGameOver(true);
        setStatus(`💀 JÁTÉK VÉGE! Elfogytak az életeid. A helyes év ${currentSong.year} lett volna.`);
      } else {
        setStatus(`❌ HELYTELEN! Te ${tippeltEv}-re tippeltél, de a helyes év: ${currentSong.year}.`);
      }
    }
  };

  // Játék újraindítása (Reset)
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      
      {/* CÍMSOR */}
      <h1 className="text-4xl font-extrabold tracking-tight text-emerald-400 mb-2">
        HitJamParty <span className="text-sm font-normal text-slate-400">v2.0</span>
      </h1>
      <p className="text-slate-400 mb-6 text-center max-w-md text-sm">
        Találd ki a felcsendülő dal évszámát, és építsd fel a saját zenei idővonaladat!
      </p>

      {/* JÁTÉKOS STATISZTIKA (Pontok és Életek) */}
      <div className="flex justify-between w-full max-w-sm px-4 mb-4 text-sm font-semibold">
        <div className="bg-slate-800 border border-slate-700 py-1.5 px-4 rounded-full flex items-center gap-2">
          <span>⭐ Pontszám:</span>
          <span className="text-emerald-400 font-bold text-base">{score}</span>
        </div>
        <div className="bg-slate-800 border border-slate-700 py-1.5 px-4 rounded-full flex items-center gap-1.5">
          <span>Életek:</span>
          <span className="text-rose-500 text-base font-bold">
            {"❤️".repeat(Math.max(0, lives)) || "💔"}
          </span>
        </div>
      </div>

      {/* JÁTÉK KÁRTYA */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-sm border border-slate-700 text-center">
        
        {/* AKTUÁLIS FELADAT */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {isGameOver ? "Végeredmény" : "Aktuális feladat"}
          </p>
          <p className="text-lg font-bold text-slate-200 mt-1">
            {isGameOver 
              ? `Összesen szerzett pont: ${score}`
              : (currentSong 
                  ? (isRevealed ? `${currentSong.artist} - ${currentSong.title}` : "??? - ???")
                  : "Nyomj a gombra az indításhoz!")
            }
          </p>
        </div>

        {/* REJTETT AUDIO LEJÁTSZÓ */}
        {audioUrl && !isGameOver && (
          <audio src={audioUrl} autoPlay controls className="w-full mb-4 rounded-lg bg-slate-700" />
        )}

        {/* ÁLLAPOT / VISSZAJELZÉS DOBOZ */}
        {status && (
          <p className={`text-sm p-2 rounded-lg mb-4 border ${
            status.includes("🎉") 
              ? "text-emerald-300 bg-emerald-950/30 border-emerald-800/50" 
              : status.includes("❌") || status.includes("💀")
                ? "text-rose-300 bg-rose-950/30 border-rose-800/50"
                : "text-blue-300 bg-blue-950/30 border-blue-800/50"
          }`}>
            {status}
          </p>
        )}

        {/* JÁTÉK VÉGE KÉPERNYŐ GOMBJA */}
        {isGameOver ? (
          <button
            onClick={handleUjrainditas}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl transition duration-200 transform active:scale-95 shadow-lg shadow-rose-500/20"
          >
            Új játék indítása 🔄
          </button>
        ) : (
          /* FŐ AKCIÓ GOMBOK (Indítás / Következő) */
          (!currentSong || isRevealed) && (
            <button
              onClick={handleZeneInditas}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold py-3 px-6 rounded-xl transition duration-200 transform active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              {loading ? "Betöltés..." : (isRevealed ? "Következő dal!" : "Zene indítása!")}
            </button>
          )
        )}

        {/* KVÍZGOMBOK KOMPONENS */}
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
