import Phaser from 'phaser';
import { emit, on } from '../Game/gameEvents';
import { COLORS } from '../Common/tokens';

export default class History extends Phaser.Scene {
  constructor() {
    super('History');
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.BG_PRIMARY);

    this._unsubs = [
      on('hide-history', () => this.scene.start('MainMenu')),
    ];

    emit('show-history');
  }

  shutdown() {
    (this._unsubs || []).forEach((fn) => fn());
  }
}
