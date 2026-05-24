import React from 'react';
import { ROADMAP_ITEMS } from '../data';
import { playWhistle, playGoalHorn } from '../utils/audio';
import { Trophy, Compass, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';

export default function Roadmap() {
  const triggerWhistle = () => {
    playWhistle();
  };

  const triggerGoal = () => {
    playGoalHorn();
  };

  return (
    <section id="roadmap" className="py-20 bg-slate-900 border-t-4 border-slate-950 px-4 relative">
      {/* Background decoration */}
      <div className="absolute top-10 right-10 opacity-[0.02] text-9xl pointer-events-none select-none">🥅</div>
      <div className="absolute bottom-10 left-10 opacity-[0.02] text-9xl pointer-events-none select-none">🏆</div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3.5 py-1.5 rounded-full text-2xs font-mono font-black tracking-widest uppercase">
            ✦ Future Milestones ✦
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-3 font-comic text-yellow-400 tracking-tight">
            RETARDED TOURNAMENT ROADMAP
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base font-comic">
            The master plan to overtake human football, manipulate physical laws, and conquer the blockchain. Click on the golden trophy to register your support.
          </p>
        </div>

        {/* Visual bracket or step track */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch relative">
          <div className="hidden lg:block absolute inset-x-0 top-1/2 -translate-y-4 h-1 bg-gradient-to-r from-emerald-500/20 via-yellow-500/20 to-transparent pointer-events-none z-0"></div>

          {ROADMAP_ITEMS.map((item, idx) => {
            const isDone = item.status === 'done';
            const isDoing = item.status === 'doing';
            
            return (
              <div
                key={item.id}
                className={`relative bg-slate-950 rounded-3xl border-2 p-6 md:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 group hover:scale-[1.03] z-10 ${
                  isDoing 
                    ? 'border-yellow-400 shadow-yellow-400/5' 
                    : isDone 
                    ? 'border-emerald-500 shadow-emerald-500/5' 
                    : 'border-slate-800'
                }`}
              >
                {/* Visual Connector for step */}
                <div className="absolute -top-3 left-6 bg-slate-900 border-2 border-slate-700 rounded-full w-8 h-8 flex items-center justify-center font-mono text-xs font-black text-slate-300 group-hover:border-yellow-400 transition-all">
                  {idx + 1}
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-2xs font-mono font-black tracking-widest text-slate-400 uppercase">
                      {item.stage}
                    </span>
                    {isDone ? (
                      <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-mono font-black px-2 py-0.5 rounded border border-emerald-500/20 shadow">
                        <CheckCircle2 size={10} /> DONE
                      </span>
                    ) : isDoing ? (
                      <span className="flex items-center gap-1 bg-yellow-400/10 text-yellow-400 text-[10px] uppercase font-mono font-black px-2 py-0.5 rounded border border-yellow-400/20 shadow animate-pulse">
                        <Zap size={10} /> KICKING
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-slate-900 text-slate-500 text-[10px] uppercase font-mono font-black px-2 py-0.5 rounded border border-slate-800">
                        PLANNED
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl" role="img" aria-label="icon">
                        {item.funnyIcon}
                      </span>
                      <h4 className="font-extrabold text-base tracking-wide font-comic text-slate-100 group-hover:text-yellow-400 transition-colors uppercase leading-snug">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-comic h-36 overflow-y-auto">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-xs">
                  <span className="font-mono text-3xs text-slate-500 uppercase tracking-widest font-black">
                    Match Code: VB-26
                  </span>
                  <button
                    onClick={isDone ? triggerGoal : triggerWhistle}
                    className={`py-1.5 px-3 rounded-lg text-3xs font-black uppercase font-mono transition-all cursor-pointer ${
                      isDone 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950' 
                        : 'bg-slate-900 text-slate-450 border border-slate-800 hover:bg-yellow-400 hover:text-slate-950 hover:border-yellow-400'
                    }`}
                  >
                    {isDone ? '🎉 Scream Goal' : '📢 Warn Referee'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fun bracket bracket final mockup */}
        <div className="mt-16 bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 p-4 opacity-5 pointer-events-none text-6xl">⚽</div>
          <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none text-6xl">⚽</div>
          
          <Trophy size={48} className="text-yellow-400 animate-bounce mb-3" />
          <h3 className="text-xl sm:text-2xl font-black font-comic text-yellow-400 uppercase tracking-tight">
            FINAL DESTINATION: OVERTAKE FEFE
          </h3>
          <p className="mt-1 text-slate-400 text-xs sm:text-sm max-w-xl font-comic">
            When $WERLDKUP achieves a retarded valuation, we will construct a physical 800-foot tall stadium in international waters where ties are settled by rock-paper-scissors with actual long-neck llamas inside jerseys.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="bg-slate-900 px-3 py-1 border border-slate-800 text-slate-500 font-mono text-[9px] uppercase font-black rounded-lg">
              Authorized by Werld Kup Retard Committee
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
