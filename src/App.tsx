import React, { useState, useRef } from 'react';
import TickerBar from './components/TickerBar';
import MemeCarousel from './components/MemeCarousel';
import SoundBoard from './components/SoundBoard';
import LiveCommentary from './components/LiveCommentary';
import LineupSimulator from './components/LineupSimulator';
import LiveChart from './components/LiveChart';
import HowToBuy from './components/HowToBuy';
import Roadmap from './components/Roadmap';
import { CONTRACT_ADDRESS, TWITTER_URL, PUMP_URL, DEXSCREENER_URL, FAQ_ITEMS } from './data';
import { playWhistle, playCoin } from './utils/audio';
import { 
  Copy, Check, ExternalLink, HelpCircle, ChevronDown, ChevronUp, Share2, 
  MessageSquare, Users, Award, ShieldAlert, Heart, Flame
} from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [videoMuted, setVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setVideoMuted(videoRef.current.muted);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    playCoin();
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const toggleFaq = (id: number) => {
    setFaqOpen(faqOpen === id ? null : id);
    playWhistle();
  };

  return (
    <div className="min-h-screen soccer-pitch text-white font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-hidden">
      {/* Absolute Background Accent Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Realistic Stadium Pitch Lines & Chalk Markings overlay */}
      <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none select-none z-0 opacity-[0.14]">
        {/* Pitch outer perimeter outline */}
        <div className="absolute top-[80px] bottom-[120px] left-4 sm:left-10 right-4 sm:right-10 border border-white rounded-lg"></div>
        {/* Center line */}
        <div className="absolute top-1/2 left-4 sm:left-10 right-4 sm:right-10 h-px bg-white -translate-y-1/2"></div>
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-80 aspect-square rounded-full border border-white"></div>
        {/* Center spot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full"></div>
        {/* Goal Box Top */}
        <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-48 sm:w-[320px] h-16 sm:h-28 border-b border-x border-white"></div>
        {/* Goal Box Bottom */}
        <div className="absolute bottom-[200px] left-1/2 -translate-x-1/2 w-48 sm:w-[320px] h-16 sm:h-28 border-t border-x border-white"></div>
        
        {/* Corner arcs */}
        <div className="absolute top-[80px] left-4 sm:left-10 w-6 h-6 border-b border-r border-white rounded-br-full"></div>
        <div className="absolute top-[80px] right-4 sm:right-10 w-6 h-6 border-b border-l border-white rounded-bl-full"></div>
        <div className="absolute bottom-[120px] left-4 sm:left-10 w-6 h-6 border-t border-r border-white rounded-tr-full"></div>
        <div className="absolute bottom-[120px] right-4 sm:right-10 w-6 h-6 border-t border-l border-white rounded-tl-full"></div>
      </div>

      {/* Top Banner / Navigation header */}
      <header className="sticky top-0 z-40 bg-[#030e06]/90 backdrop-blur-md border-b border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => { playWhistle(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="overflow-hidden w-9 sm:w-11 h-9 sm:h-11 rounded-full border-2 border-emerald-500 shadow bg-slate-900">
              <img 
                src="https://pbs.twimg.com/media/HJC_5Z-bsAAbVVp?format=jpg&name=small" 
                alt="Werld Kup logo" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-lg tracking-tight font-comic text-yellow-400">WERLD KUP</h1>
              <p className="text-[9px] sm:text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">2026 Solana Edition</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold font-comic text-slate-300">
            <a href="#simulator" className="hover:text-yellow-400 transition-colors uppercase">Tactics</a>
            <a href="#memes" className="hover:text-yellow-400 transition-colors uppercase">Memes</a>
            <a href="#chart" className="hover:text-yellow-400 transition-colors uppercase">Live Chart</a>
            <a href="#buy" className="hover:text-yellow-400 transition-colors uppercase">How To Buy</a>
            <a href="#roadmap" className="hover:text-yellow-400 transition-colors uppercase">Roadmap</a>
            <a href="#faq" className="hover:text-yellow-400 transition-colors uppercase">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playWhistle()}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-yellow-400 p-2 sm:p-2.5 rounded-xl text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              title="Official X Twitter page"
            >
              {/* Retro style new X.com logo styling */}
              <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
              <span className="hidden sm:inline font-mono text-xs font-bold font-comic">@WerldKupSol</span>
            </a>
            <a
              href={PUMP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playWhistle()}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 shadow active:scale-95 cursor-pointer font-comic tracking-wide uppercase border border-emerald-400"
            >
              Buy Token
            </a>
          </div>
        </div>
      </header>

      {/* Hero Home Section */}
      <section id="hero" className="relative py-12 sm:py-24 px-4 border-b border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text panel */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              THE RETARDED 2026 WORLD CUP MEMECOIN IS HERE
            </div>
            
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-sans leading-none tracking-tight text-slate-100">
                WERLD KUP <span className="text-yellow-400 block font-comic mt-2 relative">
                  2026 SOLANA
                  <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-emerald-500 rounded hidden lg:block"></span>
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-mono text-emerald-400 tracking-wider font-extrabold uppercase pt-2">
                Ticker: $WERLDKUP
              </p>
            </div>

            <p className="text-slate-400 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-comic">
              Welcome to the official <strong>retarded edition</strong> of the 2026 World Cup soccer festival. We are here to report, meme, and commentate on tournament events using 100% long-neck, direct head-rotation technology instead of high-IQ strategies. Strictly no intelligence allowed.
            </p>

            {/* Quick Stats Grid widgets */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 border-y border-slate-900 py-4">
              <div>
                <span className="text-slate-500 uppercase tracking-widest text-[9px] font-mono font-black block">REF BRIBE RATE</span>
                <span className="text-lg sm:text-xl font-bold font-comic text-yellow-400">100% SUCCES</span>
              </div>
              <div className="border-x border-slate-900">
                <span className="text-slate-500 uppercase tracking-widest text-[9px] font-mono font-black block">NEYMAR ROLL TIME</span>
                <span className="text-lg sm:text-xl font-bold font-comic text-rose-500">22.4 km/h</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-widest text-[9px] font-mono font-black block">COGNITIVE INDEX</span>
                <span className="text-lg sm:text-xl font-bold font-comic text-emerald-400">0.02 IQ</span>
              </div>
            </div>

            {/* Contract and copy action CTA */}
            <div className="space-y-3 max-w-xl mx-auto lg:mx-0">
              <p className="text-xs text-slate-500 uppercase font-mono font-bold tracking-wider">
                Click to copy contract address:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <div 
                  onClick={handleCopy}
                  className="bg-slate-900 border-2 border-slate-800 hover:border-emerald-500 py-3.5 px-4 rounded-xl font-mono text-xs sm:text-sm text-emerald-400 cursor-pointer flex items-center justify-between gap-3 overflow-hidden select-all flex-1 shadow transition-all duration-300"
                >
                  <span className="truncate">{CONTRACT_ADDRESS}</span>
                  {copied ? (
                    <Check size={16} className="text-emerald-400 shrink-0" />
                  ) : (
                    <Copy size={16} className="text-slate-500 group-hover:text-emerald-400 shrink-0" />
                  )}
                </div>
                <button
                  onClick={handleCopy}
                  className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs sm:text-sm cursor-pointer transition-all active:scale-95 shrink-0 shadow font-comic"
                >
                  {copied ? 'COPIED!' : 'COPY ADDR'}
                </button>
              </div>
            </div>

            {/* Hero Quick buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
              <a
                href={PUMP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playWhistle()}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow cursor-pointer font-comic uppercase tracking-wider flex items-center gap-2 border-2 border-emerald-400 active:scale-95 shrink-0"
              >
                Buy On Pump.fun <Flame size={16} />
              </a>
              <a
                href="#chart"
                className="bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 text-slate-200 px-6 py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow cursor-pointer font-comic uppercase tracking-wider flex items-center gap-2 active:scale-95"
              >
                Live Charts
              </a>
            </div>
          </div>

          {/* Hero Illustration Character Box */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Round stadium glow background */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-[80px] -z-10 animate-pulse"></div>
            
            {/* Frame border */}
            <div className="relative w-full max-w-md bg-slate-900 border-4 border-yellow-400 p-3 sm:p-4 rounded-3xl shadow-2xl overflow-hidden transform rotate-[1deg] hover:rotate-0 transition-transform duration-500">
              <div className="absolute top-2.5 left-2.5 bg-yellow-400 text-slate-950 text-2xs font-extrabold px-3 py-0.5 rounded font-mono uppercase tracking-wider select-none">
                Official Squad Photo
              </div>
              <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 relative">
                <img 
                  src="https://pbs.twimg.com/media/HJC_5Z-bsAAbVVp?format=jpg&name=large" 
                  alt="Goofy Footballers Werld Kup characters standing on top of planet earth with soccer balls" 
                  className="w-full h-full object-cover scale-102 hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="mt-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-center">
                <p className="text-xs sm:text-sm text-yellow-500 font-bold uppercase tracking-wider font-mono">
                  THE WERLD KUP 2026 NOMINEES
                </p>
                <p className="text-[11px] sm:text-xs text-slate-400 font-comic italic mt-1 leading-snug">
                  "Standing awkwardly on top of planet Earth, miscalculating physical gravity vectors, ready to deliver absolute retard on-field entertainment."
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Immersive Mobile Video Section mimicking a premium smartphone frame */}
      <section className="py-16 bg-emerald-950/10 border-y border-emerald-900/20 overflow-hidden relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="space-y-3">
            <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase inline-block">
              ✦ Exclusive Leaked Broadcast ✦
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-sans text-slate-100 tracking-tight">
              WERLD KUP <span className="text-rose-500 font-comic block sm:inline">SKILL MOVIE</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm font-comic">
              Captured on hidden cams inside the training compound. Tap on the handset to unmute standard sound.
            </p>
          </div>

          <div className="relative inline-block mx-auto">
            {/* Phone Bezel Layout */}
            <div className="relative w-64 sm:w-[290px] aspect-[9/16] bg-slate-950 rounded-[2.5rem] p-3 shadow-2xl border-[10px] border-slate-800 ring-4 ring-slate-900/40 relative z-10 overflow-hidden">
              
              {/* Dynamic Island Notched area */}
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-full z-30 flex items-center justify-between px-3.5 border border-slate-800/10">
                <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
                <span className="w-3 h-1 bg-slate-800 rounded-full"></span>
              </div>

              {/* Glossy Reflection overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/10 z-20"></div>

              {/* Autoplaying Loop Video */}
              <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-900 z-10">
                <video 
                  ref={videoRef}
                  src="https://berjrozgwqoqpeqozceu.supabase.co/storage/v1/object/public/werld/Werld_Kup_-_Skill_Commitment_Pride_WERLDKUP_2026_4yBfVtYnWnrJRQhzjS3ZWzMPntCu7_4WDXMC.mp4"
                  autoPlay
                  loop
                  muted={videoMuted}
                  playsInline
                  onClick={toggleVideoMute}
                  className="w-full h-full object-cover cursor-pointer"
                />

                {/* Unmute floating badge warning */}
                {videoMuted && (
                  <div 
                    onClick={toggleVideoMute}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-md border border-slate-800 py-2 px-3.5 rounded-xl text-yellow-500 text-[10px] font-mono font-black uppercase tracking-widest cursor-pointer shadow-lg animate-bounce select-none flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span className="animate-pulse">🔊</span>
                    <span>TAP VIDEO TO UNMUTE</span>
                  </div>
                )}
              </div>

              {/* Volume & power hardware visual side shadows */}
              <div className="absolute top-24 -left-3 w-1 h-10 bg-slate-700/80 rounded-r"></div>
              <div className="absolute top-36 -left-3 w-1 h-8 bg-slate-700/80 rounded-r"></div>
              <div className="absolute top-44 -left-3 w-1 h-8 bg-slate-700/80 rounded-r"></div>
              <div className="absolute top-28 -right-3 w-1 h-12 bg-slate-700/80 rounded-l"></div>
            </div>

            {/* Glowing ring under the video structure */}
            <div className="absolute inset-10 bg-rose-500/10 rounded-[3rem] blur-2xl -z-10 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Endless Scroll Carousel line 1 */}
      <TickerBar />

      {/* Interactive Tactics Section */}
      <section id="simulator" className="py-20 px-4 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase">
            ✦ Tactics Board ✦
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-3 font-comic text-yellow-400 tracking-tight">
            MANAGER TRASH PANEL
          </h2>
          <p className="mt-2 text-slate-400 max-w-xl mx-auto text-sm sm:text-base font-comic">
            Customize coordinates of the elite squad or launch uncoordinated pitch actions to boost on-chain sentiment indexes.
          </p>
        </div>

        {/* Tactical Simulator Grid with commentary on sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="xl:col-span-8">
            <LineupSimulator />
          </div>
          <div className="xl:col-span-4 flex flex-col gap-6 justify-start">
            <LiveCommentary />
            <SoundBoard />
          </div>
        </div>
      </section>

      {/* Another Marquee Scrolling Band */}
      <TickerBar reverse={true} />

      {/* Infinite scrolling dual-marquee Meme library */}
      <MemeCarousel />

      {/* Live Chart Section */}
      <LiveChart />

      {/* How to Buy Section */}
      <HowToBuy />

      {/* Milestones Roadmap */}
      <Roadmap />

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-[#030f05]/80 border-t border-emerald-950/80 relative backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-2xs font-mono font-black tracking-widest uppercase">
              ✦ Common Queries ✦
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3 font-comic text-yellow-400 tracking-tight">
              FREQUENTLY RETARD QUESTIONS
            </h2>
            <p className="mt-2 text-slate-400 text-xs sm:text-sm font-comic">
              Everything you ever wanted to know but were too smart to ask, compiled by our specialized committee.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => {
              const isOpen = faqOpen === item.id;
              return (
                <div 
                  key={item.id}
                  className={`bg-slate-900/60 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    isOpen ? 'border-yellow-400 bg-slate-900' : 'border-slate-800'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full px-6 py-4.5 text-left flex justify-between items-center gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-slate-150 font-comic text-sm sm:text-base tracking-wide uppercase flex items-center gap-2">
                      <HelpCircle size={16} className="text-yellow-400 shrink-0" /> {item.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={20} className="text-yellow-400" />
                    ) : (
                      <ChevronDown size={20} className="text-slate-400 hover:text-white" />
                    )}
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-slate-350 font-comic leading-relaxed border-t border-slate-800/60 pt-4 bg-slate-950/40 relative">
                      <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none text-4xl">⚽</div>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SUI Footer signature */}
      <footer className="bg-[#020a03]/95 border-t border-emerald-950/80 py-12 px-4 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="overflow-hidden w-9 h-9 rounded-full border border-emerald-500 bg-slate-900">
                <img 
                  src="https://pbs.twimg.com/media/HJC_5Z-bsAAbVVp?format=jpg&name=small" 
                  alt="Werld Kup logo footer" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-sm font-comic text-yellow-400 tracking-tight">WERLD KUP 2026</h4>
                <p className="text-[10px] font-mono text-emerald-400 uppercase font-black">SOLANA MEMECOIN TRIBUTE</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed font-comic max-w-sm">
              We are soccer enthusiasts, we roll, we kick ball forward, we miscalculate physical gravity vector formulas. Connect on Solana with zero brains.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-2 text-xs">
            <span className="text-[10px] text-slate-400 font-mono font-black uppercase tracking-widest block">
              COGNITIVE COMPLIANCE STATEMENT
            </span>
            <p className="text-rose-500/70 leading-relaxed font-comic max-w-md italic">
              "Disclaimer: $WERLDKUP has zero affiliation, backing, agreement, or correlation with FIFA, the 2026 World Cup, any professional athletes, or physical football associations. It is a 100% entertainment tribute to hilarious football characters and physical rotational roll cycles."
            </p>
          </div>

          <div className="lg:col-span-3 space-y-3 lg:text-right">
            <span className="text-[10px] text-slate-400 font-mono font-black uppercase tracking-widest block">
              FOOTBALL CHANNELS
            </span>
            <div className="flex lg:justify-end gap-2">
              <a
                href={TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playWhistle()}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-yellow-400 px-4 py-2 rounded-xl text-xs font-mono font-bold font-comic text-slate-350 inline-flex items-center gap-1.5 transition-all"
              >
                Twitter Channel
              </a>
              <a
                href={PUMP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playWhistle()}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs font-comic transition-all"
              >
                Pump Exchange
              </a>
            </div>
            <p className="text-[10px] text-slate-600 font-mono">
              © 2026 Werld Kup Team. Under license of uncertified referees.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
