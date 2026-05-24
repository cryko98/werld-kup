import React, { useState, useEffect } from 'react';
import { playWhistle, playVuvuzela, playGoalHorn, isMuted, setMuted } from '../utils/audio';
import { Volume2, VolumeX, Trophy, Music, Zap } from 'lucide-react';

export default function SoundBoard() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [mutedState, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  const toggleMute = () => {
    const nextMuted = !mutedState;
    setMuted(nextMuted);
    setMutedState(nextMuted);
  };

  const triggerSound = (name: string, playFn: () => void) => {
    if (mutedState) return;
    setActiveSound(name);
    playFn();
    setTimeout(() => {
      setActiveSound(null);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
      {/* Visual audio wave representation */}
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Music size={120} />
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-xl border border-emerald-500/20">
            {mutedState ? (
              <VolumeX size={22} className="text-red-400" />
            ) : (
              <Volume2 size={22} className="animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-yellow-400 font-comic">
              WERLD KUP SOUNDS
            </h3>
            <p className="text-3xs text-slate-400 font-semibold uppercase font-mono">
              Directly synthesized (Low-volume mix)
            </p>
          </div>
        </div>

        {/* Quick Mute Control */}
        <button
          onClick={toggleMute}
          className={`px-3 py-1.5 rounded-xl border font-mono text-2xs font-extrabold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            mutedState 
              ? 'bg-rose-500/20 text-rose-450 border-rose-500/30' 
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          {mutedState ? (
            <>
              <VolumeX size={12} />
              <span>MUTED</span>
            </>
          ) : (
            <>
              <Volume2 size={12} />
              <span>MUTE AUDIO</span>
          </>
          )}
        </button>
      </div>

      <p className="text-xs text-slate-300 font-comic leading-relaxed mb-6">
        Test your referee frustration levels or trigger funny tournament horns. These are mixed to be 5x softer and non-intrusive!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Whistle */}
        <button
          onClick={() => triggerSound('whistle', playWhistle)}
          disabled={mutedState}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer disabled:opacity-55 ${
            activeSound === 'whistle' 
              ? 'bg-yellow-400 text-slate-950 border-yellow-300 scale-102' 
              : 'bg-slate-950 text-slate-100 border-slate-800 hover:border-yellow-400/40 hover:bg-slate-950/80'
          }`}
        >
          <span className="text-2xl mb-1">📢</span>
          <span className="font-black text-xs font-mono tracking-wider">REF WHISTLE</span>
          <span className="text-[10px] text-slate-400 mt-1 font-semibold block text-center">Bribe referee</span>
        </button>

        {/* Vuvuzela */}
        <button
          onClick={() => triggerSound('vuvuzela', playVuvuzela)}
          disabled={mutedState}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer disabled:opacity-55 ${
            activeSound === 'vuvuzela' 
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 scale-102' 
              : 'bg-slate-950 text-slate-100 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-950/80'
          }`}
        >
          <span className="text-2xl mb-1">🎺</span>
          <span className="font-black text-xs font-mono tracking-wider">VUVUZELA</span>
          <span className="text-[10px] text-slate-400 mt-1 font-semibold block text-center">Classic horn blast</span>
        </button>

        {/* Goal Horn */}
        <button
          onClick={() => triggerSound('goal', playGoalHorn)}
          disabled={mutedState}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer disabled:opacity-55 ${
            activeSound === 'goal' 
              ? 'bg-red-500 text-slate-950 border-red-400 scale-102' 
              : 'bg-slate-950 text-slate-100 border-slate-800 hover:border-red-500/40 hover:bg-slate-950/80'
          }`}
        >
          <span className="text-2xl mb-1">🚨</span>
          <span className="font-black text-xs font-mono tracking-wider">GOAL HORN</span>
          <span className="text-[10px] text-slate-400 mt-1 font-semibold block text-center">Stadium blast</span>
        </button>
      </div>

      {activeSound && (
        <div className="mt-4 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 flex items-center gap-2 justify-center">
          <Zap size={14} className="text-yellow-400 animate-bounce" />
          <p className="text-2xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
            Synthesizing: {activeSound === 'whistle' ? 'Referee warning frequency' : activeSound === 'vuvuzela' ? 'Bee swarm frequency' : 'Goal blaster frequency'}
          </p>
        </div>
      )}
    </div>
  );
}
