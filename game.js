(() => {
  'use strict';

  const screens = {
    main: document.getElementById('screen'),
    select: document.getElementById('characterScreen'),
    loadGame: document.getElementById('loadGameScreen'),
    calamitySports: document.getElementById('calamitySportsScreen'),
    battleCharacters: document.getElementById('battleCharacterScreen'),
    stageSelect: document.getElementById('stageSelectScreen'),
    ready: document.getElementById('readyScreen'),
    pvp: document.getElementById('pvpScreen'),
    storySetup: document.getElementById('storySetupScreen'),
    mission: document.getElementById('missionScreen'),
    story: document.getElementById('storyScreen'),
    fight: document.getElementById('fightScreen'),
    gameOver: document.getElementById('gameOverScreen'),
    gallery: document.getElementById('galleryScreen'),
    stageGallery: document.getElementById('stageGalleryScreen'),
    options: document.getElementById('optionsScreen')
  };

  const assets = {
    main: './assets/main_menu_shell.png',
    select: './assets/character_select.jpg',
    select1v1Template: './assets/character_select_1v1_template.png',
    selectTeamTemplate: './assets/character_select_team_template.png',
    stageSelectTemplate: './assets/stage_select_template.png',
    readyVsTemplate: './assets/ready_vs_template.png',
    gameOverDefeat: './assets/game_over_story_defeat.png',
    dojo: './assets/bg_dojo_ruins.jpg',
    forest: './assets/bg_forest.jpg',
    courtyard: './assets/bg_fortress_courtyard.jpg',
    hall: './assets/bg_fortress_hall.jpg',
    redForest: './assets/bg_red_forest.jpg',
    stoneCorridor: './assets/bg_stone_corridor.jpg',
    moonlitRuins: './assets/bg_moonlit_ruins.jpg',
    experimentLab: './assets/bg_experiment_lab.jpg',
    ruinedLab: './assets/bg_ruined_lab.jpg',
    village: './assets/bg_mountain_village.jpg',
    city: './assets/bg_terra_registration_plaza.jpg',
    exam: './assets/bg_kemt_academy.jpg',
    labyrinth: './assets/bg_stone_corridor.jpg',
    nightForest: './assets/bg_moonlit_ruins.jpg',
    terraPlaza: './assets/bg_terra_registration_plaza.jpg',
    stoneRuins: './assets/bg_mystical_forest_ruins.jpg',
    southernRidge: './assets/bg_southern_ridge.jpg',
    academy: './assets/bg_kemt_academy.jpg',
    airship: './assets/bg_airship_deck.jpg',
    darkEsplanade: './assets/bg_dark_esplanade.jpg'
  };

  const images = {};
  const assetStatus = {};
  Object.entries(assets).forEach(([key, src]) => {
    images[key] = new Image();
    assetStatus[key] = 'loading';
    images[key].onload = () => { assetStatus[key] = 'loaded'; };
    images[key].onerror = () => { assetStatus[key] = 'missing'; console.warn('Missing image asset:', src); };
    images[key].src = src;
  });



  // Prototype sprite manifest. These are standardized transparent PNG canvases.
  // P2 sprites are mirrored in the canvas renderer by flipping on the x-axis when facing left.
  const SPRITE_POSES = ['idle', 'walk_forward', 'walk_back', 'crouch', 'light', 'heavy', 'special', 'guard', 'jump', 'hurt', 'ko', 'victory'];

  // Character ids can be canonical in the game while reusing older asset folders.
  // Awar == Awar Aries and Dante == Dante Aries, but the browser sprite folders are still awar/ and dante/.
  const SPRITE_FILE_ALIASES = {
    awar_aries: 'awar',
    dante_aries: 'dante',
    dummy: 'training_dummy_shadow',
    handler: 'tenganisha',
    danpen: 'danpen_shikake'
  };

  function trainingDummyVariantKey() {
    return state?.settings?.trainingDummyType === 'ninja' ? 'training_dummy_ninja' : 'training_dummy_shadow';
  }

  function trainingDummyDisplayName() {
    return state?.settings?.trainingDummyType === 'ninja' ? 'TRAINING DUMMY NINJA' : 'TRAINING DUMMY SHADOW';
  }

  function isTrainingDummyId(id) {
    return id === 'dummy' || id === 'training_dummy_shadow' || id === 'training_dummy_ninja';
  }

  const SPRITE_CHARACTER_IDS = ['rai', 'nico', 'shanti', 'adrian', 'malachai', 'rikku', 'mani', 'diego', 'akila', 'akira', 'shinichi', 'yuta', 'daisuke', 'miwa', 'michelle', 'nikki', 'awar_aries', 'rose', 'pierre', 'goro', 'mammon', 'dante_aries', 'nox_aries', 'seccla_aries', 'diastre', 'roger', 'tenganisha', 'baburu', 'machai', 'mahje', 'raijin', 'esther', 'semuda', 'danpen_shikake', 'danpen_tokei', 'dummy', 'training_dummy_shadow', 'training_dummy_ninja', 'awar', 'handler', 'danpen'];

  function standardSpriteSet(id) {
    const fileId = SPRITE_FILE_ALIASES[id] || id;
    const folder = fileId;
    const prefix = fileId;
    return Object.fromEntries(SPRITE_POSES.map(pose => [pose, `./assets/sprites/${folder}/${prefix}_${pose}.png`]));
  }

  const spriteSources = Object.fromEntries(SPRITE_CHARACTER_IDS.map(id => [id, standardSpriteSet(id)]));

  // Visible alpha bounds for each sprite pose. Used to draw only the character silhouette,
  // so poses with extra transparent padding do not pop larger/smaller in battle.
  const spriteBounds = {
      "rai": {
          "idle": {
              "sx": 160,
              "sy": 100,
              "sw": 579,
              "sh": 720
          },
          "light": {
              "sx": 80,
              "sy": 257,
              "sw": 740,
              "sh": 563
          },
          "heavy": {
              "sx": 42,
              "sy": 170,
              "sw": 815,
              "sh": 650
          },
          "special": {
              "sx": 42,
              "sy": 170,
              "sw": 815,
              "sh": 650
          },
          "guard": {
              "sx": 149,
              "sy": 100,
              "sw": 601,
              "sh": 720
          },
          "jump": {
              "sx": 141,
              "sy": 100,
              "sw": 617,
              "sh": 720
          },
          "hurt": {
              "sx": 154,
              "sy": 100,
              "sw": 591,
              "sh": 720
          },
          "ko": {
              "sx": 80,
              "sy": 375,
              "sw": 740,
              "sh": 385
          }
      },
      "nico": {
          "idle": {
              "sx": 80,
              "sy": 318,
              "sw": 740,
              "sh": 502
          },
          "light": {
              "sx": 91,
              "sy": 100,
              "sw": 717,
              "sh": 720
          },
          "heavy": {
              "sx": 73,
              "sy": 170,
              "sw": 754,
              "sh": 650
          },
          "special": {
              "sx": 73,
              "sy": 170,
              "sw": 754,
              "sh": 650
          },
          "guard": {
              "sx": 91,
              "sy": 100,
              "sw": 717,
              "sh": 720
          },
          "jump": {
              "sx": 80,
              "sy": 268,
              "sw": 740,
              "sh": 552
          },
          "hurt": {
              "sx": 80,
              "sy": 453,
              "sw": 740,
              "sh": 367
          },
          "ko": {
              "sx": 80,
              "sy": 393,
              "sw": 740,
              "sh": 367
          }
      },
      "shanti": {
          "idle": {
              "sx": 232,
              "sy": 100,
              "sw": 435,
              "sh": 720
          },
          "light": {
              "sx": 116,
              "sy": 100,
              "sw": 668,
              "sh": 720
          },
          "heavy": {
              "sx": 69,
              "sy": 170,
              "sw": 762,
              "sh": 650
          },
          "special": {
              "sx": 69,
              "sy": 170,
              "sw": 762,
              "sh": 650
          },
          "guard": {
              "sx": 175,
              "sy": 100,
              "sw": 550,
              "sh": 720
          },
          "jump": {
              "sx": 187,
              "sy": 100,
              "sw": 525,
              "sh": 720
          },
          "hurt": {
              "sx": 175,
              "sy": 100,
              "sw": 550,
              "sh": 720
          },
          "ko": {
              "sx": 80,
              "sy": 305,
              "sw": 740,
              "sh": 455
          }
      }
  };


  function sanitizeSpriteBackground(img) {
    try {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (!w || !h) return img;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const cctx = canvas.getContext('2d', { willReadFrequently: true });
      cctx.drawImage(img, 0, 0);
      const imageData = cctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      const idxOf = (x, y) => y * w + x;
      const rgbaAt = (idx) => {
        const p = idx * 4;
        return [data[p], data[p + 1], data[p + 2], data[p + 3]];
      };
      const brightNeutral = (idx, loose=false) => {
        const [r,g,b,a] = rgbaAt(idx);
        if (a <= 5) return true;
        const max = Math.max(r,g,b);
        const min = Math.min(r,g,b);
        const chroma = max - min;
        return loose ? (max >= 170 && chroma <= 88) : (max >= 198 && chroma <= 72);
      };

      // First pass: flood-fill from the real image edges.
      const seen = new Uint8Array(w * h);
      const q = [];
      const push = (x, y, test) => {
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        const idx = idxOf(x, y);
        if (seen[idx] || !test(idx)) return;
        seen[idx] = 1;
        q.push(idx);
      };
      for (let x = 0; x < w; x++) { push(x, 0, brightNeutral); push(x, h - 1, brightNeutral); }
      for (let y = 0; y < h; y++) { push(0, y, brightNeutral); push(w - 1, y, brightNeutral); }
      for (let qi = 0; qi < q.length; qi++) {
        const idx = q[qi];
        const p = idx * 4;
        data[p] = 0; data[p + 1] = 0; data[p + 2] = 0; data[p + 3] = 0;
        const x = idx % w;
        const y = Math.floor(idx / w);
        push(x + 1, y, brightNeutral); push(x - 1, y, brightNeutral); push(x, y + 1, brightNeutral); push(x, y - 1, brightNeutral);
      }

      // Second pass: some sprites have a transparent border and then an internal white/gray rectangle.
      // Find the remaining opaque bounding rectangle and flood-fill bright/neutral backdrop colors from that rectangle's perimeter.
      let minX = w, minY = h, maxX = -1, maxY = -1;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const a = data[(idxOf(x, y) * 4) + 3];
          if (a > 5) { if (x < minX) minX = x; if (y < minY) minY = y; if (x > maxX) maxX = x; if (y > maxY) maxY = y; }
        }
      }
      if (maxX >= minX && maxY >= minY) {
        const bgSamples = [];
        const addSample = (x, y) => {
          if (x < 0 || y < 0 || x >= w || y >= h) return;
          const idx = idxOf(x, y);
          const [r,g,b,a] = rgbaAt(idx);
          if (a <= 5) return;
          const max = Math.max(r,g,b), min = Math.min(r,g,b);
          if (max >= 120 && (max - min) <= 90) bgSamples.push([r,g,b]);
        };
        const xStep = Math.max(1, Math.floor((maxX - minX + 1) / 64));
        const yStep = Math.max(1, Math.floor((maxY - minY + 1) / 64));
        for (let x = minX; x <= maxX; x += xStep) { addSample(x, minY); addSample(x, Math.min(maxY, minY + 2)); addSample(x, Math.max(minY, maxY - 2)); addSample(x, maxY); }
        for (let y = minY; y <= maxY; y += yStep) { addSample(minX, y); addSample(Math.min(maxX, minX + 2), y); addSample(Math.max(minX, maxX - 2), y); addSample(maxX, y); }
        const sampleColors = [];
        bgSamples.forEach((c, i) => {
          if (i % Math.max(1, Math.floor(bgSamples.length / 18)) !== 0) return;
          if (sampleColors.every(d => ((c[0]-d[0])**2 + (c[1]-d[1])**2 + (c[2]-d[2])**2) > 300)) sampleColors.push(c);
        });
        const closeToBg = (idx) => {
          const [r,g,b,a] = rgbaAt(idx);
          if (a <= 5) return true;
          if (brightNeutral(idx, true)) return true;
          return sampleColors.some(c => ((r-c[0])**2 + (g-c[1])**2 + (b-c[2])**2) < 4200);
        };
        const seen2 = new Uint8Array(w * h);
        const q2 = [];
        const push2 = (x, y) => {
          if (x < minX || x > maxX || y < minY || y > maxY) return;
          const idx = idxOf(x, y);
          if (seen2[idx] || !closeToBg(idx)) return;
          seen2[idx] = 1;
          q2.push(idx);
        };
        for (let x = minX; x <= maxX; x++) { push2(x, minY); push2(x, maxY); }
        for (let y = minY; y <= maxY; y++) { push2(minX, y); push2(maxX, y); }
        for (let qi = 0; qi < q2.length; qi++) {
          const idx = q2[qi];
          const p = idx * 4;
          data[p] = 0; data[p + 1] = 0; data[p + 2] = 0; data[p + 3] = 0;
          const x = idx % w;
          const y = Math.floor(idx / w);
          push2(x + 1, y); push2(x - 1, y); push2(x, y + 1); push2(x, y - 1);
        }
      }

      cctx.putImageData(imageData, 0, 0);
      canvas.loaded = true;
      canvas.complete = true;
      canvas._visibleBounds = computeSpriteVisibleBounds(canvas);
      return canvas;
    } catch (err) {
      console.warn('Sprite background cleanup skipped:', err);
      return img;
    }
  }

  function computeSpriteVisibleBounds(sprite) {
    try {
      const w = sprite.naturalWidth || sprite.width;
      const h = sprite.naturalHeight || sprite.height;
      if (!w || !h) return null;
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const cctx = canvas.getContext('2d', { willReadFrequently: true });
      cctx.drawImage(sprite, 0, 0);
      const data = cctx.getImageData(0, 0, w, h).data;
      let minX = w, minY = h, maxX = -1, maxY = -1;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (data[(y * w + x) * 4 + 3] > 12) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < minX || maxY < minY) return null;
      const pad = 8;
      minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
      maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
      return { sx: minX, sy: minY, sw: maxX - minX + 1, sh: maxY - minY + 1 };
    } catch (_) { return null; }
  }

  function spriteIsUsable(sprite) {
    return !!(sprite && ((sprite.processed && (sprite.processed.width || sprite.processed.naturalWidth)) || (sprite.complete && sprite.naturalWidth)));
  }

  const SPRITE_POSE_ALIASES = {
    // Pierre's current generated jump reads like hurt/KO, so use idle until a clean jump sprite is generated.
    pierre: { jump: 'idle', hurt: 'guard', walk_forward: 'idle', walk_back: 'idle' }
  };

  const SPRITE_POSE_FALLBACKS = {
    idle: ['idle'],
    walk_forward: ['walk_forward', 'idle'],
    walk_back: ['walk_back', 'idle'],
    crouch: ['crouch', 'guard', 'idle'],
    light: ['light', 'heavy', 'special', 'idle'],
    heavy: ['heavy', 'light', 'special', 'idle'],
    special: ['special', 'heavy', 'light', 'idle'],
    guard: ['guard', 'idle'],
    jump: ['jump', 'idle'],
    hurt: ['hurt', 'guard', 'idle'],
    ko: ['ko', 'hurt', 'idle'],
    victory: ['victory', 'idle']
  };

  function fighterVisualPose(fighter) {
    const rawPose = fighterPose(fighter);
    return SPRITE_POSE_ALIASES[fighter.id]?.[rawPose] || rawPose;
  }

  const spriteImages = {};
  Object.entries(spriteSources).forEach(([charId, poses]) => {
    spriteImages[charId] = {};
    Object.entries(poses).forEach(([pose, src]) => {
      const img = new Image();
      img.onload = () => {
        img.loaded = true;
        img.processed = sanitizeSpriteBackground(img);
      };
      img.onerror = () => { console.warn('Missing sprite asset:', src); };
      img.src = src;
      spriteImages[charId][pose] = img;
    });
  });

  function fighterPose(fighter) {
    if (fighter.dead || fighter.hp <= 0) return 'ko';
    if (fighter.hitCooldown > 0 && !fighter.guard) return 'hurt';
    if (!fighter.onGround) return 'jump';
    if (fighter.guard) return 'guard';
    if (fighter.attackTimer > 0) return fighter.attackKind || 'light';
    if (Math.abs(fighter.vx || 0) > 0.28) {
      const movingTowardOpponent = Math.sign(fighter.vx) === Math.sign(fighter.facing || 1);
      return movingTowardOpponent ? 'walk_forward' : 'walk_back';
    }
    return 'idle';
  }

  function getFighterSprite(fighter) {
    const spriteId = isTrainingDummyId(fighter.id) ? trainingDummyVariantKey() : fighter.id;
    let set = spriteImages[spriteId];
    if ((!set || Object.values(set).every(img => !spriteIsUsable(img))) && isTrainingDummyId(fighter.id)) set = spriteImages.training_dummy_shadow;
    if (!set) return null;
    const visualPose = fighterVisualPose(fighter);
    const fallbackList = SPRITE_POSE_FALLBACKS[visualPose] || [visualPose, 'idle'];
    const order = [...new Set([visualPose, ...fallbackList, 'idle'])];
    for (const pose of order) {
      const raw = set[pose];
      if (!spriteIsUsable(raw)) continue;
      fighter._lastDrawPose = pose;
      return raw.processed || raw;
    }
    return null;
  }

  const state = {
    screen: 'main',
    selected: 'rai',
    battle: { mode: 'pvp-local', type: 'single', format: '1v1', p1: 'rai', p2: 'nico', p1Team: ['rai'], p2Team: ['nico'], stage: 'forest', activeSide: 'p1', activeSlot: 0, cpuSide: 'p2' },
    tournament: null,
    stageWheelIndex: 0,
    stageSpinTimer: null,
    stageHoverTimer: null,
    randomHoverTimers: {},
    randomHoverSnapshots: {},
    readyTimer: null,
    storyIndex: 0,
    lastStoryIndex: 0,
    debug: false,
    storyAssist: true,
    storyDifficulty: 'normal',
    cpuDifficulty: 'normal',
    handicap: 'off',
    menuIndex: 0,
    settings: { mute: false, volume: 0.7, language: 'english', announcer: true, roundTimeSeconds: 120, p1HealthBars: 3, p2HealthBars: 3, trainingDummyType: 'shadow', trainingDummyBehavior: 'idle', trainingDummyDifficulty: 'normal' },
    pvp: false,
    fightMode: 'story',
    lastFightItem: null,
    lastFightMode: 'story',
    fight: null,
    keys: new Set()
  };




  // Real audio file wiring. These WAVs live in assets/audio/.
  // The game still has procedural fallbacks, but these are the actual file-based SFX/music hooks.
  const audioSources = {
    music: {
      title: './assets/audio/music/title_theme_loop_placeholder.wav',
      battle: './assets/audio/music/battle_theme_loop_placeholder.wav',
      stageSelect: './assets/audio/music/stage_select_loop_placeholder.wav',
      training: './assets/audio/music/training_loop_placeholder.wav'
    },
    sfx: {
      menuCursor: './assets/audio/sfx/menu_cursor.wav',
      menuConfirm: './assets/audio/sfx/menu_confirm.wav',
      menuBack: './assets/audio/sfx/menu_back.wav',
      menuError: './assets/audio/sfx/menu_error.wav',
      characterLock: './assets/audio/sfx/character_select_lock.wav',
      randomRoll: './assets/audio/sfx/random_roll.wav',
      stageWhoosh: './assets/audio/sfx/stage_select_whoosh.wav',
      roundStart: './assets/audio/sfx/round_start.wav',
      fightStart: './assets/audio/sfx/fight_start.wav',
      hitLight: './assets/audio/sfx/hit_light.wav',
      hitHeavy: './assets/audio/sfx/hit_heavy.wav',
      guardBlock: './assets/audio/sfx/guard_block.wav',
      jump: './assets/audio/sfx/jump.wav',
      land: './assets/audio/sfx/land.wav',
      specialCharge: './assets/audio/sfx/special_charge.wav',
      specialRelease: './assets/audio/sfx/special_release.wav',
      koImpact: './assets/audio/sfx/ko_impact.wav',
      pauseOpen: './assets/audio/sfx/pause_open.wav',
      pauseClose: './assets/audio/sfx/pause_close.wav',
      victory: './assets/audio/sfx/victory_stinger.wav',
      gameOver: './assets/audio/sfx/game_over_stinger.wav'
    }
  };

  let currentMusic = null;
  let currentMusicKey = null;
  let audioUnlocked = false;

  function audioVolume(multiplier = 1) {
    return Math.max(0, Math.min(1, (state.settings?.volume ?? 0.7) * multiplier));
  }

  function playSfx(key, volumeMultiplier = 1) {
    if (state.settings?.mute) return false;
    const src = audioSources.sfx[key];
    if (!src) return false;
    try {
      const a = new Audio(src);
      a.volume = audioVolume(volumeMultiplier);
      a.preload = 'auto';
      a.play().catch(() => {});
      audioUnlocked = true;
      return true;
    } catch (_) {
      return false;
    }
  }

  function stopMusic() {
    if (currentMusic) {
      try {
        currentMusic.pause();
        currentMusic.currentTime = 0;
      } catch (_) {}
    }
    currentMusic = null;
    currentMusicKey = null;
  }

  function startMusic(key) {
    if (state.settings?.mute) {
      stopMusic();
      return;
    }
    const src = audioSources.music[key];
    if (!src) return;
    if (currentMusicKey === key && currentMusic) {
      currentMusic.volume = audioVolume(key === 'battle' ? 0.42 : 0.34);
      return;
    }
    stopMusic();
    try {
      const a = new Audio(src);
      a.loop = true;
      a.volume = audioVolume(key === 'battle' ? 0.42 : 0.34);
      a.preload = 'auto';
      currentMusic = a;
      currentMusicKey = key;
      a.play().then(() => { audioUnlocked = true; }).catch(() => {});
    } catch (_) {}
  }

  function refreshAudioVolumes() {
    if (currentMusic) currentMusic.volume = audioVolume(currentMusicKey === 'battle' ? 0.42 : 0.34);
  }

  function musicForScreen(name) {
    if (name === 'fight') return state.fightMode === 'training' ? 'training' : 'battle';
    if (name === 'battleCharacters' || name === 'stageSelect' || name === 'ready') return 'stageSelect';
    if (name === 'main' || name === 'loadGame' || name === 'gallery' || name === 'stageGallery' || name === 'options' || name === 'storySetup' || name === 'calamitySports') return 'title';
    return null;
  }

  function updateMusicForScreen(name = state.screen) {
    const musicKey = musicForScreen(name);
    if (!musicKey) return;
    startMusic(musicKey);
  }

  function unlockAudioForCurrentScreen() {
    if (audioUnlocked) {
      updateMusicForScreen(state.screen);
      return;
    }
    // Browsers need a user gesture before audio can start. This is called from clicks/keys.
    updateMusicForScreen(state.screen);
  }


  const difficultySettings = {
    easy: {
      label: 'Easy',
      desc: 'CPU is slower and less aggressive. Story enemies have lower HP and damage.',
      enemyHp: 0.78,
      enemyDamage: 0.72,
      aiAggression: 0.48,
      aiGuard: 0.004,
      aiSpecial: 0.045,
      aiCooldownMin: 48,
      aiCooldownMax: 58,
      aiMovement: 0.84
    },
    normal: {
      label: 'Normal',
      desc: 'Balanced story combat for first QA passes.',
      enemyHp: 1,
      enemyDamage: 1,
      aiAggression: 0.68,
      aiGuard: 0.006,
      aiSpecial: 0.10,
      aiCooldownMin: 28,
      aiCooldownMax: 28,
      aiMovement: 1
    },
    hard: {
      label: 'Hard',
      desc: 'CPU reacts faster, blocks more, and hits harder. Story enemies are tougher.',
      enemyHp: 1.22,
      enemyDamage: 1.18,
      aiAggression: 0.82,
      aiGuard: 0.011,
      aiSpecial: 0.15,
      aiCooldownMin: 18,
      aiCooldownMax: 22,
      aiMovement: 1.08
    },
    extreme: {
      label: 'EXTREME',
      desc: 'Aggressive CPU, heavy damage, higher HP. Built for stress testing and chaos.',
      enemyHp: 1.5,
      enemyDamage: 1.42,
      aiAggression: 0.95,
      aiGuard: 0.018,
      aiSpecial: 0.22,
      aiCooldownMin: 10,
      aiCooldownMax: 16,
      aiMovement: 1.18
    }
  };

  const LANGUAGE_LABELS = {
    english: 'English',
    spanish: 'Español',
    japanese: '日本語'
  };

  const LOCALIZATION = {
    english: {
      storyMode: 'Story Mode', loadGame: 'Load Game', tournament: 'Tournament', battleMode: 'Battle Mode', trainingMode: 'Training Mode', calamitySports: 'Calamity Sports', gallery: 'Gallery', settings: 'Settings',
      characters: 'Characters', stages: 'Stages', cutScenes: 'Cut Scenes', extras: 'Extras', back: 'Back', mainMenu: 'Main Menu', battleSetup: 'Battle Setup', battleStage: 'Battle Stage', continue: 'Continue', random: 'Random', randomStage: 'Random Stage',
      pressEnter: 'Press ENTER / Tap a menu option', pressStart: 'Press Start', updatedBattleFlow: 'Updated Battle Flow', battleFlowCopy: 'Main Menu → Battle Mode Setup → Character Select → Battle Stage → Ready Screen → Countdown → Fight.',
      miniGames: 'Mini Games', sportsCopy: 'Placeholder hub for character-based sports mini games. Basketball and Tennis are first; more can be added later as the project grows.', basketball: 'Basketball', tennis: 'Tennis', basketballCopy: 'Coming soon: pick Calamity War characters and play quick court battles.', tennisCopy: 'Coming soon: character tennis rallies with specials and power shots.', sportsChoose: 'Select a mini game. These are placeholder doors for now.',
      saveCopy: 'Five save slots for Story Mode progress. Save from a story scene, then load from here later.', characterRoster: 'Character Roster', rosterSub: 'Reference screen for the available fighters.',
      battleSetupTitle: 'Battle Setup', battleSetupCopy: 'Choose who is fighting, whether it is a single or team battle, and how many fighters each side brings before going to Character Select.', opponent: 'Opponent', playerVsPlayer: 'Player vs Player', playerVsCpu: 'Player vs CPU', cpuVsCpu: 'CPU vs CPU', battleFormat: 'Battle Format', cpuDifficulty: 'CPU Difficulty',
      p1Fighters: 'Player 1 Fighters', p2Fighters: 'Player 2 Fighters', cpuControl: 'CPU Control', cpuP1: 'CPU controls Player 1', cpuP2: 'CPU controls Player 2', continueCharacterSelect: 'Continue to Character Select', pickPlayer1: 'Pick Player 1', chooseFighters: 'Choose Fighters', randomP1: 'Random P1', randomP2: 'Random P2', randomBoth: 'Random Match Up', dummyLocked: 'Dummy Locked', randomTrainingTeam: 'Random Training Team', continueBattleStage: 'Continue to Battle Stage',
      battleStageSelect: 'Battle Stage Select', stageSetupCopy: 'Choose the arena after choosing fighters, or hit Random Stage and let the game pick where the fight happens.', stageHelp: 'Rotate the stage wheel, tap a stage thumbnail, or let the AI randomize the arena.', selected: 'Selected', aiShuffling: 'AI shuffling',
      ready: 'Ready?', readySubcopy: 'Selected stage appears below READY? and the countdown launches the fight automatically.', player1: 'Player 1', player2: 'Player 2', player2Cpu: 'Player 2', trainingDummy: 'Training Dummy',
      galleryCopy: 'Placeholder hub for unlockables and reference screens. We can flesh these out later.', galleryChoose: 'Choose a gallery section.', galleryCharactersCopy: 'Roster profiles, move notes, and character art.', galleryStagesCopy: 'Battle backgrounds and arena previews.', galleryCutscenesCopy: 'Story CGs and cinematic moments.', galleryExtrasCopy: 'Bonus art, concepts, credits, and unlockables.', stageGallery: 'Stage Gallery', stageGalleryCopy: 'Backgrounds generated first so the demo has real fight-stage identity.',
      settingsTitle: 'Settings', showHitboxes: 'Show hitboxes', storyAssistHints: 'Story mode assist hints', muteMenuSounds: 'Mute menu sounds', announcerVoice: 'Announcer voice placeholder', gameVolume: 'Game Volume', roundTimeTitle: 'Battle / Tournament Round Time', roundTimeNote: 'Set the round timer like a digital clock. Minimum is 00:30. 10:00 is the max timed round; going over 10:00 becomes ∞.', minDown: '− Min', minUp: '+ Min', secDown: '− Sec', secUp: '+ Sec', healthBarsTitle: 'Battle Mode Health Bars', healthBarsNote: 'Default is 3 layers. Set P1 or P2/CPU from 1–5 for handicap-style matches.', language: 'Language', languageNote: 'Language changes the hardcoded game UI text for this demo. Story/dialogue localization can keep expanding as scenes are finalized.', handicap: 'Handicap', off: 'Off',
      storySetup: 'Story Setup', storySetupCopy: 'Choose the story difficulty, then start from the beginning or jump to a mission/chapter beat.', storyDifficulty: 'Story Difficulty', startFullStory: 'Start Full Story', missionSelect: 'Mission Select', missionSelectCopy: 'Jump to Forest Ambush, Stone Wall Labyrinth, Diastre, Fire and Steel, or the current endpoint.',
      storyModeDefeat: 'Story Mode Defeat', gameOver: 'Game Over', retryBattle: 'Retry Battle', loadCheckpoint: 'Load Checkpoint', gameOverHelp: 'Press Enter to retry, or Escape to return to the main menu.',
      matchOver: 'Match Over', chooseNext: 'Choose your next battle option.', drawNext: 'Draw match. Run it back or choose new fighters.', rematch: 'Rematch', characterSelect: 'Character Select',
      paused: 'Paused', fightPaused: 'Fight Paused', resume: 'Resume', moveList: 'Move List', quickSettings: 'Quick Settings', mode: 'Mode', difficulty: 'Difficulty', round: 'Round', stage: 'Stage', storyAssist: 'Story Assist', on: 'On', currentActive: 'Current active', pauseHome: 'Press P or Escape to resume. You can check settings, controls, and the move list without leaving the fight.',
      easy: 'Easy', normal: 'Normal', hard: 'Hard', extreme: 'EXTREME', selectedDifficulty: 'Selected',
      easyDesc: 'CPU is slower and less aggressive. Story enemies have lower HP and damage.', normalDesc: 'Balanced story combat for first QA passes.', hardDesc: 'CPU reacts faster, blocks more, and hits harder. Story enemies are tougher.', extremeDesc: 'Aggressive CPU, heavy damage, higher HP. Built for stress testing and chaos.',
      roundWord: 'Round', fight: 'Fight!', ko: 'K.O.', youWin: 'You Win!', youLose: 'You Lose!', draw: 'Draw', time: 'Time!'
    },
    spanish: {
      storyMode: 'Modo Historia', loadGame: 'Cargar Partida', tournament: 'Torneo', battleMode: 'Modo Batalla', trainingMode: 'Entrenamiento', calamitySports: 'Deportes Calamity', gallery: 'Galería', settings: 'Ajustes',
      characters: 'Personajes', stages: 'Escenarios', cutScenes: 'Cinemáticas', extras: 'Extras', back: 'Atrás', mainMenu: 'Menú Principal', battleSetup: 'Configuración de Batalla', battleStage: 'Escenario de Batalla', continue: 'Continuar', random: 'Aleatorio', randomStage: 'Escenario Aleatorio',
      pressEnter: 'Presiona ENTER / Toca una opción', pressStart: 'Presiona Start', updatedBattleFlow: 'Flujo de Batalla Actualizado', battleFlowCopy: 'Menú Principal → Configuración → Selección de Personaje → Escenario → Pantalla Ready → Cuenta Regresiva → Pelea.',
      miniGames: 'Minijuegos', sportsCopy: 'Centro provisional para minijuegos con personajes. Baloncesto y Tenis son los primeros; se pueden agregar más después.', basketball: 'Baloncesto', tennis: 'Tenis', basketballCopy: 'Próximamente: elige personajes de Calamity War y juega batallas rápidas en cancha.', tennisCopy: 'Próximamente: rallies de tenis con especiales y golpes poderosos.', sportsChoose: 'Elige un minijuego. Por ahora son puertas provisionales.',
      saveCopy: 'Cinco espacios de guardado para el progreso del Modo Historia. Guarda desde una escena y carga desde aquí después.', characterRoster: 'Lista de Personajes', rosterSub: 'Pantalla de referencia para los luchadores disponibles.',
      battleSetupTitle: 'Configuración de Batalla', battleSetupCopy: 'Elige quién pelea, si será combate individual o por equipos, y cuántos luchadores trae cada lado antes de seleccionar personajes.', opponent: 'Oponente', playerVsPlayer: 'Jugador vs Jugador', playerVsCpu: 'Jugador vs CPU', cpuVsCpu: 'CPU vs CPU', battleFormat: 'Formato de Batalla', cpuDifficulty: 'Dificultad CPU',
      p1Fighters: 'Luchadores Jugador 1', p2Fighters: 'Luchadores Jugador 2 / CPU', cpuControl: 'Control de CPU', cpuP1: 'CPU controla Jugador 1', cpuP2: 'CPU controla Jugador 2', continueCharacterSelect: 'Continuar a Selección de Personaje', pickPlayer1: 'Elige Jugador 1', chooseFighters: 'Elige Luchadores', randomP1: 'Aleatorio J1', randomP2: 'Aleatorio J2', randomBoth: 'Encuentro Aleatorio', dummyLocked: 'Dummy bloqueado', randomTrainingTeam: 'Equipo de entrenamiento aleatorio', continueBattleStage: 'Continuar a Escenario',
      battleStageSelect: 'Selección de Escenario', stageSetupCopy: 'Elige la arena después de elegir luchadores, o usa Escenario Aleatorio para que el juego decida.', stageHelp: 'Gira la rueda de escenarios, toca una miniatura, o deja que la IA aleatorice la arena.', selected: 'Seleccionado', aiShuffling: 'IA mezclando',
      ready: '¿Listos?', readySubcopy: 'El escenario elegido aparece debajo de READY? y la cuenta regresiva inicia la pelea automáticamente.', player1: 'Jugador 1', player2: 'Jugador 2', player2Cpu: 'Jugador 2', trainingDummy: 'Muñeco de Práctica',
      galleryCopy: 'Centro provisional para desbloqueables y pantallas de referencia. Podemos detallarlo después.', galleryChoose: 'Elige una sección de la galería.', galleryCharactersCopy: 'Perfiles, notas de movimientos y arte de personajes.', galleryStagesCopy: 'Fondos de batalla y vistas previas de arenas.', galleryCutscenesCopy: 'CGs de historia y momentos cinemáticos.', galleryExtrasCopy: 'Arte extra, conceptos, créditos y desbloqueables.', stageGallery: 'Galería de Escenarios', stageGalleryCopy: 'Los fondos se generaron primero para que el demo tenga identidad visual de arenas.',
      settingsTitle: 'Ajustes', showHitboxes: 'Mostrar hitboxes', storyAssistHints: 'Ayudas del Modo Historia', muteMenuSounds: 'Silenciar sonidos del menú', announcerVoice: 'Voz provisional del anunciador', gameVolume: 'Volumen del Juego', roundTimeTitle: 'Tiempo de Ronda Batalla / Torneo', roundTimeNote: 'Configura el temporizador como reloj digital. Mínimo 00:30. 10:00 es el máximo; pasar de 10:00 se vuelve ∞.', minDown: '− Min', minUp: '+ Min', secDown: '− Seg', secUp: '+ Seg', healthBarsTitle: 'Barras de Salud del Modo Batalla', healthBarsNote: 'El valor predeterminado es 3 capas. Ajusta J1 o J2/CPU de 1–5 como handicap.', language: 'Idioma', languageNote: 'El idioma cambia el texto de interfaz codificado para este demo. La historia puede traducirse más a medida que se finalice.', handicap: 'Handicap', off: 'Desactivado',
      storySetup: 'Configuración de Historia', storySetupCopy: 'Elige la dificultad de historia y empieza desde el principio o salta a una misión.', storyDifficulty: 'Dificultad de Historia', startFullStory: 'Comenzar Historia Completa', missionSelect: 'Selección de Misión', missionSelectCopy: 'Salta a Emboscada del Bosque, Laberinto de Piedra, Diastre, Fuego y Acero, o el punto actual.',
      storyModeDefeat: 'Derrota del Modo Historia', gameOver: 'Game Over', retryBattle: 'Reintentar Batalla', loadCheckpoint: 'Cargar Punto de Control', gameOverHelp: 'Presiona Enter para reintentar, o Escape para volver al menú principal.',
      matchOver: 'Fin del Combate', chooseNext: 'Elige tu próxima opción de batalla.', drawNext: 'Empate. Revancha o elige nuevos luchadores.', rematch: 'Revancha', characterSelect: 'Selección de Personaje',
      paused: 'Pausa', fightPaused: 'Pelea en Pausa', resume: 'Continuar', moveList: 'Lista de Movimientos', quickSettings: 'Ajustes Rápidos', mode: 'Modo', difficulty: 'Dificultad', round: 'Ronda', stage: 'Escenario', storyAssist: 'Ayuda de Historia', on: 'Activado', currentActive: 'Activo actual', pauseHome: 'Presiona P o Escape para continuar. Puedes revisar ajustes, controles y movimientos sin salir de la pelea.',
      easy: 'Fácil', normal: 'Normal', hard: 'Difícil', extreme: 'EXTREMO', selectedDifficulty: 'Seleccionado',
      easyDesc: 'La CPU es más lenta y menos agresiva. Los enemigos de historia tienen menos HP y daño.', normalDesc: 'Combate equilibrado para las primeras pruebas QA.', hardDesc: 'La CPU reacciona más rápido, bloquea más y golpea más fuerte. Los enemigos de historia son más duros.', extremeDesc: 'CPU agresiva, daño alto y más HP. Hecho para pruebas de estrés y caos.',
      roundWord: 'Ronda', fight: '¡Pelea!', ko: 'K.O.', youWin: '¡Ganaste!', youLose: '¡Perdiste!', draw: 'Empate', time: '¡Tiempo!'
    },
    japanese: {
      storyMode: 'ストーリーモード', loadGame: 'ロードゲーム', tournament: 'トーナメント', battleMode: 'バトルモード', trainingMode: 'トレーニングモード', calamitySports: 'カラミティスポーツ', gallery: 'ギャラリー', settings: '設定',
      characters: 'キャラクター', stages: 'ステージ', cutScenes: 'カットシーン', extras: 'エクストラ', back: '戻る', mainMenu: 'メインメニュー', battleSetup: 'バトル設定', battleStage: 'バトルステージ', continue: '続ける', random: 'ランダム', randomStage: 'ランダムステージ',
      pressEnter: 'ENTER / メニューをタップ', pressStart: 'スタートを押す', updatedBattleFlow: '更新済みバトルフロー', battleFlowCopy: 'メインメニュー → バトル設定 → キャラクター選択 → ステージ選択 → READY画面 → カウントダウン → ファイト。',
      miniGames: 'ミニゲーム', sportsCopy: 'キャラクターを使ったミニゲーム用の仮ハブ。まずはバスケットボールとテニス。後で追加できます。', basketball: 'バスケットボール', tennis: 'テニス', basketballCopy: '近日追加：キャラクターを選んでクイックなコートバトル。', tennisCopy: '近日追加：必殺技とパワーショットつきテニス。', sportsChoose: 'ミニゲームを選んでください。今は仮の入口です。',
      saveCopy: 'ストーリーモード進行用の5つのセーブスロット。シーンから保存し、ここからロードできます。', characterRoster: 'キャラクター一覧', rosterSub: '使用可能ファイターの参照画面。',
      battleSetupTitle: 'バトル設定', battleSetupCopy: '誰が戦うか、個人戦かチーム戦か、各サイドの人数を選んでからキャラクター選択へ進みます。', opponent: '相手', playerVsPlayer: 'プレイヤー vs プレイヤー', playerVsCpu: 'プレイヤー vs CPU', cpuVsCpu: 'CPU vs CPU', battleFormat: 'バトル形式', cpuDifficulty: 'CPU難易度',
      p1Fighters: 'プレイヤー1人数', p2Fighters: 'プレイヤー2人数', cpuControl: 'CPU操作', cpuP1: 'CPUがプレイヤー1を操作', cpuP2: 'CPUがプレイヤー2を操作', continueCharacterSelect: 'キャラクター選択へ', pickPlayer1: 'プレイヤー1を選択', chooseFighters: 'ファイター選択', randomP1: 'P1ランダム', randomP2: 'P2ランダム', randomBoth: 'ランダム対戦', dummyLocked: 'ダミー固定', randomTrainingTeam: 'トレーニングチームランダム', continueBattleStage: 'ステージ選択へ',
      battleStageSelect: 'バトルステージ選択', stageSetupCopy: 'ファイターを選んだ後にアリーナを選ぶか、ランダムで決定します。', stageHelp: 'ステージホイールを回す、サムネイルを押す、またはランダムにします。', selected: '選択中', aiShuffling: 'AIシャッフル中',
      ready: 'READY?', readySubcopy: '選択ステージがREADY?の下に表示され、カウントダウン後に自動で開始します。', player1: 'プレイヤー1', player2: 'プレイヤー2', player2Cpu: 'プレイヤー2', trainingDummy: 'トレーニングダミー',
      galleryCopy: 'アンロック要素と参照画面の仮ハブ。後で fleshing out できます。', galleryChoose: 'ギャラリー項目を選択。', galleryCharactersCopy: 'プロフィール、技メモ、キャラクターアート。', galleryStagesCopy: 'バトル背景とアリーナプレビュー。', galleryCutscenesCopy: 'ストーリーCGとシネマ演出。', galleryExtrasCopy: 'ボーナスアート、コンセプト、クレジット、アンロック要素。', stageGallery: 'ステージギャラリー', stageGalleryCopy: 'デモにステージ個性を出すため、背景を先に作成。',
      settingsTitle: '設定', showHitboxes: 'ヒットボックス表示', storyAssistHints: 'ストーリー補助ヒント', muteMenuSounds: 'メニュー音をミュート', announcerVoice: '仮アナウンサー音声', gameVolume: 'ゲーム音量', roundTimeTitle: 'バトル / トーナメント ラウンド時間', roundTimeNote: 'デジタル時計のように設定。最小00:30。最大10:00で、それを超えると∞になります。', minDown: '− 分', minUp: '+ 分', secDown: '− 秒', secUp: '+ 秒', healthBarsTitle: 'バトルモード体力バー', healthBarsNote: '初期値は3レイヤー。P1またはP2/CPUを1〜5に設定してハンデとして使えます。', language: '言語', languageNote: 'このデモではハードコードされたUIテキストを切り替えます。ストーリー翻訳はシーン確定後に拡張できます。', handicap: 'ハンデ', off: 'オフ',
      storySetup: 'ストーリー設定', storySetupCopy: 'ストーリー難易度を選び、最初から始めるかミッションにジャンプします。', storyDifficulty: 'ストーリー難易度', startFullStory: 'ストーリー開始', missionSelect: 'ミッション選択', missionSelectCopy: '森の奇襲、石壁迷宮、ディアストレ、炎と鋼、現在地点へジャンプ。',
      storyModeDefeat: 'ストーリーモード敗北', gameOver: 'ゲームオーバー', retryBattle: 'バトル再挑戦', loadCheckpoint: 'チェックポイント読込', gameOverHelp: 'Enterで再挑戦、Escapeでメインメニューへ戻ります。',
      matchOver: '試合終了', chooseNext: '次のバトル操作を選択。', drawNext: '引き分け。再戦または新しいファイターを選択。', rematch: '再戦', characterSelect: 'キャラクター選択',
      paused: 'ポーズ', fightPaused: 'バトル一時停止', resume: '再開', moveList: '技リスト', quickSettings: 'クイック設定', mode: 'モード', difficulty: '難易度', round: 'ラウンド', stage: 'ステージ', storyAssist: 'ストーリー補助', on: 'オン', currentActive: '現在の操作キャラ', pauseHome: 'PまたはEscapeで再開。バトルを離れずに設定、操作、技リストを確認できます。',
      easy: 'イージー', normal: 'ノーマル', hard: 'ハード', extreme: 'EXTREME', selectedDifficulty: '選択中',
      easyDesc: 'CPUは遅く、攻撃性も低め。ストーリー敵のHPとダメージも低下。', normalDesc: '初回QA向けのバランス型ストーリー戦闘。', hardDesc: 'CPUの反応、ガード、火力が上昇。ストーリー敵も強化。', extremeDesc: '高攻撃性、高ダメージ、高HP。ストレステストと混沌用。',
      roundWord: 'ラウンド', fight: 'ファイト！', ko: 'K.O.', youWin: '勝利！', youLose: '敗北！', draw: '引き分け', time: 'タイム！'
    }
  };

  const LANG_TAGS = { english: 'en', spanish: 'es', japanese: 'ja' };

  function currentLanguage() {
    return LOCALIZATION[state.settings.language] ? state.settings.language : 'english';
  }

  function t(key) {
    const lang = currentLanguage();
    return LOCALIZATION[lang]?.[key] || LOCALIZATION.english[key] || key;
  }

  function setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  function setAllText(selector, text) {
    document.querySelectorAll(selector).forEach(el => { el.textContent = text; });
  }

  function setLabelPrefix(inputId, text) {
    const input = document.getElementById(inputId);
    const label = input?.closest('label');
    if (!label) return;
    const node = Array.from(label.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
    if (node) node.nodeValue = `${text} `;
  }

  function languageOptionsHtml() {
    return Object.entries(LANGUAGE_LABELS).map(([value, label]) => `<option value="${value}" ${currentLanguage() === value ? 'selected' : ''}>${label}</option>`).join('');
  }

  function syncLanguageSelects() {
    document.querySelectorAll('select.language-select-control').forEach(select => {
      const selected = currentLanguage();
      if (!select.dataset.built) {
        select.innerHTML = languageOptionsHtml();
        select.dataset.built = 'true';
      }
      select.value = selected;
    });
  }

  function wireInlineLanguageSelect(select) {
    if (!select || select.dataset.wired) return;
    select.dataset.wired = 'true';
    select.addEventListener('change', e => setLanguage(e.target.value));
  }


  // v0.50: Ornate main-menu selector support.
  // The main-menu buttons are no longer plain text boxes. Each one is a real button
  // containing a left diamond, stretchable center bar, right ornate arrow tip, and a label.
  function decorateMainMenuButton(btn) {
    if (!btn || btn.querySelector('.menu-selector-frame')) return;
    const labelText = (btn.textContent || '').trim();
    btn.textContent = '';
    const frame = document.createElement('span');
    frame.className = 'menu-selector-frame';
    frame.setAttribute('aria-hidden', 'true');
    frame.innerHTML = '<span class="selector-left"></span><span class="selector-center"></span><span class="selector-right"></span>';
    const label = document.createElement('span');
    label.className = 'menu-label';
    label.textContent = labelText;
    btn.append(frame, label);
  }

  function decorateMainMenuButtons() {
    document.querySelectorAll('.main-menu .main-buttons button').forEach(decorateMainMenuButton);
  }

  function setOrnateMainMenuButtonLabel(btn, label) {
    if (!btn) return;
    decorateMainMenuButton(btn);
    const menuLabel = btn.querySelector('.menu-label');
    if (menuLabel) menuLabel.textContent = label;
    else btn.textContent = label;
  }

  function setLanguage(language) {
    state.settings.language = LOCALIZATION[language] ? language : 'english';
    applyLanguage();
    const note = document.getElementById('languagePlaceholderNote');
    if (note) note.textContent = t('languageNote');
  }

  function applyLanguage() {
    const lang = currentLanguage();
    document.documentElement.lang = LANG_TAGS[lang] || 'en';

    const actionLabels = {
      story: t('storyMode'), 'load-game': t('loadGame'), tournament: t('tournament'), pvp: t('battleMode'), training: t('trainingMode'), 'calamity-sports': t('calamitySports'), gallery: t('gallery'), options: t('settings'),
      'gallery-characters': t('characters'), 'gallery-stages': t('stages'), 'gallery-cutscenes': t('cutScenes'), 'gallery-extras': t('extras')
    };
    decorateMainMenuButtons();
    Object.entries(actionLabels).forEach(([action, label]) => {
      document.querySelectorAll(`[data-action="${action}"]`).forEach(btn => {
        if (btn.matches('.main-menu .main-buttons button')) setOrnateMainMenuButtonLabel(btn, label);
        else if (btn.matches('.settings-shortcut')) btn.textContent = `⚙ ${t('settings')}`;
        else if (btn.querySelector('strong')) btn.querySelector('strong').textContent = label;
        else btn.textContent = label;
      });
    });

    setAllText('.settings-shortcut', `⚙ ${t('settings')}`);
    document.querySelectorAll('.back-btn[data-action="back"]').forEach(btn => btn.textContent = `← ${t('mainMenu')}`);
    document.querySelectorAll('.back-btn[data-action="battle-characters"], #stageBackInline').forEach(btn => btn.textContent = t('back'));
    document.querySelectorAll('.back-btn[data-action="stage-back"]').forEach(btn => btn.textContent = `← ${t('battleStage')}`);
    document.querySelectorAll('.back-btn[data-action="story"]').forEach(btn => btn.textContent = `← ${t('storySetup')}`);
    document.querySelectorAll('.back-btn[data-action="gallery"]').forEach(btn => btn.textContent = `← ${t('gallery')}`);

    setText('.press-start', t('pressEnter'));
    setText('.lore-box h2', t('updatedBattleFlow'));
    setText('.lore-box p', t('battleFlowCopy'));

    setText('#calamitySportsScreen .kicker', t('miniGames'));
    setText('#calamitySportsScreen h1', t('calamitySports'));
    setText('#calamitySportsScreen .sports-wrap > p', t('sportsCopy'));
    const sportsCards = document.querySelectorAll('#calamitySportsScreen .sports-card');
    if (sportsCards[0]) { sportsCards[0].querySelector('strong').textContent = t('basketball'); sportsCards[0].querySelector('em').textContent = t('basketballCopy'); }
    if (sportsCards[1]) { sportsCards[1].querySelector('strong').textContent = t('tennis'); sportsCards[1].querySelector('em').textContent = t('tennisCopy'); }

    setText('#loadGameScreen .kicker', t('storyMode'));
    setText('#loadGameScreen h1', t('loadGame'));
    setText('#loadGameScreen .save-wrap > p', t('saveCopy'));

    setText('#characterScreen .roster-panel h1', t('characterRoster'));
    setText('#characterScreen .roster-panel .sub', t('rosterSub'));

    setText('#pvpScreen .kicker', t('battleMode'));
    setText('#pvpScreen h1', t('battleSetupTitle'));
    setText('#pvpScreen .battle-mode-card > p', t('battleSetupCopy'));
    const pvpPanels = document.querySelectorAll('#pvpScreen .compact-panel h2');
    if (pvpPanels[0]) pvpPanels[0].textContent = t('opponent');
    if (pvpPanels[1]) pvpPanels[1].textContent = t('battleFormat');
    if (pvpPanels[2]) pvpPanels[2].textContent = t('cpuDifficulty');
    const modeBtns = document.querySelectorAll('#battleModeButtons button');
    if (modeBtns[0]) modeBtns[0].textContent = t('playerVsPlayer');
    if (modeBtns[1]) modeBtns[1].textContent = t('playerVsCpu');
    if (modeBtns[2]) modeBtns[2].textContent = t('cpuVsCpu');
    const teamRows = document.querySelectorAll('#pvpScreen .team-size-row span');
    if (teamRows[0]) teamRows[0].textContent = t('p1Fighters');
    if (teamRows[1]) teamRows[1].textContent = t('p2Fighters');
    const nextButton = document.querySelector('[data-action="battle-open-select"] strong');
    if (nextButton) nextButton.textContent = t('continueCharacterSelect');

    setText('#battleSetupTitle', t('chooseFighters'));
    setText('#battleRosterTitle', t('pickPlayer1'));
    setText('#randomP1', t('randomP1'));
    setText('#randomP2', t('randomP2'));
    setText('#randomBoth', t('randomBoth'));
    setText('#confirmBattleCharacters', t('continueBattleStage'));

    setText('#stageSelectScreen h1', t('battleStageSelect'));
    setText('#stageSetupCopy', t('stageSetupCopy'));
    setText('#stageSelectScreen .stage-help', t('stageHelp'));
    setText('#randomStage', t('random'));
    setText('#startConfiguredBattle', t('continue'));

    setText('#readyTitle', t('ready'));
    setText('.ready-subcopy', t('readySubcopy'));
    setText('.ready-team-p1 h2', t('player1'));
    setText('.ready-team-p2 h2', t('player2'));

    setText('#galleryScreen .kicker', t('gallery').toUpperCase());
    setText('#galleryScreen h1', t('gallery'));
    setText('#galleryScreen .gallery-hub-wrap > p', t('galleryCopy'));
    const galleryCards = document.querySelectorAll('#galleryScreen .gallery-hub-grid button');
    const galleryKeys = [['characters','galleryCharactersCopy'],['stages','galleryStagesCopy'],['cutScenes','galleryCutscenesCopy'],['extras','galleryExtrasCopy']];
    galleryCards.forEach((card, i) => { const keys = galleryKeys[i]; if (!keys) return; card.querySelector('strong').textContent = t(keys[0]); card.querySelector('span').textContent = t(keys[1]); });
    setText('#stageGalleryScreen h1', t('stageGallery'));
    setText('#stageGalleryScreen > p', t('stageGalleryCopy'));

    setText('#optionsScreen h1', t('settingsTitle'));
    setLabelPrefix('toggleDebug', t('showHitboxes'));
    setLabelPrefix('toggleAssist', t('storyAssistHints'));
    setLabelPrefix('toggleMenuMute', t('muteMenuSounds'));
    setLabelPrefix('toggleAnnouncerVoice', t('announcerVoice'));
    setLabelPrefix('gameVolumeSlider', t('gameVolume'));
    setText('.round-time-setting h2', t('roundTimeTitle'));
    setText('.round-time-setting .settings-note', t('roundTimeNote'));
    setText('#roundMinDown', t('minDown'));
    setText('#roundMinUp', t('minUp'));
    setText('#roundSecDown', t('secDown'));
    setText('#roundSecUp', t('secUp'));
    setText('.health-layer-setting h2', t('healthBarsTitle'));
    setText('.health-layer-setting .settings-note', t('healthBarsNote'));
    const layerSpans = document.querySelectorAll('.health-layer-row span');
    if (layerSpans[0]) layerSpans[0].textContent = t('player1');
    if (layerSpans[1]) layerSpans[1].textContent = t('player2Cpu');
    setLabelPrefix('languageSelect', t('language'));
    setText('#languagePlaceholderNote', t('languageNote'));
    setLabelPrefix('handicapSelect', t('handicap'));
    const handicap = document.getElementById('handicapSelect');
    if (handicap) {
      const labels = [t('off'), `${t('player1')} +25% HP`, `${t('player2Cpu')} +25% HP`, `${t('player1')} -25% HP`, `${t('player2Cpu')} -25% HP`];
      Array.from(handicap.options).forEach((opt, i) => { if (labels[i]) opt.textContent = labels[i]; });
    }

    setText('#storySetupScreen .kicker', t('storySetup'));
    setText('#storySetupScreen h1', t('storyMode'));
    setText('#storySetupScreen .mode-card > p', t('storySetupCopy'));
    setText('#storySetupScreen .difficulty-panel h2', t('storyDifficulty'));
    const storyModeButtons = document.querySelectorAll('#storySetupScreen .mode-buttons button');
    if (storyModeButtons[0]) { storyModeButtons[0].querySelector('strong').textContent = t('startFullStory'); }
    if (storyModeButtons[1]) { storyModeButtons[1].querySelector('strong').textContent = t('missionSelect'); storyModeButtons[1].querySelector('span').textContent = t('missionSelectCopy'); }
    setText('#missionScreen .kicker', t('storyMode'));
    setText('#missionScreen h1', t('missionSelect'));

    setText('#continueStory', t('continue'));
    setText('#skipToFight', t('fight'));
    setText('#openSaveSlots', t('loadGame').replace(/^Load|^Cargar|^ロードゲーム$/, t('loadGame')));

    setText('#gameOverScreen .kicker', t('storyModeDefeat'));
    setText('#gameOverScreen h1', t('gameOver'));
    setText('#retryStoryBattle', t('retryBattle'));
    setText('#loadStoryCheckpoint', t('loadCheckpoint'));
    setText('#gameOverMainMenu', t('mainMenu'));
    setText('#gameOverScreen p', t('gameOverHelp'));

    setText('#matchOverOverlay .kicker', t('matchOver'));
    setText('#matchOverSubtitle', t('chooseNext'));
    setText('#matchRematch', t('rematch'));
    setText('#matchCharacterSelect', t('characterSelect'));
    setText('#matchMainMenu', t('mainMenu'));

    setText('#pauseOverlay .kicker', t('paused'));
    setText('#pauseOverlay h2', t('fightPaused'));
    setText('#pauseResume', t('resume'));
    setText('#pauseSettings', t('settings'));
    setText('#pauseMoveList', t('moveList'));
    setText('#pauseMainMenu', t('mainMenu'));

    document.querySelectorAll('.player-label').forEach((el, i) => { el.textContent = i === 0 ? t('player1').toUpperCase() : t('player2').toUpperCase(); });
    syncLanguageSelects();
    refreshDifficultyUI(false);
  }


  function difficultyLabel(key) {
    const labels = { easy: t('easy'), normal: t('normal'), hard: t('hard'), extreme: t('extreme') };
    return labels[key] || labels.normal;
  }

  function difficultyDesc(key) {
    const descs = { easy: t('easyDesc'), normal: t('normalDesc'), hard: t('hardDesc'), extreme: t('extremeDesc') };
    return descs[key] || descs.normal;
  }

  function trainingDummyBehaviorLabel(key = state.settings.trainingDummyBehavior) {
    return ({ idle: 'Idle', block: 'Block', attack: 'Attack' })[key] || 'Idle';
  }

  function applyTrainingDummyDifficulty(fighter) {
    if (!fighter) return;
    const behavior = state.settings.trainingDummyBehavior || 'idle';
    const diffKey = state.settings.trainingDummyDifficulty || 'normal';
    const diff = difficultySettings[diffKey] || difficultySettings.normal;
    fighter.isTrainingDummy = true;
    fighter.dummyBehavior = behavior;
    fighter.dummyDifficulty = diffKey;
    fighter.name = trainingDummyDisplayName();
    fighter.id = 'dummy';
    fighter.c = { ...fighter.c, name: trainingDummyDisplayName(), color: state.settings.trainingDummyType === 'ninja' ? '#7e43ff' : '#777777' };
    fighter.isAI = behavior === 'attack';
    fighter.guard = behavior === 'block';
    fighter.aiAggression = diff.aiAggression;
    fighter.aiGuard = behavior === 'block' ? 1 : diff.aiGuard;
    fighter.aiSpecial = diff.aiSpecial;
    fighter.aiCooldownMin = diff.aiCooldownMin;
    fighter.aiCooldownMax = diff.aiCooldownMax;
    fighter.aiMovement = behavior === 'attack' ? diff.aiMovement : 0;
    fighter.damageMod = behavior === 'attack' ? Math.max(.35, diff.enemyDamage || 1) : 0;
  }

  function applyTrainingDummySettingsLive() {
    const f = state.fight;
    if (!f || !f.training) return;
    const dummy = f.team2?.[0] || f.p2;
    applyTrainingDummyDifficulty(dummy);
    if (dummy) {
      dummy.hp = dummy.maxHp;
      dummy.meter = dummy.maxMeter;
      dummy.dead = false;
      dummy.attackTimer = 0;
      dummy.attackKind = null;
      dummy.hitCooldown = 0;
      dummy.x = Math.max(dummy.x, 640);
      dummy.facing = -1;
    }
    f.p2 = dummy;
    updateFightNames();
    updateRoundSplash();
    const modeHint = document.getElementById('modeHint');
    if (modeHint) modeHint.textContent = `TRAINING: ${trainingDummyDisplayName()} · ${trainingDummyBehaviorLabel()}${state.settings.trainingDummyBehavior === 'attack' ? ` · CPU ${difficultyLabel(state.settings.trainingDummyDifficulty)}` : ''} · Q/E switch · R reset`;
  }

  function wireTrainingDummyPauseControls() {
    const typeSelect = document.getElementById('trainingDummyTypeSelect');
    const behaviorSelect = document.getElementById('trainingDummyBehaviorSelect');
    const difficultySelect = document.getElementById('trainingDummyDifficultySelect');
    const difficultyRow = document.getElementById('trainingDummyDifficultyRow');
    const status = document.getElementById('trainingDummySettingsStatus');
    const sync = () => {
      if (typeSelect) state.settings.trainingDummyType = typeSelect.value === 'ninja' ? 'ninja' : 'shadow';
      if (behaviorSelect) state.settings.trainingDummyBehavior = ['idle','block','attack'].includes(behaviorSelect.value) ? behaviorSelect.value : 'idle';
      if (difficultySelect) state.settings.trainingDummyDifficulty = ['easy','normal','hard','extreme'].includes(difficultySelect.value) ? difficultySelect.value : 'normal';
      if (difficultyRow) difficultyRow.classList.toggle('muted-row', state.settings.trainingDummyBehavior !== 'attack');
      if (difficultySelect) difficultySelect.disabled = state.settings.trainingDummyBehavior !== 'attack';
      applyTrainingDummySettingsLive();
      if (status) status.textContent = `${trainingDummyDisplayName()} · ${trainingDummyBehaviorLabel()}${state.settings.trainingDummyBehavior === 'attack' ? ` · CPU ${difficultyLabel(state.settings.trainingDummyDifficulty)}` : ''}`;
    };
    [typeSelect, behaviorSelect, difficultySelect].forEach(el => el?.addEventListener('change', sync));
    sync();
  }

  function refreshDifficultyUI(updateLanguage = true) {
    const storyCopy = document.getElementById('storyDifficultyText');
    const cpuCopy = document.getElementById('cpuDifficultyText');
    if (storyCopy) storyCopy.textContent = difficultyDesc(state.storyDifficulty);
    const storySelected = document.getElementById('storyDifficultySelected');
    if (storySelected) storySelected.textContent = `${t('selectedDifficulty')}: ${difficultyLabel(state.storyDifficulty)}`;
    if (cpuCopy) cpuCopy.textContent = difficultyDesc(state.cpuDifficulty);
    document.querySelectorAll('#storyDifficultyButtons button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.difficulty === state.storyDifficulty);
      btn.textContent = difficultyLabel(btn.dataset.difficulty);
    });
    document.querySelectorAll('#cpuDifficultyButtons button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.difficulty === state.cpuDifficulty);
      btn.textContent = difficultyLabel(btn.dataset.difficulty);
    });
  }

  const characters = {
    rai: { name: 'RAI', role: 'Heir of Two Storms', age: 12, style: 'Sword / Lightning / Void', color: '#d2202f', bio: 'A reckless young warrior carrying legacy, discipline, and the pressure of a bloodline he barely understands.', stats: [84, 88, 62, 78, 86], hp: 112, speed: 4.45, power: 1.08, special: 'Void Calamity' },
    shanti: { name: 'SHANTI', role: 'Forceful Guardian', age: 15, style: 'Pink Kan / Guardian', color: '#ff3aa5', bio: 'Sharp-tongued and fiercely protective. Her pink energy excels at pressure, reversals, and crowd control.', stats: [74, 78, 62, 76, 86], hp: 105, speed: 4.0, power: 1.06, special: 'Force Pulse' },
    nico: { name: 'NICO', role: 'A-Class Mercenary', age: 12, style: 'Dual Blades / Precision', color: '#1689ff', bio: 'Fast, suspicious, and loyal once trust is earned. He does not flinch, even against fear itself.', stats: [82, 94, 56, 86, 72], hp: 106, speed: 4.85, power: 1.04, special: 'Twin Arc' },
    adrian: { name: 'ADRIAN', role: 'Shadow Warrior', age: 21, style: 'Shadow Blade', color: '#7e43ff', bio: 'Disciplined master and mission gatekeeper. Calm, surgical, and impossible to read.', stats: [83, 72, 70, 93, 81], hp: 125, speed: 3.8, power: 1.12, special: 'Shadow Step' },
    malachai: { name: 'MALACHAI', role: 'Protector', age: 36, style: 'Sword / Guardian', color: '#d9bc7b', bio: 'A warrior, protector, and hero whose shadow hangs over Rai’s path.', stats: [92, 65, 86, 80, 90], hp: 140, speed: 3.4, power: 1.25, special: 'Heroic Cleave' },
    diego: { name: 'DIEGO', role: 'Dragon Knight', age: 12, style: 'Dark Esplanade', color: '#7c39ff', bio: 'Forged by loss and driven by rage. His darkness is power, prison, and shield all at once.', stats: [86, 78, 72, 76, 92], hp: 120, speed: 4.05, power: 1.18, special: 'Dark Esplanade' },
    mani: { name: 'MANI', role: 'Dragon Knight', age: 12, style: 'Wind / Blade', color: '#42d8ff', bio: 'Disciplined, mission-first, and brutally focused. Her wind Kan turns precision into pressure.', stats: [76, 86, 70, 88, 78], hp: 112, speed: 4.35, power: 1.04, special: 'Kekku: Fukai' },
    rikku: { name: 'RIKKU', role: 'Assassin', age: 12, style: 'Knife / Mimicry', color: '#d69c45', bio: 'An assassin hired to observe Rai. Deadpan, dangerous, and much softer than she wants anyone to know.', stats: [78, 92, 50, 88, 68], hp: 98, speed: 4.9, power: 1.0, special: 'Mimicry' },
    akila: { name: 'AKILA', role: 'Sleeping God?', age: 12, style: 'Hidden Power / Staff', color: '#e5a142', bio: 'Acts sleepy, snack-obsessed, and unserious on purpose. That is misdirection: his true combat ceiling has not been revealed, but the game treats him as hidden god-tier.', stats: [98, 99, 94, 100, 97], hp: 145, speed: 5.05, power: 1.32, special: 'Eyes Open', hiddenGod: true },
    akira: { name: 'AKIRA', role: 'White Storm', age: 16, style: 'Wind / Kickboxing Champion', color: '#59a7ff', bio: 'The undefeated world youth champion. He moves like a storm and treats impossible exams like warm-ups.', stats: [92, 96, 78, 94, 90], hp: 135, speed: 4.95, power: 1.28, special: 'Bakuhatsu: Concentrate' },
    shinichi: { name: 'SHINICHI TEN’NO', role: 'Ten’no Heir', age: 14, style: 'Shadow Sweep / Iaido', color: '#a98cff', bio: 'Disciplined, cold, and burdened by clan legacy. He wants answers from Rai, whether Rai has them or not.', stats: [84, 86, 72, 90, 78], hp: 118, speed: 4.35, power: 1.1, special: 'Shadow Sweep' },
    yuta: { name: 'YUTA TEN’NO', role: 'Exam Entrant', age: 12, style: 'Twin Purgatory', color: '#b9a074', bio: 'A quick, aggressive Ten’no fighter who attacks from the flank with both swords.', stats: [78, 88, 58, 74, 74], hp: 104, speed: 4.55, power: 1.04, special: 'Twin Purgatory' },
    daisuke: { name: 'DAISUKE TEN’NO', role: 'Lightning Sniper', age: 12, style: 'Light Judgment', color: '#f6d365', bio: 'A Ten’no prodigy whose light technique forces Rai to answer with power he does not yet understand.', stats: [80, 80, 60, 82, 86], hp: 108, speed: 4.0, power: 1.1, special: 'Light Judgment' },
    michelle: { name: 'MICHELLE', role: 'Hathor Mercenary', age: 12, style: 'Close Combat / Green Kan', color: '#2ec471', bio: 'Nico’s village ally. She is sharp, protective, flirty, and lethal when the mission turns ugly.', stats: [78, 86, 58, 82, 74], hp: 104, speed: 4.5, power: 1.03, special: 'Green Flash' },
    miwa: { name: 'MIWA', role: 'Hathor Mercenary', age: 21, style: 'Wind Saber', color: '#2d5edb', bio: 'A tactical frontline fighter whose wind control slices through fire, pressure, and arrogance.', stats: [82, 82, 72, 92, 78], hp: 115, speed: 4.15, power: 1.08, special: 'Kekku: Fukai' },
    vasta: { name: 'VASTA', role: 'Disruptor', age: 21, style: 'Fire / Steel-Melt', color: '#a755ff', bio: 'A stylish opportunist whose fireballs change concentration, heat, density, and velocity.', stats: [86, 76, 60, 92, 88], hp: 114, speed: 4.0, power: 1.12, special: 'Flame Sword: Inferno Reaver' },
    diastre: { name: 'DIASTRE', role: 'The Fear Monger', age: '??', style: 'Valdore / Fear', color: '#ff1d24', bio: 'A red-haired monster who leaks fear, breaks wills, and treats strong opponents as entertainment.', stats: [98, 90, 88, 72, 99], hp: 155, speed: 4.45, power: 1.38, special: 'Valdore' },
    dante: { name: 'DANTE ARIES', role: 'Warlord of Aries', age: 42, style: 'Earth / Fire / Conqueror', color: '#b87333', bio: 'The warlord of Aries Kingdom. Built as a late-game boss-tier presence until exact final tuning is locked.', stats: [98, 62, 98, 82, 99], hp: 170, speed: 3.1, power: 1.42, special: 'Warlord Pressure' },
    nikki: { name: 'NIKKI', role: 'Hathor Mercenary', age: '??', style: 'Blades / Recon', color: '#d24b68', bio: 'A quick-witted Hathor mercenary built for speed, recon, and knife-pressure gameplay.', stats: [74, 90, 54, 84, 70], hp: 102, speed: 4.75, power: 1.0, special: 'Red Flash' },
    baburu: { name: 'BABURU', role: 'Aries Lieutenant', age: '??', style: 'Crimson Blade / Fire', color: '#49c36d', bio: 'An Aries Kingdom lieutenant designed as a frontline knight with fire pressure and blade reach.', stats: [84, 66, 82, 70, 86], hp: 128, speed: 3.55, power: 1.16, special: 'Crimson Blade' },
    machai: { name: 'MACHAI', role: 'Storm Strategist', age: 16, style: 'Lightning / Tactics', color: '#4fa7ff', bio: 'A tactical prodigy tied to the storm bloodline. Added to the select order as a future-ready playable slot.', stats: [82, 82, 72, 96, 84], hp: 118, speed: 4.1, power: 1.1, special: 'Stormweaver' },
    mahje: { name: 'MAHJE', role: 'Storm Bringer', age: 18, style: 'Lightning / Mobility', color: '#b56cff', bio: 'Malachai’s twin sister and a lightning fighter with playful speed and dangerous burst damage.', stats: [86, 88, 64, 82, 92], hp: 116, speed: 4.65, power: 1.18, special: 'Storm Burst' },
    raijin: { name: 'RAIJIN', role: 'Former Warlord', age: '??', style: 'Thunder Court', color: '#c8d6ff', bio: 'Elder statesman of the storm bloodline. Reserved as a high-tier legacy fighter slot.', stats: [90, 58, 94, 90, 92], hp: 150, speed: 3.25, power: 1.28, special: 'Thunder Court' },
    esther: { name: 'ESTHER', role: 'Lady of Thunder Court', age: '??', style: 'Thunder / Matriarch', color: '#f2d58a', bio: 'Elegant, controlled, and dangerous. Reserved as a future playable/legacy slot.', stats: [78, 72, 82, 92, 84], hp: 124, speed: 3.85, power: 1.08, special: 'Thunder Grace' },
    roger: { name: 'ROGER', role: 'Fortress Bruiser', age: '??', style: 'Heavy Brawler', color: '#b87333', bio: 'A smug fortress enforcer guarding the prisoner wing.', stats: [82, 48, 82, 44, 70], hp: 130, speed: 2.9, power: 1.18, special: 'Wall Breaker' },
    handler: { name: 'TENGANSHA', role: 'Fortress Handler', age: '??', style: 'Detachment / Body Split', color: '#111111', bio: 'A fortress elite linked to the captives, able to attack from bizarre angles through detachment.', stats: [76, 66, 70, 88, 92], hp: 128, speed: 3.75, power: 1.15, special: 'Detachment' },
    ambusher: { name: 'AMBUSHER', role: 'Masked Soldier', age: '??', style: 'Blade Mob', color: '#34343b', bio: 'Rank-and-file masked enemy.', stats: [48, 42, 40, 32, 25], hp: 80, speed: 2.8, power: .82, special: 'Rush Slash' },
    guard: { name: 'FORTRESS GUARD', role: 'Fortress Soldier', age: '??', style: 'Blade Guard', color: '#3f424d', bio: 'A stronger fortress soldier.', stats: [55, 46, 52, 44, 35], hp: 90, speed: 3.1, power: .9, special: 'Counter Slash' },
    wraith: { name: 'WRAITH', role: 'Shadow Vessel', age: '???', style: 'Drain / Nightmare', color: '#34135c', bio: 'A shadow bound to Diego’s inner world, feeding on hatred, loss, and life force.', stats: [78, 66, 70, 80, 88], hp: 120, speed: 3.8, power: 1.12, special: 'Soul Drain' },
    awar_aries: { name: 'AWAR ARIES', role: 'Rebellion King', age: 12, style: 'Darkness / Gunblade', color: '#8b1c24', bio: 'A rejected prodigy and rebel leader whose defeat changes nothing about the storm coming.', stats: [86, 86, 68, 90, 84], hp: 120, speed: 4.25, power: 1.12, special: 'Perfect Counter' },
    rose: { name: 'ROSE', role: 'Double Agent', age: '??', style: 'Saber / Spycraft', color: '#179b57', bio: 'A decorated warrior and secret agent whose loyalty points where the rebellion tells it to.', stats: [76, 78, 70, 86, 72], hp: 108, speed: 4.0, power: 1.02, special: 'Silent Shield' },
    pierre: { name: 'PIERRE', role: 'Shadow Strategist', age: 13, style: 'Katana / Firearm', color: '#9d1b22', bio: 'Awar’s right hand. Tactical, cold, and always looking three moves ahead.', stats: [74, 76, 62, 94, 70], hp: 105, speed: 3.9, power: 1.0, special: 'Red Line' },
    goro: { name: 'GORO VOSS', role: 'Iron Fortress', age: 14, style: 'Earth / Club', color: '#8f2424', bio: 'A heavy assault specialist built like a wall and proud of it.', stats: [90, 42, 96, 45, 92], hp: 155, speed: 2.65, power: 1.35, special: 'Judgment' },
    mammon: { name: 'MAMMON', role: 'Iron Ram Commander', age: 34, style: 'Earth / Odachi', color: '#9a6a31', bio: 'Dante’s younger brother and commander of the Thirteen Iron Rams.', stats: [92, 46, 96, 68, 94], hp: 160, speed: 2.8, power: 1.36, special: 'Ram Breaker' },
    danpen: { name: 'DANPEN', role: 'Shadowbound Duo', age: '???', style: 'Clock / Trap', color: '#4a2577', bio: 'Locked. Two figures draped in shadow whose power is tied to Diego’s past.', stats: [95, 85, 80, 98, 98], hp: 150, speed: 4.2, power: 1.3, special: 'Clock Trap' },
    dummy: { name: 'TRAINING DUMMY', role: 'Practice Target', age: 'N/A', style: 'Training', color: '#777777', bio: 'A non-attacking practice dummy used for move timing, spacing, and special-meter testing.', stats: [0, 0, 100, 0, 0], hp: 999, speed: 0, power: 0, special: 'None' }
  };


  // Canonical / expanded roster aliases for the current game build.
  characters.awar = characters.awar_aries;
  characters.dante_aries = characters.dante;
  characters.dante = characters.dante_aries;
  characters.nox_aries = characters.nox_aries || { name: 'NOX ARIES', role: 'Dark Eclipse', age: '???', style: 'Void / Gravity', color: '#5f28d6', bio: 'An elegant nightmare-form fighter using void pressure and black flame.', stats: [88, 84, 76, 94, 90], hp: 128, speed: 4.18, power: 1.18, special: 'Eclipse Orb' };
  characters.seccla_aries = characters.seccla_aries || { name: 'SECCLA ARIES', role: 'Arcane Commander', age: '???', style: 'Magic / Blade', color: '#d9a545', bio: 'A tactical Aries variant who fights with sigils, blade control, and pressure traps.', stats: [82, 78, 72, 96, 84], hp: 120, speed: 3.95, power: 1.12, special: 'Golden Sigil' };
  characters.tenganisha = characters.tenganisha || { name: 'TENGANISHA', role: 'Fortress Handler', age: '??', style: 'Detachment / Body Split', color: '#111111', bio: 'A fortress elite linked to the captives, able to attack from bizarre angles through detachment.', stats: [76, 66, 70, 88, 92], hp: 128, speed: 3.75, power: 1.15, special: 'Detachment' };
  characters.handler = characters.tenganisha;
  characters.semuda = characters.semuda || { name: 'SEMUDA', role: 'Calamity Witch', age: '??', style: 'Pink Flame / Command', color: '#e92aa4', bio: 'A stylish, dangerous fighter who turns charm and pressure into battlefield control.', stats: [86, 80, 72, 92, 88], hp: 118, speed: 4.1, power: 1.16, special: 'Velvet Calamity' };
  characters.danpen_shikake = characters.danpen_shikake || { name: 'DANPEN SHIKAKE', role: 'Shadowbound Duo', age: '???', style: 'Trap / Mechanism', color: '#4a2577', bio: 'Locked. One half of the shadowbound Danpen pair.', stats: [95, 85, 80, 98, 98], hp: 150, speed: 4.2, power: 1.3, special: 'Trap Mechanism' };
  characters.danpen_tokei = characters.danpen_tokei || { name: 'DANPEN TOKEI', role: 'Shadowbound Duo', age: '???', style: 'Clock / Time Snare', color: '#5b2a94', bio: 'Locked. One half of the shadowbound Danpen pair. Danpen Toukei is treated as an old typo and is intentionally omitted.', stats: [94, 84, 80, 99, 98], hp: 150, speed: 4.2, power: 1.3, special: 'Clock Snare' };
  characters.danpen = characters.danpen_shikake;


  const roster = [
    // Core story row
    'rai', 'nico', 'shanti', 'adrian', 'malachai',
    // Badge Trials / current party row
    'rikku', 'mani', 'diego', 'akila', 'akira',
    // Ten’no / Hathor row
    'shinichi', 'yuta', 'daisuke', 'miwa', 'michelle',
    // Rebellion / Aries row
    'nikki', 'awar_aries', 'rose', 'pierre',
    // Heavy hitters / bosses / special row
    'goro', 'mammon', 'dante_aries', 'diastre',
    // Aries variants / final row
    'nox_aries', 'seccla_aries', 'roger', 'tenganisha', 'baburu',
    'machai', 'mahje', 'raijin', 'esther', 'semuda',
    // locked future duo
    'danpen_shikake', 'danpen_tokei'
  ];

  const rosterGroups = {
    core: ['rai', 'nico', 'shanti', 'adrian', 'malachai'],
    badge: ['rikku', 'mani', 'diego', 'akila', 'akira', 'shinichi', 'yuta', 'daisuke'],
    hathor: ['miwa', 'michelle', 'nikki'],
    rebellion: ['awar_aries', 'rose', 'pierre'],
    aries: ['goro', 'mammon', 'dante_aries', 'nox_aries', 'seccla_aries', 'baburu'],
    special: ['diastre', 'roger', 'tenganisha', 'machai', 'mahje', 'raijin', 'esther', 'semuda', 'danpen_shikake', 'danpen_tokei']
  };


  const stageOptions = [
    { id: 'forest', name: 'Moonlit Forest Path', tag: 'Forest Trial', desc: 'Clean night-forest arena for early story fights.' },
    { id: 'moonlitRuins', name: 'Moonlit Forest Ruins', tag: 'Labyrinth Woods', desc: 'Ancient forest ruins under the full moon.' },
    { id: 'stoneRuins', name: 'Mystical Stone Ruins', tag: 'Ancient Labyrinth', desc: 'Moonlit runes, ruined walls, and a clean center lane for duels.' },
    { id: 'southernRidge', name: 'Southern Ridge Gate', tag: 'Badge Trials', desc: 'A mountain path beneath the moon, leading toward the next phase.' },
    { id: 'redForest', name: 'Valdore Nightmare Forest', tag: 'Fear Monger', desc: 'Corrupted red forest for Diastre and nightmare battles.' },
    { id: 'stoneCorridor', name: 'Stone Wall Labyrinth', tag: 'Badge Trials', desc: 'Blue-lit corridor arena with wind banners.' },
    { id: 'terraPlaza', name: 'Terra Registration Plaza', tag: 'Tournament City', desc: 'The bright city plaza where the Badge Trials begin.' },
    { id: 'academy', name: 'Kemt Academy Courtyard', tag: 'Training Grounds', desc: 'Daylight practice arena with weapon racks and target posts.' },
    { id: 'airship', name: 'Hovercraft Sky Deck', tag: 'Airship Route', desc: 'Sunset deck battle high above the clouds.' },
    { id: 'darkEsplanade', name: 'Dark Esplanade', tag: 'Inner World', desc: 'Diego’s chained nightmare realm made into a battle arena.' },
    { id: 'courtyard', name: 'Fortress Courtyard', tag: 'Fortress', desc: 'Exterior fortress fight space.' },
    { id: 'hall', name: 'Purple Torch Hall', tag: 'Fortress Interior', desc: 'Interior hall for rescue and handler fights.' },
    { id: 'experimentLab', name: 'Kekku Experiment Lab', tag: 'Memory of Blood', desc: 'Chains, machines, and purple electric arcs.' },
    { id: 'ruinedLab', name: 'Ruined Laboratory Arena', tag: 'Destroyed Lab', desc: 'The aftermath of experiments and rebellion.' },
    { id: 'village', name: 'Hidden Mountain Village', tag: 'Refuge', desc: 'Warm village at twilight beneath the mountains.' },
    { id: 'dojo', name: 'Malachai Manor Ruins', tag: 'Origin', desc: 'The ruined training grounds where Rai’s path begins.' }
  ];
  function randomChoice(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function playableCharacters() {
    return roster.filter(id => !isLockedCharacter(id) && id !== 'vasta' && characters[id]);
  }

  function randomCharacter(excludeId = null) {
    const pool = playableCharacters().filter(id => id !== excludeId);
    return randomChoice(pool.length ? pool : playableCharacters());
  }

  function randomStage() {
    return randomChoice(stageOptions).id;
  }

  const SELECT_CARD_OVERRIDES = {
    awar: 'awar_aries',
    dante: 'dante_aries',
    handler: 'tenganisha',
    tenganisha: 'tenganisha',
    danpen: 'danpen_shikake'
  };

  function selectCardSrc(id) {
    const key = SELECT_CARD_OVERRIDES[id] || id;
    return `./assets/select_cards/${key}_select.png`;
  }

  function spritePreviewSrc(id, pose='idle') {
    const key = SPRITE_FILE_ALIASES[id] || id;
    return `./assets/sprites/${key}/${key}_${pose}.png`;
  }

  function safeCssUrl(src) {
    return `url("${String(src).replace(/"/g, '%22')}")`;
  }

  const CHARACTER_ALIASES = { awar: 'awar_aries', dante: 'dante_aries' };
  function canonId(id) {
    return CHARACTER_ALIASES[id] || id;
  }

  function isLockedCharacter(id) {
    return id === 'danpen' || id === 'danpen_shikake' || id === 'danpen_tokei';
  }


  function clampTeam(team, fallback='rai') {
    const cleaned = (Array.isArray(team) ? team : [fallback]).map(canonId).filter(id => characters[id] && !isLockedCharacter(id));
    if (!cleaned.length) cleaned.push(fallback);
    return cleaned.slice(0, 3);
  }

  function getBattleTeam(side) {
    const key = side === 'p2' ? 'p2Team' : 'p1Team';
    const fallback = side === 'p2' ? 'nico' : 'rai';
    state.battle[key] = clampTeam(state.battle[key], fallback);
    return state.battle[key];
  }

  function setBattleTeam(side, team) {
    const key = side === 'p2' ? 'p2Team' : 'p1Team';
    const fallback = side === 'p2' ? 'nico' : 'rai';
    state.battle[key] = clampTeam(team, fallback);
    state.battle[side] = state.battle[key][0];
  }

  function teamNames(ids) {
    return clampTeam(ids).map(id => characters[id].name).join(' / ');
  }

  function randomTeam(size=1, avoid=[]) {
    const pool = playableCharacters().filter(id => !avoid.includes(id));
    const picks = [];
    const source = pool.length >= size ? pool.slice() : playableCharacters().slice();
    while (picks.length < size && source.length) {
      const pick = randomChoice(source);
      picks.push(pick);
      const idx = source.indexOf(pick);
      if (idx >= 0) source.splice(idx, 1);
    }
    while (picks.length < size) picks.push(randomCharacter());
    return picks.slice(0, 3);
  }

  function setTeamSize(side, size, shouldRender = true) {
    let n = Math.max(1, Math.min(3, Number(size) || 1));
    if (state.battle.type === 'single') n = 1;
    const current = getBattleTeam(side).slice(0, n);
    const avoid = current.slice();
    while (current.length < n) {
      const pick = randomCharacter(avoid[0] || null);
      current.push(pick);
      avoid.push(pick);
    }
    setBattleTeam(side, current);
    state.battle.activeSide = side;
    state.battle.activeSlot = Math.min(state.battle.activeSlot || 0, n - 1);
    if (shouldRender) renderBattleCharacters();
  }

  function activeBattleId() {
    const team = getBattleTeam(state.battle.activeSide);
    state.battle.activeSlot = Math.max(0, Math.min(team.length - 1, state.battle.activeSlot || 0));
    return team[state.battle.activeSlot];
  }

  const story = [
    { type: 'scene', bg: 'dojo', arc: 'Arc 1', chapter: 'MISSION 01', title: 'The Explosion', text: 'Rai’s Kan tears through Malachai Manor. Adrian arrives after the blast, carrying a boy who refuses to admit he has pushed too far.', line: 'Adrian: “Strength is not readiness. Not yet.”' },
    { type: 'scene', bg: 'dojo', arc: 'Arc 1', chapter: 'MISSION 01', title: 'The Recommendation Deal', text: 'Rai wants a recommendation letter. Adrian offers a mission instead: investigate disappearances near Honsu Village and prove he can survive outside the training grounds.', line: 'Rai: “So if I complete this… you’ll write the letter?”' },
    { type: 'fight', stage: 'forest', arc: 'Arc 1', player: 'rai', enemy: 'ambusher', title: 'Forest Ambush', chapter: 'MISSION 02', intro: 'Rai and Shanti are stopped by masked fighters on the road. First lesson: survive the ambush.' },
    { type: 'scene', bg: 'forest', arc: 'Arc 1', chapter: 'MISSION 02', title: 'Split in the Woods', text: 'The ambush scatters the team. Shanti pushes ahead while Rai realizes the forest has more enemies than it should.', line: 'Rai: “Shan? Shanti? Where’d you go?”' },
    { type: 'fight', stage: 'forest', arc: 'Arc 1', player: 'shanti', enemy: 'guard', title: 'Shanti Alone', chapter: 'MISSION 03', intro: 'Shanti is cornered. Hold the line long enough for her Kan to flare.' },
    { type: 'fight', stage: 'forest', arc: 'Arc 1', player: 'rai', enemy: 'nico', title: 'A-Class Mercenary', chapter: 'MISSION 04', intro: 'Rai collides with Nico, an A-Class mercenary hunting the same kidnappers. Neither trusts the other.' },
    { type: 'scene', bg: 'forest', arc: 'Arc 1', chapter: 'MISSION 04', title: 'For Now', text: 'The misunderstanding clears. Nico is tracking kidnappings, too. The boys agree to work together, but trust is still thin.', line: 'Nico: “Truce?”  Rai: “For now.”' },
    { type: 'scene', bg: 'forest', arc: 'Arc 1', chapter: 'MISSION 05', title: 'Sinking into Darkness', text: 'A captured enemy sinks into a dark portal. Nico freezes at the sight. Rai dives after the enemy alone.', line: 'Rai: “Coward or not, I’m not letting him disappear.”' },
    { type: 'fight', stage: 'courtyard', arc: 'Arc 1', player: 'rai', enemy: 'guard', title: 'Curious Fortress', chapter: 'MISSION 05', intro: 'A shadow gate spits Rai into the fortress courtyard. The guards surround him. He smiles anyway.' },
    { type: 'scene', bg: 'hall', arc: 'Arc 1', chapter: 'MISSION 06', title: 'Prisoner Wing', text: 'Nico follows the sound of chains through the purple-lit hall. The room below is full of captives — and Shanti is among them.', line: 'Shanti: “Who… are you?”' },
    { type: 'fight', stage: 'hall', arc: 'Arc 1', player: 'nico', enemy: 'roger', title: 'Nico vs Roger', chapter: 'MISSION 06', intro: 'Roger blocks the prisoner wing. Nico does not negotiate with men who cage women.' },
    { type: 'scene', bg: 'hall', arc: 'Arc 1', chapter: 'MISSION 07', title: 'Merchandise', text: 'Rai follows the mysterious voice deeper inside the fortress and finds the red-haired captive girl. Then Tengansha reveals himself.', line: 'Tengansha: “Let’s not lose our heads.”' },
    { type: 'fight', stage: 'hall', arc: 'Arc 1', player: 'rai', enemy: 'handler', title: 'Detachment', chapter: 'MISSION 07', intro: 'Tengansha attacks from impossible angles. Close the distance and survive the body-split technique.' },
    { type: 'scene', bg: 'hall', arc: 'Arc 1', chapter: 'ARC CLEAR', title: 'The Trial Ahead', text: 'The recommendation mission proves Rai can survive outside the training grounds. But the world is bigger, crueler, and already moving toward war.', line: 'Unlocked: Badge Trials Opening.' },

    { type: 'scene', bg: 'city', arc: 'Arc 2', chapter: 'MISSION 08', title: 'Terra City Registration', text: 'Rai enters the Badge Trials registration building and hands over his envelope. Nico, Mani, Diego, and the other examinees are already nearby.', line: 'Akila: “It’s Akira! Undefeated, 300–0!”' },
    { type: 'scene', bg: 'exam', arc: 'Arc 2', chapter: 'MISSION 09', title: 'Written Examination', text: 'The first challenge is not a fight. Strategy, leadership, ethics, resource management, intelligence gathering — the exam filters more than strength.', line: 'Akira: “This isn’t just about strength. It never was.”' },
    { type: 'scene', bg: 'exam', arc: 'Arc 2', chapter: 'MISSION 10', title: 'The Floor Is Gone', text: 'The room breaks apart beneath the examinees. Everyone falls into open sky. The first practical challenge has begun.', line: 'Rai: “If I keep falling at this speed, I’ll die. What should I do?”' },
    { type: 'scene', bg: 'nightForest', arc: 'Arc 2', chapter: 'MISSION 10', title: 'Ride the Air Current', text: 'Akira demonstrates control: use Kani to ride the air current instead of simply falling. Rai remembers Mahje’s lesson and refuses to let fear control him.', line: 'Diastre: “Aww yeah! This is what I’m talking about!”' },
    { type: 'scene', bg: 'forest', arc: 'Arc 2', chapter: 'MISSION 11', title: 'Stone Wall Labyrinth', text: 'The examinees land in the forest. Rock walls erupt from the ground, separating everyone into sectors. The first Badge Trial challenge is simple: survive.', line: 'Announcement: “Find the entrance to the next part of the exam within 48 hours.”' },
    { type: 'fight', stage: 'stoneCorridor', arc: 'Arc 2', player: 'rai', enemy: 'shinichi', title: 'Rai vs Shinichi Ten’no', chapter: 'MISSION 12', intro: 'Shinichi, Yuta, and Daisuke corner Rai in the stone labyrinth. The Ten’no grudge is older than Rai understands.' },
    { type: 'scene', bg: 'stoneCorridor', arc: 'Arc 2', chapter: 'MISSION 12', title: 'Revelation of Blood', text: 'Shinichi reveals the bloodline connection: Kigen had two sons, Raijin and Ryojin. Rai and Shinichi are descendants of the same fractured legacy.', line: 'Shinichi: “Ten’no. Never forget what he did.”' },
    { type: 'fight', stage: 'stoneCorridor', arc: 'Arc 2', player: 'rai', enemy: 'daisuke', title: 'Light and Void', chapter: 'MISSION 13', intro: 'Daisuke summons Light Judgment. Rai answers with Void Calamity and learns he can return the same kind of power.' },
    { type: 'scene', bg: 'stoneCorridor', arc: 'Arc 2', chapter: 'MISSION 13', title: 'Winner: Rai', text: 'Rai defeats Shinichi’s group, but the answer only opens more questions. Why does the Ten’no clan hate his family? What did Raijin do?', line: 'Rai: “I’m not finished yet.”' },
    { type: 'fight', stage: 'stoneCorridor', arc: 'Arc 2', player: 'nico', enemy: 'diastre', title: 'Nico vs Diastre', chapter: 'MISSION 14', intro: 'Nico and Michelle are surrounded by fifteen enemies, including Diastre. Nico clears the mob. One remains.' },
    { type: 'scene', bg: 'stoneCorridor', arc: 'Arc 2', chapter: 'MISSION 14', title: 'Valdore', text: 'Diastre’s kekku leaks fear through his sweat and skin. Strong warriors tremble. Nico does not reveal his own ability. He simply stands and fights.', line: 'Diastre: “Then let me show you true fear.”' },
    { type: 'fight', stage: 'redForest', arc: 'Arc 2', player: 'rai', enemy: 'diastre', title: 'Rai and Diego vs Diastre', chapter: 'MISSION 15', intro: 'Diastre returns for a real test. Rai and Diego stand together against the Fear Monger’s Valdore.' },
    { type: 'scene', bg: 'redForest', arc: 'Arc 2', chapter: 'MISSION 15', title: 'Dark Impulse / Dark Esplanade', text: 'Valdore drags out nightmares. Rai becomes Dark Impulse. Diego becomes Dark Esplanade. Their hatred takes shape — and Diastre only smiles.', line: 'Diastre: “I see in front of me Rai Ten’no and Diego Fernandez.”' },
    { type: 'scene', bg: 'experimentLab', arc: 'Arc 2', chapter: 'MISSION 16', title: 'Memory of Blood', text: 'Diego’s inner world reveals the lab, the experiments, Mani’s suffering, and Danpen’s offer. He was made into a weapon and survived by burning the world that broke him.', line: 'Diego: “I destroyed their lab. I took their power. But I left her life.”' },
    { type: 'scene', bg: 'forest', arc: 'Arc 2', chapter: 'MISSION 17', title: 'The Assassin Arrives', text: 'Rikku reveals herself: assassin, observer, and not nearly as detached as she pretends. She was hired to watch Rai — attacking him was merely an option.', line: 'Rikku: “You’re cuter than I expected.”' },
    { type: 'fight', stage: 'moonlitRuins', arc: 'Arc 2', player: 'miwa', enemy: 'vasta', title: 'Fire and Steel', chapter: 'MISSION 18', intro: 'Vasta attacks from the shadows, but Miwa cuts through fire with wind and concentration. Pride gets you nowhere.' },
    { type: 'scene', bg: 'stoneCorridor', arc: 'Arc 2', chapter: 'MISSION 19', title: 'The White Storm', text: 'Elsewhere, Akira faces Awar and opens the path with cold, effortless precision. The undefeated champion is already moving toward the next phase.', line: 'Akira: “See you at the next phase… if you can move in time.”' },
    { type: 'scene', bg: 'nightForest', arc: 'Arc 2', chapter: 'MISSION 20', title: 'Reunited', text: 'Rai, Nico, Rikku, Mani, Diego, and Akila regroup. Michelle leaves to meet her village group near the southern ridge. The crew finally has one path forward.', line: 'Nico: “Friends. Comrades. Family. No matter the path, we walk it together.”' },
    { type: 'scene', bg: 'nightForest', arc: 'CURRENT END', chapter: 'CURRENT CANON ENDPOINT', title: 'The Path Forges Ahead', text: 'Akila knows exactly where the entrance to the next phase is. For now, everyone treats it like goofy luck — but the game flags him as a hidden powerhouse, not weak comic relief. The Badge Trials are not over.', line: 'Akila: “I know exactly where the entrance to the next phase is!”' }
  ];

  const missions = [
    { title: 'Start Full Story', index: 0, tag: 'FULL RUN', desc: 'Play from Rai’s recommendation mission through the current Badge Trials endpoint.' },
    { title: 'Arc 1: Recommendation Mission', index: 0, tag: 'ARC 1', desc: 'Explosion, forest ambush, Rai vs Nico, and the fortress rescue.' },
    { title: 'Forest Ambush', index: 2, tag: 'MISSION 02', desc: 'First playable survival fight.' },
    { title: 'Rai vs Nico', index: 5, tag: 'MISSION 04', desc: 'Rival misunderstanding fight.' },
    { title: 'Fortress Rescue', index: 8, tag: 'MISSION 05–07', desc: 'Courtyard guards, Roger, and Tengansha.' },
    { title: 'Arc 2: Badge Trials Opening', index: 14, tag: 'ARC 2', desc: 'Registration, written exam, falling trial, and labyrinth split.' },
    { title: 'Stone Wall Labyrinth', index: 19, tag: 'MISSION 12', desc: 'Rai vs Ten’no clan conflict.' },
    { title: 'Fear Monger', index: 23, tag: 'MISSION 14–15', desc: 'Nico, Diego, and Rai collide with Diastre.' },
    { title: 'Fire and Steel', index: 29, tag: 'MISSION 18', desc: 'Miwa vs Vasta and wind against concentrated fire.' },
    { title: 'Current Endpoint', index: 31, tag: 'CURRENT END', desc: 'Reunion, Akila’s hidden-god foreshadowing, and the next phase cliffhanger.' }
  ];


  const SAVE_KEY_PREFIX = 'calamityWarStorySlot';
  const MAX_SAVE_SLOTS = 5;

  function saveSlotKey(slot) {
    return `${SAVE_KEY_PREFIX}${slot}`;
  }

  function readSaveSlot(slot) {
    try {
      const raw = localStorage.getItem(saveSlotKey(slot));
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn('Could not read save slot', slot, err);
      return null;
    }
  }

  function writeSaveSlot(slot) {
    const item = story[state.storyIndex] || story[0];
    const payload = {
      version: '0.20',
      storyIndex: Math.max(0, state.storyIndex || 0),
      lastStoryIndex: Math.max(0, state.lastStoryIndex || state.storyIndex || 0),
      storyDifficulty: state.storyDifficulty || 'normal',
      title: item?.title || 'Story Mode',
      chapter: item?.chapter || 'STORY MODE',
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(saveSlotKey(slot), JSON.stringify(payload));
    renderSaveSlots();
    flashSmall(`Saved to Slot ${slot}.`);
  }

  function deleteSaveSlot(slot) {
    localStorage.removeItem(saveSlotKey(slot));
    renderSaveSlots();
    flashSmall(`Slot ${slot} cleared.`);
  }

  function loadSaveSlot(slot) {
    const data = readSaveSlot(slot);
    if (!data) {
      flashSmall(`Slot ${slot} is empty.`);
      return;
    }
    state.storyDifficulty = data.storyDifficulty || 'normal';
    state.lastStoryIndex = Math.max(0, Number(data.lastStoryIndex ?? data.storyIndex) || 0);
    refreshDifficultyUI();
    openStory(Math.max(0, Number(data.storyIndex) || 0));
  }

  function formatSaveDate(iso) {
    if (!iso) return 'No date';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'Unknown date';
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function renderSaveSlots() {
    const grid = document.getElementById('saveSlotGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let slot = 1; slot <= MAX_SAVE_SLOTS; slot++) {
      const data = readSaveSlot(slot);
      const card = document.createElement('article');
      card.className = 'save-slot-card' + (data ? ' filled' : ' empty');
      card.innerHTML = `
        <div class="slot-tag">SLOT ${slot}</div>
        <h2>${data ? data.title : 'Empty Slot'}</h2>
        <p>${data ? `${data.chapter || 'STORY MODE'} · ${String(data.storyDifficulty || 'normal').toUpperCase()}` : 'No save data yet.'}</p>
        <em>${data ? `Saved ${formatSaveDate(data.savedAt)}` : 'Choose Save Current to store progress here.'}</em>
        <div class="slot-actions">
          <button type="button" data-save-slot="${slot}">Save Current</button>
          <button type="button" data-load-slot="${slot}" ${data ? '' : 'disabled'}>Load</button>
          <button type="button" data-delete-slot="${slot}" ${data ? '' : 'disabled'}>Delete</button>
        </div>
      `;
      grid.appendChild(card);
    }
    grid.querySelectorAll('[data-save-slot]').forEach(btn => btn.addEventListener('click', () => writeSaveSlot(Number(btn.dataset.saveSlot))));
    grid.querySelectorAll('[data-load-slot]').forEach(btn => btn.addEventListener('click', () => loadSaveSlot(Number(btn.dataset.loadSlot))));
    grid.querySelectorAll('[data-delete-slot]').forEach(btn => btn.addEventListener('click', () => deleteSaveSlot(Number(btn.dataset.deleteSlot))));
  }

  function renderMissions() {
    const grid = document.getElementById('missionGrid');
    if (!grid) return;
    grid.innerHTML = missions.map((m, i) => `
      <button class="mission-card" data-mission-index="${m.index}">
        <span>${m.tag}</span>
        <strong>${String(i + 1).padStart(2, '0')}. ${m.title}</strong>
        <em>${m.desc}</em>
      </button>
    `).join('');
    grid.querySelectorAll('[data-mission-index]').forEach(btn => {
      btn.addEventListener('click', () => openStory(Number(btn.dataset.missionIndex)));
    });
  }

  function showScreen(name) {
    clearReadyCountdown();
    if (name !== 'fight') hideMatchOverPopup();
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    state.screen = name;
    if (name !== 'fight') stopFight();
    applyLanguage();
    updateMusicForScreen(name);
  }

  function showStoryGameOver() {
    showScreen('gameOver');
    playSfx('gameOver', 0.85);
    playEvilGameOverLaugh();
  }

  function retryStoryBattle() {
    if (state.lastFightItem && state.lastFightMode === 'story') {
      startFight(state.lastFightItem, 'story');
    } else {
      openStory(Math.max(0, state.lastStoryIndex || state.storyIndex || 0));
    }
  }

  function loadStoryCheckpoint() {
    openStory(Math.max(0, state.lastStoryIndex || 0));
  }

  function setStoryScreen(item) {
    document.getElementById('chapterTag').textContent = item.chapter || 'STORY MODE';
    document.getElementById('storyTitle').textContent = item.title;
    document.getElementById('storyText').textContent = item.text;
    document.getElementById('speakerLine').textContent = item.line || '';
    const storyBackdrop = document.getElementById('storyBackdrop');
    storyBackdrop.style.backgroundImage = `url('${assets[item.bg || 'forest']}')`;
  }

  function openStory(index = 0) {
    state.storyIndex = index;
    const item = story[state.storyIndex];
    if (!item) return showScreen('main');
    if (item.type === 'fight') {
      startFight(item, false);
    } else {
      setStoryScreen(item);
      showScreen('story');
    }
  }

  function continueStory() {
    state.storyIndex += 1;
    openStory(state.storyIndex);
  }

  function skipToFight() {
    const next = story.findIndex((item, i) => i >= state.storyIndex && item.type === 'fight');
    if (next >= 0) openStory(next);
  }

  const rosterGrid = document.getElementById('rosterGrid');

  function makeRandomCard(label, onClick) {
    const card = document.createElement('button');
    card.className = 'card random-card';
    card.style.setProperty('--c', '#ffffff');
    card.innerHTML = `<strong>🎲<br>${label}</strong><span class="p1">AI PICK</span>`;
    card.addEventListener('click', onClick);
    return card;
  }

  function renderRoster() {
    rosterGrid.innerHTML = '';
    rosterGrid.appendChild(makeRandomCard('RANDOM', () => {
      state.selected = randomCharacter();
      updateSelectedPanel(state.selected);
      renderRoster();
      flashSmall(`Random picked ${characters[state.selected].name}.`);
    }));
    roster.forEach(id => {
      const c = characters[id];
      const card = document.createElement('button');
      card.className = 'card' + (id === state.selected ? ' selected' : '') + (isLockedCharacter(id) ? ' locked' : '');
      card.style.setProperty('--c', c.color);
      card.style.setProperty('--fighter-color', c.color);
      card.style.setProperty('--portrait-image', safeCssUrl(selectCardSrc(id)));
      card.innerHTML = `<span class="portrait-slot" data-overlay-role="portrait" data-asset-key="${id}_portrait"></span><strong>${c.name}${isLockedCharacter(id) ? '<br>LOCKED' : ''}</strong>${id === state.selected ? '<span class="p1">P1</span>' : ''}`;
      card.addEventListener('click', () => {
        if (isLockedCharacter(id)) return;
        state.selected = id;
        updateSelectedPanel(id);
        renderRoster();
      });
      rosterGrid.appendChild(card);
    });
  }

  function updateSelectedPanel(id) {
    const c = characters[id];
    document.getElementById('selectedName').textContent = c.name;
    document.getElementById('selectedSubtitle').textContent = c.role;
    const avatar = document.getElementById('selectedAvatar');
    avatar.className = 'big-avatar';
    avatar.style.setProperty('--avatar', c.color);
    const labels = ['Attack', 'Speed', 'Defense', 'Technique', 'Power'];
    document.getElementById('selectedStats').innerHTML = labels.map((l, i) => `<div>${l}<span><i style="width:${c.stats[i]}%"></i></span></div>`).join('');
    document.getElementById('selectedBio').textContent = c.bio;
  }

  function flashSmall(text) {
    const box = document.getElementById('fightMessage');
    if (!box || state.screen === 'fight') return;
    box.textContent = text;
  }

  function stageLabel(id) {
    return (stageOptions.find(s => s.id === id) || stageOptions[0]).name;
  }

  function getStageIndex(id = state.battle.stage) {
    const idx = stageOptions.findIndex(s => s.id === id);
    return idx >= 0 ? idx : 0;
  }

  function setStageByIndex(index) {
    const total = stageOptions.length;
    const wrapped = ((Number(index) || 0) % total + total) % total;
    state.stageWheelIndex = wrapped;
    state.battle.stage = stageOptions[wrapped].id;
  }

  function rotateStage(delta) {
    setStageByIndex(getStageIndex() + delta);
    renderStageSelect();
  }

  function selectStage(id) {
    setStageByIndex(getStageIndex(id));
    renderStageSelect();
  }

  function randomizeStageSpin() {
    stopStageHoverPreview(true);
    const randomBtn = document.getElementById('randomStage');
    if (state.stageSpinTimer) clearInterval(state.stageSpinTimer);
    document.getElementById('stageWheel')?.classList.add('spinning');
    const target = Math.floor(Math.random() * stageOptions.length);
    let ticks = 0;
    const totalTicks = 18 + Math.floor(Math.random() * 10);
    if (randomBtn) randomBtn.disabled = true;
    state.stageSpinTimer = setInterval(() => {
      ticks += 1;
      setStageByIndex(getStageIndex() + 1);
      renderStageSelect(true);
      if (ticks >= totalTicks) {
        clearInterval(state.stageSpinTimer);
        state.stageSpinTimer = null;
        document.getElementById('stageWheel')?.classList.remove('spinning');
        setStageByIndex(target);
        renderStageSelect(false);
        flashSmall(`AI chose ${stageLabel(state.battle.stage)}.`);
        if (randomBtn) randomBtn.disabled = false;
      }
    }, 70);
  }

  function startStageHoverPreview() {
    if (state.stageSpinTimer || state.stageHoverTimer) return;
    const randomBtn = document.getElementById('randomStage');
    if (randomBtn) randomBtn.classList.add('preview-spinning');
    state.stageHoverTimer = setInterval(() => {
      setStageByIndex(getStageIndex() + 1);
      renderStageSelect(true);
    }, 85);
  }

  function stopStageHoverPreview(keepCurrent = true) {
    if (!state.stageHoverTimer) return;
    clearInterval(state.stageHoverTimer);
    state.stageHoverTimer = null;
    const randomBtn = document.getElementById('randomStage');
    if (randomBtn) randomBtn.classList.remove('preview-spinning');
    if (!keepCurrent) setStageByIndex(getStageIndex());
    renderStageSelect(false);
  }

  function renderGallery() {
    document.getElementById('stageGallery').innerHTML = stageOptions.map(stage => `<div class="stage-card" style="background-image:url('${assets[stage.id]}')"><span>${stage.name}</span></div>`).join('');
  }

  function clearReadyCountdown() {
    if (state.readyTimer) {
      clearInterval(state.readyTimer);
      state.readyTimer = null;
    }
  }

  const battleModeDescriptions = {
    'pvp-local': 'Local multiplayer battle with both Player 1 and Player 2 selectable.',
    'pvp-ai': 'Player 1 fights a CPU-controlled opponent using the chosen difficulty.',
    'cpu-cpu': 'CPU vs CPU watch mode for testing, QA, and chaos.'
  };

  function currentFormatLabel() {
    const f = state.battle.format || '1v1';
    if (f === '1v1') return '1v1 Single Battle';
    if (f === '2v2') return '2v2 Team Battle';
    if (f === '3v3') return '3v3 Team Battle';
    return `${getBattleTeam('p1').length}v${getBattleTeam('p2').length} Custom Battle`;
  }

  function applyBattleFormat(format, shouldRender = true) {
    state.battle.format = format;
    if (format === '1v1') {
      state.battle.type = 'single';
      setTeamSize('p1', 1, false);
      setTeamSize('p2', 1, false);
    } else if (format === '2v2') {
      state.battle.type = 'team';
      setTeamSize('p1', 2, false);
      setTeamSize('p2', 2, false);
    } else if (format === '3v3') {
      state.battle.type = 'team';
      setTeamSize('p1', 3, false);
      setTeamSize('p2', 3, false);
    } else {
      state.battle.type = 'team';
      state.battle.format = 'custom';
    }
    if (shouldRender) renderBattleModeSetup();
  }

  function renderBattleModeSetup() {
    const mode = state.battle.mode || 'pvp-local';
    const type = state.battle.type || 'single';
    const format = state.battle.format || '1v1';
    const p1Size = getBattleTeam('p1').length;
    const p2Size = getBattleTeam('p2').length;
    const modeText = document.getElementById('battleModeText');
    const typeText = document.getElementById('battleTypeText');
    const p2Row = document.getElementById('setupP2Row');
    if (modeText) modeText.textContent = battleModeDescriptions[mode] || battleModeDescriptions['pvp-local'];
    if (typeText) typeText.textContent = format === '1v1'
      ? '1v1 uses the single-battle select screen with one large P1 and P2 preview.'
      : format === '2v2'
        ? '2v2 uses the team select screen with two locked team slots per side.'
        : format === '3v3'
          ? '3v3 uses the full team select screen with leader/partner/support slots.'
          : 'Custom keeps the old chaos option: any 1–3 fighter combination per side.';
    document.querySelectorAll('#battleModeButtons [data-battle-mode]').forEach(btn => btn.classList.toggle('active', btn.dataset.battleMode === mode));
    document.querySelectorAll('#battleFormatButtons [data-battle-format]').forEach(btn => btn.classList.toggle('active', btn.dataset.battleFormat === format));
    const custom = format === 'custom';
    document.querySelectorAll('[data-setup-size="p1"]').forEach(btn => {
      const active = Number(btn.dataset.size) === p1Size;
      btn.classList.toggle('active', active);
      btn.disabled = !custom;
    });
    document.querySelectorAll('[data-setup-size="p2"]').forEach(btn => {
      const active = Number(btn.dataset.size) === p2Size;
      btn.classList.toggle('active', active);
      btn.disabled = !custom;
    });
    if (p2Row) p2Row.querySelector('span').textContent = t('p2Fighters');
  }

  function setBattleSetupMode(mode) {
    state.battle.mode = mode;
    if (mode === 'pvp-ai' && !state.battle.cpuSide) state.battle.cpuSide = 'p2';
    renderBattleModeSetup();
  }

  function setBattleFormat(format) {
    applyBattleFormat(format, true);
  }

  function setSetupSize(side, size) {
    if (state.battle.format !== 'custom') return;
    setTeamSize(side, size, false);
    renderBattleModeSetup();
  }

  function battleModeLabel(mode = state.battle.mode) {
    if (mode === 'pvp-local') return 'BATTLE MODE · PLAYER VS PLAYER';
    if (mode === 'pvp-ai') return 'BATTLE MODE · PLAYER VS CPU';
    if (mode === 'cpu-cpu') return 'BATTLE MODE · CPU VS CPU';
    if (mode === 'training') return 'TRAINING MODE';
    if (mode === 'tournament') return 'TOURNAMENT MODE';
    return 'BATTLE SETUP';
  }

  function battleSideController(side) {
    const mode = state.battle.mode;
    if (mode === 'cpu-cpu') return 'CPU';
    if (mode === 'training') return side === 'p1' ? 'PLAYER' : 'DUMMY';
    if (mode === 'pvp-ai') return state.battle.cpuSide === side ? 'CPU' : 'PLAYER';
    return side === 'p1' ? 'PLAYER 1' : 'PLAYER 2';
  }

  function battleSideSlotLabel(side) {
    return side === 'p1' ? t('player1').toUpperCase() : t('player2').toUpperCase();
  }

  function setBattleCpuSide(side) {
    if (state.battle.mode !== 'pvp-ai') return;
    state.battle.cpuSide = side === 'p1' ? 'p1' : 'p2';
    // Move the active cursor to the human-controlled side so character picking feels natural.
    state.battle.activeSide = state.battle.cpuSide === 'p1' ? 'p2' : 'p1';
    state.battle.activeSlot = 0;
    renderBattleCharacters();
  }

  function defaultTeam(side, size) {
    const defaults = side === 'p2'
      ? ['nico', 'shanti', 'adrian']
      : ['rai', 'nico', 'shanti'];
    const output = [];
    defaults.forEach(id => {
      if (output.length < size && characters[id] && !isLockedCharacter(id)) output.push(id);
    });
    roster.forEach(id => {
      if (output.length < size && characters[id] && !isLockedCharacter(id) && !output.includes(id)) output.push(id);
    });
    return output.slice(0, size);
  }


  function shuffled(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function tournamentDifficultyFor(index) {
    if (index < 3) return 'easy';
    if (index < 7) return 'normal';
    if (index < 10) return 'hard';
    return 'extreme';
  }

  function startTournamentMode() {
    const player = (state.selected && characters[state.selected] && !isLockedCharacter(state.selected)) ? state.selected : 'rai';
    const stagePool = shuffled(stageOptions.map(s => s.id)).slice(0, 13);
    while (stagePool.length < 13) stagePool.push(randomStage());
    const enemyPool = shuffled(playableCharacters().filter(id => id !== player));
    state.tournament = { index: 0, player, stagePool, enemyPool };
    startTournamentFight();
  }

  function startTournamentFight() {
    const t = state.tournament;
    if (!t) return startTournamentMode();
    if (t.index >= 13) {
      flashSmall('Tournament cleared. Champion of the 13-stage run.');
      showScreen('main');
      return;
    }
    const enemy = t.enemyPool[t.index % t.enemyPool.length] || randomCharacter(t.player);
    const stage = t.stagePool[t.index] || randomStage();
    state.cpuDifficulty = tournamentDifficultyFor(t.index);
    startFight({
      player: t.player,
      enemy,
      stage,
      title: `Tournament Stage ${t.index + 1}/13: ${characters[t.player].name} vs ${characters[enemy].name}`,
      chapter: `TOURNAMENT ${t.index + 1}/13`,
      intro: `Arcade ladder fight. Difficulty: ${difficultyLabel(state.cpuDifficulty)}. Win best 2 out of 3 to advance.`
    }, 'tournament');
  }

  function beginBattleSetup(mode = state.battle.mode) {
    state.battle.mode = mode;
    if (mode === 'pvp-ai' && !state.battle.cpuSide) state.battle.cpuSide = 'p2';
    state.battle.activeSide = 'p1';
    state.battle.activeSlot = 0;

    if (!state.battle.format) state.battle.format = state.battle.type === 'single' ? '1v1' : '2v2';
    applyBattleFormat(state.battle.format, false);
    state.battle.activeSide = mode === 'cpu-cpu' ? 'p2' : (mode === 'pvp-ai' && state.battle.cpuSide === 'p1' ? 'p2' : 'p1');
    state.battle.activeSlot = 0;

    const p1Size = Math.max(1, Math.min(3, getBattleTeam('p1').length || 1));
    const p2Size = mode === 'training' ? 1 : Math.max(1, Math.min(3, getBattleTeam('p2').length || 1));

    const p1Team = clampTeam(getBattleTeam('p1'), 'rai').slice(0, p1Size);
    const p1Defaults = defaultTeam('p1', p1Size);
    while (p1Team.length < p1Size) p1Team.push(p1Defaults[p1Team.length] || randomCharacter());
    if (state.selected && characters[state.selected] && !isLockedCharacter(state.selected)) p1Team[0] = state.selected;
    setBattleTeam('p1', p1Team);

    if (mode === 'training') {
      setBattleTeam('p2', ['dummy']);
    } else {
      const p2Team = clampTeam(getBattleTeam('p2'), 'nico').slice(0, p2Size);
      const p2Defaults = defaultTeam('p2', p2Size);
      while (p2Team.length < p2Size) p2Team.push(p2Defaults[p2Team.length] || randomCharacter(p1Team[0]));
      setBattleTeam('p2', p2Team);
    }

    state.battle.stage = state.battle.stage || 'forest';
    renderBattleCharacters();
    showScreen('battleCharacters');
  }

  function setBattleSide(side, slot=0) {
    if (state.battle.mode === 'training' && side === 'p2') return;
    state.battle.activeSide = side;
    state.battle.activeSlot = Math.max(0, Math.min(getBattleTeam(side).length - 1, Number(slot) || 0));
    renderBattleCharacters();
  }

  function setBattleCharacter(id) {
    id = canonId(id);
    if (isLockedCharacter(id)) return;
    const side = state.battle.activeSide;
    if (side === 'p2' && state.battle.mode === 'training') return;
    const team = getBattleTeam(side).slice();
    const slot = Math.max(0, Math.min(team.length - 1, state.battle.activeSlot || 0));
    team[slot] = id;
    setBattleTeam(side, team);
    if (side === 'p1') state.selected = id;
    renderBattleCharacters();
  }

  function randomizeBattleCharacter(side=state.battle.activeSide) {
    if (side === 'p2' && state.battle.mode === 'training') return;
    playSfx('randomRoll', 0.88);
    const team = getBattleTeam(side).slice();
    const slot = side === state.battle.activeSide ? (state.battle.activeSlot || 0) : 0;
    const avoid = team.filter((_, i) => i !== slot);
    const pick = randomTeam(1, avoid)[0];
    team[Math.max(0, Math.min(team.length - 1, slot))] = pick;
    setBattleTeam(side, team);
    if (side === 'p1') state.selected = pick;
    renderBattleCharacters();
  }

  function randomizeTeam(side) {
    if (side === 'p2' && state.battle.mode === 'training') return;
    const size = getBattleTeam(side).length;
    const picks = randomTeam(size);
    setBattleTeam(side, picks);
    if (side === 'p1') state.selected = picks[0];
    renderBattleCharacters();
  }

  function randomizeBattleBoth() {
    playSfx('randomRoll', 0.95);
    randomizeTeam('p1');
    if (state.battle.mode !== 'training') randomizeTeam('p2');
    renderBattleCharacters();
  }

  function renderTeamSizeButtons(side, label) {
    const lockedByFormat = state.battle.mode !== 'training' && state.battle.format !== 'custom';
    const disabled = (state.battle.mode === 'training' && side === 'p2') || lockedByFormat;
    const size = getBattleTeam(side).length;
    return `<div class="team-size-row ${disabled ? 'disabled' : ''}"><span>${label}</span>${[1,2,3].map(n => `<button type="button" data-team-size="${side}" data-size="${n}" class="${n === size ? 'active' : ''}" ${disabled ? 'disabled' : ''}>${n}</button>`).join('')}</div>`;
  }

  function renderTeamSlots(side, label) {
    const team = getBattleTeam(side);
    const disabled = state.battle.mode === 'training' && side === 'p2';
    return `<div class="team-slot-group"><h3>${label}</h3>${team.map((id, i) => `<button type="button" class="slot-card team-slot ${state.battle.activeSide === side && state.battle.activeSlot === i ? 'active' : ''}" data-team-slot="${side}" data-slot="${i}" ${disabled ? 'disabled' : ''}><span>${label} ${i + 1}</span><strong>${characters[id].name}</strong></button>`).join('')}</div>`;
  }

  function renderSideSlotControls(side, label) {
    const team = getBattleTeam(side);
    const disabled = state.battle.mode === 'training' && side === 'p2';
    const sideName = side === 'p1' ? t('player1') : t('player2');
    if (disabled) {
      return `<button type="button" class="side-select-main disabled" disabled>Training Dummy Shadow</button>`;
    }
    const slotButtons = team.map((id, i) => {
      const c = characters[id] || characters.rai;
      const active = state.battle.activeSide === side && state.battle.activeSlot === i;
      return `<button type="button" class="side-slot-pick ${active ? 'active' : ''}" data-team-slot="${side}" data-slot="${i}"><span>${sideName} ${i + 1}</span><strong>${c.name}</strong></button>`;
    }).join('');
    return `<button type="button" class="side-select-main ${state.battle.activeSide === side ? 'active' : ''}" data-side-focus="${side}">Select ${sideName}</button><div class="side-slot-list">${slotButtons}</div>`;
  }

  function renderCharacterMiniCard(id, slotLabel, side='p1') {
    const c = characters[id] || characters.rai;
    return `<div class="team-mini-card ${side}" data-character-id="${id}" data-overlay-role="team-slot" style="--fighter-color:${c.color};--portrait-image:${safeCssUrl(selectCardSrc(id))}">
      <span class="slot-number">${slotLabel}</span>
      <span class="portrait-slot" data-overlay-role="portrait" data-asset-key="${id}_portrait"></span>
      <strong>${c.name}</strong>
      <em>${c.style}</em>
    </div>`;
  }

  function fillPreviewArt(el, id) {
    if (!el) return;
    const c = characters[id] || characters.rai;
    el.dataset.characterId = id;
    el.style.setProperty('--fighter-color', c.color);
    el.style.backgroundImage = '';
    el.style.backgroundSize = '';
    el.style.backgroundPosition = '';
    el.innerHTML = '';
    const img = document.createElement('img');
    img.className = 'idle-sprite-preview';
    img.alt = `${c.name} idle sprite`;
    img.src = spritePreviewSrc(id, 'idle');
    img.addEventListener('error', () => {
      img.remove();
      el.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.70)), url('${selectCardSrc(id)}')`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center 20%';
    }, { once: true });
    el.appendChild(img);
  }

  function updateBattlePrimaryPreview() {
    const panel = document.getElementById('battleP1Preview');
    const art = document.getElementById('battleP1PreviewArt');
    const strip = document.getElementById('battleP1PreviewTeam');
    const kicker = document.getElementById('battleSetupKicker');
    const title = document.getElementById('battleSetupTitle');
    const copy = document.getElementById('battleSetupCopy');
    const team = getBattleTeam('p1');
    const lead = team[0] || 'rai';
    const c = characters[lead] || characters.rai;
    if (panel) {
      panel.dataset.side = 'p1';
      panel.dataset.characterId = lead;
      panel.classList.toggle('active-side', state.battle.activeSide === 'p1');
      panel.style.setProperty('--fighter-color', c.color);
    }
    if (kicker) kicker.textContent = battleSideController('p1');
    if (title) title.textContent = state.battle.activeSide === 'p1'
      ? `PICK ${t('player1').toUpperCase()} • ${c.name}`
      : `${t('player1').toUpperCase()} • ${c.name}`;
    if (copy) copy.textContent = state.battle.activeSide === 'p1'
      ? `Selecting slot ${(state.battle.activeSlot || 0) + 1}.`
      : 'Click this side to pick Player 1.';
    fillPreviewArt(art, lead);
    if (strip) strip.innerHTML = team.map((id, i) => renderCharacterMiniCard(id, i + 1, 'p1')).join('');
  }

  function updateBattleSidePreview() {
    const panel = document.getElementById('battleP2Preview');
    const title = document.getElementById('battleSidePreviewTitle');
    const art = document.getElementById('battleSidePreviewArt');
    const strip = document.getElementById('battleSidePreviewTeam');
    if (!panel || !title || !art || !strip) return;
    const training = state.battle.mode === 'training';
    const team = training ? ['dummy'] : getBattleTeam('p2');
    const lead = team[0] || 'nico';
    const c = characters[lead] || characters.nico;
    panel.dataset.side = training ? 'dummy' : 'p2';
    panel.dataset.characterId = lead;
    panel.classList.toggle('active-side', state.battle.activeSide === 'p2');
    panel.classList.toggle('disabled-side', training);
    panel.style.setProperty('--fighter-color', c.color);
    title.textContent = training
      ? 'TRAINING DUMMY SHADOW'
      : (state.battle.activeSide === 'p2' ? `PICK ${t('player2').toUpperCase()} • ${c.name}` : `${t('player2').toUpperCase()} • ${c.name}`);
    fillPreviewArt(art, lead);
    strip.innerHTML = team.map((id, i) => renderCharacterMiniCard(id, i + 1, 'p2')).join('');
  }


  function ensureBattleActionBar() {
    const rosterPanel = document.querySelector('.battle-roster-panel');
    const grid = document.getElementById('battleRosterGrid');
    const randoms = document.querySelector('.battle-randoms');
    const continueBtn = document.getElementById('confirmBattleCharacters');
    if (!rosterPanel || !grid || !randoms || !continueBtn) return;
    let bar = document.getElementById('battleActionBar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'battleActionBar';
      bar.className = 'battle-action-bar';
    }
    if (!bar.contains(randoms)) bar.appendChild(randoms);
    if (!bar.contains(continueBtn)) bar.appendChild(continueBtn);
    if (grid.nextElementSibling !== bar) grid.insertAdjacentElement('afterend', bar);
  }

  function snapshotBattleRandomState(kind) {
    return {
      p1Team: getBattleTeam('p1').slice(),
      p2Team: getBattleTeam('p2').slice(),
      activeSide: state.battle.activeSide,
      activeSlot: state.battle.activeSlot
    };
  }

  function restoreBattleRandomSnapshot(snapshot) {
    if (!snapshot) return;
    state.battle.p1Team = snapshot.p1Team.slice();
    state.battle.p2Team = snapshot.p2Team.slice();
    state.battle.activeSide = snapshot.activeSide;
    state.battle.activeSlot = snapshot.activeSlot;
  }

  function characterRandomPreviewAction(kind) {
    if (kind === 'p1') return randomizeBattleCharacter('p1');
    if (kind === 'p2') return randomizeBattleCharacter('p2');
    return randomizeBattleBoth();
  }

  function startCharacterRandomHover(kind) {
    if (state.randomHoverTimers[kind]) return;
    const btn = document.querySelector(`[data-random-kind="${kind}"]`) || document.getElementById(kind === 'p1' ? 'randomP1' : kind === 'p2' ? 'randomP2' : 'randomBoth');
    if (btn?.disabled) return;
    state.randomHoverSnapshots[kind] = snapshotBattleRandomState(kind);
    btn?.classList.add('preview-spinning');
    state.randomHoverTimers[kind] = setInterval(() => characterRandomPreviewAction(kind), 88);
  }

  function stopCharacterRandomHover(kind, keepCurrent = false) {
    if (!state.randomHoverTimers[kind]) return;
    clearInterval(state.randomHoverTimers[kind]);
    state.randomHoverTimers[kind] = null;
    const btn = document.querySelector(`[data-random-kind="${kind}"]`) || document.getElementById(kind === 'p1' ? 'randomP1' : kind === 'p2' ? 'randomP2' : 'randomBoth');
    btn?.classList.remove('preview-spinning');
    if (!keepCurrent) restoreBattleRandomSnapshot(state.randomHoverSnapshots[kind]);
    state.randomHoverSnapshots[kind] = null;
    renderBattleCharacters();
  }

  function commitCharacterRandom(kind) {
    if (state.randomHoverTimers[kind]) {
      stopCharacterRandomHover(kind, true);
      flashSmall(kind === 'both' ? 'Random matchup locked.' : `${kind.toUpperCase()} random selection locked.`);
      return;
    }
    characterRandomPreviewAction(kind);
  }

  function wireCharacterRandomButton(id, kind) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.dataset.randomKind = kind;
    btn.addEventListener('click', () => commitCharacterRandom(kind));
    btn.addEventListener('mouseenter', () => startCharacterRandomHover(kind));
    btn.addEventListener('mouseleave', () => stopCharacterRandomHover(kind, false));
    btn.addEventListener('focus', () => startCharacterRandomHover(kind));
    btn.addEventListener('blur', () => stopCharacterRandomHover(kind, false));
  }


  function renderBattleCharacters() {
    const mode = state.battle.mode;
    const training = mode === 'training';
    const p1Team = getBattleTeam('p1');
    const p2Team = training ? ['dummy'] : getBattleTeam('p2');
    const format = training ? `${p1Team.length}vDummy` : currentFormatLabel();
    state.battle.p1 = p1Team[0];
    state.battle.p2 = p2Team[0];

    const screen = document.getElementById('battleCharacterScreen');
    if (screen) {
      screen.dataset.battleFormat = state.battle.format || '1v1';
      screen.dataset.battleType = state.battle.type || 'single';
      screen.dataset.battleMode = mode;
      screen.dataset.template = state.battle.format === '1v1' ? 'single' : 'team';
      screen.style.setProperty('--character-template-bg', `url('${state.battle.format === '1v1' ? assets.select1v1Template : assets.selectTeamTemplate}')`);
    }

    ensureBattleActionBar();

    document.getElementById('battleRandomNote').textContent = '';
    document.getElementById('battleP1Name').textContent = teamNames(p1Team);
    document.getElementById('battleP2Label').textContent = training ? 'OPPONENT' : 'PLAYER 2 TEAM';
    document.getElementById('battleP2Name').textContent = training ? 'TRAINING DUMMY' : teamNames(p2Team);
    document.getElementById('randomP1').textContent = t('randomP1');
    document.getElementById('randomP2').textContent = training ? t('dummyLocked') : t('randomP2');
    document.getElementById('randomP2').disabled = training;
    document.getElementById('randomBoth').textContent = training ? t('randomTrainingTeam') : t('randomBoth');

    const p1Controls = document.getElementById('battleP1SlotControls');
    const p2Controls = document.getElementById('battleP2SlotControls');
    if (p1Controls) p1Controls.innerHTML = renderSideSlotControls('p1', battleSideSlotLabel('p1'));
    if (p2Controls) p2Controls.innerHTML = training
      ? `<button type="button" class="side-select-main disabled" disabled>Training Dummy Shadow</button>`
      : renderSideSlotControls('p2', battleSideSlotLabel('p2'));

    document.querySelectorAll('[data-side-focus]').forEach(el => {
      const side = el.dataset.sideFocus;
      if (!side || (side === 'p2' && training)) return;
      el.onclick = e => {
        if (e.target.closest('[data-team-slot]')) return;
        setBattleSide(side, state.battle.activeSide === side ? state.battle.activeSlot : 0);
      };
    });
    document.querySelectorAll('[data-team-slot]').forEach(btn => {
      btn.onclick = () => setBattleSide(btn.dataset.teamSlot, btn.dataset.slot);
    });

    const activeId = activeBattleId();
    const activeLabel = state.battle.activeSide === 'p1' ? battleSideSlotLabel('p1') : battleSideSlotLabel('p2');
    const activeTarget = document.getElementById('battleActiveTarget');
    document.getElementById('battleRosterTitle').textContent = 'CHARACTER SELECT';
    if (activeTarget) activeTarget.textContent = training
      ? `Selecting training fighter ${(state.battle.activeSlot || 0) + 1}`
      : `${activeLabel} • Slot ${(state.battle.activeSlot || 0) + 1}`;

    const grid = document.getElementById('battleRosterGrid');
    grid.innerHTML = '';
    grid.appendChild(makeRandomCard(state.battle.type === 'single' ? 'RANDOM' : 'RANDOM SLOT', () => randomizeBattleCharacter(state.battle.activeSide)));
    roster.forEach((id, rosterIndex) => {
      const c = characters[id];
      if (!c) return;
      const p1Slot = p1Team.indexOf(id);
      const p2Slot = p2Team.indexOf(id);
      const selected = id === activeId;
      const locked = isLockedCharacter(id);
      const card = document.createElement('button');
      card.className = [
        'card',
        'roster-card',
        selected ? 'selected' : '',
        locked ? 'locked' : '',
        p1Slot >= 0 ? 'selected-p1' : '',
        p2Slot >= 0 ? 'selected-p2' : ''
      ].filter(Boolean).join(' ');
      card.style.setProperty('--c', c.color);
      card.style.setProperty('--fighter-color', c.color);
      card.style.setProperty('--portrait-image', safeCssUrl(selectCardSrc(id)));
      card.dataset.characterId = id;
      card.dataset.rosterIndex = String(rosterIndex + 1);
      card.dataset.assetKey = `${id}_portrait`;
      const badges = `${p1Slot >= 0 ? `<span class="slot-badge p1-badge">P1-${p1Slot + 1}</span>` : ''}${p2Slot >= 0 ? `<span class="slot-badge p2-badge">P2-${p2Slot + 1}</span>` : ''}${selected ? '<span class="p1 active-slot">ACTIVE</span>' : ''}`;
      card.innerHTML = `<span class="portrait-slot" data-overlay-role="portrait" data-asset-key="${id}_portrait"></span><strong>${c.name}${locked ? '<br>LOCKED' : ''}</strong>${badges}`;
      card.addEventListener('click', () => setBattleCharacter(id));
      grid.appendChild(card);
    });

    updateBattlePrimaryPreview();
    updateBattleSidePreview();
  }

  function renderStageSelect(spinning=false) {
    const p1Team = getBattleTeam('p1');
    const p2Team = state.battle.mode === 'training' ? ['dummy'] : getBattleTeam('p2');
    const selectedIndex = getStageIndex();
    state.stageWheelIndex = selectedIndex;
    const selectedStage = stageOptions[selectedIndex];
    document.getElementById('stageSetupKicker').textContent = battleModeLabel();
    document.getElementById('stageSetupCopy').textContent = state.battle.mode === 'training'
      ? `${teamNames(p1Team)} will train on ${stageLabel(state.battle.stage)}. Rotate the wheel, hit Random, or press Start.`
      : `${teamNames(p1Team)} vs ${teamNames(p2Team)} at ${stageLabel(state.battle.stage)}. Format: ${p1Team.length}v${p2Team.length}. Rotate the stage wheel or let AI randomize it.`;
    document.getElementById('chosenStageReadout').textContent = spinning ? `${t('aiShuffling')}: ${selectedStage.name}` : `${t('selected')}: ${selectedStage.name}`;

    const preview = document.getElementById('stagePreviewPanel');
    if (preview) {
      preview.style.backgroundImage = `linear-gradient(90deg, rgba(0,0,0,.78), rgba(0,0,0,.20)), url('${assets[selectedStage.id]}')`;
      preview.innerHTML = `<span>${selectedStage.tag}</span><strong>${selectedStage.name}</strong><em>${selectedStage.desc}</em>`;
    }

    const wheel = document.getElementById('stageWheel');
    if (wheel) {
      wheel.innerHTML = '';
      stageOptions.forEach((stage, i) => {
        let offset = i - selectedIndex;
        const half = stageOptions.length / 2;
        if (offset > half) offset -= stageOptions.length;
        if (offset < -half) offset += stageOptions.length;
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'stage-wheel-card' + (i === selectedIndex ? ' active' : '') + (Math.abs(offset) > 3 ? ' hidden-wheel-card' : '');
        const absOffset = Math.min(Math.abs(offset), 4);
        const direction = offset < 0 ? -1 : offset > 0 ? 1 : 0;
        // v0.48: ring/oval carousel optics. The selected stage is shown big in the preview box,
        // while the wheel cards orbit around it instead of sitting in a flat row.
        const ringX = direction * (absOffset === 0 ? 0 : 250 + (absOffset - 1) * 190);
        const ringY = absOffset === 0 ? 118 : 48 + Math.pow(absOffset, 1.42) * 32;
        const ringRot = direction * (absOffset === 0 ? 0 : 7 + absOffset * 6);
        card.style.setProperty('--offset', offset);
        card.style.setProperty('--tx', `${ringX}px`);
        card.style.setProperty('--ty', `${ringY}px`);
        card.style.setProperty('--scale', (absOffset === 0 ? 0.86 : Math.max(0.54, 0.88 - absOffset * 0.085)).toFixed(2));
        card.style.setProperty('--rot', `${ringRot}deg`);
        card.style.setProperty('--opacity', (absOffset === 0 ? 0.88 : Math.max(0, 1 - absOffset * 0.19)).toFixed(2));
        card.style.setProperty('--z', String(absOffset === 0 ? 18 : 16 - absOffset));
        card.style.backgroundImage = `linear-gradient(rgba(0,0,0,.14), rgba(0,0,0,.72)), url('${assets[stage.id]}')`;
        card.innerHTML = `<span>${stage.tag}</span><strong>${stage.name}</strong>`;
        card.addEventListener('click', () => selectStage(stage.id));
        wheel.appendChild(card);
      });
    }

    const grid = document.getElementById('stageSelectGrid');
    if (grid) {
      grid.innerHTML = '';
      stageOptions.forEach((stage, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'stage-thumb-dot' + (i === selectedIndex ? ' active' : '');
        dot.style.backgroundImage = `linear-gradient(rgba(0,0,0,.18), rgba(0,0,0,.68)), url('${assets[stage.id]}')`;
        dot.innerHTML = `<span>${stage.name}</span>`;
        dot.addEventListener('click', () => selectStage(stage.id));
        grid.appendChild(dot);
      });
    }
  }

  function showBattleStageSelect() {
    if (state.battle.mode === 'training') setBattleTeam('p2', ['dummy']);
    renderStageSelect();
    showScreen('stageSelect');
  }

  function renderReadyTeam(containerId, ids, side = 'p1') {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';
    clampTeam(ids).forEach((id, index) => {
      const c = characters[id];
      const card = document.createElement('div');
      card.className = 'ready-fighter-card';
      card.innerHTML = `<div class="num">${index + 1}</div><div class="portrait" style="--fighter-color:${c.color}"></div><div><strong>${c.name}</strong><span>${c.style}</span></div>`;
      el.appendChild(card);
    });
  }

  function startActualConfiguredBattle() {
    clearReadyCountdown();
    const mode = state.battle.mode;
    const p1Team = getBattleTeam('p1');
    const p2Team = mode === 'training' ? ['dummy'] : getBattleTeam('p2');
    const title = mode === 'training' ? 'Training Mode' : mode === 'pvp-local' ? `Battle Mode ${p1Team.length}v${p2Team.length}` : mode === 'pvp-ai' ? `Battle Mode ${battleSideSlotLabel(state.battle.cpuSide)} ${p1Team.length}v${p2Team.length}` : `CPU vs CPU ${p1Team.length}v${p2Team.length}`;
    const chapter = mode === 'training' ? 'TRAINING MODE' : mode === 'cpu-cpu' ? 'BATTLE WATCH MODE' : 'BATTLE MODE';
    const intro = mode === 'training'
      ? `Practice with ${teamNames(p1Team)} at ${stageLabel(state.battle.stage)}. Infinite health, full meter, dummy opponent. Press Q/E to switch teammates; R resets.`
      : `${teamNames(p1Team)} vs ${teamNames(p2Team)} at ${stageLabel(state.battle.stage)}.${mode === 'pvp-local' ? ' Local battle.' : ' CPU difficulty: ' + difficultyLabel(state.cpuDifficulty) + '.'}`;
    startFight({ stage: state.battle.stage, player: p1Team[0], enemy: p2Team[0], team1: p1Team, team2: p2Team, cpuSide: state.battle.cpuSide, title, chapter, intro }, mode);
  }

  function startReadyCountdown() {
    clearReadyCountdown();
    playSfx('roundStart', 0.9);
    const countdownEl = document.getElementById('readyCountdown');
    let count = 3;
    if (countdownEl) countdownEl.textContent = String(count);
    state.readyTimer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        if (countdownEl) countdownEl.textContent = String(count);
        return;
      }
      if (count === 0) {
        if (countdownEl) countdownEl.textContent = 'FIGHT!';
        playSfx('fightStart', 0.95);
        return;
      }
      clearReadyCountdown();
      startActualConfiguredBattle();
    }, 850);
  }

  function showReadyScreen() {
    const mode = state.battle.mode;
    const p1Team = getBattleTeam('p1');
    const p2Team = mode === 'training' ? ['dummy'] : getBattleTeam('p2');
    document.getElementById('readyModeKicker').textContent = battleModeLabel(mode);
    document.getElementById('readyTitle').textContent = 'READY?';
    document.getElementById('readyStageName').textContent = stageLabel(state.battle.stage);
    const p2Header = document.querySelector('.ready-team-p2 h2');
    if (p2Header) p2Header.textContent = mode === 'training' ? t('trainingDummy').toUpperCase() : t('player2').toUpperCase();
    renderReadyTeam('readyP1Team', p1Team, 'p1');
    renderReadyTeam('readyP2Team', p2Team, 'p2');
    showScreen('ready');
    startReadyCountdown();
  }

  function startConfiguredBattle() {
    showReadyScreen();
  }



  function showGalleryHub(message = t('galleryChoose')) {
    const msg = document.getElementById('galleryPlaceholderMessage');
    if (msg) msg.textContent = message;
    showScreen('gallery');
  }

  function showGalleryPlaceholder(kind) {
    const labels = {
      cutscenes: 'Cut Scenes placeholder: later this will show story CGs, intro sequences, win scenes, and unlocked cinematics.',
      extras: 'Extras placeholder: later this can hold bonus art, credits, concepts, music tests, and unlockables.'
    };
    showGalleryHub(labels[kind] || t('galleryChoose'));
  }

  let menuAudioCtx = null;
  function getMenuAudioContext() {
    if (state.settings?.mute) return null;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      if (!menuAudioCtx) menuAudioCtx = new Ctx();
      if (menuAudioCtx.state === 'suspended') menuAudioCtx.resume().catch(() => {});
      return menuAudioCtx;
    } catch (_) {
      return null;
    }
  }

  function playMenuTone(kind = 'move') {
    if (state.settings?.mute) return;
    unlockAudioForCurrentScreen();
    const fileKey = kind === 'confirm' ? 'menuConfirm' : kind === 'back' ? 'menuBack' : kind === 'error' ? 'menuError' : 'menuCursor';
    if (playSfx(fileKey, 0.92)) return;
    const ctx = getMenuAudioContext();
    if (!ctx) return;
    const volume = Math.max(0, Math.min(1, state.settings?.volume ?? 0.7));
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    const freq = kind === 'confirm' ? 260 : kind === 'back' ? 160 : 520;
    osc.type = kind === 'confirm' ? 'square' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    if (kind === 'confirm') osc.frequency.exponentialRampToValueAtTime(420, now + 0.055);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.052 * volume, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'move' ? 0.045 : 0.075));
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (kind === 'move' ? 0.055 : 0.09));
  }

  let cachedAnnouncerVoice = null;
  function getAnnouncerVoice() {
    const synth = window.speechSynthesis;
    if (!synth) return null;
    const voices = synth.getVoices ? synth.getVoices() : [];
    if (!voices.length) return null;
    if (cachedAnnouncerVoice && voices.includes(cachedAnnouncerVoice)) return cachedAnnouncerVoice;
    cachedAnnouncerVoice = voices.find(v => /david|mark|guy|male|alex|daniel|george|english/i.test(v.name)) || voices.find(v => /^en[-_]/i.test(v.lang)) || voices[0];
    return cachedAnnouncerVoice;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => { cachedAnnouncerVoice = null; getAnnouncerVoice(); };
  }

  function speakAnnouncer(line, opts = {}) {
    if (state.settings?.mute || state.settings?.announcer === false) return;
    const synth = window.speechSynthesis;
    if (!synth || !line) return;
    try {
      const u = new SpeechSynthesisUtterance(String(line));
      u.lang = 'en-US';
      u.volume = Math.max(0, Math.min(1, state.settings?.volume ?? 0.7));
      u.rate = opts.rate ?? 0.88;
      u.pitch = opts.pitch ?? 0.72;
      const voice = getAnnouncerVoice();
      if (voice) u.voice = voice;
      if (opts.interrupt) synth.cancel();
      synth.speak(u);
    } catch (_) {}
  }

  function playEvilGameOverLaugh() {
    speakAnnouncer('Mwah ha ha ha ha.', { pitch: 0.45, rate: 0.7, interrupt: true });
    window.setTimeout(() => speakAnnouncer('Game over', { pitch: 0.62, rate: 0.76 }), 1250);
  }


  function mainMenuButtons() {
    return Array.from(document.querySelectorAll('.main-menu .main-buttons button'));
  }

  function selectMainMenuIndex(index, sound = true) {
    const buttons = mainMenuButtons();
    if (!buttons.length) return;
    const wrapped = (index + buttons.length) % buttons.length;
    state.menuIndex = wrapped;
    buttons.forEach((btn, i) => btn.classList.toggle('selected', i === wrapped));
    if (sound) playMenuTone('move');
  }

  function activateMainMenuSelection() {
    const buttons = mainMenuButtons();
    const btn = buttons[state.menuIndex || 0] || buttons[0];
    if (btn) {
      btn.click();
    }
  }

  function wireMainMenuSelection() {
    decorateMainMenuButtons();
    mainMenuButtons().forEach((btn, i) => {
      btn.addEventListener('mouseenter', () => selectMainMenuIndex(i));
      btn.addEventListener('focus', () => selectMainMenuIndex(i));
      btn.addEventListener('click', () => selectMainMenuIndex(i, false));
    });
    selectMainMenuIndex(0, false);
  }

  function showCalamitySports() {
    const msg = document.getElementById('sportsPlaceholderMessage');
    if (msg) msg.textContent = 'Select Basketball or Tennis. These mini games are placeholder doors for now.';
    showScreen('calamitySports');
  }

  function showSportsPlaceholder(kind) {
    const msg = document.getElementById('sportsPlaceholderMessage');
    if (!msg) return;
    if (kind === 'basketball') {
      msg.textContent = 'Basketball mini game placeholder: later this will open character select, court select, then a quick basketball match.';
    } else if (kind === 'tennis') {
      msg.textContent = 'Tennis mini game placeholder: later this will open character select, court select, then a quick tennis match.';
    }
  }

  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      playMenuTone('confirm');
      if (action === 'story') { refreshDifficultyUI(); showScreen('storySetup'); }
      if (action === 'load-game') { renderSaveSlots(); showScreen('loadGame'); }
      if (action === 'story-start') openStory(0);
      if (action === 'story-missions') { renderMissions(); showScreen('mission'); }
      if (action === 'pvp') { refreshDifficultyUI(); renderBattleModeSetup(); showScreen('pvp'); }
      if (action === 'tournament') startTournamentMode();
      if (action === 'calamity-sports') showCalamitySports();
      if (action === 'sports-basketball') showSportsPlaceholder('basketball');
      if (action === 'sports-tennis') showSportsPlaceholder('tennis');
      if (action === 'pvp-player') beginBattleSetup('pvp-local');
      if (action === 'pvp-ai') beginBattleSetup('pvp-ai');
      if (action === 'pvp-cpu-cpu') beginBattleSetup('cpu-cpu');
      if (action === 'training') { state.battle.type = 'team'; state.battle.format = 'custom'; setTeamSize('p1', 1, false); setBattleTeam('p2', ['dummy']); beginBattleSetup('training'); }
      if (action === 'battle-back') { if (state.battle.mode === 'training') showScreen('main'); else { renderBattleModeSetup(); showScreen('pvp'); } }
      if (action === 'battle-characters') { renderBattleCharacters(); showScreen('battleCharacters'); }
      if (action === 'battle-open-select') beginBattleSetup(state.battle.mode);
      if (action === 'select') { renderRoster(); updateSelectedPanel(state.selected); showScreen('select'); }
      if (action === 'gallery') showGalleryHub();
      if (action === 'gallery-characters') { renderRoster(); updateSelectedPanel(state.selected); showScreen('select'); }
      if (action === 'gallery-stages') { renderGallery(); showScreen('stageGallery'); }
      if (action === 'gallery-cutscenes') showGalleryPlaceholder('cutscenes');
      if (action === 'gallery-extras') showGalleryPlaceholder('extras');
      if (action === 'options') showScreen('options');
      if (action === 'stage-back') { renderStageSelect(); showScreen('stageSelect'); }
      if (action === 'back') showScreen('main');
    });
  });
  document.querySelectorAll('#battleModeButtons [data-battle-mode]').forEach(btn => btn.addEventListener('click', () => setBattleSetupMode(btn.dataset.battleMode)));
  document.querySelectorAll('#battleFormatButtons [data-battle-format]').forEach(btn => btn.addEventListener('click', () => setBattleFormat(btn.dataset.battleFormat)));
  document.querySelectorAll('[data-setup-size]').forEach(btn => btn.addEventListener('click', () => setSetupSize(btn.dataset.setupSize, btn.dataset.size)));
  wireCharacterRandomButton('randomP1', 'p1');
  wireCharacterRandomButton('randomP2', 'p2');
  wireCharacterRandomButton('randomBoth', 'both');
  document.getElementById('confirmBattleCharacters').addEventListener('click', showBattleStageSelect);
  document.getElementById('randomStage').addEventListener('click', randomizeStageSpin);
  document.getElementById('randomStage').addEventListener('mouseenter', startStageHoverPreview);
  document.getElementById('randomStage').addEventListener('mouseleave', () => stopStageHoverPreview(true));
  document.getElementById('randomStage').addEventListener('focus', startStageHoverPreview);
  document.getElementById('randomStage').addEventListener('blur', () => stopStageHoverPreview(true));
  document.getElementById('prevStage').addEventListener('click', () => rotateStage(-1));
  document.getElementById('nextStage').addEventListener('click', () => rotateStage(1));
  document.getElementById('startConfiguredBattle').addEventListener('click', startConfiguredBattle);
  document.getElementById('retryStoryBattle').addEventListener('click', retryStoryBattle);
  document.getElementById('loadStoryCheckpoint').addEventListener('click', loadStoryCheckpoint);
  document.getElementById('gameOverMainMenu').addEventListener('click', () => showScreen('main'));
  document.getElementById('continueStory').addEventListener('click', continueStory);
  document.getElementById('openSaveSlots').addEventListener('click', () => { renderSaveSlots(); showScreen('loadGame'); });
  document.getElementById('skipToFight').addEventListener('click', skipToFight);
  document.getElementById('toggleDebug').addEventListener('change', e => state.debug = e.target.checked);
  document.getElementById('toggleAssist').addEventListener('change', e => state.storyAssist = e.target.checked);
  const muteToggle = document.getElementById('toggleMenuMute');
  if (muteToggle) muteToggle.addEventListener('change', e => {
    state.settings.mute = e.target.checked;
    if (e.target.checked) {
      stopMusic();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } else {
      updateMusicForScreen(state.screen);
    }
  });
  const announcerToggle = document.getElementById('toggleAnnouncerVoice');
  if (announcerToggle) announcerToggle.addEventListener('change', e => { state.settings.announcer = e.target.checked; if (!e.target.checked && window.speechSynthesis) window.speechSynthesis.cancel(); });
  const volumeSlider = document.getElementById('gameVolumeSlider');
  const volumeReadout = document.getElementById('gameVolumeReadout');
  if (volumeSlider) volumeSlider.addEventListener('input', e => {
    state.settings.volume = Math.max(0, Math.min(1, Number(e.target.value) / 100));
    if (volumeReadout) volumeReadout.textContent = `${e.target.value}%`;
    refreshAudioVolumes();
  });
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.classList.add('language-select-control');
    languageSelect.addEventListener('change', e => setLanguage(e.target.value));
  }

  function clampRoundTime(seconds) {
    if (!Number.isFinite(seconds) || seconds > 600) return Infinity;
    return Math.max(30, Math.min(600, Math.round(seconds)));
  }

  function formatRoundSetting(seconds) {
    if (!Number.isFinite(seconds)) return '∞';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function updateRoundTimeSetting(deltaSeconds = 0) {
    let current = state.settings.roundTimeSeconds;
    if (!Number.isFinite(current)) current = 600;
    current += deltaSeconds;
    state.settings.roundTimeSeconds = clampRoundTime(current);
    const readout = document.getElementById('roundTimeReadout');
    if (readout) readout.textContent = formatRoundSetting(state.settings.roundTimeSeconds);
  }

  function updateHealthBarSetting(side, delta = 0) {
    const key = side === 'p2' ? 'p2HealthBars' : 'p1HealthBars';
    state.settings[key] = Math.max(1, Math.min(5, Number(state.settings[key] || 3) + delta));
    const readout = document.getElementById(side === 'p2' ? 'p2HealthBarsReadout' : 'p1HealthBarsReadout');
    if (readout) readout.textContent = String(state.settings[key]);
  }

  const roundMinDown = document.getElementById('roundMinDown');
  const roundMinUp = document.getElementById('roundMinUp');
  const roundSecDown = document.getElementById('roundSecDown');
  const roundSecUp = document.getElementById('roundSecUp');
  if (roundMinDown) roundMinDown.addEventListener('click', () => updateRoundTimeSetting(-60));
  if (roundMinUp) roundMinUp.addEventListener('click', () => updateRoundTimeSetting(60));
  if (roundSecDown) roundSecDown.addEventListener('click', () => updateRoundTimeSetting(-1));
  if (roundSecUp) roundSecUp.addEventListener('click', () => updateRoundTimeSetting(1));
  const p1BarsDown = document.getElementById('p1HealthBarsDown');
  const p1BarsUp = document.getElementById('p1HealthBarsUp');
  const p2BarsDown = document.getElementById('p2HealthBarsDown');
  const p2BarsUp = document.getElementById('p2HealthBarsUp');
  if (p1BarsDown) p1BarsDown.addEventListener('click', () => updateHealthBarSetting('p1', -1));
  if (p1BarsUp) p1BarsUp.addEventListener('click', () => updateHealthBarSetting('p1', 1));
  if (p2BarsDown) p2BarsDown.addEventListener('click', () => updateHealthBarSetting('p2', -1));
  if (p2BarsUp) p2BarsUp.addEventListener('click', () => updateHealthBarSetting('p2', 1));
  updateRoundTimeSetting(0);
  updateHealthBarSetting('p1', 0);
  updateHealthBarSetting('p2', 0);
  wireMainMenuSelection();

  const handicapSelect = document.getElementById('handicapSelect');
  if (handicapSelect) handicapSelect.addEventListener('change', e => { state.handicap = e.target.value; });
  document.querySelectorAll('#storyDifficultyButtons button').forEach(btn => btn.addEventListener('click', () => { state.storyDifficulty = btn.dataset.difficulty; refreshDifficultyUI(); }));
  document.querySelectorAll('#cpuDifficultyButtons button').forEach(btn => btn.addEventListener('click', () => { state.cpuDifficulty = btn.dataset.difficulty; refreshDifficultyUI(); }));

  window.addEventListener('keydown', e => {
    unlockAudioForCurrentScreen();
    const key = e.key.toLowerCase();
    state.keys.add(key);
    if (key === 'x' && state.screen === 'select') { state.selected = randomCharacter(); updateSelectedPanel(state.selected); renderRoster(); }
    if (key === 'x' && state.screen === 'battleCharacters') randomizeBattleCharacter(state.battle.activeSide);
    if (key === 'x' && state.screen === 'stageSelect') randomizeStageSpin();
    if (key === 'arrowleft' && state.screen === 'stageSelect') rotateStage(-1);
    if (key === 'arrowright' && state.screen === 'stageSelect') rotateStage(1);
    if (key === 'enter' && state.screen === 'stageSelect') startConfiguredBattle();
    if (key === 'enter' && state.screen === 'ready') startActualConfiguredBattle();
    if (key === 'enter' && state.screen === 'battleCharacters') showBattleStageSelect();
    if ((key === 'arrowdown' || key === 's') && state.screen === 'main') selectMainMenuIndex((state.menuIndex || 0) + 1);
    if ((key === 'arrowup' || key === 'w') && state.screen === 'main') selectMainMenuIndex((state.menuIndex || 0) - 1);
    if (key === 'enter' && state.screen === 'main') activateMainMenuSelection();
    if (key === 'enter' && state.screen === 'gameOver') retryStoryBattle();
    if ((key === ' ' || key === 'enter') && state.screen === 'story') continueStory();
    if (key === 'escape') showScreen('main');
  });
  window.addEventListener('keyup', e => state.keys.delete(e.key.toLowerCase()));

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const floorY = 430;
  let raf = null;

  class Fighter {
    constructor(id, x, facing, controls, isAI=false) {
      const c = characters[id];
      Object.assign(this, { id, name: c.name, c, x, y: floorY, vx: 0, vy: 0, w: 48, h: 112, facing, controls, isAI, onGround: true, hp: c.hp, maxHp: c.hp, meter: 10, maxMeter: 100, attackTimer: 0, attackKind: null, hitCooldown: 0, guard: false, dead: false, aiCooldown: 0, comboFlash: 0, damageMod: 1, aiAggression: .68, aiGuard: .006, aiSpecial: .1, aiCooldownMin: 28, aiCooldownMax: 28, aiMovement: 1 });
      if (c.hiddenGod) {
        this.maxMeter = 140;
        this.meter = 70;
        this.damageMod = 1.12;
        this.aiAggression = .92;
        this.aiGuard = .018;
        this.aiSpecial = .24;
        this.aiCooldownMin = 12;
        this.aiCooldownMax = 18;
        this.aiMovement = 1.16;
      }
    }
    center() { return { x: this.x + this.w / 2, y: this.y - this.h / 2 }; }
    rect() { return { x: this.x, y: this.y - this.h, w: this.w, h: this.h }; }
    input(enemy) {
      if (this.dead) return;
      if (this.isTrainingDummy) {
        const behavior = state.settings.trainingDummyBehavior || this.dummyBehavior || 'idle';
        this.dummyBehavior = behavior;
        if (behavior === 'idle') {
          this.vx = 0;
          this.guard = false;
          return;
        }
        if (behavior === 'block') {
          this.vx = 0;
          this.guard = true;
          return;
        }
        this.isAI = true;
      }
      let left=false, right=false, jump=false, light=false, heavy=false, special=false, guard=false;
      if (this.isAI) {
        const dist = enemy.x - this.x;
        const abs = Math.abs(dist);
        this.aiCooldown -= 1;
        left = dist < -70;
        right = dist > 70;
        guard = Math.random() < this.aiGuard && abs < 130;
        if (abs < 92 && this.aiCooldown <= 0 && Math.random() < this.aiAggression) {
          light = Math.random() < .58;
          heavy = !light && Math.random() < .82;
          this.aiCooldown = this.aiCooldownMin + Math.random() * this.aiCooldownMax;
        }
        if (abs < 190 && this.meter > 35 && this.aiCooldown <= 0 && Math.random() < this.aiSpecial) {
          special = true;
          this.aiCooldown = this.aiCooldownMin + 44;
        }
        if (Math.random() < (.006 + this.aiAggression * .006) && this.onGround) jump = true;
      } else {
        const k = state.keys;
        left = k.has(this.controls.left); right = k.has(this.controls.right); jump = k.has(this.controls.jump);
        light = k.has(this.controls.light); heavy = k.has(this.controls.heavy); special = k.has(this.controls.special); guard = k.has(this.controls.guard);
      }
      this.guard = guard && this.attackTimer <= 0;
      const moveSpeed = this.c.speed * (this.isAI ? this.aiMovement : 1) * (this.guard ? .45 : 1);
      this.vx = 0;
      if (!this.guard && this.attackTimer <= 6) {
        if (left) this.vx -= moveSpeed;
        if (right) this.vx += moveSpeed;
      }
      if (jump && this.onGround && !this.guard) {
        this.vy = -12.5;
        this.onGround = false;
        playSfx('jump', 0.55);
      }
      if (light) this.attack('light');
      if (heavy) this.attack('heavy');
      if (special) this.attack('special');
    }
    attack(kind) {
      if (this.attackTimer > 0 || this.dead) return;
      if (kind === 'special' && this.meter < 32) return;
      this.attackKind = kind;
      this.attackTimer = kind === 'light' ? 14 : kind === 'heavy' ? 23 : 31;
      if (kind === 'special') {
        this.meter -= 32;
        playSfx('specialCharge', 0.75);
      } else if (!this.isAI) {
        playSfx(kind === 'heavy' ? 'hitHeavy' : 'hitLight', 0.22);
      }
    }
    update(enemy) {
      const wasOnGround = this.onGround;
      this.input(enemy);
      this.x += this.vx;
      this.y += this.vy;
      if (!this.onGround) this.vy += .75;
      if (this.y >= floorY) {
        this.y = floorY;
        this.vy = 0;
        if (!wasOnGround) playSfx('land', 0.5);
        this.onGround = true;
      }
      this.x = Math.max(60, Math.min(W - 110, this.x));
      this.facing = enemy.x >= this.x ? 1 : -1;
      if (this.attackTimer > 0) {
        this.attackTimer -= 1;
        const active = this.attackKind === 'light' ? this.attackTimer >= 5 && this.attackTimer <= 10 : this.attackKind === 'heavy' ? this.attackTimer >= 8 && this.attackTimer <= 15 : this.attackTimer >= 12 && this.attackTimer <= 23;
        if (active) this.tryHit(enemy);
        if (this.attackTimer <= 0) this.attackKind = null;
      }
      if (this.hitCooldown > 0) this.hitCooldown -= 1;
      if (this.comboFlash > 0) this.comboFlash -= 1;
      this.meter = Math.min(this.maxMeter, this.meter + .08);
    }
    hitbox() {
      const range = this.attackKind === 'light' ? 54 : this.attackKind === 'heavy' ? 72 : 105;
      const height = this.attackKind === 'special' ? 78 : 54;
      return { x: this.facing > 0 ? this.x + this.w - 2 : this.x - range + 2, y: this.y - this.h + 34, w: range, h: height };
    }
    tryHit(enemy) {
      if (enemy.hitCooldown > 0 || enemy.dead) return;
      const a = this.hitbox(); const b = enemy.rect();
      if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y) {
        let dmg = this.attackKind === 'light' ? 8 : this.attackKind === 'heavy' ? 15 : 22;
        dmg *= this.c.power * this.damageMod;
        if (enemy.guard) dmg *= .28;
        playSfx(enemy.guard ? 'guardBlock' : (this.attackKind === 'light' ? 'hitLight' : 'hitHeavy'), enemy.guard ? 0.72 : 0.86);
        if (this.attackKind === 'special' && !enemy.guard) playSfx('specialRelease', 0.72);
        enemy.hp = Math.max(0, enemy.hp - dmg);
        enemy.hitCooldown = enemy.guard ? 10 : 18;
        enemy.vx = this.facing * (enemy.guard ? 4 : 9);
        if (!enemy.guard) enemy.vy = this.attackKind === 'heavy' ? -3.8 : -2.2;
        this.meter = Math.min(this.maxMeter, this.meter + (this.attackKind === 'special' ? 7 : 12));
        enemy.comboFlash = 10;
        if (enemy.hp <= 0) {
          enemy.dead = true;
          playSfx('koImpact', 0.95);
        }
      }
    }
    draw() {
      const r = this.rect();
      const sprite = getFighterSprite(this);
      const spriteW = sprite?.naturalWidth || sprite?.width || 0;
      const spriteH = sprite?.naturalHeight || sprite?.height || 0;
      if (sprite && spriteW && spriteH) {
        ctx.save();
        if (this.comboFlash > 0) { ctx.shadowColor = '#fff'; ctx.shadowBlur = 24; }
        ctx.fillStyle = 'rgba(0,0,0,.45)';
        ctx.beginPath(); ctx.ellipse(this.x + this.w/2, floorY+8, 52, 12, 0, 0, Math.PI*2); ctx.fill();

        const imgW = spriteW || 900;
        const imgH = spriteH || 900;
        const pose = this._lastDrawPose || fighterVisualPose(this);
        const dynamicBounds = sprite._visibleBounds || computeSpriteVisibleBounds(sprite);
        if (dynamicBounds) sprite._visibleBounds = dynamicBounds;
        const bounds = spriteBounds[this.id]?.[pose] || spriteBounds[this.id]?.idle || dynamicBounds || { sx: 0, sy: 0, sw: imgW, sh: imgH };

        // Draw the visible character bounds instead of the full transparent canvas.
        // This keeps Nico/Rai/Shanti from changing size when the pose image has extra padding.
        const targetHByCharacter = { rai: 184, nico: 184, shanti: 184, awar_aries: 188, dante_aries: 210, goro: 208, mammon: 208, dummy: 184, training_dummy_shadow: 184, training_dummy_ninja: 184 };
        const targetH = targetHByCharacter[this.id] || 178;
        const poseScale = pose === 'ko' ? 0.58 : (pose === 'heavy' || pose === 'special' ? 1.05 : 1);
        const drawH = targetH * poseScale;
        const drawW = drawH * (bounds.sw / Math.max(1, bounds.sh));
        const centerX = this.x + this.w / 2;
        const topY = pose === 'ko' ? floorY - drawH * 0.72 : floorY - drawH;
        ctx.translate(centerX, 0);
        ctx.scale(this.facing >= 0 ? 1 : -1, 1);
        ctx.drawImage(sprite, bounds.sx, bounds.sy, bounds.sw, bounds.sh, -drawW / 2, topY, drawW, drawH);

        if (this.c.hiddenGod) {
          ctx.globalAlpha = .28 + Math.sin(Date.now()/180) * .08;
          ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.arc(0, this.y-72, 76, 0, Math.PI*2); ctx.stroke();
          ctx.globalAlpha = 1;
        }
        ctx.restore();
        if (this.attackTimer > 0) {
          const hb = this.hitbox();
          ctx.save(); ctx.globalAlpha = state.debug ? .25 : .10; ctx.fillStyle = this.c.color; ctx.fillRect(hb.x,hb.y,hb.w,hb.h); ctx.restore();
        }
        if (this.guard) { ctx.save(); ctx.strokeStyle = '#73b8ff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(this.x+this.w/2, this.y-64, 52, -.9, .9); ctx.stroke(); ctx.restore(); }
        if (state.debug) { ctx.save(); ctx.strokeStyle = '#0f0'; ctx.strokeRect(r.x,r.y,r.w,r.h); if(this.attackTimer>0){const hb=this.hitbox(); ctx.strokeStyle='#f00'; ctx.strokeRect(hb.x,hb.y,hb.w,hb.h);} ctx.restore(); }
        return;
      }

      ctx.save();
      if (this.comboFlash > 0) { ctx.shadowColor = '#fff'; ctx.shadowBlur = 22; }
      // shadow
      ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(this.x + this.w/2, floorY+8, 42, 10, 0, 0, Math.PI*2); ctx.fill();
      if (isTrainingDummyId(this.id)) {
        // Fallback only: if the uploaded training_dummy_shadow PNGs fail to load, draw a simple shadow target instead of a random fighter blob.
        ctx.fillStyle = 'rgba(0,0,0,.86)';
        ctx.strokeStyle = '#7f8a9a';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(this.x+7, this.y-104, 38, 102, 14); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(15,18,24,.96)';
        ctx.beginPath(); ctx.arc(this.x+26, this.y-126, 22, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#506070'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(this.x+13,this.y-56); ctx.lineTo(this.x-12,this.y-28); ctx.moveTo(this.x+39,this.y-56); ctx.lineTo(this.x+64,this.y-28); ctx.stroke();
        ctx.restore();
        return;
      }
      // body cloak / torso
      ctx.fillStyle = '#0a0a0c'; ctx.strokeStyle = this.c.color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(this.x+8, this.y-82, 32, 76, 10); ctx.fill(); ctx.stroke();
      // sash
      ctx.strokeStyle = this.id === 'rai' ? '#b20f22' : this.c.color; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(this.x+7, this.y-45); ctx.lineTo(this.x+42, this.y-52); ctx.stroke();
      // head
      ctx.fillStyle = '#8c5434'; ctx.beginPath(); ctx.arc(this.x+24, this.y-100, 21, 0, Math.PI*2); ctx.fill();
      // hair / aura
      ctx.fillStyle = this.c.color; for (let i=0;i<9;i++){ ctx.beginPath(); ctx.arc(this.x+9+i*4.2, this.y-124 - (i%2)*5, 6, 0, Math.PI*2); ctx.fill(); }
      if (this.c.hiddenGod) {
        ctx.globalAlpha = .28 + Math.sin(Date.now()/180) * .08;
        ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(this.x+this.w/2, this.y-62, 62, 0, Math.PI*2); ctx.stroke();
        ctx.globalAlpha = 1;
      }
      // eye
      ctx.fillStyle = '#fff'; ctx.fillRect(this.x + (this.facing>0?30:12), this.y-103, 8, 4);
      // legs
      ctx.strokeStyle = '#111'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(this.x+16,this.y-8); ctx.lineTo(this.x+10,this.y+2); ctx.moveTo(this.x+32,this.y-8); ctx.lineTo(this.x+42,this.y+2); ctx.stroke();
      // sword / fist line
      ctx.strokeStyle = this.attackKind === 'special' ? this.c.color : '#eaf7ff'; ctx.lineWidth = this.attackKind ? 5 : 3;
      ctx.beginPath();
      const sx = this.facing > 0 ? this.x + 38 : this.x + 10;
      const ex = sx + this.facing * (this.attackKind ? 78 : 48);
      ctx.moveTo(sx, this.y-62); ctx.lineTo(ex, this.y - (this.attackKind === 'heavy' ? 78 : 50)); ctx.stroke();
      if (this.attackTimer > 0) {
        const hb = this.hitbox();
        ctx.globalAlpha = .18; ctx.fillStyle = this.c.color; ctx.fillRect(hb.x,hb.y,hb.w,hb.h); ctx.globalAlpha = 1;
      }
      if (this.guard) { ctx.strokeStyle = '#73b8ff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(this.x+this.w/2, this.y-60, 48, -.9, .9); ctx.stroke(); }
      if (state.debug) { ctx.strokeStyle = '#0f0'; ctx.strokeRect(r.x,r.y,r.w,r.h); if(this.attackTimer>0){const hb=this.hitbox(); ctx.strokeStyle='#f00'; ctx.strokeRect(hb.x,hb.y,hb.w,hb.h);} }
      ctx.restore();
    }
  }


  function applyHpScale(fighter, scale) {
    fighter.maxHp = Math.max(1, Math.round(fighter.maxHp * scale));
    fighter.hp = Math.min(fighter.hp, fighter.maxHp);
    fighter.hp = fighter.maxHp;
  }

  function applyHandicapToTeams(team1, team2) {
    if (state.handicap === 'p1-plus') team1.forEach(f => applyHpScale(f, 1.25));
    if (state.handicap === 'p2-plus') team2.forEach(f => applyHpScale(f, 1.25));
    if (state.handicap === 'p1-minus') team1.forEach(f => applyHpScale(f, .75));
    if (state.handicap === 'p2-minus') team2.forEach(f => applyHpScale(f, .75));
  }

  function livingTeamCount(team) {
    return team.filter(f => !f.dead && f.hp > 0).length;
  }

  function teamStatus(team, activeIndex) {
    return team.map((f, i) => `${i === activeIndex ? '▶ ' : ''}${f.dead ? '✕ ' : ''}${f.name}`).join(' / ');
  }

  function hudInitials(name='?') {
    return String(name).split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  }

  function battlePortraitCardSrc(fighter) {
    if (!fighter) return '';
    const id = fighter.id || fighter.charId || fighter.canonId || fighter.characterId || fighter.c?.id || '';
    return id ? selectCardSrc(id) : '';
  }

  function renderTeamHudSlots(containerId, team, activeIndex, side='p1') {
    const box = document.getElementById(containerId);
    if (!box || !team) return;
    box.innerHTML = '';
    if (team.length <= 1) {
      box.style.display = 'none';
      return;
    }
    box.style.display = 'flex';
    team.slice(0, 3).forEach((fighter, index) => {
      const slot = document.createElement('div');
      slot.className = `team-hud-slot ${index === activeIndex ? 'active' : ''} ${fighter.dead || fighter.hp <= 0 ? 'down' : ''}`;
      slot.style.setProperty('--slot-color', fighter.c?.color || '#c8a45d');
      slot.innerHTML = `<b>${index + 1}</b><span>${hudInitials(fighter.name)}</span>`;
      box.appendChild(slot);
    });
  }

  function updateFightNames() {
    const f = state.fight;
    if (!f) return;
    const p1Name = document.getElementById('p1Name');
    const p2Name = document.getElementById('p2Name');
    if (p1Name) p1Name.textContent = f.p1?.name || teamStatus(f.team1, f.p1Index);
    if (p2Name) p2Name.textContent = f.p2?.name || teamStatus(f.team2, f.p2Index);

    const p1Portrait = document.getElementById('p1LeadPortrait');
    const p2Portrait = document.getElementById('p2LeadPortrait');
    const applyLeadPortrait = (el, fighter, fallbackColor) => {
      if (!el) return;
      const accent = fighter?.c?.color || fallbackColor;
      el.style.setProperty('--portrait-color', accent);
      el.classList.remove('has-card-art');
      el.textContent = fighter ? hudInitials(fighter.name) : '';
      el.style.backgroundImage = '';
      const src = battlePortraitCardSrc(fighter);
      if (src) {
        el.classList.add('has-card-art');
        el.textContent = '';
        el.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.42)), url("${src}")`;
      }
    };
    applyLeadPortrait(p1Portrait, f.p1, '#d2212f');
    applyLeadPortrait(p2Portrait, f.p2, '#3da2ff');

    renderTeamHudSlots('p1TeamHud', f.team1, f.p1Index, 'p1');
    renderTeamHudSlots('p2TeamHud', f.team2, f.p2Index, 'p2');
  }


  function switchActive(side, dir=1, force=false) {
    const f = state.fight;
    if (!f || f.over) return false;
    const isP1 = side === 'p1';
    const team = isP1 ? f.team1 : f.team2;
    if (!team || team.length < 2) return false;
    const currentIndex = isP1 ? f.p1Index : f.p2Index;
    const oldActive = isP1 ? f.p1 : f.p2;
    for (let step = 1; step <= team.length; step++) {
      const nextIndex = (currentIndex + dir * step + team.length) % team.length;
      const candidate = team[nextIndex];
      if (!candidate || (candidate.dead && !f.training)) continue;
      candidate.x = oldActive.x;
      candidate.y = floorY;
      candidate.vx = 0;
      candidate.vy = 0;
      candidate.facing = oldActive.facing;
      candidate.onGround = true;
      candidate.hitCooldown = Math.max(candidate.hitCooldown, force ? 22 : 8);
      if (isP1) { f.p1Index = nextIndex; f.p1 = candidate; }
      else { f.p2Index = nextIndex; f.p2 = candidate; }
      updateFightNames();
      flashMessage(`${isP1 ? 'P1' : 'P2'} TAGS IN\n${candidate.name}`, 850);
      return true;
    }
    return false;
  }


  function getConfiguredRoundFrames(isTraining=false) {
    if (isTraining) return Infinity;
    const seconds = state.settings.roundTimeSeconds;
    if (!Number.isFinite(seconds)) return Infinity;
    return Math.max(30, Math.min(600, seconds)) * 60;
  }

  function applyHealthBarSettings(team, side) {
    const bars = Math.max(1, Math.min(5, Number(side === 'p2' ? state.settings.p2HealthBars : state.settings.p1HealthBars) || 3));
    const multiplier = bars / 3;
    team.forEach(f => {
      f.healthBars = bars;
      f.maxHp = Math.max(1, Math.round(f.maxHp * multiplier));
      f.hp = f.maxHp;
    });
  }

  function startFight(item, mode='story') {
    hideMatchOverPopup();
    const fightMode = mode === true ? 'pvp-local' : (mode || 'story');
    const isPvPLocal = fightMode === 'pvp-local';
    const isPvPAI = fightMode === 'pvp-ai';
    const isTraining = fightMode === 'training';
    const isCpuCpu = fightMode === 'cpu-cpu';
    const isTournament = fightMode === 'tournament';
    const isStory = fightMode === 'story';

    state.pvp = isPvPLocal;
    state.fightMode = fightMode;
    state.lastFightItem = { ...item, team1: item.team1 ? item.team1.slice() : undefined, team2: item.team2 ? item.team2.slice() : undefined };
    state.lastFightMode = fightMode;
    if (isStory) state.lastStoryIndex = state.storyIndex;

    const p1Ids = clampTeam(item.team1 || [((isPvPLocal || isPvPAI || isTraining || isCpuCpu) ? (item.player || state.selected) : item.player)], item.player || 'rai');
    const p2Ids = isTraining ? ['dummy'] : clampTeam(item.team2 || [((isPvPLocal || isPvPAI || isCpuCpu) ? (item.enemy || state.battle.p2 || 'nico') : item.enemy)], item.enemy || 'nico');
    const activeDifficulty = isTraining ? (state.settings.trainingDummyDifficulty || 'normal') : (isStory ? state.storyDifficulty : (isPvPAI || isCpuCpu || isTournament ? state.cpuDifficulty : 'normal'));
    const diff = difficultySettings[activeDifficulty] || difficultySettings.normal;
    const pvpCpuSide = isPvPAI ? (item.cpuSide || state.battle.cpuSide || 'p2') : null;

    const team1 = p1Ids.map((id, idx) => new Fighter(id, idx === 0 ? 175 : 125, 1, { left:'a', right:'d', jump:'w', light:'j', heavy:'k', special:'l', guard:'s' }, isCpuCpu || (isPvPAI && pvpCpuSide === 'p1')));
    const team2 = p2Ids.map((id, idx) => new Fighter(id, idx === 0 ? 720 : 770, -1, { left:'arrowleft', right:'arrowright', jump:'arrowup', light:'1', heavy:'2', special:'3', guard:'arrowdown' }, isStory || isCpuCpu || isTournament || (isPvPAI && pvpCpuSide !== 'p1') ? true : false));

    if (isTraining) team2.forEach(applyTrainingDummyDifficulty);

    // Fighting-game style layered health: every on-screen fighter has one visible bar, with 1–5 selectable HP layers per side.
    applyHealthBarSettings(team1, 'p1');
    applyHealthBarSettings(team2, 'p2');

    [...team1, ...team2].forEach(f => {
      if (!f.isAI) return;
      f.aiAggression = diff.aiAggression;
      f.aiGuard = diff.aiGuard;
      f.aiSpecial = diff.aiSpecial;
      f.aiCooldownMin = diff.aiCooldownMin;
      f.aiCooldownMax = diff.aiCooldownMax;
      f.aiMovement = diff.aiMovement;
      f.damageMod *= diff.enemyDamage;
    });
    if (isStory || isTournament) {
      team2.forEach(f => { f.maxHp = Math.round(f.maxHp * diff.enemyHp); f.hp = f.maxHp; });
    }
    if (isPvPAI) {
      (pvpCpuSide === 'p1' ? team1 : team2).forEach(f => { f.maxHp = Math.round(f.maxHp * diff.enemyHp); f.hp = f.maxHp; });
    }
    if (isCpuCpu) {
      [...team1, ...team2].forEach(f => { f.maxHp = Math.round(f.maxHp * diff.enemyHp); f.hp = f.maxHp; });
    }

    applyHandicapToTeams(team1, team2);

    if (isTraining) {
      team1.forEach(f => { f.meter = f.maxMeter; });
      team2.forEach(f => { f.hp = f.maxHp; f.meter = 0; });
    }
    state.fight = {
      p1: team1[0], p2: team2[0], team1, team2, p1Index: 0, p2Index: 0,
      stage: item.stage || 'forest', title: item.title || 'Fight',
      chapter: item.chapter || (isPvPLocal || isPvPAI || isCpuCpu ? 'PVP MODE' : isTraining ? 'TRAINING MODE' : 'STORY FIGHT'),
      timer: 0, roundTimeLimit: getConfiguredRoundFrames(isTraining), roundTimeRemaining: getConfiguredRoundFrames(isTraining), over: false, round: 1, p1Rounds: 0, p2Rounds: 0, roundResolving: false, roundIntro: isTraining ? 0 : 150, paused: false, bestOfThree: (isPvPLocal || isPvPAI || isCpuCpu || isTournament), pvp: isPvPLocal, mode: fightMode, training: isTraining, difficulty: activeDifficulty, cpuSide: pvpCpuSide
    };
    const fightScreenEl = document.getElementById('fightScreen');
    if (fightScreenEl) {
      fightScreenEl.classList.toggle('training-mode', isTraining);
      fightScreenEl.classList.toggle('team-battle-mode', state.battle.type === 'team');
    }
    updateFightNames();
    document.getElementById('roundInfo').textContent = item.title || 'FIGHT';
    document.getElementById('p2Hint').style.display = (isPvPLocal || (isPvPAI && pvpCpuSide === 'p1')) ? 'inline' : 'none';
    const modeHint = document.getElementById('modeHint');
    if (modeHint) {
      modeHint.textContent = isTraining ? `TRAINING: ${trainingDummyDisplayName()} · ${trainingDummyBehaviorLabel()}${state.settings.trainingDummyBehavior === 'attack' ? ` · CPU ${difficultyLabel(state.settings.trainingDummyDifficulty)}` : ''} · Q/E switch · R reset` : isTournament ? `TOURNAMENT: Stage ${(state.tournament?.index || 0) + 1}/13 · ${difficultyLabel(activeDifficulty)} · Best 2 of 3 · ${formatRoundSetting(state.settings.roundTimeSeconds)} rounds` : isCpuCpu ? `CPU vs CPU team watch. Difficulty: ${difficultyLabel(activeDifficulty)} · R rematch` : isPvPAI ? `${pvpCpuSide === 'p1' ? 'CPU controls P1 · Human controls P2' : 'Human controls P1 · CPU controls P2'} · ${difficultyLabel(activeDifficulty)} · R rematch` : isPvPLocal ? 'LOCAL TEAM BATTLE: P1 Q/E tag · P2 0 tag · R rematch' : isStory ? `STORY: ${difficultyLabel(activeDifficulty)}` : '';
      modeHint.style.display = modeHint.textContent ? 'inline' : 'none';
    }
    showScreen('fight');
    startMusic(isTraining ? 'training' : 'battle');
    if (isTraining) flashMessage('TRAINING MODE\nInfinite health and meter.', 1300);
    updateRoundSplash();
    loop();
  }

  function stopFight() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    state.fight = null;
  }

  function flashMessage(text, ms=1300) {
    const box = document.getElementById('fightMessage');
    box.innerHTML = String(text).split('\n').map(t => `<div>${t}</div>`).join('');
    box.classList.remove('hidden');
    setTimeout(() => box.classList.add('hidden'), ms);
  }


  function showCenterSplash(text, ms=900) {
    const splash = document.getElementById('roundSplash');
    if (!splash) return;
    splash.innerHTML = text;
    splash.classList.remove('hidden');
    if (ms > 0) setTimeout(() => {
      if (state.fight && state.fight.roundIntro <= 0 && !state.fight.paused) splash.classList.add('hidden');
    }, ms);
  }

  function hideMatchOverPopup() {
    const overlay = document.getElementById('matchOverOverlay');
    if (overlay) overlay.classList.add('hidden');
  }

  function showBattleMatchPopup(winnerText) {
    const overlay = document.getElementById('matchOverOverlay');
    const title = document.getElementById('matchOverTitle');
    const subtitle = document.getElementById('matchOverSubtitle');
    if (!overlay) return;
    if (title) title.textContent = winnerText || 'MATCH OVER';
    if (subtitle) subtitle.textContent = winnerText === 'DRAW' ? t('drawNext') : t('chooseNext');
    applyLanguage();
    overlay.classList.remove('hidden');
  }

  function rematchCurrentBattle() {
    hideMatchOverPopup();
    if (state.lastFightItem) startFight(state.lastFightItem, state.lastFightMode);
  }

  function returnToBattleCharacterSelect() {
    hideMatchOverPopup();
    if (state.lastFightMode && state.lastFightMode !== 'story') state.battle.mode = state.lastFightMode;
    state.battle.activeSide = 'p1';
    state.battle.activeSlot = 0;
    renderBattleCharacters();
    showScreen('battleCharacters');
  }

  function returnToMainMenuFromMatch() {
    hideMatchOverPopup();
    showScreen('main');
  }

  function formatFightClock(frames) {
    const totalSeconds = Math.max(0, Math.ceil(frames / 60));
    const m = Math.floor(totalSeconds / 60);
    const sec = String(totalSeconds % 60).padStart(2, '0');
    return `${m}:${sec}`;
  }

  function teamHpTotal(team) {
    return team.reduce((sum, fighter) => sum + Math.max(0, fighter.hp || 0), 0);
  }

  function setStackedHealth(prefix, fighter) {
    const max = Math.max(1, fighter.maxHp || 1);
    const bar = document.querySelector(`#${prefix}HealthBar`) || document.querySelector(`#${prefix}HpOrange`)?.closest('.triple-health') || document.querySelector(`.fighter-box.${prefix === 'p1' ? 'left' : 'right'} .triple-health`);
    if (!bar) return;
    const layers = Math.max(1, Math.min(5, Number(fighter.healthBars || (prefix === 'p2' ? state.settings.p2HealthBars : state.settings.p1HealthBars) || 3)));
    const layerColors = [
      ['#ff9b2e','#ff6a1e','#e93422'],
      ['#8fff61','#42df5a','#18ac4a'],
      ['#ffd96b','#e5b83a','#b37c18'],
      ['#c76bff','#8945ff','#5c28cc'],
      ['#56caff','#2586ff','#1654ff']
    ];

    const existingLayers = bar.querySelectorAll('.hp-layer.dynamic-health-layer');
    if (existingLayers.length !== layers) {
      bar.querySelectorAll('.hp-layer').forEach(el => el.remove());
      for (let i = 0; i < layers; i++) {
        const span = document.createElement('span');
        span.className = `hp-layer dynamic-health-layer hp-layer-${i}`;
        span.style.zIndex = String(i + 1);
        bar.appendChild(span);
      }
    }

    const hp = Math.max(0, Math.min(max, fighter.hp || 0));
    const chunk = max / layers;
    bar.querySelectorAll('.hp-layer.dynamic-health-layer').forEach((span, i) => {
      const fill = hp > chunk * i ? Math.min(1, (hp - chunk * i) / chunk) * 100 : 0;
      const color = layerColors[Math.min(i, layerColors.length - 1)];
      if (i === 1) {
        const greenRatio = Math.max(0, Math.min(1, fill / 100));
        const midHue = Math.round(52 + (130 - 52) * greenRatio);
        span.style.background = `linear-gradient(90deg, hsl(${midHue}, 100%, 68%), hsl(${midHue}, 92%, 52%), hsl(${Math.max(48, midHue - 14)}, 95%, 43%))`;
        span.style.filter = greenRatio < .35 && fill > 0 ? 'drop-shadow(0 0 7px rgba(255,230,60,.65))' : '';
      } else if (i === 0 && hp <= chunk * .45) {
        span.style.background = 'linear-gradient(90deg,#ff4939,#d91524,#84000a)';
        span.style.filter = 'drop-shadow(0 0 8px rgba(255,42,42,.75))';
      } else {
        span.style.background = `linear-gradient(90deg,${color[0]},${color[1]},${color[2]})`;
        span.style.filter = '';
      }
      span.style.width = `${fill}%`;
    });

    const hpText = document.getElementById(`${prefix}HpText`);
    if (hpText) hpText.textContent = `${Math.ceil(hp)} / ${Math.ceil(max)}`;

    bar.style.setProperty('--health-layers', String(layers));
    bar.classList.toggle('danger', hp <= chunk * .45);
  }

  function updateRoundSplash() {
    const f = state.fight;
    const splash = document.getElementById('roundSplash');
    if (!splash) return;
    if (!f || f.training || f.over || f.paused || f.roundIntro <= 0) {
      splash.classList.add('hidden');
      return;
    }
    if (f.roundIntro > 70) {
      splash.innerHTML = `${t('roundWord').toUpperCase()} ${f.round}`;
      if (f.announcerRound !== f.round) {
        speakAnnouncer(`Round ${f.round}`, { interrupt: true });
        f.announcerRound = f.round;
      }
    } else {
      splash.innerHTML = `${t('fight')}<small>GO</small>`;
      if (f.announcerFight !== f.round) {
        speakAnnouncer('Fight');
        f.announcerFight = f.round;
      }
    }
    splash.classList.remove('hidden');
  }

  function setPaused(paused=true) {
    const f = state.fight;
    if (!f || f.over) return;
    f.paused = paused;
    const overlay = document.getElementById('pauseOverlay');
    if (overlay) overlay.classList.toggle('hidden', !paused);
    updateRoundSplash();
    if (paused) renderPauseContent('home');
  }

  function renderPauseContent(tab='home') {
    const f = state.fight;
    const content = document.getElementById('pauseContent');
    if (!content || !f) return;
    document.querySelectorAll('.pause-tabs button').forEach(btn => btn.classList.remove('selected'));
    if (tab === 'settings') document.getElementById('pauseSettings')?.classList.add('selected');
    else if (tab === 'moves') document.getElementById('pauseMoveList')?.classList.add('selected');
    else document.getElementById('pauseResume')?.classList.add('selected');
    if (tab === 'settings') {
      content.innerHTML = `<h3>${t('quickSettings')}</h3>
        <label class="select-label pause-language-row">${t('language')}
          <select id="pauseLanguageSelect" class="language-select-control">${languageOptionsHtml()}</select>
        </label>
        <ul>
          <li><b>${t('mode')}:</b> ${f.chapter || f.mode}</li>
          <li><b>${t('difficulty')}:</b> ${difficultyLabel(f.difficulty || 'normal')}</li>
          <li><b>${t('round')}:</b> ${f.round}${f.bestOfThree ? ` · P1 ${f.p1Rounds} - ${f.p2Rounds} P2` : ''}</li>
          <li><b>${t('stage')}:</b> ${(stageOptions.find(st => st.id === f.stage) || {}).name || f.stage}</li>
          <li><b>${t('storyAssist')}:</b> ${state.storyAssist ? t('on') : t('off')}</li>
          <li><b>${t('handicap')}:</b> ${state.handicap || t('off')}</li>
        </ul>
        ${f.training ? `<div class="training-dummy-settings">
          <h4>Training Dummy</h4>
          <label class="select-label">Dummy Type
            <select id="trainingDummyTypeSelect" class="language-select-control">
              <option value="shadow" ${state.settings.trainingDummyType !== 'ninja' ? 'selected' : ''}>Shadow</option>
              <option value="ninja" ${state.settings.trainingDummyType === 'ninja' ? 'selected' : ''}>Ninja</option>
            </select>
          </label>
          <label class="select-label">Dummy Action
            <select id="trainingDummyBehaviorSelect" class="language-select-control">
              <option value="idle" ${state.settings.trainingDummyBehavior === 'idle' ? 'selected' : ''}>Idle</option>
              <option value="block" ${state.settings.trainingDummyBehavior === 'block' ? 'selected' : ''}>Block</option>
              <option value="attack" ${state.settings.trainingDummyBehavior === 'attack' ? 'selected' : ''}>Attack</option>
            </select>
          </label>
          <label class="select-label" id="trainingDummyDifficultyRow">Attack CPU Difficulty
            <select id="trainingDummyDifficultySelect" class="language-select-control">
              <option value="easy" ${state.settings.trainingDummyDifficulty === 'easy' ? 'selected' : ''}>Easy</option>
              <option value="normal" ${state.settings.trainingDummyDifficulty === 'normal' ? 'selected' : ''}>Normal</option>
              <option value="hard" ${state.settings.trainingDummyDifficulty === 'hard' ? 'selected' : ''}>Hard</option>
              <option value="extreme" ${state.settings.trainingDummyDifficulty === 'extreme' ? 'selected' : ''}>Extreme</option>
            </select>
          </label>
          <p id="trainingDummySettingsStatus" class="training-dummy-status"></p>
        </div>` : ''}
        <p>${t('languageNote')}</p>`;
      wireInlineLanguageSelect(document.getElementById('pauseLanguageSelect'));
      if (f.training) wireTrainingDummyPauseControls();
    } else if (tab === 'moves') {
      content.innerHTML = `<h3>Move List</h3>
        <ul>
          <li><b>P1 Move:</b> A / D &nbsp; <b>Jump:</b> W &nbsp; <b>Guard:</b> S</li>
          <li><b>P1 Attacks:</b> J Light · K Heavy · L Special</li>
          <li><b>P1 Team Switch:</b> Q / E</li>
          <li><b>P2 Move:</b> ← / → &nbsp; <b>Jump:</b> ↑ &nbsp; <b>Guard:</b> ↓</li>
          <li><b>P2 Attacks:</b> 1 Light · 2 Heavy · 3 Special</li>
          <li><b>P2 Team Switch:</b> 0</li>
          <li><b>Reset / Rematch:</b> R</li>
          <li><b>Future slot:</b> transformation controls for Rai and other awakenings.</li>
        </ul>
        <p><b>Current active:</b> ${f.p1.name} vs ${f.p2.name}</p>`;
    } else {
      content.innerHTML = t('pauseHome');
    }
  }

  function stageImage(stage) {
    return images[stage] || images.forest;
  }


  function reviveTeamForNextRound(team, side) {
    team.forEach((fighter, idx) => {
      fighter.hp = fighter.maxHp;
      fighter.dead = false;
      fighter.meter = Math.min(fighter.maxMeter, Math.max(15, fighter.meter));
      fighter.hitCooldown = 0;
      fighter.attackTimer = 0;
      fighter.attackKind = null;
      fighter.guard = false;
      fighter.vx = 0;
      fighter.vy = 0;
      fighter.onGround = true;
      fighter.y = floorY;
      fighter.x = side === 'p1' ? (idx === 0 ? 175 : 125) : (idx === 0 ? 720 : 770);
      fighter.facing = side === 'p1' ? 1 : -1;
    });
  }

  function beginNextRound() {
    const f = state.fight;
    if (!f) return;
    f.round += 1;
    f.p1Index = 0;
    f.p2Index = 0;
    reviveTeamForNextRound(f.team1, 'p1');
    reviveTeamForNextRound(f.team2, 'p2');
    f.p1 = f.team1[0];
    f.p2 = f.team2[0];
    f.roundResolving = false;
    f.roundIntro = 150;
    f.roundTimeRemaining = f.roundTimeLimit;
    updateFightNames();
    updateRoundSplash();
  }

  function finishMatch(winnerText, p1Won) {
    const f = state.fight;
    if (!f) return;
    f.over = true;
    playSfx(winnerText === 'DRAW' ? 'gameOver' : 'victory', 0.82);
    if (f.mode === 'tournament') {
      if (p1Won) {
        showCenterSplash('YOU WIN!', 1400);
        speakAnnouncer('You win');
        flashMessage(`YOU WIN!\nTournament stage cleared.`, 1600);
        setTimeout(() => {
          if (!state.tournament) return showScreen('main');
          state.tournament.index += 1;
          if (state.tournament.index >= 13) {
            flashMessage('TOURNAMENT CLEARED\n13 stages conquered.', 2200);
            setTimeout(() => showScreen('main'), 2300);
          } else {
            startTournamentFight();
          }
        }, 1700);
      } else {
        showCenterSplash('YOU LOSE!', 1800);
        speakAnnouncer('You lose');
        flashMessage(`YOU LOSE!\nTournament run ended. Press R to retry or ESC for menu.`, 2500);
      }
      return;
    }
    speakAnnouncer(winnerText.replace('DRAW', 'Draw'));
    setTimeout(() => showBattleMatchPopup(winnerText), 850);
  }

  function resolveBattleRound(reason='ko') {
    const f = state.fight;
    if (!f || f.roundResolving || f.over) return;
    f.roundResolving = true;
    const p1Alive = livingTeamCount(f.team1) > 0;
    const p2Alive = livingTeamCount(f.team2) > 0;
    let roundWinner = 0;
    if (reason === 'timeout') {
      const p1Hp = teamHpTotal(f.team1);
      const p2Hp = teamHpTotal(f.team2);
      if (p1Hp > p2Hp) roundWinner = 1;
      else if (p2Hp > p1Hp) roundWinner = 2;
    } else {
      if (p1Alive && !p2Alive) roundWinner = 1;
      else if (p2Alive && !p1Alive) roundWinner = 2;
    }

    if (roundWinner === 1) f.p1Rounds += 1;
    if (roundWinner === 2) f.p2Rounds += 1;

    const roundText = roundWinner === 1 ? `PLAYER 1 WINS ROUND ${f.round}` : roundWinner === 2 ? `PLAYER 2 WINS ROUND ${f.round}` : `ROUND ${f.round} DRAW`;
    showCenterSplash(reason === 'timeout' ? 'TIME!' : 'K.O.', 900);
    speakAnnouncer(reason === 'timeout' ? 'Time' : 'K O', { interrupt: true });
    const matchWinner = f.p1Rounds >= 2 ? 1 : f.p2Rounds >= 2 ? 2 : 0;

    if (matchWinner) {
      finishMatch(`PLAYER ${matchWinner} WINS`, matchWinner === 1);
    } else if (f.round >= 3) {
      if (f.p1Rounds > f.p2Rounds) finishMatch('PLAYER 1 WINS', true);
      else if (f.p2Rounds > f.p1Rounds) finishMatch('PLAYER 2 WINS', false);
      else finishMatch('DRAW', false);
    } else {
      if (roundWinner === 1) speakAnnouncer('Player 1 wins');
      else if (roundWinner === 2) speakAnnouncer('Player 2 wins');
      else speakAnnouncer('Draw');
      flashMessage(`${roundText}\nP1 ${f.p1Rounds} - ${f.p2Rounds} P2`, 1500);
      setTimeout(beginNextRound, 1600);
    }
  }

  function drawBackground(stage) {
    const img = stageImage(stage);
    const fightEl = document.getElementById('fightScreen');
    if (fightEl && assets[stage]) fightEl.style.backgroundImage = `url('${assets[stage]}')`;
    if (img && img.complete && img.naturalWidth) {
      const scale = Math.max(W/img.naturalWidth, H/img.naturalHeight);
      const w = img.naturalWidth*scale, h = img.naturalHeight*scale;
      ctx.drawImage(img, (W-w)/2, (H-h)/2, w, h);
    } else {
      ctx.fillStyle = '#111827'; ctx.fillRect(0,0,W,H);
    }
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(0, floorY, W, H-floorY);
  }

  function updateHud() {
    const { p1, p2 } = state.fight;
    updateFightNames();
    setStackedHealth('p1', p1);
    setStackedHealth('p2', p2);
    document.getElementById('p1Meter').style.width = `${Math.max(0, p1.meter / p1.maxMeter * 100)}%`;
    document.getElementById('p2Meter').style.width = `${Math.max(0, p2.meter / p2.maxMeter * 100)}%`;
    const ri = document.getElementById('roundInfo');
    if (ri) {
      const clock = state.fight.training || !Number.isFinite(state.fight.roundTimeRemaining) ? '∞' : formatFightClock(state.fight.roundTimeRemaining || 0);
      const stage = stageOptions.find(st => st.id === state.fight.stage);
      const stageName = (stage?.name || state.fight.title || state.fight.stage || 'BATTLE STAGE').toUpperCase();
      const score = state.fight.bestOfThree ? `R${state.fight.round} · P1 ${state.fight.p1Rounds}-${state.fight.p2Rounds} P2` : (state.fight.training ? 'TRAINING MODE' : 'SINGLE ROUND');
      ri.innerHTML = `<span class="timer-flair">◆</span><strong>${clock}</strong><small>${stageName}</small><em>${score}</em>`;
    }
    document.querySelectorAll('.fighter-box.left .round-wins i').forEach((dot,i)=>dot.classList.toggle('won', i < (state.fight.p1Rounds || 0)));
    document.querySelectorAll('.fighter-box.right .round-wins i').forEach((dot,i)=>dot.classList.toggle('won', i < (state.fight.p2Rounds || 0)));
  }

  function loop() {
    const f = state.fight;
    if (!f) return;
    f.timer++;
    drawBackground(f.stage);
    updateRoundSplash();
    if (f.paused) {
      f.p1.draw(); f.p2.draw(); updateHud();
      raf = requestAnimationFrame(loop);
      return;
    }
    if (f.roundIntro > 0) {
      f.roundIntro--;
      updateRoundSplash();
      f.p1.draw(); f.p2.draw(); updateHud();
      raf = requestAnimationFrame(loop);
      return;
    }
    if (f.roundResolving) {
      f.p1.draw(); f.p2.draw(); updateHud();
      raf = requestAnimationFrame(loop);
      return;
    }
    if (!f.over && !f.training && Number.isFinite(f.roundTimeRemaining)) {
      f.roundTimeRemaining = Math.max(0, (f.roundTimeRemaining || 0) - 1);
      if (f.roundTimeRemaining <= 0) {
        if (f.bestOfThree) {
          resolveBattleRound('timeout');
        } else {
          f.over = true;
          const p1Won = teamHpTotal(f.team1) >= teamHpTotal(f.team2);
          if (f.mode === 'story') {
            if (p1Won) {
              flashMessage(`TIME!\n${f.team1[0].name}'S TEAM WINS\nContinuing story...`, 1800);
              setTimeout(() => { state.storyIndex += 1; openStory(state.storyIndex); }, 1900);
            } else {
              showStoryGameOver();
            }
          } else {
            flashMessage(`TIME!\n${p1Won ? f.team1[0].name : f.team2[0].name}'S TEAM WINS\nPress R to rematch or ESC for menu`, 2400);
          }
        }
      }
    }
    if (!f.over) {
      f.p1.update(f.p2); f.p2.update(f.p1);
      if (f.training) {
        f.team1.forEach(ch => { ch.dead = false; ch.hp = ch.maxHp; ch.meter = ch.maxMeter; });
        f.team2.forEach(ch => { ch.dead = false; ch.hp = ch.maxHp; ch.meter = 0; });
      } else {
        if (f.p1.dead && livingTeamCount(f.team1) > 0) switchActive('p1', 1, true);
        if (f.p2.dead && livingTeamCount(f.team2) > 0) switchActive('p2', 1, true);
        if (livingTeamCount(f.team1) <= 0 || livingTeamCount(f.team2) <= 0) {
          const isStory = f.mode === 'story';
          if (f.bestOfThree) {
            resolveBattleRound();
          } else {
            f.over = true;
            const p1Won = livingTeamCount(f.team2) <= 0;
            if (p1Won) {
              flashMessage(`${f.team1[0].name}'S TEAM WINS\n${isStory ? 'Continuing story...' : 'Press R to rematch or ESC for menu'}`, 1800);
              if (isStory) setTimeout(() => { state.storyIndex += 1; openStory(state.storyIndex); }, 1900);
            } else {
              if (isStory) showStoryGameOver();
              else flashMessage(`${f.team2[0].name}'S TEAM WINS\nPress R to retry or ESC for menu`, 2500);
            }
          }
        }      }
    }
    f.p1.draw(); f.p2.draw(); updateHud();
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(12, H-104, 560, 38);
    ctx.fillStyle = '#f2eee6'; ctx.font = '14px Trebuchet MS';
    const modeText = f.training ? `Training: ${trainingDummyDisplayName()} is set to ${trainingDummyBehaviorLabel()}${state.settings.trainingDummyBehavior === 'attack' ? ` · CPU ${difficultyLabel(state.settings.trainingDummyDifficulty)}` : ''}. Q/E switches P1 teammates. Press R to reset spacing.` : f.mode === 'tournament' ? `Tournament stage ${(state.tournament?.index || 0) + 1}/13. Best 2 of 3 · 2:00 rounds. Difficulty: ${difficultyLabel(f.difficulty)}.` : f.mode === 'cpu-cpu' ? `CPU vs CPU team watch. Difficulty: ${difficultyLabel(f.difficulty)}. Press R for a rematch.` : f.mode === 'pvp-ai' ? `${f.cpuSide === 'p1' ? 'CPU controls Player 1. Human controls Player 2.' : 'Player 1 fights CPU-controlled opponent.'} Difficulty: ${difficultyLabel(f.difficulty)}. Press R for a rematch.` : f.pvp ? 'Local team PvP: P1 Q/E tag, P2 0 tag. Press R for a rematch.' : `Story battle. Difficulty: ${difficultyLabel(f.difficulty)}. Defeat the opponent to advance.`;
    ctx.fillText(modeText, 22, H-82);
    if (f.team1.length > 1 || f.team2.length > 1) {
      ctx.fillStyle = 'rgba(255,255,255,.78)';
      ctx.fillText(`Team count: P1 ${livingTeamCount(f.team1)}/${f.team1.length} · P2 ${livingTeamCount(f.team2)}/${f.team2.length}`, 22, H-62);
    }
    if (state.storyAssist && f.mode === 'story') {
      ctx.fillStyle = 'rgba(210,33,47,.75)'; ctx.fillText('TIP: Build meter with J/K. Use L for special when the blue meter is ready.', 22, H-42);
    }
    if (f.training) {
      ctx.fillStyle = 'rgba(61,162,255,.82)'; ctx.fillText('TRAINING TIP: Try light → heavy → special, then Q/E into another teammate.', 22, H-42);
    }
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('keydown', e => {
    if (state.screen !== 'fight') return;
    const key = e.key.toLowerCase();
    const matchOverlayOpen = !document.getElementById('matchOverOverlay')?.classList.contains('hidden');
    if (matchOverlayOpen) {
      if (key === 'r') rematchCurrentBattle();
      if (key === 'escape') returnToMainMenuFromMatch();
      e.preventDefault();
      return;
    }
    if ((key === 'p' || key === 'escape') && state.fight) {
      setPaused(!state.fight.paused);
      e.preventDefault();
      return;
    }
    if (state.fight?.paused) return;
    if (key === 'r' && state.lastFightItem) {
      startFight(state.lastFightItem, state.lastFightMode);
    }
    if (!e.repeat && (key === 'q' || key === 'e') && state.fight) {
      switchActive('p1', key === 'q' ? -1 : 1);
    }
    if (!e.repeat && key === '0' && state.fight && (state.fight.pvp || (state.fight.mode === 'pvp-ai' && state.fight.cpuSide === 'p1'))) {
      switchActive('p2', 1);
    }
  });

  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r){
      r = Math.min(r,w/2,h/2); this.beginPath(); this.moveTo(x+r,y); this.arcTo(x+w,y,x+w,y+h,r); this.arcTo(x+w,y+h,x,y+h,r); this.arcTo(x,y+h,x,y,r); this.arcTo(x,y,x+w,y,r); this.closePath(); return this;
    };
  }

  document.getElementById('matchRematch')?.addEventListener('click', rematchCurrentBattle);
  document.getElementById('matchCharacterSelect')?.addEventListener('click', returnToBattleCharacterSelect);
  document.getElementById('matchMainMenu')?.addEventListener('click', returnToMainMenuFromMatch);

  document.getElementById('pauseResume')?.addEventListener('click', () => setPaused(false));
  document.getElementById('pauseSettings')?.addEventListener('click', () => renderPauseContent('settings'));
  document.getElementById('pauseMoveList')?.addEventListener('click', () => renderPauseContent('moves'));
  document.getElementById('pauseMainMenu')?.addEventListener('click', () => { setPaused(false); showScreen('main'); });

  renderRoster(); updateSelectedPanel(state.selected); renderGallery(); renderMissions(); refreshDifficultyUI(false); applyLanguage();
})();
