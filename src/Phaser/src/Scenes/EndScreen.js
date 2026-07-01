import Phaser from 'phaser';
import { getDimensions } from '../Game/gameSettings';
import { COLORS, FONT } from '../Common/tokens';
import { GESTURES, gestureDetection } from '../Game/gestures';
import { destroyHud } from '../Game/gameHud';
import { saveGameSettings } from '../Game/gameProgress';

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
    this.cameras.main.setBackgroundColor(COLORS.BG_PRIMARY);
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
    const screenLength = this.gameDimensions.screenLength;

    const bg = this.add.graphics();
    bg.fillStyle(0x18203a, 1);
    bg.fillRect(0, 0, screenLength, screenLength);
    bg.fillStyle(0x19d39b, 0.08);
    bg.fillRect(0, 0, screenLength, screenLength * 0.38);
    bg.lineStyle(2, 0x5cc8ff, 0.7);
    bg.strokeRect(9, 9, screenLength - 18, screenLength - 18);
    bg.lineStyle(1, 0xffb238, 0.45);
    bg.strokeRect(16, 16, screenLength - 32, screenLength - 32);

    this.add
      .text(centerX, unit * 2.05, 'Hoàn thành!', {
        fontFamily: FONT.GAME_TITLE,
        fill: COLORS.TEXT_PRIMARY,
        fontSize: '22px',
        stroke: '#070a13',
        strokeThickness: 6,
      })
      .setOrigin(0.5, 0.5);

    const totalTime = this.results.totalTime || 0;
    this.add
      .text(centerX, unit * 3.85, `Tổng thời gian: ${totalTime}s`, {
        fontFamily: FONT.UI_TEXT,
        fill: COLORS.TEXT_HIGHLIGHT,
        fontSize: this.gameDimensions.textSize2,
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 0.5);

    const panel = this.add.graphics();
    panel.fillStyle(0x101426, 0.82);
    panel.fillRoundedRect(unit * 1.2, unit * 5.2, screenLength - unit * 2.4, unit * 9.4, 12);
    panel.lineStyle(2, 0x5cc8ff, 0.35);
    panel.strokeRoundedRect(unit * 1.2, unit * 5.2, screenLength - unit * 2.4, unit * 9.4, 12);

    const perLevel = this.results.perLevel || [];
    const startY = unit * 6.25;
    const rowH = unit * 1.55;

    this.add
      .text(centerX, startY - unit * 0.7, 'Màn     Lưới      Time      Items', {
        fontFamily: FONT.UI_TEXT,
        fill: COLORS.TEXT_DIM,
        fontSize: this.gameDimensions.textSize4,
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 0.5);

    perLevel.forEach((lvl, i) => {
      const y = startY + i * rowH;
      const row = this.add.graphics();
      row.fillStyle(i % 2 === 0 ? 0xffffff : 0x5cc8ff, i % 2 === 0 ? 0.04 : 0.06);
      row.fillRect(unit * 1.7, y - unit * 0.55, screenLength - unit * 3.4, unit * 1.1);
      this.add
        .text(
          centerX,
          y,
          `${lvl.level}        ${lvl.gridSize}x${lvl.gridSize}        ${lvl.time}s        ${lvl.items.length}/5`,
          {
            fontFamily: FONT.UI_TEXT,
            fill: COLORS.TEXT_PRIMARY,
            fontSize: this.gameDimensions.textSize4,
          }
        )
        .setOrigin(0.5, 0.5);
    });

    const btnY = unit * 17;
    const btnW = unit * 6.5;
    const btnH = unit * 1.9;

    const menuBg = this.add
      .rectangle(centerX, btnY, btnW, btnH, 0xffb238)
      .setInteractive({ useHandCursor: true });
    menuBg.setStrokeStyle(2, 0xffffff, 0.75);
    this.add
      .text(centerX, btnY, 'Về menu', {
        fontFamily: FONT.UI_TEXT,
        fill: COLORS.BG_PRIMARY,
        fontSize: this.gameDimensions.textSize4,
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 0.5);
    menuBg.on('pointerdown', () => this._endGame());

    this.add
      .text(centerX, unit * 18.65, 'Esc hoặc chạm để quay lại', {
        fontFamily: FONT.UI_TEXT,
        fill: COLORS.TEXT_DIM,
        fontSize: this.gameDimensions.textSize4,
      })
      .setOrigin(0.5, 0.5);
  }

  _endGame() {
    saveGameSettings(this.settings);
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
