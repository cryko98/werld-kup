import React, { useState } from 'react';
import { CONTRACT_ADDRESS, PUMP_URL } from '../data';
import { playWhistle, playCoin } from '../utils/audio';
import { Download, Wallet, CreditCard, HelpCircle, Check, Copy, Search, Trophy, MoveRight } from 'lucide-react';

export default function HowToBuy() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    playCoin();
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const steps = [
    {
      id: 1,
      title: "CREATE A WALLET",
      desc: "Download Phantom or Solflare wallet from the App Store or Google Play Store. If you are on desktop, install the web browser extension from Chrome Web Store.",
      icon: <Wallet className="text-yellow-400" size={24} />,
      badge: "Phantom / Solflare"
    },
    {
      id: 2,
      title: "GET SOME NATIVE $SOL",
      desc: "Deposit Solana ($SOL) tokens into your freshly created wallet from your exchange account, or buy SOL natively using moonpay/on-ramp services inside the wallet app.",
      icon: <CreditCard className="text-emerald-400" size={24} />,
      badge: "No gas, no stress"
    },
    {
      id: 3,
      title: "CONNECT TO PUMP.FUN",
      desc: "Go to pump.fun, click on 'Connect Wallet', approve the connection request, and search for the holy grail 2026 contract address in the top search bar.",
      icon: <Trophy className="text-rose-400" size={24} />,
      badge: "Paste CA below"
    },
    {
      id: 4,
      title: "SWAP FOR $WERLDKUP",
      desc: "Choose the amount of SOL you wish to sacrifice. Tap the yellow 'BUY' button. Watch as your balance hydrates. Prepare your vertebral columns for rolling like Neymar Jr.",
      icon: <Check className="text-blue-400" size={24} />,
      badge: "100% Retarded speed"
    }
  ];

  return (
    <section id="buy" className="py-20 bg-slate-950 soccer-pitch relative overflow-hidden">
      {/* Visual background lines */}
      <div className="absolute top-20 right-0 opacity-10 pointer-events-none select-none text-9xl">⚽</div>
      <div className="absolute bottom-20 left-0 opacity-10 pointer-events-none select-none text-9xl text-emerald-500">🏆</div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-2xs font-mono font-black tracking-widest uppercase">
            ✦ Simple Tutorial ✦
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-3 font-comic text-yellow-400 tracking-tight">
            HOW TO SECURE BACKPACKS
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base font-comic">
            Become a top-tier long-neck football executive under 60 seconds with no complex high-IQ equations required.
          </p>
        </div>

        {/* Contract Address Callout widget */}
        <div className="max-w-3xl mx-auto bg-slate-900 border-4 border-emerald-500 rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none">
            <Trophy size={160} className="text-emerald-500" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center md:text-left">
              <span className="bg-emerald-500/10 text-emerald-400 text-3xs font-mono font-black tracking-wider px-2.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                COGNITIVE VERIFICATION ADDR
              </span>
              <h3 className="font-extrabold text-xl font-comic text-yellow-400">
                OFFICIAL CONTRACT ADDRESS:
              </h3>
              <p className="text-slate-400 text-xs font-mono">
                Copy and verify before buying to avoid purchasing fake world cups!
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <div className="bg-slate-950 px-4 py-3 rounded-2xl border-2 border-slate-800 flex items-center justify-between gap-3 font-mono text-sm overflow-hidden flex-1 sm:w-80">
                <span className="truncate text-emerald-400 font-extrabold select-all">{CONTRACT_ADDRESS}</span>
              </div>
              
              <button
                onClick={handleCopy}
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check size={16} /> COPIED!
                  </>
                ) : (
                  <>
                    <Copy size={16} /> COPY ADDR
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stepped Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="bg-slate-900/60 hover:bg-slate-900 border-2 border-slate-800 hover:border-emerald-500 rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl group hover:scale-[1.02]"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:border-emerald-500/20 transition-all">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black font-mono text-slate-800 group-hover:text-emerald-500/10 transition-all">
                    0{step.id}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="bg-slate-950 border border-slate-800 text-yellow-400 text-3xs font-mono font-black tracking-widest px-2.5 py-0.5 rounded tracking-wide font-extrabold uppercase block w-max">
                    {step.badge}
                  </span>
                  <h4 className="font-extrabold text-lg text-slate-100 font-comic tracking-wide leading-tight uppercase">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-comic pt-1">
                    {step.desc}
                  </p>
                </div>
              </div>

              {idx < 3 && (
                <div className="hidden lg:flex justify-end pt-4 opacity-30 group-hover:opacity-100 transition-opacity">
                  <MoveRight size={18} className="text-emerald-400 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Direct Action Button Call to action */}
        <div className="text-center">
          <a
            href={PUMP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playWhistle()}
            className="inline-flex bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl text-base font-comic shadow-2xl transition-all duration-300 active:scale-95 tracking-wide items-center gap-2 border-2 border-emerald-400 shrink-0"
          >
            ENTER PUMP.FUN EXCHANGE <MoveRight size={18} />
          </a>
          <p className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-wider">
            Warning: We are not responsible for any braincells consumed during the process.
          </p>
        </div>
      </div>
    </section>
  );
}
