import { Scene } from "phaser";

class BootScene extends Scene {
  constructor() {
    super('scene-preloader');
  }

  preload() {
    this.load.spritesheet('baddy', '/baddy.png', {
      frameWidth: 150,
      frameHeight: 150
    });
  }

  create() {
    // TODO: Create animation for baddy sheet

    this.scene.start('scene-game');
  }
}

export default BootScene;