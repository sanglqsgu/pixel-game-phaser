import Phaser from 'phaser';
import { getDimensions } from '../Game/gameSettings';
import { COLORS, FONT } from '../Common/tokens';
import { GAMEMODES, getGamemodeInfo } from '../Game/gameSettings';
import { GESTURES, gestureDetection } from '../Game/gestures';
import { destroyHud } from '../Game/gameHud';
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
    this.cameras.main.setBackgroundColor(COLORS.BG_SECONDARY);
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

  drawScreen() {
    const centerX = this.gameDimensions.screenCenter;
    const unit = this.gameDimensions.screenSpaceUnit;

    this.add
      .text(centerX, unit * 2.5, 'Settings', {
        fontFamily: PIXEL_FONT,
        fontSize: '24px',
        color: COLORS.TEXT_TITLE,
        stroke: COLORS.BG_PRIMARY,
        strokeThickness: 4,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: COLORS.BG_PRIMARY,
          blur: 0,
          fill: true,
        },
      })
      .setOrigin(0.5, 0.5);

    const options = [
      {
        label: 'Grid size',
        value: () => `${this.settings.gridSize}`,
        adjust: (dir) => this.updateGridSize(dir),
      },
      {
        label: 'Game mode',
        value: () => getGamemodeInfo(this.settings.gameMode).text,
        adjust: (dir) => this.updateGameMode(dir),
      },
      { label: 'Return', value: () => '', adjust: null },
    ];

    this.optionTexts = options.map((opt, idx) => {
      const y = unit * (7 + idx * 3.5);
      const isSelected = idx === this.choice;

      const panelColor = isSelected ? 0xf0a500 : 0xffffff;
      const textColor = isSelected ? '#ffffff' : COLORS.BG_PRIMARY;

      const panel = this.add.graphics();
      const panelW = this.gameDimensions.screenLength * 0.6;
      const panelH = unit * 2.2;
      panel.fillStyle(panelColor, 1);
      panel.fillRoundedRect(centerX - panelW / 2, y - panelH / 2, panelW, panelH, 8);

      let displayText = opt.label;
      if (opt.adjust) {
        displayText += `: ${opt.value()}`;
      }

      const textObj = this.add
        .text(centerX, y, displayText, {
          fontFamily: UI_FONT,
          fill: textColor,
          fontSize: this.gameDimensions.textSize3,
          fontStyle: isSelected ? 'bold' : 'normal',
        })
        .setOrigin(0.5, 0.5);

      if (opt.adjust) {
        const arrowSize = this.gameDimensions.textSize4;
        const arrowY = y;

        this.add
          .text(centerX - panelW / 2 - arrowSize, arrowY, '◀', {
            fontFamily: UI_FONT,
            fill: isSelected ? COLORS.BG_PRIMARY : COLORS.TEXT_DIM,
            fontSize: arrowSize,
          })
          .setOrigin(0.5, 0.5);

        this.add
          .text(centerX + panelW / 2 + arrowSize, arrowY, '▶', {
            fontFamily: UI_FONT,
            fill: isSelected ? COLORS.BG_PRIMARY : COLORS.TEXT_DIM,
            fontSize: arrowSize,
          })
          .setOrigin(0.5, 0.5);
      }

      return { textObj, panel, config: opt };
    });

    this.add
      .text(centerX, unit * 18, '◀ ▶ to change  |  ↑ ↓ to navigate  |  Enter to select', {
        fontFamily: UI_FONT,
        fill: COLORS.TEXT_DIM,
        fontSize: this.gameDimensions.textSize4,
      })
      .setOrigin(0.5, 0.5);
  }

  refreshOption(idx) {
    const opt = this.optionTexts[idx];
    if (!opt) return;
    const isSelected = idx === this.choice;
    const centerX = this.gameDimensions.screenCenter;
    const y =
      this.gameDimensions.screenSpaceUnit * (7 + idx * 3.5);

    const panelColor = isSelected ? 0xf0a500 : 0xffffff;
    const textColor = isSelected ? '#ffffff' : COLORS.BG_PRIMARY;

    opt.panel.clear();
    const panelW = this.gameDimensions.screenLength * 0.6;
    const panelH = this.gameDimensions.screenSpaceUnit * 2.2;
    opt.panel.fillStyle(panelColor, 1);
    opt.panel.fillRoundedRect(
      centerX - panelW / 2,
      y - panelH / 2,
      panelW,
      panelH,
      8
    );

    let displayText = opt.config.label;
    if (opt.config.adjust) {
      displayText += `: ${opt.config.value()}`;
    }
    opt.textObj.setText(displayText);
    opt.textObj.setColor(textColor);
    opt.textObj.setFontStyle(isSelected ? 'bold' : 'normal');
  }

  handleGesture(detection) {
    if (detection.gesture === GESTURES.SWIPE_UP) this.updateChoice(-1);
    else if (detection.gesture === GESTURES.SWIPE_DOWN) this.updateChoice(1);
    else if (detection.gesture === GESTURES.SWIPE_RIGHT)
      this.updateSelection(1);
    else if (detection.gesture === GESTURES.SWIPE_LEFT)
      this.updateSelection(-1);
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
    const prevChoice = this.choice;
    let newChoice = this.choice + direction;
    if (newChoice > -1 && newChoice < this.optionTexts.length) {
      this.choice = newChoice;
      this.refreshOption(prevChoice);
      this.refreshOption(newChoice);
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
    let newGridSize = this.settings.gridSize + direction;
    if (
      newGridSize > this.settings.minGridSize - 1 &&
      newGridSize < this.settings.maxGridSize + 1
    ) {
      this.settings.gridSize = newGridSize;
    }
  }

  updateGameMode(direction) {
    let newGameMode = this.settings.gameMode + direction;
    if (newGameMode > -1 && newGameMode < Object.keys(GAMEMODES).length) {
      this.settings.gameMode = newGameMode;
    }
  }

  shutdown() {
    destroyHud();
  }
}
