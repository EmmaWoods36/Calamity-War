# Calamity War — Foundation Audit v0.57

**Date:** September 13, 2026
**Baseline:** commit fa69198 (v0.56 combat polish)
**Auditor:** Perplexity Computer

## Summary

The game is functional but carries significant technical debt from rapid prototyping. This audit identifies the most impactful issues that should be resolved before building new systems.

## Critical Findings

### 1. Title Version Stale
- `index.html` title says "Calamity War — Demo V0.54"
- Actual version is v0.56. Must be updated.

### 2. 404 Asset Errors (37 total)
Three categories of missing assets generating console warnings:

| Missing Asset | Count | Cause |
|---|---|---|
| `assets/ui/character_select/random_card.jpg` | 1 | Path wrong — file is at `assets/ui/random_card.jpg` or doesn't exist |
| `assets/sprites/danpen_shikake/*.png` | 12 | Folder has only subfolders (duo, shikake, toukei), no sprite files |
| `assets/sprites/danpen_tokei/*.png` | 12 | Same — subfolders exist but no direct sprites |
| `assets/sprites/training_dummy_ninja/*.png` | 12 | Folder doesn't exist at all |

**Root cause:** `SPRITE_FILE_ALIASES` maps `danpen → danpen_shikake`, but `danpen_shikake` has no sprite files. The `trainingDummyVariantKey()` function can return `training_dummy_ninja` which has no folder.

**Fix:** Make sprite loading gracefully handle missing folders, or create placeholder sprites. Since danpen characters are locked, suppress sprite preloading for locked characters.

### 3. Duplicate Files

| File A | File B | Action |
|---|---|---|
| `assets/ui/main_menu/calamity-menu-selector.js` | `assets/main_menu/calamity-menu-selector.js` | Remove one copy |
| `assets/ui/main_menu/calamity-menu-selector.css` | `assets/main_menu/calamity-menu-selector.css` | Remove one copy |
| `src/data/current_game_data_snapshot.js` | `data/current_game_data_snapshot.js` | Remove both if unused |
| `assets/bg_*.jpg` (16 files) | `assets/stages/bg_*.jpg` (16 files) | Consolidate to `assets/stages/` |

### 4. Stage Placeholder Text
"TEMPORARY VISIBLE STAGE PLACEHOLDER" visible in stage select. This text appears to be baked into `assets/stage_select_template.png` or rendered by CSS `.bg-stage-template`.

### 5. UI Layout Overlaps

**Character Select:**
- "CHARACTER SELECT" title collides with top row of roster cards
- Bottom buttons clipped at screen edge
- Portrait boxes are empty black rectangles

**Stage Select:**
- "SELECT BATTLE STAGE" title obscured by central card panel
- Stage name appears twice in different fonts
- CONTINUE button click target issues

**Fight HUD:**
- "PLAYER 2" label overlaps with "EXIT" text
- Timer/stage name/round info collision under timer
- "KANI" label clips portrait frame borders
- Empty portrait boxes at top corners

### 6. Placeholder/Debug Content
- World Map: "story world hub placeholder" text
- Calamity Sports: "placeholder doors for now" text
- Gallery: "Placeholder hub for unlockables" text
- Settings: "Announcer voice placeholder" label
- Debug toggle: "Show hitboxes" visible in settings

### 7. Code Architecture
- `game.js` is 4,164 lines — a monolith containing all game logic
- No separation between data (characters, stages), systems (combat, AI, rendering), and UI
- Character data, attack data, stage data, AI logic, rendering, input handling, and UI management are all in one file
- This makes targeted changes risky

### 8. Sprite Scale Inconsistency
- No canonical scale metadata for characters
- All sprites are 900x900 but characters have wildly different canonical heights/ages
- A 12-year-old (Rai) and a 42-year-old warlord (Dante) may appear the same size
- Need per-character scale factors

### 9. Asset Organization
- Stage backgrounds exist in both `assets/` and `assets/stages/` (duplicated)
- VFX folder has only a README
- `patches/` folder contains splash screen code that should be integrated or removed
- `data/` and `src/data/` contain snapshot files of unclear purpose

## Recommended Patch Order (v0.57)

1. **Fix title version** — Update index.html title to v0.56
2. **Fix 404 errors** — Guard sprite loading for locked/missing characters
3. **Remove duplicate files** — Consolidate stage images, remove duplicate JS/CSS
4. **Fix stage placeholder** — Remove or replace placeholder template text
5. **Fix UI overlaps** — Character select title, fight HUD labels, portrait boxes
6. **Create audit document** — This file, committed to repo

## Deferred to v0.58+

- Code separation (splitting game.js into modules)
- Sprite scale standardization
- Full asset pipeline reorganization
- Removing placeholder text for sports/gallery modes
- Portrait box artwork
