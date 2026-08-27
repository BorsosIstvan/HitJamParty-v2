/**
 * CdRecord - A HitJam Party interaktív, TELJESEN NYOMTATOTT CD-lemeze.
 * Szigorúan a valós hang kimenetre reagál, és ott áll meg, ahol a zene elhallgat!
 */
function CdRecord({ isPlaying, coverUrl }) {
  return (
    <div className="flex justify-center items-center my-6 select-none">
      {/* 
        A FŐ KORONG
        Az 'animate-spin' folyamatosan fut, de a felesleges ugrásokat elkerülve 
        a stílus szintjén (animationPlayState) fagyasztjuk le a forgást, ha nincs hang.
      */}
      <div 
        className="relative w-52 h-52 rounded-full border border-slate-600 shadow-2xl flex items-center justify-center transition-transform duration-500 transform hover:scale-105 overflow-hidden animate-spin [animation-duration:10s]"
        style={{
          /* 
            ZSENIÁLIS HACK: A lemez mindig az 'animate-spin' állapotban van, 
            de a forgást 'running' vagy 'paused' állapotba tesszük a zene alapján.
            Így ott áll meg a korong, ahol a zene elhallgatott!
          */
          animationPlayState: isPlaying ? 'running' : 'paused',
          backgroundImage: 'radial-gradient(circle, #cbd5e1 0%, #64748b 95%, #334155 100%)',
          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.6), 0 20px 25px -5px rgba(0,0,0,0.5)'
        }}
      >
        {/* A MINDENT KITÖLTŐ BORÍTÓKÉP */}
        <div className="w-[99%] h-[99%] rounded-full overflow-hidden border border-black/40 bg-orange-500 flex items-center justify-center z-10">
          <img 
            src={coverUrl || "icon/icon-192.png"} 
            alt="Album Cover" 
            className="w-full h-full object-cover"
            onDragStart={(e) => e.preventDefault()}
          />
        </div>

        {/* A CD KÖZEPÉN LÉVŐ ÁTLÁTSZÓ MŰANYAG KÖR ÉS LYUK */}
        <div className="absolute w-14 h-14 rounded-full bg-slate-950/80 border border-slate-600/50 z-25 flex items-center justify-center shadow-md">
          <div className="w-4 h-4 rounded-full bg-slate-900 border border-black shadow-inner"></div>
        </div>
      </div>
    </div>
  );
}

export default CdRecord;
