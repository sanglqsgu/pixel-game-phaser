import Phaser from 'phaser';
import { getDimensions } from '../Game/gameSettings';
import { COLORS, FONT } from '../Common/tokens';
import { GESTURES, gestureDetection } from '../Game/gestures';
import { destroyHud } from '../Game/gameHud';

export default class EndScreen extends Phaser.Scene {
  constructor() {
    super('EndScreen');
  }

  init(data) {
    this.settings = data.settings;
    this.results = data.results;
    this.handleGesture = this.handleGesture.bind(this);
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.BG_SECONDARY);
    this.keys = this.input.keyboard.addKeys({
      back: 'Esc',
    });
    gestureDetection(this.input, this.handleGesture);

    this.gameDimensions = getDimensions(this.game);

    this.drawScreen();
  }

  drawScreen() {
    const centerX = this.gameDimensions.screenCenter;
    const unit = this.gameDimensions.screenSpaceUnit;

    this.add
      .text(centerX, unit * 1.5, 'Hoàn thành!', {
        fontFamily: FONT.UI_TEXT,
        fill: COLORS.BG_PRIMARY,
        fontSize: this.gameDimensions.textSize1,
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(centerX, unit * 3, `Tổng thời gian: ${this.results.totalTime}s`, {
        fontFamily: FONT.UI_TEXT,
        fill: COLORS.BG_PRIMARY,
        fontSize: this.gameDimensions.textSize2,
      })
      .setOrigin(0.5, 0.5);

    const perLevel = this.results.perLevel || [];
    const startY = unit * 5.5;
    const rowH = unit * 2;

    this.add
      .text(centerX, startY - unit * 1, 'Màn   Lưới   Thời gian   Vật phẩm', {
        fontFamily: FONT.UI_TEXT,
        fill: COLORS.TEXT_DIM,
        fontSize: this.gameDimensions.textSize4,
      })
      .setOrigin(0.5, 0.5);

    perLevel.forEach((lvl, i) => {
      const y = startY + i * rowH;
      this.add
        .text(
          centerX,
          y,
          `${lvl.level}       ${lvl.gridSize}×${lvl.gridSize}          ${lvl.time}s               ${lvl.items.length}/5`,
          {
            fontFamily: FONT.UI_TEXT,
            fill: COLORS.BG_PRIMARY,
            fontSize: this.gameDimensions.textSize4,
          }
        )
        .setOrigin(0.5, 0.5);
    });

    const btnY = unit * 17;
    const btnW = unit * 5;
    const btnH = unit * 1.8;

    const menuBg = this.add
      .rectangle(centerX, btnY, btnW, btnH, COLORS.BG_PRIMARY)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(centerX, btnY, 'Về menu', {
        fontFamily: FONT.UI_TEXT,
        fill: COLORS.BG_SECONDARY,
        fontSize: this.gameDimensions.textSize4,
      })
      .setOrigin(0.5, 0.5);
    menuBg.on('pointerdown', () => this._endGame());
  }

  _endGame() {
    this.scene.start('MainMenu', this.settings);
  }

  handleGesture(detection) {
    if (detection.gesture === GESTURES.SINGLE_TAP) {
      this._endGame();
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.back)) {
      this._endGame();
    }
  }

  shutdown() {
    destroyHud();
  }
}
