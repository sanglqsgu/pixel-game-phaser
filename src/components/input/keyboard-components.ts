import { InputComponent } from './input';

export class KeyboardComponent extends InputComponent {
  #cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  #speedKey: Phaser.Input.Keyboard.Key;

  constructor(keyboardPlugin: Phaser.Input.Keyboard.KeyboardPlugin) {
    super();
    this.#cursorKeys = keyboardPlugin.createCursorKeys();
    this.#speedKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }
  get isUpDown(): boolean {
    return this.#cursorKeys.up.isDown;
  }

  get isDownDown(): boolean {
    return this.#cursorKeys.down.isDown;
  }

  get isLeftDown(): boolean {
    return this.#cursorKeys.left.isDown;
  }

  get isRightDown(): boolean {
    return this.#cursorKeys.right.isDown;
  }

  get isSpeedDown(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.#speedKey);
  }
}
