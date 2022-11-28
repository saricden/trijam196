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

    this.load.spritesheet('static', '/static-sheet.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('player', '/AnimationSheet_Character.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.audio('ost-loop', '/ost.mp3');
  }

  create() {
    this.anims.create({
      key: 'baddy-run',
      frames: this.anims.generateFrameNumbers('baddy', {
        start: 0,
        end: 7
      }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'static-flicker',
      frames: this.anims.generateFrameNumbers('static', {
        start: 0,
        end: 3
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'player-run',
      frames: this.anims.generateFrameNumbers('player', { 
        start: 24, 
        end: 32
      }),
      frameRate: 12,
      repeat: -1
    })

    this.scene.start('scene-game');
  }
}

export default BootScene;