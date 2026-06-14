(function () {
  const SPLASH_ID = "emma-woods-splash";
  const IMAGE_PATH = "assets/ui/splash/emma_woods_studio_splash.jpeg";
  const DISPLAY_MS = 2600;

  function removeSplash() {
    const splash = document.getElementById(SPLASH_ID);
    if (!splash) return;
    splash.classList.add("hidden");
    window.setTimeout(() => {
      splash.remove();
      document.dispatchEvent(new CustomEvent("emmaWoodsSplashComplete"));
    }, 720);
  }

  function createSplash() {
    if (document.getElementById(SPLASH_ID)) return;
    const splash = document.createElement("div");
    splash.id = SPLASH_ID;
    const img = document.createElement("img");
    img.src = IMAGE_PATH;
    img.alt = "Emma Woods Studio";
    img.decoding = "async";
    const skip = document.createElement("button");
    skip.className = "splash-skip";
    skip.type = "button";
    skip.textContent = "Skip";
    skip.addEventListener("click", removeSplash);
    splash.appendChild(img);
    splash.appendChild(skip);
    document.body.prepend(splash);
    window.setTimeout(removeSplash, DISPLAY_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createSplash);
  } else {
    createSplash();
  }
})();
