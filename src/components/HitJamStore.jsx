import { useState } from 'react';
import CdRecord from './CdRecord';

/**
 * HitJamStore - Integrált Raktár és Bolt felület.
 * Szemüveg nélküli, nagy gombokkal és egyértelmű jelzésekkel.
 */
function HitJamStore({ 
  albums, 
  ownedAlbums, 
  activeAlbumIds, 
  coins, 
  onToggleAlbum, 
  onBuyAlbum 
}) {
  const [storeTab, setStoreTab] = useState("inventory"); // "inventory" vagy "shop"

  return (
    <div className="w-full max-w-sm bg-slate-800 p-6 rounded-3xl border-2 border-slate-700 text-center animate-fade-in">
      
      {/* BELSŐ NAVIGÁCIÓ (Raktár vs Bolt) */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl mb-6 border border-slate-700">
        <button
          onClick={() => setStoreTab("inventory")}
          className={`flex-1 py-2.5 text-sm font-black rounded-xl transition ${
            storeTab === "inventory" 
              ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md" 
              : "text-slate-400 hover:text-white"
          }`}
        >
          📦 Raktáram
        </button>
        <button
          onClick={() => setStoreTab("shop")}
          className={`flex-1 py-2.5 text-sm font-black rounded-xl transition ${
            storeTab === "shop" 
              ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md" 
              : "text-slate-400 hover:text-white"
          }`}
        >
          🛒 HitJam Bolt
        </button>
      </div>

      {/* --- 📦 RAKTÁR KÉPERNYŐ --- */}
      {storeTab === "inventory" && (
        <div className="space-y-4">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
            Válaszd ki, melyik CD-k szóljanak a buliban (akár egyszerre több is!):
          </p>
          
          {albums.filter(a => ownedAlbums.includes(a.id)).map(album => {
            const isActive = activeAlbumIds.includes(album.id);
            return (
              <div 
                key={album.id}
                onClick={() => onToggleAlbum(album.id)}
                className={`p-4 rounded-2xl border-2 transition duration-150 cursor-pointer flex items-center justify-between text-left ${
                  isActive 
                    ? "bg-orange-950/20 border-orange-500 shadow-lg shadow-orange-500/5" 
                    : "bg-slate-900 border-slate-700 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Kis ikon borító */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-500 border border-slate-600 flex-shrink-0">
                    <img src={album.cover} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-100">{album.title}</h3>
                    <p className="text-xs text-slate-400 font-medium line-clamp-1">{album.description}</p>
                  </div>
                </div>
                {/* ÓRIÁSI PIPA / JELZŐ BOX */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-lg transition border-2 ${
                  isActive 
                    ? "bg-orange-500 border-orange-400 text-slate-900" 
                    : "bg-slate-950 border-slate-600 text-transparent"
                }`}>
                  ✓
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- 🛒 BOLT KÉPERNYŐ --- */}
      {storeTab === "shop" && (
        <div className="space-y-6">
          {albums.filter(a => !ownedAlbums.includes(a.id)).length === 0 ? (
            <p className="text-sm font-bold text-slate-400 py-8">
              🎉 Gratulálunk! Az összes létező HitJam lemezt megvásároltad már!
            </p>
          ) : (
            albums.filter(a => !ownedAlbums.includes(a.id)).map(album => {
              const canAfford = coins >= album.price;
              return (
                <div key={album.id} className="bg-slate-900 p-4 rounded-3xl border border-slate-700 flex flex-col items-center">
                  <h3 className="font-black text-lg text-slate-100">{album.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[250px]">{album.description}</p>
                  
                  {/* CD Vizuális bemutató a boltban */}
                  <div className="scale-75 -my-6">
                    <CdRecord isPlaying={false} coverUrl={album.cover} />
                  </div>

                  {/* VÁSÁRLÁS GOMB */}
                  <button
                    onClick={() => canAfford && onBuyAlbum(album.id, album.price)}
                    disabled={!canAfford}
                    className={`w-full font-black text-base py-3 px-6 rounded-2xl transition duration-150 transform active:scale-95 shadow-md flex justify-center items-center gap-2 cursor-pointer ${
                      canAfford 
                        ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-orange-500/10" 
                        : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed transform-none"
                    }`}
                  >
                    <span>Megvásárlás ára:</span>
                    <span className={canAfford ? "text-yellow-300" : "text-slate-500"}>
                      {album.price} HJC 🪙
                    </span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}

export default HitJamStore;
