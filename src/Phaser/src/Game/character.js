import { GOLD_0x } from '../Common/colours';

const DIRECTIONS = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};

const ANIM_SUFFIX = {
  [DIRECTIONS.UP]: '-move-u',
  [DIRECTIONS.DOWN]: '-move-d',
  [DIRECTIONS.LEFT]: '-move-l',
  [DIRECTIONS.RIGHT]: '-move-r',
};

const IDLE_FRAME = {
  [DIRECTIONS.UP]: 10,
  [DIRECTIONS.DOWN]: 23,
  [DIRECTIONS.LEFT]: 16,
  [DIRECTIONS.RIGHT]: 4,
};

const FRAME_OFFSET = {
  [DIRECTIONS.UP]: { x: 0, y: 0 },
  [DIRECTIONS.DOWN]: { x: 0, y: 0 },
  [DIRECTIONS.LEFT]: { x: 0, y: 0 },
  [DIRECTIONS.RIGHT]: { x: 0, y: 0 },
};

const DEFAULT_UPDATE_STEPS = 5;

export function setupCarAnimations(scene, animPrefix = 'car') {
  const anims = [
    { key: animPrefix + '-move-r', start: 4, end: 9 },
    { key: animPrefix + '-move-u', start: 10, end: 15 },
    { key: animPrefix + '-move-l', start: 16, end: 21 },
    { key: animPrefix + '-move-d', start: 23, end: 27 },
  ];
  anims.forEach(({ key, start, end }) => {
    if (!scene.anims.exists(key)) {
      scene.anims.create({
        key,
        frames: scene.anims.generateFrameNumbers(animPrefix, { start, end }),
        frameRate: 10,
        repeat: -1,
      });
    }
  });
}

export default class Character {
  constructor(maze, position, options = {}) {
    this.maze = maze;
    this.position = position;
    this.prevPos = position;
    this.colour = options.colour || GOLD_0x;
    this.smoothMovement = options.smoothMovement || false;
    this.UPDATE_STEPS = options.updateSteps || DEFAULT_UPDATE_STEPS;
    this.updating = false;
    this.updateStep = 0;
    this.scene = options.scene;
    this.imageKey = options.imageKey || 'car';
    this.animKey = options.animKey || this.imageKey;
    this.scaleFactor = options.scaleFactor || 0.85;
    this.currentDirection = DIRECTIONS.RIGHT;
    this.sprite = null;
  }

  static get DIRECTIONS() {
    return DIRECTIONS;
  }

  _cellCenter(pos) {
    return {
      x: pos.x * this.maze.sideLength + this.maze.sideLength / 2 + 1,
      y: pos.y * this.maze.sideLength + this.maze.sideLength / 2 + 1,
    };
  }

  drawCharacter() {
    if (!this.sprite && this.scene) {
      const c = this._applyOffset(this._cellCenter(this.position));
      this.scene.textures.get(this.imageKey).setFilter(1);
      this.sprite = this.scene.add.sprite(c.x, c.y, this.imageKey);
      this.sprite.setFrame(IDLE_FRAME[this.currentDirection]);
      const cellSize = this.maze.sideLength - 2;
      const scale = (cellSize / this.sprite.width) * this.scaleFactor;
      this.sprite.setScale(scale);
      this.sprite.setDepth(1000);
      if (this.colour !== GOLD_0x) {
        this.sprite.setTint(parseInt(this.colour, 16));
      }
    }
  }

  moveCharacter(direction) {
    if (this.updating) return;
    let prevPos = { ...this.position };
    let newPos = { ...this.position };
    if (direction === DIRECTIONS.UP) {
      newPos.y -= 1;
      if (newPos.y < 0) newPos.y = 0;
    } else if (direction === DIRECTIONS.DOWN) {
      newPos.y += 1;
      if (newPos.y > this.maze.size - 1) newPos.y = this.maze.size - 1;
    } else if (direction === DIRECTIONS.LEFT) {
      newPos.x -= 1;
      if (newPos.x < 0) newPos.x = 0;
    } else if (direction === DIRECTIONS.RIGHT) {
      newPos.x += 1;
      if (newPos.x > this.maze.size - 1) newPos.x = this.maze.size - 1;
    }
    if (
      this.maze.isEdge([`${prevPos.x},${prevPos.y}`, `${newPos.x},${newPos.y}`])
    ) {
      this.maze.fillGrid(this.prevPos, this.maze.colour);
      this.position = newPos;
      this.prevPos = prevPos;
      this.currentDirection = direction;
      if (this.smoothMovement) {
        this.updating = true;
        this._playDirectionAnim(direction);
      } else {
        this._updateSpritePosition();
      }
    }
  }

  _playDirectionAnim(direction) {
    if (this.sprite && this.scene) {
      const key = this.animKey + ANIM_SUFFIX[direction];
      if (this.scene.anims.exists(key)) {
        this.sprite.play(key);
      }
    }
  }

  update() {
    if (this.updating) {
      this._smoothMovement();
    }
  }

  isUpdating() {
    return this.updating;
  }

  _applyOffset(c) {
    const offset = FRAME_OFFSET[this.currentDirection];
    return { x: c.x + offset.x, y: c.y + offset.y };
  }

  _updateSpritePosition() {
    if (this.sprite) {
      const c = this._applyOffset(this._cellCenter(this.position));
      this.sprite.setPosition(c.x, c.y);
    }
  }

  _smoothMovement() {
    const diffX = this.position.x - this.prevPos.x;
    const diffY = this.position.y - this.prevPos.y;
    const t = this.updateStep / this.UPDATE_STEPS;

    const curX = this.prevPos.x + diffX * t;
    const curY = this.prevPos.y + diffY * t;

    if (this.sprite) {
      const c = this._applyOffset(this._cellCenter({ x: curX, y: curY }));
      this.sprite.setPosition(c.x, c.y);
    }

    this.updateStep++;
    if (this.updateStep % this.UPDATE_STEPS === 0) {
      this.updateStep = 0;
      this.updating = false;
      if (this.sprite) {
        this.sprite.anims.stop();
        this.sprite.setFrame(IDLE_FRAME[this.currentDirection]);
      }
    }
  }
}
