import Phaser from 'phaser';
import {
  initSettings,
  getDimensions,
  getGamemodeInfo,
} from '../Game/gameSettings';
import { COLORS, FONT } from '../Common/tokens';
import { GESTURES, gestureDetection } from '../Game/gestures';
import {
  loadTiledBackground,
  createTiledBackground,
} from '../Game/tiledBackground';
import { destroyHud } from '../Game/gameHud';
import { loadSavedGameSettings, saveGameSettings } from '../Game/gameProgress';

const PIXEL_FONT = FONT.GAME_TITLE;
const UI_FONT = FONT.UI_TEXT;

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  init(data) {
    this.settings = { ...initSettings(), ...loadSavedGameSettings(), ...data };
    saveGameSettings(this.settings);
    this.handleGesture = this.handleGesture.bind(this);
  }

  preload() {
    loadTiledBackground(this);
  }

  create() {
    destroyHud();
    this.cameras.main.setBackgroundColor(COLORS.BG_PRIMARY);
    this.keys = this.input.keyboard.addKeys({
      up: 'W',
      arrowUp: 'up',
      down: 'S',
      arrowDown: 'down',
      select: 'Enter',
    });
    gestureDetection(this.input, this.handleGesture);

    this.gameDimensions = getDimensions(this.game);
    this.choice = 0;
    this.doubleTapTimer = 0;
    this.doubleTapCooldown = 200;

    createTiledBackground(this);
    this.drawScreen();
  }

  drawFrame() {
    const { screenLength } = this.gameDimensions;
    const g = this.add.graphics();
    g.lineStyle(2, 0x5cc8ff, 0.75);
    g.strokeRect(8, 8, screenLength - 16, screenLength - 16);
    g.lineStyle(1, 0xffb238, 0.5);
    g.strokeRect(14, 14, screenLength - 28, screenLength - 28);

    for (let i = 0; i < 8; i += 1) {
      const y = 24 + i * 18;
      g.lineStyle(1, 0xffffff, 0.03);
      g.lineBetween(18, y, screenLength - 18, y);
    }
  }

  drawScreen() {
    const centerX = this.gameDimensions.screenCenter;
    const unit = this.gameDimensions.screenSpaceUnit;
    const screenLength = this.gameDimensions.screenLength;

    this.drawFrame();

    const titlePanel = this.add.graphics();
    titlePanel.fillStyle(0x101426, 0.82);
    titlePanel.fillRoundedRect(unit * 1.5, unit * 1.4, screenLength - unit * 3, unit * 5.4, 12);
    titlePanel.lineStyle(2, 0x5cc8ff, 0.5);
    titlePanel.strokeRoundedRect(unit * 1.5, unit * 1.4, screenLength - unit * 3, unit * 5.4, 12);

    this.add
      .text(centerX, unit * 2.7, 'Vượt mê cung', {
        fontFamily: PIXEL_FONT,
        fontSize: '30px',
        color: COLORS.TEXT_PRIMARY,
        stroke: '#070a13',
        strokeThickness: 7,
        shadow: {
          offsetX: 3,
          offsetY: 4,
          color: '#000000',
          blur: 0,
          fill: true,
        },
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(centerX, unit * 4.35, 'cùng JETBOT', {
        fontFamily: PIXEL_FONT,
        fontSize: '20px',
        color: COLORS.TEXT_HIGHLIGHT,
        stroke: '#070a13',
        strokeThickness: 5,
      })
      .setOrigin(0.5, 0.5);

    const mode = getGamemodeInfo(this.settings.gameMode).text || 'Solo';
    this.add
      .text(centerX, unit * 5.8, `MODE: ${mode}  |  GRID: ${this.settings.gridSize}x${this.settings.gridSize}`, {
        fontFamily: UI_FONT,
        fontSize: this.gameDimensions.textSize4,
        color: COLORS.TEXT_SECONDARY,
      })
      .setOrigin(0.5, 0.5);

    const menuItems = [
      {
        label: 'Start Game',
        detail: 'Bắt đầu hành trình',
        scene: getGamemodeInfo(this.settings.gameMode).scene,
      },
      { label: 'Settings', detail: 'Chỉnh lưới và chế độ', scene: 'Settings' },
      { label: 'Lịch sử', detail: 'Xem kết quả đã lưu', scene: 'History' },
    ];

    this.menuTexts = [];

    menuItems.forEach((item, idx) => {
      const y = unit * (9 + idx * 3.25);
      const panelW = screenLength * 0.68;
      const panelH = unit * 2.45;
      const panel = this.add.graphics();
      const label = this.add.text(centerX - panelW * 0.38, y - unit * 0.28, item.label, {
        fontFamily: PIXEL_FONT,
        fontSize: '13px',
        color: COLORS.TEXT_PRIMARY,
      });
      label.setOrigin(0, 0.5);
      const detail = this.add.text(centerX - panelW * 0.38, y + unit * 0.5, item.detail, {
        fontFamily: UI_FONT,
        fontSize: this.gameDimensions.textSize4,
        color: COLORS.TEXT_SECONDARY,
      });
      detail.setOrigin(0, 0.5);
      const marker = this.add.text(centerX + panelW * 0.37, y, '▶', {
        fontFamily: PIXEL_FONT,
        fontSize: '14px',
        color: COLORS.TEXT_HIGHLIGHT,
      });
      marker.setOrigin(0.5, 0.5);

      this.menuTexts.push({ label, detail, marker, config: item, panel, y, panelW, panelH });
    });

    this.refreshMenu();

    this.add
      .text(centerX, unit * 18.35, 'W/S hoặc ↑/↓ để chọn  •  Enter để xác nhận', {
        fontFamily: UI_FONT,
        fill: COLORS.TEXT_DIM,
        fontSize: this.gameDimensions.textSize4,
      })
      .setOrigin(0.5, 0.5);
  }

  refreshMenu() {
    const centerX = this.gameDimensions.screenCenter;

    this.menuTexts.forEach((item, idx) => {
      const isSelected = idx === this.choice;
      item.panel.clear();
      item.panel.fillStyle(isSelected ? 0xffb238 : 0x101426, isSelected ? 0.96 : 0.78);
      item.panel.fillRoundedRect(
        centerX - item.panelW / 2,
        item.y - item.panelH / 2,
        item.panelW,
        item.panelH,
        9
      );
      item.panel.lineStyle(2, isSelected ? 0xffffff : 0x5cc8ff, isSelected ? 0.85 : 0.42);
      item.panel.strokeRoundedRect(
        centerX - item.panelW / 2,
        item.y - item.panelH / 2,
        item.panelW,
        item.panelH,
        9
      );
      item.label.setColor(isSelected ? COLORS.BG_PRIMARY : COLORS.TEXT_PRIMARY);
      item.detail.setColor(isSelected ? '#3b2a05' : COLORS.TEXT_SECONDARY);
      item.marker.setColor(isSelected ? COLORS.BG_PRIMARY : COLORS.TEXT_HIGHLIGHT);
      item.marker.setAlpha(isSelected ? 1 : 0.45);
    });
  }

  handleGesture(detection) {
    if (detection.gesture === GESTURES.SWIPE_UP) {
      this.updateChoice(-1);
    } else if (detection.gesture === GESTURES.SWIPE_DOWN) {
      this.updateChoice(1);
    } else if (detection.gesture === GESTURES.SINGLE_TAP) {
      if (new Date().getTime() - this.doubleTapTimer < this.doubleTapCooldown) {
        this.scene.start(this.menuTexts[this.choice].config.scene, this.settings);
      }
      this.doubleTapTimer = new Date().getTime();
    }
  }

  update() {
    if (
      Phaser.Input.Keyboard.JustDown(this.keys.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowUp)
    ) {
      this.updateChoice(-1);
    }
    if (
      Phaser.Input.Keyboard.JustDown(this.keys.down) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowDown)
    ) {
      this.updateChoice(1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.select)) {
      this.scene.start(this.menuTexts[this.choice].config.scene, this.settings);
    }
  }

  updateChoice(direction) {
    const newChoice = this.choice + direction;
    if (newChoice > -1 && newChoice < this.menuTexts.length) {
      this.choice = newChoice;
      this.refreshMenu();
    }
  }

  shutdown() {
    destroyHud();
  }
}
