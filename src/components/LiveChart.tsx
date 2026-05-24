import React, { useState } from 'react';
import { CONTRACT_ADDRESS, DEXSCREENER_URL, PUMP_URL } from '../data';
import { ExternalLink, TrendingUp, Info } from 'lucide-react';
import { playWhistle } from '../utils/audio';

export default function LiveChart() {
  const [activeTab, setActiveTab] = useState<'chart' | 'trades'>('chart');

  // Realistic looking retard-coin mock trade feed
  const mockTrades = [
    { type: 'buy', amount: '22.4 SOL', tokens: '410,210', time: '1s ago', tx: '6fBx...a9Kp' },
    { type: 'buy', amount: '8.1 SOL', tokens: '148,500', time: '4s ago', tx: '8KpL...99xY' },
    { type: 'sell', amount: '0.1 SOL', tokens: '1,820', time: '12s ago', tx: '2vPt...88zQ' },
    { type: 'buy', amount: '45.0 SOL', tokens: '822,100', time: '20s ago', tx: '1sWq...d4mN' },
    { type: 'buy', amount: '1.2 SOL', tokens: '21,900', time: '35s ago', tx: '9mKz...a11K' },
    { type: 'sell', amount: '15.5 SOL', tokens: '280,000', time: '1m ago', tx: '5vBx...01pQ' }
  ];

  return (
    <section id="chart" className="py-16 bg-slate-900/60 border-y-4 border-emerald-950 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase">
              ✦ Live Action Ticker ✦
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold mt-3 tracking-tight font-comic text-yellow-400">
              WERLD KUP CHART DATA
            </h2>
            <p className="mt-2 text-slate-400 max-w-xl text-sm font-comic">
              Observe original, decentralized candles. Green candles go up like Cristiano's leap, red candles roll down like Neymar.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={DEXSCREENER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playWhistle()}
              className="bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 text-xs font-bold font-mono px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <ExternalLink size={14} /> Full DexScreener
            </a>
            <a
              href={PUMP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playWhistle()}
              className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-bold font-mono px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <TrendingUp size={14} /> Buy on pump.fun
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Chart Card */}
          <div className="lg:col-span-8 bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden min-h-[500px] flex flex-col relative shadow-2xl">
            {/* Top Bar inside Chart */}
            <div className="bg-slate-900 px-5 py-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-xs font-extrabold text-slate-300">$WERLDKUP / SOL (Pump.fun Live feed)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[10px] px-2.5 py-1 rounded">
                  Pair: Solana Dev Pool
                </span>
              </div>
            </div>

            {/* Embedded Live Dexscreener Frame */}
            <div className="flex-1 w-full h-[450px] relative bg-slate-950">
              <iframe
                src={`https://dexscreener.com/solana/${CONTRACT_ADDRESS}?embed=1&theme=dark&trades=0&info=0`}
                title="Dexscreener Chart"
                className="w-full h-full border-none absolute inset-0"
                allow="clipboard-write"
              ></iframe>
              {/* Optional overlay guidance in case iframe doesn't support sandbox perfectly */}
              <div className="absolute bottom-2 left-2 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-800 text-[9px] max-w-xs text-slate-400 pointer-events-none flex items-center gap-1">
                <Info size={12} className="text-yellow-400 shrink-0" />
                <span>Pasting pump pool CA: 4yBfV...pump directly on DexScreener chart.</span>
              </div>
            </div>
          </div>

          {/* Right sidebar: Live Transactions feed on-chain and Contract Details */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-950 rounded-3xl border-2 border-slate-800 p-5 flex-1 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                  <h3 className="font-black text-sm text-yellow-400 uppercase tracking-widest font-mono">
                    Werld Kup Trade Engine
                  </h3>
                  <span className="animate-ping w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>

                <div className="space-y-3">
                  {mockTrades.map((t, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            t.type === 'buy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {t.type.toUpperCase()}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-100">{t.amount}</span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 mt-1">Tx: {t.tx}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-extrabold text-slate-300">{t.tokens} WERLDKUP</div>
                        <span className="text-[10px] text-slate-500 font-mono block">{t.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 justify-center text-[10px] font-mono text-slate-400 bg-slate-900 py-2.5 px-3 rounded-lg border border-slate-800 italic text-center">
                  <span>⚽ Running referee bot node on Solana blockchain. Liquidity is 100% Retarded.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
