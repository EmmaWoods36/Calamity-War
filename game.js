(() => {
  'use strict';

  const screens = {
    main: document.getElementById('screen'),
    select: document.getElementById('characterScreen'),
    pvp: document.getElementById('pvpScreen'),
    storySetup: document.getElementById('storySetupScreen'),
    story: document.getElementById('storyScreen'),
    fight: document.getElementById('fightScreen'),
    gallery: document.getElementById('galleryScreen'),
    options: document.getElementById('optionsScreen')
  };

  const assets = {
    main: './assets/main_menu.jpg',
    select: './assets/character_select.jpg',
    dojo: './assets/bg_dojo_ruins.jpg',
    forest: './assets/bg_forest.jpg',
    courtyard: './assets/bg_fortress_courtyard.jpg',
    hall: './assets/bg_fortress_hall.jpg'
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

  const state = {
    screen: 'main',
    selected: 'rai',
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
    if (cpuCopy) cpuCopy.textContent = difficultySettings[state.cpuDifficulty].desc;
    document.querySelectorAll('#storyDifficultyButtons button').forEach(btn => btn.classList.toggle('active', btn.dataset.difficulty === state.storyDifficulty));
    document.querySelectorAll('#cpuDifficultyButtons button').forEach(btn => btn.classList.toggle('active', btn.dataset.difficulty === state.cpuDifficulty));
  }

  const characters = {
    rai: { name: 'RAI', role: 'Main Protagonist', age: 12, style: 'Sword / Warrior', color: '#d2202f', bio: 'A young warrior chasing proof, purpose, and a recommendation letter. Fast learner, reckless heart, impossible will.', stats: [78, 84, 58, 66, 72], hp: 110, speed: 4.2, power: 1.0, special: 'Kan Burst' },
    shanti: { name: 'SHANTI', role: 'Forceful Guardian', age: 15, style: 'Pink Kan / Guardian', color: '#ff3aa5', bio: 'Sharp-tongued and fiercely protective. Her pink energy excels at pressure, reversals, and crowd control.', stats: [74, 78, 62, 76, 86], hp: 105, speed: 4.0, power: 1.06, special: 'Force Pulse' },
    nico: { name: 'NICO', role: 'A-Class Mercenary', age: 12, style: 'Dual Blades', color: '#1689ff', bio: 'An A-Class mercenary on the same disappearance case. Aggressive, suspicious, and built for speed.', stats: [80, 90, 54, 82, 69], hp: 105, speed: 4.7, power: 1.03, special: 'Twin Arc' },
    adrian: { name: 'ADRIAN', role: 'Shadow Warrior', age: 21, style: 'Shadow Blade', color: '#7e43ff', bio: 'Disciplined master and mission gatekeeper. Calm, surgical, and impossible to read.', stats: [83, 72, 70, 93, 81], hp: 125, speed: 3.8, power: 1.12, special: 'Shadow Step' },
    malachai: { name: 'MALACHAI', role: 'Protector', age: 36, style: 'Sword / Guardian', color: '#d9bc7b', bio: 'A warrior, protector, and hero whose shadow hangs over Rai’s path.', stats: [92, 65, 86, 80, 90], hp: 140, speed: 3.4, power: 1.25, special: 'Heroic Cleave' },
    roger: { name: 'ROGER', role: 'Fortress Bruiser', age: '??', style: 'Heavy Brawler', color: '#b87333', bio: 'A smug fortress enforcer guarding the prisoner wing.', stats: [82, 48, 82, 44, 70], hp: 130, speed: 2.9, power: 1.18, special: 'Wall Breaker' },
    handler: { name: 'HANDLER', role: 'Fortress Elite', age: '??', style: 'Shadow Control', color: '#111111', bio: 'A higher-ranking enemy linked to the fortress operation and the captives.', stats: [76, 66, 70, 88, 92], hp: 125, speed: 3.7, power: 1.12, special: 'Black Tendril' },
    ambusher: { name: 'AMBUSHER', role: 'Masked Soldier', age: '??', style: 'Blade Mob', color: '#34343b', bio: 'Rank-and-file masked enemy.', stats: [48, 42, 40, 32, 25], hp: 80, speed: 2.8, power: .82, special: 'Rush Slash' },
    guard: { name: 'FORTRESS GUARD', role: 'Fortress Soldier', age: '??', style: 'Blade Guard', color: '#3f424d', bio: 'A stronger fortress soldier.', stats: [55, 46, 52, 44, 35], hp: 90, speed: 3.1, power: .9, special: 'Counter Slash' },
    dummy: { name: 'TRAINING DUMMY', role: 'Practice Target', age: 'N/A', style: 'Training', color: '#777777', bio: 'A non-attacking practice dummy used for move timing, spacing, and special-meter testing.', stats: [0, 0, 100, 0, 0], hp: 999, speed: 0, power: 0, special: 'None' }
  };

  const roster = [
    'rai', 'nico', 'shanti', 'adrian', 'malachai',
    'ambusher', 'guard', 'roger', 'handler', 'mammon',
    'akira', 'shinichi', 'daisuke', 'miwa', 'michelle',
    'rose', 'pierre', 'goro', 'diastre', 'danpen'
  ];
  const extraMeta = {
    mammon: ['MAMMON', '#9a6a31', 'Earth Tank'], akira: ['AKIRA', '#59a7ff', 'Kickboxing Champion'],
    shinichi: ['SHINICHI', '#a98cff', 'Iaido Precision'], daisuke: ['DAISUKE', '#c0a06a', 'Close-Range Swordsman'],
    miwa: ['MIWA', '#2d5edb', 'Saber Duelist'], michelle: ['MICHELLE', '#2ec471', 'Close-Combat Rogue'],
    rose: ['ROSE', '#179b57', 'Double Agent'], pierre: ['PIERRE', '#9d1b22', 'Shadow Strategist'],
    goro: ['GORO VOSS', '#8f2424', 'Iron Fortress'], diastre: ['DIASTRE', '#ff1d24', 'Fear Monger'],
    danpen: ['DANPEN', '#4a2577', 'LOCKED']
  };
  Object.entries(extraMeta).forEach(([id, v]) => {
    if (!characters[id]) characters[id] = { name: v[0], role: v[2], age: '??', style: v[2], color: v[1], bio: 'Roster placeholder for the expanded build. Moveset will be filled after the next manga / profile batch.', stats: [60,60,60,60,60], hp: 100, speed: 3.4, power: 1, special: 'Coming Soon' };
  });

  const story = [
    { type: 'scene', bg: 'dojo', chapter: 'CHAPTER 1', title: 'The Explosion', text: 'Rai’s Kan tears through Malachai Manor. Adrian arrives after the blast, carrying a boy who refuses to admit he has pushed too far.', line: 'Adrian: “Strength is not readiness. Not yet.”' },
    { type: 'scene', bg: 'dojo', chapter: 'CHAPTER 1', title: 'The Deal', text: 'Rai wants a recommendation letter. Adrian offers a mission instead: investigate disappearances near Honsu Village and prove he can survive outside the training grounds.', line: 'Rai: “So if I complete this… you’ll write the letter?”' },
    { type: 'fight', stage: 'forest', player: 'rai', enemy: 'ambusher', title: 'Forest Ambush', chapter: 'CHAPTER 1', intro: 'Rai and Shanti are stopped by masked fighters on the road. First lesson: survive the ambush.' },
    { type: 'scene', bg: 'forest', chapter: 'CHAPTER 2', title: 'Split in the Woods', text: 'The ambush scatters the team. Shanti pushes ahead, while Rai realizes the forest has more enemies than it should.', line: 'Rai: “Shan? Shanti? Where’d you go?”' },
    { type: 'fight', stage: 'forest', player: 'shanti', enemy: 'guard', title: 'Shanti Alone', chapter: 'CHAPTER 2', intro: 'Shanti is cornered. Hold the line long enough for her Kan to flare.' },
    { type: 'fight', stage: 'forest', player: 'rai', enemy: 'nico', title: 'A-Class Mercenary', chapter: 'CHAPTER 3', intro: 'Rai collides with Nico, an A-Class mercenary hunting the same kidnappers. Neither trusts the other.' },
    { type: 'scene', bg: 'forest', chapter: 'CHAPTER 3', title: 'For Now', text: 'The misunderstanding clears. Nico is tracking kidnappings, too. The boys agree to work together, but trust is still thin.', line: 'Nico: “Truce?”  Rai: “For now.”' },
    { type: 'fight', stage: 'courtyard', player: 'rai', enemy: 'guard', title: 'Curious Fortress', chapter: 'CHAPTER 4', intro: 'A shadow gate spits Rai into the fortress courtyard. The guards surround him. He smiles anyway.' },
    { type: 'fight', stage: 'hall', player: 'nico', enemy: 'roger', title: 'Prisoner Wing', chapter: 'CHAPTER 5', intro: 'Nico follows a sound through the purple-lit hall and finds the prisoner wing. Roger blocks the way.' },
    { type: 'fight', stage: 'hall', player: 'rai', enemy: 'handler', title: 'The Mysterious Girl', chapter: 'CHAPTER 6', intro: 'Rai follows the voice deeper inside. A captive girl reaches for him — and the fortress handler appears.' },
    { type: 'scene', bg: 'hall', chapter: 'DEMO CLEAR', title: 'To Be Continued', text: 'The rescue mission is now bigger than a recommendation letter. Add the next manga panels and backgrounds to continue the arc.', line: 'Next build target: fortress escape, mysterious girl reveal, and boss escalation.' }
  ];

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    state.screen = name;
    if (name !== 'fight') stopFight();
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
  function renderRoster() {
    rosterGrid.innerHTML = '';
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

  function renderGallery() {
    const stages = [
      ['Malachai Manor Ruins', assets.dojo],
      ['Moonlit Forest Path', assets.forest],
      ['Fortress Courtyard', assets.courtyard],
      ['Purple Torch Hall', assets.hall]
    ];
    document.getElementById('stageGallery').innerHTML = stages.map(([name, src]) => `<div class="stage-card" style="background-image:url('${src}')"><span>${name}</span></div>`).join('');
  }

  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'story') { refreshDifficultyUI(); showScreen('storySetup'); }
      if (action === 'story-start') openStory(0);
      if (action === 'pvp') { refreshDifficultyUI(); showScreen('pvp'); }
      if (action === 'pvp-player') startFight({ stage: 'forest', player: state.selected, enemy: 'nico', title: 'PvP: Local Versus', chapter: 'PVP MODE', intro: 'Player 1 versus Player 2. Best sibling/controller chaos rules.' }, 'pvp-local');
      if (action === 'pvp-ai') startFight({ stage: 'forest', player: state.selected, enemy: 'nico', title: 'PvP: Versus CPU', chapter: 'PVP MODE', intro: `Fight a CPU-controlled rival. CPU difficulty: ${difficultyLabel(state.cpuDifficulty)}.` }, 'pvp-ai');
      if (action === 'pvp-cpu-cpu') startFight({ stage: 'forest', player: state.selected, enemy: 'nico', title: 'CPU vs CPU', chapter: 'PVP WATCH MODE', intro: `Watch two CPU fighters battle. CPU difficulty: ${difficultyLabel(state.cpuDifficulty)}.` }, 'cpu-cpu');
      if (action === 'training') startFight({ stage: 'forest', player: state.selected, enemy: 'dummy', title: 'Training Mode', chapter: 'TRAINING MODE', intro: 'Practice movement, spacing, attacks, guard timing, and specials. Press R to reset.' }, 'training');
      if (action === 'select') { renderRoster(); updateSelectedPanel(state.selected); showScreen('select'); }
      if (action === 'gallery') { renderGallery(); showScreen('gallery'); }
      if (action === 'options') showScreen('options');
      if (action === 'back') showScreen('main');
    });
  });
  document.getElementById('continueStory').addEventListener('click', continueStory);
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
    if (key === 'enter' && state.screen === 'main') { refreshDifficultyUI(); showScreen('storySetup'); }
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

  function applyHandicap(p1, p2) {
    if (state.handicap === 'p1-plus') applyHpScale(p1, 1.25);
    if (state.handicap === 'p2-plus') applyHpScale(p2, 1.25);
    if (state.handicap === 'p1-minus') applyHpScale(p1, .75);
    if (state.handicap === 'p2-minus') applyHpScale(p2, .75);
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
    state.lastFightItem = { ...item };
    state.lastFightMode = fightMode;

    const playerId = (isPvPLocal || isPvPAI || isTraining) ? state.selected : item.player;
    const enemyId = isTraining ? 'dummy' : ((isPvPLocal || isPvPAI) ? (item.enemy || 'nico') : item.enemy);
    const p1 = new Fighter(playerId, 175, 1, { left:'a', right:'d', jump:'w', light:'j', heavy:'k', special:'l', guard:'s' }, isCpuCpu);
    const p2 = new Fighter(enemyId, 720, -1, { left:'arrowleft', right:'arrowright', jump:'arrowup', light:'1', heavy:'2', special:'3', guard:'arrowdown' }, isStory || isPvPAI || isCpuCpu ? true : false);

    const activeDifficulty = isStory ? state.storyDifficulty : (isPvPAI || isCpuCpu ? state.cpuDifficulty : 'normal');
    const diff = difficultySettings[activeDifficulty] || difficultySettings.normal;
    [p1, p2].forEach(f => {
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
      p2.maxHp = Math.round(p2.maxHp * diff.enemyHp);
      p2.hp = p2.maxHp;
    }
    if (isCpuCpu) {
      p1.maxHp = Math.round(p1.maxHp * diff.enemyHp);
      p2.maxHp = Math.round(p2.maxHp * diff.enemyHp);
      p1.hp = p1.maxHp;
      p2.hp = p2.maxHp;
    }

    applyHandicap(p1, p2);

    if (isTraining) {
      p1.meter = p1.maxMeter;
      p2.hp = p2.maxHp;
      p2.meter = 0;
    }
    state.fight = { p1, p2, stage: item.stage || 'forest', title: item.title || 'Fight', chapter: item.chapter || (isPvPLocal || isPvPAI || isCpuCpu ? 'PVP MODE' : isTraining ? 'TRAINING MODE' : 'STORY FIGHT'), timer: 0, over: false, pvp: isPvPLocal, mode: fightMode, training: isTraining, difficulty: activeDifficulty };
    document.getElementById('p1Name').textContent = p1.name;
    document.getElementById('p2Name').textContent = p2.name;
    document.getElementById('roundInfo').textContent = item.title || 'FIGHT';
    document.getElementById('p2Hint').style.display = isPvPLocal ? 'inline' : 'none';
    const modeHint = document.getElementById('modeHint');
    if (modeHint) {
      modeHint.textContent = isTraining ? 'TRAINING: infinite health/meter · R reset' : isCpuCpu ? `CPU vs CPU: ${difficultyLabel(activeDifficulty)} · R rematch` : isPvPAI ? `CPU: ${difficultyLabel(activeDifficulty)} · R rematch` : isPvPLocal ? 'LOCAL VERSUS: R rematch' : isStory ? `STORY: ${difficultyLabel(activeDifficulty)}` : '';
      modeHint.style.display = modeHint.textContent ? 'inline' : 'none';
    }
    showScreen('fight');
    flashMessage(`${item.chapter || state.fight.chapter}
${item.intro || item.title || 'Ready?'}`, isTraining ? 2200 : 1800);
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
        f.p1.dead = false; f.p2.dead = false;
        f.p1.hp = f.p1.maxHp; f.p2.hp = f.p2.maxHp;
        f.p1.meter = f.p1.maxMeter;
      } else if (f.p1.dead || f.p2.dead) {
        f.over = true;
        const isStory = f.mode === 'story';
        if (f.p2.dead) {
          flashMessage(`${f.p1.name} WINS\n${isStory ? 'Continuing story...' : 'Press R to rematch or ESC for menu'}`, 1800);
          if (isStory) setTimeout(() => { state.storyIndex += 1; openStory(state.storyIndex); }, 1900);
        } else {
          flashMessage(`${f.p2.name} WINS\nPress R to retry or ESC for menu`, 2500);
        }
      }
    }
    f.p1.draw(); f.p2.draw(); updateHud();
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(12, H-95, 460, 28);
    ctx.fillStyle = '#f2eee6'; ctx.font = '14px Trebuchet MS';
    const modeText = f.training ? 'Training mode: infinite health and meter. Press R to reset spacing.' : f.mode === 'cpu-cpu' ? `CPU vs CPU watch mode. Difficulty: ${difficultyLabel(f.difficulty)}. Press R for a rematch.` : f.mode === 'pvp-ai' ? `PvP vs CPU. Difficulty: ${difficultyLabel(f.difficulty)}. Press R for a rematch.` : f.pvp ? 'Local PvP: Player 1 versus Player 2. Press R for a rematch.' : `Story battle. Difficulty: ${difficultyLabel(f.difficulty)}. Defeat the opponent to advance.`;
    ctx.fillText(modeText, 22, H-76);
    if (state.storyAssist && f.mode === 'story') {
      ctx.fillStyle = 'rgba(210,33,47,.75)'; ctx.fillText('TIP: Build meter with J/K. Use L for special when the blue meter is ready.', 22, H-55);
    }
    if (f.training) {
      ctx.fillStyle = 'rgba(61,162,255,.82)'; ctx.fillText('TRAINING TIP: Try light → heavy → special. The dummy will not fight back.', 22, H-55);
    }
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'r' && state.screen === 'fight' && state.lastFightItem) {
      startFight(state.lastFightItem, state.lastFightMode);
    }
  });

  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r){
      r = Math.min(r,w/2,h/2); this.beginPath(); this.moveTo(x+r,y); this.arcTo(x+w,y,x+w,y+h,r); this.arcTo(x+w,y+h,x,y+h,r); this.arcTo(x,y+h,x,y,r); this.arcTo(x,y,x+w,y,r); this.closePath(); return this;
    };
  }

  renderRoster(); updateSelectedPanel(state.selected); renderGallery(); refreshDifficultyUI();
})();
