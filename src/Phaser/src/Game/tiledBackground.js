/**
 * Keys used to load the tiled background assets. Centralized here so
 * MainMenu and any other scene can share the same assets.
 */
export const TILED_KEYS = {
  image: 'bg-tiles'
};

/**
 * Queue loading the pre-rendered background image. We deliberately
 * skip bg.json: the original Tiled file references a tileset of
 * millions of tiles whose source image is no longer available, so the
 * matching .tsx file is missing. The pre-rendered bg.png (320x320)
 * already contains the whole 20x20 map, which is sufficient as a
 * decorative background for the menu.
 *
 * @param {Phaser.Scene} scene - The scene that should preload the asset.
 */
export function loadTiledBackground(scene) {
  // CRA injects PUBLIC_URL at build time so that assets placed under
  // `public/` resolve correctly even when the app is hosted under a
  // sub-path (e.g. https://wjxhenry.github.io/Phaser-Maze-Game/).
  const baseUrl = process.env.PUBLIC_URL || '';
  const imageUrl = `${baseUrl}/assets/tiled/bg.png`;
  // Helpful while debugging: surface the exact URL Phaser is requesting
  // in the browser console / dev tools network tab.
  // eslint-disable-next-line no-console
  console.log('[tiledBackground] loading', imageUrl);
  scene.load.image(TILED_KEYS.image, imageUrl);
}

/**
 * Display the pre-rendered background image, scaled to cover the
 * game canvas and centered. Sent behind any text added afterwards.
 *
 * @param {Phaser.Scene} scene - The scene that owns the background.
 */
export function createTiledBackground(scene) {
  const canvasWidth = scene.game.config.width;
  const canvasHeight = scene.game.config.height;

  // bg.png is the 320x320 (20x20 tiles) pre-rendered version of the map.
  // Scale it so the longest canvas side is covered (zoom-to-fill).
  // This makes the map visibly large even when the canvas is a small
  // square relative to the window.
  const longestSide = Math.max(canvasWidth, canvasHeight);
  const scale = longestSide / 320;

  const x = canvasWidth / 2;
  const y = canvasHeight / 2;

  // Black backdrop behind everything else so the empty canvas borders
  // (when the map is scaled to fit the longer side) read as a solid
  // background instead of whatever the camera default is.
  const backdrop = scene.add.rectangle(
    x,
    y,
    canvasWidth,
    canvasHeight,
    0x757373
  );
  backdrop.setDepth(-2);

  const bg = scene.add.image(x, y, TILED_KEYS.image);
  bg.setScale(scale);
  bg.setDepth(-1);
  return bg;
}
