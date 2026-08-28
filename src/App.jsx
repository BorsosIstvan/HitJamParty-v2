import { useState, useRef, useEffect } from 'react';
import { keresniTunes } from './itunesService';
import CdRecord from './components/CdRecord';
import PrimaryButton from './components/PrimaryButton';
import QuizButtons from './QuizButtons';
import AuthForm from './components/AuthForm';
import HitJamStore from './components/HitJamStore';
import AudioController from './components/AudioController'; // ÚJ IMPORT
import { useRegisterSW } from 'virtual:pwa-register/react';

function App() {
  const PI_IP_CIM = "192.168.132.218"; // Pl. "192.168.1.50"
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({});

  const [currentTab, setCurrentTab] = useState("game");
  const [user, setUser] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);

  const [albums, setAlbums] = useState([]);
  const [ownedAlbums, setOwnedAlbums] = useState(["retro-party"]);
  const [activeAlbumIds, setActiveAlbumIds] = useState(["retro-party"]);

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  const audioRef = useRef(null);
  const [isReallyPlaying, setIsReallyPlaying] = useState(false);

  useEffect(() => {
    fetch('data/albums.json')
      .then((res) => res.json())
      .then((data) => setAlbums(data))
      .catch((err) => console.error("Hiba a JSON betöltésekor:", err));
  }, []);

  const mentesASzerverre = async (aktualisPont, aktualisCoin) => {
    if (!user) return;
    try {
      await fetch(`http://${PI_IP_CIM}/HitJamParty/save_score.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, score: aktualisPont, coins: aktualisCoin })
      });
    } catch (err) {
      console.error("Szerver mentési hiba:", err);
    }
  };

  const handleToggleAlbum = (albumId) => {
    setActiveAlbumIds((prevIds) => {
      if (prevIds.includes(albumId)) {
        if (prevIds.length === 1) return prevIds; 
        return prevIds.filter(id => id !== albumId);
      } else {
        return [...prevIds, albumId];
      }
    });
    handleUjrainditas();
  };

  const handleBuyAlbum = (albumId, price) => {
    if (coins >= price && !ownedAlbums.includes(albumId)) {
      const ujCoinEgyenleg = coins - price;
      setCoins(ujCoinEgyenleg);
      setOwnedAlbums((prev) => [...prev, albumId]);
      setActiveAlbumIds((prev) => [...prev, albumId]);
      mentesASzerverre(score, ujCoinEgyenleg);
    }
  };

  const handleZeneInditas = async () => {
    if (activeAlbumIds.length === 0) return;
    setLoading(true);
    setStatus("Új dal sorsolása...");
    setAudioUrl("");
    setCurrentSong(null);
    setIsRevealed(false);
    setIsReallyPlaying(false);

    let osszesKevertDal = [];
    albums.forEach(album => {
      if (activeAlbumIds.includes(album.id)) {
        osszesKevertDal = [...osszesKevertDal, ...album.songs];
      }
    });

    const veletlenIndex = Math.floor(Math.random() * osszesKevertDal.length);
    const kivalasztottDal = osszesKevertDal[veletlenIndex];

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
      const ujPontszam = score + 10;
      setScore(ujPontszam);
      if (ujPontszam % 100 === 0) {
        setCoins((prev) => prev + 1);
        setStatus(`🎉 HELYES! (${currentSong.year}) -> BÓNUSZ: +1 HJC! 🪙`);
      } else {
        setStatus(`🎉 HELYES! (${currentSong.year})`);
      }
    } else {
      const UjEletekSzama = lives - 1;
      setLives(UjEletekSzama);
      if (UjEletekSzama <= 0) {
        setIsGameOver(true);
        setStatus(`💀 JÁTÉK VÉGE! (Helyes év: ${currentSong.year})`);
        if (audioRef.current) audioRef.current.pause();
        setIsReallyPlaying(false);
        mentesASzerverre(score, coins);
      } else {
        setStatus(`❌ HELYTELEN! (Helyes év: ${currentSong.year})`);
      }
    }
  };

  const handleUjrainditas = () => {
    setIsGameOver(false);
    setCurrentSong(null);
    setAudioUrl("");
    setStatus("");
    setIsRevealed(false);
    setIsReallyPlaying(false);
    setLives(3);
  };

  const handleKijelentkezes = () => {
    setUser(null);
    setScore(0);
    setCoins(0);
    setCurrentTab("game");
    handleUjrainditas();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 select-none">
      
      {needRefresh && (
        <div className="fixed top-4 left-4 right-4 md:max-w-sm md:mx-auto bg-gradient-to-r from-rose-600 to-orange-600 p-4 rounded-2xl shadow-2xl z-50 text-center">
          <p className="font-black text-sm text-white mb-2">🔥 Új verzió érhető el!</p>
          <button onClick={() => updateServiceWorker(true)} className="bg-white text-slate-950 font-black text-xs py-2 px-4 rounded-xl">Frissítés 🔄</button>
        </div>
      )}

      <h1 className="text-3xl font-black text-orange-500 mb-2 tracking-tight">HitJamParty <span className="text-sm font-normal text-slate-500">v2.0</span></h1>

      {!user ? (
        <AuthForm onAuthSuccess={(username, s, c, owned, active) => { 
          setUser(username); 
          setScore(s); 
          setCoins(c);
          if(owned) setOwnedAlbums(owned);
          if(active) setActiveAlbumIds(active);
        }} />
      ) : (
        <div className="w-full max-w-sm flex flex-col items-center animate-fade-in">
          
          {/* JÁTÉKOS ADATOK CSÍK */}
          <div className="flex justify-between w-full px-2 mb-2 text-xs font-bold text-slate-400">
            <span>👤 <span className="text-orange-400">{user}</span></span>
            <button onClick={handleKijelentkezes} className="text-rose-400 font-black">Kijelentkezés 🚪</button>
          </div>

          {/* STATISZTIKA SÁV */}
          <div className="flex justify-between w-full mb-4 text-base font-bold gap-2">
            <div className="bg-slate-800 border border-slate-700 py-2 px-3 rounded-2xl shadow-md flex-1 text-center">⭐ <span className="text-orange-400">{score}</span></div>
            <div className="bg-slate-800 border border-slate-700 py-2 px-3 rounded-2xl shadow-md flex-1 text-center">🪙 <span className="text-yellow-400">{coins}</span></div>
            <div className="bg-slate-800 border border-slate-700 py-2 px-3 rounded-2xl shadow-md flex-1 text-center"><span className="text-rose-500">{"❤️".repeat(Math.max(0, lives)) || "💔"}</span></div>
          </div>

          {/* --- FIX HÁZ: EGYETLEN ÖSSZEFÜGGŐ TÉGLALAP --- */}
          <div className="bg-slate-800 p-5 rounded-3xl shadow-2xl w-full border-2 border-slate-700 text-center">
            
            {/* KÉPERNYŐVÁLTÓ FENT */}
            <div className="flex bg-slate-900 p-1 rounded-xl mb-5 border border-slate-700/60 text-sm font-black">
              <button onClick={() => setCurrentTab("game")} className={`flex-1 py-2 rounded-lg transition ${currentTab === "game" ? "bg-gradient-to-r from-brand-start to-brand-end text-white shadow" : "text-slate-400"}`}>🎮 Játék</button>
              <button onClick={() => setCurrentTab("store")} className={`flex-1 py-2 rounded-lg transition ${currentTab === "store" ? "bg-gradient-to-r from-brand-start to-brand-end text-white shadow" : "text-slate-400"}`}>🛒 Üzlet & Raktár</button>
            </div>

            {currentTab === "store" ? (
              <HitJamStore albums={albums} ownedAlbums={ownedAlbums} activeAlbumIds={activeAlbumIds} coins={coins} onToggleAlbum={handleToggleAlbum} onBuyAlbum={handleBuyAlbum} />
            ) : (
              <div>
                <div className="mb-4 min-h-[70px] flex flex-col justify-center">
                  {isGameOver ? (
                    <p className="text-2xl font-black text-rose-500">Játék Vége!</p>
                  ) : (
                    currentSong ? (
                      <div className="animate-fade-in">
                        <p className="text-xl font-black text-slate-100">{isRevealed ? currentSong.artist : "???"}</p>
                        <p className="text-base text-slate-400 italic mt-0.5">"{isRevealed ? currentSong.title : "???"}"</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-base font-bold text-slate-200">Aktív lemezek: {activeAlbumIds.length}</p>
                        <p className="text-xxs text-slate-400 mt-0.5 max-w-[220px] mx-auto">A gomb megnyomásával a bepipált lemezek szólnak!</p>
                      </div>
                    )
                  )}
                </div>

                <CdRecord isPlaying={isReallyPlaying} coverUrl={albums.find(a => activeAlbumIds.includes(a.id))?.cover} />

                {/* REJTETT AUDIO MOTOR (Nincs controls, teljesen láthatatlan) */}
                {audioUrl && !isGameOver && (
                  <audio ref={audioRef} src={audioUrl} autoPlay onPlay={() => setIsReallyPlaying(true)} onPause={() => setIsReallyPlaying(false)} onEnded={() => setIsReallyPlaying(false)} />
                )}

                {/* 🔊 PROFI HITJAM MINIMALISTA AUDIO CONTROLLER KOMPONENS */}
                {audioUrl && !isGameOver && (
                  <AudioController audioRef={audioRef} isReallyPlaying={isReallyPlaying} />
                )}

                {status && (
                  <p className={`text-base font-extrabold p-2.5 rounded-xl mb-5 border border-slate-600 shadow-inner ${status.includes("🎉") ? "text-orange-400 bg-orange-950/30" : status.includes("❌") || status.includes("💀") ? "text-rose-400 bg-rose-950/30" : "text-blue-400 bg-blue-950/30"}`}>{status}</p>
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
                  <QuizButtons correctYear={currentSong.year} onAnswerSubmit={handleValaszEllenorzes} />
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
