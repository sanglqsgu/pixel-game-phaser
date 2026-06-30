import { COLORS, COLORS_0x, SPACING, FONT } from './tokens';

describe('tokens', () => {
  it('has all required color tokens', () => {
    const required = [
      'BG_PRIMARY',
      'BG_SECONDARY',
      'TEXT_PRIMARY',
      'TEXT_SECONDARY',
      'TEXT_TITLE',
      'TEXT_HIGHLIGHT',
      'TEXT_DIM',
      'PLAYER_1',
      'PLAYER_2',
      'MAZE_WALL',
      'MAZE_END',
      'HUD_TEXT',
      'BG_BACKDROP',
    ];
    required.forEach(key => {
      expect(COLORS).toHaveProperty(key);
      expect(COLORS[key]).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('has all required 0x color tokens', () => {
    const required = [
      'BG_PRIMARY',
      'MAZE_WALL',
      'MAZE_END',
      'PLAYER_1',
      'PLAYER_2',
      'BG_BACKDROP',
    ];
    required.forEach(key => {
      expect(COLORS_0x).toHaveProperty(key);
      expect(COLORS_0x[key]).toMatch(/^0x[0-9a-fA-F]{6}$/);
    });
  });

  it('has spacing scale values', () => {
    expect(SPACING.XS).toBe(4);
    expect(SPACING.SM).toBe(8);
    expect(SPACING.MD).toBe(12);
    expect(SPACING.LG).toBe(16);
    expect(SPACING.XL).toBe(24);
    expect(SPACING.XXL).toBe(32);
  });

  it('has font tokens', () => {
    expect(FONT.GAME_TITLE).toContain('Press Start 2P');
    expect(FONT.UI_TEXT).toContain('Ubuntu');
  });
});
