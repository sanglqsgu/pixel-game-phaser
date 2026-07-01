const SETTINGS_KEY = 'saved_game_settings';
const OLD_ACTIVE_PROGRESS_KEY = 'active_game_progress';

export function saveGameSettings(settings = {}) {
  try {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        gridSize: settings.gridSize,
        gameMode: settings.gameMode,
      })
    );
  } catch (e) {
    // localStorage may be unavailable in private mode or tests.
  }
}

export function loadSavedGameSettings() {
  try {
    localStorage.removeItem(OLD_ACTIVE_PROGRESS_KEY);
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return {};
    const settings = JSON.parse(data);
    if (!settings || typeof settings !== 'object') return {};
    return settings;
  } catch (e) {
    return {};
  }
}
