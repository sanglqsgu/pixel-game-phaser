const STORAGE_KEY = 'game_history';

export function saveGameResult(result) {
  const history = getGameHistory();
  history.unshift({
    ...result,
    date: Date.now(),
  });
  if (history.length > 20) history.length = 20;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getGameHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function clearGameHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
