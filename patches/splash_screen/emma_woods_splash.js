/*
  Calamity War - Emma Woods Studio Splash Screen Patch v0.46
  Shows the Emma Woods Studio splash automatically, then fades away after 3 seconds.
  No skip button.
*/

(function () {
  const SPLASH_ID = "emma-woods-splash";
  const IMAGE_PATH = "assets/ui/splash/emma_woods_studio_splash.jpeg";
  const DISPLAY_MS = 3000;
  const FADE_MS = 700;

  function removeSplash() {
    const splash = document.getElementById(SPLASH_ID);
    if (!splash) return;

    splash.classList.add("hidden");
    window.setTimeout(() => {
      splash.remove();

      if (typeof window.onEmmaWoodsSplashComplete === "function") {
        window.onEmmaWoodsSplashComplete();
      }

      document.dispatchEvent(new CustomEvent("emmaWoodsSplashComplete"));
    }, FADE_MS);
  }

  function createSplash() {
    if (document.getElementById(SPLASH_ID)) return;

    const splash = document.createElement("div");
    splash.id = SPLASH_ID;

    const img = document.createElement("img");
    img.src = IMAGE_PATH;
    img.alt = "Emma Woods Studio";
    img.decoding = "async";

    splash.appendChild(img);
    document.body.prepend(splash);

    window.setTimeout(removeSplash, DISPLAY_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createSplash);
  } else {
    createSplash();
  }
})();
