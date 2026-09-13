// Calamity War — Procedural Music Engine (v0.62)
// Generates unique per-stage music using Web Audio API synthesis
// Falls back to WAV files if Web Audio is unavailable
window.CalamityMusicEngine = (function () {
  'use strict';

  // === Music Theory Helpers ===
  const NOTE = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
  const SCALES = {
    minor: [0, 2, 3, 5, 7, 8, 10],
    major: [0, 2, 4, 5, 7, 9, 11],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
    pentatonicMinor: [0, 3, 5, 7, 10],
    pentatonicMajor: [0, 2, 4, 7, 9],
    blues: [0, 3, 5, 6, 7, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    wholeTone: [0, 2, 4, 6, 8, 10],
  };

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function noteInScale(rootMidi, scale, degree, octave) {
    const scaleLen = scale.length;
    const totalDegree = degree + octave * scaleLen;
    const octaveOffset = Math.floor(totalDegree / scaleLen);
    const noteIdx = ((totalDegree % scaleLen) + scaleLen) % scaleLen;
    return rootMidi + octave * 12 + scale[noteIdx] + (octaveOffset - octave) * 12;
  }

  // === Theme Definitions ===
  // Each theme: tempo, rootNote, scale, bassPattern, leadPattern, drumPattern, padChords, leadWave, bassWave, filterFreq, ambience
  const THEMES = {
    // Title — Adventure/tournament anime theme: heroic, energetic
    title: {
      tempo: 128, root: NOTE.D, scale: 'minor',
      bass: [0, 0, 0, 0, 5, 5, 3, 3], bassOctave: 2,
      lead: [0, 2, 4, 5, 4, 2, 0, 2, 5, 7, 4, 2, 0, -1, 0, 2], leadOctave: 4,
      leadWave: 'sawtooth', bassWave: 'square',
      drums: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      hatPattern: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      padChords: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]],
      padOctave: 3, filterFreq: 2000, ambience: 'none',
      leadGain: 0.12, bassGain: 0.15, drumGain: 0.25, padGain: 0.06,
    },
    // Stage Select — calm, anticipatory
    stageSelect: {
      tempo: 90, root: NOTE.A, scale: 'pentatonicMinor',
      bass: [0, 0, 0, 0, 0, 0, 0, 0], bassOctave: 2,
      lead: [0, 2, 3, 5, 3, 2, 0, -2, 0, 2, 3, 5, 7, 5, 3, 2], leadOctave: 4,
      leadWave: 'sine', bassWave: 'triangle',
      drums: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      hatPattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      padChords: [[0, 3, 7], [3, 7, 10]], padOctave: 3, filterFreq: 1500, ambience: 'none',
      leadGain: 0.10, bassGain: 0.12, drumGain: 0.15, padGain: 0.08,
    },
    // Training — neutral, steady
    training: {
      tempo: 100, root: NOTE.G, scale: 'major',
      bass: [0, 0, 4, 4, 0, 0, 4, 4], bassOctave: 2,
      lead: [0, 2, 4, 2, 0, 4, 2, 4, 0, 2, 4, 7, 4, 2, 0, 2], leadOctave: 4,
      leadWave: 'triangle', bassWave: 'triangle',
      drums: [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
      hatPattern: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      padChords: [[0, 4, 7], [5, 9, 12]], padOctave: 3, filterFreq: 1800, ambience: 'none',
      leadGain: 0.08, bassGain: 0.10, drumGain: 0.18, padGain: 0.06,
    },

    // === Per-Stage Themes ===

    // Forest — mystical, ethereal
    forest: {
      tempo: 76, root: NOTE.E, scale: 'dorian',
      bass: [0, 0, 0, 0, 3, 3, 0, 0], bassOctave: 2,
      lead: [0, 2, 3, 5, 3, 2, 0, 2, 5, 4, 2, 0, -1, 0, 2, 3], leadOctave: 5,
      leadWave: 'sine', bassWave: 'sine',
      drums: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hatPattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      padChords: [[0, 3, 7], [3, 7, 10], [5, 8, 12], [3, 7, 10]], padOctave: 3, filterFreq: 1200, ambience: 'wind',
      leadGain: 0.10, bassGain: 0.08, drumGain: 0.10, padGain: 0.10,
    },
    // Moonlit Ruins — darker mystical, minor key, echoing bells
    moonlitRuins: {
      tempo: 70, root: NOTE.A, scale: 'harmonicMinor',
      bass: [0, 0, 0, 0, 5, 5, 3, 3], bassOctave: 2,
      lead: [0, 2, 3, 2, 0, -1, 0, 2, 7, 6, 5, 3, 2, 0, -1, 0], leadOctave: 5,
      leadWave: 'sine', bassWave: 'triangle',
      drums: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hatPattern: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      padChords: [[0, 3, 7], [5, 8, 11], [3, 7, 10], [7, 10, 14]], padOctave: 3, filterFreq: 1000, ambience: 'wind',
      leadGain: 0.10, bassGain: 0.08, drumGain: 0.08, padGain: 0.10,
    },
    // Stone Ruins — ancient, tribal drums, deep bass
    stoneRuins: {
      tempo: 84, root: NOTE.D, scale: 'phrygian',
      bass: [0, 0, 1, 0, 0, 0, 1, 0], bassOctave: 2,
      lead: [0, 1, 3, 1, 0, -2, 0, 1, 3, 5, 3, 1, 0, 1, 3, 5], leadOctave: 4,
      leadWave: 'sawtooth', bassWave: 'square',
      drums: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
      hatPattern: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
      padChords: [[0, 1, 5], [1, 5, 8], [0, 3, 7], [1, 4, 8]], padOctave: 3, filterFreq: 1400, ambience: 'none',
      leadGain: 0.10, bassGain: 0.14, drumGain: 0.22, padGain: 0.06,
    },
    // Southern Ridge — cold mountain, wind + drums
    southernRidge: {
      tempo: 92, root: NOTE.F, scale: 'minor',
      bass: [0, 0, 0, 0, 3, 3, 5, 5], bassOctave: 2,
      lead: [0, 3, 5, 7, 5, 3, 0, 3, 5, 7, 8, 7, 5, 3, 0, 3], leadOctave: 4,
      leadWave: 'triangle', bassWave: 'square',
      drums: [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
      hatPattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      padChords: [[0, 3, 7], [3, 7, 10], [5, 8, 12], [3, 7, 10]], padOctave: 3, filterFreq: 1200, ambience: 'wind',
      leadGain: 0.10, bassGain: 0.12, drumGain: 0.18, padGain: 0.08,
    },
    // Red Forest (Diastre) — dark, dissonant, horror
    redForest: {
      tempo: 66, root: NOTE.C, scale: 'phrygian',
      bass: [0, 0, 1, 0, 0, 0, 1, 1], bassOctave: 2,
      lead: [0, 1, 0, 1, 3, 1, 0, -1, 0, 1, 3, 5, 3, 1, 0, 1], leadOctave: 4,
      leadWave: 'sawtooth', bassWave: 'sawtooth',
      drums: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      hatPattern: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      padChords: [[0, 1, 5], [1, 4, 8], [0, 1, 6], [1, 5, 8]], padOctave: 3, filterFreq: 800, ambience: 'rumble',
      leadGain: 0.10, bassGain: 0.14, drumGain: 0.16, padGain: 0.08,
    },
    // Stone Corridor — tense, claustrophobic, pulsing bass
    stoneCorridor: {
      tempo: 110, root: NOTE.E, scale: 'minor',
      bass: [0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 3, 3, 3, 3], bassOctave: 2,
      lead: [0, 2, 3, 5, 3, 2, 0, 2, 3, 5, 7, 5, 3, 2, 0, 2], leadOctave: 4,
      leadWave: 'square', bassWave: 'sawtooth',
      drums: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      hatPattern: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      padChords: [[0, 3, 7], [5, 8, 12]], padOctave: 3, filterFreq: 1600, ambience: 'none',
      leadGain: 0.10, bassGain: 0.14, drumGain: 0.20, padGain: 0.06,
    },
    // Terra Plaza — upbeat, city, tournament energy
    terraPlaza: {
      tempo: 120, root: NOTE.F, scale: 'major',
      bass: [0, 0, 0, 0, 5, 5, 4, 4, 0, 0, 0, 0, 5, 5, 4, 4], bassOctave: 2,
      lead: [0, 2, 4, 5, 7, 5, 4, 2, 0, 2, 4, 5, 7, 4, 2, 0], leadOctave: 4,
      leadWave: 'sawtooth', bassWave: 'square',
      drums: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      hatPattern: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      padChords: [[0, 4, 7], [5, 9, 12], [4, 7, 11], [5, 9, 12]], padOctave: 3, filterFreq: 2200, ambience: 'none',
      leadGain: 0.12, bassGain: 0.14, drumGain: 0.24, padGain: 0.06,
    },
    // Academy — training, disciplined, steady march
    academy: {
      tempo: 104, root: NOTE.G, scale: 'major',
      bass: [0, 0, 4, 4, 5, 5, 4, 4, 0, 0, 4, 4, 5, 5, 7, 7], bassOctave: 2,
      lead: [0, 2, 4, 2, 0, 4, 5, 4, 7, 5, 4, 2, 0, 4, 2, 0], leadOctave: 4,
      leadWave: 'triangle', bassWave: 'square',
      drums: [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
      hatPattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      padChords: [[0, 4, 7], [5, 9, 12], [4, 7, 11], [5, 9, 12]], padOctave: 3, filterFreq: 1800, ambience: 'none',
      leadGain: 0.10, bassGain: 0.12, drumGain: 0.20, padGain: 0.06,
    },
    // Airship — sky, airy, soaring melody
    airship: {
      tempo: 96, root: NOTE.D, scale: 'lydian',
      bass: [0, 0, 4, 4, 0, 0, 5, 5], bassOctave: 2,
      lead: [0, 4, 7, 9, 7, 4, 0, 4, 7, 9, 11, 9, 7, 4, 0, 4], leadOctave: 5,
      leadWave: 'sine', bassWave: 'triangle',
      drums: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
      hatPattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      padChords: [[0, 4, 7, 11], [5, 9, 12, 16]], padOctave: 3, filterFreq: 2400, ambience: 'wind',
      leadGain: 0.12, bassGain: 0.10, drumGain: 0.16, padGain: 0.10,
    },
    // Dark Esplanade (Diego) — dark, industrial, nightmare
    darkEsplanade: {
      tempo: 88, root: NOTE.C, scale: 'phrygian',
      bass: [0, 0, 1, 0, 0, 0, 1, 0, 3, 3, 4, 3, 0, 0, 1, 0], bassOctave: 2,
      lead: [0, 1, 3, 1, 0, 1, 3, 5, 3, 1, 0, -1, 0, 1, 3, 5], leadOctave: 4,
      leadWave: 'sawtooth', bassWave: 'sawtooth',
      drums: [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
      hatPattern: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      padChords: [[0, 1, 5], [3, 4, 8], [0, 1, 6], [1, 4, 8]], padOctave: 3, filterFreq: 900, ambience: 'rumble',
      leadGain: 0.10, bassGain: 0.14, drumGain: 0.18, padGain: 0.08,
    },
    // Fortress Courtyard — tense, military, drums
    courtyard: {
      tempo: 100, root: NOTE.A, scale: 'minor',
      bass: [0, 0, 0, 0, 5, 5, 3, 3, 0, 0, 0, 0, 5, 5, 7, 7], bassOctave: 2,
      lead: [0, 3, 5, 3, 0, 3, 5, 7, 5, 3, 0, 3, 5, 7, 8, 7], leadOctave: 4,
      leadWave: 'square', bassWave: 'square',
      drums: [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
      hatPattern: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      padChords: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]], padOctave: 3, filterFreq: 1600, ambience: 'none',
      leadGain: 0.10, bassGain: 0.14, drumGain: 0.22, padGain: 0.06,
    },
    // Purple Torch Hall — eerie, purple, mystery
    hall: {
      tempo: 74, root: NOTE.D, scale: 'harmonicMinor',
      bass: [0, 0, 0, 0, 5, 5, 3, 3, 0, 0, 0, 0, 7, 7, 5, 5], bassOctave: 2,
      lead: [0, 2, 3, 2, 0, 7, 6, 5, 3, 2, 0, 2, 3, 5, 3, 2], leadOctave: 5,
      leadWave: 'sine', bassWave: 'triangle',
      drums: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hatPattern: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      padChords: [[0, 3, 7], [5, 8, 11], [3, 7, 10], [7, 10, 14]], padOctave: 3, filterFreq: 1000, ambience: 'rumble',
      leadGain: 0.10, bassGain: 0.10, drumGain: 0.08, padGain: 0.10,
    },
    // Experiment Lab — industrial, electronic, tense
    experimentLab: {
      tempo: 112, root: NOTE.F, scale: 'minor',
      bass: [0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 5, 5, 5, 5], bassOctave: 2,
      lead: [0, 3, 5, 7, 5, 3, 0, 3, 5, 7, 8, 7, 5, 3, 0, 3], leadOctave: 4,
      leadWave: 'sawtooth', bassWave: 'sawtooth',
      drums: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      hatPattern: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      padChords: [[0, 3, 7], [3, 7, 10], [5, 8, 12], [3, 7, 10]], padOctave: 3, filterFreq: 1400, ambience: 'rumble',
      leadGain: 0.10, bassGain: 0.14, drumGain: 0.20, padGain: 0.06,
    },
    // Ruined Lab — aftermath, somber, decaying
    ruinedLab: {
      tempo: 68, root: NOTE.E, scale: 'minor',
      bass: [0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 5, 5, 5, 5], bassOctave: 2,
      lead: [0, 2, 3, 2, 0, -1, 0, 2, 3, 5, 3, 2, 0, 2, 3, 5], leadOctave: 5,
      leadWave: 'sine', bassWave: 'sine',
      drums: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hatPattern: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      padChords: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [0, 3, 7]], padOctave: 3, filterFreq: 800, ambience: 'rumble',
      leadGain: 0.10, bassGain: 0.08, drumGain: 0.06, padGain: 0.10,
    },
    // Village — warm, peaceful, acoustic feel
    village: {
      tempo: 82, root: NOTE.G, scale: 'major',
      bass: [0, 0, 4, 4, 5, 5, 4, 4, 0, 0, 4, 4, 5, 5, 7, 7], bassOctave: 2,
      lead: [0, 2, 4, 2, 0, 4, 5, 4, 7, 5, 4, 2, 0, 4, 2, 0], leadOctave: 5,
      leadWave: 'triangle', bassWave: 'triangle',
      drums: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      hatPattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      padChords: [[0, 4, 7], [5, 9, 12], [4, 7, 11], [5, 9, 12]], padOctave: 3, filterFreq: 2000, ambience: 'none',
      leadGain: 0.10, bassGain: 0.10, drumGain: 0.12, padGain: 0.08,
    },
    // Dojo (Malachai Manor Ruins) — origin, emotional, piano + strings
    dojo: {
      tempo: 72, root: NOTE.D, scale: 'minor',
      bass: [0, 0, 0, 0, 5, 5, 3, 3, 0, 0, 0, 0, 7, 7, 5, 5], bassOctave: 2,
      lead: [0, 2, 3, 5, 3, 2, 0, 2, 5, 7, 5, 3, 2, 0, -1, 0], leadOctave: 5,
      leadWave: 'sine', bassWave: 'triangle',
      drums: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hatPattern: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      padChords: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]], padOctave: 3, filterFreq: 1200, ambience: 'none',
      leadGain: 0.12, bassGain: 0.08, drumGain: 0.06, padGain: 0.10,
    },
  };

  // === Audio Engine ===
  let ctx = null;
  let masterGain = null;
  let activeNodes = [];
  let activeTimers = [];
  let currentTheme = null;
  let currentStep = 0;
  let isPlaying = false;
  let volume = 0.7;
  let muted = false;
  let crossfadeTimer = null;

  function initContext() {
    if (ctx) return true;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = volume * 0.5;
      masterGain.connect(ctx.destination);
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearAll() {
    activeTimers.forEach(t => clearTimeout(t));
    activeTimers = [];
    activeNodes.forEach(n => {
      try { n.stop(); } catch (e) {}
      try { n.disconnect(); } catch (e) {}
    });
    activeNodes = [];
    if (crossfadeTimer) {
      clearTimeout(crossfadeTimer);
      crossfadeTimer = null;
    }
    isPlaying = false;
    currentStep = 0;
  }

  function playNote(freq, duration, type, gainAmt, filterFreq, when) {
    if (!ctx) return;
    const t = when || ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = type || 'sine';
    osc.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = filterFreq || 2000;
    filter.Q.value = 1;

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(gainAmt, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(gainAmt * 0.3, t + duration * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + duration + 0.05);

    activeNodes.push(osc);
    // Clean up after it finishes
    setTimeout(() => {
      try { osc.disconnect(); } catch (e) {}
      const idx = activeNodes.indexOf(osc);
      if (idx >= 0) activeNodes.splice(idx, 1);
    }, (duration + 0.1) * 1000);
  }

  function playDrum(type, gainAmt, when) {
    if (!ctx) return;
    const t = when || ctx.currentTime;
    if (type === 'kick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
      gain.gain.setValueAtTime(gainAmt, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.2);
      activeNodes.push(osc);
    } else if (type === 'hat') {
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, 4410, 44100);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 6000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(gainAmt * 0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      noise.start(t);
      noise.stop(t + 0.06);
      activeNodes.push(noise);
    } else if (type === 'snare') {
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, 8820, 44100);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2000;
      filter.Q.value = 0.8;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(gainAmt * 0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      noise.start(t);
      noise.stop(t + 0.15);
      activeNodes.push(noise);
    }
  }

  function playPad(rootMidi, chord, octave, gainAmt, filterFreq, duration, when) {
    if (!ctx) return;
    const t = when || ctx.currentTime;
    chord.forEach(degree => {
      const midi = rootMidi + (octave + Math.floor(degree / 7)) * 12 + (SCALES.minor[degree % 7] || 0);
      const freq = midiToFreq(midi);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = filterFreq || 1500;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(gainAmt, t + 0.5);
      gain.gain.setValueAtTime(gainAmt, t + duration - 0.5);
      gain.gain.linearRampToValueAtTime(0, t + duration);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + duration + 0.05);
      activeNodes.push(osc);
    });
  }

  function playAmbience(type, duration, when) {
    if (!ctx || type === 'none' || !type) return;
    const t = when || ctx.currentTime;
    if (type === 'wind') {
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * duration, 44100);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
      noise.buffer = buf;
      noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 0.5;
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.3;
      lfoGain.gain.value = 400;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      const gain = ctx.createGain();
      gain.gain.value = 0.04;
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      noise.start(t);
      noise.stop(t + duration);
      lfo.start(t);
      lfo.stop(t + duration);
      activeNodes.push(noise, lfo);
    } else if (type === 'rumble') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 50;
      gain.gain.value = 0.06;
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + duration);
      activeNodes.push(osc);
    }
  }

  function scheduleStep(theme, step) {
    if (!ctx || !isPlaying) return;
    const stepDuration = 60 / theme.tempo / 4; // 16th note
    const t = ctx.currentTime + 0.02;
    const rootMidi = 48 + theme.root; // C3 + root offset

    // Bass
    if (theme.bass[step % theme.bass.length] !== undefined) {
      const bassDegree = theme.bass[step % theme.bass.length];
      const bassMidi = rootMidi - 12 + (SCALES[theme.scale][bassDegree % SCALES[theme.scale].length] || 0) + Math.floor(bassDegree / SCALES[theme.scale].length) * 12;
      playNote(midiToFreq(bassMidi), stepDuration * 2, theme.bassWave, theme.bassGain, 600, t);
    }

    // Lead
    if (theme.lead[step % theme.lead.length] !== undefined) {
      const leadDegree = theme.lead[step % theme.lead.length];
      const leadMidi = noteInScale(rootMidi, SCALES[theme.scale], leadDegree, theme.leadOctave - 3);
      playNote(midiToFreq(leadMidi), stepDuration * 1.5, theme.leadWave, theme.leadGain, theme.filterFreq, t);
    }

    // Drums
    if (theme.drums[step % theme.drums.length]) {
      playDrum('kick', theme.drumGain, t);
    }

    // Hats
    if (theme.hatPattern && theme.hatPattern[step % theme.hatPattern.length]) {
      playDrum('hat', theme.drumGain * 0.4, t);
    }

    // Snare on beats 2 and 4 (steps 4 and 12)
    if (step % 8 === 4) {
      playDrum('snare', theme.drumGain * 0.7, t);
    }

    // Pad chords (play on bar boundaries)
    if (step % 16 === 0) {
      const chordIdx = Math.floor(step / 16) % theme.padChords.length;
      playPad(rootMidi, theme.padChords[chordIdx], theme.padOctave, theme.padGain, theme.filterFreq, (60 / theme.tempo) * 4, t);
    }

    // Ambience (start on bar boundaries)
    if (step % 16 === 0 && theme.ambience && theme.ambience !== 'none') {
      playAmbience(theme.ambience, (60 / theme.tempo) * 4, t);
    }
  }

  function start(themeKey) {
    if (!initContext()) return false;
    if (ctx.state === 'suspended') ctx.resume();

    const theme = THEMES[themeKey];
    if (!theme) return false;

    // Crossfade: stop existing smoothly
    if (isPlaying && currentTheme === themeKey) return true;

    clearAll();
    currentTheme = themeKey;
    isPlaying = true;
    currentStep = 0;

    const stepDuration = 60 / theme.tempo / 4; // 16th note in seconds

    function tick() {
      if (!isPlaying) return;
      scheduleStep(theme, currentStep);
      currentStep++;
      const timer = setTimeout(tick, stepDuration * 1000);
      activeTimers.push(timer);
      // Keep timer list from growing unbounded
      if (activeTimers.length > 10) activeTimers.shift();
    }

    tick();
    return true;
  }

  function stop() {
    // Fade out then clear
    if (masterGain && ctx) {
      const t = ctx.currentTime;
      masterGain.gain.setValueAtTime(masterGain.gain.value, t);
      masterGain.gain.linearRampToValueAtTime(0, t + 0.3);
      const timer = setTimeout(() => {
        clearAll();
        if (masterGain) masterGain.gain.value = volume * 0.5;
      }, 350);
      activeTimers.push(timer);
    } else {
      clearAll();
    }
  }

  function setVolume(vol) {
    volume = Math.max(0, Math.min(1, vol));
    if (masterGain) {
      masterGain.gain.value = volume * 0.5;
    }
  }

  function setMuted(m) {
    muted = m;
    if (masterGain) {
      masterGain.gain.value = muted ? 0 : volume * 0.5;
    }
  }

  function getThemeForStage(stageId) {
    return THEMES[stageId] ? stageId : 'forest';
  }

  function hasTheme(key) {
    return !!THEMES[key];
  }

  return {
    start,
    stop,
    setVolume,
    setMuted,
    getThemeForStage,
    hasTheme,
    isPlaying: () => isPlaying,
    getCurrentTheme: () => currentTheme,
  };
})();
