# Calamity War — Phase 1 Balance Audit

**Version:** v0.61  
**Date:** September 13, 2026  
**Scope:** Per-character combat balance using extracted ATTACK_DATA, character stats, movement constants, and meter rules from `game.js`

---

## 1. Combat System Architecture

### 1.1 Attack Data (Global — Shared by All Characters)

All 35 playable characters use a single global `ATTACK_DATA` object. There are **no per-character attack overrides**. The only combat differentiators between characters are HP, speed, and power multiplier.

| Attack | Startup | Active | Recovery | Total | Damage | Range | Height | Knockback | Launch | Meter Gain | Hitstun | Blockstun | Chip Dmg |
|--------|---------|--------|----------|-------|--------|-------|--------|-----------|--------|------------|---------|-----------|----------|
| Light  | 4f      | 6f     | 4f       | 14f   | 8      | 54px  | 54px   | 9         | -2.2   | 12         | 18f     | 10f       | 0.28     |
| Heavy  | 8f      | 8f     | 7f       | 23f   | 15     | 72px  | 54px   | 13        | -3.8   | 12         | 22f     | 12f       | 0.28     |
| Special| 12f     | 12f    | 7f       | 31f   | 22     | 105px | 78px   | 16        | -4.5   | 7          | 28f     | 14f       | 0.35     |

**Hitstop (freeze frames on hit):** Light 3f, Heavy 6f, Special 10f

### 1.2 Damage Formula

```
damage = ATTACK_DATA[kind].damage * character.power * damageMod
```

- `character.power` — per-character multiplier (0.82 to 1.42)
- `damageMod` — 1.0 normally; 1.12 for God-mode characters; multiplied by difficulty `enemyDamage` for AI

### 1.3 Movement

```
moveSpeed = character.speed * (isAI ? aiMovement : 1) * (guard ? 0.45 : 1)
```

- Jump velocity: -12.5
- Gravity: 0.75/frame
- Canvas: 960x540, floorY = 430
- Fighter hurtbox: 48x112 (uniform for all characters)

### 1.4 Meter System

| Parameter | Normal | God Mode (AKILA) |
|-----------|--------|------------------|
| Max meter | 100 | 140 |
| Starting meter | 10 | 70 |
| Special cost | 32 | 32 |
| Meter per hit (L/H) | 12 | 12 |
| Meter per hit (Special) | 7 | 7 |

**Meter economy:** 2.7 hits (light/heavy) to build enough meter for one special. At ~23 frames per heavy cycle, that's ~61 frames (~1.0s) of sustained hitting. God mode starts with 70 meter — enough for 2 immediate specials.

### 1.5 AI Difficulty Tiers

AI parameters are global per difficulty, not per-character:

| Difficulty | Damage Mod | Aggression | Guard Rate | Special Rate | Cooldown (min-max) | Movement |
|------------|-----------|------------|------------|--------------|---------------------|----------|
| Easy | 0.72 | 0.48 | 0.004 | 0.045 | 48-58f | 0.84x |
| Normal | 1.00 | 0.68 | 0.006 | 0.10 | 28-28f | 1.00x |
| Hard | 1.18 | 0.82 | 0.011 | 0.15 | 18-22f | 1.08x |
| Extreme | 1.42 | 0.95 | 0.018 | 0.22 | 10-16f | 1.18x |

### 1.6 Stats Array (Display Only)

The 5-value `stats` array shown in the character select UI (e.g. `[84, 88, 62, 78, 86]`) is **not used in combat calculations**. It only drives the stat bars in the selection panel. Actual combat uses only `hp`, `speed`, and `power`.

---

## 2. Per-Character Balance Table

### 2.1 Full Roster (sorted by Combat Rating)

Combat Rating (CR) = HP × Speed × Power — a composite of survivability, mobility, and damage output.

| Character | HP | Speed | Power | Heavy DPS | Special DPS | TTK (heavy) | CR | CR vs Avg |
|-----------|-----|-------|-------|-----------|-------------|-------------|------|-----------|
| **AKILA** | 145 | 5.05 | 1.32 | 51.7 | 56.2 | 142f (2.4s) | 967 | **1.74x** |
| **DIASTRE** | 155 | 4.45 | 1.38 | 54.0 | 58.8 | 136f (2.3s) | 952 | **1.72x** |
| **AKIRA** | 135 | 4.95 | 1.28 | 50.1 | 54.5 | 146f (2.4s) | 855 | **1.54x** |
| **DANPEN** | 150 | 4.20 | 1.30 | 50.9 | 55.4 | 144f (2.4s) | 819 | **1.48x** |
| **DANTE ARIES** | 170 | 3.10 | 1.42 | 55.6 | 60.5 | 132f (2.2s) | 748 | **1.35x** |
| MAHJE | 116 | 4.65 | 1.18 | 46.2 | 50.2 | 159f (2.7s) | 636 | 1.15x |
| RAIJIN | 150 | 3.25 | 1.28 | 50.1 | 54.5 | 146f (2.4s) | 624 | 1.12x |
| MAMMON | 160 | 2.80 | 1.36 | 53.2 | 57.9 | 138f (2.3s) | 609 | 1.10x |
| MALACHAI | 140 | 3.40 | 1.25 | 48.9 | 53.2 | 150f (2.5s) | 595 | 1.07x |
| DIEGO | 120 | 4.05 | 1.18 | 46.2 | 50.2 | 159f (2.7s) | 573 | 1.03x |
| AWAR ARIES | 120 | 4.25 | 1.12 | 43.8 | 47.7 | 167f (2.8s) | 571 | 1.03x |
| SHINICHI | 118 | 4.35 | 1.10 | 43.0 | 46.8 | 170f (2.8s) | 565 | 1.02x |
| GORO VOSS | 155 | 2.65 | 1.35 | 52.8 | 57.5 | 139f (2.3s) | 555 | 1.00x |
| TENGANSHA | 128 | 3.75 | 1.15 | 45.0 | 49.0 | 163f (2.7s) | 552 | 0.99x |
| RAI | 112 | 4.45 | 1.08 | 42.3 | 46.0 | 173f (2.9s) | 538 | 0.97x |
| NICO | 106 | 4.85 | 1.04 | 40.7 | 44.3 | 180f (3.0s) | 535 | 0.96x |
| MACHAI | 118 | 4.10 | 1.10 | 43.0 | 46.8 | 170f (2.8s) | 532 | 0.96x |
| ADRIAN | 125 | 3.80 | 1.12 | 43.8 | 47.7 | 167f (2.8s) | 532 | 0.96x |
| BABURU | 128 | 3.55 | 1.16 | 45.4 | 49.4 | 161f (2.7s) | 527 | 0.95x |
| ESTHER | 124 | 3.85 | 1.08 | 42.3 | 46.0 | 173f (2.9s) | 516 | 0.93x |
| MIWA | 115 | 4.15 | 1.08 | 42.3 | 46.0 | 173f (2.9s) | 515 | 0.93x |
| VASTA | 114 | 4.00 | 1.12 | 43.8 | 47.7 | 167f (2.8s) | 511 | 0.92x |
| WRAITH | 120 | 3.80 | 1.12 | 43.8 | 47.7 | 167f (2.8s) | 511 | 0.92x |
| MANI | 112 | 4.35 | 1.04 | 40.7 | 44.3 | 180f (3.0s) | 507 | 0.91x |
| YUTA | 104 | 4.55 | 1.04 | 40.7 | 44.3 | 180f (3.0s) | 492 | 0.89x |
| NIKKI | 102 | 4.75 | 1.00 | 39.1 | 42.6 | 187f (3.1s) | 484 | 0.87x |
| MICHELLE | 104 | 4.50 | 1.03 | 40.3 | 43.9 | 182f (3.0s) | 482 | 0.87x |
| RIKKU | 98 | 4.90 | 1.00 | 39.1 | 42.6 | 187f (3.1s) | 480 | 0.87x |
| DAISUKE | 108 | 4.00 | 1.10 | 43.0 | 46.8 | 170f (2.8s) | 475 | 0.86x |
| SHANTI | 105 | 4.00 | 1.06 | 41.5 | 45.1 | 176f (2.9s) | 445 | 0.80x |
| ROGER | 130 | 2.90 | 1.18 | 46.2 | 50.2 | 159f (2.7s) | 445 | 0.80x |
| ROSE | 108 | 4.00 | 1.02 | 39.9 | 43.4 | 183f (3.1s) | 441 | 0.79x |
| PIERRE | 105 | 3.90 | 1.00 | 39.1 | 42.6 | 187f (3.1s) | 410 | 0.74x |
| **FORTRESS GUARD** | 90 | 3.10 | 0.90 | 35.2 | 38.3 | 208f (3.5s) | 251 | **0.45x** |
| **AMBUSHER** | 80 | 2.80 | 0.82 | 32.1 | 34.9 | 228f (3.8s) | 184 | **0.33x** |
| **Averages** | **122** | **3.98** | **1.12** | **44.5** | **48.4** | **167f (2.8s)** | **555** | — |

> **DPS note:** Heavy DPS = (15 × power × 60) / 23. Special DPS = (22 × power × 60) / 31. These are theoretical maximums assuming every hit connects. TTK = frames to kill an average-HP opponent (122 HP) using only heavy attacks.

---

## 3. Outlier Analysis

### 3.1 Overtuned Characters

#### AKILA — CR 967 (1.74x average)

The single most overtuned character. She has the `hiddenGod: true` flag, which grants:
- **+12% damage** via `damageMod: 1.12` (effective power: 1.32 × 1.12 = 1.478)
- **140 max meter** (1.4x normal — more special usage)
- **70 starting meter** (can fire 2 specials at match start)
- Enhanced AI parameters (0.92 aggression, 0.24 special rate, 1.16 movement)

On top of that, her base stats are already the best in the game:
- Highest speed (5.05) — 1.27x average
- Second-highest HP (145) — 1.19x average
- Second-highest power (1.32) — 1.18x average

**Proposed tuning:**
- Remove `hiddenGod` flag OR reduce base stats to compensate
- If keeping hiddenGod: reduce HP to 125, speed to 4.45, power to 1.18
- If removing hiddenGod: reduce HP to 130, speed to 4.75, power to 1.22

#### DIASTRE — CR 952 (1.72x average)

Highest HP among standard characters (155), second-highest power (1.38), and above-average speed (4.45). A fast tank with devastating damage.

**Proposed tuning:**
- Reduce HP from 155 to 135
- OR reduce power from 1.38 to 1.22
- OR reduce speed from 4.45 to 3.80

#### AKIRA — CR 855 (1.54x average)

Near-clone of AKILA without the God mode bonus. HP 135, speed 4.95, power 1.28 — elite in every category.

**Proposed tuning:**
- Reduce speed from 4.95 to 4.35
- OR reduce HP from 135 to 115

#### DANPEN — CR 819 (1.48x average)

HP 150, speed 4.2, power 1.30. Strong all-around with no weakness.

**Proposed tuning:**
- Reduce HP from 150 to 130
- OR reduce power from 1.30 to 1.15

#### DANTE ARIES — CR 748 (1.35x average)

Highest HP (170) and highest power (1.42) in the game. Compensated by slowest speed among bosses (3.1), but the damage and survivability gap is too large.

**Proposed tuning:**
- Reduce HP from 170 to 145
- OR reduce power from 1.42 to 1.28

### 3.2 Undertuned Characters

#### AMBUSHER — CR 184 (0.33x average)

Lowest HP (80), lowest power (0.82), slow (2.8). Effectively a punching bag. This appears to be a story-mode NPC rather than a competitive fighter.

**Recommendation:** Either remove from the playable roster or buff to CR ~400:
- HP: 80 → 110
- Power: 0.82 → 1.00
- Speed: 2.8 → 3.8

#### FORTRESS GUARD — CR 251 (0.45x average)

HP 90, power 0.9, slow (3.1). Also appears to be an NPC-tier character.

**Recommendation:** Same as Ambusher — either remove or buff:
- HP: 90 → 115
- Power: 0.90 → 1.02
- Speed: 3.1 → 3.8

### 3.3 Speed Gap

The movement speed range is 2.65 (GORO) to 5.05 (AKILA) — a **1.9x difference**. GORO moves at 0.67x the average speed, making him nearly unplayable against fast characters who can kite indefinitely. Characters below 3.0 speed (GORO, ROGER, DANTE) struggle to close distance against characters at 4.5+ speed.

**Proposed:** Consider a speed floor of 3.0 and a speed cap of 4.8 for competitive characters, or implement a dash system that partially closes the gap.

### 3.4 HP Range

HP ranges from 80 (AMBUSHER) to 170 (DANTE) — a **2.1x difference**. At the current average heavy DPS of 44.5, TTK ranges from 132f (2.2s) to 228f (3.8s). A 1.6s TTK difference is significant — the slowest-killing character takes 73% longer to die.

**Proposed:** Tighten HP range to 100-150 for competitive characters.

---

## 4. Structural Issues

### 4.1 No Per-Character Attacks

All characters share identical frame data (startup, active, recovery, range, knockback, launch). This means:
- No character has a faster light or a longer-range heavy
- No character has better frame advantage on block
- No character has different special properties (projectile, command grab, AoE)
- The only gameplay difference is how fast you move and how hard you hit

**Impact:** The game feels homogeneous. Picking DANTE vs RAI is just "more HP/damage vs more speed" — not a different playstyle.

**Recommendation (Phase 2+):** Introduce per-character attack data overrides. At minimum, vary startup/recovery/range by character class (fast characters get faster lights, heavy characters get longer range heavies, etc.).

### 4.2 Uniform Hurtbox

All fighters have hurtbox 48x112 regardless of visual size. GORO (visual height 208px) and RIKKU (visual height 178px) have the same hitbox. This means large characters are harder to hit visually but not mechanically — their sprite extends beyond the hurtbox.

**Recommendation:** Consider scaling hurtbox height proportionally to CHARACTER_VISUALS height, or at least have 2-3 hurtbox size tiers.

### 4.3 Stats Array Is Cosmetic

The 5-stat display (Power, Speed, Defense, Technique, Special) in the character select panel does not reflect actual combat values. A character with 99 Defense still takes the same damage as one with 40 Defense. This misleads players.

**Recommendation:** Either wire the stats array to actual combat values, or relabel it as "Lore Stats" / "Story Stats."

### 4.4 No Passive Meter Gain

Unlike the session notes suggested, there is no `0.08/frame` passive meter gain in the code. Meter is only gained by landing hits (12 per light/heavy, 7 per special). This means defensive/zoning playstyles can't build meter, favoring rushdown.

**Recommendation:** Add a small passive meter gain (0.05-0.08/frame) so turtling isn't completely punished, or add meter gain on blocking (e.g., 3 meter per blocked hit).

---

## 5. Proposed Balance Changes Summary

### Tier 1: Critical (God Mode)

| Character | Current | Proposed Change | New CR |
|-----------|---------|-----------------|--------|
| AKILA | HP 145, Spd 5.05, Pwr 1.32, hiddenGod | Remove hiddenGod, reduce HP to 130, Spd to 4.75, Pwr to 1.22 | ~751 (1.35x) |

### Tier 2: Overtuned

| Character | Current | Proposed Change | New CR |
|-----------|---------|-----------------|--------|
| DIASTRE | HP 155, Pwr 1.38 | HP → 135, Pwr → 1.25 | ~748 (1.35x) |
| AKIRA | HP 135, Spd 4.95 | Spd → 4.35 | ~671 (1.21x) |
| DANPEN | HP 150, Pwr 1.30 | HP → 130, Pwr → 1.18 | ~645 (1.16x) |
| DANTE | HP 170, Pwr 1.42 | HP → 145, Pwr → 1.30 | ~583 (1.05x) |

### Tier 3: Undertuned

| Character | Current | Proposed Change | New CR |
|-----------|---------|-----------------|--------|
| AMBUSHER | HP 80, Spd 2.8, Pwr 0.82 | HP → 110, Spd → 3.8, Pwr → 1.00 | ~418 (0.75x) |
| FORTRESS GUARD | HP 90, Spd 3.1, Pwr 0.90 | HP → 115, Spd → 3.8, Pwr → 1.02 | ~445 (0.80x) |

### Tier 4: Mid-Range (No change needed)

Characters with CR between 450-650 (0.81x to 1.17x average) are in an acceptable range. This includes RAI, NICO, SHANTI, ADRIAN, MALACHAI, DIEGO, and ~20 others.

---

## 6. Future Roadmap (Acknowledged)

The user's vision for "sexy 2.5D/3D graphics with crazy visuals" and "transformation scenes" is noted as a future roadmap item. Per the vision document, this maps to Phase 17 (2.5D/3D Evolution). The current Phase 1 focus is on establishing a balanced, playable shell before visual upgrades.

**Dependencies for visual upgrades:**
- Per-character attack data (so transformations can modify movesets)
- Character height → hurtbox mapping (so size changes matter mechanically)
- Transformation meter system (separate from combat special meter?)

---

*Data extracted from game.js at commit `e73eef6` (v0.61). All frame counts at 60 FPS.*
