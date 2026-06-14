# Calamity War Full GitHub Pages Source Package V0.34

This package contains the actual playable browser game/source code from the latest available build, plus organized folders requested for handoff/refactor work.

## Entry point

Open this file locally or on GitHub Pages:

```text
index.html
```

`index.html` loads:

```text
style.css
game.js
```

The current playable game is a no-build static site. Upload the contents of this folder to the repo root for GitHub Pages.

## Runtime files

```text
index.html        Main HTML shell / screens
style.css         Full UI styling, menus, HUD, responsive layout
game.js           Main runtime: data, menus, modes, settings, localization, fight loop
assets/           Runtime assets used by current code
```

## Current single-file logic map

The current runtime is still centralized in `game.js` for GitHub Pages simplicity. It includes:

- character roster data
- stage data
- main menu and gallery flow
- story mode and save slots
- battle mode setup
- character select and stage select
- ready/versus countdown
- battle canvas/fight loop
- training mode
- tournament mode
- settings and language dropdown logic
- HUD/battle screen updates
- placeholder menu/announcer audio logic

## Added handoff/refactor folders

These folders are included so another chat/dev can modularize later without guessing structure:

```text
src/
src/data/
src/modes/
src/ui/
src/systems/
data/
```

Data snapshots are included in both `src/data/` and `data/`:

```text
characters.json
stages.json
current_game_data_snapshot.js
```

The JSON files are reference snapshots. The live game currently reads from `game.js`.

## Organized asset folders added

Original asset paths are preserved so the game stays playable. Copies/placeholders were added here for handoff clarity:

```text
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

## Included asset types

- current playable UI backgrounds/templates
- main menu shell/background
- character select templates
- stage select templates
- ready/versus templates
- battle HUD manifest/notes
- stage background images
- current playable Rai/Nico/Shanti sprite folders from the latest demo
- character select/menu cards from the non-sprite handoff package

## Recent preserved work

- ornate main menu and battle HUD work
- Battle Mode / Training Mode / Tournament Mode flow
- best-2-of-3 round logic
- timer and health-layer settings
- match-over popup
- stage carousel / stage gallery scrollbar
- CPU side selection support
- Settings language dropdowns for English, Spanish, and Japanese

## GitHub Pages deploy

Upload/replace the contents of this folder into the repository root:

```text
index.html
style.css
game.js
README.md
assets/
src/
data/
```

Do not upload this zip as a nested site folder. `index.html` must sit at the repo root.
