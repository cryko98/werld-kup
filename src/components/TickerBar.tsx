import React from 'react';

interface TickerBarProps {
  reverse?: boolean;
}

export default function TickerBar({ reverse = false }: TickerBarProps) {
  const words = [
    "$WERLDKUP", "2026 RETARD EDITION", "KICK BALL FORWARD", "SUI!!!", "FIFA IS EXPENSIVE",
    "VAR IS RIGGED", "LONG NECKS ONLY", "NO REFS ALLOWED", "PUMP.FUN SOLANA", "WHERE IS NEYMAR?",
    "HAALAND RECHARGING", "BUY OR WE CRY", "$WERLDKUP", "POTATO BALLON D'OR"
  ];
  
  // Duplicate for seamless endless looping
  const repeatedWords = [...words, ...words, ...words, ...words];

  return (
    <div className="w-full bg-emerald-500 text-slate-950 font-black py-3 uppercase tracking-wider text-xs sm:text-sm overflow-hidden select-none border-y-2 border-emerald-400 rotate-[-1deg] shadow-lg">
      <div className="flex whitespace-nowrap">
        <div className={`flex gap-8 shrink-0 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
          {repeatedWords.map((word, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <span className="bg-slate-950 text-emerald-400 px-2 py-0.5 rounded text-2xs font-mono">FIFA</span>
              <span>{word}</span>
              <span className="text-slate-950">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
