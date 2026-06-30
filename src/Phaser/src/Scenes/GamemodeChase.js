import Phaser from 'phaser';
import { getDimensions } from '../Game/gameSettings';
import { COLORS, FONT } from '../Common/tokens';
import { GESTURES, gestureDetection } from '../Game/gestures';
import { createNavigationKeys, isKeyJustDown } from '../Game/sceneInput';

export default class GamemodeChase extends Phaser.Scene {
  constructor() {
    super('GamemodeChase');
  }

  init(data) {
    this.settings = data.settings;
    this.handleGesture = this.handleGesture.bind(this);
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.BG_SECONDARY);
    createNavigationKeys(this);
    gestureDetection(this.input, this.handleGesture);

    this.gameDimensions = getDimensions(this.game);

    this.add
      .text(
        this.gameDimensions.screenCenter,
        this.gameDimensions.screenSpaceUnit * 4,
        'Chase (WIP)',
        {
          fontFamily: FONT.UI_TEXT,
          fill: COLORS.BG_PRIMARY,
          fontSize: this.gameDimensions.textSize1,
        }
      )
      .setOrigin(0.5, 0.5);
  }

  handleGesture(detection) {
    if (detection.gesture === GESTURES.SINGLE_TAP) {
      this.scene.start('MainMenu', this.settings);
    }
  }

  update() {
    if (isKeyJustDown(this, 'select')) {
      this.scene.start('MainMenu', this.settings);
    }
  }
}
