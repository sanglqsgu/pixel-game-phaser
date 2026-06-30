import Phaser from 'phaser';
void Phaser;

const RANDOM_IMAGE_KEYS = ['ob', 'ob1', 'ob2', 'ob3', 'ob4'];

export function loadRandomImages(scene) {
  const baseUrl = process.env.PUBLIC_URL || '';
  RANDOM_IMAGE_KEYS.forEach(key => {
    const imageUrl = `${baseUrl}/assets/tiled/${key}.png`;
    scene.load.image(`random-${key}`, imageUrl);
  });
}

export function pickRandomMazeCells(maze, count, excludeKeys = []) {
  const exclude = new Set(excludeKeys);
  const vertices = Array.from(maze.getVertices());
  const reachable = vertices.filter(vertex => {
    if (exclude.has(vertex)) return false;
    const [x, y] = vertex.split(',').map(Number);
    const neighbours = [
      `${x + 1},${y}`,
      `${x - 1},${y}`,
      `${x},${y + 1}`,
      `${x},${y - 1}`,
    ];
    return neighbours.some(n => maze.isEdge([vertex, n]));
  });

  for (let i = reachable.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [reachable[i], reachable[j]] = [reachable[j], reachable[i]];
  }
  return reachable.slice(0, Math.min(count, reachable.length));
}

export function placeRandomImages(scene, mazeGraphics, maze, options = {}) {
  const excludePositions = options.excludePositions || [];

  const excludeKeys = excludePositions.map(p => `${p.x},${p.y}`);
  const cells = pickRandomMazeCells(
    maze,
    RANDOM_IMAGE_KEYS.length,
    excludeKeys
  );

  const baseDepth = (mazeGraphics.depth || 0) + 1;

  const placed = cells.map((vertex, idx) => {
    const [vx, vy] = vertex.split(',').map(Number);
    const cellX = vx * maze.sideLength + 1;
    const cellY = vy * maze.sideLength + 1;
    const cellSize = maze.sideLength - 2;
    const key = `random-${RANDOM_IMAGE_KEYS[idx]}`;

    scene.textures.get(key).setFilter(1);
    const img = scene.add.image(
      cellX + cellSize / 2,
      cellY + cellSize / 2,
      key
    );
    const scale = cellSize / img.width;
    img.setScale(scale);
    img.setDepth(baseDepth + idx);
    img.setData('gridKey', `${vx},${vy}`);

    return img;
  });

  return placed;
}

export function buildObstacleMap(obstacles) {
  const map = new Map();
  obstacles.forEach(img => {
    const key = img.getData('gridKey');
    if (key) {
      map.set(key, img);
    }
  });
  return map;
}

export function removeObstacleAt(position, obstacles) {
  if (!obstacles) return false;
  const key = `${position.x},${position.y}`;
  const img = obstacles.get(key);
  if (!img) return false;
  const textureKey = img.texture.key;
  img.destroy();
  obstacles.delete(key);
  return textureKey;
}

export function getObstacleCount(obstacles) {
  return obstacles ? obstacles.size : 0;
}
