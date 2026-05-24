import React, { useState, useEffect, useRef } from 'react';
import { CONTRACT_ADDRESS, DEXSCREENER_URL, PUMP_URL } from '../data';
import { ExternalLink, TrendingUp, Info, Activity, Layers, LineChart as LineChartIcon, EyeOff } from 'lucide-react';
import { playWhistle } from '../utils/audio';

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  time: string;
}

export default function LiveChart() {
  const [activeViewTab, setActiveViewTab] = useState<'interactive' | 'embed'>('interactive');
  const [timeframe, setTimeframe] = useState<'1M' | '5M' | '15M' | '1H' | '1D'>('5M');
  const [showRma, setShowRma] = useState(true);
  const [showNbp, setShowNbp] = useState(false);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [mouseY, setMouseY] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Pre-populate realistic candlestick history starting around $0.00320
  const [candles, setCandles] = useState<Candle[]>(() => {
    let basePrice = 0.00320;
    return Array.from({ length: 30 }).map((_, i) => {
      const open = basePrice + (Math.random() - 0.46) * 0.00025;
      const close = open + (Math.random() - 0.5) * 0.00035;
      const high = Math.max(open, close) + Math.random() * 0.00012;
      const low = Math.min(open, close) - Math.random() * 0.00012;
      const volume = Math.floor(12000 + Math.random() * 85000);
      basePrice = close;

      const d = new Date(Date.now() - (30 - i) * 5 * 60 * 1000);
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return { open, close, high, low, volume, time: timeStr };
    });
  });

  // Real-time ticking effect: fluctuates the latest candle values
  useEffect(() => {
    const timer = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const next = [...prev];
        const lastIdx = next.length - 1;
        const last = next[lastIdx];

        // Small random walk on price to simulate standard tick feed
        const fluctuation = (Math.random() - 0.48) * 0.00007;
        const nextClose = last.close + fluctuation;
        const nextHigh = Math.max(last.high, nextClose, last.open);
        const nextLow = Math.min(last.low, nextClose, last.open);
        const nextVolume = last.volume + Math.floor(Math.random() * 1500);

        next[lastIdx] = {
          ...last,
          close: parseFloat(nextClose.toFixed(6)),
          high: parseFloat(nextHigh.toFixed(6)),
          low: parseFloat(nextLow.toFixed(6)),
          volume: nextVolume,
        };
        return next;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Handler for periodic new candle creation (every 40 seconds to simulate scroll)
  useEffect(() => {
    const timer = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const open = last.close;
        const close = open + (Math.random() - 0.49) * 0.0002;
        const high = Math.max(open, close) + Math.random() * 0.0001;
        const low = Math.min(open, close) - Math.random() * 0.0001;
        const volume = Math.floor(8000 + Math.random() * 50000);
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const nextCandles = [...prev.slice(1), { open, close, high, low, volume, time: timeStr }];
        return nextCandles;
      });
    }, 45000);

    return () => clearInterval(timer);
  }, []);

  // Update chart variables when timeframe is clicked to give different dynamic charts
  const handleTimeframeChange = (tf: typeof timeframe) => {
    setTimeframe(tf);
    const multiplier = tf === '1M' ? 0.3 : tf === '5M' ? 1.0 : tf === '15M' ? 1.8 : tf === '1H' ? 4.5 : 12.0;
    let basePrice = 0.00280 * multiplier;
    const randomized = Array.from({ length: 30 }).map((_, i) => {
      const open = basePrice + (Math.random() - 0.46) * 0.00025 * multiplier;
      const close = open + (Math.random() - 0.5) * 0.00035 * multiplier;
      const high = Math.max(open, close) + Math.random() * 0.00012 * multiplier;
      const low = Math.min(open, close) - Math.random() * 0.00012 * multiplier;
      const volume = Math.floor(15000 + Math.random() * 95000);
      basePrice = close;

      const d = new Date(Date.now() - (30 - i) * (tf === '1D' ? 24 * 60 : 5) * 60 * 1000);
      const timeStr = tf === '1D' 
        ? d.toLocaleDateString([], { month: 'short', day: '2-digit' })
        : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return { open, close, high, low, volume, time: timeStr };
    });
    setCandles(randomized);
    setHoveredCandle(null);
    setHoveredIndex(null);
  };

  // Realistic looking retard-coin mock trade feed
  const mockTrades = [
    { type: 'buy', amount: '22.4 SOL', tokens: '410,210', time: '1s ago', tx: '6fBx...a9Kp' },
    { type: 'buy', amount: '8.1 SOL', tokens: '148,500', time: '4s ago', tx: '8KpL...99xY' },
    { type: 'sell', amount: '0.1 SOL', tokens: '1,820', time: '12s ago', tx: '2vPt...88zQ' },
    { type: 'buy', amount: '45.0 SOL', tokens: '822,100', time: '20s ago', tx: '1sWq...d4mN' },
    { type: 'buy', amount: '1.2 SOL', tokens: '21,900', time: '35s ago', tx: '9mKz...a11K' },
    { type: 'sell', amount: '15.5 SOL', tokens: '280,000', time: '1m ago', tx: '5vBx...01pQ' }
  ];

  // SVG Chart layout boundaries
  const width = 850;
  const height = 310;
  const paddingLeft = 50;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 25;

  const chartInnerWidth = width - paddingLeft - paddingRight;
  const chartInnerHeight = height - paddingTop - paddingBottom;

  // Calculate scaling factors
  const pricesRangeArray = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...pricesRangeArray) * 0.985;
  const maxPrice = Math.max(...pricesRangeArray) * 1.015;
  const priceDiff = maxPrice - minPrice || 0.0001;

  // Converts a price value to SVG Y coordinate
  const valToY = (price: number) => {
    return height - paddingBottom - ((price - minPrice) / priceDiff) * chartInnerHeight;
  };

  // Converts a index to SVG X coordinate
  const indexToX = (index: number) => {
    return paddingLeft + (index / (candles.length - 1)) * chartInnerWidth;
  };

  // Track hover coordinate
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert pixel coordinate back to candle index
    const clientXPercent = (x - paddingLeft) / chartInnerWidth;
    let idx = Math.round(clientXPercent * (candles.length - 1));
    idx = Math.max(0, Math.min(candles.length - 1, idx));

    setMouseX(x);
    setMouseY(y);
    setHoveredIndex(idx);
    setHoveredCandle(candles[idx]);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
    setMouseY(null);
    setHoveredIndex(null);
    setHoveredCandle(null);
  };

  // Generate Retard Moving Average pointer line (RMA is a wavy smoothed line)
  const rmaPoints = candles.map((c, i) => {
    // 5-period dynamic average
    const start = Math.max(0, i - 4);
    const sub = candles.slice(start, i + 1);
    const avg = sub.reduce((acc, curr) => acc + curr.close, 0) / sub.length;
    return { x: indexToX(i), y: valToY(avg) };
  });

  // Generate Neymar volatile rebound ribbon predictor calculations
  const nbpPoints = candles.map((c, i) => {
    const baseline = c.close - (Math.sin(i * 0.9) * 0.00015);
    return { x: indexToX(i), y: valToY(baseline) };
  });

  const latestCandle = candles[candles.length - 1] || { close: 0.00320 };
  const lastPriceFormatted = latestCandle.close.toFixed(5);
  const isUpLatest = latestCandle.close >= latestCandle.open;

  return (
    <section id="chart" className="py-12 bg-slate-900/60 border-y-4 border-emerald-950 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-6">
          <div>
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase">
              ✦ Live Action Chart Feed ✦
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold mt-2 tracking-tight font-comic text-yellow-400">
              WERLD KUP CHART DATA
            </h2>
            <p className="mt-1.5 text-slate-400 max-w-xl text-xs sm:text-sm font-comic leading-tight">
              Observe modern decentralized long-neck candles, fully compatible with local preview. Green candles rise like CR7, red ones slide like Neymar.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <a
              href={DEXSCREENER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playWhistle()}
              className="bg-slate-950 border border-slate-850 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 text-3xs sm:text-2xs font-bold font-mono px-3 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow"
            >
              <ExternalLink size={12} /> External DexScreener
            </a>
            <a
              href={PUMP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playWhistle()}
              className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-3xs sm:text-2xs font-extrabold font-mono px-3.5 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-md"
            >
              <TrendingUp size={12} /> Buy on pump.fun
            </a>
          </div>
        </div>

        {/* Dashboard Grid panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Main Chart Terminal Container */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-850 flex flex-col shadow-2xl overflow-hidden min-h-[440px]">
            
            {/* Top Toolbar Navigation within Chart Panel */}
            <div className="bg-slate-900 border-b border-slate-850 p-3.5 flex flex-wrap gap-3 justify-between items-center z-10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="font-mono text-xs font-extrabold text-slate-200 uppercase tracking-widest">$WERLDKUP / SOL</span>
                <span className={`font-mono text-2xs font-black px-1.5 py-0.5 rounded tracking-normal ${isUpLatest ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  ${lastPriceFormatted}
                </span>
              </div>

              {/* View switches to solve browser sandbox blocking issues */}
              <div className="flex items-center gap-1.5 bg-slate-950 rounded-xl p-1 border border-slate-850">
                <button
                  onClick={() => setActiveViewTab('interactive')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-3xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                    activeViewTab === 'interactive'
                      ? 'bg-yellow-400 text-slate-950'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  <Activity size={10} />
                  <span>LIVE TRADER FEED</span>
                </button>
                <button
                  onClick={() => setActiveViewTab('embed')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-3xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                    activeViewTab === 'embed'
                      ? 'bg-yellow-400 text-slate-950'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  <Layers size={10} />
                  <span>DEX EMBED</span>
                </button>
              </div>
            </div>

            {/* Render Tab 1: Highly interactive, beautiful live custom candlestick chart */}
            {activeViewTab === 'interactive' && (
              <div className="flex-1 flex flex-col p-4 bg-slate-950 select-none">
                
                {/* Timeframes and Technical overlays controls row */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/40 p-2.5 rounded-xl border border-slate-900">
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
                    {(['1M', '5M', '15M', '1H', '1D'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => handleTimeframeChange(tf)}
                        className={`w-8 h-6 rounded font-mono text-3xs font-bold transition-all cursor-pointer ${
                          timeframe === tf
                            ? 'bg-slate-800 text-yellow-400 font-extrabold'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>

                  {/* Indicators toggles */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowRma(!showRma)}
                      className={`px-2.5 py-1 rounded font-mono text-3xs font-extrabold transition-all flex items-center gap-1 cursor-pointer border ${
                        showRma 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/25' 
                          : 'bg-transparent text-slate-600 border-slate-900'
                      }`}
                      title="Retard Moving Average - Smooth consensus"
                    >
                      <LineChartIcon size={9} />
                      <span>RMA INDICATOR</span>
                    </button>
                    <button
                      onClick={() => setShowNbp(!showNbp)}
                      className={`px-2.5 py-1 rounded font-mono text-3xs font-extrabold transition-all flex items-center gap-1 cursor-pointer border ${
                        showNbp 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/25' 
                          : 'bg-transparent text-slate-600 border-slate-900'
                      }`}
                      title="Neymar Bounce Predictor - Volatility metric"
                    >
                      <Layers size={9} />
                      <span>NEYMAR RIBBON</span>
                    </button>
                  </div>
                </div>

                {/* Live values ribbon: either under crosshair or current values */}
                <div className="grid grid-cols-5 gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-850/60 font-mono text-4xs min-h-[34px] items-center mb-3">
                  {(() => {
                    const active = hoveredCandle || latestCandle;
                    const isUp = active.close >= active.open;
                    return (
                      <>
                        <div className="text-slate-500 font-black">
                          TIME: <span className="text-slate-300 font-extrabold">{active.time}</span>
                        </div>
                        <div className="text-slate-500 font-black">
                          O: <span className="text-sky-300 font-bold">${active.open.toFixed(5)}</span>
                        </div>
                        <div className="text-slate-500 font-black">
                          H: <span className="text-emerald-400 font-bold">${active.high.toFixed(5)}</span>
                        </div>
                        <div className="text-slate-500 font-black">
                          L: <span className="text-rose-450 font-bold">${active.low.toFixed(5)}</span>
                        </div>
                        <div className="text-slate-500 font-black">
                          C: <span className={isUp ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            ${active.close.toFixed(5)} ({isUp ? '+' : '-'}{Math.abs(((active.close - active.open)/active.open)*100).toFixed(1)}%)
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* SVG Candlestick layout container */}
                <div className="relative flex-1 bg-slate-950 min-h-[220px]">
                  <svg
                    ref={svgRef}
                    className="w-full h-full cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="none"
                  >
                    {/* Horizontal Price Grid Lines */}
                    {Array.from({ length: 5 }).map((_, i) => {
                      const p = minPrice + (i / 4) * priceDiff;
                      const y = valToY(p);
                      return (
                        <g key={i}>
                          <line
                            x1={paddingLeft}
                            y1={y}
                            x2={width - paddingRight}
                            y2={y}
                            stroke="#1e293b"
                            strokeWidth="1"
                            strokeDasharray="4,6"
                          />
                          <text
                            x={paddingLeft - 8}
                            y={y + 3.5}
                            fill="#475569"
                            fontSize="8.5"
                            fontWeight="bold"
                            fontFamily="monospace"
                            textAnchor="end"
                          >
                            ${p.toFixed(5)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Left/Right Vertical Grid lines */}
                    {candles.map((c, i) => {
                      if (i % 6 !== 0) return null;
                      const x = indexToX(i);
                      return (
                        <g key={i}>
                          <line
                            x1={x}
                            y1={paddingTop}
                            x2={x}
                            y2={height - paddingBottom}
                            stroke="#1e293b"
                            strokeWidth="1"
                            strokeDasharray="2,5"
                          />
                          <text
                            x={x}
                            y={height - paddingBottom + 12}
                            fill="#475569"
                            fontSize="8.5"
                            fontWeight="bold"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            {c.time}
                          </text>
                        </g>
                      );
                    })}

                    {/* Optional RMA indicator path overlay */}
                    {showRma && rmaPoints.length > 1 && (
                      <path
                        d={`M ${rmaPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        className="opacity-75"
                      />
                    )}

                    {/* Optional NBP volatile Ribbon path */}
                    {showNbp && nbpPoints.length > 1 && (
                      <path
                        d={`M ${nbpPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="1.8"
                        strokeDasharray="3,3"
                        className="opacity-70"
                      />
                    )}

                    {/* Draw each Candlestick */}
                    {candles.map((c, i) => {
                      const isUp = c.close >= c.open;
                      const x = indexToX(i);
                      const yOpen = valToY(c.open);
                      const yClose = valToY(c.close);
                      const yHigh = valToY(c.high);
                      const yLow = valToY(c.low);

                      const wickX = x;
                      const bodyY = Math.min(yOpen, yClose);
                      const bodyHeight = Math.max(1.5, Math.abs(yOpen - yClose));
                      const candleWidth = Math.max(2, (chartInnerWidth / candles.length) * 0.58);

                      const candleColor = isUp ? '#10b981' : '#f43f5e';
                      const isHovered = hoveredIndex === i;

                      return (
                        <g key={i} className="transition-all">
                          {/* High/Low thin wick line */}
                          <line
                            x1={wickX}
                            y1={yHigh}
                            x2={wickX}
                            y2={yLow}
                            stroke={candleColor}
                            strokeWidth={isHovered ? 2.5 : 1.5}
                          />
                          {/* Main candle body solid rectangle */}
                          <rect
                            x={x - candleWidth / 2}
                            y={bodyY}
                            width={candleWidth}
                            height={bodyHeight}
                            fill={candleColor}
                            stroke={isHovered ? '#ffffff' : 'none'}
                            strokeWidth="1.5"
                            className="transition-colors duration-150"
                          />

                          {/* Trigger point pulse overlay if it's the ticking last candle */}
                          {i === candles.length - 1 && (
                            <circle
                              cx={x}
                              cy={yClose}
                              r={6}
                              fill={candleColor}
                              opacity="0.32"
                              className="animate-ping"
                            />
                          )}
                        </g>
                      );
                    })}

                    {/* Interactive Hover crosshair pointer overlay */}
                    {mouseX !== null && mouseY !== null && (
                      <g className="pointer-events-none">
                        {/* Vertical line crosshair */}
                        <line
                          x1={mouseX}
                          y1={paddingTop}
                          x2={mouseX}
                          y2={height - paddingBottom}
                          stroke="#ef4444"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                        />
                        {/* Horizontal line crosshair */}
                        <line
                          x1={paddingLeft}
                          y1={mouseY}
                          x2={width - paddingRight}
                          y2={mouseY}
                          stroke="#ef4444"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                        />
                        {/* Hot point visual mark circle */}
                        {hoveredIndex !== null && (
                          <circle
                            cx={indexToX(hoveredIndex)}
                            cy={valToY(candles[hoveredIndex].close)}
                            r="5"
                            fill="#ef4444"
                            stroke="#fff"
                            strokeWidth="1.5"
                          />
                        )}
                      </g>
                    )}
                  </svg>

                  {/* Dynamic watermarks inside chart */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5">
                    <span className="font-comic font-black text-4xl sm:text-6xl text-slate-100 tracking-wider">
                      $WERLDKUP
                    </span>
                  </div>
                </div>

                {/* Sub-text footer details */}
                <div className="flex justify-between items-center mt-2.5 px-1 italic">
                  <span className="text-4xs text-slate-500 font-mono">
                    ✦ Simulated tick speed matches pump live logs. Hover anyway for smart OHLC metrics.
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-4xs text-slate-500 font-mono">5-Period Core RMA line</span>
                  </div>
                </div>

              </div>
            )}

            {/* Render Tab 2: Standard Embedded Dexscreener Frame */}
            {activeViewTab === 'embed' && (
              <div className="flex-1 w-full bg-slate-950 flex flex-col relative">
                
                {/* Warning notification explaining deep iframe limitations */}
                <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-2.5 px-4 flex items-start gap-2 text-yellow-400">
                  <Info size={14} className="mt-0.5 shrink-0" />
                  <p className="text-4xs font-mono leading-relaxed uppercase tracking-wider">
                    <strong>Browser Sandboxing Warning:</strong> Strict browsers block nested double-iframes. If the DexScreener page below is blank or fails, click the button below to view it natively on an outward tab!
                  </p>
                </div>

                {/* Standard frame frame block */}
                <div className="flex-1 h-[360px] relative bg-slate-950">
                  <iframe
                    src={`https://dexscreener.com/solana/${CONTRACT_ADDRESS}?embed=1&theme=dark&trades=0&info=0`}
                    title="Dexscreener Chart"
                    className="w-full h-full border-none absolute inset-0 text-slate-200"
                    allow="clipboard-write"
                  ></iframe>

                  {/* Fallback floating guide */}
                  <div className="absolute bottom-2 left-2 bg-slate-950/90 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-[9px] max-w-xs text-slate-400 pointer-events-none flex items-center gap-1 leading-none shadow-md">
                    <Info size={11} className="text-yellow-400 shrink-0" />
                    <span>Token: 4yBfV...pump</span>
                  </div>
                </div>

                {/* Deep Redirect Action Button */}
                <div className="p-3 bg-slate-900 border-t border-slate-850 flex items-center justify-between">
                  <span className="text-4xs font-mono text-slate-400">Can't load the chart container?</span>
                  <a
                    href={DEXSCREENER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-400 hover:bg-yellow-350 text-slate-950 px-3.5 py-1.5 rounded-lg text-3xs font-extrabold font-mono flex items-center gap-1 shadow-md transition-all uppercase"
                  >
                    <span>Launch True DexScreener</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar: Live Transactions feed on-chain and Contract Details */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="bg-slate-950 rounded-2xl border border-slate-850 p-4 shrink-0 flex-1 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-slate-850 pb-2">
                  <h3 className="font-black text-xs text-yellow-500 uppercase tracking-widest font-mono flex items-center gap-1">
                    <Activity size={12} className="text-emerald-400 shrink-0 animate-pulse" />
                    <span>TRADE ENGINE LIVE</span>
                  </h3>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>

                <div className="space-y-2.5">
                  {mockTrades.map((t, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-850/60 hover:border-slate-800 transition-all flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            t.type === 'buy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-rose-500/10 text-rose-450 border border-rose-500/25'
                          }`}>
                            {t.type.toUpperCase()}
                          </span>
                          <span className="font-mono text-2xs font-bold text-slate-200">{t.amount}</span>
                        </div>
                        <p className="text-[9px] font-mono text-slate-500 mt-1">Tx: {t.tx}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xs font-mono font-black text-slate-300">{t.tokens} KUP</div>
                        <span className="text-[9px] text-slate-500 font-mono block">{t.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-850">
                <div className="flex items-center gap-2 justify-center text-[10px] font-mono text-slate-500 bg-slate-900/50 py-2.5 px-3 rounded-xl border border-slate-900 italic text-center">
                  <span>⚽ Referee running liquidity validation bot on Solana blockchain.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
