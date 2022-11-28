import { Scene, GameObjects, Display, Sound } from "phaser";
import { moveMessagePortToContext } from "worker_threads";

class GameScene extends Scene {
  private baddy!: GameObjects.Sprite;
  private staticTile!: GameObjects.Sprite;
  private ost!: Sound.BaseSound;
  private player!: any;
  private cursors!: any;

  constructor() {
    super('scene-game');
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.baddy = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'baddy');
    this.player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'player');
    this.baddy.play('baddy-run');

    // Baddy data
    this.staticTile = this.add.sprite(this.baddy.x + 5, this.baddy.y, 'static');
    this.staticTile.play('static-flicker');
    this.staticTile.setScale(1.5, 1.25);

    this.staticTile.mask = new Display.Masks.BitmapMask(this, this.baddy);
    this.staticTile.setAlpha(0.55);

    // Audio
    this.ost = this.sound.add('ost-loop', {
      loop: true,
      volume: 0.7
    });
    this.ost.play();
    
    // Player stuff
    this.player.body.setCollideWorldBounds(true);

    // Camera controls
    this.cameras.main.setZoom(2);
  }

  update(time: number, delta: number) {

    // Player movement
    if (this.cursors.left.down) {
      this.player.body.setVelocityX(-100);
    }
    else if (this.cursors.right.down) {
      this.player.body.setVelocityX(100);
    }
    else if (this.cursors.up.down) {
      this.player.body.setVelocityY(-100);
    }
    else {
      this.player.body.setVelocityX(0);
    }
  }
}

export default GameScene;