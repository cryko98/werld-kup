import React, { useState, useEffect, useRef } from 'react';
import { playWhistle, playGoalHorn, playCoin } from '../utils/audio';
import { Trophy, RotateCcw, Volume2, Shield, Info, ArrowLeft, ArrowRight, Zap, Flame, Award } from 'lucide-react';

interface RetardPlayer {
  id: string;
  name: string;
  shirtColor: string;
  skinColor: string;
  hairStyle: 'swoop' | 'buzz' | 'ponytail' | 'headband' | 'pigeon' | 'dreads' | 'messi';
  shirtNumber: number;
  phrase: string;
  hasBeard?: boolean;
  hasLips?: boolean;
  eyeDirection?: 'left' | 'right';
  jerseyStyle?: 'portugal' | 'france' | 'norway' | 'brazil' | 'argentina' | 'spain';
}

export default function LineupSimulator() {
  const players: RetardPlayer[] = [
    {
      id: 'messi',
      name: "Ankara Messi",
      shirtColor: "#0284c7", // Argentina Light Blue
      skinColor: "#fcd34d", // Characteristic orange-tan tint
      hairStyle: 'messi',
      shirtNumber: 10,
      phrase: "Qué mirás bobo? Paste the contract address bobo!",
      hasBeard: true,
      eyeDirection: 'left',
      jerseyStyle: 'argentina'
    },
    {
      id: 'cr7',
      name: "Suiii Cristiano",
      shirtColor: "#b91c1c", // Portugal Red
      skinColor: "#f59e0b", // Golden orange skin
      hairStyle: 'swoop',
      shirtNumber: 7,
      phrase: "SUI!!! IS THAT WATER IN THE WATER BOTTLE??",
      eyeDirection: 'right',
      jerseyStyle: 'portugal'
    },
    {
      id: 'mbop',
      name: "Möbappe President",
      shirtColor: "#1d4ed8", // France Blue
      skinColor: "#854d0e", // Rich dark earth wood brown
      hairStyle: 'buzz',
      shirtNumber: 10,
      phrase: "I demand 90% of the Solana supply to complete this pass.",
      hasLips: true,
      eyeDirection: 'left',
      jerseyStyle: 'france'
    },
    {
      id: 'haaland',
      name: "Robot Haaland-9000",
      shirtColor: "#dc2626", // Norway Red
      skinColor: "#fef3c7", // Pale yellow/nordic skin
      hairStyle: 'ponytail',
      shirtNumber: 9,
      phrase: "BEEP BOOP battery is low. Ingest potato immediately.",
      eyeDirection: 'left',
      jerseyStyle: 'norway'
    },
    {
      id: 'neymar',
      name: "Rolling Neymar Jr",
      shirtColor: "#eab308", // Brazil Yellow
      skinColor: "#d97706", // Medium tan skin
      hairStyle: 'headband',
      shirtNumber: 10,
      phrase: "A gust of wind blew! I must roll 200 kilometers!",
      hasBeard: true,
      eyeDirection: 'right',
      jerseyStyle: 'brazil'
    },
    {
      id: 'nico',
      name: "Nico Williams 19",
      shirtColor: "#b91c1c", // Spain Red
      skinColor: "#78350f", // Deep brown skin
      hairStyle: 'dreads',
      shirtNumber: 19,
      phrase: "Bypassing defences at 200 retard speed, then crossing ball into tree branch.",
      eyeDirection: 'left',
      jerseyStyle: 'spain'
    }
  ];

  const [selectedPlayer, setSelectedPlayer] = useState<RetardPlayer>(players[0]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('werldkup_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [funnyCaption, setFunnyCaption] = useState("Tap to start the madness!");

  // Upgrade factors for meme value
  const [neckUpgrade, setNeckUpgrade] = useState(0); // taller neck
  const [headUpgrade, setHeadUpgrade] = useState(0); // bigger head collision
  const [ballSpeedMult, setBallSpeedMult] = useState(1);

  // Position coordinates inside the local SVG container (0 to 400 space)
  const [ball, setBall] = useState({ x: 200, y: 100, vx: 2, vy: 1 });
  const [playerX, setPlayerX] = useState(200);

  // References for game loop
  const requestRef = useRef<number | null>(null);
  const ballRef = useRef(ball);
  const playerXRef = useRef(playerX);
  const gameStartedRef = useRef(gameStarted);
  const gameOverRef = useRef(gameOver);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync refs to avoid re-running game-loop effect
  useEffect(() => {
    ballRef.current = ball;
    playerXRef.current = playerX;
    gameStartedRef.current = gameStarted;
    gameOverRef.current = gameOver;
  }, [ball, playerX, gameStarted, gameOver]);

  // Load high score
  useEffect(() => {
    localStorage.setItem('werldkup_highscore', highScore.toString());
  }, [highScore]);

  // Collisions and Physics Game Loop
  const updateLoop = () => {
    if (!gameStartedRef.current || gameOverRef.current) return;

    let { x, y, vx, vy } = ballRef.current;
    const px = playerXRef.current;

    // Gravity pull
    const gravity = 0.12 * ballSpeedMult;
    vy += gravity;

    // Position updates
    x += vx;
    y += vy;

    // Wall bounces
    if (x <= 15) {
      x = 15;
      vx = -vx * 0.9;
      playCoin();
    } else if (x >= 385) {
      x = 385;
      vx = -vx * 0.9;
      playCoin();
    }

    // Ceiling bounce
    if (y <= 15) {
      y = 15;
      vy = Math.abs(vy) * 0.9;
    }

    // Head collision specs
    const headRadius = 22 + headUpgrade * 4;
    const headY = 320 - neckUpgrade * 10; // head position goes up with neck upgrade
    const ballRadius = 14;

    // Distance calculation
    const dx = x - px;
    const dy = y - headY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Collision check!
    if (distance < (headRadius + ballRadius) && vy > 0) {
      // Successful Header bounce!
      y = headY - (headRadius + ballRadius);
      
      // Deflect ball depending on where it hit head
      const relativeHit = (x - px) / headRadius; // range -1 to 1
      vx = relativeHit * 4; 
      
      // Bounce upward with speed limit
      const minBounceForce = -5;
      const maxBounceForce = -7.5;
      const currentForce = minBounceForce - (score * 0.05); // get slightly faster
      vy = Math.max(maxBounceForce, currentForce);

      setScore(prev => {
        const next = prev + 1;
        if (next > highScore) {
          setHighScore(next);
        }
        
        // Milestone funny triggers
        if (next % 5 === 0) {
          playGoalHorn();
          const catchphrases = [
            `SUI!!! ${next} BOUNCES! CRISTIANO IS CRYING!`,
            `INVENTIVE DEFENSE! ${next} HEADS OF STATE!`,
            `THE REFEREE HAS CLOSED HIS EYES!`,
            `HAALAND IS 99% CHARGED!`,
            `NEYMAR ROLLED ONTO THE MOON!`,
            `NICO THREW SEEDS ON THE BALL!`
          ];
          setFunnyCaption(catchphrases[Math.floor(Math.random() * catchphrases.length)]);
        } else {
          playCoin();
          const simplePhrases = [
            "Boing!", "Incredible neck action!", "Pure retarded trajectory!",
            "Take that, FIFA!", "Zero braincells header!", "VAR is analyzing!"
          ];
          setFunnyCaption(simplePhrases[Math.floor(Math.random() * simplePhrases.length)]);
        }
        return next;
      });
    }

    // Drop to floor - Game Over
    if (y >= 395) {
      playWhistle();
      setGameOver(true);
      setGameStarted(false);
      setFunnyCaption("🔴 BALL LOST! Referee issued a red card. Play raw potato coin to insert coins!");
    }

    // Apply values to state
    setBall({ x, y, vx, vy });

    requestRef.current = requestAnimationFrame(updateLoop);
  };

  // Launch of request animation frame loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      requestRef.current = requestAnimationFrame(updateLoop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameStarted, gameOver, ballSpeedMult]);

  // Restart handler
  const handleStartGame = () => {
    setBall({
      x: 150 + Math.random() * 100,
      y: 50,
      vx: (Math.random() - 0.5) * 4,
      vy: 1
    });
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    playWhistle();
    setFunnyCaption("Bounce the ball on your head! Drag or tap controls below.");
  };

  // Handle Steering coordinates mapper
  const handleCenterPlayer = (relativeX: number) => {
    setPlayerX(Math.max(30, Math.min(370, relativeX)));
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xCoord = ((e.clientX - rect.left) / rect.width) * 400; // translate scale to 0-400
    handleCenterPlayer(xCoord);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const xCoord = ((touch.clientX - rect.left) / rect.width) * 400;
    handleCenterPlayer(xCoord);
  };

  // Upgrades
  const buyNeckUpgrade = () => {
    if (neckUpgrade < 5) {
      setNeckUpgrade(prev => prev + 1);
      playCoin();
    }
  };

  const buyHeadUpgrade = () => {
    if (headUpgrade < 5) {
      setHeadUpgrade(prev => prev + 1);
      playWhistle();
    }
  };

  return (
    <div className="bg-slate-950 border-4 border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="p-4 sm:p-6 md:p-8 relative z-10 space-y-6">
        
        {/* Banner with points stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="bg-rose-500/10 text-rose-400 text-3xs font-mono font-black tracking-widest px-3 py-1 rounded-full uppercase border border-rose-500/20">
              Interactive Mini Game
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-slate-100 font-comic mt-2">
              WERLD KUP HEAD-JUGGLER
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Test your physical neck rotation capability. Slide mouse/finger on field to steer player!
            </p>
          </div>

          <div className="flex gap-4 bg-slate-900 border-2 border-slate-800 rounded-2xl p-3 items-center justify-between md:justify-end">
            <div className="text-center px-2">
              <div className="text-[9px] text-slate-400 font-mono font-bold tracking-wider uppercase">BOUNCES</div>
              <div className="text-2xl sm:text-3xl font-black text-rose-500 font-mono">{score}</div>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-center px-2">
              <div className="text-[9px] text-slate-400 font-mono font-bold tracking-wider uppercase flex items-center gap-1">
                <Trophy size={10} className="text-yellow-400" /> BEST SCORE
              </div>
              <div className="text-2xl sm:text-3xl font-black text-yellow-500 font-mono">{highScore}</div>
            </div>
          </div>
        </div>

        {/* Game and Control layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Outer Game Container */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            
            {/* The SVG Game Arena */}
            <div 
              ref={containerRef}
              className="relative w-full aspect-[4/4] bg-slate-900 border-2 border-slate-800 rounded-2xl overflow-hidden select-none touch-none cursor-ew-resize soccer-pitch"
            >
              {/* Pitch lines & goal visuals drawn directly */}
              <div className="absolute inset-x-0 bottom-0 h-4 bg-emerald-500/10 border-t border-emerald-500/20"></div>
              <div className="absolute inset-x-0 top-1/2 border-t border-slate-800/30"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-slate-800/30 rounded-full"></div>

              {/* Vector SVG Space */}
              <svg 
                className="w-full h-full"
                viewBox="0 0 400 400"
                onPointerMove={handlePointerMove}
                onTouchMove={handleTouchMove}
              >
                {/* Visual Goal Net */}
                <path d="M 120,40 L 280,40 L 290,100 L 110,100 Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" strokeDasharray="3,3" />

                {/* Score badge in-game */}
                <text x="200" y="80" textAnchor="middle" fill="rgba(255,255,255,0.15)" className="font-mono text-5xl font-black">{score}</text>

                {/* Draw Player Neck + Head */}
                {(() => {
                  const headRadius = 24 + headUpgrade * 4;
                  const neckH = 65 + neckUpgrade * 10;
                  const headY = 320 - neckUpgrade * 10;
                  
                  // Eye positions: sideways look or dynamic ball-tracking look with offsets
                  const dx = ball.x - playerX;
                  const dy = ball.y - headY;
                  const angle = Math.atan2(dy, dx);
                  
                  // Eye offset coordinates for googly eyes
                  const lookOffsetX = selectedPlayer.eyeDirection === 'left' ? -3.5 : 3.5;
                  const pupilRelativeX = lookOffsetX + Math.cos(angle) * 1.5;
                  const pupilRelativeY = Math.sin(angle) * 1.5;

                  return (
                    <g>
                      {/* Torso: Beautifully curved organic shoulders and human torso shape */}
                      <path 
                        d={`M ${playerX - 48} 400 C ${playerX - 44} 345, ${playerX - 32} 335, ${playerX} 335 C ${playerX + 32} 335, ${playerX + 44} 345, ${playerX + 48} 400 Z`} 
                        fill={selectedPlayer.shirtColor} 
                        stroke="#090d16"
                        strokeWidth="3.5"
                      />

                      {/* Jersey Stripes & Details for ultimate authentic quality */}
                      {selectedPlayer.jerseyStyle === 'argentina' && (
                        <g>
                          {/* Light blue stripes overlaid on white base torso */}
                          <path d={`M ${playerX - 48} 400 C ${playerX - 44} 345, ${playerX - 32} 335, ${playerX} 335 C ${playerX + 32} 335, ${playerX + 44} 345, ${playerX + 48} 400 Z`} fill="#ffffff" stroke="#090d16" strokeWidth="3.5" />
                          <path d={`M ${playerX - 32} 398 L ${playerX - 25} 338 L ${playerX - 12} 336 L ${playerX - 16} 399 Z`} fill="#0ea5e9" />
                          <path d={`M ${playerX - 6} 399 L ${playerX - 5} 335 L ${playerX + 5} 335 L ${playerX + 6} 399 Z`} fill="#0ea5e9" />
                          <path d={`M ${playerX + 16} 399 L ${playerX + 12} 336 L ${playerX + 25} 338 L ${playerX + 32} 398 Z`} fill="#0ea5e9" />
                          {/* Golden AFA Shield on chest */}
                          <polygon points={`${playerX - 16},365 ${playerX - 8},365 ${playerX - 12},374`} fill="#eab308" />
                        </g>
                      )}

                      {selectedPlayer.jerseyStyle === 'brazil' && (
                        <g>
                          {/* Green sleeve cuffs and fine green V-neck collar */}
                          <path d={`M ${playerX - 16} 335 L ${playerX + 16} 335 L ${playerX} 355 Z`} fill="#15803d" />
                          <path d={`M ${playerX - 45} 370 L ${playerX - 48} 390 L ${playerX - 39} 385 Z`} fill="#15803d" />
                          <path d={`M ${playerX + 45} 370 L ${playerX + 48} 390 L ${playerX + 39} 385 Z`} fill="#15803d" />
                          {/* CBF crest badge */}
                          <circle cx={playerX - 16} cy={364} r="4.5" fill="#1d4ed8" />
                        </g>
                      )}

                      {selectedPlayer.jerseyStyle === 'france' && (
                        <g>
                          {/* White logo brand and fine collar detail */}
                          <path d={`M ${playerX - 12} 335 L ${playerX + 12} 335 L ${playerX} 346 Z`} fill="#ffffff" />
                          <path d={`M ${playerX} 335 L ${playerX} 346`} stroke="#ef4444" strokeWidth="2.5" />
                          {/* Rooster logo */}
                          <path d={`M ${playerX - 18} 360 Q ${playerX - 14} 360 ${playerX - 15} 366`} stroke="#ffffff" strokeWidth="2.5" fill="none" />
                        </g>
                      )}

                      {selectedPlayer.jerseyStyle === 'norway' && (
                        <g>
                          {/* Navy stripe down centered chest with white bordering */}
                          <rect x={playerX - 9} y="335" width="18" height="65" fill="#ffffff" />
                          <rect x={playerX - 4.5} y="335" width="9" height="65" fill="#1d4ed8" />
                        </g>
                      )}

                      {selectedPlayer.jerseyStyle === 'portugal' && (
                        <g>
                          {/* Green left side split jersey look */}
                          <path d={`M ${playerX - 48} 400 C ${playerX - 44} 345, ${playerX - 20} 335, ${playerX} 335 L ${playerX} 400 Z`} fill="#15803d" opacity="0.3" />
                          <circle cx={playerX - 15} cy={365} r="6" fill="#eab308" stroke="#b91c1c" strokeWidth="1.5" />
                        </g>
                      )}

                      {selectedPlayer.jerseyStyle === 'spain' && (
                        <g>
                          {/* Yellow collar trim and gold crest */}
                          <path d={`M ${playerX - 14} 335 L ${playerX + 14} 335 L ${playerX} 348 Z`} fill="#eab308" />
                          <rect x={playerX - 18} y="362" width="6" height="8" fill="#eab308" />
                        </g>
                      )}

                      {/* Collar background behind neck base */}
                      <ellipse cx={playerX} cy="336" rx="14" ry="5.5" fill="#090d16" />

                      {/* Thick, funny, organically-bent, slanted meme-neck */}
                      <path 
                        d={`M ${playerX} 337 Q ${playerX + 10} ${(337 + headY) / 2}, ${playerX - 2} ${headY + 12}`}
                        stroke={selectedPlayer.skinColor} 
                        strokeWidth={17 + headUpgrade} 
                        strokeLinecap="round"
                        fill="none"
                      />
                      {/* Neck outline to add real human structure definition */}
                      <path 
                        d={`M ${playerX} 337 Q ${playerX + 10} ${(337 + headY) / 2}, ${playerX - 2} ${headY + 12}`}
                        stroke="#090d16" 
                        strokeWidth={17 + headUpgrade + 4.5} 
                        strokeLinecap="round"
                        fill="none"
                        style={{ zIndex: -1, pointerEvents: 'none' }}
                      />
                      {/* Re-draw inner neck over top of the black boundary to mask it cleanly */}
                      <path 
                        d={`M ${playerX} 337 Q ${playerX + 10} ${(337 + headY) / 2}, ${playerX - 2} ${headY + 12}`}
                        stroke={selectedPlayer.skinColor} 
                        strokeWidth={17 + headUpgrade} 
                        strokeLinecap="round"
                        fill="none"
                      />

                      {/* The Head Skull: Sideways-elongated oval/ellipse representing the hand-drawn style */}
                      <ellipse 
                        cx={playerX - 3} 
                        cy={headY} 
                        rx={headRadius * 1.08} 
                        ry={headRadius * 0.94} 
                        fill={selectedPlayer.skinColor} 
                        stroke="#090d16" 
                        strokeWidth="3.5" 
                      />

                      {/* Custom Facial Hair wrapping underneath the jawline */}
                      {selectedPlayer.hasBeard && (
                        <path 
                          d={`M ${playerX - headRadius - 1.5} ${headY + 3} Q ${playerX - 3} ${headY + headRadius + 4.5} ${playerX + headRadius + 1.5} ${headY + 3} Q ${playerX + headRadius - 4} ${headY + headRadius - 2.5} ${playerX - 3} ${headY + headRadius - 1} Q ${playerX - headRadius + 4} ${headY + headRadius - 2.5} ${playerX - headRadius - 1.5} ${headY + 3}`}
                          fill="#18181b" 
                          stroke="#090d16" 
                          strokeWidth="1.5" 
                        />
                      )}

                      {/* Retard Googly Eyes looking incredibly stupid & sideways */}
                      {/* Left Eye background */}
                      <circle cx={playerX - 10} cy={headY - 6} r="8.5" fill="white" stroke="#090d16" strokeWidth="2.5" />
                      {/* Right Eye background - placed overlapping close in true retard fashion */}
                      <circle cx={playerX + 4} cy={headY - 6} r="8.5" fill="white" stroke="#090d16" strokeWidth="2.5" />
                      
                      {/* Tiny black pupils looking in absolute confusion */}
                      <circle cx={playerX - 10 + pupilRelativeX} cy={headY - 6 + pupilRelativeY} r="2.5" fill="#000" />
                      <circle cx={playerX + 4 + pupilRelativeX} cy={headY - 6 + pupilRelativeY} r="2.5" fill="#000" />

                      {/* Thick, funny pink lips specifically for Mbop */}
                      {selectedPlayer.hasLips ? (
                        <g>
                          {/* Large bottom lip */}
                          <ellipse cx={playerX - 4} cy={headY + 11} rx="9.5" ry="4" fill="#fda4af" stroke="#e11d48" strokeWidth="1.5" />
                          {/* Thin smile line on top */}
                          <path d={`M ${playerX - 13} ${headY + 8} Q ${playerX - 4} ${headY + 12} ${playerX + 5} ${headY + 8}`} fill="none" stroke="#27272a" strokeWidth="2.2" strokeLinecap="round" />
                        </g>
                      ) : (
                        /* Flat simple look - empty mouth */
                        <path d={`M ${playerX - 10} ${headY + 9} Q ${playerX - 3} ${headY + 13} ${playerX + 4} ${headY + 9}`} fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
                      )}

                      {/* HAIR STYLING VECTORS FOR AUTHENTIC RESEMBLANCE */}
                      {/* Ankara Messi Hair definition */}
                      {selectedPlayer.hairStyle === 'messi' && (
                        <g>
                          <path 
                            d={`M ${playerX - 25} ${headY - 12} Q ${playerX - 16} ${headY - 29} ${playerX - 1} ${headY - 26} Q ${playerX + 15} ${headY - 29} ${playerX + 23} ${headY - 13} Q ${playerX + 10} ${headY - 14} ${playerX - 25} ${headY - 12}`} 
                            fill="#451a03" 
                            stroke="#1c1917" 
                            strokeWidth="1.5" 
                          />
                        </g>
                      )}

                      {/* CR7 Swoosh Hair definition */}
                      {selectedPlayer.hairStyle === 'swoop' && (
                        <path 
                          d={`M ${playerX - 23} ${headY - 13} Q ${playerX - 8} ${headY - 32} ${playerX + 19} ${headY - 19} Q ${playerX + 6} ${headY - 15} ${playerX - 23} ${headY - 13}`} 
                          fill="#18181b" 
                          stroke="#020617" 
                          strokeWidth="1.5" 
                        />
                      )}

                      {/* Mbappe low gray buzzcut hair */}
                      {selectedPlayer.hairStyle === 'buzz' && (
                        <path 
                          d={`M ${playerX - 24} ${headY - 7} A 23.5 21.5 0 0 1 ${playerX + 18} ${headY - 7} Z`} 
                          fill="#1c1917" 
                          opacity="0.92" 
                        />
                      )}

                      {/* Robot Haaland Yellow strands and lock bound on top */}
                      {selectedPlayer.hairStyle === 'ponytail' && (
                        <g>
                          <path d={`M ${playerX - 19} ${headY - 13} Q ${playerX - 2} ${headY - 29} ${playerX + 17} ${headY - 13}`} stroke="#fbbf24" strokeWidth="5.5" fill="none" strokeLinecap="round" />
                          <circle cx={playerX - 2} cy={headY - 26} r="6" fill="#fbbf24" stroke="#ca8a04" strokeWidth="1.5" />
                          <rect x={playerX - 6} y={headY - 25} width="8" height="4.5" fill="#ef4444" rx="1" />
                        </g>
                      )}

                      {/* Neymar Headband style layout */}
                      {selectedPlayer.hairStyle === 'headband' && (
                        <g>
                          <rect x={playerX - headRadius + 1} y={headY - 14} width={(headRadius * 2) - 3} height="8" fill="#e11d48" rx="2" stroke="#000" strokeWidth="1.8" />
                          <circle cx={playerX - 1} cy={headY - 10} r="3" fill="white" />
                        </g>
                      )}

                      {/* Nico Williams 19 Curly Dreadlocks with Gold Tips */}
                      {selectedPlayer.hairStyle === 'dreads' && (
                        <g>
                          {/* Left-side dread strands hanging down */}
                          <path d={`M ${playerX - 12} ${headY - 14} Q ${playerX - 20} ${headY - 30} ${playerX - 24} ${headY - 12}`} stroke="#451a03" strokeWidth="4.2" strokeLinecap="round" fill="none" />
                          <circle cx={playerX - 24} cy={headY - 12} r="2.8" fill="#eab308" />
                          
                          <path d={`M ${playerX - 3} ${headY - 16} Q ${playerX - 8} ${headY - 33} ${playerX - 11} ${headY - 17}`} stroke="#27272a" strokeWidth="4" strokeLinecap="round" fill="none" />
                          <circle cx={playerX - 11} cy={headY - 17} r="2.5" fill="#eab308" />

                          <path d={`M ${playerX + 5} ${headY - 15} Q ${playerX + 11} ${headY - 31} ${playerX + 13} ${headY - 13}`} stroke="#451a03" strokeWidth="4" strokeLinecap="round" fill="none" />
                          <circle cx={playerX + 13} cy={headY - 13} r="2.5" fill="#eab308" />

                          <path d={`M ${playerX + 13} ${headY - 13} Q ${playerX + 22} ${headY - 28} ${playerX + 23} ${headY - 10}`} stroke="#27272a" strokeWidth="4.2" strokeLinecap="round" fill="none" />
                          <circle cx={playerX + 23} cy={headY - 10} r="2.8" fill="#fbbf24" />
                        </g>
                      )}

                      {/* Fallback Pigeon rendering details */}
                      {selectedPlayer.hairStyle === 'pigeon' && (
                        <g>
                          <polygon points={`${playerX},${headY + 4} ${playerX + 22},${headY + 8} ${playerX},${headY + 14}`} fill="#f97316" stroke="#000" strokeWidth="1" />
                          <path d={`M ${playerX - 6} ${headY - 21} Q ${playerX - 12} ${headY - 32} ${playerX - 3} ${headY - 24}`} stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
                          <path d={`M ${playerX} ${headY - 22} Q ${playerX} ${headY - 35} ${playerX + 4} ${headY - 24}`} stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
                        </g>
                      )}

                      {/* Elegant large jersey number placed right on front-center of chest */}
                      <text 
                        x={playerX} 
                        y="378" 
                        fill="#090d16" 
                        fontSize="14" 
                        fontWeight="1000" 
                        textAnchor="middle" 
                        fontFamily="monospace"
                        opacity="0.18"
                      >
                        {selectedPlayer.shirtNumber}
                      </text>
                    </g>
                  );
                })()}

                {/* Draw the Soccer Ball */}
                <g>
                  {/* Outer shadow glow */}
                  <circle cx={ball.x} cy={ball.y} r="14" fill="#fff" stroke="#000" strokeWidth="2.5" />
                  
                  {/* Soccer ball polygon meshes */}
                  <path d={`M ${ball.x - 3} ${ball.y - 12} L ${ball.x + 3} ${ball.y - 12} L ${ball.x + 6} ${ball.y - 6} L ${ball.x} ${ball.y - 2} L ${ball.x - 6} ${ball.y - 6} Z`} fill="#000" />
                  <path d={`M ${ball.x - 14} ${ball.y} L ${ball.x - 9} ${ball.y + 2} L ${ball.x - 6} ${ball.y - 6} L ${ball.x - 11} ${ball.y - 8} Z`} fill="#000" />
                  <path d={`M ${ball.x + 14} ${ball.y} L ${ball.x + 9} ${ball.y + 2} L ${ball.x + 6} ${ball.y - 6} L ${ball.x + 11} ${ball.y - 8} Z`} fill="#000" />
                  <path d={`M ${ball.x - 6} ${ball.y + 11} L ${ball.x + 6} ${ball.y + 11} L ${ball.x + 9} ${ball.y + 2} L ${ball.x} ${ball.y - 2} L ${ball.x - 9} ${ball.y + 2} Z`} fill="#000" />
                  
                  {/* Gloss highlight */}
                  <circle cx={ball.x - 4} cy={ball.y - 6} r="3" fill="#fff" opacity="0.4" />
                </g>
              </svg>

              {/* Start overlay screen */}
              {!gameStarted && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 text-3xl animate-bounce">
                    ⚽
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black font-comic text-yellow-400 uppercase">
                    {gameOver ? "RED CARD! TRY AGAIN" : "START HEADING TOURNAMENT"}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-comic mt-2">
                    {gameOver ? `You juggled the ball successfully ${score} times before falling down. Ingest more Solana potatoes.` : "Steer your long neck left & right. Do not let the ball drop on FIFA taxes!"}
                  </p>

                  <button
                    onClick={handleStartGame}
                    className="mt-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-sm font-comic tracking-wide transition-all scale-102 hover:scale-105 active:scale-95 shadow-lg cursor-pointer flex items-center gap-2"
                  >
                    {gameOver ? "INSERT SOL FLIP" : "KICK KOFF ($WERLDKUP)"}
                  </button>

                  <div className="mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest flex gap-2">
                    <span>🖱️ Drag Mouse</span>
                    <span>•</span>
                    <span>📱 Swipe Finger</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tap/Click Action Buttons for Mobile Users who don't want to drag */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onTouchStart={() => handleCenterPlayer(Math.max(30, playerX - 35))}
                onClick={() => handleCenterPlayer(Math.max(30, playerX - 35))}
                className="bg-slate-900 hover:bg-slate-800 text-slate-350 p-3 rounded-xl border border-slate-800 flex items-center justify-center gap-1 text-xs font-bold transition-all active:bg-emerald-500 active:text-slate-950 select-none cursor-pointer"
              >
                <ArrowLeft size={16} /> STEER LEFT
              </button>
              <button
                onTouchStart={() => handleCenterPlayer(Math.min(370, playerX + 35))}
                onClick={() => handleCenterPlayer(Math.min(370, playerX + 35))}
                className="bg-slate-900 hover:bg-slate-800 text-slate-350 p-3 rounded-xl border border-slate-800 flex items-center justify-center gap-1 text-xs font-bold transition-all active:bg-emerald-500 active:text-slate-950 select-none cursor-pointer"
              >
                STEER RIGHT <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Character Selection & Meme Upgrades */}
          <div className="lg:col-span-5 flex flex-col justify-start gap-4">
            
            {/* Live commentary display */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative">
              <span className="absolute -top-3 left-4 bg-yellow-400 text-slate-950 text-3xs font-mono font-black px-2 py-0.5 rounded uppercase tracking-wider">
                REF REPLAY SYSTEM
              </span>
              <p className="text-slate-200 text-xs sm:text-sm font-comic italic leading-relaxed pt-1">
                "{funnyCaption}"
              </p>
            </div>

            {/* Character list selector */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-widest block">
                CHOOSE SQUAD MEMBER:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-2">
                {players.map((item) => {
                  const isCur = selectedPlayer.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedPlayer(item);
                        playWhistle();
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        isCur 
                          ? 'bg-slate-900 border-yellow-400 scale-[1.01] shadow-md' 
                          : 'bg-slate-950 border-slate-850 hover:border-slate-800 hover:bg-slate-900/40'
                      }`}
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-inner font-black shrink-0 relative"
                        style={{ backgroundColor: item.shirtColor }}
                      >
                        <span className="text-white text-xs font-mono">#{item.shirtNumber}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-100 font-comic tracking-wide leading-tight truncate">
                            {item.name}
                          </span>
                          {isCur && (
                            <span className="bg-yellow-400 text-slate-950 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-comic truncate mt-0.5">
                          {item.phrase}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Meme Power-Ups */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 space-y-4">
              <span className="text-[10px] font-mono text-yellow-500 font-black uppercase tracking-widest block">
                WERLD KUP RETAIL ENHANCEMENTS
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Upgrade 1: Neck multiplier */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col justify-between gap-2.5">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>NECK ELONGATION</span>
                      <span className="text-yellow-400 font-extrabold">Lvl {neckUpgrade}/5</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-comic mt-0.5 leading-snug">
                      Allows player to head ball much earlier in flight.
                    </p>
                  </div>
                  <button
                    onClick={buyNeckUpgrade}
                    disabled={neckUpgrade >= 5}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-900 disabled:text-slate-600 text-slate-950 text-2xs font-extrabold p-2.5 rounded-lg transition-all font-comic uppercase tracking-wider"
                  >
                    {neckUpgrade >= 5 ? "MAX ELONGATION" : "Stretch Neck (+10px)"}
                  </button>
                </div>

                {/* Upgrade 2: Size multiplier */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col justify-between gap-2.5">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>GOOGLY SKULL SIZE</span>
                      <span className="text-yellow-400 font-extrabold">Lvl {headUpgrade}/5</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-comic mt-0.5 leading-snug">
                      Increases your header direct contact collision zone.
                    </p>
                  </div>
                  <button
                    onClick={buyHeadUpgrade}
                    disabled={headUpgrade >= 5}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-900 disabled:text-slate-600 text-slate-950 text-2xs font-extrabold p-2.5 rounded-lg transition-all font-comic uppercase tracking-wider"
                  >
                    {headUpgrade >= 5 ? "MAX SKULL CAP" : "Dilate Skull (+4px)"}
                  </button>
                </div>
              </div>

              {/* Gravity selector */}
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  TACTICAL GRAVITY INTENSITY
                </span>
                <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-850">
                  <button
                    onClick={() => { setBallSpeedMult(0.75); playWhistle(); }}
                    className={`flex-1 text-[9px] font-black uppercase py-1.5 rounded transition-all font-mono ${
                      ballSpeedMult === 0.75 ? 'bg-yellow-400 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Slow Motion (0.75x)
                  </button>
                  <button
                    onClick={() => { setBallSpeedMult(1); playWhistle(); }}
                    className={`flex-1 text-[9px] font-black uppercase py-1.5 rounded transition-all font-mono ${
                      ballSpeedMult === 1 ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Stupid Standard (1x)
                  </button>
                  <button
                    onClick={() => { setBallSpeedMult(1.5); playGoalHorn(); }}
                    className={`flex-1 text-[9px] font-black uppercase py-1.5 rounded transition-all font-mono ${
                      ballSpeedMult === 1.5 ? 'bg-rose-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Neymar Panic (1.5x)
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
