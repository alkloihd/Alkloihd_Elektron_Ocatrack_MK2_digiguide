/* ==========================================================================
   Theme Toggle — Octatrack MK2 Learning Platform
   3-button SVG pill: Light / System / Dark. Persists to localStorage.
   Vanilla ES5. No dependencies. Inspired by milo-app ThemeToggle.
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'ot-theme';
  var MODES = ['light', 'system', 'dark'];
  var LABELS = { light: 'Light', system: 'System', dark: 'Dark' };

  /* SVG icon paths (Heroicons v2 solid, 24x24 viewBox) */
  var SVG_DATA = {
    light: {
      fill: true,
      d: 'M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z',
    },
    system: {
      fill: false,
      d: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
    },
    dark: {
      fill: true,
      d: 'M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z',
    },
  };

  /* ------------------------------------------------------------------
     State helpers
     ------------------------------------------------------------------ */

  function getPreferred() {
    return localStorage.getItem(STORAGE_KEY) || 'system';
  }

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  /* ------------------------------------------------------------------
     Apply a theme mode to <html data-theme>
     ------------------------------------------------------------------ */

  function applyTheme(mode) {
    var html = document.documentElement;

    if (mode === 'system') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', mode);
    }

    localStorage.setItem(STORAGE_KEY, mode);

    var effectiveTheme = mode === 'system' ? getSystemTheme() : mode;
    html.style.colorScheme = effectiveTheme;

    /* Update pill button active states */
    var container = document.getElementById('theme-toggle-pill');
    if (container) {
      var buttons = container.querySelectorAll('.theme-pill-btn');
      for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i];
        var isActive = btn.getAttribute('data-mode') === mode;
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        if (isActive) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    }
  }

  /* ------------------------------------------------------------------
     Create an SVG icon element using safe DOM methods
     ------------------------------------------------------------------ */

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function makeSVG(mode) {
    var data = SVG_DATA[mode];
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('aria-hidden', 'true');

    if (data.fill) {
      svg.setAttribute('fill', 'currentColor');
      var path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', data.d);
      if (mode === 'dark') {
        path.setAttribute('fill-rule', 'evenodd');
        path.setAttribute('clip-rule', 'evenodd');
      }
      svg.appendChild(path);
    } else {
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '1.5');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      var path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', data.d);
      svg.appendChild(path);
    }

    return svg;
  }

  /* ------------------------------------------------------------------
     Inject the 3-button pill toggle
     ------------------------------------------------------------------ */

  function injectToggle() {
    if (document.getElementById('theme-toggle-pill')) {
      return;
    }

    var pill = document.createElement('div');
    pill.id = 'theme-toggle-pill';
    pill.className = 'theme-toggle-pill';
    pill.setAttribute('role', 'radiogroup');
    pill.setAttribute('aria-label', 'Theme preference');

    var currentMode = getPreferred();

    for (var i = 0; i < MODES.length; i++) {
      var mode = MODES[i];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-pill-btn' + (mode === currentMode ? ' active' : '');
      btn.setAttribute('data-mode', mode);
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-pressed', mode === currentMode ? 'true' : 'false');
      btn.setAttribute('aria-label', LABELS[mode] + ' theme');

      btn.appendChild(makeSVG(mode));

      var label = document.createElement('span');
      label.className = 'theme-pill-label';
      label.textContent = LABELS[mode];
      btn.appendChild(label);

      btn.onclick = (function (m) {
        return function () {
          applyTheme(m);
        };
      })(mode);

      pill.appendChild(btn);
    }

    /* Insert into .top-bar-meta before the difficulty badge, or fall back to body */
    var meta = document.querySelector('.top-bar-meta');
    if (meta && meta.firstChild) {
      meta.insertBefore(pill, meta.firstChild);
    } else if (meta) {
      meta.appendChild(pill);
    } else {
      document.body.appendChild(pill);
    }
  }

  /* ------------------------------------------------------------------
     Listen for OS-level theme changes (when in system mode)
     ------------------------------------------------------------------ */

  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: light)');
    var onChange = function () {
      if (getPreferred() === 'system') {
        applyTheme('system');
      }
    };

    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
    } else if (mq.addListener) {
      mq.addListener(onChange);
    }
  }

  /* ------------------------------------------------------------------
     Boot sequence
     ------------------------------------------------------------------ */

  applyTheme(getPreferred());

  function onReady() {
    injectToggle();
    applyTheme(getPreferred());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
