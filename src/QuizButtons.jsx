import { useEffect, useState } from 'react';

function QuizButtons({ correctYear, onAnswerSubmit }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!correctYear) return;

    const generateYears = () => {
      const yearsSet = new Set();
      yearsSet.add(correctYear);

      while (yearsSet.size < 4) {
        const randomOffset = Math.floor(Math.random() * 11) - 5; 
        const fakeYear = correctYear + randomOffset;
        if (fakeYear <= new Date().getFullYear()) {
          yearsSet.add(fakeYear);
        }
      }

      const shuffledArray = Array.from(yearsSet);
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }

      setOptions(shuffledArray);
    };

    generateYears();
  }, [correctYear]);

  return (
    /* SZEMÜVEG NÉLKÜLI MÓD: Hatalmas gombok rácsa, nagyobb térközzel */
    <div className="grid grid-cols-2 gap-4 mt-8">
      {options.map((year) => (
        <button
          key={year}
          onClick={() => onAnswerSubmit(year)}
          /* FIX: text-3xl (óriási számok), py-5 (vastagabb gomb), tiszta fehér szöveg */
          className="bg-slate-700 hover:bg-slate-600 border-2 border-slate-500 hover:border-emerald-400 text-white font-black text-3xl py-5 px-4 rounded-2xl transition duration-150 transform active:scale-95 shadow-lg shadow-black/40 text-center"
        >
          {year}
        </button>
      ))}
    </div>
  );
}

export default QuizButtons;
