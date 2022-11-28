import { Scene, GameObjects } from "phaser";

class GameScene extends Scene {
  private textbox: GameObjects.Text | undefined;

  constructor() {
    super('scene-game');
  }

  create() {
    this.textbox = this.add.text(
      window.innerWidth / 2,
      window.innerHeight / 2,
      'Welcome to Phaser x Vite!',
      {
        color: '#FFF',
        fontFamily: 'monospace',
        fontSize: '26px'
      }
    );

    this.textbox.setOrigin(0.5, 0.5);

    this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'baddy').setScale(2).play('baddy-run');

    this.add.sprite(window.innerWidth / 2 - 100, window.innerHeight / 2, 'static').setScale(2).play('static-flicker');
  }

  update(time: number, delta: number) {
    if (!this.textbox) {
      return;
    }

    this.textbox.rotation += 0.0005 * delta;
  }
}

export default GameScene;