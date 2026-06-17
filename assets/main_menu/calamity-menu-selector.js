// Calamity War - Ornate selector helper
// Optional: include this after the menu HTML loads. It adds the 3-piece selector frame to menu options.
(function () {
  const selector = '.cw-menu-option, .main-menu-option, .menu-option, .menu-choice';
  const options = Array.from(document.querySelectorAll(selector));

  function makeFrame(red) {
    const frame = document.createElement('span');
    frame.className = `cw-selector-frame${red ? ' cw-selector-red' : ''}`;
    frame.setAttribute('aria-hidden', 'true');

    ['left', 'center', 'right'].forEach(part => {
      const piece = document.createElement('span');
      piece.className = `cw-selector-piece cw-selector-${part}`;
      frame.appendChild(piece);
    });
    return frame;
  }

  options.forEach(option => {
    if (option.querySelector('.cw-selector-frame')) return;
    option.classList.add('has-cw-selector');
    option.prepend(makeFrame(true));
    option.prepend(makeFrame(false));
  });
})();