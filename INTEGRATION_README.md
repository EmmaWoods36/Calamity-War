# Calamity War Integrated Patch Package

This package merges the uploaded Calamity War handoff, the three existing character sprite packs, the direct EN/ES/JA translation patch, and the newly spliced sprite batch.

## What changed

- Merged `Calamity_War_CHARACTER_SPRITES_PART_01.zip`, `PART_02.zip`, and `PART_03.zip` into `assets/sprites/`.
- Added the newly spliced Batch 1 + Batch 2 sprites into `assets/spliced_sprites/`.
- Added character-named spliced variants into `assets/sprites/<character_id>/`.
- Replaced `_ko_MISSING.txt` placeholders with spliced KO PNGs where a KO asset was available.
- Added fallback `*_idle.png` files for newly introduced characters that only existed in the spliced sheets.
- Added `manifest_spliced_integrated.csv` listing integrated spliced sprite paths.
- Kept the direct hardcoded language module at `game_code_translation_patch/src/calamity_war_direct_translations.js` and expanded it with missing menu/settings keys.
- Added a drop-in UI/code patch at `game_code_patch/src/calamity_war_character_select_settings_patch.js`.
- Added matching drop-in CSS at `game_code_patch/src/calamity_war_ui_patch.css`.

## Character Select patch coverage

The new drop-in JS/CSS covers the requested behavior as an integration shim:

- Centers `Continue to Battle Stage` under the character gallery.
- Adds `Random P1`, `Random P2`, and `Random Match Up` above the continue button.
- On hover/touch, rapidly cycles character selection previews.
- On click/touch end, locks the random selection.
- `Random P1` affects Player 1 only.
- `Random P2` affects Player 2 only.
- `Random Match Up` affects both sides.
- Rewrites visible `Player 2 / CPU` text to `Player 2`.
- Adds a CPU-side selector state helper so CPU can be P1 or P2 in logic.
- Adds a match-end popup helper with Rematch / Character Select / Main Menu.

## How to wire the code patch into the actual game HTML

If the playable game has an `index.html`, add these after the translation script and before or after the main game script:

```html
<link rel="stylesheet" href="game_code_patch/src/calamity_war_ui_patch.css">
<script src="game_code_translation_patch/src/calamity_war_direct_translations.js"></script>
<script src="game_code_patch/src/calamity_war_character_select_settings_patch.js"></script>
```

The patch is defensive: it tries common DOM selectors and dispatches events if the existing game has different internal function names.

## Important limitation

The uploaded “rest of game” zip still does not appear to include the actual live playable source files such as `index.html`, `main.js`, `game.js`, or `style.css`. Because of that, I could not directly modify the real screen code in-place. I added the implementation as a drop-in patch module instead and integrated the sprites/assets into the expected asset structure.

## Pending once the actual playable source is available

- Directly insert script/link tags into `index.html`.
- Replace/merge any existing Character Select function with the random roulette logic.
- Wire CPU-side selector to the game’s exact battle setup state object.
- Wire match-end popup buttons to the exact scene router.
- Verify stage carousel DOM names and large preview behavior in the live game.
- Confirm victory-sheet assets once a victory sheet is uploaded; this batch contained standing/KO style assets, not a dedicated victory sheet.
