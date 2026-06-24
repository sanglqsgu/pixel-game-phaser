import * as Phaser from 'phaser';
import { SCENE_KEYS } from './scene-keys';
import { ASSET_KEYS } from '../common/assets';
import { Player } from '../game-object/player/player';

export class GameScene extends Phaser.Scene {

  #player!: Player;

  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    });
  }

  public create(): void {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Game Scene 22', { fontFamily: ASSET_KEYS.FONT_PRESS_START_2P })
      .setOrigin(0.5);

    this.#player = new Player({
      scene: this,
      position: { x: this.scale.width / 2, y: this.scale.height / 2},
      assetKey: ASSET_KEYS.CAR,
      frame: 5, // Quyết định dáng đứng của nhân vật
    });
  }
}
