/**
 * VinylRecord - A HitJam Party interaktív bakelit lemeze.
 * @param {boolean} isPlaying - Ha igaz, a lemez elkezd forogni.
 * @param {string} coverUrl - A lemez közepén megjelenő borítókép útvonala.
 */
function VinylRecord({ isPlaying, coverUrl }) {
  return (
    <div className="flex justify-center items-center my-6 select-none">
      {/* 
        A LEGYNAGYOBB KORONG (A fekete bakelit)
        A 'animate-spin' osztály pörgeti a lemezt végtelenítve.
        Ha a zene le van állítva, a [animation-play-state:paused] megállítja a forgást!
      */}
      <div 
        className={`relative w-48 h-48 rounded-full bg-neutral-950 border-4 border-neutral-800 shadow-2xl flex items-center justify-center transition-transform duration-500 transform hover:scale-105 ${
          isPlaying ? 'animate-spin [animation-duration:6s]' : ''
        }`}
        style={{
          animationPlayState: isPlaying ? 'running' : 'paused',
          backgroundImage: 'radial-gradient(circle, #171717 35%, #0a0a0a 100%)' // Bakelit barázda hatás
        }}
      >
        {/* A bakelit barázdái (Fényes körök a lemezen) */}
        <div className="absolute inset-2 border border-neutral-850 rounded-full opacity-30"></div>
        <div className="absolute inset-6 border border-neutral-850 rounded-full opacity-20"></div>
        <div className="absolute inset-12 border border-neutral-850 rounded-full opacity-15"></div>

        {/* 
          ALBUM BORÍTÓ (A lemez belső színes köre)
          Ide töltjük be a te saját HitJam logódat!
        */}
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neutral-900 shadow-inner bg-orange-500 flex items-center justify-center z-10">
          <img 
            src={coverUrl || "icon/icon-192.png"} 
            alt="Album Cover" 
            className="w-full h-full object-cover"
            // Megakadályozzuk, hogy a képet a felhasználó "elrepedje" vagy elhúzza az egérrel
            onDragStart={(e) => e.preventDefault()}
          />
        </div>

        {/* A BAKELIT KÖZEPÉN LÉVŐ LYUK (A tüskéknek) */}
        <div className="absolute w-3 h-3 rounded-full bg-slate-800 border border-neutral-950 z-20 shadow-md"></div>
      </div>
    </div>
  );
}

export default VinylRecord;
