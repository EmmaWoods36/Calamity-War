# Calamity War — GitHub Pages Playable Game Source V0.34

This is the **full playable browser game/source-code handoff package** based on the latest available build: V0.33 CPU-side + stage-gallery-scroll fix.

It includes the GitHub Pages-ready runtime:

```text
index.html
style.css
game.js
assets/
```

It also includes requested handoff/refactor folders:

```text
src/
data/
assets/ui/main_menu/
assets/ui/menu_templates/
assets/ui/character_select/
assets/ui/stage_select/
assets/ui/versus_screen/
assets/ui/battle_hud/
assets/stages/
assets/audio/music/
assets/audio/sfx/
assets/vfx/
```

## How to launch

Double-click `index.html`, or upload the folder contents to the root of the GitHub Pages repo.

## Important architecture note

The current playable game is still a simple static site: `index.html` + `style.css` + `game.js`.

The `src/` and `data/` folders are included as organized handoff/reference folders for the next modular refactor. The live runtime still uses the data embedded in `game.js`.

## V0.34 package additions

- Repacked the actual playable game/source code into a complete GitHub Pages-ready handoff zip.
- Preserved latest menu/HUD/stage/settings work from V0.33.
- Added organized `src/`, `data/`, `assets/ui/`, `assets/stages/`, `assets/audio/`, and `assets/vfx/` folders.
- Added source/data snapshots for characters and stages.
- Added character select/menu cards under `assets/select_cards/`.
- Added README notes for empty future folders such as music, SFX, and VFX.

## V0.33 preserved fixes

- Stage Gallery has scrollbar support.
- Battle Mode Player vs CPU can assign CPU to Player 1 or Player 2 via Character Select logic.
- Visible label should remain `Player 2`, not `Player 2 / CPU`.

---

# Original Build Notes / Changelog

# Calamity War — Browser Demo V0.13

This build updates the battle-flow code to better reflect the latest menu discussions:

- Story Mode through the current ongoing manga endpoint.
- Akila is now treated as hidden god-tier in code: stronger stats, hidden-power bio, “Eyes Open” special, higher meter, and a subtle gold aura in battle.
- PvP Mode with Versus Player, Versus CPU, and CPU vs CPU.
- Training Mode with infinite health/meter and a non-attacking dummy.
- Character/team selection before PvP/Training battles.
- Team sizes from 1–3 fighters per side for PvP: 1v1, 1v2, 2v3, 3v3, etc.
- Training Mode can use a 1–3 fighter practice team against the dummy.
- Random character/team selection.
- Battle stage selection after character selection.
- Random battle stage selection.
- Expanded stage library using new fight-setting backgrounds.
- CPU difficulty and handicap options remain active.

## Launch locally

Unzip the folder and double-click `index.html`.

## GitHub Pages deploy

Upload/replace the **contents** of this folder into the repo root:

- `index.html`
- `style.css`
- `game.js`
- `README.md`
- `HOW_TO_LAUNCH.txt`
- `ASSET_CHECKLIST.txt`
- `assets/`

Do not upload the zip itself as the site root. Keep `index.html` beside the `assets` folder.

## Main controls

P1: A/D move, W jump, S guard, J light, K heavy, L special.
P1 team switch: Q/E.
P2 local: Arrow keys move/jump/guard, 1 light, 2 heavy, 3 special.
P2 team switch in local PvP: 0.
Training/Fight reset: R.
Menu shortcut: X randomizes character/stage on selection screens. ENTER confirms stage/start where applicable.

## Notes

The fighters are still placeholder stick/silhouette sprites. The new backgrounds are real stage assets, and the battle setup is now structured so final character sprites can drop in later without changing the menu flow.


## V0.11 flow updates

- Main Menu now points into a dedicated Battle Mode setup flow.
- Battle setup includes Player vs Player, Player vs CPU, and CPU vs CPU.
- Single Battle and Team Battle are separated in setup, with 1–3 fighters per side.
- Character Select now follows setup and preserves team sizes.
- Stage Select includes the rotating stage wheel again.
- Added a Ready screen with the selected stage, P1/P2 lineups, and a countdown before battle.
- Selected portraits/highlight boxes are still expected to be overlay-driven later, but the code flow is now in place.


## V0.13 code updates

- Roster order has been rewired into stable rows/groups for core story, Badge Trials, Hathor, Rebellion, Aries, heavy hitters, and special/future slots.
- Added missing future-ready character IDs so all current selectable/future slots have code records. Exact display names can still be corrected later.
- Battle setup now has explicit format buttons: 1v1 Single, 2v2 Team, 3v3 Team, and Custom 1–3.
- 1v1, 2v2, and 3v3 now force the correct team sizes before character select.
- Character Select now marks P1/P2 selections with slot badges and exposes stable data attributes for future overlay art.
- Added overlay-ready zones for full-body art, portrait slots, selected glow frames, team strips, and roster cards.


## V0.13 UI Shell Integration

This build adds the reusable UI shell assets into `/assets/` and wires them into the interactive flow:

- `character_select_1v1_template.png` — static 1v1 shell only. Character cards, portraits, selected fighters, highlights, names, and full-body art are dynamic overlays.
- `character_select_team_template.png` — static team battle shell only. Team slots, character cards, P1/P2 picks, order numbers, highlights, and portraits are dynamic overlays.
- `stage_select_template.png` — static battle-stage shell. The stage carousel, selected-stage highlight, stage thumbnails, random stage behavior, and commands are dynamic overlays.
- `ready_vs_template.png` — static ready/VS shell. Fighter art, names, team members, stage name, and 3-2-1 countdown are dynamic overlays.

Battle Mode flow remains:

Main Menu → Battle Mode Setup → Character Select → Battle Stage → Ready / VS → Countdown → Fight.

The roster/order and 1v1 vs team behavior are still controlled by `game.js`, not baked into the images.


## V0.17 Save Slots

- Added Load Game to the main menu.
- Added five Story Mode save slots using browser localStorage.
- Save slots store story position, current mission/chapter title, timestamp, and Story Mode difficulty.
- Story scenes include a Save Game button that opens the save slot screen.


## V0.20 Notes
- Battle Mode now uses best 2 out of 3 round logic with segmented health bars.
- After each round the game announces Player 1 Wins Round, Player 2 Wins Round, or Draw.
- After two round wins, the game announces the match winner.
- Tournament Mode added as a first-pass arcade ladder: 13 CPU fights, randomized stages, progressively harder difficulty.
- Stage Select carousel has been updated so the framed stage cards move through the wheel when rotating or randomizing.
- Rai, Nico, and Shanti sprite paths remain wired through assets/sprites/<character>/<pose>.png. P2 sprites are mirrored in canvas code by flipping the draw scale.
- Rai transformation / future special controls are reserved for a later combat-input pass.

## v0.21 update
- Added pre-fight round lockout: ROUND 1/2/3 appears under the HUD, then FIGHT!, then controls unlock.
- Added pause menu during fights with P or Escape.
- Pause menu includes Resume, Quick Settings, Move List, and Main Menu.
- Pause works for Battle Mode and Tournament Mode, and is safe during the round intro countdown.

## v0.22 combat update
- Battle Mode and Tournament Mode rounds now use a 2:00 timer.
- If time expires, the side with more remaining team health wins the round automatically.
- Round start displays ROUND #, then FIGHT!, and controls are locked until FIGHT! clears.
- Knockouts display K.O. in the same upper-center placement as FIGHT!.
- Tournament outcomes now show YOU WIN! or YOU LOSE!.
- Health UI is layered into one active fighter bar per side: blue layer, green layer, orange/red danger layer.


## V0.23 health bar update

- The middle health layer now shifts from green toward yellow as that layer is depleted.
- Blue still represents the first/top health layer.
- Orange/red remains the final danger layer.


## V0.24 Calamity Sports placeholder

- Added Calamity Sports to the main menu.
- Added mini-game hub screen with Basketball and Tennis placeholder doors.
- Basketball/Tennis currently show placeholder messages so future mini games can be built behind these menu entries later.


## V0.25 main menu overlay + battle select fix

- Replaced the main menu shell with the cleaned background template (no baked menu boxes).
- Main menu now uses coded overlay option bars with the diamond/nameplate shape.
- Only the selected/hovered option turns red and extends outward; inactive options remain black and aligned.
- Main menu order: Story Mode, Load Game, Tournament, Battle Mode, Training Mode, Calamity Sports, Gallery, Settings.
- Added Gallery hub with Characters, Stages, Cut Scenes, and Extras placeholders.
- Added synthesized menu move/confirm sounds, mute toggle, game volume slider, and placeholder language selector in Settings.
- Fixed battle character select so Player 1 is the default active side and CPU/Player 2 defaults to side 2 instead of hijacking P1 selection.


## V0.26 announcer placeholder

- Added browser-based placeholder announcer voice for Round 1/2/3, Fight, K.O., You Win, You Lose, Player 1 wins, Player 2 wins, and Draw.
- Story Mode game over now triggers a menacing placeholder laugh.
- Settings now include an Announcer Voice placeholder toggle.
- This uses browser SpeechSynthesis for now; real recorded voice clips can replace it later.


## V0.28 stage carousel + round settings

- Stage select now uses the locked horizontal carousel direction: wide landscape cards close together, sliding left/right, with a larger selected-stage preview above.
- Stage select action buttons are centered and congruent: Back, Random, Continue.
- Battle/Tournament timer is centered between the health bars and does not start until after FIGHT!.
- Settings now include Battle/Tournament round time as a digital clock: 00:30 minimum, 10:00 maximum timed round, then infinity if increased over 10:00.
- Settings now include Player 1 and Player 2/CPU health-bar layers from 1 to 5, defaulting to 3. This works as a health handicap.


## V0.30 Battle Mode match-over popup

- Battle Mode now shows a match-over decision popup after the final round result.
- Options: Rematch, Character Select, and Main Menu.
- Keyboard shortcuts still work while popup is open: R rematches and Escape returns to main menu.


## V0.31 ornate battle HUD

- Reworked the fight HUD to look more like a real fighting-game top bar.
- Added ornate P1/P2 nameplates, HP values, team slots, lead portrait placeholders, round diamonds, and a centered timer medallion.
- Replaced the old plain meter presentation with a purple **KANI** meter, matching the Kani/Kekku/technique combat-system lore.
- The same HUD now applies to Battle Mode, Tournament Mode, Training, and Story fights because they all share the same fight screen.


## V0.32 hardcoded language dropdowns

- Added a hardcoded language system with full dropdown labels: English, Spanish, and Japanese.
- Updated the main Settings menu language dropdown to remove placeholder language labels.
- Added a language dropdown to the in-fight pause Settings menu.
- Language selection updates core UI text across the main menu, settings, battle setup, stage select, ready screen, gallery hub, story setup, game over, match-over popup, and pause menu.
- This is a hardcoded demo localization layer; story/dialogue text can continue to be expanded into the same dictionary as content locks.


## V0.33 stage gallery scroll + CPU side selection

- Stage Gallery now scrolls vertically with a visible styled scrollbar so all stage cards are reachable.
- Battle Mode Player vs CPU now supports CPU on either side.
- The CPU side is selected directly on the Character Select scene using a CPU Control toggle.
- Default remains Human Player 1 vs CPU Player 2, but you can switch to CPU Player 1 vs Human Player 2 before continuing.

