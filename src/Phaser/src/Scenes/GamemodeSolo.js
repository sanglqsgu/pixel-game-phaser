import Phaser from 'phaser';
import { BLACK_0x, GRAY_0x, BLACK } from '../Common/colours';
import GameMaze from '../Game/gameMaze';
import Character from '../Game/character';
import { GESTURES, gestureDetection } from '../Game/gestures';
import { GAMEMODES } from '../Game/gameSettings';
import {
  loadRandomImages,
  placeRandomImages,
  buildObstacleMap,
  removeObstacleAt,
  getObstacleCount
} from '../Game/randomImages';
import { createHud, updateHud, destroyHud } from '../Game/gameHud';

export default class GamemodeSolo extends Phaser.Scene {
  constructor() {
    super('GamemodeSolo');
  }

  init(data) {
    this.settings = data;
    this.handleGesture = this.handleGesture.bind(this);
    this.actionClock = 0;
    this.actionCooldown = 100;
  }

  preload() {
    loadRandomImages(this);
  }

  create() {
    this.cameras.main.setBackgroundColor(BLACK_0x);
    this.keys = this.input.keyboard.addKeys({
      up: 'W',
      arrowUp: 'up',
      down: 'S',
      arrowDown: 'down',
      left: 'A',
      arrowLeft: 'left',
      right: 'D',
      arrowRight: 'right',
      exit: 'Esc'
    });
    gestureDetection(this.input, this.handleGesture);

    this.graphics = this.add.graphics();

    this.maze = new GameMaze(this.game, this.graphics, this.settings.gridSize);

    let initialPosition = { x: 0, y: 0 };
    this.character = new Character(this.maze, initialPosition, {
      smoothMovement: true
    });

    this.endPoint = {
      x: this.settings.gridSize - 1,
      y: this.settings.gridSize - 1
    };

    this.maze.drawMaze();
    this.maze.fillGrid(this.endPoint, GRAY_0x);
    this.character.drawCharacter();

    this.obstacles = placeRandomImages(this, this.graphics, this.maze, {
      excludePositions: [initialPosition, this.endPoint]
    });
    this.obstacleMap = buildObstacleMap(this.obstacles);

    this.totalObstacles = getObstacleCount(this.obstacleMap);
    this.remainingObstacles = this.totalObstacles;
    this.hud = createHud(this, this.totalObstacles);

    this.timer = new Date().getTime();
  }

  updateLogo() {
    this.remainingObstacles = getObstacleCount(this.obstacleMap);
    if (this.hud) {
      updateHud(this.hud, {
        logo: `Logo: ${this.remainingObstacles}/${this.totalObstacles}`
      });
    }
  }

  handleGesture(detection) {
    if (detection.gesture === GESTURES.SWIPE_LEFT) {
      this.updateMovement(Character.DIRECTIONS.LEFT);
    } else if (detection.gesture === GESTURES.SWIPE_RIGHT) {
      this.updateMovement(Character.DIRECTIONS.RIGHT);
    } else if (detection.gesture === GESTURES.SWIPE_UP) {
      this.updateMovement(Character.DIRECTIONS.UP);
    } else if (detection.gesture === GESTURES.SWIPE_DOWN) {
      this.updateMovement(Character.DIRECTIONS.DOWN);
    }
  }

  updateMovement(direction) {
    this.character.moveCharacter(direction);
    if (removeObstacleAt(this.character.position, this.obstacleMap)) {
      this.maze.fillGrid(this.character.position, this.maze.colour);
      this.updateLogo();
    }
    if (
      this.character.position.x === this.endPoint.x &&
      this.character.position.y === this.endPoint.y
    ) {
      if (getObstacleCount(this.obstacleMap) > 0) {
        if (this.hud) {
          const remaining = getObstacleCount(this.obstacleMap);
          updateHud(this.hud, {
            logo: `Logo: ${remaining}/${this.totalObstacles} - Collect all to finish!`
          });
        }
        return;
      }
      let finishTime = Math.floor((new Date().getTime() - this.timer) / 1000);
      this.scene.start('EndScreen', {
        settings: this.settings,
        results: {
          gameMode: GAMEMODES.SOLO.id,
          message: `Time: ${finishTime} s`,
          messageColour: BLACK
        }
      });
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.exit)) {
      this.scene.start('MainMenu', this.settings);
    }

    if (new Date().getTime() - this.actionClock > this.actionCooldown) {
      if (this.keys.up.isDown || this.keys.arrowUp.isDown) {
        this.updateMovement(Character.DIRECTIONS.UP);
        this.actionClock = new Date().getTime();
      } else if (this.keys.down.isDown || this.keys.arrowDown.isDown) {
        this.updateMovement(Character.DIRECTIONS.DOWN);
        this.actionClock = new Date().getTime();
      } else if (this.keys.left.isDown || this.keys.arrowLeft.isDown) {
        this.updateMovement(Character.DIRECTIONS.LEFT);
        this.actionClock = new Date().getTime();
      } else if (this.keys.right.isDown || this.keys.arrowRight.isDown) {
        this.updateMovement(Character.DIRECTIONS.RIGHT);
        this.actionClock = new Date().getTime();
      }
    }

    this.character.update();

    if (
      this.character.position.x !== this.endPoint.x ||
      this.character.position.y !== this.endPoint.y
    ) {
      this.maze.fillGrid(this.endPoint, GRAY_0x);
    }

    if (this.hud) {
      const elapsed = Math.floor((new Date().getTime() - this.timer) / 1000);
      updateHud(this.hud, { timer: `Time: ${elapsed}s` });
    }
  }

  shutdown() {
    destroyHud();
  }
}
