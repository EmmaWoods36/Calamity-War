# Calamity War

**Calamity War** is a 2.5D fighting game demo by **Emma Woods Studio**.

This repo is intended to be used with GitHub Pages.

## Correct GitHub folder structure

Your repository should look like this:

```text
Calamity-War/
├─ index.html
├─ README.md
├─ assets/
│  ├─ sprites/
│  ├─ spliced_sprites/
│  ├─ select_cards/
│  ├─ stages/
│  └─ ui/
│     └─ splash/
│        └─ emma_woods_studio_splash.jpeg
├─ patches/
│  └─ splash_screen/
│     ├─ emma_woods_splash.css
│     ├─ emma_woods_splash.js
│     └─ index_html_snippet.txt
├─ game_code_patch/
│  └─ src/
│     ├─ calamity_war_character_select_settings_patch.js
│     └─ calamity_war_ui_patch.css
└─ game_code_translation_patch/
```

The important rule:

```text
index.html must be at the root of the repo.
```

You should **not** have to click into another `Calamity_War/` folder to find `index.html`.

## Upload order for beginners

Use this order:

1. Upload/copy `index.html` and `README.md` first.
2. Extract the split zips into one local merge folder.
3. Copy the contents inside the merged `Calamity_War/` folder into the repo root.
4. Commit and push using GitHub Desktop.

## Split zip extraction order

Extract the parts into the same parent folder:

1. PART 00
2. PART 01
3. PART 02
4. PART 03
5. PART 04
6. PART 05
7. PART 06
8. PART 07
9. PART 08
10. PART 09

When Windows asks to merge folders, choose **merge/replace**.

## Do not upload the zips as the actual website

GitHub Pages needs the extracted files, not the zip archives.

Good:

```text
Calamity-War/
├─ index.html
├─ assets/
├─ patches/
└─ game_code_patch/
```

Bad:

```text
Calamity-War/
└─ Calamity_War_WITH_SPLASH_SMALL_PART_00_code_patch_manifests.zip
```

## Splash screen

The Emma Woods Studio splash screen files come from PART 00.

The expected files are:

```text
assets/ui/splash/emma_woods_studio_splash.jpeg
patches/splash_screen/emma_woods_splash.css
patches/splash_screen/emma_woods_splash.js
```

This `index.html` already includes the splash CSS/JS references.

## Notes

This `index.html` is a clean GitHub Pages root shell. It is meant to prevent confusion and give the repo a valid landing page while the full playable game code is being integrated.

When the full game engine files are ready, add the real engine scripts above the patch scripts near the bottom of `index.html`.
