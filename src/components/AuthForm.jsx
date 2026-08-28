import { useState } from 'react';
import PrimaryButton from './PrimaryButton';

/**
 * AuthForm - HitJam Party ÉLES Login / Register felület.
 * Közvetlenül a Raspberry Pi SQLite/PHP backendjével kommunikál.
 */
function AuthForm({ onAuthSuccess }) {
  // CSERÉLD KI: Írd be ide a te Pi-d belső IP-címét (pl. 192.168.1.50)
  const PI_IP_CIM = "192.168.132.218"; 
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Minden mezőt ki kell tölteni!");
      return;
    }

    setError("");
    setSuccessMessage("");
    setLoading(false); // Átmenetileg kikapcsolva az async előtt
    setLoading(true);

    try {
      // PROFI FETCH: Elküldjük a POST csomagot a Pi HitJamParty mappájába
      const response = await fetch(`http://${PI_IP_CIM}/HitJamParty/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          action: isRegisterMode ? 'register' : 'login' // Megmondjuk a PHP-nak mit akarunk cmt
        })
      });

      if (!response.ok) {
        throw new Error("A szerver nem válaszol. Ellenőrizd a Pi kapcsolatot!");
      }

      const data = await response.json();

      setLoading(false);

      if (data.success) {
        if (isRegisterMode) {
          // Ha sikeres regisztráció volt, kiírjuk az üzenetet és átváltunk login módra
          setSuccessMessage("🎉 Sikeres regisztráció! Most már beléphetsz a jelszavaddal.");
          setIsRegisterMode(false);
          setPassword("");
        } else {
          // Ha sikeres belépés volt, átadjuk a felhasználó adatait az App.jsx-nek
          onAuthSuccess(data.username, data.score, data.coins, data.ownedAlbums, data.activeAlbumIds);
        }
      } else {
        setError(data.error); // Ha a PHP hibát dobott (pl. rossz jelszó), kiírjuk
      }

    } catch (err) {
      console.error("Hálózati hiba:", err);
      setLoading(false);
      setError("Nem sikerült elérni a Raspberry Pi-t. Be van kapcsolva?");
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-3xl shadow-2xl w-full max-w-sm border-2 border-slate-700 text-center animate-fade-in">
      <h2 className="text-2xl font-black text-slate-100 mb-2">
        {isRegisterMode ? "Új fiók létrehozása 📝" : "Üdvözlünk a buliban! 👋"}
      </h2>
      <p className="text-xs text-slate-400 mb-6">
        {isRegisterMode 
          ? "Regisztrálj, hogy gyűjthesd a HitJamCoin-okat!" 
          : "Lépj be a mentett lemezeid eléréséhez!"}
      </p>

      {/* HIBA ÜZENET DOBOZ */}
      {error && (
        <p className="text-sm font-bold p-2 bg-rose-950/40 border border-rose-500/30 text-rose-400 rounded-xl mb-4">
          ⚠️ {error}
        </p>
      )}

      {/* SIKER ÜZENET DOBOZ */}
      {successMessage && (
        <p className="text-sm font-bold p-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-xl mb-4">
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider pl-1">Felhasználónév</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            placeholder="Pl. poci"
            className="w-full bg-slate-900 border-2 border-slate-600 focus:border-orange-500 text-white font-bold text-xl p-3.5 rounded-2xl outline-none transition duration-150 mt-1"
          />
        </div>

        <div className="text-left">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider pl-1">Jelszó</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="••••••••"
            className="w-full bg-slate-900 border-2 border-slate-600 focus:border-orange-500 text-white font-bold text-xl p-3.5 rounded-2xl outline-none transition duration-150 mt-1"
          />
        </div>

        <div className="pt-2">
          <PrimaryButton loading={loading}>
            {isRegisterMode ? "Regisztráció indítása 🚀" : "Belépés a játékba 🔓"}
          </PrimaryButton>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-700/60 text-sm">
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(!isRegisterMode);
            setError("");
            setSuccessMessage("");
          }}
          disabled={loading}
          className="text-orange-400 hover:text-orange-300 font-extrabold transition cursor-pointer"
        >
          {isRegisterMode 
            ? "Már van fiókom? Lépj be itt!" 
            : "Még nincs fiókod? Regisztrálj itt!"}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;
