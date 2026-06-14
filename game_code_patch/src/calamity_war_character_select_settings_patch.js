// ================================================================
// CALAMITY WAR — CHARACTER SELECT / SETTINGS / MENU PATCH
// Drop-in patch for random P1 / random P2 / random matchup behavior,
// Player 2 label cleanup, settings language dropdown, and menu helpers.
// Include after the translation patch and before/after main game code.
// ================================================================
(function () {
  "use strict";

  const DEFAULT_ROSTER = [
    "rai","shanti","nico","akila","akira","adrian","malachai","semuda",
    "miwa","michelle","rikku","roger","rose","yuta","esther","diego",
    "baburu","goro","mahje","mammon","machai","tenganisha","shinichi","diastre",
    "dante","nox_aries","seccla_aries","dante_aries","awar_aries","raijin","pierre","mani",
    "danpen","daisuke","nikki","shani","training_dummy_shadow"
  ];

  const CW_STATE = window.CW_CHARACTER_SELECT_STATE || (window.CW_CHARACTER_SELECT_STATE = {
    p1: null,
    p2: null,
    cpuSide: "p2",
    randomIntervals: {}
  });

  function t(key, fallback) {
    return typeof window.cwT === "function" ? window.cwT(key) : fallback;
  }

  function normalizeId(value) {
    return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }

  function titleFromId(id) {
    if (typeof window.cwCharacterName === "function") return window.cwCharacterName(id);
    return String(id).split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
  }

  function getRoster() {
    const explicit = window.CALAMITY_WAR_ROSTER || window.CW_ROSTER || window.characters || window.CHARACTERS;
    if (Array.isArray(explicit)) {
      const ids = explicit.map(c => normalizeId(c.id || c.key || c.name || c)).filter(Boolean);
      if (ids.length) return Array.from(new Set(ids));
    }
    const cards = document.querySelectorAll("[data-character], [data-character-id], .character-card[data-id], .fighter-card[data-id]");
    const ids = Array.from(cards).map(card => normalizeId(card.dataset.character || card.dataset.characterId || card.dataset.id)).filter(Boolean);
    return ids.length ? Array.from(new Set(ids)) : DEFAULT_ROSTER.slice();
  }

  function randomRosterId() {
    const roster = getRoster();
    return roster[Math.floor(Math.random() * roster.length)];
  }

  function findCharacterSelectRoot() {
    return document.querySelector("#characterSelect, #character-select, .character-select, [data-screen='character-select'], [data-scene='character-select']") || document.body;
  }

  function findGallery(root) {
    return root.querySelector("#characterGallery, #character-gallery, .character-gallery, .character-grid, .fighter-gallery, .roster-grid, [data-character-gallery]");
  }

  function findContinueButton(root) {
    const candidates = Array.from(root.querySelectorAll("button, a, .button, [role='button']"));
    return candidates.find(el => /continue\s+to\s+battle\s+stage/i.test(el.textContent || "") || el.dataset.cwText === "select.continueToBattleStage") || null;
  }

  function findCardFor(id) {
    const safe = normalizeId(id);
    return document.querySelector(`[data-character='${safe}'], [data-character-id='${safe}'], [data-id='${safe}']`);
  }

  function setVisibleLabelFix(root) {
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
    const edits = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (/Player\s*2\s*\/\s*CPU/i.test(node.nodeValue)) edits.push(node);
    }
    edits.forEach(node => { node.nodeValue = node.nodeValue.replace(/Player\s*2\s*\/\s*CPU/gi, t("select.player2", "Player 2")); });
  }

  function callExistingSelection(side, id, preview) {
    const sideNum = side === "p1" ? 1 : 2;
    const calls = [
      [window.selectCharacterForPlayer, [sideNum, id, { preview }]],
      [window.setPlayerCharacter, [sideNum, id, { preview }]],
      [window.selectCharacter, [id, sideNum, { preview }]],
      [window.chooseCharacter, [sideNum, id, { preview }]],
      [window.game && window.game.selectCharacter, [sideNum, id, { preview }]],
      [window.CalamityWarGame && window.CalamityWarGame.selectCharacter, [sideNum, id, { preview }]]
    ];
    for (const [fn, args] of calls) {
      if (typeof fn === "function") {
        try { fn.apply(window.game || window.CalamityWarGame || window, args); return true; } catch (e) {}
      }
    }
    return false;
  }

  function updateDomSelection(side, id, preview) {
    const sideClass = side === "p1" ? "cw-selected-p1" : "cw-selected-p2";
    document.querySelectorAll(`.${sideClass}`).forEach(el => el.classList.remove(sideClass));
    const card = findCardFor(id);
    if (card) card.classList.add(sideClass);

    const panelSelectors = side === "p1"
      ? ["#p1Selected", "#player1Selected", "[data-p1-selected]", ".p1-selected"]
      : ["#p2Selected", "#player2Selected", "[data-p2-selected]", ".p2-selected"];
    panelSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(panel => {
        panel.dataset.character = id;
        const nameEl = panel.querySelector(".name, .character-name, [data-character-name]") || panel;
        if (nameEl) nameEl.textContent = titleFromId(id);
        const img = panel.querySelector("img");
        if (img) {
          img.src = `assets/select_cards/${id}_select.png`;
          img.alt = titleFromId(id);
        }
      });
    });
  }

  function selectSide(side, id, preview) {
    const normalized = normalizeId(id);
    CW_STATE[side] = normalized;
    callExistingSelection(side, normalized, preview);
    updateDomSelection(side, normalized, preview);
    document.dispatchEvent(new CustomEvent("calamitywar:characterselect", {
      detail: { side, characterId: normalized, preview: !!preview, source: "random_patch" }
    }));
  }

  function stopCycle(key) {
    if (CW_STATE.randomIntervals[key]) {
      clearInterval(CW_STATE.randomIntervals[key]);
      CW_STATE.randomIntervals[key] = null;
    }
  }

  function startCycle(key, sides) {
    stopCycle(key);
    CW_STATE.randomIntervals[key] = setInterval(() => {
      sides.forEach(side => selectSide(side, randomRosterId(), true));
    }, 65);
  }

  function lockRandom(key, sides) {
    stopCycle(key);
    sides.forEach(side => selectSide(side, randomRosterId(), false));
    document.dispatchEvent(new CustomEvent("calamitywar:randomselect", { detail: { sides, state: CW_STATE } }));
  }

  function createRandomButton(key, labelKey, fallback, sides) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cw-random-select-btn ornate-button";
    btn.dataset.cwText = labelKey;
    btn.textContent = t(labelKey, fallback);
    btn.title = t("select.hoverRandom", "Hover to scramble. Click to lock in a random fighter.");
    btn.addEventListener("mouseenter", () => startCycle(key, sides));
    btn.addEventListener("mouseleave", () => stopCycle(key));
    btn.addEventListener("click", () => lockRandom(key, sides));
    btn.addEventListener("touchstart", () => startCycle(key, sides), { passive: true });
    btn.addEventListener("touchend", () => lockRandom(key, sides));
    return btn;
  }

  function mountRandomControls() {
    const root = findCharacterSelectRoot();
    const gallery = findGallery(root);
    const continueButton = findContinueButton(root);
    if (!gallery && !continueButton) return null;

    let controls = root.querySelector(".cw-random-select-row");
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "cw-random-select-row";
      controls.appendChild(createRandomButton("p1", "select.randomP1", "Random P1", ["p1"]));
      controls.appendChild(createRandomButton("p2", "select.randomP2", "Random P2", ["p2"]));
      controls.appendChild(createRandomButton("matchup", "select.randomMatchUp", "Random Match Up", ["p1", "p2"]));
      if (continueButton && continueButton.parentNode) {
        continueButton.parentNode.insertBefore(controls, continueButton);
      } else if (gallery && gallery.parentNode) {
        gallery.parentNode.insertBefore(controls, gallery.nextSibling);
      } else {
        root.appendChild(controls);
      }
    }

    if (continueButton) {
      continueButton.classList.add("cw-continue-battle-stage");
      continueButton.dataset.cwText = continueButton.dataset.cwText || "select.continueToBattleStage";
      continueButton.textContent = t("select.continueToBattleStage", "Continue to Battle Stage");
    }
    setVisibleLabelFix(root);
    return controls;
  }

  function mountCpuSideSelector() {
    const root = findCharacterSelectRoot();
    if (!root || root.querySelector(".cw-cpu-side-wrap")) return;
    const controls = root.querySelector(".cw-random-select-row");
    if (!controls) return;
    const wrap = document.createElement("label");
    wrap.className = "cw-cpu-side-wrap";
    const span = document.createElement("span");
    span.dataset.cwText = "battle.cpuSide";
    span.textContent = t("battle.cpuSide", "CPU Side");
    const select = document.createElement("select");
    select.className = "cw-cpu-side-select";
    select.innerHTML = `<option value="p1">${t("battle.cpuAsP1", "CPU as Player 1")}</option><option value="p2">${t("battle.cpuAsP2", "CPU as Player 2")}</option>`;
    select.value = CW_STATE.cpuSide || "p2";
    select.addEventListener("change", () => {
      CW_STATE.cpuSide = select.value;
      document.dispatchEvent(new CustomEvent("calamitywar:cpusidechange", { detail: { cpuSide: select.value } }));
    });
    wrap.appendChild(span);
    wrap.appendChild(select);
    controls.appendChild(wrap);
  }

  function mountLanguageDropdowns() {
    if (!window.CalamityWarText || typeof window.CalamityWarText.createLanguageSelect !== "function") return;
    document.querySelectorAll("#settings, #settingsMenu, #optionsMenu, .settings-menu, .options-menu, [data-screen='settings']").forEach(menu => {
      if (menu.querySelector("#cwLanguageSelect, [data-cw-language-select]")) return;
      const holder = document.createElement("div");
      holder.className = "cw-settings-language-row";
      const label = document.createElement("label");
      label.dataset.cwText = "options.language";
      label.textContent = t("options.language", "Language");
      const select = window.CalamityWarText.createLanguageSelect({ id: "cwLanguageSelect" });
      label.appendChild(select);
      holder.appendChild(label);
      menu.appendChild(holder);
    });
  }

  function mountSettingsDefaults() {
    const settings = window.CW_SETTINGS || (window.CW_SETTINGS = {});
    if (settings.roundTimerSeconds == null) settings.roundTimerSeconds = 120;
    if (settings.p1HealthBars == null) settings.p1HealthBars = 3;
    if (settings.p2HealthBars == null) settings.p2HealthBars = 3;
    settings.clampRoundTimer = function(value) {
      const n = Number(value);
      if (!Number.isFinite(n)) return Infinity;
      if (n > 600) return Infinity;
      return Math.max(30, Math.min(600, Math.round(n)));
    };
    settings.clampHealthBars = function(value) {
      const n = Number(value);
      if (!Number.isFinite(n)) return 3;
      return Math.max(1, Math.min(5, Math.round(n)));
    };
  }

  function mountMatchEndPopupHelper() {
    window.CWShowMatchEndPopup = window.CWShowMatchEndPopup || function CWShowMatchEndPopup(resultText) {
      let overlay = document.querySelector(".cw-match-end-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "cw-match-end-overlay";
        overlay.innerHTML = `<div class="cw-match-end-popup"><h2 class="cw-match-end-title"></h2><button data-action="rematch"></button><button data-action="character-select"></button><button data-action="main-menu"></button></div>`;
        document.body.appendChild(overlay);
      }
      overlay.querySelector(".cw-match-end-title").textContent = resultText || t("fight.victory", "Victory!");
      overlay.querySelector("[data-action='rematch']").textContent = t("fight.rematch", "Rematch");
      overlay.querySelector("[data-action='character-select']").textContent = t("results.characterSelect", "Character Select");
      overlay.querySelector("[data-action='main-menu']").textContent = t("fight.mainMenu", "Main Menu");
      overlay.classList.add("is-open");
      overlay.querySelector("[data-action='rematch']").onclick = () => document.dispatchEvent(new CustomEvent("calamitywar:rematch"));
      overlay.querySelector("[data-action='character-select']").onclick = () => document.dispatchEvent(new CustomEvent("calamitywar:gotocharacterselect"));
      overlay.querySelector("[data-action='main-menu']").onclick = () => document.dispatchEvent(new CustomEvent("calamitywar:gotomainmenu"));
      return overlay;
    };
  }

  function init() {
    mountSettingsDefaults();
    mountRandomControls();
    mountCpuSideSelector();
    mountLanguageDropdowns();
    mountMatchEndPopupHelper();
    setVisibleLabelFix(document.body);
    if (window.CalamityWarText && typeof window.CalamityWarText.applyTranslations === "function") window.CalamityWarText.applyTranslations(document);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  setTimeout(init, 300);
  setTimeout(init, 1000);

  window.CalamityWarCharacterSelectPatch = {
    init,
    getRoster,
    selectSide,
    randomRosterId,
    state: CW_STATE
  };
})();
