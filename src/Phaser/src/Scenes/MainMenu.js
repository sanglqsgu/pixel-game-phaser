import Phaser from 'phaser';
import {
  initSettings,
  getDimensions,
  getGamemodeInfo
} from '../Game/gameSettings';
import { BLACK, BLUE, GOLD } from '../Common/colours';
import { GESTURES, gestureDetection } from '../Game/gestures';
import {
  loadTiledBackground,
  createTiledBackground
} from '../Game/tiledBackground';

// Pixel font loaded from Google Fonts in public/index.html. We add a
// solid stroke and a soft shadow so the text pops against the map
// background, and we keep the body color so text reads on any backdrop.
const PIXEL_FONT = '"Press Start 2P", monospace';
const pixelTextStyle = {
  fontFamily: PIXEL_FONT,
  fontSize: '32px',
  color: GOLD,
  stroke: BLACK,
  strokeThickness: 6,
  shadow: {
    offsetX: 3,
    offsetY: 3,
    color: BLACK,
    blur: 0,
    fill: true
  }
};

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  init(data) {
    this.settings = { ...initSettings(), ...data };
    this.handleGesture = this.handleGesture.bind(this);
  }

  preload() {
    // Assets placed under `public/` are served at the root URL of the dev
    // server by Create React App. No setBaseURL override is needed for the
    // tiled background, so we just queue it directly.
    loadTiledBackground(this);
  }

  create() {
    this.cameras.main.setBackgroundColor(BLACK);
    this.keys = this.input.keyboard.addKeys({
      up: 'W',
      arrowUp: 'up',
      down: 'S',
      arrowDown: 'down',
      select: 'Enter'
    });
    gestureDetection(this.input, this.handleGesture);

    this.gameDimensions = getDimensions(this.game);

    this.choice = 0;

    this.doubleTapTimer = 0;
    this.doubleTapCooldown = 200; // 200 milliseconds between each tap

    // Tiled background layers (loaded once in BootScene)
    createTiledBackground(this);

    // Title - split into two lines so "Cùng JETBOT" sits on its own
    // row, and tint the second line GOLD so it pops against the first.
    let titleLine1 = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 3,
      'Vượt mê cung',
      {
        ...pixelTextStyle,
        fontSize: '30px',
        color: BLUE
      }
    );
    titleLine1.setOrigin(0.5, 0.5);

    let titleLine2 = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 5,
      'cùng JETBOT',
      {
        ...pixelTextStyle,
        fontSize: '24px',
        color: BLUE
      }
    );
    titleLine2.setOrigin(0.5, 0.5);

    // Menu options - slightly smaller than the title, gold by default
    const optionStyle = {
      ...pixelTextStyle,
      fontSize: '20px',
      color: GOLD
    };

    let startGame = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 9,
      'Start Game',
      optionStyle
    );
    startGame.setOrigin(0.5, 0.5);

    let settings = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 12,
      'Settings',
      optionStyle
    );
    settings.setOrigin(0.5, 0.5);

    this.options = [
      {
        text: startGame,
        scene: getGamemodeInfo(this.settings.gameMode).scene,
        defaultColor: '#c97a00'
      },
      { text: settings, scene: 'Settings', defaultColor: '#c97a00' }
      // { text: exit, scene: 'Null' }
    ];

    // Make sure only the currently selected option glows gold; the rest
    // use the dimmer default color so the highlight is obvious.
    this.options.forEach((opt, idx) => {
      opt.text.setColor(idx === this.choice ? GOLD : opt.defaultColor);
    });
  }

  handleGesture(detection) {
    if (detection.gesture === GESTURES.SWIPE_UP) {
      this.updateChoice(-1);
    } else if (detection.gesture === GESTURES.SWIPE_DOWN) {
      this.updateChoice(1);
    } else if (detection.gesture === GESTURES.SINGLE_TAP) {
      if (new Date().getTime() - this.doubleTapTimer < this.doubleTapCooldown) {
        this.scene.start(this.options[this.choice].scene, this.settings);
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
      this.scene.start(this.options[this.choice].scene, this.settings);
    }
  }

  updateChoice(direction) {
    let newChoice = this.choice + direction;
    if (newChoice > -1 && newChoice < this.options.length) {
      this.options[this.choice].text.setColor(
        this.options[this.choice].defaultColor
      );
      this.options[newChoice].text.setColor(GOLD);
      this.choice = newChoice;
    }
  }
}
