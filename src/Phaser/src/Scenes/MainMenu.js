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

const PIXEL_FONT = FONT.GAME_TITLE;

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  init(data) {
    this.settings = { ...initSettings(), ...data };
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

  drawScreen() {
    const centerX = this.gameDimensions.screenCenter;
    const unit = this.gameDimensions.screenSpaceUnit;

    this.add
      .text(centerX, unit * 2.5, 'Vượt mê cung', {
        fontFamily: PIXEL_FONT,
        fontSize: '30px',
        color: COLORS.TEXT_TITLE,
        stroke: COLORS.BG_PRIMARY,
        strokeThickness: 6,
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: COLORS.BG_PRIMARY,
          blur: 0,
          fill: true,
        },
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(centerX, unit * 4.5, 'cùng JETBOT', {
        fontFamily: PIXEL_FONT,
        fontSize: '22px',
        color: COLORS.TEXT_TITLE,
        stroke: COLORS.BG_PRIMARY,
        strokeThickness: 6,
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: COLORS.BG_PRIMARY,
          blur: 0,
          fill: true,
        },
      })
      .setOrigin(0.5, 0.5);

    const menuItems = [
      {
        label: 'Start Game',
        scene: getGamemodeInfo(this.settings.gameMode).scene,
      },
      { label: 'Settings', scene: 'Settings' },
      { label: 'Lịch sử', scene: 'History' },
    ];

    this.optionPanels = [];
    this.menuTexts = [];

    menuItems.forEach((item, idx) => {
      const y = unit * (9 + idx * 4);
      const isSelected = idx === this.choice;

      const panelW = this.gameDimensions.screenLength * 0.5;
      const panelH = unit * 2.5;

      const panel = this.add.graphics();
      if (isSelected) {
        panel.fillStyle(0xf0a500, 1);
        panel.fillRoundedRect(
          centerX - panelW / 2,
          y - panelH / 2,
          panelW,
          panelH,
          10
        );
      } else {
        panel.fillStyle(0x000000, 0.4);
        panel.fillRoundedRect(
          centerX - panelW / 2,
          y - panelH / 2,
          panelW,
          panelH,
          10
        );
        panel.lineStyle(2, 0xf0a500, 0.6);
        panel.strokeRoundedRect(
          centerX - panelW / 2,
          y - panelH / 2,
          panelW,
          panelH,
          10
        );
      }

      const textColor = isSelected ? COLORS.BG_PRIMARY : COLORS.TEXT_HIGHLIGHT;
      const textObj = this.add
        .text(centerX, y, item.label, {
          fontFamily: PIXEL_FONT,
          fontSize: '18px',
          color: textColor,
          fontStyle: isSelected ? 'bold' : 'normal',
        })
        .setOrigin(0.5, 0.5);

      this.optionPanels.push(panel);
      this.menuTexts.push({ textObj, config: item, panel });
    });
  }

  refreshMenu() {
    const centerX = this.gameDimensions.screenCenter;
    const unit = this.gameDimensions.screenSpaceUnit;

    this.menuTexts.forEach((item, idx) => {
      const y = unit * (9 + idx * 4);
      const isSelected = idx === this.choice;
      const panelW = this.gameDimensions.screenLength * 0.5;
      const panelH = unit * 2.5;

      item.panel.clear();
      if (isSelected) {
        item.panel.fillStyle(0xf0a500, 1);
        item.panel.fillRoundedRect(
          centerX - panelW / 2,
          y - panelH / 2,
          panelW,
          panelH,
          10
        );
      } else {
        item.panel.fillStyle(0x000000, 0.4);
        item.panel.fillRoundedRect(
          centerX - panelW / 2,
          y - panelH / 2,
          panelW,
          panelH,
          10
        );
        item.panel.lineStyle(2, 0xf0a500, 0.6);
        item.panel.strokeRoundedRect(
          centerX - panelW / 2,
          y - panelH / 2,
          panelW,
          panelH,
          10
        );
      }

      const textColor = isSelected ? COLORS.BG_PRIMARY : COLORS.TEXT_HIGHLIGHT;
      item.textObj.setColor(textColor);
      item.textObj.setFontStyle(isSelected ? 'bold' : 'normal');
    });
  }

  handleGesture(detection) {
    if (detection.gesture === GESTURES.SWIPE_UP) {
      this.updateChoice(-1);
    } else if (detection.gesture === GESTURES.SWIPE_DOWN) {
      this.updateChoice(1);
    } else if (detection.gesture === GESTURES.SINGLE_TAP) {
      if (new Date().getTime() - this.doubleTapTimer < this.doubleTapCooldown) {
        this.scene.start(
          this.menuTexts[this.choice].config.scene,
          this.settings
        );
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
      this.scene.start(
        this.menuTexts[this.choice].config.scene,
        this.settings
      );
    }
  }

  updateChoice(direction) {
    let newChoice = this.choice + direction;
    if (newChoice > -1 && newChoice < this.menuTexts.length) {
      this.choice = newChoice;
      this.refreshMenu();
    }
  }

  shutdown() {
    destroyHud();
  }
}
