import { COLORS, SPACING, FONT } from '../Common/tokens';

const OVERLAY_ID = 'game-hud-overlay';
const CONTAINER_ID = 'game-hud-container';

function getContainer() {
  return document.getElementById(CONTAINER_ID);
}

function ensureOverlay() {
  let overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'space-between';
    overlay.style.alignItems = 'center';
    overlay.style.padding = `${SPACING.XS}px ${SPACING.MD}px`;
    overlay.style.fontFamily = FONT.UI_TEXT;
    overlay.style.fontSize = `${SPACING.LG}px`;
    overlay.style.color = COLORS.BG_PRIMARY;
    overlay.style.background = COLORS.TEXT_HIGHLIGHT;
    overlay.style.boxSizing = 'border-box';
    overlay.style.height = `${SPACING.XXL + SPACING.SM}px`;
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
  }
  return overlay;
}

export function createHud(scene, total) {
  const container = getContainer();
  if (!container) return null;

  const overlay = ensureOverlay();
  container.appendChild(overlay);
  container.style.display = 'block';

  overlay.innerHTML = '';

  const logoEl = document.createElement('span');
  logoEl.textContent = `Logo: ${total}/${total}`;
  logoEl.style.fontWeight = 'bold';
  logoEl.setAttribute('aria-label', `Còn lại ${total} logo để thu thập`);

  const timerEl = document.createElement('span');
  timerEl.textContent = 'Time: 0s';
  timerEl.style.fontWeight = 'bold';
  timerEl.setAttribute('aria-label', 'Thời gian: 0 giây');

  overlay.appendChild(logoEl);
  overlay.appendChild(timerEl);

  return { overlay, logoEl, timerEl };
}

export function updateHud(hud, state = {}) {
  if (!hud) return;
  if (state.logo != null && hud.logoEl) {
    hud.logoEl.textContent = state.logo;
    const match = state.logo.match(/(\d+)\/(\d+)/);
    if (match) {
      hud.logoEl.setAttribute(
        'aria-label',
        `Còn lại ${match[1]} trên ${match[2]} logo để thu thập`
      );
    }
  }
  if (state.timer != null && hud.timerEl) {
    hud.timerEl.textContent = state.timer;
    const seconds = state.timer.replace(/\D/g, '');
    hud.timerEl.setAttribute('aria-label', `Thời gian: ${seconds} giây`);
  }
}

export function destroyHud() {
  const container = getContainer();
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay && overlay.parentElement) {
    overlay.parentElement.removeChild(overlay);
  }
  if (container) {
    container.style.display = 'none';
  }
}
