# Calamity War — Browser Demo V0.3

This is an early playable browser prototype for the Calamity War fighting game concept.

## What is included

- Main Menu using the preferred first-menu direction
- Character Select with expanded roster placeholders
- Story Mode demo flow
- Story Mode difficulty setup
  - Easy
  - Normal
  - Hard
  - EXTREME
- PvP Mode setup screen
  - Versus Player: local two-player fight on one keyboard
  - Versus CPU: Player 1 fights a CPU-controlled opponent
  - CPU vs CPU: watch-mode fight for QA and balance testing
- CPU difficulty setup for CPU modes
  - Easy
  - Normal
  - Hard
  - EXTREME
- Training Mode
  - Infinite health and meter
  - Non-attacking practice dummy
  - Press R to reset spacing
- Options
  - Show hitboxes
  - Story assist hints
  - Handicap testing: P1/P2/CPU HP boost or reduction
- Stage Gallery
- 4 generated stage backgrounds:
  - Malachai Manor Ruins
  - Moonlit Forest Path
  - Fortress Courtyard
  - Purple Torch Hall

## Controls

### Player 1
- Move: A / D
- Jump: W
- Guard: S
- Light Attack: J
- Heavy Attack: K
- Special: L

### Player 2 Local PvP
- Move: Left / Right Arrow
- Jump: Up Arrow
- Guard: Down Arrow
- Light Attack: 1
- Heavy Attack: 2
- Special: 3

### General
- Enter: Main menu start / continue story
- Escape: Main menu
- R: Retry, rematch, or reset training spacing

## Difficulty behavior

Story difficulty changes story enemy HP, CPU aggression, guard rate, special usage, and damage.

CPU difficulty applies to Versus CPU and CPU vs CPU modes.

EXTREME is intentionally aggressive and is mainly for stress testing.

## Handicap behavior

The Handicap option is in Options and applies when a fight starts.

Available handicap choices:

- Off
- Player 1 +25% HP
- Player 2 / CPU +25% HP
- Player 1 -25% HP
- Player 2 / CPU -25% HP

## Demo story content

The current story route adapts the first major mission arc:

1. The Explosion
2. The Deal
3. Forest Ambush
4. Shanti Alone
5. Rai vs Nico
6. Fortress Courtyard
7. Nico vs Roger
8. Rai vs the Handler
9. To Be Continued

## Suggested QA checks for V0.3

- Story Mode opens the difficulty setup first
- Easy / Normal / Hard / EXTREME buttons visibly switch
- Story fights respect the selected difficulty
- PvP opens battle setup
- Versus Player works with two local control sets
- Versus CPU starts a Player 1 vs CPU fight
- CPU vs CPU starts a watch-mode fight with both fighters moving automatically
- Training Mode still has infinite health and meter
- Handicap settings apply on new fights
- R rematches/reset spacing correctly
- Escape returns to the main menu

## Next build targets

- Add the rest of the story progression once more panels are available
- Add additional fight backgrounds
- Add better character sprites / animation sheets
- Add tag-team mechanics for Rai + Shanti and Rai + Nico
- Add boss phases and scripted losses
- Add save data for story chapter unlocks


## V0.5 JPEG-only asset update

All stage and menu images were converted from PNG to JPG to avoid browser/GitHub Pages asset loading issues. Keep the `assets/` folder next to `index.html` and preserve the lowercase `.jpg` filenames exactly.

Expected assets:

```text
assets/main_menu.jpg
assets/character_select.jpg
assets/bg_dojo_ruins.jpg
assets/bg_forest.jpg
assets/bg_fortress_courtyard.jpg
assets/bg_fortress_hall.jpg
```
