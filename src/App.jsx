import { useState, useRef, useEffect } from 'react';
import { keresniTunes } from './itunesService';
import CdRecord from './components/CdRecord';
import PrimaryButton from './components/PrimaryButton';
import QuizButtons from './QuizButtons';

function App() {
  // --- JÁTÉK ÁLLAPOTOK ---
  const [albums, setAlbums] = useState([]); // Itt tároljuk a 3 lemez adatait a JSON-ből
  const [selectedAlbum, setSelectedAlbum] = useState(null); // Az aktuálisan kiválasztott CD objektum
  
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  const audioRef = useRef(null);
  const [isReallyPlaying, setIsReallyPlaying] = useState(false);

  // 1. ASZINKRON KÉZIKÖNYV: Betöltjük a JSON fájlt, amikor elindul az app
  useEffect(() => {
    fetch('data/albums.json')
      .then((res) => res.json())
      .then((data) => {
        setAlbums(data);
        setSelectedAlbum(data[0]); // Alapértelmezetten a legelső Retro CD-t tesszük be
      })
      .catch((err) => console.error("Hiba a JSON betöltésekor:", err));
  }, []);

  // 2. LEMEZCSERE UTASÍTÁS
  const handleAlbumCsere = (albumId) => {
    const megtalaltAlbum = albums.find(a => a.id === albumId);
    if (megtalaltAlbum) {
      setSelectedAlbum(megtalaltAlbum);
      handleUjrainditas(); // Lemezcserénél lenullázzuk a pontokat és életeket a tiszta kezdéshez
      setStatus(`Lemez kicserélve: ${megtalaltAlbum.title}`);
    }
  };

  const handleZeneInditas = async () => {
    if (!selectedAlbum) return;
    
    setLoading(true);
    setStatus("Új dal sorsolása a lemezről...");
    setAudioUrl("");
    setCurrentSong(null);
    setIsRevealed(false);
    setIsReallyPlaying(false);

    // 3. SORSOLÁS: Most már Szigorúan a kiválasztott CD dalaiból választunk!
    const dalok = selectedAlbum.songs;
    const veletlenIndex = Math.floor(Math.random() * dalok.length);
    const kivalasztottDal = dalok[veletlenIndex];

    const eredmeny = await keresniTunes(kivalasztottDal.artist, kivalasztottDal.title);
    setLoading(false);

    if (eredmeny.success) {
      setCurrentSong(kivalasztottDal);
      setStatus("Melyik évben jelent meg?");
      setAudioUrl(eredmeny.previewUrl);
    } else {
      setStatus(`Hiba: ${eredmeny.error}. Próbáld újra!`);
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
        if (audioRef.current) audioRef.current.pause();
        setIsReallyPlaying(false);
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
    setIsReallyPlaying(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 select-none">
      <h1 className="text-3xl font-black text-orange-500 mb-2 tracking-tight">
        HitJamParty <span className="text-sm font-normal text-slate-500">v2.0</span>
      </h1>

      {/* 4. PROFI LEMEZCSERÉLŐ FELÜLET */}
      {albums.length > 0 && (
        <div className="mb-4 bg-slate-800 p-2 rounded-2xl border border-slate-700 flex gap-1 text-xs font-bold max-w-sm w-full justify-around shadow-md">
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => handleAlbumCsere(album.id)}
              className={`py-2 px-3 rounded-xl transition duration-150 cursor-pointer ${
                selectedAlbum?.id === album.id
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {album.title.split(' ')[0]} {/* Csak az első szót írjuk ki, hogy elférjen mobilon */}
            </button>
          ))}
        </div>
      )}

      {/* STATISZTIKA */}
      <div className="flex justify-between w-full max-w-sm px-2 mb-4 text-base font-bold">
        <div className="bg-slate-800 border border-slate-700 py-2 px-5 rounded-full shadow-md">
          ⭐ <span className="text-orange-400">{score}</span>
        </div>
        <div className="bg-slate-800 border border-slate-700 py-2 px-5 rounded-full shadow-md">
          <span className="text-rose-500">{"❤️".repeat(Math.max(0, lives)) || "💔"}</span>
        </div>
      </div>

      {/* JÁTÉK KÁRTYA */}
      <div className="bg-slate-800 p-6 rounded-3xl shadow-2xl w-full max-w-sm border-2 border-slate-700 text-center">
        <div className="mb-4 min-h-[80px] flex flex-col justify-center">
          {isGameOver ? (
            <p className="text-2xl font-black text-rose-500">Játék Vége!</p>
          ) : (
            currentSong ? (
              isRevealed ? (
                <div className="animate-fade-in">
                  <p className="text-xl font-black text-slate-100">{currentSong.artist}</p>
                  <p className="text-base text-slate-400 italic mt-1">"{currentSong.title}"</p>
                </div>
              ) : (
                <p className="text-4xl font-black tracking-widest text-orange-500">???</p>
              )
            ) : (
              <div>
                <p className="text-lg font-bold text-slate-200">{selectedAlbum?.title}</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[250px] mx-auto">{selectedAlbum?.description}</p>
              </div>
            )
          )}
        </div>

        {/* A CD-re átadjuk a kiválasztott album egyedi borítóját is! */}
        <CdRecord isPlaying={isReallyPlaying} coverUrl={selectedAlbum?.cover} />

        {audioUrl && !isGameOver && (
          <audio 
            ref={audioRef}
            src={audioUrl} 
            autoPlay 
            controls 
            onPlay={() => setIsReallyPlaying(true)}
            onPause={() => setIsReallyPlaying(false)}
            onEnded={() => setIsReallyPlaying(false)}
            className="w-full mb-6 rounded-xl bg-slate-700 h-10" 
          />
        )}

        {status && (
          <p className={`text-lg font-extrabold p-3 rounded-xl mb-6 border-2 shadow-inner ${
            status.includes("🎉") 
              ? "text-orange-400 bg-orange-950/40 border-orange-500/30" 
              : status.includes("❌") || status.includes("💀")
                ? "text-rose-400 bg-rose-950/40 border-rose-500/30"
                : "text-blue-400 bg-blue-950/40 border-blue-500/30"
          }`}>
            {status}
          </p>
        )}

        {isGameOver ? (
          <PrimaryButton onClick={handleUjrainditas}>Új játék indítása 🔄</PrimaryButton>
        ) : (
          (!currentSong || isRevealed) && (
            <PrimaryButton onClick={handleZeneInditas} loading={loading}>
              {isRevealed ? "Következő dal! ➡️" : "Zene indítása! 🎵"}
            </PrimaryButton>
          )
        )}

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
