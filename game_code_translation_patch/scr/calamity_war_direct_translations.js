// ================================================================
// CALAMITY WAR — DIRECT TRANSLATIONS BUILT INTO GAME CODE
// English / Español / 日本語
// ---------------------------------------------------------------
// This is intentionally NOT an external localization JSON file.
// The translation text lives directly in JavaScript so the game can
// switch languages without fetching any extra translation assets.
// ================================================================

(function () {
  "use strict";

  const CW_LANGUAGES = {
    en: { code: "en", label: "English", htmlLang: "en" },
    es: { code: "es", label: "Español", htmlLang: "es" },
    ja: { code: "ja", label: "日本語", htmlLang: "ja" }
  };

  const CW_DEFAULT_LANGUAGE = "en";
  let cwCurrentLanguage = localStorage.getItem("calamityWarLanguage") || CW_DEFAULT_LANGUAGE;
  if (!CW_LANGUAGES[cwCurrentLanguage]) cwCurrentLanguage = CW_DEFAULT_LANGUAGE;

  const CW_TEXT = {
    en: {
      // ==========================================================
      // GENERAL / SYSTEM
      // ==========================================================
      "game.title": "Calamity War",
      "game.subtitle": "Choose your fighter. Survive the calamity.",
      "common.back": "Back",
      "common.next": "Next",
      "common.continue": "Continue",
      "common.confirm": "Confirm",
      "common.cancel": "Cancel",
      "common.close": "Close",
      "common.select": "Select",
      "common.selected": "Selected",
      "common.ready": "Ready",
      "common.start": "Start",
      "common.loading": "Loading...",
      "common.on": "On",
      "common.off": "Off",
      "common.yes": "Yes",
      "common.no": "No",
      "common.locked": "Locked",
      "common.unlocked": "Unlocked",
      "common.comingSoon": "Coming Soon",
      "common.random": "Random",
      "common.none": "None",
      "common.pause": "Pause",
      "common.resume": "Resume",
      "common.restart": "Restart",
      "common.save": "Save",
      "common.load": "Load",
      "common.delete": "Delete",
      "common.accept": "Accept",
      "common.decline": "Decline",
      "common.apply": "Apply",
      "common.reset": "Reset",
      "common.default": "Default",
      "common.enabled": "Enabled",
      "common.disabled": "Disabled",

      // ==========================================================
      // MAIN MENU / OPTIONS
      // ==========================================================
      "menu.startGame": "Start Game",
      "menu.storyMode": "Story Mode",
      "menu.battleMode": "Battle Mode",
      "menu.trainingMode": "Training Mode",
      "menu.tournamentMode": "Tournament Mode",
      "menu.options": "Options",
      "menu.credits": "Credits",
      "menu.gallery": "Gallery",
      "results.characterSelect": "Character Select",
      "battle.cpuAsP2": "CPU as Player 2",
      "battle.cpuAsP1": "CPU as Player 1",
      "battle.cpuSide": "CPU Side",
      "settings.defaultHealthBars": "Default: 3",
      "settings.defaultRoundTimer": "Default: 2:00",
      "settings.infinity": "Infinity",
      "settings.p2HealthBars": "P2 Health Bars",
      "settings.p1HealthBars": "P1 Health Bars",
      "settings.healthBars": "Health Bars",
      "settings.roundTimer": "Round Timer",
      "gallery.extras": "Extras",
      "gallery.cutScenes": "Cut Scenes",
      "gallery.stages": "Stages",
      "gallery.characters": "Characters",
      "menu.calamitySports": "Calamity Sports",
      "menu.tournament": "Tournament",
      "menu.loadGame": "Load Game",
      "menu.extras": "Extras",
      "menu.quit": "Quit",
      "menu.language": "Language",
      "menu.pressStart": "Press Start",
      "menu.chooseMode": "Choose Mode",

      "options.title": "Options",
      "options.language": "Language",
      "options.audio": "Audio",
      "options.music": "Music",
      "options.soundEffects": "Sound Effects",
      "options.voice": "Voice",
      "options.controls": "Controls",
      "options.keyboard": "Keyboard",
      "options.gamepad": "Gamepad",
      "options.fullscreen": "Fullscreen",
      "options.screenShake": "Screen Shake",
      "options.hitFlash": "Hit Flash",
      "options.textSpeed": "Text Speed",
      "options.autoAdvance": "Auto Advance",
      "options.restoreDefaults": "Restore Defaults",

      // ==========================================================
      // MODE / BATTLE SETUP
      // ==========================================================
      "mode.story.description": "Fight through the main story of Calamity War.",
      "mode.battle.description": "Create a custom battle and fight immediately.",
      "mode.training.description": "Practice movement, attacks, specials, and combos.",
      "mode.tournament.description": "Climb the bracket and become champion.",

      "battle.title": "Battle Mode",
      "battle.playerVsPlayer": "Player vs Player",
      "battle.playerVsCpu": "Player vs CPU",
      "battle.cpuVsCpu": "CPU vs CPU",
      "battle.singleBattle": "Single Battle",
      "battle.teamBattle": "Team Battle",
      "battle.teamSize": "Team Size",
      "battle.handicap": "Handicap",
      "battle.difficulty": "Difficulty",
      "battle.rounds": "Rounds",
      "battle.timer": "Timer",
      "battle.noTimer": "No Timer",
      "battle.damage": "Damage",
      "battle.startBattle": "Start Battle",
      "battle.easy": "Easy",
      "battle.normal": "Normal",
      "battle.hard": "Hard",
      "battle.extreme": "Extreme",
      "battle.selectBattleType": "Select Battle Type",
      "battle.selectDifficulty": "Select Difficulty",
      "battle.handicapOff": "Handicap Off",
      "battle.handicapLow": "Low Handicap",
      "battle.handicapHigh": "High Handicap",

      // ==========================================================
      // CHARACTER SELECT
      // ==========================================================
      "select.title": "Character Select",
      "select.selectYourFighter": "Select Your Fighter",
      "select.chooseTeam": "Choose Your Team",
      "select.teamReady": "Team Ready",
      "select.player1": "Player 1",
      "select.player2": "Player 2",
      "select.cpu": "CPU",
      "select.p1Ready": "P1 Ready",
      "select.p2Ready": "P2 Ready",
      "select.cpuReady": "CPU Ready",
      "select.randomP1": "Random P1",
      "select.randomP2": "Random P2",
      "select.randomCpu": "Random CPU",
      "select.randomMatchUp": "Random Match Up",
      "select.clearP1": "Clear P1",
      "select.clearP2": "Clear P2",
      "select.clearTeam": "Clear Team",
      "select.continueToBattleStage": "Continue to Battle Stage",
      "select.notEnoughFighters": "Choose at least one fighter for each side.",
      "select.teamFull": "Team is full.",
      "select.hoverRandom": "Hover to scramble. Click to lock in a random fighter.",
      "select.mirrorP2": "Player 2 portraits will mirror during the versus screen.",
      "select.roster": "Roster",
      "select.currentPick": "Current Pick",

      // ==========================================================
      // STAGE SELECT / READY SCREEN
      // ==========================================================
      "stage.title": "Stage Select",
      "stage.selectStage": "Select Stage",
      "stage.randomStage": "Random Stage",
      "stage.continueToBattle": "Continue to Battle",
      "stage.selectedStage": "Selected Stage",
      "stage.preview": "Stage Preview",
      "stage.trainingRoom": "Training Room",
      "stage.cityRuins": "City Ruins",
      "stage.templeGate": "Temple Gate",
      "stage.stormCoast": "Storm Coast",
      "stage.skyArena": "Sky Arena",

      "versus.title": "Versus",
      "versus.ready": "Ready",
      "versus.getReady": "Get Ready",
      "versus.teamVsTeam": "Team vs Team",
      "versus.loadingBattle": "Loading Battle...",

      // ==========================================================
      // FIGHT HUD / RESULTS
      // ==========================================================
      "fight.ready": "Ready",
      "fight.roundOne": "Round 1",
      "fight.roundTwo": "Round 2",
      "fight.finalRound": "Final Round",
      "fight.fight": "Fight!",
      "fight.ko": "K.O.",
      "fight.timeUp": "Time Up!",
      "fight.victory": "Victory!",
      "fight.defeat": "Defeat",
      "fight.draw": "Draw!",
      "fight.perfect": "Perfect!",
      "fight.combo": "Combo",
      "fight.counter": "Counter!",
      "fight.guardBreak": "Guard Break!",
      "fight.specialReady": "Special Ready",
      "fight.ultimateReady": "Ultimate Ready",
      "fight.player1Wins": "Player 1 Wins!",
      "fight.player2Wins": "Player 2 Wins!",
      "fight.cpuWins": "CPU Wins!",
      "fight.rematch": "Rematch",
      "fight.returnToCharacterSelect": "Return to Character Select",
      "fight.returnToStageSelect": "Return to Stage Select",
      "fight.mainMenu": "Main Menu",

      // ==========================================================
      // TRAINING MODE
      // ==========================================================
      "training.title": "Training Mode",
      "training.dummy": "Training Dummy",
      "training.resetPosition": "Reset Position",
      "training.showHitboxes": "Show Hitboxes",
      "training.hideHitboxes": "Hide Hitboxes",
      "training.infiniteMeter": "Infinite Meter",
      "training.infiniteHealth": "Infinite Health",
      "training.dummyAction": "Dummy Action",
      "training.stand": "Stand",
      "training.guard": "Guard",
      "training.jump": "Jump",
      "training.crouch": "Crouch",
      "training.record": "Record",
      "training.playback": "Playback",
      "training.frameData": "Frame Data",
      "training.damageDisplay": "Damage Display",

      // ==========================================================
      // TOURNAMENT MODE
      // ==========================================================
      "tournament.title": "Tournament Mode",
      "tournament.start": "Start Tournament",
      "tournament.bracket": "Bracket",
      "tournament.nextMatch": "Next Match",
      "tournament.semifinal": "Semifinal",
      "tournament.final": "Final",
      "tournament.champion": "Champion",
      "tournament.eliminated": "Eliminated",
      "tournament.advance": "Advance",

      // ==========================================================
      // STORY MODE COMMON UI
      // ==========================================================
      "story.title": "Story Mode",
      "story.newStory": "New Story",
      "story.continueStory": "Continue Story",
      "story.loadStory": "Load Story",
      "story.chapterSelect": "Chapter Select",
      "story.skipScene": "Skip Scene",
      "story.auto": "Auto",
      "story.log": "Log",
      "story.nextLine": "Next",
      "story.previousLine": "Previous",
      "story.chapter": "Chapter",
      "story.episode": "Episode",
      "story.prologue": "Prologue",
      "story.savePrompt": "Save your progress?",
      "story.routeSelect": "Route Select",
      "story.routeLocked": "This route is locked.",
      "story.battleStart": "A battle begins!",
      "story.victoryContinue": "Victory! The story continues.",
      "story.defeatRetry": "Defeat. Try again?",

      // ==========================================================
      // STORY MODE DIRECT TEXT SAMPLES / STARTER PROLOGUE
      // Replace or extend these keys as the full script is added.
      // ==========================================================
      "story.prologue.001": "The world changed the day the first calamity fell.",
      "story.prologue.002": "Cities burned, oceans rose, and power awakened in people who had never asked for it.",
      "story.prologue.003": "Some warriors fought to protect what remained.",
      "story.prologue.004": "Some fought for revenge.",
      "story.prologue.005": "And some only wanted to prove they were strong enough to survive.",
      "story.prologue.006": "This is the beginning of the Calamity War.",
      "story.rai.intro": "Rai steps into the arena, carrying the weight of everyone who believes in him.",
      "story.shanti.intro": "Shanti smiles, but her eyes are sharp. She is already reading her opponent.",
      "story.nikko.intro": "Nikko cracks his knuckles. He did not come here to lose.",
      "story.akila.intro": "Akila yawns softly. No one realizes how dangerous she truly is.",
      "story.semuda.intro": "Semuda enters like royalty, graceful, fearless, and impossible to ignore.",
      "story.tenganisha.intro": "Tenganisha laughs as his strange power twists around him.",
      "story.trainingDummy.intro": "The training dummy does not speak. It only waits in the dark.",

      // ==========================================================
      // CREDITS / WARNINGS / ERRORS
      // ==========================================================
      "credits.title": "Credits",
      "credits.createdBy": "Created by Emma Woods",
      "credits.gameDesign": "Game Design",
      "credits.artDirection": "Art Direction",
      "credits.translation": "English / Spanish / Japanese text built directly into code.",
      "error.assetMissing": "Asset missing: {asset}",
      "error.selectCharacter": "Please select a character first.",
      "error.selectStage": "Please select a stage first.",
      "error.unsupportedLanguage": "Unsupported language: {language}",

      // ==========================================================
      // CHARACTER DISPLAY NAMES
      // ==========================================================
      "char.adrian": "Adrian",
      "char.akila": "Akila",
      "char.akira": "Akira",
      "char.awar": "Awar",
      "char.awar_aries": "Awar Aries",
      "char.baburu": "Baburu",
      "char.daisuke": "Daisuke",
      "char.dammo": "Dammo",
      "char.danpen_shikake": "Danpen Shikake",
      "char.danpen_tokei": "Danpen Tokei",
      "char.danpen_toukei": "Danpen Toukei",
      "char.dante": "Dante",
      "char.dante_aries": "Dante Aries",
      "char.diastre": "Diastre",
      "char.diego": "Diego",
      "char.esther": "Esther",
      "char.goro": "Goro",
      "char.machai": "Machai",
      "char.machi": "Machi",
      "char.mahje": "Mahje",
      "char.malachai": "Malachai",
      "char.mammon": "Mammon",
      "char.mani": "Mani",
      "char.michelle": "Michelle",
      "char.miwa": "Miwa",
      "char.nico": "Nico",
      "char.nikki": "Nikki",
      "char.nox_aries": "Nox Aries",
      "char.pierre": "Pierre",
      "char.rai": "Rai",
      "char.raijin": "Raijin",
      "char.random": "Random",
      "char.rikku": "Rikku",
      "char.roger": "Roger",
      "char.rose": "Rose",
      "char.seccla_aries": "Seccla Aries",
      "char.semuda": "Semuda",
      "char.shanti": "Shanti",
      "char.shinichi": "Shinichi",
      "char.tenagnisha": "Tenganisha",
      "char.tenganisha": "Tenganisha",
      "char.yuta": "Yuta",
      "char.training_dummy_shadow": "Training Dummy Shadow",

      // SPEAKERS
      "speaker.narrator": "Narrator",
      "speaker.system": "System",
      "speaker.rai": "Rai",
      "speaker.shanti": "Shanti",
      "speaker.nikko": "Nikko",
      "speaker.akila": "Akila",
      "speaker.semuda": "Semuda",
      "speaker.tenganisha": "Tenganisha"
    },

    es: {
      "game.title": "Calamity War",
      "game.subtitle": "Elige tu luchador. Sobrevive a la calamidad.",
      "common.back": "Volver",
      "common.next": "Siguiente",
      "common.continue": "Continuar",
      "common.confirm": "Confirmar",
      "common.cancel": "Cancelar",
      "common.close": "Cerrar",
      "common.select": "Elegir",
      "common.selected": "Elegido",
      "common.ready": "Listo",
      "common.start": "Empezar",
      "common.loading": "Cargando...",
      "common.on": "Activado",
      "common.off": "Desactivado",
      "common.yes": "Sí",
      "common.no": "No",
      "common.locked": "Bloqueado",
      "common.unlocked": "Desbloqueado",
      "common.comingSoon": "Próximamente",
      "common.random": "Aleatorio",
      "common.none": "Ninguno",
      "common.pause": "Pausa",
      "common.resume": "Reanudar",
      "common.restart": "Reiniciar",
      "common.save": "Guardar",
      "common.load": "Cargar",
      "common.delete": "Eliminar",
      "common.accept": "Aceptar",
      "common.decline": "Rechazar",
      "common.apply": "Aplicar",
      "common.reset": "Restablecer",
      "common.default": "Predeterminado",
      "common.enabled": "Activado",
      "common.disabled": "Desactivado",

      "menu.startGame": "Iniciar juego",
      "menu.storyMode": "Modo Historia",
      "menu.battleMode": "Modo Batalla",
      "menu.trainingMode": "Modo Entrenamiento",
      "menu.tournamentMode": "Modo Torneo",
      "menu.options": "Opciones",
      "menu.credits": "Créditos",
      "menu.gallery": "Galería",
      "menu.extras": "Extras",
      "menu.quit": "Salir",
      "menu.language": "Idioma",
      "menu.pressStart": "Pulsa Start",
      "menu.chooseMode": "Elige modo",

      "options.title": "Opciones",
      "options.language": "Idioma",
      "options.audio": "Audio",
      "options.music": "Música",
      "options.soundEffects": "Efectos de sonido",
      "options.voice": "Voces",
      "options.controls": "Controles",
      "options.keyboard": "Teclado",
      "options.gamepad": "Mando",
      "options.fullscreen": "Pantalla completa",
      "options.screenShake": "Vibración de pantalla",
      "options.hitFlash": "Destello de impacto",
      "options.textSpeed": "Velocidad del texto",
      "options.autoAdvance": "Avance automático",
      "options.restoreDefaults": "Restaurar valores predeterminados",

      "mode.story.description": "Pelea a través de la historia principal de Calamity War.",
      "mode.battle.description": "Crea una batalla personalizada y pelea de inmediato.",
      "mode.training.description": "Practica movimiento, ataques, especiales y combos.",
      "mode.tournament.description": "Sube en el torneo y conviértete en campeón.",

      "battle.title": "Modo Batalla",
      "battle.playerVsPlayer": "Jugador vs Jugador",
      "battle.playerVsCpu": "Jugador vs CPU",
      "battle.cpuVsCpu": "CPU vs CPU",
      "battle.singleBattle": "Batalla individual",
      "battle.teamBattle": "Batalla por equipos",
      "battle.teamSize": "Tamaño del equipo",
      "battle.handicap": "Ventaja",
      "battle.difficulty": "Dificultad",
      "battle.rounds": "Rondas",
      "battle.timer": "Temporizador",
      "battle.noTimer": "Sin temporizador",
      "battle.damage": "Daño",
      "battle.startBattle": "Iniciar batalla",
      "battle.easy": "Fácil",
      "battle.normal": "Normal",
      "battle.hard": "Difícil",
      "battle.extreme": "Extremo",
      "battle.selectBattleType": "Elige tipo de batalla",
      "battle.selectDifficulty": "Elige dificultad",
      "battle.handicapOff": "Sin ventaja",
      "battle.handicapLow": "Ventaja baja",
      "battle.handicapHigh": "Ventaja alta",

      "select.title": "Selección de personaje",
      "select.selectYourFighter": "Elige tu luchador",
      "select.chooseTeam": "Elige tu equipo",
      "select.teamReady": "Equipo listo",
      "select.player1": "Jugador 1",
      "select.player2": "Jugador 2",
      "select.cpu": "CPU",
      "select.p1Ready": "P1 listo",
      "select.p2Ready": "P2 listo",
      "select.cpuReady": "CPU lista",
      "select.randomP1": "P1 aleatorio",
      "select.randomP2": "P2 aleatorio",
      "select.randomCpu": "CPU aleatoria",
      "select.randomMatchUp": "Combate aleatorio",
      "select.clearP1": "Borrar P1",
      "select.clearP2": "Borrar P2",
      "select.clearTeam": "Borrar equipo",
      "select.continueToBattleStage": "Continuar al escenario de batalla",
      "select.notEnoughFighters": "Elige al menos un luchador para cada lado.",
      "select.teamFull": "El equipo está lleno.",
      "select.hoverRandom": "Pasa el cursor para mezclar. Haz clic para fijar un luchador aleatorio.",
      "select.mirrorP2": "Los retratos del Jugador 2 se reflejarán en la pantalla de versus.",
      "select.roster": "Plantel",
      "select.currentPick": "Selección actual",

      "stage.title": "Selección de escenario",
      "stage.selectStage": "Elige el escenario",
      "stage.randomStage": "Escenario aleatorio",
      "stage.continueToBattle": "Continuar a la batalla",
      "stage.selectedStage": "Escenario elegido",
      "stage.preview": "Vista previa del escenario",
      "stage.trainingRoom": "Sala de entrenamiento",
      "stage.cityRuins": "Ruinas de la ciudad",
      "stage.templeGate": "Puerta del templo",
      "stage.stormCoast": "Costa tormentosa",
      "stage.skyArena": "Arena celestial",

      "versus.title": "Versus",
      "versus.ready": "Listos",
      "versus.getReady": "Prepárate",
      "versus.teamVsTeam": "Equipo vs Equipo",
      "versus.loadingBattle": "Cargando batalla...",

      "fight.ready": "Listos",
      "fight.roundOne": "Ronda 1",
      "fight.roundTwo": "Ronda 2",
      "fight.finalRound": "Ronda final",
      "fight.fight": "¡Luchen!",
      "fight.ko": "K.O.",
      "fight.timeUp": "¡Se acabó el tiempo!",
      "fight.victory": "¡Victoria!",
      "fight.defeat": "Derrota",
      "fight.draw": "¡Empate!",
      "fight.perfect": "¡Perfecto!",
      "fight.combo": "Combo",
      "fight.counter": "¡Contraataque!",
      "fight.guardBreak": "¡Ruptura de guardia!",
      "fight.specialReady": "Especial listo",
      "fight.ultimateReady": "Definitiva lista",
      "fight.player1Wins": "¡Gana el Jugador 1!",
      "fight.player2Wins": "¡Gana el Jugador 2!",
      "fight.cpuWins": "¡Gana la CPU!",
      "fight.rematch": "Revancha",
      "fight.returnToCharacterSelect": "Volver a selección de personaje",
      "fight.returnToStageSelect": "Volver a selección de escenario",
      "fight.mainMenu": "Menú principal",

      "training.title": "Modo Entrenamiento",
      "training.dummy": "Muñeco de entrenamiento",
      "training.resetPosition": "Restablecer posición",
      "training.showHitboxes": "Mostrar cajas de golpe",
      "training.hideHitboxes": "Ocultar cajas de golpe",
      "training.infiniteMeter": "Medidor infinito",
      "training.infiniteHealth": "Salud infinita",
      "training.dummyAction": "Acción del muñeco",
      "training.stand": "De pie",
      "training.guard": "Defender",
      "training.jump": "Saltar",
      "training.crouch": "Agacharse",
      "training.record": "Grabar",
      "training.playback": "Reproducir",
      "training.frameData": "Datos de frames",
      "training.damageDisplay": "Mostrar daño",

      "tournament.title": "Modo Torneo",
      "tournament.start": "Iniciar torneo",
      "tournament.bracket": "Llave del torneo",
      "tournament.nextMatch": "Siguiente combate",
      "tournament.semifinal": "Semifinal",
      "tournament.final": "Final",
      "tournament.champion": "Campeón",
      "tournament.eliminated": "Eliminado",
      "tournament.advance": "Avanzar",

      "story.title": "Modo Historia",
      "story.newStory": "Nueva historia",
      "story.continueStory": "Continuar historia",
      "story.loadStory": "Cargar historia",
      "story.chapterSelect": "Selección de capítulo",
      "story.skipScene": "Saltar escena",
      "story.auto": "Auto",
      "story.log": "Registro",
      "story.nextLine": "Siguiente",
      "story.previousLine": "Anterior",
      "story.chapter": "Capítulo",
      "story.episode": "Episodio",
      "story.prologue": "Prólogo",
      "story.savePrompt": "¿Guardar tu progreso?",
      "story.routeSelect": "Selección de ruta",
      "story.routeLocked": "Esta ruta está bloqueada.",
      "story.battleStart": "¡Comienza una batalla!",
      "story.victoryContinue": "¡Victoria! La historia continúa.",
      "story.defeatRetry": "Derrota. ¿Intentar de nuevo?",

      "story.prologue.001": "El mundo cambió el día en que cayó la primera calamidad.",
      "story.prologue.002": "Las ciudades ardieron, los océanos se alzaron y un poder despertó en personas que nunca lo habían pedido.",
      "story.prologue.003": "Algunos guerreros lucharon para proteger lo que quedaba.",
      "story.prologue.004": "Algunos lucharon por venganza.",
      "story.prologue.005": "Y otros solo querían demostrar que eran lo bastante fuertes para sobrevivir.",
      "story.prologue.006": "Este es el comienzo de Calamity War.",
      "story.rai.intro": "Rai entra en la arena cargando el peso de todos los que creen en él.",
      "story.shanti.intro": "Shanti sonríe, pero sus ojos son afilados. Ya está leyendo a su oponente.",
      "story.nikko.intro": "Nikko cruje los nudillos. No vino aquí para perder.",
      "story.akila.intro": "Akila bosteza suavemente. Nadie comprende lo peligrosa que realmente es.",
      "story.semuda.intro": "Semuda entra como realeza: elegante, intrépida e imposible de ignorar.",
      "story.tenganisha.intro": "Tenganisha se ríe mientras su extraño poder se retuerce a su alrededor.",
      "story.trainingDummy.intro": "El muñeco de entrenamiento no habla. Solo espera en la oscuridad.",

      "credits.title": "Créditos",
      "credits.createdBy": "Creado por Emma Woods",
      "credits.gameDesign": "Diseño del juego",
      "credits.artDirection": "Dirección artística",
      "credits.translation": "Texto en inglés, español y japonés integrado directamente en el código.",
      "error.assetMissing": "Falta el recurso: {asset}",
      "error.selectCharacter": "Primero elige un personaje.",
      "error.selectStage": "Primero elige un escenario.",
      "error.unsupportedLanguage": "Idioma no compatible: {language}",

      "char.adrian": "Adrian",
      "char.akila": "Akila",
      "char.akira": "Akira",
      "char.awar": "Awar",
      "char.awar_aries": "Awar Aries",
      "char.baburu": "Baburu",
      "char.daisuke": "Daisuke",
      "char.dammo": "Dammo",
      "char.danpen_shikake": "Danpen Shikake",
      "char.danpen_tokei": "Danpen Tokei",
      "char.danpen_toukei": "Danpen Toukei",
      "char.dante": "Dante",
      "char.dante_aries": "Dante Aries",
      "char.diastre": "Diastre",
      "char.diego": "Diego",
      "char.esther": "Esther",
      "char.goro": "Goro",
      "char.machai": "Machai",
      "char.machi": "Machi",
      "char.mahje": "Mahje",
      "char.malachai": "Malachai",
      "char.mammon": "Mammon",
      "char.mani": "Mani",
      "char.michelle": "Michelle",
      "char.miwa": "Miwa",
      "char.nico": "Nico",
      "char.nikki": "Nikki",
      "char.nox_aries": "Nox Aries",
      "char.pierre": "Pierre",
      "char.rai": "Rai",
      "char.raijin": "Raijin",
      "char.random": "Aleatorio",
      "char.rikku": "Rikku",
      "char.roger": "Roger",
      "char.rose": "Rose",
      "char.seccla_aries": "Seccla Aries",
      "char.semuda": "Semuda",
      "char.shanti": "Shanti",
      "char.shinichi": "Shinichi",
      "char.tenagnisha": "Tenganisha",
      "char.tenganisha": "Tenganisha",
      "char.yuta": "Yuta",
      "char.training_dummy_shadow": "Muñeco de entrenamiento sombrío",

      "speaker.narrator": "Narrador",
      "speaker.system": "Sistema",
      "speaker.rai": "Rai",
      "speaker.shanti": "Shanti",
      "speaker.nikko": "Nikko",
      "speaker.akila": "Akila",
      "speaker.semuda": "Semuda",
      "speaker.tenganisha": "Tenganisha"
    },

    ja: {
      "game.title": "Calamity War",
      "game.subtitle": "ファイターを選び、災厄を生き抜け。",
      "common.back": "戻る",
      "common.next": "次へ",
      "common.continue": "続ける",
      "common.confirm": "決定",
      "common.cancel": "キャンセル",
      "common.close": "閉じる",
      "common.select": "選択",
      "common.selected": "選択済み",
      "common.ready": "準備完了",
      "common.start": "開始",
      "common.loading": "読み込み中...",
      "common.on": "オン",
      "common.off": "オフ",
      "common.yes": "はい",
      "common.no": "いいえ",
      "common.locked": "ロック中",
      "common.unlocked": "解放済み",
      "common.comingSoon": "近日公開",
      "common.random": "ランダム",
      "common.none": "なし",
      "common.pause": "ポーズ",
      "common.resume": "再開",
      "common.restart": "やり直す",
      "common.save": "セーブ",
      "common.load": "ロード",
      "common.delete": "削除",
      "common.accept": "承諾",
      "common.decline": "拒否",
      "common.apply": "適用",
      "common.reset": "リセット",
      "common.default": "デフォルト",
      "common.enabled": "有効",
      "common.disabled": "無効",

      "menu.startGame": "ゲーム開始",
      "menu.storyMode": "ストーリーモード",
      "menu.battleMode": "バトルモード",
      "menu.trainingMode": "トレーニングモード",
      "menu.tournamentMode": "トーナメントモード",
      "menu.options": "オプション",
      "menu.credits": "クレジット",
      "menu.gallery": "ギャラリー",
      "menu.extras": "エクストラ",
      "menu.quit": "終了",
      "menu.language": "言語",
      "menu.pressStart": "スタートを押す",
      "menu.chooseMode": "モード選択",

      "options.title": "オプション",
      "options.language": "言語",
      "options.audio": "オーディオ",
      "options.music": "音楽",
      "options.soundEffects": "効果音",
      "options.voice": "ボイス",
      "options.controls": "操作方法",
      "options.keyboard": "キーボード",
      "options.gamepad": "ゲームパッド",
      "options.fullscreen": "全画面",
      "options.screenShake": "画面揺れ",
      "options.hitFlash": "ヒットフラッシュ",
      "options.textSpeed": "文字速度",
      "options.autoAdvance": "自動送り",
      "options.restoreDefaults": "初期設定に戻す",

      "mode.story.description": "Calamity Warのメインストーリーを戦い抜く。",
      "mode.battle.description": "カスタムバトルを作成してすぐに戦う。",
      "mode.training.description": "移動、攻撃、必殺技、コンボを練習する。",
      "mode.tournament.description": "トーナメントを勝ち進み、王者を目指す。",

      "battle.title": "バトルモード",
      "battle.playerVsPlayer": "プレイヤー対プレイヤー",
      "battle.playerVsCpu": "プレイヤー対CPU",
      "battle.cpuVsCpu": "CPU対CPU",
      "battle.singleBattle": "シングルバトル",
      "battle.teamBattle": "チームバトル",
      "battle.teamSize": "チーム人数",
      "battle.handicap": "ハンディキャップ",
      "battle.difficulty": "難易度",
      "battle.rounds": "ラウンド数",
      "battle.timer": "タイマー",
      "battle.noTimer": "タイマーなし",
      "battle.damage": "ダメージ",
      "battle.startBattle": "バトル開始",
      "battle.easy": "やさしい",
      "battle.normal": "普通",
      "battle.hard": "難しい",
      "battle.extreme": "超難関",
      "battle.selectBattleType": "バトル形式を選択",
      "battle.selectDifficulty": "難易度を選択",
      "battle.handicapOff": "ハンディキャップなし",
      "battle.handicapLow": "低ハンディキャップ",
      "battle.handicapHigh": "高ハンディキャップ",

      "select.title": "キャラクター選択",
      "select.selectYourFighter": "ファイターを選択",
      "select.chooseTeam": "チームを選択",
      "select.teamReady": "チーム準備完了",
      "select.player1": "プレイヤー1",
      "select.player2": "プレイヤー2",
      "select.cpu": "CPU",
      "select.p1Ready": "P1準備完了",
      "select.p2Ready": "P2準備完了",
      "select.cpuReady": "CPU準備完了",
      "select.randomP1": "P1ランダム",
      "select.randomP2": "P2ランダム",
      "select.randomCpu": "CPUランダム",
      "select.randomMatchUp": "ランダム対戦",
      "select.clearP1": "P1をクリア",
      "select.clearP2": "P2をクリア",
      "select.clearTeam": "チームをクリア",
      "select.continueToBattleStage": "バトルステージへ進む",
      "select.notEnoughFighters": "各サイドに少なくとも1人のファイターを選択してください。",
      "select.teamFull": "チームは満員です。",
      "select.hoverRandom": "ホバーで高速シャッフル。クリックでランダムファイターを決定。",
      "select.mirrorP2": "プレイヤー2のポートレートはVS画面で反転表示されます。",
      "select.roster": "ロスター",
      "select.currentPick": "現在の選択",

      "stage.title": "ステージ選択",
      "stage.selectStage": "ステージを選択",
      "stage.randomStage": "ランダムステージ",
      "stage.continueToBattle": "バトルへ進む",
      "stage.selectedStage": "選択ステージ",
      "stage.preview": "ステージプレビュー",
      "stage.trainingRoom": "トレーニングルーム",
      "stage.cityRuins": "都市廃墟",
      "stage.templeGate": "神殿の門",
      "stage.stormCoast": "嵐の海岸",
      "stage.skyArena": "天空闘技場",

      "versus.title": "バーサス",
      "versus.ready": "レディー",
      "versus.getReady": "準備せよ",
      "versus.teamVsTeam": "チーム対チーム",
      "versus.loadingBattle": "バトル読み込み中...",

      "fight.ready": "レディー",
      "fight.roundOne": "ラウンド1",
      "fight.roundTwo": "ラウンド2",
      "fight.finalRound": "最終ラウンド",
      "fight.fight": "ファイト！",
      "fight.ko": "K.O.",
      "fight.timeUp": "タイムアップ！",
      "fight.victory": "勝利！",
      "fight.defeat": "敗北",
      "fight.draw": "引き分け！",
      "fight.perfect": "パーフェクト！",
      "fight.combo": "コンボ",
      "fight.counter": "カウンター！",
      "fight.guardBreak": "ガードブレイク！",
      "fight.specialReady": "必殺技準備完了",
      "fight.ultimateReady": "究極技準備完了",
      "fight.player1Wins": "プレイヤー1の勝利！",
      "fight.player2Wins": "プレイヤー2の勝利！",
      "fight.cpuWins": "CPUの勝利！",
      "fight.rematch": "再戦",
      "fight.returnToCharacterSelect": "キャラクター選択へ戻る",
      "fight.returnToStageSelect": "ステージ選択へ戻る",
      "fight.mainMenu": "メインメニュー",

      "training.title": "トレーニングモード",
      "training.dummy": "トレーニングダミー",
      "training.resetPosition": "位置をリセット",
      "training.showHitboxes": "ヒットボックスを表示",
      "training.hideHitboxes": "ヒットボックスを非表示",
      "training.infiniteMeter": "ゲージ無限",
      "training.infiniteHealth": "体力無限",
      "training.dummyAction": "ダミー動作",
      "training.stand": "立ち",
      "training.guard": "ガード",
      "training.jump": "ジャンプ",
      "training.crouch": "しゃがみ",
      "training.record": "録画",
      "training.playback": "再生",
      "training.frameData": "フレームデータ",
      "training.damageDisplay": "ダメージ表示",

      "tournament.title": "トーナメントモード",
      "tournament.start": "トーナメント開始",
      "tournament.bracket": "トーナメント表",
      "tournament.nextMatch": "次の試合",
      "tournament.semifinal": "準決勝",
      "tournament.final": "決勝",
      "tournament.champion": "王者",
      "tournament.eliminated": "敗退",
      "tournament.advance": "進む",

      "story.title": "ストーリーモード",
      "story.newStory": "新しいストーリー",
      "story.continueStory": "ストーリーを続ける",
      "story.loadStory": "ストーリーをロード",
      "story.chapterSelect": "章選択",
      "story.skipScene": "シーンをスキップ",
      "story.auto": "オート",
      "story.log": "ログ",
      "story.nextLine": "次へ",
      "story.previousLine": "前へ",
      "story.chapter": "章",
      "story.episode": "エピソード",
      "story.prologue": "プロローグ",
      "story.savePrompt": "進行状況をセーブしますか？",
      "story.routeSelect": "ルート選択",
      "story.routeLocked": "このルートはロックされています。",
      "story.battleStart": "バトル開始！",
      "story.victoryContinue": "勝利！物語は続く。",
      "story.defeatRetry": "敗北。もう一度挑戦しますか？",

      "story.prologue.001": "最初の災厄が落ちた日、世界は変わった。",
      "story.prologue.002": "都市は燃え、海は荒れ、望んでもいない力が人々の中で目覚めた。",
      "story.prologue.003": "残されたものを守るために戦う者がいた。",
      "story.prologue.004": "復讐のために戦う者がいた。",
      "story.prologue.005": "そして、生き残るだけの強さを証明したい者もいた。",
      "story.prologue.006": "これがCalamity Warの始まりである。",
      "story.rai.intro": "ライは、自分を信じる者たちの想いを背負い、闘技場へ足を踏み入れる。",
      "story.shanti.intro": "シャンティは微笑む。しかし、その目は鋭い。彼女はすでに相手を読み始めている。",
      "story.nikko.intro": "ニッコは拳を鳴らす。負けるためにここへ来たわけではない。",
      "story.akila.intro": "アキラは静かにあくびをする。彼女が本当はどれほど危険なのか、誰も気づいていない。",
      "story.semuda.intro": "セムダは女王のように現れる。優雅で、恐れを知らず、誰も目を離せない。",
      "story.tenganisha.intro": "テンガニシャは笑う。奇妙な力が彼の周りでねじれていく。",
      "story.trainingDummy.intro": "トレーニングダミーは語らない。ただ闇の中で待っている。",

      "credits.title": "クレジット",
      "credits.createdBy": "制作：Emma Woods",
      "credits.gameDesign": "ゲームデザイン",
      "credits.artDirection": "アートディレクション",
      "credits.translation": "英語・スペイン語・日本語のテキストをコードに直接内蔵。",
      "error.assetMissing": "アセットが見つかりません：{asset}",
      "error.selectCharacter": "先にキャラクターを選択してください。",
      "error.selectStage": "先にステージを選択してください。",
      "error.unsupportedLanguage": "対応していない言語です：{language}",

      "char.adrian": "アドリアン",
      "char.akila": "アキラ",
      "char.akira": "アキラ",
      "char.awar": "アワル",
      "char.awar_aries": "アワル・アリーズ",
      "char.baburu": "バブル",
      "char.daisuke": "ダイスケ",
      "char.dammo": "ダンモ",
      "char.danpen_shikake": "ダンペン・シカケ",
      "char.danpen_tokei": "ダンペン・トケイ",
      "char.danpen_toukei": "ダンペン・トウケイ",
      "char.dante": "ダンテ",
      "char.dante_aries": "ダンテ・アリーズ",
      "char.diastre": "ディアストレ",
      "char.diego": "ディエゴ",
      "char.esther": "エスター",
      "char.goro": "ゴロー",
      "char.machai": "マカイ",
      "char.machi": "マチ",
      "char.mahje": "マージェ",
      "char.malachai": "マラカイ",
      "char.mammon": "マモン",
      "char.mani": "マニ",
      "char.michelle": "ミシェル",
      "char.miwa": "ミワ",
      "char.nico": "ニコ",
      "char.nikki": "ニッキー",
      "char.nox_aries": "ノックス・アリーズ",
      "char.pierre": "ピエール",
      "char.rai": "ライ",
      "char.raijin": "ライジン",
      "char.random": "ランダム",
      "char.rikku": "リック",
      "char.roger": "ロジャー",
      "char.rose": "ローズ",
      "char.seccla_aries": "セックラ・アリーズ",
      "char.semuda": "セムダ",
      "char.shanti": "シャンティ",
      "char.shinichi": "シンイチ",
      "char.tenagnisha": "テンガニシャ",
      "char.tenganisha": "テンガニシャ",
      "char.yuta": "ユウタ",
      "char.training_dummy_shadow": "影のトレーニングダミー",

      "speaker.narrator": "ナレーター",
      "speaker.system": "システム",
      "speaker.rai": "ライ",
      "speaker.shanti": "シャンティ",
      "speaker.nikko": "ニッコ",
      "speaker.akila": "アキラ",
      "speaker.semuda": "セムダ",
      "speaker.tenganisha": "テンガニシャ"
    }
  };

  // Direct story records: story text can be put straight here, no external file.
  const CW_STORY_SCENES = {
    prologue: [
      { id: "prologue_001", speaker: "narrator", textKey: "story.prologue.001" },
      { id: "prologue_002", speaker: "narrator", textKey: "story.prologue.002" },
      { id: "prologue_003", speaker: "narrator", textKey: "story.prologue.003" },
      { id: "prologue_004", speaker: "narrator", textKey: "story.prologue.004" },
      { id: "prologue_005", speaker: "narrator", textKey: "story.prologue.005" },
      { id: "prologue_006", speaker: "narrator", textKey: "story.prologue.006" }
    ],
    fighter_intros: [
      { id: "rai_intro", speaker: "rai", textKey: "story.rai.intro" },
      { id: "shanti_intro", speaker: "shanti", textKey: "story.shanti.intro" },
      { id: "nikko_intro", speaker: "nikko", textKey: "story.nikko.intro" },
      { id: "akila_intro", speaker: "akila", textKey: "story.akila.intro" },
      { id: "semuda_intro", speaker: "semuda", textKey: "story.semuda.intro" },
      { id: "tenganisha_intro", speaker: "tenganisha", textKey: "story.tenganisha.intro" },
      { id: "training_dummy_intro", speaker: "system", textKey: "story.trainingDummy.intro" }
    ]
  };

  function cwNormalizeKey(key) {
    return String(key || "").trim();
  }

  function cwT(key, vars) {
    const cleanKey = cwNormalizeKey(key);
    const langBlock = CW_TEXT[cwCurrentLanguage] || CW_TEXT[CW_DEFAULT_LANGUAGE];
    let value = langBlock[cleanKey] || CW_TEXT[CW_DEFAULT_LANGUAGE][cleanKey] || cleanKey;

    if (vars && typeof vars === "object") {
      Object.keys(vars).forEach((name) => {
        value = value.replaceAll(`{${name}}`, String(vars[name]));
      });
    }
    return value;
  }

  function cwGetLanguage() {
    return cwCurrentLanguage;
  }

  function cwSetLanguage(languageCode) {
    const nextLanguage = CW_LANGUAGES[languageCode] ? languageCode : CW_DEFAULT_LANGUAGE;
    cwCurrentLanguage = nextLanguage;
    localStorage.setItem("calamityWarLanguage", cwCurrentLanguage);
    cwApplyDocumentLanguage();
    cwApplyTranslations(document);

    window.dispatchEvent(new CustomEvent("calamitywar:languagechange", {
      detail: { language: cwCurrentLanguage, label: CW_LANGUAGES[cwCurrentLanguage].label }
    }));
  }

  function cwCycleLanguage() {
    const order = Object.keys(CW_LANGUAGES);
    const currentIndex = order.indexOf(cwCurrentLanguage);
    const next = order[(currentIndex + 1) % order.length];
    cwSetLanguage(next);
  }

  function cwApplyDocumentLanguage() {
    const lang = CW_LANGUAGES[cwCurrentLanguage] || CW_LANGUAGES[CW_DEFAULT_LANGUAGE];
    if (document && document.documentElement) {
      document.documentElement.lang = lang.htmlLang;
      document.documentElement.setAttribute("data-cw-language", cwCurrentLanguage);
    }
  }

  function cwApplyTranslations(root) {
    const scope = root || document;
    if (!scope || !scope.querySelectorAll) return;

    const textSelectors = "[data-cw-text], [data-i18n], [data-text]";
    scope.querySelectorAll(textSelectors).forEach((element) => {
      const key = element.getAttribute("data-cw-text") || element.getAttribute("data-i18n") || element.getAttribute("data-text");
      element.textContent = cwT(key);
    });

    const htmlSelectors = "[data-cw-html]";
    scope.querySelectorAll(htmlSelectors).forEach((element) => {
      const key = element.getAttribute("data-cw-html");
      element.innerHTML = cwT(key);
    });

    const placeholderSelectors = "[data-cw-placeholder], [data-i18n-placeholder], [data-placeholder]";
    scope.querySelectorAll(placeholderSelectors).forEach((element) => {
      const key = element.getAttribute("data-cw-placeholder") || element.getAttribute("data-i18n-placeholder") || element.getAttribute("data-placeholder");
      element.placeholder = cwT(key);
    });

    const titleSelectors = "[data-cw-title], [data-i18n-title], [data-title]";
    scope.querySelectorAll(titleSelectors).forEach((element) => {
      const key = element.getAttribute("data-cw-title") || element.getAttribute("data-i18n-title") || element.getAttribute("data-title");
      element.title = cwT(key);
    });

    const ariaSelectors = "[data-cw-aria-label], [data-i18n-aria-label]";
    scope.querySelectorAll(ariaSelectors).forEach((element) => {
      const key = element.getAttribute("data-cw-aria-label") || element.getAttribute("data-i18n-aria-label");
      element.setAttribute("aria-label", cwT(key));
    });

    const valueSelectors = "[data-cw-value]";
    scope.querySelectorAll(valueSelectors).forEach((element) => {
      const key = element.getAttribute("data-cw-value");
      element.value = cwT(key);
    });

    const languageSelect = scope.querySelector ? scope.querySelector("#languageSelect, #cwLanguageSelect, [data-cw-language-select]") : null;
    if (languageSelect) languageSelect.value = cwCurrentLanguage;
  }

  function cwCreateLanguageSelect(options) {
    const config = options || {};
    const select = document.createElement("select");
    select.id = config.id || "cwLanguageSelect";
    select.setAttribute("data-cw-language-select", "true");
    select.setAttribute("aria-label", cwT("options.language"));

    Object.keys(CW_LANGUAGES).forEach((code) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = CW_LANGUAGES[code].label;
      select.appendChild(option);
    });

    select.value = cwCurrentLanguage;
    select.addEventListener("change", () => cwSetLanguage(select.value));
    return select;
  }

  function cwMountLanguageSelect(target) {
    const mount = typeof target === "string" ? document.querySelector(target) : target;
    if (!mount) return null;

    const wrapper = document.createElement("div");
    wrapper.className = "cw-language-select-wrap";

    const label = document.createElement("label");
    label.textContent = cwT("options.language");
    label.setAttribute("data-cw-text", "options.language");
    label.setAttribute("for", "cwLanguageSelect");

    const select = cwCreateLanguageSelect({ id: "cwLanguageSelect" });
    wrapper.appendChild(label);
    wrapper.appendChild(select);
    mount.appendChild(wrapper);
    return wrapper;
  }

  function cwCharacterName(characterId) {
    const normalized = String(characterId || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    return cwT(`char.${normalized}`);
  }

  function cwSpeakerName(speakerId) {
    const normalized = String(speakerId || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    return cwT(`speaker.${normalized}`);
  }

  function cwStoryLine(scene) {
    if (!scene) return "";
    if (scene.textKey) return cwT(scene.textKey);
    if (scene.text && typeof scene.text === "object") return scene.text[cwCurrentLanguage] || scene.text[CW_DEFAULT_LANGUAGE] || "";
    if (typeof scene.text === "string") return scene.text;
    return "";
  }

  function cwRenderStoryScene(scene, elements) {
    if (!scene || !elements) return;
    if (elements.speaker) elements.speaker.textContent = cwSpeakerName(scene.speaker);
    if (elements.text) elements.text.textContent = cwStoryLine(scene);
  }

  function cwWireLanguageSelects() {
    document.querySelectorAll("#languageSelect, #cwLanguageSelect, [data-cw-language-select]").forEach((select) => {
      select.value = cwCurrentLanguage;
      if (select.dataset.cwLanguageWired === "true") return;
      select.dataset.cwLanguageWired = "true";
      select.addEventListener("change", () => cwSetLanguage(select.value));
    });
  }

  function cwInitTranslations() {
    cwApplyDocumentLanguage();
    cwWireLanguageSelects();
    cwApplyTranslations(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cwInitTranslations);
  } else {
    cwInitTranslations();
  }

  window.CalamityWarText = {
    languages: CW_LANGUAGES,
    textTable: CW_TEXT,
    storyScenes: CW_STORY_SCENES,
    t: cwT,
    getLanguage: cwGetLanguage,
    setLanguage: cwSetLanguage,
    cycleLanguage: cwCycleLanguage,
    applyTranslations: cwApplyTranslations,
    createLanguageSelect: cwCreateLanguageSelect,
    mountLanguageSelect: cwMountLanguageSelect,
    characterName: cwCharacterName,
    speakerName: cwSpeakerName,
    storyLine: cwStoryLine,
    renderStoryScene: cwRenderStoryScene
  };

  // Friendly aliases for existing game code.
  window.cwT = cwT;
  window.cwSetLanguage = cwSetLanguage;
  window.cwGetLanguage = cwGetLanguage;
  window.cwCharacterName = cwCharacterName;
  window.cwStoryLine = cwStoryLine;
})();
