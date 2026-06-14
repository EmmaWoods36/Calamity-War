// ================================================================
// CALAMITY WAR — DIRECT TRANSLATION INTEGRATION EXAMPLES
// Copy these patterns into the existing game source where visible text
// is currently hard-coded in English.
// ================================================================

// 1) Static HTML can translate itself with attributes:
// <button data-cw-text="menu.battleMode">Battle Mode</button>
// <button data-cw-text="select.continueToBattleStage">Continue to Battle Stage</button>

// 2) Dynamic DOM buttons should use cwT directly:
function cwExampleCreateMenuButton(textKey, onClick) {
  const button = document.createElement("button");
  button.setAttribute("data-cw-text", textKey);
  button.textContent = cwT(textKey);
  button.addEventListener("click", onClick);
  return button;
}

// 3) Character names should use code-safe IDs internally but translated names visually:
function cwExampleRenderCharacterCard(cardElement, characterId) {
  const nameElement = cardElement.querySelector(".character-name");
  if (nameElement) nameElement.textContent = cwCharacterName(characterId);
}

// 4) Canvas fight text should use cwT at draw time:
function cwExampleDrawFightStart(ctx, x, y) {
  ctx.fillText(cwT("fight.ready"), x, y);
  // Later in countdown:
  // ctx.fillText(cwT("fight.fight"), x, y);
}

// 5) Story mode should store translated lines directly in code.
// You can use textKey for shared script lines already in calamity_war_direct_translations.js:
const cwExampleStorySceneUsingKey = {
  speaker: "rai",
  textKey: "story.rai.intro"
};

// Or store the three languages directly inside each story scene:
const cwExampleStorySceneDirect = {
  speaker: "shanti",
  text: {
    en: "You are already moving exactly how I expected.",
    es: "Ya te estás moviendo exactamente como esperaba.",
    ja: "あなたはもう、私の予想どおりに動いている。"
  }
};

function cwExampleRenderStory(scene) {
  const speakerBox = document.querySelector("#storySpeaker");
  const textBox = document.querySelector("#storyText");
  if (speakerBox) speakerBox.textContent = CalamityWarText.speakerName(scene.speaker);
  if (textBox) textBox.textContent = CalamityWarText.storyLine(scene);
}

// 6) Re-render custom screens when the player changes language:
window.addEventListener("calamitywar:languagechange", () => {
  // Repaint canvas HUD, rebuild menus, refresh story box, etc.
  // Example:
  // drawCurrentScreen();
});
