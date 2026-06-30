import Phaser from 'phaser';

export function createNavigationKeys(scene, extraKeys = {}) {
  const defaultKeys = {
    up: 'W',
    arrowUp: 'up',
    down: 'S',
    arrowDown: 'down',
    select: 'Enter',
    ...extraKeys,
  };

  if (extraKeys.exit) {
    defaultKeys.exit = extraKeys.exit;
  }

  scene.keys = scene.input.keyboard.addKeys(defaultKeys);
}

export function handleMenuNavigation(scene, choice, options, direction) {
  let newChoice = choice + direction;
  if (newChoice > -1 && newChoice < options.length) {
    options[choice].setColor('#8d99ae');
    options[newChoice].setColor('#f0a500');
    return newChoice;
  }
  return choice;
}

export function isKeyJustDown(scene, keyName) {
  const arrowKey =
    scene.keys[`arrow${keyName.charAt(0).toUpperCase() + keyName.slice(1)}`];
  return (
    Phaser.Input.Keyboard.JustDown(scene.keys[keyName]) ||
    (arrowKey && Phaser.Input.Keyboard.JustDown(arrowKey))
  );
}

export function isKeyDown(scene, keyName) {
  return scene.keys[keyName] && scene.keys[keyName].isDown;
}

export function setupDoubleTap(scene) {
  scene.doubleTapTimer = 0;
  scene.doubleTapCooldown = 200;
}

export function isDoubleTap(scene) {
  const now = new Date().getTime();
  if (now - scene.doubleTapTimer < scene.doubleTapCooldown) {
    scene.doubleTapTimer = now;
    return true;
  }
  scene.doubleTapTimer = now;
  return false;
}
