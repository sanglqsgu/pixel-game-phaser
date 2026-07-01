import { COLORS } from '../Common/tokens';

export const MAZE_MARKER_KEYS = {
  start: 'maze-marker-start',
  finish: 'maze-marker-finish',
};

export function loadMazeMarkers(scene) {
  const baseUrl = process.env.PUBLIC_URL || '';
  scene.load.svg(
    MAZE_MARKER_KEYS.start,
    `${baseUrl}/assets/tiled/marker-start.svg`,
    { width: 96, height: 96 }
  );
  scene.load.svg(
    MAZE_MARKER_KEYS.finish,
    `${baseUrl}/assets/tiled/marker-finish.svg`,
    { width: 96, height: 96 }
  );
}

function cellCenter(maze, position) {
  return {
    x: position.x * maze.sideLength + maze.sideLength / 2 + 1,
    y: position.y * maze.sideLength + maze.sideLength / 2 + 1,
  };
}

export function drawMazeMarker(scene, maze, position, options = {}) {
  const kind = options.kind || 'finish';
  const key = kind === 'start' ? MAZE_MARKER_KEYS.start : MAZE_MARKER_KEYS.finish;
  const accent = options.accent || (kind === 'start' ? 0x19d39b : 0xffb238);
  const label = options.label || (kind === 'start' ? 'START' : 'FINISH');
  const center = cellCenter(maze, position);
  center.x += options.offsetX || 0;
  center.y += options.offsetY || 0;
  const cellSize = maze.sideLength - 2;
  const ringSize = Math.max(cellSize * 0.92, 8);

  const ring = scene.add.graphics();
  ring.lineStyle(Math.max(2, cellSize * 0.08), accent, 0.95);
  ring.strokeRoundedRect(
    center.x - ringSize / 2,
    center.y - ringSize / 2,
    ringSize,
    ringSize,
    Math.max(3, cellSize * 0.16)
  );
  ring.lineStyle(1, 0xffffff, 0.62);
  ring.strokeRoundedRect(
    center.x - ringSize / 2 + 2,
    center.y - ringSize / 2 + 2,
    ringSize - 4,
    ringSize - 4,
    Math.max(2, cellSize * 0.12)
  );
  ring.setDepth(options.depth || 620);

  const icon = scene.add.image(center.x, center.y, key);
  icon.setDepth((options.depth || 620) + 1);
  icon.setAlpha(options.iconAlpha || 0.92);
  icon.setScale(Math.max(0.12, Math.min(0.58, cellSize / 96 * 0.95)));

  let tag = null;
  if (cellSize >= 18) {
    const fontSize = Math.max(8, Math.min(13, cellSize * 0.28));
    const tagY = center.y - cellSize * 0.42;
    tag = scene.add.text(center.x, tagY, label, {
      fontFamily: 'Ubuntu, sans-serif',
      fontSize: `${fontSize}px`,
      color: COLORS.TEXT_PRIMARY,
      backgroundColor: kind === 'start' ? '#0f6f55' : '#8a5a00',
      padding: { x: 4, y: 1 },
      fontStyle: 'bold',
    });
    tag.setOrigin(0.5, 0.5);
    tag.setDepth((options.depth || 620) + 3);
  }

  return { ring, icon, tag };
}
