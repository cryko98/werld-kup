import React from 'react';
import { CONTRACT_ADDRESS, DEXSCREENER_URL, PUMP_URL } from '../data';
import { ExternalLink, TrendingUp, Info, Activity } from 'lucide-react';
import { playWhistle } from '../utils/audio';

export default function LiveChart() {
  return (
    <section id="chart" className="py-12 bg-emerald-950/20 border-y-4 border-emerald-950 px-4 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase">
              ✦ Real-Time DexScreener Feed ✦
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold mt-2 tracking-tight font-comic text-yellow-400">
              WERLD KUP LIVE CHART
            </h2>
            <p className="mt-1.5 text-slate-300 max-w-xl text-xs sm:text-sm font-comic leading-tight">
              Direct connection to the live decentralized token price index. View real-time candle structures, market cap, and transaction history.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <a
              href={DEXSCREENER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playWhistle()}
              className="bg-[#031407] border border-emerald-900/45 hover:border-emerald-500/50 text-emerald-450 hover:text-emerald-300 text-3xs sm:text-2xs font-bold font-mono px-3.5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow"
            >
              <ExternalLink size={13} /> Open on DexScreener
            </a>
            <a
              href={PUMP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playWhistle()}
              className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-3xs sm:text-2xs font-extrabold font-mono px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-md shadow-emerald-950/20"
            >
              <TrendingUp size={13} /> Buy on pump.fun
            </a>
          </div>
        </div>

        {/* Chart Layout Container */}
        <div className="w-full bg-slate-950/90 rounded-2xl border border-emerald-950/60 overflow-hidden shadow-2xl flex flex-col">
          
          {/* Top Address Indicator and Alert Strip */}
          <div className="bg-[#041608] border-b border-emerald-950/60 px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="font-mono text-xs font-black text-slate-200 uppercase tracking-widest">$WERLDKUP / SOL</span>
              <span className="bg-emerald-500/10 text-emerald-400 font-mono text-4xs font-bold px-2 py-0.5 rounded tracking-wide border border-emerald-500/20">
                LIVE PAIR INDEX
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-4xs font-mono text-slate-400">
              <span className="text-slate-500">CONTRACT:</span>
              <span className="text-emerald-400 font-bold bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800 break-all select-all">
                {CONTRACT_ADDRESS}
              </span>
            </div>
          </div>

          {/* Iframe Frame Block */}
          <div className="relative w-full h-[550px] bg-slate-950">
            <iframe
              src={`https://dexscreener.com/solana/${CONTRACT_ADDRESS}?embed=1&theme=dark&trades=1&info=1`}
              title="Dexscreener Chart Embed"
              className="absolute inset-0 w-full h-full border-none"
              allow="clipboard-write"
            ></iframe>
          </div>

          {/* Footer controls directing external layout redirects */}
          <div className="p-4 bg-[#031407] border-t border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Activity className="text-emerald-500 shrink-0" size={14} />
              <span className="text-4xs font-mono text-slate-400 uppercase tracking-wider">
                Full dynamic interactivity including charts, volumes, and trade logs by DexScreener APIs.
              </span>
            </div>
            <div className="flex gap-2">
              <a
                href={DEXSCREENER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 hover:bg-yellow-350 text-slate-950 px-4 py-2 rounded-lg text-3xs font-extrabold font-mono flex items-center gap-1 shadow-md transition-all uppercase"
              >
                <span>Launch True DexScreener</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
