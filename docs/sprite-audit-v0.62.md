# Calamity War — Sprite Audit v0.62
**Date:** September 13, 2026
**Auditor:** Automated + Visual inspection of all 33 playable characters
**Method:** Per-character contact sheets with select card + all 12 poses on checkerboard backgrounds

---

## Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P0 | 4 characters | Wrong character mapped to sprite |
| P1 | 5 characters | Opaque/non-transparent backgrounds |
| P2 | 5 characters | Chroma-key transparency bleed on white clothing |
| P3 | 1 character | Cropped/incomplete sprites |
| P4 | 6 characters | Stray fragments or floating text |
| Clean | 12 characters | No issues found |

---

## P0 — Wrong Character Mapped (Critical)

### Akira (11 of 12 poses wrong)
- **Affected:** idle, walk_forward, walk_back, crouch, guard, light, heavy, special, jump, hurt, victory
- **Issue:** All show a character with black dreadlocks and white/blue/gold martial artist outfit instead of the silver-haired Akira from the select card
- **Note:** Only `ko` correctly matches the select card
- **Fix:** Regenerate all 11 poses using select card as reference

### Rose (11 of 12 poses wrong)
- **Affected:** idle, walk_forward, walk_back, crouch, guard, light, heavy, special, jump, hurt, victory
- **Issue:** Shows a character in modern streetwear (black braided pigtails, crop top hoodie, athletic tights, sneakers) instead of the green-haired golden knight armor Rose from the select card
- **Note:** Only `ko` matches the select card design
- **Fix:** Regenerate all 11 poses using select card as reference

### Shanti (1 pose wrong)
- **Affected:** victory
- **Issue:** Shows a pale male in a black coat/trenchcoat with short black hair instead of Shanti (female with magenta/purple braids)
- **Fix:** Regenerate victory pose using select card as reference

### Tenganisha (2 poses wrong)
- **Affected:** heavy, victory
- **Issue:** Shows a female warrior with long magenta hair in dark bikini armor instead of Tenganisha (male with long black hair in dark longcoat)
- **Fix:** Regenerate heavy and victory poses using select card as reference

---

## P1 — Opaque/Non-Transparent Backgrounds

These sprites have solid light-gray rectangular backgrounds instead of transparent alpha channels.

### Akila (9 poses)
- **Affected:** idle, walk_forward, walk_back, crouch, guard, light, heavy, special, jump
- **Clean:** hurt, ko, victory
- **Fix:** Remove background using flood-fill or threshold approach

### Shinichi (6 poses)
- **Affected:** idle, guard, light, heavy, special, jump
- **Clean:** walk_forward, walk_back, crouch, hurt, ko, victory
- **Note:** `light` also has a stray duplicate limb fragment
- **Fix:** Remove background + clean stray fragment

### Yuta (5 poses)
- **Affected:** idle, light, heavy, special, jump
- **Clean:** walk_forward, walk_back, crouch, hurt, ko, victory
- **Note:** `idle` has a small stray dot; `light` has a disconnected stray foot fragment
- **Fix:** Remove background + clean stray fragments

### Goro (6 poses)
- **Affected:** idle, guard, light, heavy, special, jump
- **Clean:** walk_forward, walk_back, crouch, hurt, ko, victory
- **Note:** `idle` has stray fragment at right edge; `guard` has stray limb/weapon fragment; `light` has stray sliver
- **Fix:** Remove background + clean stray fragments

### Dante Aries (6 poses)
- **Affected:** idle, guard, light, heavy, special, jump
- **Clean:** walk_forward, walk_back, crouch, hurt, ko, victory
- **Note:** `idle` has stray fragment near right border; `guard` has stray sword tip artifact
- **Fix:** Remove background + clean stray fragments

---

## P2 — Chroma-Key Transparency Bleed

White clothing was incorrectly keyed as transparent during sprite extraction, causing the checkerboard background to show through white garments.

### Adrian (9 poses)
- **Affected:** idle, walk_forward, walk_back, crouch, guard, light, heavy, special, jump
- **Clean:** hurt, ko, victory
- **Issue:** Magenta checkerboard bleeds through white coat and pants

### Malachai (6 poses)
- **Affected:** idle, guard, light, heavy, special, jump
- **Clean:** walk_forward, walk_back, crouch, hurt, ko, victory
- **Issue:** Severe transparency bleed on white coat and pants

### Machai (6 poses)
- **Affected:** idle, guard, light, heavy, special, jump
- **Clean:** walk_forward, walk_back, crouch, hurt, ko, victory
- **Issue:** Magenta checkerboard bleeds through white coat, sleeves, and trousers

### Raijin (2 poses)
- **Affected:** light, heavy
- **Clean:** All other poses
- **Issue:** Minor pink transparency bleed on white chest/lapel area

### Esther (1 pose)
- **Affected:** idle
- **Clean:** All other poses
- **Issue:** Checkerboard bleed on upper right sleeve/shoulder of white coat

### Nico (1 pose)
- **Affected:** crouch
- **Clean:** All other poses
- **Issue:** Magenta blotches on right thigh/knee of white pants

---

## P3 — Cropped/Incomplete Sprites

### Michelle (3 poses)
- **light:** Head/hair clipped at top edge of canvas
- **jump:** Entire upper body/head horizontally cropped and missing
- **ko:** Stray pink/magenta artifact directly above character
- **Note:** These were pre-existing issues not fixed by the regeneration pass

---

## P4 — Stray Fragments and Floating Text

### Floating text artifacts (likely from sprite sheet labels)
- **Rikku/ko:** Floating text "M W" above character
- **Roger/ko:** Floating text "M H" above character
- **Mahje/ko:** Floating text "ABUR" above character
- **Rose/ko:** Stray text "RO" beneath sprite

### Stray sprite fragments
- **Rikku/light:** Small stray black fragment near bottom-right
- **Shinichi/light:** Stray duplicate limb fragment on right edge
- **Yuta/idle:** Small stray dot beneath feet
- **Yuta/light:** Disconnected stray foot fragment on right side
- **Miwa/light:** Faint rectangular border artifact on left edge
- **Miwa/jump:** Stray floating debris/specks above character
- **Semuda/crouch:** White background fragment behind rear thigh

---

## Clean Characters (No Issues)

1. **Rai** — All 12 poses clean
2. **Mani** — All 12 poses clean
3. **Diego** — All 12 poses clean
4. **Daisuke** — All 12 poses clean (regenerated idle and light)
5. **Nikki** — All 12 poses clean (regenerated guard, heavy, jump, special)
6. **Awar Aries** — All 12 poses clean (fixed transparency)
7. **Pierre** — All 12 poses clean
8. **Mammon** — All 12 poses clean
9. **Diastre** — All 12 poses clean
10. **Nox Aries** — All 12 poses clean
11. **Seccla Aries** — All 12 poses clean
12. **Baburu** — All 12 poses clean

---

## Missing Characters (No Sprite Folders)

- **Danpen Shikake** — No sprite folder exists
- **Danpen Tokei** — No sprite folder exists
- **Training Dummy Ninja** — No sprite folder exists
- **Fortress Guard** — Not in repo (user will provide)
- **Training Dummy Shadow** — Exists but incomplete (missing walk_forward, guard, heavy, victory poses)

---

## Recommended Fix Priority

1. **P0 first** — Wrong characters are game-breaking. Regenerate Akira (11 poses), Rose (11 poses), Shanti/victory, Tenganisha/heavy+victory
2. **P1 second** — Opaque backgrounds are very visible. Remove backgrounds from Akila, Shinichi, Yuta, Goro, Dante
3. **P2 third** — Transparency bleed looks bad in-game. Re-extract or regenerate affected poses for Adrian, Malachai, Machai, Raijin, Esther, Nico
4. **P3 fourth** — Cropped sprites need regeneration. Michelle/light, jump, ko
5. **P4 fifth** — Quick cleanup of stray fragments and text

---

## Notes on User Requests

- **Punch/kick sprites:** User wants all characters to have punch and kick attack sprites for more fluid combat animation. This would require generating 2 new poses per character (70+ new sprites).
- **Animation layering:** User wants smoother fight transitions. This requires tweening/interpolation between poses in the game engine.
- **Training dummies and fortress guards:** User will send these sprites separately.
- **Music lag fix:** Fixed in this session — added splash→music bridge that arms one-time listeners for audio unlock on first user interaction after splash fades.
