/**
 * Lightweight HUD overlay that lives *outside* the Phaser canvas so
 * the logo counter and timer can sit on top of the page rather than
 * inside the maze. The overlay is created as an absolutely-positioned
 * `<div>` inside the same parent element that hosts the game, so it
 * inherits the page's layout context.
 */

const OVERLAY_ID = 'game-hud-overlay';

function ensureOverlay(parent) {
  let overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'space-between';
    overlay.style.padding = '8px 12px';
    overlay.style.fontFamily = 'Ubuntu, sans-serif';
    overlay.style.fontSize = '16px';
    overlay.style.color = '#000000';
    overlay.style.textShadow = '0 1px 2px rgba(0,0,0,0.6)';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '10';
    overlay.style.boxSizing = 'border-box';
    parent.appendChild(overlay);
  }
  return overlay;
}

/**
 * Create (or refresh) the HUD overlay with two spans: a logo
 * counter on the left and a timer on the right.
 *
 * @param {Phaser.Scene} scene - The scene that owns the HUD.
 * @param {Number} total - Total number of decorations to collect.
 * @returns {{ overlay: HTMLElement, logoEl: HTMLElement, timerEl: HTMLElement }}
 */
export function createHud(scene, total) {
  const parent = scene.game.canvas.parentElement || document.body;
  const overlay = ensureOverlay(parent);
  overlay.innerHTML = '';

  const logoEl = document.createElement('span');
  logoEl.textContent = `Logo: ${total}/${total}`;
  logoEl.style.fontWeight = 'bold';

  const timerEl = document.createElement('span');
  timerEl.textContent = 'Time: 0s';
  timerEl.style.fontWeight = 'bold';

  overlay.appendChild(logoEl);
  overlay.appendChild(timerEl);

  return { overlay, logoEl, timerEl };
}

/**
 * Update the HUD text. Pass nulls to leave an element untouched.
 *
 * @param {{ logoEl: HTMLElement, timerEl: HTMLElement }} hud
 * @param {Object} [state]
 * @param {String} [state.logo] - New text for the logo counter.
 * @param {String} [state.timer] - New text for the timer.
 */
export function updateHud(hud, state = {}) {
  if (!hud) return;
  if (state.logo != null && hud.logoEl) {
    hud.logoEl.textContent = state.logo;
  }
  if (state.timer != null && hud.timerEl) {
    hud.timerEl.textContent = state.timer;
  }
}

/**
 * Tear down the HUD overlay. Safe to call even if it was never
 * created – useful when navigating away from a game scene.
 */
export function destroyHud() {
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay && overlay.parentElement) {
    overlay.parentElement.removeChild(overlay);
  }
}
