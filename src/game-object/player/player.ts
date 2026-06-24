import { Position } from '../../common/types';
import { CAR_ANIMATION_KEYS, PLAYER_ANIMATION_KEYS } from '../../common/assets';
import { InputComponent } from '../../components/input/input';
import { ControlsComponent } from '../../components/game-object/control-componet';
import { isArcadePhysicBody } from '../../common/utils';

export type PlayerConfig = {
  scene: Phaser.Scene;
  position: Position;
  assetKey: string;
  frame?: number;
  controls: InputComponent;
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  #controlsComponent: ControlsComponent;

  constructor(config: PlayerConfig) {
    const { scene, position, assetKey, frame } = config;
    const { x, y } = position;
    super(scene, x, y, assetKey, frame || 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.#controlsComponent = new ControlsComponent(this, config.controls);

    this.play({ key: CAR_ANIMATION_KEYS.MOVE_L, repeat: -1 });

    config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });
  }

  update(): void {
    const controls = this.#controlsComponent.controls;
    if (controls.isUpDown) {
      this.play({ key: CAR_ANIMATION_KEYS.MOVE_U, repeat: -1 }, true);
      this.#updateVelocity(false, -1);
    } else if (controls.isDownDown) {
      this.play({ key: CAR_ANIMATION_KEYS.MOVE_D, repeat: -1 }, true);
      this.#updateVelocity(false, 1);
    }
    else {
        this.#updateVelocity(false, 0);
    }

    if (controls.isLeftDown) {
      this.play({ key: CAR_ANIMATION_KEYS.MOVE_L, repeat: -1 }, true);
      this.#updateVelocity(true, -1);
    } else if (controls.isRightDown) {
      this.play({ key: CAR_ANIMATION_KEYS.MOVE_R, repeat: -1 }, true);
      this.#updateVelocity(true, 1);
    }
    else {
        this.#updateVelocity(true, 0);
    }
  }
  #updateVelocity(isX: boolean, velocity: number): void {
    if (!isArcadePhysicBody(this.body)) {
      return;
    }
    if (isX) {
      this.body.velocity.x = velocity*80;
      return;
    }
    this.body.velocity.y = velocity*80;
  }
}
