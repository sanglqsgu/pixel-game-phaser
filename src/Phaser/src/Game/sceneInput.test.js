import { setupDoubleTap, isDoubleTap } from './sceneInput';

describe('sceneInput', () => {
  it('setupDoubleTap initializes timer and cooldown', () => {
    const scene = {};
    setupDoubleTap(scene);
    expect(scene.doubleTapTimer).toBe(0);
    expect(scene.doubleTapCooldown).toBe(200);
  });

  it('isDoubleTap returns false on first call', () => {
    const scene = {};
    setupDoubleTap(scene);
    expect(isDoubleTap(scene)).toBe(false);
  });

  it('isDoubleTap returns true on rapid second call', () => {
    const scene = {};
    setupDoubleTap(scene);
    isDoubleTap(scene);
    expect(isDoubleTap(scene)).toBe(true);
  });
});
