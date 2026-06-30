import React from 'react';
import Phaser from 'phaser';
import MainMenu from './Scenes/MainMenu';
import Settings from './Scenes/Settings';
import GamemodeSolo from './Scenes/GamemodeSolo';
import GamemodeTwoPlayer from './Scenes/GamemodeTwoPlayer';
import GamemodeRace from './Scenes/GamemodeRace';
import GamemodeChase from './Scenes/GamemodeChase';
import GamemodeEscape from './Scenes/GamemodeEscape';
import EndScreen from './Scenes/EndScreen';
import History from './Scenes/History';
import LoadingOverlay from '../../LoadingOverlay';

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, error: null, canvasSize: 0 };
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    try {
      const dimension = this._getDimensions();
      const canvasSize = dimension * 0.8;
      this.setState({ canvasSize });

      const config = {
        type: Phaser.AUTO,
        parent: 'phaser-parent',
        pixelArt: true,
        width: canvasSize,
        height: canvasSize,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 200 },
          },
        },
        input: {
          activePointers: 5,
        },
        scene: [
          MainMenu,
          Settings,
          GamemodeSolo,
          GamemodeTwoPlayer,
          GamemodeRace,
          GamemodeChase,
          GamemodeEscape,
          EndScreen,
          History,
        ],
        audio: {
          noAudio: true,
        },
      };

      this.game = new Phaser.Game(config);

      this.game.events.on('ready', () => {
        this.setState({ loading: false });
      });

      setTimeout(() => {
        if (this.state.loading) {
          this.setState({ loading: false });
        }
      }, 5000);
    } catch (err) {
      this.setState({ loading: false, error: err });
    }
  }

  componentWillUnmount() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }

  _getDimensions() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    if (width < height) {
      return width;
    } else {
      return height;
    }
  }

  render() {
    const { canvasSize } = this.state;
    const wrapperWidth = canvasSize ? `${canvasSize}px` : 'auto';

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div style={{ width: wrapperWidth }}>
          <div
            id="game-hud-container"
            style={{
              display: 'none',
            }}
          />
          <div
            id="phaser-parent"
            ref={this.containerRef}
            role="application"
            aria-label="Trò chơi Vượt mê cung cùng JETBOT - Điều khiển bằng phím mũi tên hoặc WASD"
            style={{ position: 'relative' }}
          >
            <LoadingOverlay visible={this.state.loading} />
          </div>
        </div>
      </div>
    );
  }
}
