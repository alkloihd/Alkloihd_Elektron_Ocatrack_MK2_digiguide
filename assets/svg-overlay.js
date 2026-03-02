/**
 * Octatrack MK2 SVG Overlay Engine + Floating Hardware Panel
 *
 * Drop-in script for any tutorial page. Auto-creates a floating
 * interactive SVG panel on the right side of the screen.
 *
 * Usage: <script src="assets/svg-overlay.js" defer></script>
 */
(function () {
  'use strict';

  var COLORS = {
    highlight: '#00ffff',
    active: '#ff00ff',
    warning: '#ffaa00',
    success: '#00ff41',
    bg: '#0a0a0a',
    surface: '#111111',
    border: '#333333',
    text: '#e0e0e0',
  };

  var SVG_PATH = 'assets/octatrack svg.svg';
  var MAP_PATH = 'data/svg-overlay-map.json';

  var svgDoc = null;
  var mapData = null;
  var panelEl = null;
  var svgContainer = null;
  var tooltipEl = null;
  var activeHighlights = {};
  var animationTimer = null;
  var currentTutorial = null;
  var sectionMap = {};          // sectionId -> [elementId, ...]
  var activeSectionId = null;   // currently visible section
  var sectionObserver = null;   // IntersectionObserver for sections

  function detectTutorial() {
    var path = window.location.pathname;
    var match = path.match(/(\d{2}-[\w-]+)\.html/);
    return match ? match[1] : null;
  }

  function loadSVG() {
    return fetch(SVG_PATH)
      .then(function (r) {
        return r.text();
      })
      .then(function (text) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'image/svg+xml');
        return doc.documentElement;
      });
  }

  function loadMap() {
    return fetch(MAP_PATH).then(function (r) {
      return r.json();
    });
  }

  function tagSVGElements() {
    if (!svgDoc || !mapData) return;
    var keys = Object.keys(mapData.elements);
    for (var i = 0; i < keys.length; i++) {
      var id = keys[i];
      var info = mapData.elements[id];
      var svg = info.svg;
      var overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      var x, y, w, h;

      if (info.type === 'encoder' || info.type === 'led') {
        var r = svg.r || 25;
        x = svg.x - r;
        y = svg.y - r;
        w = r * 2;
        h = r * 2;
      } else {
        x = svg.x;
        y = svg.y;
        w = svg.w || 40;
        h = svg.h || 34;
      }

      overlay.setAttribute('x', x);
      overlay.setAttribute('y', y);
      overlay.setAttribute('width', w);
      overlay.setAttribute('height', h);
      overlay.setAttribute('fill', 'transparent');
      overlay.setAttribute('stroke', 'none');
      overlay.setAttribute('data-ot-id', id);
      overlay.setAttribute('data-ot-label', info.label);
      overlay.setAttribute('rx', '4');
      overlay.style.cursor = 'pointer';
      overlay.style.transition = 'all 0.3s ease';
      svgDoc.appendChild(overlay);
    }
  }

  function highlightButtons(elementIds, color) {
    color = color || COLORS.highlight;
    for (var i = 0; i < elementIds.length; i++) {
      var id = elementIds[i];
      var el = svgContainer.querySelector('[data-ot-id="' + id + '"]');
      if (el) {
        el.setAttribute('fill', color);
        el.setAttribute('fill-opacity', '0.25');
        el.setAttribute('stroke', color);
        el.setAttribute('stroke-width', '2');
        el.style.filter = 'drop-shadow(0 0 6px ' + color + ')';
        activeHighlights[id] = true;
      }
    }
  }

  function clearAll() {
    var ids = Object.keys(activeHighlights);
    for (var i = 0; i < ids.length; i++) {
      var el = svgContainer.querySelector('[data-ot-id="' + ids[i] + '"]');
      if (el) {
        el.setAttribute('fill', 'transparent');
        el.setAttribute('stroke', 'none');
        el.style.filter = 'none';
      }
    }
    activeHighlights = {};
    if (animationTimer) {
      clearTimeout(animationTimer);
      animationTimer = null;
    }
    hideTooltip();
    var seqInfo = panelEl && panelEl.querySelector('.ot-sequence-info');
    if (seqInfo) seqInfo.style.display = 'none';
    var stepInd = panelEl && panelEl.querySelector('.ot-step-indicator');
    if (stepInd) stepInd.style.display = 'none';
  }

  function showTooltip(elementId, customText) {
    if (!tooltipEl || !mapData) return;
    var info = mapData.elements[elementId];
    if (!info) return;
    var el = svgContainer.querySelector('[data-ot-id="' + elementId + '"]');
    if (!el) return;

    var rect = el.getBoundingClientRect();
    var panelRect = panelEl.getBoundingClientRect();

    var html = '<strong style="color:' + COLORS.highlight + '">[' + info.label + ']</strong>';
    if (info.manual && info.manual.primary) {
      html += '<br><span style="color:' + COLORS.text + '">' + info.manual.primary + '</span>';
    }
    if (info.manual && info.manual.func_combo) {
      html += '<br><span style="color:' + COLORS.active + '">[FUNC]+: ' + info.manual.func_combo + '</span>';
    }
    if (customText) {
      html += '<br><span style="color:' + COLORS.success + '">' + customText + '</span>';
    }
    if (info.manual && info.manual.section) {
      html += '<br><span style="font-size:10px;color:#666">Manual &sect;' + info.manual.section + '</span>';
    }

    tooltipEl.innerHTML = html;
    tooltipEl.style.display = 'block';

    var tipX = rect.left - panelRect.left;
    var tipY = rect.bottom - panelRect.top + 8;
    tooltipEl.style.left = Math.max(8, Math.min(tipX, panelRect.width - 220)) + 'px';
    tooltipEl.style.top = Math.min(tipY, panelRect.height - 100) + 'px';
  }

  function hideTooltip() {
    if (tooltipEl) tooltipEl.style.display = 'none';
  }

  function animateSequence(sequenceId) {
    if (!mapData) return;
    var seq = null;
    for (var s = 0; s < mapData.sequences.length; s++) {
      if (mapData.sequences[s].id === sequenceId) {
        seq = mapData.sequences[s];
        break;
      }
    }
    if (!seq) return;

    clearAll();
    showSequenceInfo(seq);

    var stepIdx = 0;
    function nextStep() {
      if (stepIdx >= seq.steps.length) {
        animationTimer = setTimeout(function () {
          clearAll();
          restoreHighlights();
        }, 1500);
        return;
      }

      var step = seq.steps[stepIdx];

      // Fade previous step
      if (stepIdx > 0) {
        var prev = seq.steps[stepIdx - 1];
        var prevEl = svgContainer.querySelector('[data-ot-id="' + prev.element + '"]');
        if (prevEl) {
          prevEl.setAttribute('fill', COLORS.highlight);
          prevEl.setAttribute('fill-opacity', '0.15');
          prevEl.setAttribute('stroke', COLORS.highlight);
          prevEl.setAttribute('stroke-width', '1.5');
          prevEl.style.filter = 'drop-shadow(0 0 3px ' + COLORS.highlight + ')';
        }
      }

      var el = svgContainer.querySelector('[data-ot-id="' + step.element + '"]');
      if (el) {
        var color = step.action === 'hold' ? COLORS.warning : COLORS.active;
        el.setAttribute('fill', color);
        el.setAttribute('fill-opacity', '0.4');
        el.setAttribute('stroke', color);
        el.setAttribute('stroke-width', '3');
        el.style.filter = 'drop-shadow(0 0 10px ' + color + ')';
        activeHighlights[step.element] = true;
        if (step.label) showTooltip(step.element, step.label);
      }

      updateStepIndicator(seq, stepIdx);
      stepIdx++;
      var delay = stepIdx < seq.steps.length ? seq.steps[stepIdx].delay || 400 : 0;
      animationTimer = setTimeout(nextStep, Math.max(delay, 350));
    }

    nextStep();
  }

  function showSequenceInfo(seq) {
    var el = panelEl.querySelector('.ot-sequence-info');
    if (el) {
      el.textContent = seq.description;
      el.style.display = 'block';
    }
  }

  function updateStepIndicator(seq, currentIdx) {
    var el = panelEl.querySelector('.ot-step-indicator');
    if (!el) return;
    var dots = '';
    for (var i = 0; i < seq.steps.length; i++) {
      var color = i < currentIdx ? COLORS.highlight : i === currentIdx ? COLORS.active : '#333';
      var shadow = i === currentIdx ? 'box-shadow:0 0 6px ' + COLORS.active + ';' : '';
      dots +=
        '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' +
        color +
        ';margin:0 3px;transition:all 0.3s;' +
        shadow +
        '"></span>';
    }
    el.innerHTML = dots;
    el.style.display = 'flex';
  }

  function highlightTutorialButtons() {
    if (!mapData || !currentTutorial) return;
    clearAll();
    var ids = [];
    var keys = Object.keys(mapData.elements);
    for (var i = 0; i < keys.length; i++) {
      var info = mapData.elements[keys[i]];
      if (info.tutorials && info.tutorials.indexOf(currentTutorial) !== -1) {
        ids.push(keys[i]);
      }
    }
    if (ids.length > 0) highlightButtons(ids, COLORS.highlight);
  }

  function restoreHighlights() {
    if (activeSectionId && sectionMap[activeSectionId] && sectionMap[activeSectionId].length > 0) {
      clearAll();
      highlightButtons(sectionMap[activeSectionId], COLORS.highlight);
    } else {
      highlightTutorialButtons();
    }
  }

  function setupSectionTracking() {
    var main = document.querySelector('.main') || document.querySelector('.content') || document.querySelector('.main-content');
    if (!main) return;

    var sections = main.querySelectorAll('.section');
    if (sections.length === 0) return;

    // Build sectionMap: for each section, collect all data-ot-element IDs inside it
    sectionMap = {};
    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      var secId = sec.id || ('section-' + i);
      var refs = sec.querySelectorAll('[data-ot-element]');
      var ids = [];
      var seen = {};
      for (var r = 0; r < refs.length; r++) {
        var eid = refs[r].dataset.otElement;
        if (eid && !seen[eid]) {
          ids.push(eid);
          seen[eid] = true;
        }
      }
      sectionMap[secId] = ids;
    }

    // Create or find the section indicator element below the SVG
    var indicator = panelEl.querySelector('.ot-section-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'ot-section-indicator';
      // Insert after the SVG wrap
      var svgWrap = panelEl.querySelector('.ot-svg-wrap');
      if (svgWrap && svgWrap.nextSibling) {
        svgWrap.parentNode.insertBefore(indicator, svgWrap.nextSibling);
      } else if (svgWrap) {
        svgWrap.parentNode.appendChild(indicator);
      }
    }
    indicator.style.display = 'none';

    // Set up IntersectionObserver on sections
    var visibleSections = {};
    sectionObserver = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        var entry = entries[e];
        var id = entry.target.id || entry.target.getAttribute('data-section-idx');
        if (entry.isIntersecting) {
          visibleSections[id] = entry.intersectionRatio;
        } else {
          delete visibleSections[id];
        }
      }

      // Pick the section with the highest intersection ratio
      var bestId = null;
      var bestRatio = 0;
      var vKeys = Object.keys(visibleSections);
      for (var v = 0; v < vKeys.length; v++) {
        if (visibleSections[vKeys[v]] > bestRatio) {
          bestRatio = visibleSections[vKeys[v]];
          bestId = vKeys[v];
        }
      }

      if (bestId && bestId !== activeSectionId) {
        activeSectionId = bestId;
        // Update highlights to section-level
        var secIds = sectionMap[activeSectionId];
        if (secIds && secIds.length > 0) {
          clearAll();
          highlightButtons(secIds, COLORS.highlight);
        } else {
          // Section has no button references — fall back to tutorial-level
          highlightTutorialButtons();
        }
        // Update indicator
        var secEl = main.querySelector('#' + CSS.escape(activeSectionId))
          || main.querySelector('[data-section-idx="' + activeSectionId + '"]');
        var secHeading = secEl ? secEl.querySelector('h2, h3, h4') : null;
        var secName = secHeading ? secHeading.textContent : activeSectionId;
        indicator.textContent = 'Section: ' + secName;
        indicator.style.display = 'block';
      } else if (vKeys.length === 0) {
        // No section in view — fall back to tutorial-level
        activeSectionId = null;
        highlightTutorialButtons();
        indicator.style.display = 'none';
      }
    }, { threshold: 0.3 });

    // Observe all sections
    for (var s = 0; s < sections.length; s++) {
      if (!sections[s].id) {
        sections[s].setAttribute('data-section-idx', 'section-' + s);
      }
      sectionObserver.observe(sections[s]);
    }
  }

  function scanButtonReferences() {
    if (!mapData) return;

    var labelToId = {};
    var keys = Object.keys(mapData.elements);
    for (var i = 0; i < keys.length; i++) {
      var info = mapData.elements[keys[i]];
      labelToId[info.label.toUpperCase()] = keys[i];
      if (info.sublabel) labelToId[info.sublabel.toUpperCase()] = keys[i];
    }

    var aliases = {
      REC: 'rec1',
      RECORD: 'rec1',
      PLAY: 'clear',
      STOP: 'paste',
      LEVEL: 'encoder_level',
      TEMPO: 'tap_tempo',
      AUD: 'aed',
      'AUD EDIT': 'aed',
      'AUDIO EDITOR': 'aed',
      PLAYBACK: 'src',
      UP: 'arrow_up',
      DOWN: 'arrow_down',
      LEFT: 'arrow_left',
      RIGHT: 'arrow_right',
      'SCENE A': 'scene_a',
      'SCENE B': 'scene_b',
      TRACK: 't1',
      'TRIG 1': 'trig_1',
      'TRIG 2': 'trig_2',
      'TRIG 3': 'trig_3',
      'TRIG 4': 'trig_4',
      'TRIG 5': 'trig_5',
      'TRIG 6': 'trig_6',
      'TRIG 7': 'trig_7',
      'TRIG 8': 'trig_8',
    };
    var aliasKeys = Object.keys(aliases);
    for (var a = 0; a < aliasKeys.length; a++) {
      labelToId[aliasKeys[a]] = aliases[aliasKeys[a]];
    }

    var main = document.querySelector('.main') || document.querySelector('.content') || document.querySelector('.main-content');
    if (!main) return;

    var walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, null, false);
    var textNodes = [];
    var node;
    while ((node = walker.nextNode())) {
      if (/\[.+?\]/.test(node.textContent)) textNodes.push(node);
    }

    for (var t = 0; t < textNodes.length; t++) {
      var textNode = textNodes[t];
      var parent = textNode.parentNode;
      if (
        !parent ||
        parent.closest('.ot-btn-ref') ||
        parent.tagName === 'SCRIPT' ||
        parent.tagName === 'STYLE' ||
        parent.tagName === 'CODE'
      )
        continue;

      var text = textNode.textContent;
      var parts = text.split(/(\[[^\]]+\])/g);
      if (parts.length <= 1) continue;

      var frag = document.createDocumentFragment();
      for (var p = 0; p < parts.length; p++) {
        var part = parts[p];
        var bracketMatch = part.match(/^\[(.+)\]$/);
        if (bracketMatch) {
          var label = bracketMatch[1].toUpperCase().trim();
          var elementId = labelToId[label];
          var span = document.createElement('span');
          span.textContent = part;
          span.className = 'ot-btn-ref';
          span.style.cssText =
            'color:' +
            COLORS.highlight +
            ';font-family:"Space Mono",monospace;font-weight:700;cursor:pointer;border-bottom:1px dashed rgba(0,255,255,0.25);transition:all 0.2s;';

          if (elementId) {
            span.dataset.otElement = elementId;
            (function (eid, sp) {
              sp.addEventListener('mouseenter', function () {
                clearAll();
                highlightButtons([eid], COLORS.active);
                showTooltip(eid);
                sp.style.color = COLORS.active;
                sp.style.textShadow = '0 0 8px ' + COLORS.active;
              });
              sp.addEventListener('mouseleave', function () {
                restoreHighlights();
                hideTooltip();
                sp.style.color = COLORS.highlight;
                sp.style.textShadow = 'none';
              });
            })(elementId, span);
          }
          frag.appendChild(span);
        } else {
          frag.appendChild(document.createTextNode(part));
        }
      }
      parent.replaceChild(frag, textNode);
    }
  }

  function createPanel() {
    var style = document.createElement('style');
    style.textContent = [
      '.ot-panel{position:fixed;top:68px;right:12px;width:clamp(450px,40vw,700px);max-height:calc(100vh - 80px);background:' +
        COLORS.bg +
        ';border:2px solid ' +
        COLORS.border +
        ';z-index:90;display:flex;flex-direction:column;transition:all 0.3s ease;overflow:hidden}',
      '.ot-panel.collapsed{width:48px;max-height:48px;border-color:rgba(0,255,255,0.25);cursor:pointer}',
      '.ot-panel.collapsed:hover{border-color:' + COLORS.highlight + '}',
      '.ot-panel-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:' +
        COLORS.surface +
        ';border-bottom:2px solid ' +
        COLORS.border +
        ';cursor:pointer;min-height:44px;user-select:none}',
      '.ot-panel.collapsed .ot-panel-header{border-bottom:none;padding:10px;justify-content:center}',
      '.ot-panel-title{font-family:"Space Mono",monospace;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:' +
        COLORS.highlight +
        '}',
      '.ot-panel.collapsed .ot-panel-title{display:none}',
      '.ot-panel-toggle{width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:' +
        COLORS.highlight +
        ';font-size:16px;font-weight:700;transition:transform 0.3s}',
      '.ot-panel.collapsed .ot-panel-toggle{transform:rotate(180deg)}',
      '.ot-panel-body{flex:1;overflow-y:auto;padding:16px}',
      '.ot-panel.collapsed .ot-panel-body{display:none}',
      '.ot-svg-wrap{position:relative;width:100%;border:1px solid ' +
        COLORS.border +
        ';background:#121212;overflow:hidden}',
      '.ot-svg-wrap svg{width:100%;height:auto;display:block}',
      '@media(min-width:1201px){body .main{margin-right:calc(clamp(450px,40vw,700px) + 28px)!important;max-width:none!important}}',
      '.ot-tooltip{position:absolute;background:' +
        COLORS.surface +
        ';border:2px solid ' +
        COLORS.highlight +
        ';padding:8px 12px;font-family:"Space Mono",monospace;font-size:11px;line-height:1.5;color:' +
        COLORS.text +
        ';z-index:200;max-width:260px;pointer-events:none;display:none;box-shadow:0 4px 16px rgba(0,255,255,0.15)}',
      '.ot-section-indicator{font-family:"Space Mono",monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:' +
        COLORS.highlight +
        ';padding:6px 10px;margin-top:6px;background:rgba(0,255,255,0.04);border:1px solid rgba(0,255,255,0.15);display:none;text-align:center;transition:all 0.3s ease}',
      '.ot-controls{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}',
      '.ot-ctrl-btn{font-family:"Space Mono",monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;padding:5px 10px;background:' +
        COLORS.surface +
        ';border:1px solid ' +
        COLORS.border +
        ';color:' +
        COLORS.text +
        ';cursor:pointer;transition:all 0.2s}',
      '.ot-ctrl-btn:hover{border-color:' +
        COLORS.highlight +
        ';color:' +
        COLORS.highlight +
        ';transform:translateY(-1px)}',
      '.ot-sequence-info{font-family:"Space Mono",monospace;font-size:10px;color:' +
        COLORS.active +
        ';padding:6px 0;display:none;text-align:center}',
      '.ot-step-indicator{display:none;justify-content:center;padding:4px 0}',
      '.ot-sequences-list{margin-top:10px;border-top:1px solid ' + COLORS.border + ';padding-top:10px}',
      '.ot-sequences-list summary{font-family:"Space Mono",monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#666;cursor:pointer;margin-bottom:6px}',
      '.ot-seq-btn{display:block;width:100%;text-align:left;font-family:"Inter",sans-serif;font-size:12px;padding:6px 10px;margin-bottom:4px;background:transparent;border:1px solid ' +
        COLORS.border +
        ';color:' +
        COLORS.text +
        ';cursor:pointer;transition:all 0.2s}',
      '.ot-seq-btn:hover{border-color:' +
        COLORS.active +
        ';color:' +
        COLORS.active +
        ';background:rgba(255,0,255,0.03)}',
      '.ot-legend{margin-top:8px;display:flex;gap:12px;flex-wrap:wrap;font-size:10px;color:#666;font-family:"Space Mono",monospace}',
      '.ot-legend-item{display:flex;align-items:center;gap:4px}',
      '.ot-legend-swatch{width:10px;height:10px;border:1px solid}',
      '.ot-detail{margin-top:12px;border:2px solid ' + COLORS.border + ';background:#0d0d0d;display:none;max-height:45vh;overflow-y:auto}',
      '.ot-detail.active{display:block}',
      '.ot-detail-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:' + COLORS.surface + ';border-bottom:1px solid ' + COLORS.border + ';position:sticky;top:0;z-index:1}',
      '.ot-detail-title{font-family:"Space Mono",monospace;font-size:16px;font-weight:700;color:' + COLORS.highlight + '}',
      '.ot-detail-close{background:none;border:1px solid ' + COLORS.border + ';color:#666;font-size:14px;cursor:pointer;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-family:"Space Mono",monospace;transition:all 0.2s}',
      '.ot-detail-close:hover{border-color:' + COLORS.active + ';color:' + COLORS.active + '}',
      '.ot-detail-body{padding:12px 14px}',
      '.ot-detail-row{margin-bottom:10px}',
      '.ot-detail-label{font-family:"Space Mono",monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.15em;color:#555;margin-bottom:4px}',
      '.ot-detail-value{font-family:"Inter",sans-serif;font-size:15px;line-height:1.6;color:' + COLORS.text + '}',
      '.ot-detail-combo{display:inline-block;font-family:"Space Mono",monospace;font-size:14px;padding:3px 10px;margin:3px 4px 3px 0;background:rgba(0,255,255,0.06);border:1px solid rgba(0,255,255,0.2);color:' + COLORS.highlight + '}',
      '.ot-detail-tip{font-family:"Inter",sans-serif;font-size:14px;line-height:1.6;color:' + COLORS.warning + ';padding:8px 12px;margin-top:6px;border-left:2px solid ' + COLORS.warning + ';background:rgba(255,170,0,0.04)}',
      '.ot-detail-mistake{font-family:"Inter",sans-serif;font-size:14px;line-height:1.6;color:#ff4444;padding:8px 12px;margin-top:6px;border-left:2px solid #ff4444;background:rgba(255,68,68,0.04)}',
      '.ot-detail-section{font-family:"Space Mono",monospace;font-size:13px;color:#444;margin-top:10px;padding-top:10px;border-top:1px solid ' + COLORS.border + '}',
      '@media(max-width:1200px){.ot-panel{display:none}}',
    ].join('\n');
    document.head.appendChild(style);

    panelEl = document.createElement('div');
    panelEl.className = 'ot-panel';
    panelEl.innerHTML = [
      '<div class="ot-panel-header">',
      '  <span class="ot-panel-title">Hardware Reference</span>',
      '  <span class="ot-panel-toggle">&lsaquo;</span>',
      '</div>',
      '<div class="ot-panel-body">',
      '  <div class="ot-svg-wrap"></div>',
      '  <div class="ot-tooltip"></div>',
      '  <div class="ot-sequence-info"></div>',
      '  <div class="ot-step-indicator"></div>',
      '  <div class="ot-controls"></div>',
      '  <div class="ot-legend">',
      '    <span class="ot-legend-item"><span class="ot-legend-swatch" style="background:rgba(0,255,255,0.15);border-color:' +
        COLORS.highlight +
        '"></span>Relevant</span>',
      '    <span class="ot-legend-item"><span class="ot-legend-swatch" style="background:rgba(255,0,255,0.25);border-color:' +
        COLORS.active +
        '"></span>Active</span>',
      '    <span class="ot-legend-item"><span class="ot-legend-swatch" style="background:rgba(255,170,0,0.25);border-color:' +
        COLORS.warning +
        '"></span>Hold</span>',
      '  </div>',
      '  <div class="ot-sequences-list"></div>',
      '  <div class="ot-detail"></div>',
      '</div>',
    ].join('\n');

    document.body.appendChild(panelEl);
    svgContainer = panelEl.querySelector('.ot-svg-wrap');
    tooltipEl = panelEl.querySelector('.ot-tooltip');

    var header = panelEl.querySelector('.ot-panel-header');
    header.addEventListener('click', function () {
      panelEl.classList.toggle('collapsed');
      try {
        localStorage.setItem('ot-panel-collapsed', panelEl.classList.contains('collapsed'));
      } catch (e) {
        /* */
      }
    });

    try {
      if (localStorage.getItem('ot-panel-collapsed') === 'true') panelEl.classList.add('collapsed');
    } catch (e) {
      /* */
    }
  }

  function populateControls() {
    var controlsEl = panelEl.querySelector('.ot-controls');
    var seqList = panelEl.querySelector('.ot-sequences-list');
    if (!controlsEl || !mapData) return;

    controlsEl.innerHTML =
      '<button class="ot-ctrl-btn" data-action="highlight-all">Show All</button><button class="ot-ctrl-btn" data-action="highlight-tutorial">This Tutorial</button><button class="ot-ctrl-btn" data-action="clear">Clear</button>';
    controlsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.ot-ctrl-btn');
      if (!btn) return;
      var action = btn.dataset.action;
      if (action === 'highlight-all') {
        clearAll();
        highlightButtons(Object.keys(mapData.elements), COLORS.highlight);
      } else if (action === 'highlight-tutorial') {
        highlightTutorialButtons();
      } else if (action === 'clear') {
        clearAll();
      }
    });

    var tutorialSeqs = currentTutorial
      ? mapData.sequences.filter(function (s) {
          return s.tutorial === currentTutorial;
        })
      : mapData.sequences;

    if (tutorialSeqs.length > 0) {
      var btns = '';
      for (var i = 0; i < tutorialSeqs.length; i++) {
        btns +=
          '<button class="ot-seq-btn" data-seq="' +
          tutorialSeqs[i].id +
          '">' +
          tutorialSeqs[i].description +
          '</button>';
      }
      seqList.innerHTML =
        '<details open><summary>Animated Sequences (' + tutorialSeqs.length + ')</summary>' + btns + '</details>';
      seqList.addEventListener('click', function (e) {
        var btn = e.target.closest('.ot-seq-btn');
        if (btn) animateSequence(btn.dataset.seq);
      });
    }
  }

  function addSVGInteraction() {
    if (!svgContainer || !mapData) return;
    svgContainer.addEventListener('mouseover', function (e) {
      var el = e.target.closest('[data-ot-id]');
      if (!el) return;
      showTooltip(el.dataset.otId);
      if (!activeHighlights[el.dataset.otId]) {
        el.setAttribute('stroke', COLORS.active);
        el.setAttribute('stroke-width', '2');
        el.setAttribute('fill', COLORS.active);
        el.setAttribute('fill-opacity', '0.1');
      }
    });
    svgContainer.addEventListener('mouseout', function (e) {
      var el = e.target.closest('[data-ot-id]');
      if (!el) return;
      hideTooltip();
      var id = el.dataset.otId;
      if (activeHighlights[id]) {
        el.setAttribute('stroke', COLORS.highlight);
        el.setAttribute('stroke-width', '2');
        el.setAttribute('fill', COLORS.highlight);
        el.setAttribute('fill-opacity', '0.25');
      } else {
        el.setAttribute('stroke', 'none');
        el.setAttribute('fill', 'transparent');
      }
    });
    svgContainer.addEventListener('click', function (e) {
      var el = e.target.closest('[data-ot-id]');
      if (!el) return;
      showDetail(el.dataset.otId);
    });
  }

  function escText(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function showDetail(elementId) {
    var detailEl = panelEl.querySelector('.ot-detail');
    if (!detailEl || !mapData) return;
    var info = mapData.elements[elementId];
    if (!info) return;

    var m = info.manual || {};

    // Build detail panel using DOM methods
    detailEl.textContent = '';

    // Header
    var header = document.createElement('div');
    header.className = 'ot-detail-header';
    var title = document.createElement('span');
    title.className = 'ot-detail-title';
    title.textContent = '[' + info.label + ']';
    if (info.sublabel) {
      var sub = document.createElement('span');
      sub.style.cssText = 'color:#666;font-size:11px;font-weight:400;margin-left:6px';
      sub.textContent = info.sublabel;
      title.appendChild(sub);
    }
    header.appendChild(title);
    var closeBtn = document.createElement('button');
    closeBtn.className = 'ot-detail-close';
    closeBtn.textContent = '\u00d7';
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      detailEl.classList.remove('active');
      detailEl.textContent = '';
    });
    header.appendChild(closeBtn);
    detailEl.appendChild(header);

    var body = document.createElement('div');
    body.className = 'ot-detail-body';

    function addRow(label, value, valueStyle) {
      var row = document.createElement('div');
      row.className = 'ot-detail-row';
      var lbl = document.createElement('div');
      lbl.className = 'ot-detail-label';
      lbl.textContent = label;
      row.appendChild(lbl);
      var val = document.createElement('div');
      val.className = 'ot-detail-value';
      if (valueStyle) val.style.cssText = valueStyle;
      val.textContent = value;
      row.appendChild(val);
      body.appendChild(row);
      return row;
    }

    // Primary function
    if (m.primary) addRow('Function', m.primary);

    // FUNC combo
    if (m.func_combo) addRow('[FUNC] + [' + info.label + ']', m.func_combo);

    // Menu path
    if (m.menu_path) addRow('Menu Path', m.menu_path, 'font-family:"Space Mono",monospace;font-size:11px;color:' + COLORS.highlight);

    // All combos
    var combos = m.all_combos || m.other_combos || [];
    if (combos.length > 0) {
      var comboRow = document.createElement('div');
      comboRow.className = 'ot-detail-row';
      var comboLabel = document.createElement('div');
      comboLabel.className = 'ot-detail-label';
      comboLabel.textContent = 'Key Combinations';
      comboRow.appendChild(comboLabel);
      var comboVal = document.createElement('div');
      comboVal.className = 'ot-detail-value';
      for (var c = 0; c < combos.length; c++) {
        var chip = document.createElement('span');
        chip.className = 'ot-detail-combo';
        chip.textContent = combos[c];
        comboVal.appendChild(chip);
      }
      comboRow.appendChild(comboVal);
      body.appendChild(comboRow);
    }

    // Parameters
    if (m.parameters && m.parameters.length > 0) {
      addRow('Parameters', m.parameters.join(' \u2022 '));
    }

    // LEDs
    if (m.leds) addRow('LED Indicator', m.leds);

    // Tips
    var tips = m.tips || [];
    if (typeof tips === 'string') tips = [tips];
    if (m.merlin_tips) {
      var mt = typeof m.merlin_tips === 'string' ? [m.merlin_tips] : m.merlin_tips;
      tips = tips.concat(mt);
    }
    for (var t = 0; t < tips.length; t++) {
      var tipEl = document.createElement('div');
      tipEl.className = 'ot-detail-tip';
      tipEl.textContent = tips[t];
      body.appendChild(tipEl);
    }

    // Common mistakes
    var mistakes = m.common_mistakes || [];
    if (typeof mistakes === 'string') mistakes = [mistakes];
    for (var mk = 0; mk < mistakes.length; mk++) {
      var mistakeEl = document.createElement('div');
      mistakeEl.className = 'ot-detail-mistake';
      mistakeEl.textContent = mistakes[mk];
      body.appendChild(mistakeEl);
    }

    // Workflow context
    if (m.workflow_context) {
      addRow('Workflow', m.workflow_context, 'font-style:italic;color:#aaa');
    }

    // Note
    if (m.note) addRow('Note', m.note, 'color:#aaa');

    // Manual section
    if (m.section) {
      var secEl = document.createElement('div');
      secEl.className = 'ot-detail-section';
      secEl.textContent = 'Manual \u00a7' + m.section;
      body.appendChild(secEl);
    }

    detailEl.appendChild(body);
    detailEl.classList.add('active');
    detailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function embedRelatedVideos() {
    if (!currentTutorial) return;
    fetch('data/videos.json')
      .then(function (r) {
        return r.json();
      })
      .then(function (videos) {
        var relevant = videos
          .filter(function (v) {
            return v.relevantTutorials && v.relevantTutorials.indexOf(currentTutorial) !== -1;
          })
          .slice(0, 2);
        if (relevant.length === 0) return;

        var main = document.querySelector('.main');
        if (!main) return;

        var section = document.createElement('div');
        section.style.cssText = 'background:#111;border:2px solid #333;padding:30px;margin-bottom:40px;';

        var heading = document.createElement('h2');
        heading.style.cssText =
          'font-family:"Space Mono",monospace;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#fff;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #ff00ff';
        heading.textContent = 'Related Videos';
        section.appendChild(heading);

        var grid = document.createElement('div');
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px';

        relevant.forEach(function (v) {
          var ytMatch = v.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          var card = document.createElement('div');
          card.style.cssText = 'background:#0a0a0a;border:2px solid #333;transition:all 0.2s;cursor:pointer';
          card.addEventListener('mouseenter', function () {
            card.style.borderColor = '#ff00ff';
          });
          card.addEventListener('mouseleave', function () {
            card.style.borderColor = '#333';
          });

          var thumb = document.createElement('div');
          thumb.style.cssText = 'position:relative;width:100%;aspect-ratio:16/9;background:#1a1a1a;overflow:hidden';
          if (ytMatch) {
            var img = document.createElement('img');
            img.src = 'https://img.youtube.com/vi/' + ytMatch[1] + '/mqdefault.jpg';
            img.alt = v.title;
            img.loading = 'lazy';
            img.style.cssText = 'width:100%;height:100%;object-fit:cover';
            thumb.appendChild(img);
          }
          var playBtn = document.createElement('div');
          playBtn.style.cssText =
            'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:48px;height:48px;background:rgba(255,0,255,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center';
          var tri = document.createElement('div');
          tri.style.cssText =
            'width:0;height:0;border-style:solid;border-width:8px 0 8px 14px;border-color:transparent transparent transparent #fff;margin-left:3px';
          playBtn.appendChild(tri);
          thumb.appendChild(playBtn);
          var dur = document.createElement('span');
          dur.style.cssText =
            'position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,0.85);color:#fff;font-family:"Space Mono",monospace;font-size:10px;padding:2px 6px';
          dur.textContent = v.duration || '';
          thumb.appendChild(dur);
          card.appendChild(thumb);

          var info = document.createElement('div');
          info.style.cssText = 'padding:12px';
          var title = document.createElement('div');
          title.style.cssText = 'font-weight:600;font-size:13px;color:#fff;margin-bottom:4px;line-height:1.3';
          title.textContent = v.title;
          info.appendChild(title);
          var creator = document.createElement('div');
          creator.style.cssText = 'font-size:11px;color:#00ffff;margin-bottom:4px';
          creator.textContent = v.creator;
          info.appendChild(creator);
          card.appendChild(info);

          card.addEventListener('click', function () {
            if (ytMatch) {
              window.open('https://www.youtube.com/watch?v=' + ytMatch[1], '_blank', 'noopener');
            } else {
              window.open(v.videoUrl, '_blank', 'noopener');
            }
          });

          grid.appendChild(card);
        });

        section.appendChild(grid);

        var moreLink = document.createElement('a');
        moreLink.href = 'videos.html';
        moreLink.style.cssText =
          'display:inline-block;margin-top:14px;color:#ff00ff;font-family:"Space Mono",monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;border-bottom:1px dashed #ff00ff;transition:all 0.2s';
        moreLink.textContent = 'Browse all videos \u2192';
        section.appendChild(moreLink);

        main.appendChild(section);
      })
      .catch(function () {
        /* videos not critical */
      });
  }

  function init() {
    currentTutorial = detectTutorial();
    if (!currentTutorial) return;

    Promise.all([loadSVG(), loadMap()])
      .then(function (results) {
        svgDoc = results[0];
        mapData = results[1];
        createPanel();
        svgContainer.appendChild(svgDoc);
        tagSVGElements();
        addSVGInteraction();
        populateControls();
        highlightTutorialButtons();
        scanButtonReferences();
        setupSectionTracking();
      })
      .catch(function (err) {
        console.warn('[OT Overlay] Init failed:', err);
      });

    embedRelatedVideos();
  }

  window.OTOverlay = {
    highlightButtons: highlightButtons,
    clearAll: clearAll,
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    animateSequence: animateSequence,
    highlightTutorialButtons: highlightTutorialButtons,
    restoreHighlights: restoreHighlights,
    setupSectionTracking: setupSectionTracking,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
