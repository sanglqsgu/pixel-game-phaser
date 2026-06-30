import Phaser from 'phaser';
import { COLORS_0x, COLORS } from '../Common/tokens';
import GameMaze from '../Game/gameMaze';
import Character, { setupCarAnimations } from '../Game/character';
import { GESTURES, gestureDetection } from '../Game/gestures';
import { GAMEMODES } from '../Game/gameSettings';
import {
  loadRandomImages,
  placeRandomImages,
  buildObstacleMap,
  removeObstacleAt,
  getObstacleCount,
} from '../Game/randomImages';
import { createHud, updateHud, destroyHud } from '../Game/gameHud';

export default class GamemodeTwoPlayer extends Phaser.Scene {
  constructor() {
    super('GamemodeTwoPlayer');
  }

  init(data) {
    this.settings = data;
    this.handleGesture = this.handleGesture.bind(this);
    this.p1ActionClock = 0;
    this.p2ActionClock = 0;
    this.actionCooldown = 100;
  }

  preload() {
    loadRandomImages(this);
    const baseUrl = process.env.PUBLIC_URL || '';
    this.load.spritesheet('car', `${baseUrl}/assets/object/car/Car2.png`, {
      frameWidth: 80,
      frameHeight: 80,
    });
  }

  create() {
    setupCarAnimations(this);
    this.cameras.main.setBackgroundColor(COLORS_0x.BG_PRIMARY);
    this.keys = this.input.keyboard.addKeys({
      p1Up: 'up',
      p2Up: 'W',
      p1Down: 'down',
      p2Down: 'S',
      p1Left: 'left',
      p2Left: 'A',
      p1Right: 'right',
      p2Right: 'D',
      exit: 'Esc',
    });
    this.screenHalfway = this.game.config.width / 2;
    gestureDetection(this.input, this.handleGesture);

    this.graphics = this.add.graphics();
    this.maze = new GameMaze(this.game, this.graphics, this.settings.gridSize);

    let positions = this.generateRandomPositions();
    let p1InitialPosition = positions.p1;
    let p2InitialPosition = positions.p2;
    this.p1EndPoint = positions.p2;
    this.p2EndPoint = positions.p1;

    this.player1 = new Character(this.maze, p1InitialPosition, {
      smoothMovement: true,
      scene: this,
      imageKey: 'car',
    });
    this.player2 = new Character(this.maze, p2InitialPosition, {
      smoothMovement: true,
      scene: this,
      imageKey: 'car',
    });

    this.maze.drawMaze();
    this.player1.drawCharacter();
    this.player2.drawCharacter();

    this.obstacles = placeRandomImages(this, this.graphics, this.maze, {
      excludePositions: [p1InitialPosition, p2InitialPosition],
    });
    this.obstacleMap = buildObstacleMap(this.obstacles);

    this.totalObstacles = getObstacleCount(this.obstacleMap);
    this.remainingObstacles = this.totalObstacles;
    this.collectedItems = [];
    this.hud = createHud(this, this.totalObstacles);

    this.timer = new Date().getTime();
  }

  updateLogo() {
    this.remainingObstacles = getObstacleCount(this.obstacleMap);
    if (this.hud) {
      const remaining = this.remainingObstacles;
      updateHud(this.hud, {
        logo: `Logo: ${remaining}/${this.totalObstacles}`,
      });
    }
  }

  remindCollectAll() {
    if (this.hud) {
      const remaining = getObstacleCount(this.obstacleMap);
      updateHud(this.hud, {
        logo: `Logo: ${remaining}/${this.totalObstacles} - Collect all to finish!`,
      });
    }
  }

  generateRandomPositions() {
    let furthestPoint = this.settings.gridSize - 1;
    let positions = [
      { p1: { x: 0, y: 0 }, p2: { x: furthestPoint, y: furthestPoint } },
      { p1: { x: furthestPoint, y: 0 }, p2: { x: 0, y: furthestPoint } },
      { p1: { x: 0, y: furthestPoint }, p2: { x: furthestPoint, y: 0 } },
      { p1: { x: furthestPoint, y: furthestPoint }, p2: { x: 0, y: 0 } },
    ];
    return positions[Math.floor(Math.random() * 4)];
  }

  handleGesture(detection) {
    if (detection.gesture === GESTURES.SWIPE_LEFT) {
      if (detection.origin.y > this.screenHalfway) {
        this.p1UpdateMovement(Character.DIRECTIONS.LEFT);
      } else {
        this.p2UpdateMovement(Character.DIRECTIONS.LEFT);
      }
    } else if (detection.gesture === GESTURES.SWIPE_RIGHT) {
      if (detection.origin.y > this.screenHalfway) {
        this.p1UpdateMovement(Character.DIRECTIONS.RIGHT);
      } else {
        this.p2UpdateMovement(Character.DIRECTIONS.RIGHT);
      }
    } else if (detection.gesture === GESTURES.SWIPE_UP) {
      if (detection.origin.y > this.screenHalfway) {
        this.p1UpdateMovement(Character.DIRECTIONS.UP);
      } else {
        this.p2UpdateMovement(Character.DIRECTIONS.UP);
      }
    } else if (detection.gesture === GESTURES.SWIPE_DOWN) {
      if (detection.origin.y > this.screenHalfway) {
        this.p1UpdateMovement(Character.DIRECTIONS.DOWN);
      } else {
        this.p2UpdateMovement(Character.DIRECTIONS.DOWN);
      }
    }
  }

  p1UpdateMovement(direction) {
    this.player1.moveCharacter(direction);
    const removedKey = removeObstacleAt(this.player1.position, this.obstacleMap);
    if (removedKey) {
      this.collectedItems.push(removedKey);
      this.maze.fillGrid(this.player1.position, this.maze.colour);
      this.updateLogo();
    }
    if (
      this.player1.position.x === this.p1EndPoint.x &&
      this.player1.position.y === this.p1EndPoint.y
    ) {
      if (getObstacleCount(this.obstacleMap) > 0) {
        this.remindCollectAll();
        return;
      }
      this.scene.start('EndScreen', {
        settings: this.settings,
        results: {
          gameMode: GAMEMODES.TWO_PLAYER.id,
          message: 'Player 1 wins!',
          messageColour: COLORS.PLAYER_1,
          collectedItems: this.collectedItems,
        },
      });
    }
  }

  p2UpdateMovement(direction) {
    this.player2.moveCharacter(direction);
    const removedKey = removeObstacleAt(this.player2.position, this.obstacleMap);
    if (removedKey) {
      this.collectedItems.push(removedKey);
      this.maze.fillGrid(this.player2.position, this.maze.colour);
      this.updateLogo();
    }
    if (
      this.player2.position.x === this.p2EndPoint.x &&
      this.player2.position.y === this.p2EndPoint.y
    ) {
      if (getObstacleCount(this.obstacleMap) > 0) {
        this.remindCollectAll();
        return;
      }
      this.scene.start('EndScreen', {
        settings: this.settings,
        results: {
          gameMode: GAMEMODES.TWO_PLAYER.id,
          message: 'Player 2 wins!',
          messageColour: COLORS.PLAYER_2,
          collectedItems: this.collectedItems,
        },
      });
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.exit)) {
      this.scene.start('MainMenu', this.settings);
    }

    let dateNow = new Date().getTime();

    if (dateNow - this.p1ActionClock > this.actionCooldown) {
      if (this.keys.p1Up.isDown) {
        this.p1UpdateMovement(Character.DIRECTIONS.UP);
        this.p1ActionClock = new Date().getTime();
      } else if (this.keys.p1Down.isDown) {
        this.p1UpdateMovement(Character.DIRECTIONS.DOWN);
        this.p1ActionClock = new Date().getTime();
      } else if (this.keys.p1Left.isDown) {
        this.p1UpdateMovement(Character.DIRECTIONS.LEFT);
        this.p1ActionClock = new Date().getTime();
      } else if (this.keys.p1Right.isDown) {
        this.p1UpdateMovement(Character.DIRECTIONS.RIGHT);
        this.p1ActionClock = new Date().getTime();
      }
    }

    if (dateNow - this.p2ActionClock > this.actionCooldown) {
      if (this.keys.p2Up.isDown) {
        this.p2UpdateMovement(Character.DIRECTIONS.UP);
        this.p2ActionClock = new Date().getTime();
      } else if (this.keys.p2Down.isDown) {
        this.p2UpdateMovement(Character.DIRECTIONS.DOWN);
        this.p2ActionClock = new Date().getTime();
      } else if (this.keys.p2Left.isDown) {
        this.p2UpdateMovement(Character.DIRECTIONS.LEFT);
        this.p2ActionClock = new Date().getTime();
      } else if (this.keys.p2Right.isDown) {
        this.p2UpdateMovement(Character.DIRECTIONS.RIGHT);
        this.p2ActionClock = new Date().getTime();
      }
    }

    this.player1.update();
    this.player2.update();
    if (!this.player1.isUpdating()) {
      this.maze.fillGrid(this.p2EndPoint, COLORS_0x.PLAYER_2);
      this.player1.drawCharacter();
    }
    if (!this.player2.isUpdating()) {
      this.maze.fillGrid(this.p1EndPoint, COLORS_0x.PLAYER_1);
      this.player2.drawCharacter();
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
