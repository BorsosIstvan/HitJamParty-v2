/**
 * PrimaryButton - A HitJam Party hivatalos mester-gombja.
 * A formai elemeket helyben kezeli, de a színeket a CSS változókból olvassa be!
 */
function PrimaryButton({ children, onClick, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      /* 
        FIGYELD A SZÍNEKET: from-brand-start, to-brand-end!
        Ezeket egyenesen a src/index.css-ből húzza be a Tailwind.
      */
      className="w-full bg-gradient-to-r from-brand-start to-brand-end hover:from-brand-hover-start hover:to-brand-hover-end disabled:from-slate-700 disabled:to-slate-700 text-white font-black text-xl py-4 px-6 rounded-2xl transition duration-200 transform active:scale-95 shadow-xl shadow-orange-500/20 cursor-pointer"
    >
      {loading ? "Betöltés..." : children}
    </button>
  );
}

export default PrimaryButton;
