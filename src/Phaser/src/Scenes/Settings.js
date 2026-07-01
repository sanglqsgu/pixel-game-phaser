import Phaser from 'phaser';
import { getDimensions } from '../Game/gameSettings';
import { COLORS, FONT } from '../Common/tokens';
import { GAMEMODES, getGamemodeInfo } from '../Game/gameSettings';
import { GESTURES, gestureDetection } from '../Game/gestures';
import { destroyHud } from '../Game/gameHud';
import { saveGameSettings } from '../Game/gameProgress';
import {
  createNavigationKeys,
  isKeyJustDown,
  setupDoubleTap,
  isDoubleTap,
} from '../Game/sceneInput';

const UI_FONT = FONT.UI_TEXT;
const PIXEL_FONT = FONT.GAME_TITLE;

export default class Settings extends Phaser.Scene {
  constructor() {
    super('Settings');
  }

  init(data) {
    this.settings = data;
    this.handleGesture = this.handleGesture.bind(this);
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.BG_PRIMARY);
    createNavigationKeys(this, {
      left: 'A',
      arrowLeft: 'left',
      right: 'D',
      arrowRight: 'right',
    });
    gestureDetection(this.input, this.handleGesture);

    this.gameDimensions = getDimensions(this.game);
    this.choice = 0;
    setupDoubleTap(this);

    this.drawScreen();
  }

  drawFrame() {
    const { screenLength } = this.gameDimensions;
    const g = this.add.graphics();
    g.fillStyle(0x18203a, 1);
    g.fillRect(0, 0, screenLength, screenLength);
    g.fillStyle(0x5cc8ff, 0.08);
    g.fillRect(0, 0, screenLength, screenLength * 0.28);
    g.lineStyle(2, 0x5cc8ff, 0.7);
    g.strokeRect(9, 9, screenLength - 18, screenLength - 18);
    g.lineStyle(1, 0xffb238, 0.42);
    g.strokeRect(16, 16, screenLength - 32, screenLength - 32);
  }

  drawScreen() {
    const centerX = this.gameDimensions.screenCenter;
    const unit = this.gameDimensions.screenSpaceUnit;
    const screenLength = this.gameDimensions.screenLength;

    this.drawFrame();

    this.add
      .text(centerX, unit * 2.25, 'Settings', {
        fontFamily: PIXEL_FONT,
        fontSize: '24px',
        color: COLORS.TEXT_PRIMARY,
        stroke: '#070a13',
        strokeThickness: 6,
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(centerX, unit * 3.7, 'Tinh chỉnh trước khi vào mê cung', {
        fontFamily: UI_FONT,
        fill: COLORS.TEXT_SECONDARY,
        fontSize: this.gameDimensions.textSize4,
      })
      .setOrigin(0.5, 0.5);

    const card = this.add.graphics();
    card.fillStyle(0x101426, 0.78);
    card.fillRoundedRect(unit * 1.35, unit * 5.1, screenLength - unit * 2.7, unit * 10.4, 12);
    card.lineStyle(2, 0x5cc8ff, 0.35);
    card.strokeRoundedRect(unit * 1.35, unit * 5.1, screenLength - unit * 2.7, unit * 10.4, 12);

    const options = [
      {
        label: 'Grid size',
        hint: 'Kích thước mê cung',
        value: () => `${this.settings.gridSize} x ${this.settings.gridSize}`,
        adjust: (dir) => this.updateGridSize(dir),
      },
      {
        label: 'Game mode',
        hint: 'Chế độ chơi',
        value: () => getGamemodeInfo(this.settings.gameMode).text,
        adjust: (dir) => this.updateGameMode(dir),
      },
      { label: 'Return', hint: 'Quay về menu chính', value: () => '', adjust: null },
    ];

    this.optionTexts = options.map((opt, idx) => {
      const y = unit * (7 + idx * 3.25);
      const panelW = screenLength * 0.72;
      const panelH = unit * 2.35;
      const panel = this.add.graphics();
      const label = this.add.text(centerX - panelW * 0.4, y - unit * 0.42, opt.label, {
        fontFamily: PIXEL_FONT,
        fill: COLORS.TEXT_PRIMARY,
        fontSize: '11px',
      });
      label.setOrigin(0, 0.5);
      const hint = this.add.text(centerX - panelW * 0.4, y + unit * 0.45, opt.hint, {
        fontFamily: UI_FONT,
        fill: COLORS.TEXT_SECONDARY,
        fontSize: this.gameDimensions.textSize4,
      });
      hint.setOrigin(0, 0.5);
      const value = this.add.text(centerX + panelW * 0.39, y, opt.adjust ? opt.value() : 'MENU', {
        fontFamily: UI_FONT,
        fill: COLORS.TEXT_HIGHLIGHT,
        fontSize: this.gameDimensions.textSize3,
        fontStyle: 'bold',
      });
      value.setOrigin(1, 0.5);
      const left = this.add.text(centerX + panelW * 0.08, y, opt.adjust ? '◀' : '', {
        fontFamily: UI_FONT,
        fill: COLORS.TEXT_DIM,
        fontSize: this.gameDimensions.textSize3,
      });
      left.setOrigin(0.5, 0.5);
      const right = this.add.text(centerX + panelW * 0.45, y, opt.adjust ? '▶' : '▶', {
        fontFamily: UI_FONT,
        fill: COLORS.TEXT_DIM,
        fontSize: this.gameDimensions.textSize3,
      });
      right.setOrigin(0.5, 0.5);
      return { panel, label, hint, value, left, right, config: opt, y, panelW, panelH };
    });

    this.refreshAllOptions();

    this.add
      .text(centerX, unit * 17.7, '◀ ▶ thay đổi  •  ↑ ↓ chọn  •  Enter xác nhận', {
        fontFamily: UI_FONT,
        fill: COLORS.TEXT_DIM,
        fontSize: this.gameDimensions.textSize4,
      })
      .setOrigin(0.5, 0.5);
  }

  refreshAllOptions() {
    this.optionTexts.forEach((_, idx) => this.refreshOption(idx));
  }

  refreshOption(idx) {
    const opt = this.optionTexts[idx];
    if (!opt) return;
    const isSelected = idx === this.choice;
    const centerX = this.gameDimensions.screenCenter;

    opt.panel.clear();
    opt.panel.fillStyle(isSelected ? 0xffb238 : 0x18203a, isSelected ? 0.96 : 0.88);
    opt.panel.fillRoundedRect(
      centerX - opt.panelW / 2,
      opt.y - opt.panelH / 2,
      opt.panelW,
      opt.panelH,
      9
    );
    opt.panel.lineStyle(2, isSelected ? 0xffffff : 0x5cc8ff, isSelected ? 0.85 : 0.35);
    opt.panel.strokeRoundedRect(
      centerX - opt.panelW / 2,
      opt.y - opt.panelH / 2,
      opt.panelW,
      opt.panelH,
      9
    );

    opt.label.setColor(isSelected ? COLORS.BG_PRIMARY : COLORS.TEXT_PRIMARY);
    opt.hint.setColor(isSelected ? '#4a3307' : COLORS.TEXT_SECONDARY);
    opt.value.setText(opt.config.adjust ? opt.config.value() : 'MENU');
    opt.value.setColor(isSelected ? COLORS.BG_PRIMARY : COLORS.TEXT_HIGHLIGHT);
    opt.left.setColor(isSelected ? COLORS.BG_PRIMARY : COLORS.TEXT_DIM);
    opt.right.setColor(isSelected ? COLORS.BG_PRIMARY : COLORS.TEXT_DIM);
  }

  handleGesture(detection) {
    if (detection.gesture === GESTURES.SWIPE_UP) this.updateChoice(-1);
    else if (detection.gesture === GESTURES.SWIPE_DOWN) this.updateChoice(1);
    else if (detection.gesture === GESTURES.SWIPE_RIGHT) this.updateSelection(1);
    else if (detection.gesture === GESTURES.SWIPE_LEFT) this.updateSelection(-1);
    else if (detection.gesture === GESTURES.SINGLE_TAP && isDoubleTap(this)) {
      if (this.choice === 2) this.scene.start('MainMenu', this.settings);
    }
  }

  update() {
    if (isKeyJustDown(this, 'up')) this.updateChoice(-1);
    if (isKeyJustDown(this, 'down')) this.updateChoice(1);
    if (isKeyJustDown(this, 'right')) this.updateSelection(1);
    if (isKeyJustDown(this, 'left')) this.updateSelection(-1);
    if (isKeyJustDown(this, 'select') && this.choice === 2) {
      this.scene.start('MainMenu', this.settings);
    }
  }

  updateChoice(direction) {
    const newChoice = this.choice + direction;
    if (newChoice > -1 && newChoice < this.optionTexts.length) {
      this.choice = newChoice;
      this.refreshAllOptions();
    }
  }

  updateSelection(direction) {
    const opt = this.optionTexts[this.choice];
    if (opt && opt.config.adjust) {
      opt.config.adjust(direction);
      this.refreshOption(this.choice);
    } else if (this.choice === 2 && direction !== 0) {
      this.scene.start('MainMenu', this.settings);
    }
  }

  updateGridSize(direction) {
    const newGridSize = this.settings.gridSize + direction;
    if (
      newGridSize > this.settings.minGridSize - 1 &&
      newGridSize < this.settings.maxGridSize + 1
    ) {
      this.settings.gridSize = newGridSize;
      saveGameSettings(this.settings);
    }
  }

  updateGameMode(direction) {
    const newGameMode = this.settings.gameMode + direction;
    if (newGameMode > -1 && newGameMode < Object.keys(GAMEMODES).length) {
      this.settings.gameMode = newGameMode;
      saveGameSettings(this.settings);
    }
  }

  shutdown() {
    destroyHud();
  }
}
