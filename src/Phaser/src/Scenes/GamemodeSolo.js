import Phaser from 'phaser';
import { COLORS_0x, COLORS } from '../Common/tokens';
import GameMaze from '../Game/gameMaze';
import Character, { setupCarAnimations } from '../Game/character';
import { GESTURES, gestureDetection } from '../Game/gestures';
import { GAMEMODES } from '../Game/gameSettings';
import { saveGameResult } from '../Game/gameHistory';
import {
  loadRandomImages,
  placeRandomImages,
  buildObstacleMap,
  removeObstacleAt,
  getObstacleCount,
} from '../Game/randomImages';
import { createHud, updateHud, destroyHud } from '../Game/gameHud';
import { loadMazeMarkers, drawMazeMarker } from '../Game/mazeMarkers';
import { saveGameSettings } from '../Game/gameProgress';

export default class GamemodeSolo extends Phaser.Scene {
  constructor() {
    super('GamemodeSolo');
  }

  init(data) {
    this.settings = data;
    if (!this.settings.results) {
      this.settings.results = { perLevel: [] };
    }
    this.handleGesture = this.handleGesture.bind(this);
    this.actionClock = 0;
    this.actionCooldown = 100;
  }

  preload() {
    loadRandomImages(this);
    loadMazeMarkers(this);
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
      up: 'W',
      arrowUp: 'up',
      down: 'S',
      arrowDown: 'down',
      left: 'A',
      arrowLeft: 'left',
      right: 'D',
      arrowRight: 'right',
      exit: 'Esc',
    });
    gestureDetection(this.input, this.handleGesture);
    saveGameSettings(this.settings);

    this.graphics = this.add.graphics();
    this.maze = new GameMaze(this.game, this.graphics, this.settings.gridSize);

    let initialPosition = { x: 0, y: 0 };
    this.character = new Character(this.maze, initialPosition, {
      smoothMovement: true,
      scene: this,
      imageKey: 'car',
    });

    this.endPoint = {
      x: this.settings.gridSize - 1,
      y: this.settings.gridSize - 1,
    };

    this.maze.drawMaze();
    this.maze.fillGrid(initialPosition, 0x19d39b);
    this.maze.fillGrid(this.endPoint, COLORS_0x.MAZE_END);
    drawMazeMarker(this, this.maze, initialPosition, {
      kind: 'start',
      label: 'START',
      accent: 0x19d39b,
      iconAlpha: 0.78,
    });
    drawMazeMarker(this, this.maze, this.endPoint, {
      kind: 'finish',
      label: 'FINISH',
      accent: 0xffb238,
    });
    this.character.drawCharacter();

    this.obstacles = placeRandomImages(this, this.graphics, this.maze, {
      excludePositions: [initialPosition, this.endPoint],
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
      updateHud(this.hud, {
        logo: `Logo: ${this.remainingObstacles}/${this.totalObstacles}`,
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
    const removedKey = removeObstacleAt(this.character.position, this.obstacleMap);
    if (removedKey) {
      this.collectedItems.push(removedKey);
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
            logo: `Logo: ${remaining}/${this.totalObstacles} - Collect all to finish!`,
          });
        }
        return;
      }
      let finishTime = Math.floor((new Date().getTime() - this.timer) / 1000);
      const levelResult = {
        level: this.settings.level,
        gridSize: this.settings.gridSize,
        time: finishTime,
        items: [...this.collectedItems],
      };
      this.settings.results.perLevel.push(levelResult);

      const totalTime = this.settings.results.perLevel.reduce(
        (sum, l) => sum + l.time,
        0
      );
      saveGameResult({
        level: this.settings.level,
        totalTime: totalTime,
        levelResults: this.settings.results.perLevel,
      });

      if (this.settings.level >= this.settings.totalLevels) {
        saveGameSettings(this.settings);
        this.scene.start('EndScreen', {
          settings: this.settings,
          results: {
            gameMode: GAMEMODES.SOLO.id,
            message: `Level ${this.settings.level} - ${finishTime}s`,
            messageColour: COLORS.BG_PRIMARY,
            collectedItems: this.collectedItems,
            totalTime,
            perLevel: this.settings.results.perLevel,
          },
        });
      } else {
        const newSettings = { ...this.settings };
        newSettings.gridSize += 3;
        newSettings.level += 1;
        saveGameSettings(newSettings);
        this.scene.start('GamemodeSolo', newSettings);
      }
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.exit)) {
      saveGameSettings(this.settings);
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
      this.maze.fillGrid(this.endPoint, COLORS_0x.MAZE_END);
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
