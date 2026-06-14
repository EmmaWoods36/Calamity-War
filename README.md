# Calamity War - Combined Asset Handoff

This package combines the organized sprite set **and** the finalized character portrait cards into one coding-chat-ready zip.

## Main folders

```txt
assets/sprites/                  # gameplay sprite PNGs (transparent, generally 900x900)
assets/select_cards/             # FINAL portrait face cards for character select
assets/select_cards_legacy/      # older simple select cards preserved for backup
assets/head_cards/               # nested portrait-card structure from the card package
flat_character_cards/            # flat copies of the portrait cards
previews/                        # contact sheets for review only
manifest.csv                     # combined asset manifest
README.md
```

## What was cleaned / added

- Preserved the incoming organized sprite structure.
- Replaced the original `assets/select_cards/` with the **final portrait face cards** for better select-screen consistency.
- Moved the older simple select cards to `assets/select_cards_legacy/`.
- Spliced the following 10-pose source cards into individual transparent 900x900 sprite PNGs:
  - `semuda`
  - `tenganisha`
  - `training_dummy_shadow`
- Kept each original 10-pose source card in its `source_cards/` folder for reference.
- Added `_MISSING.txt` placeholders when a standard pose was not present in the source card.
- Fixed the broken empty file `assets/sprites/daisuke/daisuke_heavy.png` by replacing it with a `_MISSING.txt` placeholder.
- Added select-card aliases where helpful for naming consistency:
  - `tenganisha` / `tenagnisha`
  - `danpen_tokei` / `danpen_toukei`
  - `machi` / `machai`

## Standard sprite pose target

Most folders follow this general pattern when available:

- idle
- light
- heavy
- special
- guard
- jump
- hurt
- ko
- crouch
- walk_forward
- walk_back

If a pose does not exist yet, a matching `_MISSING.txt` placeholder is included instead of silently faking the asset.

## Notes for the coding chat

- Use files in `assets/select_cards/` for the **final character select portrait cards**.
- Use files in `assets/sprites/` for battle sprites.
- `assets/head_cards/` and `flat_character_cards/` are redundant convenience copies of the same portrait-card set.
- `previews/` are for human review only and should not be wired into the game.


---

## Translation patch added

This package now includes a direct in-code translation patch:

```txt
game_code_translation_patch/src/calamity_war_direct_translations.js
```

It contains English, Spanish, and Japanese text directly inside JavaScript code for menus, options, story mode UI, battle setup, character select, stage select, fight HUD, training mode, tournament mode, credits, starter story text, and character display names.

Because this asset handoff did not include the live game source files, the translation module was added as a drop-in code patch rather than overwriting `index.html` or `main.js`.
