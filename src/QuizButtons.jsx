import { useEffect, useState } from 'react';

/**
 * QuizButtons Komponens
 * Legenerál 4 évszám gombot (1 helyes + 3 hamis közeli évszám)
 */
function QuizButtons({ correctYear, onAnswerSubmit }) {
  const [options, setOptions] = useState([]);

  // useEffect: minden alkalommal újragenerálja a gombokat, ha új dalt kapunk
  useEffect(() => {
    if (!correctYear) return;

    const generateYears = () => {
      const yearsSet = new Set();
      yearsSet.add(correctYear); // Elsőként berakjuk a helyes évet

      // Addig generálunk hamis éveket, amíg meg nem lesz a 4 különböző évszám
      while (yearsSet.size < 4) {
        // A helyes évszámhoz képest maximum -5 és +5 év közötti eltérést engedünk
        const randomOffset = Math.floor(Math.random() * 11) - 5; 
        const fakeYear = correctYear + randomOffset;
        
        // Ellenőrizzük, hogy az évszám reális-e (ne legyen a jövőben)
        if (fakeYear <= new Date().getFullYear()) {
          yearsSet.add(fakeYear);
        }
      }

      // Halmazból listát csinálunk, és teljesen összekeverjük (Fisher-Yates shuffle trükk)
      const shuffledArray = Array.from(yearsSet);
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }

      setOptions(shuffledArray);
    };

    generateYears();
  }, [correctYear]); // Ha változik a helyes évszám, lefut újra

  return (
    <div className="grid grid-cols-2 gap-3 mt-6 animate-fade-in">
      {options.map((year) => (
        <button
          key={year}
          onClick={() => onAnswerSubmit(year)}
          className="bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition duration-150 transform active:scale-95 shadow-md text-center"
        >
          {year}
        </button>
      ))}
    </div>
  );
}

export default QuizButtons;
