import React, { useState, useEffect } from 'react';
import { FUNNY_FACTS } from '../data';
import { playWhistle } from '../utils/audio';
import { RefreshCw, Play, Volume2 } from 'lucide-react';

export default function LiveCommentary() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liveMinute, setLiveMinute] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMinute(prev => {
        if (prev >= 90) return 1;
        return prev + 1;
      });
    }, 15000); // increment fake minute every 15s

    return () => clearInterval(interval);
  }, []);

  const handleNextCommentary = () => {
    setCurrentIndex(prev => (prev + 1) % FUNNY_FACTS.length);
    playWhistle();
  };

  const currentFact = FUNNY_FACTS[currentIndex];

  return (
    <div className="bg-slate-950 border-4 border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between">
      {/* Pitch grass subtle lines decoration */}
      <div className="absolute inset-0 opacity-[0.03] soccer-pitch pointer-events-none"></div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-mono text-3xs font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              VAR LIVE TEXT COMMENTARY
            </span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono font-bold text-slate-300">
            TIME: <span className="text-yellow-400 font-extrabold">{liveMinute}' MUTATION</span>
          </div>
        </div>

        <div className="bg-slate-900 border-2 border-slate-800 p-5 rounded-2xl relative">
          <div className="absolute -top-3 left-4 bg-yellow-400 text-slate-950 text-3xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
            Match minute: {currentFact.time}
          </div>
          
          <div className="flex items-start gap-4">
            <img
              src={currentFact.avatar}
              alt={currentFact.player}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-950 flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-2xs font-mono font-black text-emerald-400 uppercase block mb-0.5">
                PLAYER CRITICAL EVENT: {currentFact.player}
              </span>
              <p className="text-xs sm:text-sm text-slate-100 font-comic leading-relaxed italic pr-4">
                "{currentFact.text}"
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider text-center sm:text-left">
          ✦ Live feed verified by uncertified referees ✦
        </p>
        
        <button
          onClick={handleNextCommentary}
          className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 px-5 py-2.5 rounded-xl font-bold font-comic text-xs transition-all flex items-center justify-center gap-2 border border-slate-700 active:scale-95 cursor-pointer"
        >
          <RefreshCw size={12} className="animate-spin" /> Fetch New Lie
        </button>
      </div>
    </div>
  );
}
