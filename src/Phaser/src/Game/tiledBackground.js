export const TILED_KEYS = {
  image: 'bg-tiles',
};

export function loadTiledBackground(scene) {
  const baseUrl = process.env.PUBLIC_URL || '';
  scene.load.image(TILED_KEYS.image, `${baseUrl}/assets/tiled/bg.png`);
}

export function createTiledBackground(scene) {
  const canvasWidth = scene.game.config.width;
  const canvasHeight = scene.game.config.height;
  const longestSide = Math.max(canvasWidth, canvasHeight);
  const scale = longestSide / 320;
  const x = canvasWidth / 2;
  const y = canvasHeight / 2;

  const backdrop = scene.add.rectangle(x, y, canvasWidth, canvasHeight, 0x101426);
  backdrop.setDepth(-4);

  const bg = scene.add.image(x, y, TILED_KEYS.image);
  bg.setScale(scale * 1.08);
  bg.setAlpha(0.72);
  bg.setDepth(-3);

  const veil = scene.add.rectangle(x, y, canvasWidth, canvasHeight, 0x101426, 0.42);
  veil.setDepth(-2);

  const glowTop = scene.add.rectangle(x, canvasHeight * 0.12, canvasWidth, canvasHeight * 0.32, 0x5cc8ff, 0.08);
  glowTop.setDepth(-1);

  const vignette = scene.add.graphics();
  vignette.fillStyle(0x000000, 0.28);
  vignette.fillRect(0, 0, canvasWidth, canvasHeight * 0.08);
  vignette.fillRect(0, canvasHeight * 0.92, canvasWidth, canvasHeight * 0.08);
  vignette.fillRect(0, 0, canvasWidth * 0.06, canvasHeight);
  vignette.fillRect(canvasWidth * 0.94, 0, canvasWidth * 0.06, canvasHeight);
  vignette.setDepth(-1);

  return bg;
}
