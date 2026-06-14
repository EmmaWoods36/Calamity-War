# Calamity War — Emma Woods Studio Splash Screen Patch

This patch adds the uploaded **Emma Woods Studio** image as the game startup splash screen.

## Files included

- `assets/ui/splash/emma_woods_studio_splash.jpeg`
- `patches/splash_screen/emma_woods_splash.css`
- `patches/splash_screen/emma_woods_splash.js`
- `patches/splash_screen/index_html_snippet.txt`

## How to install

Copy the included `Calamity_War/` folder contents into the root of the playable game project.

Then add the snippet from:

`patches/splash_screen/index_html_snippet.txt`

to the real `index.html`.

## Expected behavior

When the game loads:

1. Emma Woods Studio splash appears full-screen.
2. It stays up for about 2.6 seconds.
3. Player can click **Skip**.
4. Splash fades out.
5. Main menu/game continues.

## Notes

This is a drop-in patch because the actual playable `index.html` file was not present in the uploaded package at the time this patch was made.
