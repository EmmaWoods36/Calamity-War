// Calamity War data snapshot exported for future modular refactor.
// The playable runtime currently uses root game.js.

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

