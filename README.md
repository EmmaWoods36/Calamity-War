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
