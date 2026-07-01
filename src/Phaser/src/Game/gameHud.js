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
    overlay.style.gap = `${SPACING.MD}px`;
    overlay.style.padding = `${SPACING.SM}px ${SPACING.MD}px`;
    overlay.style.fontFamily = FONT.UI_TEXT;
    overlay.style.fontSize = `${SPACING.LG}px`;
    overlay.style.color = COLORS.TEXT_PRIMARY;
    overlay.style.background = 'linear-gradient(90deg, #12182d 0%, #1b2745 100%)';
    overlay.style.border = `2px solid ${COLORS.TEXT_TITLE}`;
    overlay.style.borderBottom = '0';
    overlay.style.boxShadow = '0 -8px 24px rgba(0, 0, 0, 0.25) inset, 0 0 28px rgba(92, 200, 255, 0.18)';
    overlay.style.boxSizing = 'border-box';
    overlay.style.minHeight = `${SPACING.XXL + SPACING.SM}px`;
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
  }
  return overlay;
}

function createPill(text, accent) {
  const el = document.createElement('span');
  el.textContent = text;
  el.style.display = 'inline-flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.minWidth = '96px';
  el.style.padding = `${SPACING.XS}px ${SPACING.SM}px`;
  el.style.border = `1px solid ${accent}`;
  el.style.background = 'rgba(255, 255, 255, 0.08)';
  el.style.boxShadow = `inset 0 -2px 0 rgba(0, 0, 0, 0.22), 0 0 16px ${accent}33`;
  el.style.fontWeight = '700';
  el.style.letterSpacing = '0.2px';
  return el;
}

export function createHud(scene, total) {
  const container = getContainer();
  if (!container) return null;

  const overlay = ensureOverlay();
  container.appendChild(overlay);
  container.style.display = 'block';

  overlay.innerHTML = '';

  const logoEl = createPill(`Logo: ${total}/${total}`, COLORS.TEXT_HIGHLIGHT);
  logoEl.setAttribute('aria-label', `Còn lại ${total} logo để thu thập`);

  const timerEl = createPill('Time: 0s', COLORS.PLAYER_2);
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
