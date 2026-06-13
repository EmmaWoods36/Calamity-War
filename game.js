(() => {
  'use strict';

  const screens = {
    main: document.getElementById('screen'),
    select: document.getElementById('characterScreen'),
    loadGame: document.getElementById('loadGameScreen'),
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
  const spriteSources = {
    "rai": {
        "idle": "./assets/sprites/rai/rai_idle.png",
        "light": "./assets/sprites/rai/rai_light.png",
        "heavy": "./assets/sprites/rai/rai_heavy.png",
        "special": "./assets/sprites/rai/rai_special.png",
        "guard": "./assets/sprites/rai/rai_guard.png",
        "jump": "./assets/sprites/rai/rai_jump.png",
        "hurt": "./assets/sprites/rai/rai_hurt.png",
        "ko": "./assets/sprites/rai/rai_ko.png"
    },
    "nico": {
        "idle": "./assets/sprites/nico/nico_idle.png",
        "light": "./assets/sprites/nico/nico_light.png",
        "heavy": "./assets/sprites/nico/nico_heavy.png",
        "special": "./assets/sprites/nico/nico_special.png",
        "guard": "./assets/sprites/nico/nico_guard.png",
        "jump": "./assets/sprites/nico/nico_jump.png",
        "hurt": "./assets/sprites/nico/nico_hurt.png",
        "ko": "./assets/sprites/nico/nico_ko.png"
    },
    "shanti": {
        "idle": "./assets/sprites/shanti/shanti_idle.png",
        "light": "./assets/sprites/shanti/shanti_light.png",
        "heavy": "./assets/sprites/shanti/shanti_heavy.png",
        "special": "./assets/sprites/shanti/shanti_special.png",
        "guard": "./assets/sprites/shanti/shanti_guard.png",
        "jump": "./assets/sprites/shanti/shanti_jump.png",
        "hurt": "./assets/sprites/shanti/shanti_hurt.png",
        "ko": "./assets/sprites/shanti/shanti_ko.png"
    }
};

  const spriteImages = {};
  Object.entries(spriteSources).forEach(([charId, poses]) => {
    spriteImages[charId] = {};
    Object.entries(poses).forEach(([pose, src]) => {
      const img = new Image();
      img.onload = () => { img.loaded = true; };
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
    return 'idle';
  }

  function getFighterSprite(fighter) {
    const set = spriteImages[fighter.id];
    if (!set) return null;
    const pose = fighterPose(fighter);
    return set[pose] || set.idle || null;
  }

  const state = {
    screen: 'main',
    selected: 'rai',
    battle: { mode: 'pvp-local', type: 'single', format: '1v1', p1: 'rai', p2: 'nico', p1Team: ['rai'], p2Team: ['nico'], stage: 'forest', activeSide: 'p1', activeSlot: 0 },
    stageWheelIndex: 0,
    stageSpinTimer: null,
    stageHoverTimer: null,
    readyTimer: null,
    storyIndex: 0,
    lastStoryIndex: 0,
    debug: false,
    storyAssist: true,
    storyDifficulty: 'normal',
    cpuDifficulty: 'normal',
    handicap: 'off',
    pvp: false,
    fightMode: 'story',
    lastFightItem: null,
    lastFightMode: 'story',
    fight: null,
    keys: new Set()
  };


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

  function difficultyLabel(key) {
    return (difficultySettings[key] || difficultySettings.normal).label;
  }

  function refreshDifficultyUI() {
    const storyCopy = document.getElementById('storyDifficultyText');
    const cpuCopy = document.getElementById('cpuDifficultyText');
    if (storyCopy) storyCopy.textContent = difficultySettings[state.storyDifficulty].desc;
    const storySelected = document.getElementById('storyDifficultySelected');
    if (storySelected) storySelected.textContent = `Selected: ${difficultyLabel(state.storyDifficulty)}`;
    if (cpuCopy) cpuCopy.textContent = difficultySettings[state.cpuDifficulty].desc;
    document.querySelectorAll('#storyDifficultyButtons button').forEach(btn => btn.classList.toggle('active', btn.dataset.difficulty === state.storyDifficulty));
    document.querySelectorAll('#cpuDifficultyButtons button').forEach(btn => btn.classList.toggle('active', btn.dataset.difficulty === state.cpuDifficulty));
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
    awar: { name: 'AWAR', role: 'Rebellion King', age: 12, style: 'Darkness / Gunblade', color: '#8b1c24', bio: 'A rejected prodigy and rebel leader whose defeat changes nothing about the storm coming.', stats: [86, 86, 68, 90, 84], hp: 120, speed: 4.25, power: 1.12, special: 'Perfect Counter' },
    rose: { name: 'ROSE', role: 'Double Agent', age: '??', style: 'Saber / Spycraft', color: '#179b57', bio: 'A decorated warrior and secret agent whose loyalty points where the rebellion tells it to.', stats: [76, 78, 70, 86, 72], hp: 108, speed: 4.0, power: 1.02, special: 'Silent Shield' },
    pierre: { name: 'PIERRE', role: 'Shadow Strategist', age: 13, style: 'Katana / Firearm', color: '#9d1b22', bio: 'Awar’s right hand. Tactical, cold, and always looking three moves ahead.', stats: [74, 76, 62, 94, 70], hp: 105, speed: 3.9, power: 1.0, special: 'Red Line' },
    goro: { name: 'GORO VOSS', role: 'Iron Fortress', age: 14, style: 'Earth / Club', color: '#8f2424', bio: 'A heavy assault specialist built like a wall and proud of it.', stats: [90, 42, 96, 45, 92], hp: 155, speed: 2.65, power: 1.35, special: 'Judgment' },
    mammon: { name: 'MAMMON', role: 'Iron Ram Commander', age: 34, style: 'Earth / Odachi', color: '#9a6a31', bio: 'Dante’s younger brother and commander of the Thirteen Iron Rams.', stats: [92, 46, 96, 68, 94], hp: 160, speed: 2.8, power: 1.36, special: 'Ram Breaker' },
    danpen: { name: 'DANPEN', role: 'Shadowbound Duo', age: '???', style: 'Clock / Trap', color: '#4a2577', bio: 'Locked. Two figures draped in shadow whose power is tied to Diego’s past.', stats: [95, 85, 80, 98, 98], hp: 150, speed: 4.2, power: 1.3, special: 'Clock Trap' },
    dummy: { name: 'TRAINING DUMMY', role: 'Practice Target', age: 'N/A', style: 'Training', color: '#777777', bio: 'A non-attacking practice dummy used for move timing, spacing, and special-meter testing.', stats: [0, 0, 100, 0, 0], hp: 999, speed: 0, power: 0, special: 'None' }
  };

  const roster = [
    // Core story row
    'rai', 'nico', 'shanti', 'adrian', 'malachai',
    // Badge Trials / current party row
    'rikku', 'mani', 'diego', 'akila', 'akira',
    // Ten’no / Hathor row
    'shinichi', 'yuta', 'daisuke', 'miwa', 'michelle',
    // Rebellion / Aries row
    'nikki', 'vasta', 'awar', 'rose', 'pierre',
    // Heavy hitters / bosses / special row
    'goro', 'mammon', 'dante', 'diastre', 'roger',
    // Future legacy + special row
    'handler', 'baburu', 'machai', 'mahje', 'raijin',
    'esther', 'danpen'
  ];

  const rosterGroups = {
    core: ['rai', 'nico', 'shanti', 'adrian', 'malachai'],
    badge: ['rikku', 'mani', 'diego', 'akila', 'akira', 'shinichi', 'yuta', 'daisuke'],
    hathor: ['miwa', 'michelle', 'nikki', 'vasta'],
    rebellion: ['awar', 'rose', 'pierre'],
    aries: ['goro', 'mammon', 'dante', 'baburu'],
    special: ['diastre', 'roger', 'handler', 'machai', 'mahje', 'raijin', 'esther', 'danpen']
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
    return roster.filter(id => id !== 'danpen' && characters[id]);
  }

  function randomCharacter(excludeId = null) {
    const pool = playableCharacters().filter(id => id !== excludeId);
    return randomChoice(pool.length ? pool : playableCharacters());
  }

  function randomStage() {
    return randomChoice(stageOptions).id;
  }

  function clampTeam(team, fallback='rai') {
    const cleaned = (Array.isArray(team) ? team : [fallback]).filter(id => characters[id] && id !== 'danpen');
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
      version: '0.17',
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
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    state.screen = name;
    if (name !== 'fight') stopFight();
  }

  function showStoryGameOver() {
    showScreen('gameOver');
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
      card.className = 'card' + (id === state.selected ? ' selected' : '') + (id === 'danpen' ? ' locked' : '');
      card.style.setProperty('--c', c.color);
      card.innerHTML = `<strong>${c.name}${id === 'danpen' ? '<br>LOCKED' : ''}</strong>${id === state.selected ? '<span class="p1">P1</span>' : ''}`;
      card.addEventListener('click', () => {
        if (id === 'danpen') return;
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
    if (p2Row) p2Row.querySelector('span').textContent = mode === 'pvp-local' ? 'Player 2 Fighters' : mode === 'cpu-cpu' ? 'CPU 2 Fighters' : 'CPU Fighters';
  }

  function setBattleSetupMode(mode) {
    state.battle.mode = mode;
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
    return 'BATTLE SETUP';
  }

  function defaultTeam(side, size) {
    const defaults = side === 'p2'
      ? ['akira', 'rose', 'adrian']
      : ['rai', 'nico', 'shanti'];
    const output = [];
    defaults.forEach(id => {
      if (output.length < size && characters[id] && id !== 'danpen') output.push(id);
    });
    roster.forEach(id => {
      if (output.length < size && characters[id] && id !== 'danpen' && !output.includes(id)) output.push(id);
    });
    return output.slice(0, size);
  }

  function beginBattleSetup(mode = state.battle.mode) {
    state.battle.mode = mode;
    state.battle.activeSide = 'p1';
    state.battle.activeSlot = 0;

    if (!state.battle.format) state.battle.format = state.battle.type === 'single' ? '1v1' : '2v2';
    applyBattleFormat(state.battle.format, false);

    const p1Size = Math.max(1, Math.min(3, getBattleTeam('p1').length || 1));
    const p2Size = mode === 'training' ? 1 : Math.max(1, Math.min(3, getBattleTeam('p2').length || 1));

    const p1Team = clampTeam(getBattleTeam('p1'), 'rai').slice(0, p1Size);
    const p1Defaults = defaultTeam('p1', p1Size);
    while (p1Team.length < p1Size) p1Team.push(p1Defaults[p1Team.length] || randomCharacter());
    if (state.selected && characters[state.selected] && state.selected !== 'danpen') p1Team[0] = state.selected;
    setBattleTeam('p1', p1Team);

    if (mode === 'training') {
      setBattleTeam('p2', ['dummy']);
    } else {
      const p2Team = clampTeam(getBattleTeam('p2'), 'akira').slice(0, p2Size);
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
    if (id === 'danpen') return;
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

  function renderCharacterMiniCard(id, slotLabel, side='p1') {
    const c = characters[id] || characters.rai;
    return `<div class="team-mini-card ${side}" data-character-id="${id}" data-overlay-role="team-slot" style="--fighter-color:${c.color}">
      <span class="slot-number">${slotLabel}</span>
      <span class="portrait-slot" data-overlay-role="portrait" data-asset-key="${id}_portrait"></span>
      <strong>${c.name}</strong>
      <em>${c.style}</em>
    </div>`;
  }

  function updateBattleSidePreview() {
    const panel = document.getElementById('battleP2Preview');
    const title = document.getElementById('battleSidePreviewTitle');
    const art = document.getElementById('battleSidePreviewArt');
    const strip = document.getElementById('battleSidePreviewTeam');
    if (!panel || !title || !art || !strip) return;
    const training = state.battle.mode === 'training';
    const team = training ? ['dummy'] : getBattleTeam('p2');
    const lead = team[0] || 'akira';
    const c = characters[lead] || characters.akira;
    panel.dataset.side = training ? 'dummy' : 'p2';
    panel.dataset.characterId = lead;
    panel.style.setProperty('--fighter-color', c.color);
    title.textContent = training ? 'TRAINING DUMMY' : `${state.battle.mode === 'pvp-local' ? 'P2' : 'CPU'} · ${c.name}`;
    art.className = `big-avatar overlay-fullbody-slot ${lead}`;
    art.dataset.characterId = lead;
    art.dataset.assetKey = `${lead}_full`;
    art.style.setProperty('--c', c.color);
    strip.innerHTML = team.map((id, i) => renderCharacterMiniCard(id, i + 1, 'p2')).join('');
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

    document.getElementById('battleSetupKicker').textContent = battleModeLabel(mode);
    document.getElementById('battleSetupTitle').textContent = training
      ? `Choose Training Team (${p1Team.length})`
      : (state.battle.format === '1v1' ? '1v1 Single Battle Select' : `${format} Team Battle Select`);
    document.getElementById('battleSetupCopy').textContent = training
      ? 'Pick 1–3 fighters for your practice team. The dummy stays passive. Team switching uses Q/E during training.'
      : (state.battle.format === '1v1'
        ? 'Single Battle behavior: one fighter per side, big P1/P2 preview zones, then stage wheel, ready screen, countdown, fight.'
        : 'Team Battle behavior: choose each team slot explicitly, then stage wheel, ready screen, countdown, fight.');
    document.getElementById('battleP1Name').textContent = teamNames(p1Team);
    document.getElementById('battleP2Label').textContent = training ? 'OPPONENT' : (mode === 'pvp-local' ? 'PLAYER 2 TEAM' : 'CPU / PLAYER 2 TEAM');
    document.getElementById('battleP2Name').textContent = training ? 'TRAINING DUMMY' : teamNames(p2Team);
    document.getElementById('randomP1').textContent = state.battle.type === 'single' ? 'Random P1' : 'Random P1 Slot';
    document.getElementById('randomP2').textContent = training ? 'Dummy Locked' : (state.battle.type === 'single' ? 'Random P2/CPU' : 'Random P2/CPU Slot');
    document.getElementById('randomP2').disabled = training;
    document.getElementById('randomBoth').textContent = training ? 'Random Training Team' : (state.battle.type === 'single' ? 'Random Matchup' : 'Random Both Teams');

    const battleSlots = document.querySelector('.battle-slots');
    battleSlots.innerHTML = `
      <div class="battle-format-pill">${format}</div>
      <div class="team-size-panel explicit-format-panel">
        ${renderTeamSizeButtons('p1', training ? 'Training Team Size' : 'P1 Slots')}
        ${training ? '' : renderTeamSizeButtons('p2', mode === 'pvp-local' ? 'P2 Slots' : 'CPU/P2 Slots')}
      </div>
      <div class="team-slots-wrap overlay-ready-slots" data-overlay-role="selection-slots">
        ${renderTeamSlots('p1', 'P1')}
        ${training ? '<div class="team-slot-group dummy-group"><h3>Dummy</h3><button type="button" class="slot-card team-slot" disabled><span>TRAINING TARGET</span><strong>TRAINING DUMMY</strong></button></div>' : renderTeamSlots('p2', mode === 'pvp-local' ? 'P2' : 'CPU')}
      </div>`;

    battleSlots.querySelectorAll('[data-team-size]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (state.battle.format !== 'custom' && mode !== 'training') return;
        setTeamSize(btn.dataset.teamSize, btn.dataset.size);
      });
    });
    battleSlots.querySelectorAll('[data-team-slot]').forEach(btn => {
      btn.addEventListener('click', () => setBattleSide(btn.dataset.teamSlot, btn.dataset.slot));
    });

    const activeId = activeBattleId();
    const activeLabel = state.battle.activeSide === 'p1' ? 'PLAYER 1' : (mode === 'pvp-local' ? 'PLAYER 2' : 'CPU');
    document.getElementById('battleRosterTitle').textContent = training
      ? `PICK TRAINING FIGHTER ${state.battle.activeSlot + 1}`
      : (state.battle.format === '1v1'
        ? `PICK ${activeLabel}`
        : `PICK ${activeLabel} SLOT ${state.battle.activeSlot + 1}`);

    const grid = document.getElementById('battleRosterGrid');
    grid.innerHTML = '';
    grid.appendChild(makeRandomCard(state.battle.type === 'single' ? 'RANDOM' : 'RANDOM SLOT', () => randomizeBattleCharacter(state.battle.activeSide)));
    roster.forEach((id, rosterIndex) => {
      const c = characters[id];
      if (!c) return;
      const p1Slot = p1Team.indexOf(id);
      const p2Slot = p2Team.indexOf(id);
      const selected = id === activeId;
      const locked = id === 'danpen';
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
      card.dataset.characterId = id;
      card.dataset.rosterIndex = String(rosterIndex + 1);
      card.dataset.assetKey = `${id}_portrait`;
      const badges = `${p1Slot >= 0 ? `<span class="slot-badge p1-badge">P1-${p1Slot + 1}</span>` : ''}${p2Slot >= 0 ? `<span class="slot-badge p2-badge">P2-${p2Slot + 1}</span>` : ''}${selected ? '<span class="p1 active-slot">ACTIVE</span>' : ''}`;
      card.innerHTML = `<span class="portrait-slot" data-overlay-role="portrait"></span><strong>${c.name}${locked ? '<br>LOCKED' : ''}</strong>${badges}`;
      card.addEventListener('click', () => setBattleCharacter(id));
      grid.appendChild(card);
    });

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
    document.getElementById('chosenStageReadout').textContent = spinning ? `AI shuffling: ${selectedStage.name}` : `Selected: ${selectedStage.name}`;

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
        card.style.setProperty('--offset', offset);
        card.style.setProperty('--tx', `${offset * 235}px`);
        card.style.setProperty('--ty', `${absOffset * 30}px`);
        card.style.setProperty('--scale', Math.max(0.70, 1 - absOffset * 0.10).toFixed(2));
        card.style.setProperty('--rot', `${offset * 7}deg`);
        card.style.setProperty('--opacity', Math.max(0, 1 - absOffset * 0.22).toFixed(2));
        card.style.setProperty('--z', String(10 - absOffset));
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
    const title = mode === 'training' ? 'Training Mode' : mode === 'pvp-local' ? `Battle Mode ${p1Team.length}v${p2Team.length}` : mode === 'pvp-ai' ? `Battle Mode vs CPU ${p1Team.length}v${p2Team.length}` : `CPU vs CPU ${p1Team.length}v${p2Team.length}`;
    const chapter = mode === 'training' ? 'TRAINING MODE' : mode === 'cpu-cpu' ? 'BATTLE WATCH MODE' : 'BATTLE MODE';
    const intro = mode === 'training'
      ? `Practice with ${teamNames(p1Team)} at ${stageLabel(state.battle.stage)}. Infinite health, full meter, dummy opponent. Press Q/E to switch teammates; R resets.`
      : `${teamNames(p1Team)} vs ${teamNames(p2Team)} at ${stageLabel(state.battle.stage)}.${mode === 'pvp-local' ? ' Local battle.' : ' CPU difficulty: ' + difficultyLabel(state.cpuDifficulty) + '.'}`;
    startFight({ stage: state.battle.stage, player: p1Team[0], enemy: p2Team[0], team1: p1Team, team2: p2Team, title, chapter, intro }, mode);
  }

  function startReadyCountdown() {
    clearReadyCountdown();
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
    if (p2Header) p2Header.textContent = mode === 'training' ? 'TRAINING DUMMY' : (mode === 'pvp-local' ? 'PLAYER 2' : mode === 'cpu-cpu' ? 'CPU 2' : 'CPU');
    renderReadyTeam('readyP1Team', p1Team, 'p1');
    renderReadyTeam('readyP2Team', p2Team, 'p2');
    showScreen('ready');
    startReadyCountdown();
  }

  function startConfiguredBattle() {
    showReadyScreen();
  }

  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'story') { refreshDifficultyUI(); showScreen('storySetup'); }
      if (action === 'load-game') { renderSaveSlots(); showScreen('loadGame'); }
      if (action === 'story-start') openStory(0);
      if (action === 'story-missions') { renderMissions(); showScreen('mission'); }
      if (action === 'pvp') { refreshDifficultyUI(); renderBattleModeSetup(); showScreen('pvp'); }
      if (action === 'pvp-player') beginBattleSetup('pvp-local');
      if (action === 'pvp-ai') beginBattleSetup('pvp-ai');
      if (action === 'pvp-cpu-cpu') beginBattleSetup('cpu-cpu');
      if (action === 'training') { state.battle.type = 'team'; state.battle.format = 'custom'; setTeamSize('p1', 1, false); setBattleTeam('p2', ['dummy']); beginBattleSetup('training'); }
      if (action === 'battle-back') { if (state.battle.mode === 'training') showScreen('main'); else { renderBattleModeSetup(); showScreen('pvp'); } }
      if (action === 'battle-characters') { renderBattleCharacters(); showScreen('battleCharacters'); }
      if (action === 'battle-open-select') beginBattleSetup(state.battle.mode);
      if (action === 'select') { renderRoster(); updateSelectedPanel(state.selected); showScreen('select'); }
      if (action === 'gallery') { renderGallery(); showScreen('gallery'); }
      if (action === 'options') showScreen('options');
      if (action === 'stage-back') { renderStageSelect(); showScreen('stageSelect'); }
      if (action === 'back') showScreen('main');
    });
  });
  document.querySelectorAll('#battleModeButtons [data-battle-mode]').forEach(btn => btn.addEventListener('click', () => setBattleSetupMode(btn.dataset.battleMode)));
  document.querySelectorAll('#battleFormatButtons [data-battle-format]').forEach(btn => btn.addEventListener('click', () => setBattleFormat(btn.dataset.battleFormat)));
  document.querySelectorAll('[data-setup-size]').forEach(btn => btn.addEventListener('click', () => setSetupSize(btn.dataset.setupSize, btn.dataset.size)));
  document.getElementById('randomP1').addEventListener('click', () => randomizeBattleCharacter('p1'));
  document.getElementById('randomP2').addEventListener('click', () => randomizeBattleCharacter('p2'));
  document.getElementById('randomBoth').addEventListener('click', randomizeBattleBoth);
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
  const handicapSelect = document.getElementById('handicapSelect');
  if (handicapSelect) handicapSelect.addEventListener('change', e => { state.handicap = e.target.value; });
  document.querySelectorAll('#storyDifficultyButtons button').forEach(btn => btn.addEventListener('click', () => { state.storyDifficulty = btn.dataset.difficulty; refreshDifficultyUI(); }));
  document.querySelectorAll('#cpuDifficultyButtons button').forEach(btn => btn.addEventListener('click', () => { state.cpuDifficulty = btn.dataset.difficulty; refreshDifficultyUI(); }));

  window.addEventListener('keydown', e => {
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
    if (key === 'enter' && state.screen === 'main') { refreshDifficultyUI(); showScreen('storySetup'); }
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
      if (jump && this.onGround && !this.guard) { this.vy = -12.5; this.onGround = false; }
      if (light) this.attack('light');
      if (heavy) this.attack('heavy');
      if (special) this.attack('special');
    }
    attack(kind) {
      if (this.attackTimer > 0 || this.dead) return;
      if (kind === 'special' && this.meter < 32) return;
      this.attackKind = kind;
      this.attackTimer = kind === 'light' ? 14 : kind === 'heavy' ? 23 : 31;
      if (kind === 'special') this.meter -= 32;
    }
    update(enemy) {
      this.input(enemy);
      this.x += this.vx;
      this.y += this.vy;
      if (!this.onGround) this.vy += .75;
      if (this.y >= floorY) { this.y = floorY; this.vy = 0; this.onGround = true; }
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
        enemy.hp = Math.max(0, enemy.hp - dmg);
        enemy.hitCooldown = enemy.guard ? 10 : 18;
        enemy.vx = this.facing * (enemy.guard ? 4 : 9);
        if (!enemy.guard) enemy.vy = this.attackKind === 'heavy' ? -3.8 : -2.2;
        this.meter = Math.min(this.maxMeter, this.meter + (this.attackKind === 'special' ? 7 : 12));
        enemy.comboFlash = 10;
        if (enemy.hp <= 0) enemy.dead = true;
      }
    }
    draw() {
      const r = this.rect();
      const sprite = getFighterSprite(this);
      if (sprite && sprite.complete && sprite.naturalWidth) {
        ctx.save();
        if (this.comboFlash > 0) { ctx.shadowColor = '#fff'; ctx.shadowBlur = 24; }
        ctx.fillStyle = 'rgba(0,0,0,.45)';
        ctx.beginPath(); ctx.ellipse(this.x + this.w/2, floorY+8, 52, 12, 0, 0, Math.PI*2); ctx.fill();

        const imgW = sprite.naturalWidth || 900;
        const imgH = sprite.naturalHeight || 900;
        const pose = fighterPose(this);
        const baseScale = pose === 'ko' ? 0.25 : (pose === 'heavy' || pose === 'special' ? 0.265 : 0.245);
        const drawW = imgW * baseScale;
        const drawH = imgH * baseScale;
        const spriteGround = pose === 'ko' ? 760 : 820;
        const centerX = this.x + this.w / 2;
        const topY = floorY - spriteGround * baseScale;
        ctx.translate(centerX, 0);
        ctx.scale(this.facing >= 0 ? 1 : -1, 1);
        ctx.drawImage(sprite, -drawW / 2, topY, drawW, drawH);

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

  function updateFightNames() {
    const f = state.fight;
    if (!f) return;
    document.getElementById('p1Name').textContent = teamStatus(f.team1, f.p1Index);
    document.getElementById('p2Name').textContent = teamStatus(f.team2, f.p2Index);
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

  function startFight(item, mode='story') {
    const fightMode = mode === true ? 'pvp-local' : (mode || 'story');
    const isPvPLocal = fightMode === 'pvp-local';
    const isPvPAI = fightMode === 'pvp-ai';
    const isTraining = fightMode === 'training';
    const isCpuCpu = fightMode === 'cpu-cpu';
    const isStory = fightMode === 'story';

    state.pvp = isPvPLocal;
    state.fightMode = fightMode;
    state.lastFightItem = { ...item, team1: item.team1 ? item.team1.slice() : undefined, team2: item.team2 ? item.team2.slice() : undefined };
    state.lastFightMode = fightMode;
    if (isStory) state.lastStoryIndex = state.storyIndex;

    const p1Ids = clampTeam(item.team1 || [((isPvPLocal || isPvPAI || isTraining || isCpuCpu) ? (item.player || state.selected) : item.player)], item.player || 'rai');
    const p2Ids = isTraining ? ['dummy'] : clampTeam(item.team2 || [((isPvPLocal || isPvPAI || isCpuCpu) ? (item.enemy || state.battle.p2 || 'nico') : item.enemy)], item.enemy || 'nico');
    const activeDifficulty = isStory ? state.storyDifficulty : (isPvPAI || isCpuCpu ? state.cpuDifficulty : 'normal');
    const diff = difficultySettings[activeDifficulty] || difficultySettings.normal;

    const team1 = p1Ids.map((id, idx) => new Fighter(id, idx === 0 ? 175 : 125, 1, { left:'a', right:'d', jump:'w', light:'j', heavy:'k', special:'l', guard:'s' }, isCpuCpu));
    const team2 = p2Ids.map((id, idx) => new Fighter(id, idx === 0 ? 720 : 770, -1, { left:'arrowleft', right:'arrowright', jump:'arrowup', light:'1', heavy:'2', special:'3', guard:'arrowdown' }, isStory || isPvPAI || isCpuCpu ? true : false));

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
    if (isStory || isPvPAI) {
      team2.forEach(f => { f.maxHp = Math.round(f.maxHp * diff.enemyHp); f.hp = f.maxHp; });
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
      timer: 0, over: false, pvp: isPvPLocal, mode: fightMode, training: isTraining, difficulty: activeDifficulty
    };
    updateFightNames();
    document.getElementById('roundInfo').textContent = item.title || 'FIGHT';
    document.getElementById('p2Hint').style.display = isPvPLocal ? 'inline' : 'none';
    const modeHint = document.getElementById('modeHint');
    if (modeHint) {
      modeHint.textContent = isTraining ? 'TRAINING TEAM: Q/E switch · infinite health/meter · R reset' : isCpuCpu ? `CPU vs CPU team watch. Difficulty: ${difficultyLabel(activeDifficulty)} · R rematch` : isPvPAI ? `CPU team: ${difficultyLabel(activeDifficulty)} · Q/E switch · R rematch` : isPvPLocal ? 'LOCAL TEAM BATTLE: P1 Q/E tag · P2 0 tag · R rematch' : isStory ? `STORY: ${difficultyLabel(activeDifficulty)}` : '';
      modeHint.style.display = modeHint.textContent ? 'inline' : 'none';
    }
    showScreen('fight');
    flashMessage(`${item.chapter || state.fight.chapter}\n${item.intro || item.title || 'Ready?'}`, isTraining ? 2500 : 2000);
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

  function stageImage(stage) {
    return images[stage] || images.forest;
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
    document.getElementById('p1Health').style.width = `${Math.max(0, p1.hp / p1.maxHp * 100)}%`;
    document.getElementById('p2Health').style.width = `${Math.max(0, p2.hp / p2.maxHp * 100)}%`;
    document.getElementById('p1Meter').style.width = `${Math.max(0, p1.meter / p1.maxMeter * 100)}%`;
    document.getElementById('p2Meter').style.width = `${Math.max(0, p2.meter / p2.maxMeter * 100)}%`;
  }

  function loop() {
    const f = state.fight;
    if (!f) return;
    f.timer++;
    drawBackground(f.stage);
    if (!f.over) {
      f.p1.update(f.p2); f.p2.update(f.p1);
      if (f.training) {
        f.team1.forEach(ch => { ch.dead = false; ch.hp = ch.maxHp; ch.meter = ch.maxMeter; });
        f.team2.forEach(ch => { ch.dead = false; ch.hp = ch.maxHp; ch.meter = 0; });
      } else {
        if (f.p1.dead && livingTeamCount(f.team1) > 0) switchActive('p1', 1, true);
        if (f.p2.dead && livingTeamCount(f.team2) > 0) switchActive('p2', 1, true);
        if (livingTeamCount(f.team1) <= 0 || livingTeamCount(f.team2) <= 0) {
          f.over = true;
          const isStory = f.mode === 'story';
          const p1Won = livingTeamCount(f.team2) <= 0;
          if (p1Won) {
            flashMessage(`${f.team1[0].name}'S TEAM WINS\n${isStory ? 'Continuing story...' : 'Press R to rematch or ESC for menu'}`, 1800);
            if (isStory) setTimeout(() => { state.storyIndex += 1; openStory(state.storyIndex); }, 1900);
          } else {
            flashMessage(`${f.team2[0].name}'S TEAM WINS\nPress R to retry or ESC for menu`, 2500);
          }
        }
      }
    }
    f.p1.draw(); f.p2.draw(); updateHud();
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(12, H-104, 560, 38);
    ctx.fillStyle = '#f2eee6'; ctx.font = '14px Trebuchet MS';
    const modeText = f.training ? 'Training team: infinite health/meter. Q/E switches P1 teammates. Press R to reset spacing.' : f.mode === 'cpu-cpu' ? `CPU vs CPU team watch. Difficulty: ${difficultyLabel(f.difficulty)}. Press R for a rematch.` : f.mode === 'pvp-ai' ? `PvP team vs CPU. Difficulty: ${difficultyLabel(f.difficulty)}. Q/E switches P1. Press R for a rematch.` : f.pvp ? 'Local team PvP: P1 Q/E tag, P2 0 tag. Press R for a rematch.' : `Story battle. Difficulty: ${difficultyLabel(f.difficulty)}. Defeat the opponent to advance.`;
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
    if (key === 'r' && state.lastFightItem) {
      startFight(state.lastFightItem, state.lastFightMode);
    }
    if (!e.repeat && (key === 'q' || key === 'e') && state.fight) {
      switchActive('p1', key === 'q' ? -1 : 1);
    }
    if (!e.repeat && key === '0' && state.fight && state.fight.pvp) {
      switchActive('p2', 1);
    }
  });

  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r){
      r = Math.min(r,w/2,h/2); this.beginPath(); this.moveTo(x+r,y); this.arcTo(x+w,y,x+w,y+h,r); this.arcTo(x+w,y+h,x,y+h,r); this.arcTo(x,y+h,x,y,r); this.arcTo(x,y,x+w,y,r); this.closePath(); return this;
    };
  }

  renderRoster(); updateSelectedPanel(state.selected); renderGallery(); renderMissions(); refreshDifficultyUI();
})();
