/**
 * Web Audio API synthesizer for retro-meme soccer sounds.
 * Bypasses missing asset files by generating real interactive sound waves.
 */

let audioCtx: AudioContext | null = null;
let masterVolume = 0.08; // Much quieter default volume for pleasant UX

export function isMuted(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('werldkup_muted') === 'true';
  }
  return false;
}

export function setMuted(muted: boolean) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('werldkup_muted', muted ? 'true' : 'false');
  }
}

function getAudioContext() {
  if (isMuted()) return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playWhistle() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Referee Whistle consists of 2 high frequencies beating together for a piercing vibrato
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2000, now);
    // Vibrato
    osc1.frequency.setValueAtTime(2000, now);
    osc1.frequency.exponentialRampToValueAtTime(2200, now + 0.1);
    osc1.frequency.exponentialRampToValueAtTime(1900, now + 0.25);
    osc1.frequency.exponentialRampToValueAtTime(2100, now + 0.4);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2045, now); // slightly offset to create a beating harmonic
    osc2.frequency.exponentialRampToValueAtTime(2245, now + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(1945, now + 0.25);
    osc2.frequency.exponentialRampToValueAtTime(2145, now + 0.4);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.04 * masterVolume * 5, now + 0.05); // reduced
    gainNode.gain.exponentialRampToValueAtTime(0.03 * masterVolume * 5, now + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch (error) {
    console.error("Audio error", error);
  }
}

export function playVuvuzela() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Vuvuzelas are obnoxious buzzy horns. We stack sawtooth oscillators and filter them.
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now); // B♭3 drone approximately
    osc.frequency.linearRampToValueAtTime(145, now + 0.4);
    osc.frequency.linearRampToValueAtTime(138, now + 0.8);
    osc.frequency.linearRampToValueAtTime(140, now + 1.2);
    
    // Add sub-harmonics or slight vibrato
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 8; // Hz
    lfoGain.gain.value = 3; // frequency deviation
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    filter.type = 'bandpass';
    filter.frequency.value = 450;
    filter.Q.value = 3.0; // accentuates vowel-like honk
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.05 * masterVolume * 4, now + 0.15); // reduced
    gainNode.gain.linearRampToValueAtTime(0.04 * masterVolume * 4, now + 0.8);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 1.5);
    osc.stop(now + 1.5);
  } catch (err) {
    console.error("Audio error", err);
  }
}

export function playGoalHorn() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Staggered multiple low frequency sawtooth waves with massive gain
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(180, now);
    
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(182.4, now); // detuned
    
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.06 * masterVolume * 4, now + 0.05); // reduced
    gainNode.gain.linearRampToValueAtTime(0.05 * masterVolume * 4, now + 0.5);
    gainNode.gain.setValueAtTime(0, now + 0.65);
    // double blast!
    gainNode.gain.linearRampToValueAtTime(0.06 * masterVolume * 4, now + 0.7);
    gainNode.gain.linearRampToValueAtTime(0.05 * masterVolume * 4, now + 1.3);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.0);
    osc2.stop(now + 2.0);
  } catch (err) {
    console.error("Audio error", err);
  }
}

export function playCoin() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.type = 'sine';
    // Arpeggio sound
    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.02 * masterVolume * 4, now + 0.02); // reduced
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc1.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.4);
  } catch (err) {
    console.error("Audio error", err);
  }
}
