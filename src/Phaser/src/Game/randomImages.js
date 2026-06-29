/**
 * Helpers that load `ob.png` and scatter 5–6 randomly transformed
 * copies of it across the maze. Phaser is only referenced as a runtime
 * dependency (the module itself is plain JS), so the import below is
 * kept for consumers and silenced with a `void` reference to avoid the
 * `no-unused-vars` ESLint rule.
 */
import Phaser from 'phaser';
void Phaser;

/**
 * Keys used to load the random decoration images that are scattered
 * across the maze. They are derived from the single `ob.png` source
 * image so we don't need additional asset files.
 */
export const RANDOM_IMAGE_KEY = 'random-ob';

/**
 * Load the source image used as decoration on the maze.
 *
 * @param {Phaser.Scene} scene - The scene that should preload the asset.
 */
export function loadRandomImages(scene) {
  const baseUrl = process.env.PUBLIC_URL || '';
  const imageUrl = `${baseUrl}/assets/tiled/ob.png`;
  // eslint-disable-next-line no-console
  console.log('[randomImages] loading', imageUrl);
  scene.load.image(RANDOM_IMAGE_KEY, imageUrl);
}

/**
 * Pick `count` random vertices from the maze that are reachable
 * (i.e. there is at least one edge connecting them to a neighbour),
 * excluding any cell whose key appears in `excludeKeys`.
 *
 * @param {Maze} maze - The maze graph (has `getVertices` / `isEdge`).
 * @param {Number} count - How many distinct vertices to pick.
 * @param {String[]} [excludeKeys] - Vertex keys (e.g. "x,y") to skip.
 * @returns {String[]} - The selected vertex keys.
 */
export function pickRandomMazeCells(maze, count, excludeKeys = []) {
  const exclude = new Set(excludeKeys);
  // Walk every vertex and keep those that have at least one edge – this
  // guarantees the decoration always lands on an open corridor cell
  // rather than on an isolated corner of the grid.
  // Note: Graph.getVertices() returns a Set, not an Array, so we have
  // to materialise it before we can use Array.prototype.filter.
  const vertices = Array.from(maze.getVertices());
  const reachable = vertices.filter(vertex => {
    if (exclude.has(vertex)) return false;
    const [x, y] = vertex.split(',').map(Number);
    const neighbours = [
      `${x + 1},${y}`,
      `${x - 1},${y}`,
      `${x},${y + 1}`,
      `${x},${y - 1}`
    ];
    return neighbours.some(n => maze.isEdge([vertex, n]));
  });

  // Fisher–Yates shuffle (in-place) then take the first `count`.
  for (let i = reachable.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [reachable[i], reachable[j]] = [reachable[j], reachable[i]];
  }
  return reachable.slice(0, Math.min(count, reachable.length));
}

/**
 * Pick between 5 and 6 (inclusive) distinct maze cells and decorate
 * them with a randomly transformed copy of `ob.png`.
 *
 * The image is rendered above the maze graphics but below the
 * characters so it never blocks the player's view of their own piece.
 *
 * @param {Phaser.Scene} scene - The active scene.
 * @param {Phaser.GameObjects.Graphics} mazeGraphics - The maze
 *        graphics layer; the random images are placed on top of it.
 * @param {GameMaze} maze - The maze instance used to compute pixel
 *        coordinates for each cell.
 * @param {Object} [options]
 * @param {Number} [options.minCount=5] - Minimum number of images.
 * @param {Number} [options.maxCount=6] - Maximum number of images.
 * @param {Array<{x:Number,y:Number}>} [options.excludePositions]
 *        - World-space grid positions to exclude (player / endpoints).
 * @returns {Phaser.GameObjects.Image[]} - The placed decoration images.
 */
export function placeRandomImages(scene, mazeGraphics, maze, options = {}) {
  const minCount = options.minCount || 5;
  const maxCount = options.maxCount || 6;
  const excludePositions = options.excludePositions || [];

  const range = maxCount - minCount + 1;
  const count = minCount + Math.floor(Math.random() * range);

  const excludeKeys = excludePositions.map(p => `${p.x},${p.y}`);
  const cells = pickRandomMazeCells(maze, count, excludeKeys);

  // Read the maze depth so we can place the decorations just above it.
  const baseDepth = (mazeGraphics.depth || 0) + 1;

  const placed = cells.map((vertex, idx) => {
    const [vx, vy] = vertex.split(',').map(Number);
    // Use the same coordinate transform as GameMaze.fillGrid so the
    // decoration lines up perfectly with the cell it occupies.
    const cellX = vx * maze.sideLength + 1;
    const cellY = vy * maze.sideLength + 1;
    const cellSize = maze.sideLength - 2;

    const img = scene.add.image(
      cellX + cellSize / 2,
      cellY + cellSize / 2,
      RANDOM_IMAGE_KEY
    );
    img.setDisplaySize(cellSize, cellSize);
    img.setDepth(baseDepth + idx);
    // Stash the grid coordinate on the image so the scene can look
    // up which cell each decoration occupies for collision checks.
    img.setData('gridKey', `${vx},${vy}`);

    // Randomise the appearance: pick a tint, rotation and a flip to
    // create 5–6 visually distinct decorations from a single source.
    const tints = [0xffffff, 0xffd966, 0x6fa8dc, 0x93c47d, 0xe06666, 0xb4a7d6];
    img.setTint(tints[idx % tints.length]);
    img.setRotation(Math.floor(Math.random() * 4) * (Math.PI / 2));
    img.setFlip(Math.random() < 0.5, Math.random() < 0.5);

    return img;
  });

  return placed;
}

/**
 * Build a fast lookup map from grid coordinate ("x,y") to the
 * decoration image that occupies that cell.
 *
 * @param {Phaser.GameObjects.Image[]} obstacles - Images returned
 *        from `placeRandomImages`.
 * @returns {Map<string, Phaser.GameObjects.Image>}
 */
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

/**
 * If a decoration occupies the given grid cell, destroy it and
 * remove it from the lookup map. Returns true when something was
 * removed (and the maze cell should be repainted with the path
 * colour by the caller), false otherwise.
 *
 * @param {{x:Number,y:Number}} position - The grid cell to test.
 * @param {Map<string, Phaser.GameObjects.Image>} obstacles
 *        - Lookup map produced by `buildObstacleMap`.
 * @returns {Boolean}
 */
export function removeObstacleAt(position, obstacles) {
  if (!obstacles) return false;
  const key = `${position.x},${position.y}`;
  const img = obstacles.get(key);
  if (!img) return false;
  img.destroy();
  obstacles.delete(key);
  return true;
}

/**
 * Returns how many decoration images are still on the maze. Used
 * to gate the win condition (the player must collect every one of
 * them) and to render a remaining-count indicator (the "logo").
 *
 * @param {Map<string, Phaser.GameObjects.Image>} obstacles
 *        - Lookup map produced by `buildObstacleMap`.
 * @returns {Number}
 */
export function getObstacleCount(obstacles) {
  return obstacles ? obstacles.size : 0;
}
