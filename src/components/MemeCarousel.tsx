import React, { useState } from 'react';
import { MEME_IMAGES } from '../data';
import { MemeCard } from '../types';
import { Maximize2, X, Volume2, ArrowLeft, ArrowRight } from 'lucide-react';
import { playWhistle } from '../utils/audio';

export default function MemeCarousel() {
  const [selectedMeme, setSelectedMeme] = useState<MemeCard | null>(null);

  // Duplicate for seamless scroll
  const extendedMemes = [...MEME_IMAGES, ...MEME_IMAGES];

  const handleMemeClick = (meme: MemeCard) => {
    setSelectedMeme(meme);
    playWhistle();
  };

  return (
    <section id="memes" className="py-16 bg-emerald-950/10 border-t-4 border-emerald-950/65 overflow-hidden relative">
      {/* Absolute soccer background elements */}
      <div className="absolute top-10 left-10 opacity-5 pointer-events-none text-9xl">🥅</div>
      <div className="absolute bottom-10 right-10 opacity-5 pointer-events-none text-9xl">🏃</div>
      
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center relative z-10">
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase">
          ✦ Retard Gallery ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold mt-3 tracking-tight font-comic text-yellow-400">
          WERLD KUP MEME DEPOT
        </h2>
        <p className="mt-2 text-slate-400 max-w-xl mx-auto text-sm sm:text-base font-comic">
          Hover to freeze, click a card to blow up the stupidity in ultra-4K low resolution.
        </p>
      </div>

      {/* Endless Floating Scrolling Bar Row 1 */}
      <div className="relative py-4 overflow-hidden select-none mb-4 group bg-slate-950/40">
        <div className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused]">
          {extendedMemes.map((meme, idx) => (
            <div
              key={`${meme.id}-${idx}`}
              onClick={() => handleMemeClick(meme)}
              className="w-64 sm:w-80 shrink-0 bg-slate-900 border-2 border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg group/card relative"
            >
              <div className="relative aspect-[4/3] bg-slate-950">
                <img
                  src={meme.url}
                  alt={meme.caption}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-full font-bold flex items-center gap-1.5 text-xs">
                    <Maximize2 size={16} /> Look Retard
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-500/30">
                  SNAP {((idx % MEME_IMAGES.length) + 1).toString().padStart(2, '0')}
                </div>
              </div>
              <div className="p-4 bg-slate-900 border-t border-slate-800">
                <p className="text-xs text-slate-300 font-sans line-clamp-2 h-8 font-semibold italic">
                  "{meme.caption}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reverse Scroll Row 2 */}
      <div className="relative py-4 overflow-hidden select-none bg-slate-950/40">
        <div className="flex w-max gap-6 animate-marquee-reverse hover:[animation-play-state:paused]">
          {[...MEME_IMAGES].reverse().concat([...MEME_IMAGES].reverse()).map((meme, idx) => (
            <div
              key={`rev-${meme.id}-${idx}`}
              onClick={() => handleMemeClick(meme)}
              className="w-64 sm:w-80 shrink-0 bg-slate-900 border-2 border-slate-800 rounded-2xl overflow-hidden hover:border-yellow-500 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg group/card relative"
            >
              <div className="relative aspect-[4/3] bg-slate-950">
                <img
                  src={meme.url}
                  alt={meme.caption}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-yellow-400 text-slate-950 p-2.5 rounded-full font-bold flex items-center gap-1.5 text-xs">
                    <Maximize2 size={16} /> Look Retard
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-yellow-400 font-mono text-[10px] px-2 py-0.5 rounded border border-yellow-500/30">
                  REPLAY {((idx % MEME_IMAGES.length) + 1).toString().padStart(2, '0')}
                </div>
              </div>
              <div className="p-4 bg-slate-900 border-t border-slate-800">
                <p className="text-xs text-slate-300 font-sans line-clamp-2 h-8 font-semibold italic">
                  "{meme.caption}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedMeme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md transition-opacity duration-300">
          <div className="relative w-full max-w-2xl bg-slate-900 border-4 border-emerald-500 rounded-3xl overflow-hidden shadow-2xl p-5 md:p-6 animate-in fade-in zoom-in duration-200">
            {/* Whistle sound on click warning */}
            <button
              onClick={() => setSelectedMeme(null)}
              className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 hover:text-red-400 text-slate-300 p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>
            
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] border-2 border-slate-800">
              <img
                src={selectedMeme.url}
                alt={selectedMeme.caption}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="mt-5 bg-slate-950/50 p-4 rounded-xl border border-slate-800 relative">
              <div className="absolute -top-3 left-4 bg-emerald-500 text-slate-950 text-2xs font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider">
                Official VAR Review
              </div>
              <p className="text-base sm:text-lg text-slate-100 font-comic leading-relaxed mt-1 italic">
                "{selectedMeme.caption}"
              </p>
            </div>
            
            <div className="mt-4 flex gap-3 justify-between items-center">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE PLACEMENT
              </div>
              <button
                onClick={() => setSelectedMeme(null)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl font-bold font-comic text-sm transition-all shadow-md active:scale-95"
              >
                Clear Referee (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
