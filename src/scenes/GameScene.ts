import { Scene, GameObjects, Display } from "phaser";

class GameScene extends Scene {
  private baddy!: GameObjects.Sprite;
  private staticTile!: GameObjects.Sprite;

  constructor() {
    super('scene-game');
  }

  create() {
    this.baddy = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'baddy');
    this.baddy.play('baddy-run');

    this.staticTile = this.add.sprite(this.baddy.x + 5, this.baddy.y, 'static');
    this.staticTile.play('static-flicker');
    this.staticTile.setScale(1.5, 1.25);

    this.staticTile.mask = new Display.Masks.BitmapMask(this, this.baddy);
    this.staticTile.setAlpha(0.55);

    // Camera controls
    this.cameras.main.setZoom(2);
  }

  update(time: number, delta: number) {
    return;
  }

  

}

export default GameScene;